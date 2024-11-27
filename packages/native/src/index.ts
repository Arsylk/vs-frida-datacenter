import { Std, tryNull } from '@clockwork/common';
import { logger } from '@clockwork/logging';
import { HooahTrace } from './hooah.js';
import { Inject } from './inject.js';
import { attachRegisterNatives } from './registerNatives.js';
import { attachSystemPropertyGet } from './systemPropertyGet.js';
export * as Files from './files.js';
export * as Logcat from './logcat.js';
export * as Pthread from './pthread.js';
export * as Strings from './strings.js';
export * as Syscall from './syscall.js';
export * as System from './system.js';
export * as TheEnd from './theEnd.js';
export * as Time from './time.js';
export { addressOf, dumpFile, getSelfFiles, mkdir, tryResolveMapsSymbol } from './utils.js';
const mutex = Memory.alloc(Process.pointerSize === 4 ? 24 : 40);

function gPtr(value: string | number): NativePointer {
    return ptr(value).sub('0x100000');
}

function type<T extends object>(fn: (this: T, ...args: any[]) => void) {
    return function (this: CallbackContext | InvocationContext, ...args: any[]) {
        return fn.call(this as T, ...args);
    };
}

function unbox<T extends NativeFunctionReturnValue>(box: SystemFunctionResult<T>): [T, number] {
    let casted: SystemFunctionResult<T> | null = null;
    if ((casted = box as UnixSystemFunctionResult<T>)) {
        return [casted.value, casted.errno];
    }
    if ((casted = box as WindowsSystemFunctionResult<T>)) {
        return [casted.value, casted.lastError];
    }
    return [box.value, Number.NaN];
}

// * Currently unused
function initLibart() {
    const module = Process.getModuleByName('libart.so');
    const anyJava = Java as any;
    for (const { name, address } of module.enumerateSymbols()) {
        anyJava.api['art::ArtMethod::GetSignature'] ??= name.includes('_ZN3art9ArtMethod12GetSignatureEv')
            ? new NativeFunction(address, 'pointer', ['pointer'])
            : undefined;
        anyJava.api['art::ArtMethod::JniLongName'] ??= name.includes('_ZN3art9ArtMethod11JniLongNameEv')
            ? new NativeFunction(address, 'pointer', ['pointer'])
            : undefined;
        anyJava.api.NterpGetShortyFromMethodId ??= name.includes('NterpGetShortyFromMethodId')
            ? new NativeFunction(address, 'pointer', ['pointer'])
            : undefined;
        anyJava.api['art::ArtMethod::Invoke'] ??=
            name.includes('Invoke') &&
                name.includes('_ZN3art9ArtMethod') &&
                name.includes('Thread') &&
                name.includes('JValue')
                ? new NativeFunction(address, 'pointer', ['pointer', 'pointer', 'int', 'pointer', 'pointer'])
                : undefined;
    }
    anyJava.api['art::DexFile::OpenMemory'] = module.findExportByName('_ZN3art7DexFile10OpenMemoryEPKhjRKNSt3__112basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEjPNS_6MemMapEPKNS_10OatDexFileEPS9_')
}

// * pointless ? no idea what could be the use case for this
function hookArtInvoke() {
    Interceptor.attach((Java as any).api['art::ArtMethod::Invoke'], {
        onEnter(args) {
            this.method = args[0];
            this.argRef = args[1];
            this.argSize = args[2];
            this.result = args[3];
            this.shorty = args[4];
            this.methodName = prettyMethod(this.method, true);
        },
        onLeave(retval) {
            const name = (this.methodName ?? '') as string;
            if (name.includes('ClassNotFoundException')) return;
            const flags = this.method.add(0x4).readU16();
            const isStatic = (flags & 0x8) > 0;
            const argTypes = name.substring(name.indexOf('(') + 1, name.indexOf(')')).split(', ');
            const argLen = argTypes.length;

            logger.info({ tag: 'artmethod' }, `name: ${this.methodName} flags: ${flags} static: ${isStatic}`);
            let offset = 0;
            for (let i = 0; i < argLen; i += 1) {
                const argType = argTypes[i];
                const argAddress = this.argSize.add(4 * (i + (isStatic ? 0 : 1)) + offset);
                const argValue = tryNull(
                    () =>
                        (argType.includes('.') && Java.cast(argAddress, Classes.Object)) ||
                        argAddress.readU32(),
                );
                logger.info({ tag: 'arg' }, `${argType}: ${argAddress} ${argValue}`);
                if (argType === 'long') {
                    offset += 4;
                }
            }
        },
    });
}

function prettyMethod(methodID: NativePointer, withSignature: boolean) {
    const result = new Std.String();
    (Java as any).api['art::ArtMethod::PrettyMethod'](result, methodID, withSignature ? 1 : 0);
    return result.disposeToString();
}

function sync(fn: () => void) {
    Libc.pthread_mutex_init(mutex, NULL);
    try {
        if (Libc.pthread_mutex_lock(mutex) === 0x0) {
            fn()
        }
    } finally {
        Libc.pthread_mutex_unlock(mutex)
    }


    const dumpedLibs = new Map();


}

export {
    attachRegisterNatives,
    attachSystemPropertyGet,
    gPtr,
    HooahTrace,
    initLibart,
    Inject, mutex, prettyMethod, sync, type,
    unbox
};

