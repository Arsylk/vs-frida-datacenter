import { Classes, ClassesString, Text } from '@clockwork/common';
import { Color, subLogger } from '@clockwork/logging';
import type { JavaMethod } from './javaMethod.js';
import { JNIEnvInterceptorARM64 } from './jniEnvInterceptorArm64.js';
import { JNIMethod } from './jniMethod.js';
import { fastpathMethod, resolveMethod } from './tracer.js';
import { asFunction, JNI } from './jni.js';
const logger = subLogger('jnitrace');
const { black, blue, dim, redBright, yellow } = Color.use();

const PrimitiveNumberTypes = ['double', 'float', 'int', 'long', 'short'];

// TODO fix all of this
let IF_CHECK = (thisRef: InvocationContext): boolean => false;

function ColorMethod(jMethodId: NativePointer, method: JavaMethod): string {
    let sb = '';
    sb += redBright(`${jMethodId} -${dim('>')}`);
    sb += Color.className(method.className);
    sb += '::';
    sb += Color.method(method.name);
    sb += Color.bracket('(');
    sb += method.javaParams.map(Color.className).join(', ');
    sb += Color.bracket(')');
    sb += ': ';
    sb += Color.className(method.javaRet);

    return sb;
}

function ColorMethodInvoke(method: JavaMethod, args: string[]): string {
    let sb = '';
    sb += dim('call');
    sb += ' ';
    sb += Color.className(method.className);
    sb += '::';
    sb += Color.method(method.name);
    sb += Color.bracket('(');
    if (args.length > 0) {
        sb += '\n';
        sb += args.map((arg) => `    ${arg}`).join(', \n');
        sb += '\n';
    }
    sb += Color.bracket(')');
    sb += ': ';
    sb += Color.className(method.javaRet);

    return sb;
}

function hookIf<T>(
    callback: (this: InvocationContext, args: T) => string | null | undefined,
    tag?: string,
): (this: InvocationContext, args: T) => void {
    return function (this: InvocationContext, args: T) {
        if (!IF_CHECK(this)) return;
        const msg = callback.call(this, args);
        if (!msg) return;
        console.log(`[${tag}]`, msg, DebugSymbol.fromAddress(this.returnAddress));
    };
}

function hookIfTag<T extends InvocationArguments | InvocationReturnValue>(
    tag: string,
    callback: (this: InvocationContext, args: T) => string | null | undefined,
) {
    return hookIf(callback, dim(tag));
}

function formatCallMethod(
    nativeName: string,
    jMethodId: NativePointer,
    method: JavaMethod | null,
    args: NativeFunctionArgumentValue[] | null,
): string | null {
    if (!method) return null; // ! TODO fix
    if (args) {
        const mappedArgs: string[] = [];
        for (const i in method.parameters) {
            const param = method.parameters[i];
            const arg = args[i];
            mappedArgs.push(`${arg}`);

            if (arg === undefined) {
                mappedArgs[i] = Color.number(null);
                continue;
            }

            if (Object.hasOwn(arg as object, '$h') && param === ClassesString.String && arg instanceof NativePointer) {
                const wrapped = Java.cast(arg, Classes.String);
                mappedArgs[i] = Color.string(wrapped);
                continue;
            }

            if (param === 'boolean') {
                const textBoolean = args[i] ? 'true' : 'false';
                mappedArgs[i] = Color.number(textBoolean);
                continue;
            }

            if (param in PrimitiveNumberTypes) {
                mappedArgs[i] = Color.number(args[i]);
                continue;
            }

            if (arg instanceof NativePointer && (args[i] as NativePointer)?.isNull()) {
                mappedArgs[i] = Color.number(null);
                continue;
            }

            try {
                const wrapped = Java.cast(args[i] as NativePointerValue | Java.Wrapper, Classes.Object);
                //@ts-ignore
                mappedArgs[i] = Classes.String.valueOf(wrapped);
            } catch (e) {}
        }

        return ColorMethodInvoke(method, mappedArgs);
    }
    return null;
}

