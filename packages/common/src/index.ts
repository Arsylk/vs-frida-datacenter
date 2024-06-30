import { EventEmitter } from 'events';
import { ClassesProxy as Classes, ClassesString } from './define/java.js';
import { LibcFinderProxy, LibcType } from './define/libc.js';
export * as Struct from './define/struct.js';
export * as Std from './define/std.js';
export * as Text from './text.js';
import { enumerateMembers, findClass, getFindUnique } from './search.js';

function isJWrapper(clazzOrName: Java.Wrapper | string): clazzOrName is Java.Wrapper {
    return clazzOrName?.hasOwnProperty('$className');
}

function stacktrace(e?: Java.Wrapper): string {
    e ??= Classes.Exception.$new();
    return Classes.Log.getStackTraceString(e).split('\n').slice(1).join('\n');
}

function stacktraceList(e?: Java.Wrapper): string[] {
    e ??= Classes.Exception.$new();
    const stack = Classes.Log.getStackTraceString(e);
    return `${stack}`.split('\n').slice(1).map((s: string) => s.substring(s.indexOf('at ') + 3).trim());
}

function getApplicationContext(): Java.Wrapper {
    return Classes.ActivityThread.currentApplication().getApplicationContext();
}

const emitter = new EventEmitter();
declare global {
    const Libc: LibcType;
    function findClass(className: string, ...loaders: Java.Wrapper[]): Java.Wrapper | null
}
Object.defineProperties(global, {
    Libc: { 
        value: LibcFinderProxy,
        writable: false,
    },
    findClass: {
        value: findClass
    },
    emitter: {
        value: emitter,
    }
})


export { Classes, ClassesString, LibcFinderProxy as Libc, isJWrapper, stacktrace, stacktraceList, getApplicationContext, findClass, enumerateMembers, getFindUnique, emitter };
