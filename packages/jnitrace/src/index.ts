<<<<<<< HEAD
import { Classes, Text, tryNull, vs } from '@clockwork/common';
import { FilterJni } from '@clockwork/hooks';
import { Color, logger as gLogger, subLogger } from '@clockwork/logging';
import { EnvWrapper, type JniDefinition, asFunction, asLocalRef } from './envWrapper.js';
import type { JavaMethod } from './javaMethod.js';
import { JNI, type JniMethodDefinition } from './jni.js';
import { JNIEnvInterceptorARM64 } from './jniEnvInterceptorArm64.js';
import { JniInvokeCallbacks, JniInvokeMode } from './jniInvokeCallback.js';
import { JNIMethod } from './jniMethod.js';
import { fastpathMethod, resolveMethod, signatureToPrettyTypes } from './tracer.js';
const logger = subLogger('jnitrace');
const { black, gray, dim, redBright, magenta } = Color.use();

// TODO fix all of this
let IF_CHECK = (thisRef: InvocationContext): boolean => false;
=======
import { Classes, ClassesString, Text, isNully, vs } from '@clockwork/common';
import { JavaPrimitive } from '@clockwork/common/dist/define/enum.js';
import { Color, logger as gLogger, subLogger } from '@clockwork/logging';
import { EnvWrapper, type JniDefinition, asFunction, asLocalRef, getClassName, getObjectClassName } from './envWrapper.js';
import { JNI } from './jni.js';
import { JniInvokeCallbacks } from './jniInvokeCallback.js';
import { JNIMethod, type JavaMethod, JniInvokeMode } from './model.js';
import { resolveMethod, signatureToPrettyTypes } from './tracer.js';
const logger = subLogger('jnitrace');
const { black, gray, dim, redBright, magenta, orange, lavender } = Color.use();
>>>>>>> 760230fe663d279907bd1eea45674922a72d97c2

function ColorMethod(jMethodId: NativePointer, method: JavaMethod): string {
    let sb = '';
    sb += redBright(`${jMethodId} -${dim('>')}`);
    sb += Color.className(method.className);
    sb += '::';
    sb += Color.method(method.name);
    sb += Color.bracket('(');
    sb += method.jParameterTypes.map(Color.className).join(', ');
    sb += Color.bracket(')');
    sb += ': ';
    sb += Color.className(method.jReturnType);

    return sb;
}

function ColorMethodInvoke(method: JavaMethod, args: string[]): string {
<<<<<<< HEAD
=======
    // TODO move someplace else 
    let isMultiline = true;
    // only primitive types or single param
    if (method.jParameterTypes.length <= 1 || !method.jParameterTypes.map(p => p in Reflect.ownKeys(JavaPrimitive)).includes(false)) {
        isMultiline = false;
    }

    switch (method.className) {
        case 'com.android.internal.policy.PhoneWindow':
            isMultiline = method.name in ['setStatusBarColor'];
            break;
        case 'android.app.Activity':
            isMultiline = method.name in ['findViewById'];
            break;
        case 'java.io.FileOutputStream':
            isMultiline = method.name in ['write'];
            break;
        case 'android.app.ApplicationPackageManager':
            isMultiline = method.name in ['getApplicationInfo', 'getPackageInfo'];
            break;
        case 'org.cocos2dx.lib.Cocos2dxBitmap':
            isMultiline = method.name in ['createTextBitmapShadowStroke'];
            break;
    }
    const nl = isMultiline ? '\n' : '';
    const pad = isMultiline ? '    ' : '';


>>>>>>> 760230fe663d279907bd1eea45674922a72d97c2
    const isConstructor = method.name === '<init>';
    let sb = '';
    if (isConstructor) {
        sb += Color.keyword('new');
        sb += ' ';
        sb += Color.className(method.className);
    } else {
        sb += Color.className(method.className);
        sb += '::';
        sb += Color.method(method.name);
    }

    sb += Color.bracket('(');
    if (args.length > 0) {
        sb += nl;
        sb += args.map((arg) => `${pad}${arg}`).join(`, ${nl}`);
        sb += nl;
    }
    sb += Color.bracket(')');

    if (!isConstructor) {
        sb += ': ';
<<<<<<< HEAD
        sb += Color.className(method.javaRet);
=======
        sb += Color.className(method.jReturnType);
>>>>>>> 760230fe663d279907bd1eea45674922a72d97c2
    }

    return sb;
}

