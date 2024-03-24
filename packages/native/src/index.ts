import { attachRegisterNatives } from './registerNatives.js';
import { attachSystemPropertyGet } from './systemPropertyGet.js';
import { Inject } from './inject.js';
export { dumpFile, getSelfFiles } from './utils.js';
import { HooahTrace } from './hooah.js';
export * as Files from './files.js';
export * as Strings from './strings.js';
export * as TheEnd from './theEnd.js';
export * as Syscall from './syscall.js';

function gPtr(value: string | number): NativePointer {
    return ptr(value).sub('0x100000');
}

export { gPtr, attachRegisterNatives, attachSystemPropertyGet, Inject, HooahTrace };
