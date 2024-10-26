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
        sb += '\n';
        sb += args.map((arg) => `    ${arg}`).join(', \n');
        sb += '\n';
    }
    sb += Color.bracket(')');

    if (!isConstructor) {
        sb += ': ';
        sb += Color.className(method.javaRet);
    }

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
    jniEnv: NativePointer,
    nativeName: string,
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
        const arg = args?.[i] ?? undefined;
        mappedArgs[i] = vs(arg, param);
    }
    return ColorMethodInvoke(method, mappedArgs);
}

function formatMethodReturn(jniEnv: NativePointer, value: any, type?: string): string {
    const text = vs(value, type, jniEnv);

    return `${dim('return')} ${text}`; // + `${type}[${value}: ${typeof value}]`;
}

let envWrapper: EnvWrapper;

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