function formatMethodReturn(value: NativePointer | null): string | null {
    // ! end the suffering, refactor this
    let text = `${value}`;
    if (value && !value.isNull())
        try {
            // ? do not ask, i have no idea why this prevents crashes
            String(value) + String(value.readByteArray(8));
            const wrapped = Java.cast(value as NativePointer, Classes.Object);
            //@ts-ignore
            text = Classes.String.valueOf(wrapped);
            if (text === `${value}`) text = Color.string(text);
        } catch (err) {
            logger.error(err);
        }
    let type = null; // Java.vm.tryGetEnv()?.getObjectClassName(value);
    if (value && !value.isNull() && type && (type = Text.toPrettyType(type))) {
        if (type === Classes.String.$className) {
            text = yellow(`"${Java.cast(value, Classes.String)}"`);
        } else if (type.includes('.')) {
            text = `${Java.cast(value, Classes.Object)}`;
        }
    }
    return `${dim('return')} ${text}`;
}

/*
GetFieldID is at  0xe39b87c5 _ZN3art3JNI10GetFieldIDEP7_JNIEnvP7_jclassPKcS6_
GetMethodID is at  0xe39a1a19 _ZN3art3JNI11GetMethodIDEP7_JNIEnvP7_jclassPKcS6_
NewStringUTF is at  0xe39cff25 _ZN3art3JNI12NewStringUTFEP7_JNIEnvPKc
RegisterNatives is at  0xe39e08fd _ZN3art3JNI15RegisterNativesEP7_JNIEnvP7_jclassPK15JNINativeMethodi
GetStaticFieldID is at  0xe39c9635 _ZN3art3JNI16GetStaticFieldIDEP7_JNIEnvP7_jclassPKcS6_
GetStaticMethodID is at  0xe39be0ed _ZN3art3JNI17GetStaticMethodIDEP7_JNIEnvP7_jclassPKcS6_
GetStringUTFChars is at  0xe39d06e5 _ZN3art3JNI17GetStringUTFCharsEP7_JNIEnvP8_jstringPh
DefineClass is at 0x????????
FindClass is at  0xe399ae5d _ZN3art3JNI9FindClassEP7_JNIEnvPKc
*/

