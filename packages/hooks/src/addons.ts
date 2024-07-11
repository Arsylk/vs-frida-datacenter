import type { FridaMethodReplacement, FridaMethodReplacementOptional } from './types.js';

const always: (value: any) => FridaMethodReplacement = (value) => () => value;

const ifReturn: (fn: FridaMethodReplacementOptional) => FridaMethodReplacement = (
    fn: FridaMethodReplacementOptional,
) => {
    return function (this: Java.Wrapper, method: Java.Method, ...args: any[]) {
        const result = fn.call(this, method, ...args);
        if (result !== undefined) return result;
        return method.call(this, ...args);
    };
};

const ifKey: (fn: (key: string) => any | undefined, index?: number) => FridaMethodReplacement = (
    fn: (key: string) => any | undefined,
    index?: number,
) => {
    return ifReturn(function (this, method, ...args) {
        const key = args[index ?? 0];
        return fn(key);
    });
};

export { always, ifReturn, ifKey };
