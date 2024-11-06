import { Classes, ClassesString, Text, isNully, vs } from '@clockwork/common';
import { Color, logger as gLogger, subLogger } from '@clockwork/logging';
import { traceInModules } from '@clockwork/native';
import { EnvWrapper, type JniDefinition, asFunction, asLocalRef, getClassName } from './envWrapper.js';
import { JNI } from './jni.js';
import { JniInvokeCallbacks } from './jniInvokeCallback.js';
import { JNIMethod, type JavaMethod, JniInvokeMode } from './model.js';
import { resolveMethod, signatureToPrettyTypes } from './tracer.js';
const logger = subLogger('jnitrace');
const { black, gray, dim, redBright, magenta, orange, lavender } = Color.use();

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
        sb += Color.className(method.jReturnType);
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
        mappedArgs[i] = vs(arg, param, jniEnv);
    }
    return ColorMethodInvoke(method, mappedArgs);
}

function formatMethodReturn(jniEnv: NativePointer, value: any, type?: string): string {
    const text = vs(value, type, jniEnv);

    return `${dim('return')} ${text}`; // + `${type}[${value}: ${typeof value}]`;
}

let envWrapper: EnvWrapper;

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
            const text = `    ${black(dim('  >'))}${orange(`${namePtr.readCString()}`)}${sigText} ? ${gray(`${traceInModules(fnPtrPtr)}`)}`;
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

    // const NewObjectV = envWrapper.getFunction(JNI.NewObjectV)
    // const ExceptionCheck = envWrapper.getFunction(JNI.ExceptionCheck)
    // Interceptor.replace(NewObjectV, new NativeCallback(function (env, clazz, methodID, rawargs) {
    //     logger.info({ tag: 'check' }, `${ExceptionCheck(env)} ${env} ${clazz} ${methodID} ${rawargs}`)

    //     return NewObjectV(...arguments)
    // }, JNI.NewObjectV.retType, JNI.NewObjectV.argTypes))


    // for (const NewObject of [JNI.NewObject, JNI.NewObjectA, JNI.NewObjectV]) {
    //     repl(envWrapper, NewObject, function (retval, env, clazz, methodID, args) {
    //         if (!predicate(this) || isNully(clazz) || isNully(methodID) || isNully(retval) || isNully(env)) return;
    //         // const method = resolveMethod(env as NativePointer, clazz as NativePointer, methodID as NativePointer, false);
    //         // const jArgs = envWrapper.jniInterceptor.getCallMethodArgs(NewObject.name, [env as NativePointer, clazz as NativePointer, methodID as NativePointer, args as NativePointer], method);
    //         // const msg = formatCallMethod(env as NativePointer, NewObject.name, methodID as NativePointer, method, jArgs);
    //         const msg = `${methodID} ${retval}`
    //         gLogger.info(`[${dim(NewObject.name)}] ${msg}`);
    //     })
    // };

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
        continue
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
                Obj.name,
                methodID as NativePointer,
                method,
                jArgs,
            );
            gLogger.info(`[${dim('NewObject')}] ${msg}`);
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
    ]
    for (const j of CallObjects) {
        const { address, name } = jfn(j)
        const cb = JniInvokeCallbacks(envWrapper, j, JniInvokeMode.Normal, predicate, {
            onEnter({ method, env, methodID, jArgs }) {
                const msg = formatCallMethod(env, name, methodID, method, jArgs);
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
                }
                gLogger.info(`[${dim(name)}] ${msg} ${DebugSymbol.fromAddress(this.returnAddress)}`);
            },
            onLeave({ env, method }, retval) {
                if (this.ignore || method?.isVoid) return
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

export { EnvWrapper, JNI, asFunction, asLocalRef, hookLibart as attach };

