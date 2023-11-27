import { ClassesProxy } from './define/java.js';
import { LibcFinderProxy } from './define/libc.js';
import * as Std from './define/std.js';
import { enumerateMembers, findClass, getClass } from './search.js';
import * as Text from './text.js';

function isJWrapper(clazzOrName: Java.Wrapper | string): clazzOrName is Java.Wrapper {
    return clazzOrName?.hasOwnProperty('$className');
}

export { ClassesProxy as Classes, LibcFinderProxy as Libc, isJWrapper, findClass, getClass, enumerateMembers, Text, Std };
