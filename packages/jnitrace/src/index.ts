import { Classes, ClassesString, Text, vs } from '@clockwork/common';
import { FilterJni } from '@clockwork/hooks';
import { Color, subLogger } from '@clockwork/logging';
import * as Native from '@clockwork/native';
import { EnvWrapper, type MinimumJNI } from './envWrapper.js';
import type { JavaMethod } from './javaMethod.js';
import { JNI, asFunction } from './jni.js';
import { JNIEnvInterceptorARM64 } from './jniEnvInterceptorArm64.js';
import { JniInvokeCallbacks, JniInvokeMode, LimitedCallback } from './jniInvokeCallback.js';
import { JNIMethod } from './jniMethod.js';
import { fastpathMethod, resolveMethod, signatureToPrettyTypes } from './tracer.js';
const logger = subLogger('jnitrace');
const { black, gray, dim, redBright, magenta } = Color.use();

const PrimitiveNumberTypes = ['double', 'float', 'int', 'long', 'short'];
Native.*Utils.dir();

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

function formatNativeValue(value: NativePointer, type?: string) {
    let text: string | null = null;

    // * anti crashes yey
    if (value !== null && value !== undefined) {
        try {
            // handle primitive types
            switch (type) {
                case 'boolean':
                    text = Color.number(value ? 'true' : 'false');
                    break;
                case 'int': {
                    //@ts-ignore
                    const strInt = Classes.String.valueOf.overload('int').bind(Classes.String);
                    text = Color.number(strInt(value));
                    break;
                }
                case 'float': {
                    //@ts-ignore
                    const strFloat = Classes.String.valueOf.overload('float').bind(Classes.String);
                    text = Color.number(strFloat(value));
                    break;
                }
                case 'double': {
                    //@ts-ignore
                    const strDoubke = Classes.String.valueOf.overload('double').bind(Classes.String);
                    text = Color.number(strDoubke(value));
                    break;
                }
                case 'long':
                    text = Color.number(`${new Int64(value.toString())}`);
                    break;
            }

            if (text !== null) {
                return text;
            }

            // ? do not ask, i have no idea why this prevents crashes
            String(value) + String(value.readByteArray(8));

            if (type === ClassesString.String) {
                const str = Java.cast(value, Classes.String);
                text = Color.string(str);
            } else if (type?.endsWith('[]')) {
                const any = Java.cast(value, Classes.Object);
                const className = any.$className.endsWith(';') ? '[Ljava.lang.Object;' : any.$className;
                const real = Java.cast(value, Java.use(className));
                //@ts-expect-error
                const array = Classes.Arrays.toString.overload(className).call(Classes.Arrays, real);
                return array;
            } else {
                const any = Java.cast(value, Classes.Object);
                //@ts-ignore
                text = Classes.String.valueOf(any);
            }
        } catch (e: any) {
            return black(
                `${e.message}${black('<')}${dim(`${value}`)}${black('>')}${black(`${type}:${typeof value}`)}`,
            );
        }
    } else {
        text = `${Color.number(`${value}`)} ${black(`${type}`)}`;
    }
    // * help
    return (text ??= `ripme: ${value}`);
}

function formatCallMethod(
    nativeName: string,
    jMethodId: NativePointer,
    method: JavaMethod | null,
    args: NativeCallbackArgumentValue[] | null,
    log = false,
): string | null {
    // better than nothing ...
    if (!method || args?.length === undefined) {
        return `${nativeName}::${jMethodId}()`;
    }

    // colorful mapping flow
    const mappedArgs = new Array<string>(method.parameters.length);
    for (const i in method.parameters) {
        const param = method.parameters[i];
        const arg = args[i];
        mappedArgs[i] = vs(arg, param);
    }
    return ColorMethodInvoke(method, mappedArgs);
}