function hookIf<T>(
    callback: (this: InvocationContext, args: T) => string | null | undefined,
    tag?: string,
): (this: InvocationContext, args: T) => void {
    return function (this: InvocationContext, args: T) {
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
    jniEnv: NativePointer,
<<<<<<< HEAD
    nativeName: string,
=======
>>>>>>> 760230fe663d279907bd1eea45674922a72d97c2
    jMethodId: NativePointer,
    method: JavaMethod | null,
    args: NativeCallbackArgumentValue[] | null,
): string {
    // better than nothing ...
    if (!method) {
        return `${jniEnv}::${jMethodId}(${args})`;
    }

    // colorful mapping flow
    const mappedArgs = new Array<string>(method.parameters.length);
    for (const i in method.parameters) {
        const param = method.parameters[i];
<<<<<<< HEAD
        const arg = args?.[i] ?? undefined;
        mappedArgs[i] = vs(arg, param);
=======
        const arg = args?.[i];
        mappedArgs[i] = vs(arg, param, jniEnv);
>>>>>>> 760230fe663d279907bd1eea45674922a72d97c2
    }
    return ColorMethodInvoke(method, mappedArgs);
}

function formatMethodReturn(jniEnv: NativePointer, value: any, type?: string): string {
    const text = vs(value, type, jniEnv);

    return `${dim('return')} ${text}`; // + `${type}[${value}: ${typeof value}]`;
}

let envWrapper: EnvWrapper;

<<<<<<< HEAD
function hookLibart(predicate: (thisRef: InvocationContext) => boolean) {
    envWrapper ??= new EnvWrapper(Java.vm.getEnv());
    IF_CHECK = predicate;
    const libart = Process.getModuleByName('libart.so');
    const symbols = libart.enumerateSymbols();
    const jniInterceptor = new JNIEnvInterceptorARM64();

    const fn = (arg: JniDefinition<any, any>) => envWrapper.getFunction(arg);
    const jfn = (arg: JniDefinition<any, any> & { name: string }) => new JNIMethod(arg.name, fn(arg));

    const addrsCallStatic: JNIMethod[] = [
        ...Object.values(JNI)
            .filter((x) => x.name.startsWith('CallStatic'))
            .map((x: JniMethodDefinition) => new JNIMethod(x.name, envWrapper.getFunction(x))),
    ];
    const addrsCallNonvirtual: JNIMethod[] = [
        ...Object.values(JNI)
            .filter((x) => x.name.startsWith('CallNonvirtual'))
            .map((x: JniMethodDefinition) => new JNIMethod(x.name, envWrapper.getFunction(x))),
    ];
    const addrsCallMethod: JNIMethod[] = [
        ...Object.values(JNI)
            .filter(
                (x) =>
                    x.name.startsWith('Call') &&
                    x.name.includes('Method') &&
                    !x.name.includes('Static') &&
                    !x.name.includes('Nonvirtual'),
            )
            .map((x: JniMethodDefinition) => new JNIMethod(x.name, envWrapper.getFunction(x))),
    ];
    const addrsNewObject: JNIMethod[] = [jfn(JNI.NewObject), jfn(JNI.NewObjectV), jfn(JNI.NewObjectA)];

    // let GetMethodID: NativeFunction<NativePointer, [NativePointerValue, NativePointerValue, NativePointerValue, NativePointerValue]> | null = null;

    for (const { name, address } of symbols) {
        if (
            name.includes('art') &&
            name.includes('JNI') &&
            name.includes('_ZN3art3JNIILb0') &&
            !name.includes('CheckJNI')
        ) {
            if (name.includes('GetStringUTFChars')) {
                logger.trace(`GetStringUTFChars is at ${name} ${address}`);
            } else if (name.includes('NewStringUTF')) {
                logger.trace(`NewStringUTF is at ${name} ${address}`);
            } else if (name.includes('DefineClass')) {
                logger.trace(`DefineClass is at ${name} ${address}`);
            } else if (name.includes('FindClass')) {
                logger.trace(`FindClass is at ${name} ${address}`);
            } else if (name.includes('GetMethodID')) {
                logger.trace(`GetMethodID is at ${name} ${address}`);
            } else if (name.includes('GetStaticMethodID')) {
                logger.trace(`GetStaticMethodID is at ${name} ${address}`);
            } else if (name.includes('GetFieldID')) {
                logger.trace(`GetFieldID is at ${name} ${address}`);
            } else if (name.includes('GetStaticFieldID')) {
                logger.trace(`GetStaticFieldID is at ${name} ${address}`);
            } else if (name.includes('RegisterNatives')) {
                logger.trace(`RegisterNatives is at ${name} ${address}`);
            } else if (name.includes('NewObject') && !name.includes('Array')) {
                logger.trace(`NewObject is at ${name} ${address}`);
            } else if (name.includes('CallStatic')) {
                // addrsCallStatic.push(new JNIMethod(name, address));
                logger.trace(`CallStatic is at ${name} ${address}`);
            } else if (name.includes('CallNonvirtual')) {
                // addrsCallNonvirtual.push(new JNIMethod(name, address));
                logger.trace(`CallNonvirtual is at ${name} ${address}`);
            } else if (name.includes('Call') && name.includes('Method')) {
                // addrsCallMethod.push(new JNIMethod(name, address));
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
                logger.trace(`NewGlobalRef is at ${name} ${address}`);
            }
        }
    }

    Interceptor.attach(fn(JNI.GetObjectArrayElement), {
        onEnter({ 0: env, 1: array, 2: index }) {
            this.env = env;
            this.array = array;
            this.index = index;
        },
        onLeave(retval) {
            const symbol = DebugSymbol.fromAddress(this.returnAddress);
            const symbolStr = `${symbol}`;
            if (symbolStr.includes('libopenjdk.so!')) return;

            const obj = tryNull(() => Java.cast(retval, Classes.Object).$className) ?? undefined;
            const i = this.index ?? -1;
            // logger.info({tag: 'GetObjectArrayElement'}, `[${Color.number(i.toInt32())}] = ${vs(retval, obj, this.env)} ${symbolStr}`)
        },
    });

    false &&
        Interceptor.attach(fn(JNI.IsSameObject), {
            onEnter(args) {
                this.a0 = args[0];
                this.a1 = args[1];
            },
            onLeave: hookIfTag<InvocationReturnValue>('IsSameObject', function (retval) {
                return `${this.a0} == ${this.a1} ? ${retval}`;
            }),
        });

    Interceptor.attach(fn(JNI.GetStringUTFChars), {
        // std::tuple< UniqueStringUTFChars, bool > 	GetStringUTFChars (JNIEnv &env, jstring &string)
        onLeave: hookIfTag('GetStringUTFChars', (retval) => Color.string(retval.readCString())),
    });

    Interceptor.attach(fn(JNI.NewStringUTF), {
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

    Interceptor.attach(fn(JNI.DefineClass), {
        // jclass & 	DefineClass (JNIEnv &env, const char *name, jobject &loader, const jbyte *buf, jsize size)
        // auto 	DefineClass (JNIEnv &env, const char *name, jobject &loader, const Array &buf) -> std::enable_if_t< IsArraylike< Array >::value, jclass & >
        onEnter: hookIfTag('DefineClass', (args) => args[1].readCString()),
    });

    Interceptor.attach(fn(JNI.FindClass), {
        // jclass & 	FindClass (JNIEnv &env, const char *name)
        onEnter: hookIfTag('FindClass', ({ 1: name }) => {
            const className = name.readCString();
            if (className === 'com/cocos/lib/CocosHelper') return;
            return className;
        }),
    });

    Interceptor.attach(fn(JNI.NewGlobalRef), {
        onEnter({ 0: env, 1: local }) {
            this.env = env;
            this.local = local;
        },
        onLeave: hookIfTag('NewGlobalRef', function (retval) {
            const env: NativePointer = this.env;
            const local: NativePointer = this.local;
            if (env && local && retval && !retval.isNull() && retval !== ptr(0x0)) {
                const getObjectClass = asFunction(env, JNI.GetObjectClass);
                const refClass = getObjectClass(env, local);
                const typeName = Java.cast(refClass, Classes.Class).getName();
                if (
                    `${typeName}`.match(/^\$Proxy\d+$/) ||
                    typeName === 'java.lang.Long' ||
                    typeName.includes('android.media.AudioDeviceInfo')
                ) {
                    if (`${DebugSymbol.fromAddress(this.returnAddress)}`.includes('libunity.so')) return;
                }

                const type = Text.toPrettyType(typeName);
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
    Interceptor.attach(fn(JNI.GetMethodID), getMethodId(false));
    Interceptor.attach(fn(JNI.GetStaticMethodID), getMethodId(true));

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
    Interceptor.attach(fn(JNI.GetFieldID), getFieldId(false));
    Interceptor.attach(fn(JNI.GetStaticFieldID), getFieldId(true));

    for (const { address, name } of addrsNewObject) {
        Interceptor.attach(
            address,
            JniInvokeCallbacks(jniInterceptor, name, JniInvokeMode.Constructor, {
                onEnter({ method, env, methodID, jArgs }) {
                    if (!predicate(this)) return;
                    if (
                        method?.className === 'android.app.ActivityManager$MemoryInfo' &&
                        method?.name === '<init>'
                    )
                        return;

                    const msg = formatCallMethod(env, name, methodID, method, jArgs);
                    gLogger.info(`[${dim(name)}] ${msg} ${DebugSymbol.fromAddress(this.returnAddress)}`);
                },
            }),
        );
    }

    // biome-ignore lint/suspicious/noSelfCompare: <explanation>
    // biome-ignore lint/correctness/noConstantCondition: <explanation>
    // if (1 === 1) return;

    for (const { address, name } of addrsCallStatic) {
        Interceptor.attach(
            address,
            JniInvokeCallbacks(jniInterceptor, name, JniInvokeMode.Static, {
                onEnter({ method, env, methodID, jArgs }) {
                    if (!predicate(this)) return;

                    if (
                        method?.className?.includes('CocosHelper') &&
                        method?.name?.includes('flushTasksOnGameThread')
                    ) {
                        this.ignore = true;
                        return;
                    }

                    const msg = formatCallMethod(env, name, methodID, method, jArgs);
                    gLogger.info(`[${dim(name)}] ${msg} ${DebugSymbol.fromAddress(this.returnAddress)}`);
                },
                onLeave({ env, method }, retval) {
                    if (!predicate(this) || method?.isVoid || this.ignore) return;
                    const msg = formatMethodReturn(env, retval, method?.returnType);
                    gLogger.info(`[${dim(name)}] ${msg} ${DebugSymbol.fromAddress(this.returnAddress)}`);
                },
            }),
        );
    }

    for (const { address, name } of addrsCallNonvirtual) {
        Interceptor.attach(address, {
            // std::enable_if_t< std::is_void< R >::value, R > 	CallNonvirtualMethod (JNIEnv &env, jobject *obj, jclass &clazz, jmethodID &method, Args &&... args)
            onEnter: hookIfTag('CallNonvirtual', function (rawargs) {
                const env = (this.env = rawargs[0]);
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
                return formatCallMethod(env, name, jMethodId, method, callArgs);
            }),
            onLeave: hookIfTag('CallNonvirtual', function (retval) {
                const ExceptionCheck = envWrapper.getFunction(JNI.ExceptionCheck);
                if (ExceptionCheck(this.env)) {
                    const ExceptionOccurred = envWrapper.getFunction(JNI.ExceptionOccurred);
                    logger.info({ tag: 'ExceptionOccurred' }, `${ExceptionOccurred(this.env)}`);
                    return;
                }

                const method: JavaMethod | undefined | null = this.method;
                if (method?.isVoid) return;
                return formatMethodReturn(this.env, retval, method?.returnType);
            }),
        });
    }

    for (const { address, name } of addrsCallMethod) {
        Interceptor.attach(address, {
            // std::enable_if_t<!std::is_void< R >::value, R > 	CallMethod (JNIEnv &env, jobject *obj, jmethodID &method, Args &&... args)
            onEnter: hookIfTag('CallObject', function (rawargs) {
                const env = (this.env = rawargs[0]);
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
                const result = formatCallMethod(env, name, jMethodId, method, callArgs);
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

export { EnvWrapper, JNI, asFunction, asLocalRef, hookLibart as attach };
=======
function hookLibart(predicate: (thisRef: InvocationContext | CallbackContext) => boolean) {
    envWrapper ??= new EnvWrapper(Java.vm.getEnv());

    repl(envWrapper, JNI.GetStringUTFChars, function (retval, env, str, smth) {
        if (!predicate(this)) return;
        const msg = Color.string(retval.readCString());
        gLogger.info(`[${dim('GetStringUTFChars')}] ${msg}`);
    });
    repl(envWrapper, JNI.NewStringUTF, function (retval, env, str) {
        if (!predicate(this)) return;
        const text = (str as NativePointer).readCString();
        switch (text) {
            case 'com/cocos/lib/CocosHelper':
            case 'org/cocos2dx/lib/CanvasRenderingContext2DImpl':
            case 'com/cocos/lib/CanvasRenderingContext2DImpl':
                return;
        }
        const msg = Color.string(text);
        gLogger.info(`[${dim('NewStringUTF')}] ${msg}`);
    });
    repl(envWrapper, JNI.FindClass, function (retval, env, str) {
        if (!predicate(this)) return;
        const msg = lavender(`${(str as NativePointer).readCString()}`);
        gLogger.info(`[${dim('FindClass')}] ${msg} ${retval}`);
    });
    repl(envWrapper, JNI.NewGlobalRef, function (retval, env, obj) {
        if (!predicate(this) || isNully(obj) || isNully(retval)) return;
        const getObjectClass = asFunction(env as NativePointer, JNI.GetObjectClass);
        const refClass = getObjectClass(env, obj);
        const typeName = Java.cast(refClass, Classes.Class).getName();
        if (typeName.match(/^\$Proxy[0-9]+$/) || typeName === ClassesString.Long) {
            return;
        }
        switch (typeName) {
            case 'android.media.MediaRouter$RouteInfo':
            case 'android.view.Display':
            case 'android.media.AudioDeviceInfo:':
                return
        }

        const type = Text.toPrettyType(typeName);
        const value = vs(obj, type, env as NativePointer);
        const msg = `${Color.className(type)}: ${value}`;
        gLogger.info(`[${dim('NewGlobalRef')}] ${msg}`);
    });

    const GetMethodText = (retval: NativePointer, name: NativePointer, sig: NativePointer) => {
        let sigText = `${sig.readCString()}`;
        const types = signatureToPrettyTypes(sigText);
        if (types) {
            sigText = `(${types.splice(0, 1).join(', ')})${types[0] !== 'void' ? `: ${types[0]}` : ''}`;
        }
        return `${name.readCString()}${sigText} ? ${retval}`;
    };
    repl(envWrapper, JNI.GetMethodID, function (retval, env, clazz, name, sig) {
        if (!predicate(this) || isNully(clazz) || isNully(name) || isNully(sig)) return;
        const method = resolveMethod(env as NativePointer, clazz as NativePointer, retval, false);
        switch (method?.className) {
            case 'com.cocos.lib.CocosHelper':
            case 'org.cocos2dx.lib.CanvasRenderingContext2DImpl':
            case 'com.cocos.lib.CanvasRenderingContext2DImpl':
                return
        }

        const msg = `${method ? ColorMethod(retval, method) : GetMethodText(retval, name as NativePointer, sig as NativePointer)}`;
        gLogger.info(`[${dim('GetMethodID')}] ${msg}`);
    });
    repl(envWrapper, JNI.GetStaticMethodID, function (retval, env, clazz, name, sig) {
        if (!predicate(this) || isNully(clazz) || isNully(name) || isNully(sig)) return;
        const method = resolveMethod(env as NativePointer, clazz as NativePointer, retval, true);
        if (method?.className === 'com.cocos.lib.CocosHelper') return;
        if (method?.className === 'com.cocos.lib.CanvasRenderingContext2DImpl') return;

        const msg = `${method ? ColorMethod(retval, method) : GetMethodText(retval, name as NativePointer, sig as NativePointer)}`;
        gLogger.info(`[${dim('GetStaticMethodID')}] ${msg}`);
    });

    const GetFieldText = (
        retval: NativePointer,
        env: NativePointer,
        clazz: NativePointer,
        name: NativePointer,
        sig: NativePointer,
    ) => {
        const clazzName = getClassName(env, clazz)
        const sigName = `${sig.readCString()}`;
        const typeName = signatureToPrettyTypes(sigName)?.[0] ?? sigName;
        const fieldName = `${name.readCString()}`;
        const id = redBright(`${retval} -${dim('>')}`);
        return `${id}${Color.className(clazzName)}${Color.bracket('.')}${Color.field(fieldName)}: ${Color.className(typeName)}`;
    };
    repl(envWrapper, JNI.GetFieldID, function (retval, env, clazz, name, sig) {
        if (!predicate(this) || isNully(clazz) || isNully(name)) return;

        const msg = GetFieldText(
            retval,
            env as NativePointer,
            clazz as NativePointer,
            name as NativePointer,
            sig as NativePointer,
        );
        gLogger.info(`[${dim('GetFieldID')}] ${msg}`);
    });
    repl(envWrapper, JNI.GetStaticFieldID, function (retval, env, clazz, name, sig) {
        if (!predicate(this) || isNully(clazz) || isNully(name)) return;

        const msg = GetFieldText(
            retval,
            env as NativePointer,
            clazz as NativePointer,
            name as NativePointer,
            sig as NativePointer,
        );
        gLogger.info(`[${dim('GetStaticFieldID')}] ${msg}`);
    });

    repl(envWrapper, JNI.DefineClass, function (retval, env, name, obj, bytes, size) {
        if (!predicate(this) || isNully(name) || isNully(obj)) return;

        const msg = `${orange(`${obj}`)} ${name} ${size} `;
        gLogger.info(`[${dim('DefineClass')}] ${msg}`);
    });
    repl(envWrapper, JNI.RegisterNatives, function (retval, env, clazz, jMethodDef, count) {
        if (!predicate(this) || isNully(clazz) || isNully(jMethodDef)) return;

        const methods: string[] = []
        for (let i = 0; i < count; i++) {
            const namePtr = (jMethodDef as NativePointer).add(i * Process.pointerSize * 3).readPointer();
            const sigPtr = (jMethodDef as NativePointer).add(i * Process.pointerSize * 3 + Process.pointerSize).readPointer();
            const fnPtrPtr = (jMethodDef as NativePointer).add(i * Process.pointerSize * 3 + Process.pointerSize * 2).readPointer();

            let sigText = `${sigPtr.readCString()}`;
            const types = signatureToPrettyTypes(sigText);
            if (types) {
                sigText = `(${types.splice(0, 1).join(', ')})${types[0] && types[0] !== 'void' ? `: ${types[0]}` : ''}`;
            }
            const text = `    ${black(dim('  >'))}${orange(`${namePtr.readCString()}`)}${sigText} ? ${gray(`${(fnPtrPtr)}`)}`;
            methods.push(text)
        }

        const clazzName = getClassName(env as NativePointer, clazz as NativePointer)
        const msg = `${orange(`${jMethodDef}`)} ${clazzName}\n${methods.join('\n')}`;
        gLogger.info(`[${dim('RegisterNatives')}] ${msg}`);
    });

    repl(envWrapper, JNI.GetObjectArrayElement, function (retval, env, jarray, i) {
        if (!predicate(this) || isNully(jarray) || !i) return;
        const getObjectClass = asFunction(env as NativePointer, JNI.GetObjectClass);
        const refClass = !isNully(retval) ? getObjectClass(env, retval) : null;
        const typeName = refClass ? Java.cast(refClass, Classes.Class).getName() : null;
        const type = typeName ? Text.toPrettyType(typeName) : null;

        const value = vs(retval, type ?? undefined, env as NativePointer);
        const msg = `${type ?? jarray}[${i}] ${value}`;
        gLogger.info(`[${dim('GetObjectArrayElement')}] ${msg}`);
    });

    const fn = (arg: JniDefinition<any, any>) => envWrapper.getFunction(arg);
    const jfn = (arg: JniDefinition<any, any> & { name: string }) => new JNIMethod(arg.name, fn(arg));
    // for (const { name, address } of symbols) {
    //     if (
    //         name.includes('art') &&
    //         name.includes('JNI') &&
    //         name.includes('_ZN3art3JNIILb0') &&
    //         !name.includes('CheckJNI')
    //     ) {
    //         if (name.includes('GetStringUTFChars')) {
    //             logger.trace(`GetStringUTFChars is at ${name} ${address}`);
    //         } else if (name.includes('NewStringUTF')) {
    //             logger.trace(`NewStringUTF is at ${name} ${address}`);
    //         } else if (name.includes('DefineClass')) {
    //             logger.trace(`DefineClass is at ${name} ${address}`);
    //         } else if (name.includes('FindClass')) {
    //             logger.trace(`FindClass is at ${name} ${address}`);
    //         } else if (name.includes('GetMethodID')) {
    //             logger.trace(`GetMethodID is at ${name} ${address}`);
    //         } else if (name.includes('GetStaticMethodID')) {
    //             logger.trace(`GetStaticMethodID is at ${name} ${address}`);
    //         } else if (name.includes('GetFieldID')) {
    //             logger.trace(`GetFieldID is at ${name} ${address}`);
    //         } else if (name.includes('GetStaticFieldID')) {
    //             logger.trace(`GetStaticFieldID is at ${name} ${address}`);
    //         } else if (name.includes('RegisterNatives')) {
    //             logger.trace(`RegisterNatives is at ${name} ${address}`);
    //         } else if (name.includes('NewObject') && !name.includes('Array')) {
    //             logger.trace(`NewObject is at ${name} ${address}`);
    //         } else if (name.includes('CallStatic')) {
    //             logger.trace(`CallStatic is at ${name} ${address}`);
    //         } else if (name.includes('CallNonvirtual')) {
    //             logger.trace(`CallNonvirtual is at ${name} ${address}`);
    //         } else if (name.includes('Call') && name.includes('Method')) {
    //             logger.trace(`Call<>Method is at ${name} ${address}`);
    //         } else if (name.includes('ToReflectedMethod')) {
    //             logger.trace(`ToReflectedMethod is at ${name} ${address}`);
    //         } else if (name.includes('GetArrayLength')) {
    //             Interceptor.attach(address, {
    //                 onLeave: hookIfTag('GetArrayLength', (retval) => `${retval}`),
    //             });
    //         } else if (name.includes('SetByteArrayRegion')) {
    //             Interceptor.attach(address, {
    //                 onLeave: hookIfTag('SetByteArrayRegion', (retval) => `${retval}`),
    //             });
    //         } else if (name.includes('NewObjectArray')) {
    //             Interceptor.attach(address, {
    //                 onLeave: hookIfTag('NewObjectArray', (retval) => `${retval}`),
    //             });
    //         } else if (name.includes('SetObjectArrayElement')) {
    //             Interceptor.attach(address, {
    //                 onEnter: hookIfTag('SetObjectArrayElement', (args) => `${args[2]} -> ${args[3]}`),
    //             });
    //         } else if (name.includes('ReleaseByteArrayElements')) {
    //             Interceptor.attach(address, {
    //                 onEnter: hookIfTag('ReleaseByteArrayElements', (args) => `${args[2]} -> ${args[3]}`),
    //             });
    //         } else if (name.includes('GetByteArrayElements')) {
    //             Interceptor.attach(address, {
    //                 onLeave: hookIfTag('GetByteArrayElements', (retval) => `${retval}}`),
    //             });
    //         } else if (name.includes('NewGlobalRef')) {
    //             logger.trace(`NewGlobalRef is at ${name} ${address}`);
    //         }
    //     }
    // }
    false &&
        Interceptor.attach(fn(JNI.IsSameObject), {
            onEnter(args) {
                this.a0 = args[0];
                this.a1 = args[1];
            },
            onLeave: hookIfTag<InvocationReturnValue>('IsSameObject', function (retval) {
                return `${this.a0} == ${this.a1} ? ${retval}`;
            }),
        });

    for (const Obj of [JNI.NewObject, JNI.NewObjectA, JNI.NewObjectV]) {
        continue;
        repl(envWrapper, Obj, function (retval, env, clazz, methodID, args) {
            if (!predicate(this) || isNully(clazz) || isNully(methodID) || isNully(retval) || isNully(args)) return;

            const method = resolveMethod(
                env as NativePointer,
                clazz as NativePointer,
                methodID as NativePointer,
                false,
            );
            const jArgs = envWrapper.jniInterceptor.getCallMethodArgs(
                Obj.name,
                [
                    env as NativePointer,
                    clazz as NativePointer,
                    methodID as NativePointer,
                    args as NativePointer,
                ],
                method,
            );
            const msg = formatCallMethod(
                env as NativePointer,
                methodID as NativePointer,
                method,
                jArgs,
            );
            gLogger.info(`[${dim(Obj.name)}] ${msg}`);
        });
    }

    // biome-ignore lint/suspicious/noSelfCompare: <explanation>
    // biome-ignore lint/correctness/noConstantCondition: <explanation>
    // if (1 === 1) return;

    // for (const { address, name } of addrsCallStatic) {
    //     const cb = JniInvokeCallbacks(envWrapper, name, JniInvokeMode.Static, predicate, {
    //         onEnter({ method, env, methodID, jArgs }) {
    //             if ((method?.className?.includes('CocosHelper') &&
    //                 method?.name?.includes('flushTasksOnGameThread')) || (method?.className === ClassesString.System && method?.name === 'nanoTime')
    //             ) {
    //                 this.ignore = true;
    //                 return;
    //             }

    //             const msg = formatCallMethod(env, name, methodID, method, jArgs);
    //             gLogger.info(`[${dim(name)}] ${msg} ${DebugSymbol.fromAddress(this.returnAddress)}`);
    //         },
    //         onLeave({ env, method }, retval) {
    //             if (this.ignore || method?.isVoid) return
    //             const msg = formatMethodReturn(env, retval, method?.returnType);
    //             gLogger.info(`[${dim(name)}] ${msg} ${DebugSymbol.fromAddress(this.returnAddress)}`);
    //         },
    //     });
    //     Interceptor.attach(address, cb);
    // }

    // for (const { address, name } of addrsCallNonvirtual) {
    //     const cb = JniInvokeCallbacks(envWrapper, name, JniInvokeMode.Nonvirtual, predicate, {
    //         onEnter({ method, env, methodID, jArgs }) {
    //             const msg = formatCallMethod(env, name, methodID, method, jArgs);
    //             gLogger.info(`[${dim(name)}] ${msg} ${DebugSymbol.fromAddress(this.returnAddress)}`);
    //         },
    //         onLeave({ env, method }, retval) {
    //             if (this.ignore || method?.isVoid) return
    //             const msg = formatMethodReturn(env, retval, method?.returnType);
    //             gLogger.info(`[${dim(name)}] ${msg} ${DebugSymbol.fromAddress(this.returnAddress)}`);
    //         },
    //     });
    //     Interceptor.attach(address, cb);
    // }

    const CallObjects = [
        JNI.CallObjectMethod,
        JNI.CallObjectMethodA,
        JNI.CallObjectMethodV,
        JNI.CallIntMethod,
        JNI.CallIntMethodA,
        JNI.CallIntMethodV,
        JNI.CallBooleanMethod,
        JNI.CallBooleanMethodA,
        JNI.CallBooleanMethodV,
        JNI.CallDoubleMethod,
        JNI.CallDoubleMethodA,
        JNI.CallDoubleMethodV,
        JNI.CallFloatMethod,
        JNI.CallFloatMethodA,
        JNI.CallFloatMethodV,
        JNI.CallLongMethod,
        JNI.CallLongMethodA,
        JNI.CallLongMethodV,
        JNI.CallVoidMethod,
        JNI.CallVoidMethodA,
        JNI.CallVoidMethodV,
        JNI.CallStaticObjectMethod,
        JNI.CallStaticObjectMethodA,
        JNI.CallStaticObjectMethodV,
        JNI.CallStaticIntMethod,
        JNI.CallStaticIntMethodA,
        JNI.CallStaticIntMethodV,
        JNI.CallStaticBooleanMethod,
        JNI.CallStaticBooleanMethodA,
        JNI.CallStaticBooleanMethodV,
        JNI.CallStaticDoubleMethod,
        JNI.CallStaticDoubleMethodA,
        JNI.CallStaticDoubleMethodV,
        JNI.CallStaticFloatMethod,
        JNI.CallStaticFloatMethodA,
        JNI.CallStaticFloatMethodV,
        JNI.CallStaticLongMethod,
        JNI.CallStaticLongMethodA,
        JNI.CallStaticLongMethodV,
        JNI.CallStaticVoidMethod,
        JNI.CallStaticVoidMethodA,
        JNI.CallStaticVoidMethodV,
        JNI.NewObject,
        JNI.NewObjectA,
        JNI.NewObjectV
    ]
    for (const j of CallObjects) {
        const { address, name } = jfn(j)
        const mode = name.includes('Static') ? JniInvokeMode.Static : name.includes('NewObject') ? JniInvokeMode.Constructor : JniInvokeMode.Normal
        const cb = JniInvokeCallbacks(envWrapper, j, mode, predicate, {
            onEnter({ method, env, methodID, jArgs }) {
                const msg = formatCallMethod(env, methodID, method, jArgs);
                if (method?.className === ClassesString.ClassLoader && method?.name === 'loadClass') {
                    for (const skip of [
                        'org/cocos2dx/lib/CanvasRenderingContext2DImpl',
                        'com/cocos/lib/CanvasRenderingContext2DImpl',
                        'com/cocos/lib/CocosHelper',
                    ]) {
                        if (msg.includes(skip)) {
                            this.ignore = true;
                            return;
                        }
                    }
                }
                switch (method?.className) {
                    case 'com.cocos.lib/CocosHelper':
                    case 'com.cocos.lib.CanvasRenderingContext2DImpl':
                        this.ignore = true;
                        if (this.ignore) return;
                        break;
                    case "android.view.Choreographer":
                        this.ignore = method?.name === 'postFrameCallback'
                        if (this.ignore) return
                        break;
                    case "java.lang.Long":
                        this.ignore = method?.name === 'longValue'
                        if (this.ignore) return
                        break;
                    case 'android.media.MediaRouter$RouteInfo':
                        this.ignore = method?.name === 'getPresentationDisplay'
                        if (this.ignore) return;
                        break;
                    case 'android.media.MediaRouter':
                        this.ignore = method?.name === 'getSelectedRoute'
                        if (this.ignore) return;
                        break;
                    case 'android.view.Display':
                        this.ignore = method?.name === 'getDisplayId'
                        if (this.ignore) return;
                        break;
                    case 'android.media.AudioDeviceInfo':
                        this.ignore = method?.name === 'getType'
                        if (this.ignore) return;
                        break;
                    case 'android.media.AudioManager':
                        this.ignore = method?.name === 'getDevices'
                        if (this.ignore) return;
                        break;
                }
                gLogger.info(`[${dim(name)}] ${msg} ${DebugSymbol.fromAddress(this.returnAddress)}`);
            },
            onLeave({ env, method, jArgs }, retval) {
                if (this.ignore || method?.isVoid) return
                if (method?.name === 'getRawOffset') {
                    const offs = [-10800000, -12600000, -14400000, -18000000, -21600000, -25200000, -28800000, -32400000, -34200000, -3600000, -36000000, -39600000, -43200000, -7200000, 0, 10800000, 12600000, 14400000, 16200000, 18000000, 19800000, 20700000, 21600000, 23400000, 25200000, 28800000, 31500000, 32400000, 34200000, 3600000, 36000000, 37800000, 39600000, 43200000, 45900000, 46800000, 50400000, 7200000]
                    retval.replace(ptr(offs[0]))
                }
                if (method?.name === 'contains') {
                    const skip = ['test-keys', 'goldfish', 'ranchu', 'Emulator', 'vbox']
                    const rawSus = jArgs?.[0]
                    if (rawSus) {
                        const sus = `${Java.cast(rawSus as NativePointer, Classes.String)}`;
                        if (skip.includes(sus)) {
                            logger.info({ tag: 'sus' }, `${sus} ${skip.includes(sus)} ${retval}`)
                            retval.replace(ptr(0x0))
                        }

                    }
                }
                const msg = formatMethodReturn(env, retval, method?.returnType);
                gLogger.info(`[${dim(name)}] ${msg} ${DebugSymbol.fromAddress(this.returnAddress)}`);
            },
        });
        Interceptor.attach(address, cb)
    }
}

function repl<T extends NativeFunctionReturnType, R extends [] | NativeFunctionArgumentType[]>(
    envWrapper: EnvWrapper,
    def: JniDefinition<T, R>,
    log: (
        this: InvocationContext | CallbackContext,
        retval: mFunctionReturn<T>,
        ...args: mFunctionParameters<R>
    ) => void,
) {
    const fn = envWrapper.getFunction<T, R>(def);
    const cb: NativeCallbackImplementation<any, any> = function (
        this,
        ...args: mFunctionParameters<R>
    ): mFunctionReturn<T> {
        const retval: mFunctionReturn<T> = fn(...args);
        log.call(this, retval, ...args);
        return retval;
    };
    Interceptor.replace(
        fn,
        new NativeCallback(
            cb,
            def.retType as NativeCallbackReturnType,
            def.argTypes as [] | NativeCallbackArgumentType[],
        ),
    );
}

type mFunction<T extends NativeFunctionReturnType, R extends [] | NativeFunctionArgumentType[]> = ReturnType<
    typeof asFunction<T, R>
>;
type mFunctionReturn<T extends NativeFunctionReturnType> = ReturnType<mFunction<T, any>>;
type mFunctionParameters<R extends [] | NativeFunctionArgumentType[]> = Parameters<mFunction<any, R>>;

export { EnvWrapper, JNI, asFunction, asLocalRef, hookLibart as attach, getObjectClassName };

>>>>>>> 760230fe663d279907bd1eea45674922a72d97c2
