import { Classes, ClassesString, Std, enumerateMembers, findClass } from '@clockwork/common';
import { JavaMethod } from './javaMethod.js';
import { JNI, asFunction, type jclass, type jMethodID } from './jni.js';

const Cache = {
    storage: new Map<string, JavaMethod>(),
    staticStorage: new Map<string, JavaMethod>(),
    get(jMethodId: jMethodID, isStatic: boolean): JavaMethod | null {
        const key = typeof jMethodId === 'string' ? jMethodId : jMethodId.toString();
        return (isStatic ? this.staticStorage : this.storage).get(key) ?? null;
    },
    set(jMethodId: jMethodID, method: JavaMethod): JavaMethod {
        const key = typeof jMethodId === 'string' ? jMethodId : jMethodId.toString();
        (method.isStatic ? this.staticStorage : this.storage).set(key, method);
        return method;
    },
};

const cachedBase: NativePointer | null = null;
let FindClass: NativeFunction<any, any> | null = null;
let ToReflectedMethod: any = null;
let getDeclaringClassDesc: NativeFunction<any, any> | null = null;
const PrimitiveTypes: { [key: string]: string } = {
    Z: 'boolean',
    B: 'byte',
    C: 'char',
    D: 'double',
    F: 'float',
    I: 'int',
    J: 'long',
    S: 'short',
    V: 'void',
};

function prettyMethod(methodId: NativePointer, withSignature: boolean) {
    const result = new Std.String();
    //@ts-ignore
    Java.api['art::ArtMethod::PrettyMethod'](result, methodId, withSignature ? 1 : 0);
    return result.disposeToString();
}

function resolveMethod(
    env: NativePointer,
    clazz: jclass,
    methodID: jMethodID,
    isStatic: boolean,
): JavaMethod | null {
    let method = Cache.get(methodID, isStatic);
    if (method) return method;

    // fallback to frida getEnv()
    env ??= Java.vm.tryGetEnv()?.handle;
    if (!env) return null;

    if (FindClass === null && env) FindClass = asFunction(env, JNI.FindClass);
    if (ToReflectedMethod === null && env) ToReflectedMethod = asFunction(env, JNI.ToReflectedMethod);

    if (ToReflectedMethod) {
        const jniMethod = ToReflectedMethod(env, clazz, methodID, isStatic ? 1 : 0);
        const javaExecutable = Java.cast(jniMethod, Classes.Executable);

        const name: string = javaExecutable.getName();
        const declaringClass: Java.Wrapper = javaExecutable.getDeclaringClass();
        const parameterTypes: Java.Wrapper[] = javaExecutable.getParameterTypes();
        const declaringClassType: string = declaringClass.getTypeName();

        let returnTypeName: string = declaringClassType;
        if (javaExecutable.$className === ClassesString.Method) {
            const javaMethod = Java.cast(javaExecutable, Classes.Method);
            const returnType = javaMethod.getReturnType();
            returnTypeName = returnType.getTypeName();
            returnType.$dispose();
        }

        const method = new JavaMethod(
            declaringClassType,
            name,
            parameterTypes.map((x) => x.getTypeName()),
            returnTypeName,
            isStatic,
        );

        declaringClass.$dispose();
        for (const parameterType of parameterTypes) {
            parameterType.$dispose();
        }

        return Cache.set(methodID, method);
    }

    if (getDeclaringClassDesc === null) {
        // const getDeclaringClassDescSym = Process.getModuleByName('libart.so')
        //     .enumerateSymbols()
        //     .filter((x) => x.name.includes('DeclaringClassDesc'))[0];
        const getDeclaringClassDescSym = new ApiResolver('module')?.enumerateMatches(
            'exports:libart.so!*DeclaringClassDesc*',
        )?.[0];
        if (!getDeclaringClassDescSym) return null;
        getDeclaringClassDesc = new NativeFunction(getDeclaringClassDescSym.address, 'pointer', ['pointer'], {
            exceptions: 'propagate',
        });
    }

    const thisSigPtr: NativePointer = getDeclaringClassDesc(methodID);
    let thisSig = thisSigPtr.readCString();
    thisSig =
        thisSig?.startsWith('L') && thisSig.endsWith(';')
            ? thisSig.substring(1, thisSig.length - 1)
            : thisSig;
    thisSig = thisSig?.replaceAll('/', '.') ?? thisSig;
    const cls = thisSig ? findClass(thisSig) : null;
    if (!thisSig || !cls) return null;

    let matched: Java.Wrapper | null = null;
    enumerateMembers(cls, {
        onMatchMethod(clazz, member) {
            for (const overload of clazz[member]._o) {
                if (`${overload.handle}` === `${methodID}`) {
                    matched = overload;
                    method = new JavaMethod(
                        thisSig ?? '',
                        member,
                        overload.argumentTypes.map((x: any) => x.className),
                        overload.returnType.className,
                        isStatic,
                    );
                    return Cache.set(methodID, method);
                }
            }
        },
    });
    return null;
}

function fastpathMethod(
    methodId: jMethodID,
    className: string,
    name: string,
    sig: string,
    isStatic: boolean,
) {
    const txt = sig;

    let isArray = false;
    let isOpen: number | null = null;
    const arr: string[] = [];
    const adder = (raw: string) => {
        if (raw.length === 1) {
            raw = PrimitiveTypes[raw];
        } else {
            raw = raw.replaceAll('/', '.');
        }
        raw = isArray ? `${raw}[]` : raw;
        isArray = false;
        arr.push(raw);
    };

    for (let i = 0; i < txt.length; i++) {
        const c = txt.charAt(i);
        if (c === '[') {
            isArray = true;
            continue;
        }
        if (!isOpen && c === 'L') {
            isOpen = i + 1;
            continue;
        }
        if (isOpen && c === ';') {
            adder(txt.substring(isOpen, i));
            isOpen = null;
            continue;
        }
        if (!isOpen && c in PrimitiveTypes) {
            adder(c);
        }
    }

    const ret = arr.pop() ?? 'void';
    const method = new JavaMethod(className, name, arr, ret, isStatic);
    return Cache.set(methodId, method);
}

