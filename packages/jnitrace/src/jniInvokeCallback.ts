import type { JavaMethod } from './javaMethod';
import type { jclass, jMethodID, jobject } from './jni';
import type { JNIEnvInterceptor } from './jniEnvInterceptor';
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

function LimitedCallback(
    predicate: (thisRef: InvocationContext) => boolean,
    callback: ScriptInvocationListenerCallbacks,
) {
    const cb: ScriptInvocationListenerCallbacks = {
        onEnter(args) {
            if (predicate(this)) {
                callback?.onEnter?.call(this, args);
            }
        },
        onLeave(retval) {
            if (predicate(this)) {
                callback?.onLeave?.call(this, retval);
            }
        },
    };
    return cb;
}

type Optional<Type> = { [Property in keyof Type]+?: Type[Property] };

type JniInvokeContext = InvocationContext & {
    env: NativePointer;
    clazz: jclass;
    obj?: jobject;
    methodID: jMethodID;
    argStruct: NativePointer[];
    method: JavaMethod;
    jArgs?: NativeCallbackArgumentValue[];
};

type JniInvokeScriptListenerCallbacks = {
    onEnter?: ((this: JniInvokeContext) => void) | undefined;

    onLeave?: ((this: JniInvokeContext, retval: InvocationReturnValue) => void) | undefined;
};

function JniInvokeCallbacks(
    jniIntercept: JNIEnvInterceptor,
    name: string,
    mode: JniInvokeMode,
    callback: JniInvokeScriptListenerCallbacks,
) {
    const cb: ScriptInvocationListenerCallbacks & {
        env?: NativePointer;
        clazz?: jclass;
        obj?: jobject;
        methodID?: jMethodID;
        argsPtr?: NativePointer[];
        method?: JavaMethod;
        jArgs?: NativeCallbackArgumentValue[];
    } = {
        onEnter(rawargs) {
            const isStatic = mode === JniInvokeMode.Static;

            const env = (this.env = rawargs[0]);
            const clazz = (this.clazz = rawargs[1]);
            const methodID = (this.methodID = rawargs[2]);
            const argsPtr = (this.argsPtr = rawargs[3]);
            const method = (this.method = resolveMethod(env, clazz, methodID, isStatic));
            this.jArgs = jniIntercept.getCallMethodArgs(
                name,
                [env, clazz, methodID, argsPtr],
                method ?? null,
            );
            callback.onEnter?.call(this as any);
        },
        onLeave(retval) {
            callback?.onLeave?.call(this as any, retval);
            // this.env = null
            // this.clazz = null
            // this.methodID = null
            // this.argsPtr = null
            // this.method = null
            // this._args = null
        },
    };
    return cb;
}

export { LimitedCallback, JniInvokeCallbacks, JniInvokeMode, type JniInvokeScriptListenerCallbacks };
