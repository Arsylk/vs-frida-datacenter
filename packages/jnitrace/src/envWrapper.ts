import { JNI } from './jni.js';

type JniDefinition<T extends NativeFunctionReturnType, R extends [] | NativeFunctionArgumentType[]> = {
    offset: number;
    retType: T;
    argTypes: R;
};

class EnvWrapper {
    #env: Java.Env;
    jniEnv: NativePointer;

    #functions: { [key: number]: NativeFunction<any, any> } = {};

    constructor(env: Java.Env) {
        this.#env = env;
        this.jniEnv = env.handle
    }

    public getFunction<T extends NativeFunctionReturnType, R extends [] | NativeFunctionArgumentType[]>(
        def: JniDefinition<T, R>,
    ): ReturnType<typeof asFunction<T, R>> {
        const cached = this.#functions[def.offset];
        if (cached) return cached;
        return (this.#functions[def.offset] = asFunction(this.jniEnv, def));
    }

    getLocalRef<T>(ptr: NativePointer, fn: (ptr: NativePointer) => T): T {
        let ref: NativePointer | null = null;
        try {
            const NewLocalRef = this.getFunction(JNI.NewLocalRef);
            return fn((ref = NewLocalRef(this.jniEnv, ptr)));
        } finally {
            if (ref) {
                const DeleteLocalRef = this.getFunction(JNI.DeleteLocalRef);
                DeleteLocalRef(this.jniEnv, ref);
                ref = null;
            }
        }
    }
}

function asFunction<T extends NativeFunctionReturnType, R extends [] | NativeFunctionArgumentType[]>(
    jniEnv: NativePointer,
    def: JniDefinition<T, R>,
) {
    const vaTable: NativePointer = jniEnv.readPointer();
    const ptrPos = vaTable.add(def.offset * Process.pointerSize);
    const ptr = ptrPos.readPointer();
    return new NativeFunction(ptr, def.retType, def.argTypes);
}

function asLocalRef<T>(jniEnv: NativePointer, ptr: NativePointer, fn: (ptr: NativePointer) => T): T {
    let ref: NativePointer | null = null;
    try {
        const NewLocalRef = asFunction(jniEnv, JNI.NewLocalRef);
        return fn((ref = NewLocalRef(jniEnv, ptr)));
    } finally {
        if (ref) {
            const DeleteLocalRef = asFunction(jniEnv, JNI.DeleteLocalRef);
            DeleteLocalRef(jniEnv, ref);
            ref = null;
        }
    }
}

export { asFunction, asLocalRef, EnvWrapper, type JniDefinition };

