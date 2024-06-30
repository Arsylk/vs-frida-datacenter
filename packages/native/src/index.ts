import { attachRegisterNatives } from './registerNatives.js';
import { attachSystemPropertyGet } from './systemPropertyGet.js';
import { Inject } from './inject.js';
export { dumpFile, getSelfFiles } from './utils.js';
import { HooahTrace } from './hooah.js';
export * as Files from './files.js';
export * as Strings from './strings.js';
export * as TheEnd from './theEnd.js';
export * as Syscall from './syscall.js';
export * as Time from './time.js';
export * as Logcat from './logcat.js';

function gPtr(value: string | number): NativePointer {
    return ptr(value).sub('0x100000');
}

function type<T extends object>(fn: (this: T, ...args: any[]) => void) {
    return function (
        this: CallbackContext | InvocationContext,
        ...args: any[]
    ) {
        return fn.call(this as T, ...args,);
    };   
}

function unbox<T extends NativeFunctionReturnValue>(box: SystemFunctionResult<T>): [T, number] {
    let casted: SystemFunctionResult<T> | null = null;
    if ((casted = (box as UnixSystemFunctionResult<T>))) {
        return [casted.value, casted.errno]
    }
    if ((casted = (box as WindowsSystemFunctionResult<T>))) {
        return [casted.value, casted.lastError]
    }
    return [box.value, Number.NaN] 
}

function initLibart() { 
    const module = Process.getModuleByName('libart.so');
    for (const { name, address } of module.enumerateSymbols()) {
        (Java as any).api['art::ArtMethod::GetSignature'] ??= name.includes(
            '_ZN3art9ArtMethod12GetSignatureEv',
        )
            ? new NativeFunction(address, 'pointer', ['pointer'])
            : undefined;
        (Java as any).api['art::ArtMethod::JniLongName'] ??= name.includes(
            '_ZN3art9ArtMethod11JniLongNameEv',
        )
            ? new NativeFunction(address, 'pointer', ['pointer'])
            : undefined;
        (Java as any).api['NterpGetShortyFromMethodId'] ??= name.includes(
            'NterpGetShortyFromMethodId',
        )
            ? new NativeFunction(address, 'pointer', ['pointer'])
            : undefined;

        
    }
}

export {
    initLibart,
    type,
    unbox,
    gPtr,
    attachRegisterNatives,
    attachSystemPropertyGet,
    Inject,
    HooahTrace,
};
