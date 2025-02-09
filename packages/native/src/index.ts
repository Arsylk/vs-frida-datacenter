import { Std, tryNull, Text } from '@clockwork/common';
import { logger, Color } from '@clockwork/logging';
import { HooahTrace } from './hooah.js';
import { Inject } from './inject.js';
import { addressOf, tryDemangle } from './utils.js';
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
export * from './opengl.js';
export {
    addressOf,
    dumpFile,
    getSelfFiles,
    getSelfProcessName,
    mkdir,
    readFpPath,
    readFdPath,
} from './utils.js';
const { gray, magenta: pink } = Color.use();
const mutex = Memory.alloc(Process.pointerSize === 4 ? 24 : 40);

function gPtr(value: string | number): NativePointer {
    return ptr(value).sub(0x100000);
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

const predicate: (r: NativePointer) => boolean = (r: NativePointer) => {
    function isWithinOwnRange(ptr: NativePointer) {
        const path = Inject.modules.findPath(ptr);
        return path?.includes('/data') === true && !path.includes('/com.google.android.trichromelibrary');
    }

    if (!r) return false;
    if (isWithinOwnRange(r)) return true;
    // ? there was some reason for this at some point ...
    return !true && Inject.modules.find(r) === null;
};

const isInRange = (module: { base: NativePointer; size: number }, ptr: NativePointer) =>
    ptr && module && ptr >= module.base && module.base.add(module.size) > ptr;

function hardBreakPoint(ptr: NativePointer, fn: () => void) {
    const prot = Memory.queryProtection(ptr);
    Process.setExceptionHandler(function (this: CallbackContext) {
        const trace = Thread.backtrace(this.context, Backtracer.FUZZY)
            .map((x) => addressOf(x))
            .join('\n    ');
        logger.info({ tag: 'hardbrk' }, `${ptr}\n    ${trace}`);
        fn();
        Memory.protect(ptr, Process.pointerSize, prot);
    });
    Memory.protect(ptr, Process.pointerSize, '---');
}

function memWatch(ptr: NativePointer, size: number, fn?: (details: MemoryAccessDetails) => void) {
    MemoryAccessMonitor.enable(
        { base: ptr, size: size },
        {
            onAccess(details) {
                logger.info({ tag: 'memwatch' }, `${details.operation} ${ptr} <- ${addressOf(details.from)}`);
                fn?.(details);
            },
        },
    );
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
    anyJava.api['art::DexFile::OpenMemory'] = module.findExportByName(
        '_ZN3art7DexFile10OpenMemoryEPKhjRKNSt3__112basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEjPNS_6MemMapEPKNS_10OatDexFileEPS9_',
    );
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

type HookParamteres = {
    tag?: string;
    call?: boolean | ((this: InvocationContext, args: InvocationArguments) => void);
    ret?: boolean | ((this: InvocationContext, retval: InvocationReturnValue) => void);
    nolog?: true;
    logcat?: boolean;
    base?: NativePointer;
    predicate?: (returnAddress: NativePointer) => boolean;
};
function log(ptr: NativePointer, argdef: string, params?: HookParamteres) {
    try {
        logger.info({ tag: 'log' }, `in: ${ptr} ${argdef}`);
        const resolved = DebugSymbol.fromAddress(ptr);
        const atag = resolved.name ? tryDemangle(resolved.name) : `0x${ptr.toString(16)}`;
        const tag = params?.tag ?? atag;
        const argSize = argdef.length;
        logger.info({ tag: 'log' }, `${resolved} ${tag}`);
        Interceptor.attach(ptr, {
            onEnter(args) {
                if (!params?.predicate?.(this.returnAddress) === false) return;
                if (params?.call !== false && params?.nolog !== true) {
                    let sb = '';
                    sb += '{ ';
                    for (let i = 0; i < argSize; i += 1) {
                        const value: any = args[i];
                        let strvalue = `${args[i]}`;
                        switch (argdef[i]) {
                            case 'r':
                                strvalue = `${value.sub(params?.base)} ${params?.base}`;
                                break;
                            case 'c':
                                strvalue = String.fromCharCode(Number(value) & 0xff);
                                break;
                            case 's':
                                strvalue = value.readCString();
                                break;
                            case 'l':
                                strvalue = value.readLong();
                                break;
                            case 'i':
                                strvalue = value.toInt32();
                                break;
                            case '_':
                                strvalue = '_';
                                break;
                            case 'h':
                                strvalue = `\n${hexdump(args[i])}\n`;
                                break;
                        }
                        sb += `${gray(`arg${i}`)}: ${strvalue}`;
                        if (i < argSize - 1) sb += ', ';
                    }
                    sb += ' }';
                    sb += ` ${addressOf(this.returnAddress)}`;
                    logger.info({ tag: tag }, sb);
                }
                if (typeof params?.call === 'function') {
                    params?.call.call(this, args);
                }
                if (params?.logcat === true) {
                    const stacktrace = Thread.backtrace(this.context, Backtracer.FUZZY)
                        .map((x) => addressOf(x, true))
                        .join('\n\t');
                    logger.info({ tag: tag }, pink(stacktrace));
                }
            },
            onLeave(retval) {
                if (!params?.predicate?.(this.returnAddress) === false) return;
                if (typeof params?.ret === 'function') {
                    params?.ret?.call(this, retval);
                }
                if (params?.ret !== false && params?.nolog !== true) {
                    logger.info({ tag: tag }, `${gray('return')} ${retval}`);
                }
            },
        });
    } catch (e: any) {
        logger.error({ tag: 'log' }, `ptr: ${ptr}, argdef: ${argdef}\n${Text.stringify(e)} ${e.stack}`);
    }
}

function replace<Ret extends NativeCallbackReturnType, Arg extends NativeCallbackArgumentType[] | []>(
    ptr: NativePointer,
    retType: Ret,
    argTypes: Arg,
    fn: NativeCallbackImplementation<
        GetNativeCallbackReturnValue<Ret>,
        Extract<GetNativeCallbackArgumentValue<Arg>, unknown[]>
    >,
) {
    const cb = new NativeCallback(
        function (this, ...args) {
            return fn.call(this, ...args);
        },
        retType,
        argTypes,
    );
    return Interceptor.replace(ptr, cb);
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
            fn();
        }
    } finally {
        Libc.pthread_mutex_unlock(mutex);
    }
}

export {
    attachRegisterNatives,
    attachSystemPropertyGet,
    gPtr,
    HooahTrace,
    initLibart,
    Inject,
    mutex,
    prettyMethod,
    sync,
    type,
    unbox,
    hardBreakPoint,
    log,
    memWatch,
    predicate,
    isInRange,
    replace,
};
