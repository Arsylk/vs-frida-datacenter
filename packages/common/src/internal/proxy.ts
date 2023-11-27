import { Returnable } from "../types.js";

function mock<T>(): () => T {
    return () => {
        {
            throw new Error('Stub');
        }
    };
}

type PropertyJavaUseMapper<T> = { [Property in keyof T]: Java.Wrapper };
function proxyJavaUse<T>(data: T): PropertyJavaUseMapper<T> {
    const init = (key: string): Java.Wrapper => Java.use(key);
    const cache: { [key: string]: any } = {};
    return new Proxy({}, {
        get: (_: any, name: string) => {
            const key = data[name as keyof T];
            return cache[name] || (cache[name] ??= init(key as string));
        },
        apply: (_: any, thisArg: T, argArray: any[]): T => {
            return thisArg;
        },
    });
}

type PropertyCallbackMapper<T extends { [key: string]: Returnable }> = { [Property in keyof T]: ReturnType<T[Property]> };
function proxyCallback<T extends { [key: string]: Returnable }>(data: T): PropertyCallbackMapper<T> {
    const cache: { [key: string]: any } = {};
    return new Proxy({}, {
        get: (_: any, name: string) => {
            const init = data[name];
            return cache[name] || (cache[name] ??= init());
        },
        has(_: any, key: string): boolean {
            return data.has(key);
        },
        ownKeys(_: any) {
            return Reflect.ownKeys(data);
        },
        apply: (_: any, thisArg: T, argArray: any[]): T => {
            return thisArg;
        },
    });
}

export { proxyJavaUse, PropertyJavaUseMapper, proxyCallback, PropertyCallbackMapper };
