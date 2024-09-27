import { JNI } from './jni.js';

type MinimumJNI = {
    offset: number;
    retType: NativeFunctionReturnType;
    argTypes: [] | NativeFunctionArgumentType[];
};

class EnvWrapper {
    #env: Java.Env;
    #handle: NativePointer;
    vaTable: NativePointer;

    #functions: { [key: number]: NativeFunction<any, any> } = {};

    constructor(env: Java.Env) {
        this.#env = env;
        this.vaTable = (this.#handle = env.handle).readPointer();
    }

    public getFunction<T extends NativeFunctionReturnType, R extends [] | NativeFunctionArgumentType[]>(
        def: MinimumJNI,
    ) {
        const cached = this.#functions[def.offset];
        if (cached) return cached;
        const vaTable: NativePointer = this.#handle.readPointer();
        const ptrPos = vaTable.add(def.offset * Process.pointerSize);
        const ptr: NativePointer = ptrPos.readPointer();
        return (this.#functions[def.offset] = new NativeFunction<T, R>(
            ptr,
            def.retType as any,
            def.argTypes as any,
        ));
    }

    localRef<T>(ptr: NativePointer, fn: (ptr: NativePointer) => T): T {
        let ref: NativePointer | null = null;
        try {
            const NewLocalRef = this.getFunction(JNI.NewLocalRef);
            return fn((ref = NewLocalRef(this.#handle, ptr)));
        } finally {
            const DeleteLocalRef = this.getFunction(JNI.DeleteLocalRef);
            DeleteLocalRef(this.#handle, ref);
            ref = null;
        }
    }
}

export { EnvWrapper, type MinimumJNI };
