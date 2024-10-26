import type { NativeCallbackPredicate } from '@clockwork/hooks';
import type { JavaMethod } from './javaMethod.js';
import { type jMethodID, type jclass, type jobject } from './jni.js';
import type { JNIEnvInterceptor } from './jniEnvInterceptor.js';
import { resolveMethod } from './tracer.js';

enum JniInvokeMode {
    Normal = 0,
    Nonvirtual = 1,
    Static = 2,
    Constructor = 3,
}

function hasThisRef(mode: JniInvokeMode) {
    switch (mode) {
        case JniInvokeMode.Normal:
        case JniInvokeMode.Nonvirtual:
            return true;
        case JniInvokeMode.Static:
        case JniInvokeMode.Constructor:
            return false;
    }
}

type JniArgs = {
    env: NativePointer;
    clazz: jclass;
    obj?: jobject;
    methodID: jMethodID;
    rawArgs: NativePointer;
};

interface JniInvokeCallback {
    tag: string;
    name: string;
    mode: JniInvokeMode;
    java: JavaMethod;

    // do some caching here
    javaArgs: NativePointer[];
}

function LimitedCallback(predicate: NativeCallbackPredicate, callback: ScriptInvocationListenerCallbacks) {
    const cb: ScriptInvocationListenerCallbacks = {
        onEnter(args) {
            if (callback?.onEnter && predicate(this)) {
                callback.onEnter.call(this, args);
            }
        },
        onLeave(retval) {
            if (callback?.onLeave && predicate(this)) {
                callback.onLeave.call(this, retval);
            }
        },
    };
    return cb;
}

type Optional<Type> = { [Property in keyof Type]+?: Type[Property] };

type JniInvokeContext = PortableInvocationContext & {
    env: NativePointer;
    clazz: jclass;
    obj?: jobject;
    methodID: jMethodID;
    argStruct: NativePointer;
    method: JavaMethod | null;
    jArgs: NativeCallbackArgumentValue[] | null;
};

type JniInvokeScriptListenerCallbacks = {
    onEnter?: ((this: InvocationContext, context: JniInvokeContext) => void) | undefined;

    onLeave?:
        | ((this: InvocationContext, context: JniInvokeContext, retval: InvocationReturnValue) => void)
        | undefined;
};

function JniInvokeCallbacks(
    jniIntercept: JNIEnvInterceptor,
    name: string,
    mode: JniInvokeMode,
    callback: JniInvokeScriptListenerCallbacks,
) {
    const cb: ScriptInvocationListenerCallbacks = {
        onEnter({ 0: env, 1: clazz, 2: methodID, 3: args }) {
            const context: JniInvokeContext = {
                ...this,
                env: env,
                clazz: clazz,
                methodID: methodID,
                argStruct: args,
                method: null,
                jArgs: null,
            };
            const isStatic = (context.isStatic = mode === JniInvokeMode.Static);
            const method = (context.method = resolveMethod(env, clazz, methodID, isStatic));
            context.jArgs = jniIntercept.getCallMethodArgs(name, [env, clazz, methodID, args], method);

            this._key = context;
            callback.onEnter?.call(this, context);
        },
        onLeave(retval) {
            const context: JniInvokeContext = this._key;
            callback?.onLeave?.call(this, context, retval);
            try {
                this._key = null;
                (context as any).env = null;
                (context as any).clazz = null;
                (context as any).methodID = null;
                (context as any).argStruct = null;
                (context as any).method = null;
                (context as any).jArgs = null;
            } catch (e) {}
        },
    };
    return cb;
}

export { JniInvokeCallbacks, JniInvokeMode, LimitedCallback, type JniInvokeScriptListenerCallbacks };
