<<<<<<< HEAD
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
=======
import { EnvWrapper } from './envWrapper.js';
import { JniMethodDefinition, type jMethodID, type jclass, type jobject } from './jni.js';
import { JniInvokeMode, type JavaMethod } from './model.js';
import { resolveMethod } from './tracer.js';

>>>>>>> 760230fe663d279907bd1eea45674922a72d97c2

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

<<<<<<< HEAD
type JniArgs = {
    env: NativePointer;
    clazz: jclass;
    obj?: jobject;
    methodID: jMethodID;
    rawArgs: NativePointer;
};

=======
>>>>>>> 760230fe663d279907bd1eea45674922a72d97c2
interface JniInvokeCallback {
    tag: string;
    name: string;
    mode: JniInvokeMode;
    java: JavaMethod;

    // do some caching here
    javaArgs: NativePointer[];
}

<<<<<<< HEAD
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
=======
>>>>>>> 760230fe663d279907bd1eea45674922a72d97c2

type Optional<Type> = { [Property in keyof Type]+?: Type[Property] };

type JniInvokeContext = PortableInvocationContext & {
    env: NativePointer;
<<<<<<< HEAD
    clazz: jclass;
=======
    clazz?: jclass;
>>>>>>> 760230fe663d279907bd1eea45674922a72d97c2
    obj?: jobject;
    methodID: jMethodID;
    argStruct: NativePointer;
    method: JavaMethod | null;
    jArgs: NativeCallbackArgumentValue[] | null;
};

type JniInvokeScriptListenerCallbacks = {
<<<<<<< HEAD
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
=======
    onEnter?: ((this: InvocationContext, context: JniInvokeContext) => void)
    onLeave?: ((this: InvocationContext, context: JniInvokeContext, retval: InvocationReturnValue) => void)
};

function JniInvokeCallbacks(
    envWrapper: EnvWrapper,
    def: JniMethodDefinition,
    mode: JniInvokeMode,
    predicate: (thisRef: InvocationContext) => boolean,
    callback: JniInvokeScriptListenerCallbacks,
) {
    const name = def.name;
    const cb: ScriptInvocationListenerCallbacks = {
        onEnter(rawargs) {
            if (!predicate(this)) return;

            let env: NativePointer 
            let obj: NativePointer 
            let clazz: NativePointer 
            let methodID: NativePointer
            let args: NativePointer
            if (mode === JniInvokeMode.Constructor || mode === JniInvokeMode.Static) {
                // const { 0: env, 1: clazz, 2: methodID, 3: args } = rawargs
                env = rawargs[0]
                obj = NULL;
                clazz = rawargs[1] 
                methodID = rawargs[2]
                args = rawargs[3]
            } else if (mode === JniInvokeMode.Normal) {
                // const { 0: env, 1: obj, 2: methodID, 3: args } = rawargs
                env = rawargs[0]
                obj = rawargs[1] 
                clazz = NULL;
                methodID = rawargs[2]
                args = rawargs[3]
            } else {
                // const { 0: env, 1: obj, 2: clazz, 3: methodID, 4: args } = rawargs
                env = rawargs[0]
                obj = rawargs[1]
                clazz = rawargs[2] 
                methodID = rawargs[3]
                args = rawargs[4]
            }
            const context: JniInvokeContext = {
                ...this,
                env: env,
                obj: obj,
>>>>>>> 760230fe663d279907bd1eea45674922a72d97c2
                clazz: clazz,
                methodID: methodID,
                argStruct: args,
                method: null,
                jArgs: null,
            };
            const isStatic = (context.isStatic = mode === JniInvokeMode.Static);
            const method = (context.method = resolveMethod(env, clazz, methodID, isStatic));
<<<<<<< HEAD
            context.jArgs = jniIntercept.getCallMethodArgs(name, [env, clazz, methodID, args], method);
=======
            context.jArgs = envWrapper.jniInterceptor.getCallMethodArgs(name, [env, clazz, methodID, args], method);
>>>>>>> 760230fe663d279907bd1eea45674922a72d97c2

            this._key = context;
            callback.onEnter?.call(this, context);
        },
        onLeave(retval) {
<<<<<<< HEAD
=======
            if (!predicate(this)) return;

>>>>>>> 760230fe663d279907bd1eea45674922a72d97c2
            const context: JniInvokeContext = this._key;
            callback?.onLeave?.call(this, context, retval);
            try {
                this._key = null;
                (context as any).env = null;
<<<<<<< HEAD
=======
                (context as any).obj = null;
>>>>>>> 760230fe663d279907bd1eea45674922a72d97c2
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

<<<<<<< HEAD
export { JniInvokeCallbacks, JniInvokeMode, LimitedCallback, type JniInvokeScriptListenerCallbacks };
=======
export { JniInvokeCallbacks, JniInvokeMode, type JniInvokeScriptListenerCallbacks };
>>>>>>> 760230fe663d279907bd1eea45674922a72d97c2
