import { Returnable, StructTypes } from '../types.js';

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
    return new Proxy(
        {},
        {
            get: (_: any, name: string) => {
                const key = data[name as keyof T];
                return cache[name] || (cache[name] ??= init(key as string));
            },
            apply: (_: any, thisArg: T, argArray: any[]): T => {
                return thisArg;
            },
        },
    );
}

type PropertyCallbackMapper<T extends { [key: string]: Returnable }> = { [Property in keyof T]: ReturnType<T[Property]> };
function proxyCallback<T extends { [key: string]: Returnable }>(data: T): PropertyCallbackMapper<T> {
    const cache: { [key: string]: any } = {};
    return new Proxy(
        {},
        {
            get: (_: any, name: string) => {
                if (name === 'toJSON') {
                    return data;
                }
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
        },
    );
}

type PropertyStructMapper<T extends { [key: string]: StructTypes }> = {
    [Property in keyof T]: T[Property] extends 'int' | 'long'
        ? StructField<number>
        : T[Property] extends 'string'
        ? StructField<string>
        : StructField<NativePointer>;
} & { ptr: NativePointer };
type StructField<T extends number | string | NativePointer> = { ptr: NativePointer; value: T };
type StructCreator<T extends { [key: string]: StructTypes }> = { (ptr: NativePointer): PropertyStructMapper<T>; size: number };
function proxyStruct<T extends { [key: string]: StructTypes }>(data: T): StructCreator<T> {
    const creator = (ptr: NativePointer) => {
        const cache: { [key: string]: StructField<any> } = {};
        let offset = 0x0;
        for (const key in data) {
            const crnt = ptr.add(offset);
            switch (data[key]) {
                case 'string':
                    cache[key] = {
                        ptr: crnt,
                        get value() {
                            return crnt.readCString();
                        },
                    };
                    offset += Process.pointerSize;
                    break;
                case 'pointer':
                    cache[key] = {
                        ptr: crnt,
                        get value() {
                            return crnt.readPointer();
                        },
                    };
                    offset += Process.pointerSize;
                    break;
                case 'int':
                    cache[key] = {
                        ptr: crnt,
                        get value() {
                            return crnt.readInt();
                        },
                    };
                    offset += 0x4;
                    break;
                case 'long':
                    cache[key] = {
                        ptr: crnt,
                        get value() {
                            return crnt.readLong();
                        },
                    };
                    offset += 0x8;
                    break;
                case 'short':
                    cache[key] = {
                        ptr: crnt,
                        get value() {
                            return crnt.readShort();
                        },
                    };
                    offset += 0x2;
                    break;
            }
        }

        return new Proxy(
            {},
            {
                get: (_: any, name: string) => {
                    if (name === 'ptr') {
                        return ptr;
                    }
                    return cache[name];
                },
                has(_: any, key: string): boolean {
                    return Reflect.has(data, key);
                },
                ownKeys(_: any) {
                    return Reflect.ownKeys(data);
                },
                apply: (_: any, thisArg: T, argArray: any[]): T => {
                    return thisArg;
                },
            },
        );
    };

    let size = 0x0;
    for (const key in data) {
        switch (data[key]) {
            case 'string':
                size += Process.pointerSize;
                break;
            case 'pointer':
                size += Process.pointerSize;
                break;
            case 'int':
                size += 0x4;
                break;
            case 'long':
                size += 0x8;
                break;
            case 'short':
                size += 0x2;
                break;
        }
    }
    size += size % Process.pointerSize;
    creator.size = size;

    return creator;
}

export { proxyJavaUse, PropertyJavaUseMapper, proxyCallback, PropertyCallbackMapper, proxyStruct, StructCreator, PropertyStructMapper };
