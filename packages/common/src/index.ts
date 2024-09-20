import { EventEmitter } from 'events';
import { ClassesProxy, ClassesString, type ClassesType } from './define/java.js';
import { LibcFinderProxy, type LibcType } from './define/libc.js';
import { enumerateMembers, findChoose, findClass, getFindUnique } from './search.js';
export * as Std from './define/std.js';
export * as Struct from './define/struct.js';
export * as Text from './text.js';
export * from './types.js';

function tryNull<T>(fn: () => T): T | null {
    try {
        return fn();
    } catch (_) {}
    return null;
}

function isJWrapper(clazzOrName: Java.Wrapper | string): clazzOrName is Java.Wrapper {
    return Object.hasOwn(clazzOrName as any, '$className');
}

function stacktrace(e?: Java.Wrapper): string {
    e ??= Classes.Exception.$new();
    return Classes.Log.getStackTraceString(e).split('\n').slice(1).join('\n');
}

function stacktraceList(e?: Java.Wrapper): string[] {
    e ??= Classes.Exception.$new();
    const stack = Classes.Log.getStackTraceString(e);
    return `${stack}`
        .split('\n')
        .slice(1)
        .map((s: string) => s.substring(s.indexOf('at ') + 3).trim());
}

function getApplicationContext(): Java.Wrapper {
    return Classes.ActivityThread.currentApplication().getApplicationContext();
}

const emitter = new EventEmitter();
declare global {
    const Classes: ClassesType;
    const Libc: LibcType;
    // biome-ignore lint/suspicious/noRedeclare: Makes the function accessible from global frida context
    function findClass(className: string, ...loaders: Java.Wrapper[]): Java.Wrapper | null;
}
Object.defineProperties(global, {
    Classes: {
        value: ClassesProxy,
        writable: false,
    },
    Libc: {
        value: LibcFinderProxy,
        writable: false,
    },
    findClass: {
        value: findClass,
    },
    findChoose: {
        value: findChoose,
    },
    emitter: {
        value: emitter,
    },
});

export {
    ClassesProxy as Classes,
    ClassesString,
    emitter,
    enumerateMembers,
    findClass,
    getApplicationContext,
    getFindUnique,
    isJWrapper,
    LibcFinderProxy as Libc,
    stacktrace,
    stacktraceList,
    tryNull,
};
