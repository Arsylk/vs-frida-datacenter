class StdString {
    static #STD_STRING_SIZE = 3 * Process.pointerSize;
    handle: NativePointer;

    constructor(ptr: NativePointer = Memory.alloc(StdString.#STD_STRING_SIZE)) {
        this.handle = ptr;
    }

    dispose() {
        const [data, isTiny] = this._getData();
        if (!isTiny) {
            //@ts-ignore
            Java.api.$delete(data);
        }
    }

    disposeToString(): string {
        const result = this.toString();
        this.dispose();
        return result;
    }

    toString() {
        const [data] = this._getData();
        //@ts-ignore
        return data.readUtf8String();
    }

    _getData() {
        const str = this.handle;
        const isTiny = (str.readU8() & 1) === 0;
        const data = isTiny ? str.add(1) : str.add(2 * Process.pointerSize).readPointer();
        return [data, isTiny];
    }
}


export { StdString as String }