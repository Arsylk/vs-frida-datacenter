import { logger } from '@clockwork/logging';
import { JavaMethod } from './javaMethod.js';

const UNION_SIZE = 8;
const METHOD_ID_INDEX = 2;
const NON_VIRTUAL_METHOD_ID_INDEX = 3;

abstract class JNIEnvInterceptor {
    #missingIds = new Set<string>();
    #nGetSig?: NativeFunction<any, any>;
    #nSigGetName?: NativeFunction<any, any>;

    public constructor() {}

    refId(id: NativePointer) {
        const env = Java.vm.getEnv();
        //@ts-ignore
        const result = Java.api['art::jni::JniIdManager::DecodeMethodId'](env, id) 
        try {
            //@ts-ignore
            const sig = Java.api['art::ArtMethod::GetSignature']?.(result)
            logger.info({tag: 'refId'}, `sig: ${sig}`);
            //@ts-ignore
            const sigStr = Java.api['art::ArtMethod::JniLongName']?.(result)
            logger.info({tag: 'refId'}, `sigStr: ${sigStr} -> ${sigStr.readUtf8String()}`);
        } catch(e) {    
            logger.error      ({tag: 'refId'}, `error2: ${e}`)
            // logger.error({tag: 'refId'}, Thread.backtrace(this.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join('\n'));
        }
    }

    public getCallMethodArgs(caller: string, args: NativeCallbackArgumentValue[], method: JavaMethod | null): NativeCallbackArgumentValue[] | null {
        let methodIndex = METHOD_ID_INDEX;
        if (caller.includes('Nonvirtual')) {
            methodIndex = NON_VIRTUAL_METHOD_ID_INDEX;
        }
        if (caller.endsWith('jmethodIDz')) return [];
        if (!caller.endsWith('va_list') && !caller.endsWith('jvalue')) {
            return null;
        }

        const jMethodId = args[methodIndex] as NativePointer;
        const isVaList = caller.endsWith('va_list');

        // ? todo do better, confusing flow
        // ! fix whatever this is 
        if (!method) {
            if (!this.#missingIds.has(`${jMethodId}`, )) {
                logger.error({tag: 'JniEnvInterceptor'}, `Method not found for id: ${jMethodId}`);
                this.#missingIds.add(`${jMethodId}`, );
            }
            return null;
        }
        

        const callArgs: NativeCallbackArgumentValue[] = [];
        const callArgsPtr = args[args.length - 1] as NativePointer;
        if (isVaList) this.setUpVaListArgExtract(callArgsPtr);
        
        for (let i = 0; i < method.javaParams.length; i++) {
            const type = method.javaParams[i];
            let value: NativeCallbackArgumentValue;
            if (isVaList) {
                const currentPtr = this.extractVaListArgValue(method, i);
                value = this.readValue(currentPtr, type, true);
            } else {
                value = this.readValue(callArgsPtr.add(UNION_SIZE * i), type);
            }
            callArgs.push(value);
        }

        if (isVaList) this.resetVaListArgExtract();

        return callArgs;
    }

    private readValue(currentPtr: NativePointer, type: string, extend?: boolean): NativeCallbackArgumentValue {
        let value: NativeCallbackArgumentValue;
        switch (type) {
            case 'boolean': {
                value = currentPtr.readU8();
                break;
            }
            case 'byte': {
                value = currentPtr.readS8();
                break;
            }
            case 'char': {
                value = currentPtr.readU16();
                break;
            }
            case 'short': {
                value = currentPtr.readS16();
                break;
            }
            case 'int': {
                value = currentPtr.readS32();
                break;
            }
            case 'long': {
                value = currentPtr.readS64();
                break;
            }
            case 'double': {
                value = currentPtr.readDouble();
                break;
            }
            case 'float': {
                value = extend === true ? currentPtr.readDouble() : currentPtr.readFloat();
                break;
            }
            case 'pointer':
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
