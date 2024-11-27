import { isNully } from '@clockwork/common';
import { JavaPrimitive } from '@clockwork/common/dist/define/enum.js';
import type { JavaMethod } from './model.js';

const UNION_SIZE = 8;

abstract class JNIEnvInterceptor {
    #missingIds = new Set<string>();

    public getCallMethodArgs(
        caller: string,
        args: NativeCallbackArgumentValue[],
        method: JavaMethod | null,
    ): NativeCallbackArgumentValue[] | null {
        // instant skip when method is missing
        if (!method) return null

        const isVaList = caller.endsWith('va_list') || caller.endsWith('V');

        const callArgs = Array(method.jParameterTypes.length)
        const callArgsPtr = args[args.length - 1] as NativePointer;
        if (isVaList) this.setUpVaListArgExtract(callArgsPtr);

        for (let i = 0; i < method.jParameterTypes.length; i++) {
            const type = method.jParameterTypes[i];
            if (isVaList) {
                const currentPtr = this.extractVaListArgValue(method, i);
                callArgs[i] = this.readValue(currentPtr, type, true);
            } else {
                const ptr = callArgsPtr.add(UNION_SIZE * i);
                callArgs[i] = this.readValue(ptr, type);
            }
        }

        if (isVaList) this.resetVaListArgExtract();

        return callArgs;
    }

    private readValue(
        currentPtr: NativePointer,
        type: string,
        extend?: boolean,
    ): NativeCallbackArgumentValue | null {
        if (isNully(currentPtr)) {
            if (type in Reflect.ownKeys(JavaPrimitive)) {
                return 0
            }
            return null
        }

        let value: NativeCallbackArgumentValue;
        switch (type) {
            case JavaPrimitive.boolean: {
                value = currentPtr.readU8();
                break;
            }
            case JavaPrimitive.byte: {
                value = currentPtr.readS8();
                break;
            }
            case JavaPrimitive.char: {
                value = currentPtr.readU16();
                break;
            }
            case JavaPrimitive.short: {
                value = currentPtr.readS16();
                break;
            }
            case JavaPrimitive.int: {
                value = currentPtr.readS32();
                break;
            }
            case JavaPrimitive.long: {
                value = currentPtr.readS64();
                break;
            }
            case JavaPrimitive.double: {
                value = currentPtr.readDouble();
                break;
            }
            case JavaPrimitive.float: {
                value = extend === true ? currentPtr.readDouble() : currentPtr.readFloat();
                break;
            }
            default: {
                value = currentPtr.readPointer();
                break;
            }
        }
        return value;
    }

    protected abstract setUpVaListArgExtract(vaList: NativePointer): void;

    protected abstract extractVaListArgValue(method: JavaMethod, index: number): NativePointer;

    protected abstract resetVaListArgExtract(): void;
}

export { JNIEnvInterceptor };