let thunkPage: NativePointer | null = null;
let thunkOffset: NativePointer;
function makeThunk(size: number, write: (writer: Arm64Writer) => void) {
    if (!thunkPage) {
        thunkPage = Memory.alloc(Process.pageSize);
    }

    const thunk = thunkPage.add(thunkOffset);

    const arch = Process.arch;

    const Writer = Arm64Writer;
    Memory.patchCode(thunk, size, (code) => {
        const writer = new Writer(code, { pc: thunk });
        write(writer);
        writer.flush();
        if (writer.offset > size) {
            throw new Error(`Wrote ${writer.offset}, exceeding maximum of ${size}`);
        }
    });

    thunkOffset.add(size);

    return arch === 'arm' ? thunk.or(1) : thunk;
}

function makeCxxMethodWrapperReturningStdStringByValue(impl: any, argTypes: any) {
    const thunk = makeThunk(32, (writer: Arm64Writer) => {
        writer.putMovRegReg('x8', 'x0');
        argTypes.forEach((t: any, i: number) => {
            writer.putMovRegReg(`x${i}` as any, `x${i + 1}` as any);
        });
        writer.putLdrRegAddress('x7', impl);
        writer.putBrReg('x7');
    });

    const invokeThunk = new NativeFunction(
        thunk,
        'void',
        ['pointer'].concat(argTypes) as NativeFunctionArgumentType[],
        {
            exceptions: 'propagate',
        },
    );
    const wrapper = (...args: NativeFunctionArgumentValue[]) => {
        //@ts-ignore
        invokeThunk(...args);
    };
    wrapper.handle = thunk;
    wrapper.impl = impl;
    return wrapper;
}

function makeCxxMethodWrapperReturningPointerByValueGeneric(
    address: NativePointer,
    argTypes: NativeFunctionArgumentType[],
) {
    return new NativeFunction(address, 'pointer', argTypes, {
        exceptions: 'propagate',
    });
}

function atleasttry() {
    // resolveMethod(Classes.String.concat.handle, false);
    // const base = Java.vm.getEnv().handle.readPointer();
    // const GetMethodID = asFunction(base, 'GetMethodID');
    // console.warn('GetMethodID', GetMethodID);
    // Interceptor.attach(GetMethodID, {
    //     onEnter(args) {},
    //     onLeave(retval) {
    //         //console.log('on methodId', retval);
    //     },
    // });
    // const RegisterNatives = asFunction(base, 'RegisterNatives');
    // console.warn('RegisterNatives', RegisterNatives);
    // Interceptor.attach(RegisterNatives, {
    //     onEnter(args) {},
    //     onLeave(retval) {
    //         console.log('on RegisterNatives', retval);
    //     },
    // });

    // const FindClass = asFunction(base, 'FindClass');
    // const ToReflectedMethod = asFunction(base, 'ToReflectedMethod');

    // // methodId -> char *
    // const getDeclaringClassDesc = Process.getModuleByName('libart.so')
    //     .enumerateSymbols()
    //     .filter((x) => x.name.includes('DeclaringClassDesc'))[0];
    // const decClassDesc = makeCxxMethodWrapperReturningPointerByValueGeneric(getDeclaringClassDesc.address, ['pointer']);
    // // // methodId -> char *
    // const getSignatureSym = Process.getModuleByName('libart.so')
    //     .enumerateSymbols()
    //     .filter((x) => x.name.includes('_ZN3art9ArtMethod12GetSignatureEv'))[0];
    // const getSignature = makeCxxMethodWrapperReturningPointerByValueGeneric(getSignatureSym.address, ['pointer']);

    // const signatureToStringSym = Process.getModuleByName('libart.so')
    //     .enumerateSymbols()
    //     .filter((x) => x.name.includes('_ZNK3art9Signature8ToStringEv'))[0];
    // const sigToStr = makeCxxMethodWrapperReturningStdStringByValue(signatureToStringSym.address, ['pointer']);

    // (rpc as any).decClassDesc = decClassDesc;
    // (rpc as any).getSignature = getSignature;
    // (rpc as any).prettyMethod = prettyMethod;
    // (rpc as any).sigToStr = sigToStr;

    const cleanup = (str: string) => {
        str = str.startsWith('L') && str.endsWith(';') ? str.substring(1, str.length - 1) : str;
        return str.replaceAll('/', '.');
    };
    // console.warn('begin:', (w = Java.use('java.lang.String')));
    // console.warn('begin:', (w = w.substring._o[1]));
    // console.warn('begin:', (h = w.handle));
    // console.warn('begin:', (w = (decClassDesc as any)(h)));
    // console.warn('begin:', (w = w.readCString()));
    // console.warn('begin:', (w = Memory.allocUtf8String(cleanup(w))));
    // console.warn('begin:', w.readCString());
    // console.warn('begin:', (w = (FindClass as any)(Java.vm.getEnv(), w)));
    // console.warn('begin:', (w = (ToReflectedMethod as any)(Java.vm.getEnv(), w, h, 0)));
    // console.warn('begin:', (w = (ToReflectedMethod as any)(Java.vm.getEnv(), w, h, 1)));
    // console.warn('begin:', (w = Java.cast(w, Java.use('java.lang.reflect.Method'))))_;
    // console.warn('begin:', w = (getSignature as any)(h))
    // console.warn('begin:', w = (sigToStr as any)(w))
}
export { fastpathMethod, resolveMethod };