function formatMethodReturn(value: any, type?: string): string | null {
    const text = formatNativeValue(value, type);

    return `${dim('return')} ${text}`; // + `${type}[${value}: ${typeof value}]`;
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

let envWrapper: EnvWrapper;

function hookLibart(predicate: (thisRef: InvocationContext) => boolean) {
    envWrapper ??= new EnvWrapper(Java.vm.getEnv());
    IF_CHECK = predicate;
    const libart = Process.getModuleByName('libart.so');
    const symbols = libart.enumerateSymbols();
    const jniInterceptor = new JNIEnvInterceptorARM64();

    const fn = (arg: MinimumJNI) => envWrapper.getFunction(arg);
    let addrGetStringUTFChars: NativePointer | null = fn(JNI.GetStringUTFChars);
    let addrNewStringUTF: NativePointer | null = fn(JNI.NewStringUTF);
    const addrsDefineClass: NativePointer[] = [fn(JNI.DefineClass)];
    let addrFindClass: NativePointer | null = fn(JNI.FindClass);
    let addrGetMethodID: NativePointer | null = fn(JNI.GetMethodID);
    let addrGetStaticMethodID: NativePointer | null = fn(JNI.GetStaticMethodID);
    let addrGetFieldID: NativePointer | null = fn(JNI.GetFieldID);
    let addrGetStaticFieldID: NativePointer | null = fn(JNI.GetStaticFieldID);
    let addrRegisterNatives: NativePointer | null = fn(JNI.RegisterNatives);
    const addrNewGlobalRef: NativePointer | null = fn(JNI.NewGlobalRef);
    const addrsCallStatic: JNIMethod[] = [
        ...Object.values(JNI)
            .filter((x) => x.name.startsWith('CallStatic'))
            .map((x) => new JNIMethod(x.name, envWrapper.getFunction(x))),
    ];
    const addrsCallNonvirtual: JNIMethod[] = [
        ...Object.values(JNI)
            .filter((x) => x.name.startsWith('CallNonvirtual'))
            .map((x) => new JNIMethod(x.name, envWrapper.getFunction(x))),
    ];
    const addrsCallMethod: JNIMethod[] = [
        ...Object.values(JNI)
            .filter((x) => x.name.startsWith('CallMethod'))
            .map((x) => new JNIMethod(x.name, envWrapper.getFunction(x))),
    ];
    const addrsNewObject: JNIMethod[] = [];
    // let GetMethodID: NativeFunction<NativePointer, [NativePointerValue, NativePointerValue, NativePointerValue, NativePointerValue]> | null = null;

    for (const { name, address } of symbols) {
        if (
            name.includes('art') &&
            name.includes('JNI') &&
            name.includes('_ZN3art3JNIILb0') &&
            !name.includes('CheckJNI')
        ) {
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
            } else if (name.includes('NewObject') && !name.includes('Array')) {
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
                logger.trace(`ToReflectedMethod is at ${name} ${address}`);
            } else if (name.includes('GetArrayLength')) {
                Interceptor.attach(address, {
                    onLeave: hookIfTag('GetArrayLength', (retval) => `${retval}`),
                });
            } else if (name.includes('SetByteArrayRegion')) {
                Interceptor.attach(address, {
                    onLeave: hookIfTag('SetByteArrayRegion', (retval) => `${retval}`),
                });
            } else if (name.includes('NewObjectArray')) {
                Interceptor.attach(address, {
                    onLeave: hookIfTag('NewObjectArray', (retval) => `${retval}`),
                });
            } else if (name.includes('SetObjectArrayElement')) {
                Interceptor.attach(address, {
                    onEnter: hookIfTag('SetObjectArrayElement', (args) => `${args[2]} -> ${args[3]}`),
                });
            } else if (name.includes('ReleaseByteArrayElements')) {
                Interceptor.attach(address, {
                    onEnter: hookIfTag('ReleaseByteArrayElements', (args) => `${args[2]} -> ${args[3]}`),
                });
            } else if (name.includes('GetByteArrayElements')) {
                Interceptor.attach(address, {
                    onLeave: hookIfTag('GetByteArrayElements', (retval) => `${retval}}`),
                });
            } else if (name.includes('NewGlobalRef')) {
                // addrNewGlobalRef = address;
                logger.trace(`NewGlobalRef is at ${name} ${address}`);
            }
        }
    }

    Interceptor.attach(fn(JNI.IsSameObject), {
        onEnter(args) {
            this.a0 = args[0];
            this.a1 = args[1];
        },
        onLeave: hookIfTag<InvocationReturnValue>('IsSameObject', function (retval) {
            return `${this.a0} == ${this.a1} ? ${retval}`;
        }),
    });

    addrGetStringUTFChars &&
        Interceptor.attach(envWrapper.getFunction(JNI.GetStringUTFChars), {
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

    addrNewGlobalRef &&
        Interceptor.attach(addrNewGlobalRef, {
            onEnter(args) {
                this.env = args[0];
                this.local = args[1];
            },
            onLeave: hookIfTag('NewGlobalRef', function (retval) {
                const env: NativePointer = this.env;
                const local: NativePointer = this.local;
                if (env && local && retval && !retval.isNull() && retval !== ptr(0x0)) {
                    const getObjectClass = asFunction(env, JNI.GetObjectClass);
                    const refClass = getObjectClass(env, local);
                    const type = Text.toPrettyType(Java.cast(refClass, Classes.Class).getName());
                    const value = vs(local, type);
                    return `${Color.className(type)}: ${value}`;
                }
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
            onLeave: hookIfTag<InvocationReturnValue>(
                `Get${isStatic ? 'Static' : ''}MethodID`,
                function (retval) {
                    // return `missing args [ env: ${this.env} clazz: ${this.clazz} name: ${this.name} sig: ${this.sig} ]`

                    const className = Java.vm.tryGetEnv()?.getClassName(this.clazz);
                    if (
                        (className === 'com.cocos.lib.CocosHelper' &&
                            (this.name === 'flushTasksOnGameThreadAtForeground' ||
                                this.name === 'flushTasksOnGameThread' ||
                                (this.name === 'getSystemService' &&
                                    className === 'com.unity3d.player.UnityPlayerActivity'))) ||
                        (this.name === 'getMemoryInfo' && className === 'android.app.ActivityManager')
                    ) {
                        return;
                    }
                    if (className?.endsWith('lib.CanvasRenderingContext2DImpl')) {
                        return;
                    }
                    const method = fastpathMethod(retval, className, this.name, this.sig, isStatic);
                    return ColorMethod(retval, method);
                },
            ),
        };
    };
    addrGetMethodID && Interceptor.attach(addrGetMethodID, getMethodId(false));
    addrGetStaticMethodID && Interceptor.attach(addrGetStaticMethodID, getMethodId(true));

    const getFieldId = (isStatic: boolean) => {
        return {
            // jfieldID & 	GetFieldID       (JNIEnv &env, jclass &clazz, const char *name, const char *sig)
            // jfieldID & 	GetStaticFieldID (JNIEnv &env, jclass &clazz, const char *name, const char *sig)
            onEnter(this: InvocationContext, args: InvocationArguments) {
                this.env = args[0];
                this.clazz = args[1];
                this.name = args[2]?.readCString();
                this.sig = args[3]?.readCString();
            },
            onLeave: hookIfTag<InvocationReturnValue>(
                `Get${isStatic ? 'Static' : ''}FieldID`,
                function (retval) {
                    const name = this.name;
                    const sig = this.sig;
                    const className = Java.vm.tryGetEnv().getClassName(this.clazz);
                    const typeName = signatureToPrettyTypes(sig)?.[0] ?? `${sig}`;

                    if (className === 'android.app.ActivityManager$MemoryInfo') return;
                    if (!FilterJni.getFieldId(className, typeName, name)) return;

                    const pre = isStatic ? `${gray('static')} ` : '';
                    const id = redBright(`${retval} -${dim('>')}`);
                    return `${id}${pre}${Color.className(typeName)} ${Color.className(className)}${Color.bracket('.')}${Color.field(name)}`;
                },
            ),
        };
    };
    addrGetFieldID && Interceptor.attach(addrGetFieldID, getFieldId(false));
    addrGetStaticFieldID && Interceptor.attach(addrGetStaticFieldID, getFieldId(true));

    for (const { address, name } of addrsNewObject) {
        Interceptor.attach(
            address,
            LimitedCallback(
                function () {
                    return predicate(this);
                },
                JniInvokeCallbacks(jniInterceptor, name, JniInvokeMode.Constructor, {
                    onEnter(...args) {
                        const msg = formatCallMethod(
                            name,
                            this.methodID,
                            this.method,
                            this.jArgs ?? null,
                            true,
                        );

                        if (
                            this.name === 'android.app.ActivityManager$MemoryInfo' &&
                            this.method.name === '<init>'
                        )
                            return;
                    },
                    onLeave(retval) {},
                }),
            ),
        );
    }

    // biome-ignore lint/suspicious/noSelfCompare: <explanation>
    // biome-ignore lint/correctness/noConstantCondition: <explanation>
    // if (1 === 1) return;

    for (const { address, name } of addrsCallStatic) {
        Interceptor.attach(address, {
            // std::enable_if_t<!std::is_void< R >::value, R > 	CallStaticMethod (JNIEnv &env, jclass &clazz, jmethodID &method, Args &&... args)
            onEnter: hookIfTag('CallStatic', function (rawargs) {
                const env = rawargs[0];
                const jclass = rawargs[1];
                const jMethodId = rawargs[2];
                const args = rawargs[3];
                const method = (this.method = resolveMethod(env, jclass, jMethodId, true));
                const callArgs = jniInterceptor.getCallMethodArgs(
                    name,
                    [env, jclass, jMethodId, args],
                    method,
                );
                const result = formatCallMethod(name, jMethodId, method, callArgs);
                if (result?.includes('CocosHelper') && result?.includes('flushTasksOnGameThread')) {
                    this.ignore = true;
                    return;
                }
                if (result?.includes('System') && result?.includes('nanoTime')) {
                    this.ignore = true;
                    return;
                }
                return result;
            }),
            onLeave: hookIfTag('CallStatic', function (retval) {
                const method: JavaMethod | undefined | null = this.method;
                if (!method || method.isVoid || this.ignore) return;
                return formatMethodReturn(retval, method.returnType);
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
                const callArgs = jniInterceptor.getCallMethodArgs(
                    name,
                    [env, jobject, jclass, jMethodId, args],
                    method,
                );
                return formatCallMethod(name, jMethodId, method, callArgs);
            }),
            onLeave: hookIfTag('CallNonvirtual', function (retval) {
                const method: JavaMethod | undefined | null = this.method;
                if (method?.isVoid) return;
                return formatMethodReturn(retval, method?.returnType);
            }),
        });
    }

    for (const { address, name } of addrsCallMethod) {
        const namePtr = Memory.allocUtf8String(name);
        const tag = name;
        // Libc.__cxa_demangle(namePtr, NULL, NULL, NULL).readCString() ?? name;

        Interceptor.attach(address, {
            // std::enable_if_t<!std::is_void< R >::value, R > 	CallMethod (JNIEnv &env, jobject *obj, jmethodID &method, Args &&... args)
            onEnter: hookIfTag('CallObject', function (rawargs) {
                const env = rawargs[0];
                const jobject = rawargs[1];
                const jMethodId = rawargs[2];
                const args = rawargs[3];
                const method = (this.method = resolveMethod(env, jobject, jMethodId, false));
                const callArgs = jniInterceptor.getCallMethodArgs(
                    name,
                    [env, jobject, jMethodId, args],
                    method,
                );

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
                if (
                    result?.includes('longValue') &&
                    `${DebugSymbol.fromAddress(this.returnAddress)}`?.includes('libunity.so')
                ) {
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
            onLeave: hookIfTag('CallObject', function (retval) {
                const method: JavaMethod | undefined | null = this.method;
                if (method?.isVoid) return;
                if (this.ignore) return;
                return formatMethodReturn(retval, method?.returnType);
            }),
        });
    }
}

export { JNI, asFunction, hookLibart as attach };