function hookLibart(predicate: (thisRef: InvocationContext) => boolean) {
    IF_CHECK = predicate;
    const libart = Process.getModuleByName('libart.so');
    const symbols = libart.enumerateSymbols();
    const jniInterceptor = new JNIEnvInterceptorARM64();

    let addrGetStringUTFChars: NativePointer | null = null;
    let addrNewStringUTF: NativePointer | null = null;
    const addrsDefineClass: NativePointer[] = [];
    let addrFindClass: NativePointer | null = null;
    let addrGetMethodID: NativePointer | null = null;
    let addrGetStaticMethodID: NativePointer | null = null;
    let addrGetFieldID: NativePointer | null = null;
    let addrGetStaticFieldID: NativePointer | null = null;
    let addrRegisterNatives: NativePointer | null = null;
    const addrsCallStatic: JNIMethod[] = [];
    const addrsCallNonvirtual: JNIMethod[] = [];
    const addrsCallMethod: JNIMethod[] = [];
    const addrsNewObject: JNIMethod[] = [];
    let ToReflectedMethod: NativeFunction<NativePointer, [NativePointerValue, NativePointerValue, NativePointerValue, number]> | null =
        null;
    // let GetMethodID: NativeFunction<NativePointer, [NativePointerValue, NativePointerValue, NativePointerValue, NativePointerValue]> | null = null;

    for (const { name, address } of symbols) {
        if (name.includes('art') && name.includes('JNI') && name.includes('_ZN3art3JNIILb0') && !name.includes('CheckJNI')) {
            if (name.includes('GetStringUTFChars')) {
                addrGetStringUTFChars = address;
                logger.trace(`GetStringUTFChars is at ${name} ${address}`);
            } else if (name.includes('NewStringUTF')) {
                addrNewStringUTF = address;
                logger.trace(`NewStringUTF is at ${name} ${address}`);
            } else if (name.includes('DefineClass')) {
                addrsDefineClass.push(address);
                logger.trace(`DefineClass is at ${name} ${address}`);
            } else if (name.includes('FindClass')) {
                addrFindClass = address;
                logger.trace(`FindClass is at ${name} ${address}`);
            } else if (name.includes('GetMethodID')) {
                addrGetMethodID = address;
                logger.trace(`GetMethodID is at ${name} ${address}`);
            } else if (name.includes('GetStaticMethodID')) {
                addrGetStaticMethodID = address;
                logger.trace(`GetStaticMethodID is at ${name} ${address}`);
            } else if (name.includes('GetFieldID')) {
                addrGetFieldID = address;
                logger.trace(`GetFieldID is at ${name} ${address}`);
            } else if (name.includes('GetStaticFieldID')) {
                addrGetStaticFieldID = address;
                logger.trace(`GetStaticFieldID is at ${name} ${address}`);
            } else if (name.includes('RegisterNatives')) {
                addrRegisterNatives = address;
                logger.trace(`RegisterNatives is at ${name} ${address}`);
            } else if (name.includes('NewObject')) {
                addrsNewObject.push(new JNIMethod(name, address));
                logger.trace(`NewObject is at ${name} ${address}`);
            } else if (name.includes('CallStatic')) {
                addrsCallStatic.push(new JNIMethod(name, address));
                logger.trace(`CallStatic is at ${name} ${address}`);
            } else if (name.includes('CallNonvirtual')) {
                addrsCallNonvirtual.push(new JNIMethod(name, address));
                logger.trace(`CallNonvirtual is at ${name} ${address}`);
            } else if (name.includes('Call') && name.includes('Method')) {
                addrsCallMethod.push(new JNIMethod(name, address));
                logger.trace(`Call<>Method is at ${name} ${address}`);
            } else if (name.includes('ToReflectedMethod')) {
                ToReflectedMethod = new NativeFunction(address, 'pointer', ['pointer', 'pointer', 'pointer', 'uint8']);
                logger.trace(`ToReflectedMethod is at ${name} ${address}`);
            } else if (name.includes('GetArrayLength')) {
                // Interceptor.attach(address, {
                //     onLeave: hookIfTag('GetArrayLength', (retval) => `${retval}`),
                // });
            } else if (name.includes('SetByteArrayRegion')) {
                // Interceptor.attach(address, {
                //     onLeave: hookIfTag('SetByteArrayRegion', (retval) => `${retval}`),
                // });
            } else if (name.includes('NewObjectArray')) {
                // Interceptor.attach(address, {
                //     onLeave: hookIfTag('NewObjectArray', (retval) => `${retval}`),
                // });
            } else if (name.includes('SetObjectArrayElement')) {
                // Interceptor.attach(address, {
                //     onEnter: hookIfTag('SetObjectArrayElement', (args) => `${args[2]} -> ${args[3]}`),
                // });
            } else if (name.includes('ReleaseByteArrayElements')) {
                // Interceptor.attach(address, {
                //     onEnter: hookIfTag('ReleaseByteArrayElements', (args) => `${args[2]} -> ${args[3]}`),
                // });
            } else if (name.includes('GetByteArrayElements')) {
                // Interceptor.attach(address, {
                //     onLeave: hookIfTag('GetByteArrayElements', (retval) => `${retval}, ${retval.readByteArray(32)}`),
                // });
            }
        }
    }

    addrGetStringUTFChars &&
        Interceptor.attach(addrGetStringUTFChars, {
            // std::tuple< UniqueStringUTFChars, bool > 	GetStringUTFChars (JNIEnv &env, jstring &string)
            onLeave: hookIfTag('GetStringUTFChars', (retval) => Color.string(retval.readCString())),
        });
    addrNewStringUTF &&
        Interceptor.attach(addrNewStringUTF, {
            // jstring & 	NewStringUTF (JNIEnv &env, const char *bytes)
            onEnter: hookIfTag('NewStringUTF', (args) => {
                const string = args[1].readCString();
                switch (string) {
                    case 'com/cocos/lib/CocosHelper':
                    case 'org/cocos2dx/lib/CanvasRenderingContext2DImpl':
                    case 'com/cocos/lib/CanvasRenderingContext2DImpl':
                        return;
                }
                return Color.string(string);
            }),
        });

    for (const addres of addrsDefineClass) {
        Interceptor.attach(addres, {
            // jclass & 	DefineClass (JNIEnv &env, const char *name, jobject &loader, const jbyte *buf, jsize size)
            // auto 	DefineClass (JNIEnv &env, const char *name, jobject &loader, const Array &buf) -> std::enable_if_t< IsArraylike< Array >::value, jclass & >
            onEnter: hookIfTag('DefineClass', (args) => args[1].readCString()),
        });
    }

    addrFindClass &&
        Interceptor.attach(addrFindClass, {
            // jclass & 	FindClass (JNIEnv &env, const char *name)
            onEnter: hookIfTag('FindClass', (args) => {
                const className = args[1].readCString();
                if (className === 'com/cocos/lib/CocosHelper') return;
                return className;
            }),
        });

    const getMethodId = (isStatic: boolean) => {
        // jmethodID       GetMethodID(JNIEnv *env, jclass clazz, const char *name, const char *sig);
        // jmethodID GetStaticMethodID(JNIEnv *env, jclass clazz, const char *name, const char *sig);
        return {
            onEnter(this: InvocationContext, args: InvocationArguments) {
                this.env = args[0];
                this.clazz = args[1];
                this.name = args[2]?.readCString();
                this.sig = args[3]?.readCString();
            },
            onLeave: hookIfTag<InvocationReturnValue>(`Get${isStatic ? 'Static' : ''}MethodID`, function (retval) {
                // return `missing args [ env: ${this.env} clazz: ${this.clazz} name: ${this.name} sig: ${this.sig} ]`

                const className = Java.vm.tryGetEnv()?.getClassName(this.clazz);
                if (
                    className === 'com.cocos.lib.CocosHelper' &&
                    (this.name === 'flushTasksOnGameThreadAtForeground' || this.name === 'flushTasksOnGameThread')
                ) {
                    return;
                }
                if (className?.endsWith('lib.CanvasRenderingContext2DImpl')) {
                    return;
                    switch (this.name) {
                        case 'measureText':
                        case 'setLineJoin':
                        case 'getDataRef':
                        case 'setFillStyle':
                        case 'updateFont':
                        case 'setStrokeStyle':
                        case 'setTextAlign':
                        case 'setTextBaseline':
                            return;
                    }
                    return;
                }
                const method = fastpathMethod(retval, className, this.name, this.sig, isStatic);
                return ColorMethod(retval, method);
            }),
        };
    };
    addrGetMethodID && Interceptor.attach(addrGetMethodID, getMethodId(false));
    addrGetStaticMethodID && Interceptor.attach(addrGetStaticMethodID, getMethodId(true));

    // addrGetFieldID &&
    //     Interceptor.attach(addrGetFieldID, {
    //         // jfieldID & 	GetFieldID (JNIEnv &env, jclass &clazz, const char *name, const char *sig)
    //         onEnter: hookIfTag('GetFieldID', (args) => {
    //             if (args[2] === null) return null;

    //             const clazz = args[1];
    //             const name = args[2].readCString();
    //             const className = Java.vm.tryGetEnv().getClassName(clazz);
    //             const sig = args[3].readCString();
    //             return `${className}::${name}${sig}`;
    //         }),
    //     });
    // addrGetStaticFieldID &&
    //     Interceptor.attach(addrGetStaticFieldID, {
    //         // jfieldID & 	GetStaticFieldID (JNIEnv &env, jclass &clazz, const char *name, const char *sig)
    //         onEnter: hookIfTag('GetStaticFieldID', (args) => {
    //             if (args[2] === null) return null;

    //             const clazz = args[1];
    //             const name = args[2].readCString();
    //             const className = Java.vm.tryGetEnv().getClassName(clazz);
    //             const sig = args[3].readCString();
    //             return `${className}::${name}${sig}`;
    //         }),
    //     });
    for (const { address, name } of addrsNewObject) {
        Interceptor.attach(address, {
            onEnter: hookIfTag('NewObject', function (rawargs) {
                const env = rawargs[0];
                const jclass = rawargs[1];
                const jMethodId = rawargs[2];
                const args = rawargs[3];
                const method = (this.method = resolveMethod(env, jclass, jMethodId, true));
                const callArgs = jniInterceptor.getCallMethodArgs(name, [env, jclass, jMethodId, args], method);
                const result = formatCallMethod(name, jMethodId, method, callArgs);

                return result;
            }),
        });
    }

    for (const { address, name } of addrsCallStatic) {
        Interceptor.attach(address, {
            // std::enable_if_t<!std::is_void< R >::value, R > 	CallStaticMethod (JNIEnv &env, jclass &clazz, jmethodID &method, Args &&... args)
            onEnter: hookIfTag('CallStatic', function (rawargs) {
                const env = rawargs[0];
                const jclass = rawargs[1];
                const jMethodId = rawargs[2];
                const args = rawargs[3];
                const method = (this.method = resolveMethod(env, jclass, jMethodId, true));
                const callArgs = jniInterceptor.getCallMethodArgs(name, [env, jclass, jMethodId, args], method);
                const result = formatCallMethod(name, jMethodId, method, callArgs);
                if (result?.includes('CocosHelper') && result?.includes('flushTasksOnGameThread')) {
                    return;
                }
                return result;
            }),
            onLeave: hookIfTag('CallStatic', function (retval) {
                if (!this.method || this.method.isVoid) return;
                return formatMethodReturn(retval);
            }),
        });
    }
    for (const { address, name } of addrsCallNonvirtual) {
        Interceptor.attach(address, {
            // std::enable_if_t< std::is_void< R >::value, R > 	CallNonvirtualMethod (JNIEnv &env, jobject *obj, jclass &clazz, jmethodID &method, Args &&... args)
            onEnter: hookIfTag('CallNonvirtual', function (rawargs) {
                const env = rawargs[0];
                const jobject = rawargs[1];
                const jclass = rawargs[2];
                const jMethodId = rawargs[3];
                const args = rawargs[4];
                const method = (this.method = resolveMethod(env, jclass, jMethodId, false));
                const callArgs = jniInterceptor.getCallMethodArgs(name, [env, jobject, jclass, jMethodId, args], method);
                return formatCallMethod(name, jMethodId, method, callArgs);
            }),
            onLeave: hookIfTag('CallNonvirtual', function (retval) {
                if (this.method?.isVoid) return;
                return formatMethodReturn(retval);
            }),
        });
    }

    for (const { address, name } of addrsCallMethod) {
        const namePtr = Memory.allocUtf8String(name);
        const tag = Libc.__cxa_demangle(namePtr, NULL, NULL, NULL).readCString() ?? name;
        
        Interceptor.attach(address, {
            // std::enable_if_t<!std::is_void< R >::value, R > 	CallMethod (JNIEnv &env, jobject *obj, jmethodID &method, Args &&... args)
            onEnter: hookIfTag(tag, function (rawargs) {
                const env = rawargs[0];
                const jobject = rawargs[1];
                const jMethodId = rawargs[2];
                const args = rawargs[3];
                const method = resolveMethod(env, jobject, jMethodId, false);
                const callArgs = jniInterceptor.getCallMethodArgs(name, [env, jobject, jMethodId, args], method);

                // TODO this logging api
                // const cn = Java.vm.tryGetEnv().getObjectClassName(jobject);
                // if (cn.includes('.')) oiai{
                //     const str = Java.cast(jobject, Java.use('java.lang.Object'));
                //     console.warn(str['toString']());
                // }
                const result = formatCallMethod(name, jMethodId, method, callArgs);
                if (result?.includes('ClassLoader') && result?.includes('loadClass')) {
                    if (
                        result?.includes('com/cocos/lib/CocosHelper') ||
                        result?.includes('org/cocos2dx/lib/CanvasRenderingContext2DImpl') ||
                        result?.includes('com/cocos/lib/CanvasRenderingContext2DImpl')
                    ) {
                        this.ignore = true;
                        return;
                    }
                }
                if (
                    (result?.includes('UnityPlayer') && result?.includes('executeMainThreadJobs')) ||
                    (result?.includes('Choreographer') && result?.includes('postFrameCallback'))
                ) {
                    this.ignore = true;
                    return;
                }
                if (result?.includes('longValue') && `${DebugSymbol.fromAddress(this.returnAddress)}`?.includes('libunity.so')) {
                    this.ignore = true;
                    return;
                }
                if (
                    (this.method?.className === 'android.media.AudioDeviceInfo' ||
                        this.method?.className === 'android.media.AudioManager' ||
                        this.method?.className === 'android.view.MotionEvent') &&
                    `${DebugSymbol.fromAddress(this.returnAddress)}`?.includes('libunity.so')
                ) {
                    this.ignore = true;
                    return;
                }

                return result;
            }),
            onLeave: hookIfTag(tag, function (retval) {
                if (this.method?.isVoid) return;
                if (this.ignore) return;
                return formatMethodReturn(retval);
            }),
        });
    }
}

export { hookLibart as attach };
