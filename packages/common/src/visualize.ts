import { asLocalRef } from '@clockwork/jnitrace/dist/jni.js';
import { Color } from '@clockwork/logging';
import { ClassesString } from './define/java.js';
const { black, gray, red, green, cyan, dim, italic, bold, yellow, hidden } = Color.use();

function vs(value: any, type?: string): string {
    if (value === undefined) return Color.number(undefined);
    if (value === null) return Color.number(null);

    //loop over array until max length
    if (type?.endsWith('[]')) {
        const itemType = type.substring(type.length - 3);
        const items = [];
        let messageSize = 0;
        for (let i = 0; i < value.size; i += 1) {
            const mapped = `${value[i]}`;
            items.push(mapped);
            messageSize += mapped.length;
            if ((messageSize > 200 || i >= 16) && i + 1 < value.size) {
                items.push(gray(' ... '));
                break;
            }
        }
        if (items.length === 0) return black('[]');
        return `${black('[')} ${items.join(black(', '))} ${black(']')}`;
    }

    // select by provided type
    switch (type) {
        case 'boolean':
            return Color.number(value ? 'true' : 'false');
        case 'byte': {
            //@ts-ignore
            const strByte = Classes.String.format.bind(Classes.String, '0x%02x');
            return Color.number(strByte(value));
        }
        case 'char': {
            //@ts-ignore
            const strChar = Classes.String.valueOf.overload('char').bind(Classes.String);
            return Color.char(strChar(value));
        }
        case 'short': {
            //@ts-ignore
            const strShort = Classes.String.valueOf.overload('short').bind(Classes.String);
            return Color.number(strShort(value));
        }
        case 'int': {
            //@ts-ignore
            const strInt = Classes.String.valueOf.overload('int').bind(Classes.String);
            return Color.number(strInt(value));
        }
        case 'float': {
            //@ts-ignore
            const strFloat = Classes.String.valueOf.overload('float').bind(Classes.String);
            return Color.number(strFloat(value));
        }
        case 'double': {
            //@ts-ignore
            const strDoubke = Classes.String.valueOf.overload('double').bind(Classes.String);
            return Color.number(strDoubke(value));
        }
        case 'long':
            return Color.number(`${new Int64(value.toString())}`);
    }

    // select by actual value type
    switch (typeof value) {
        case 'string':
            return Color.string(value);
        case 'boolean':
            return Color.number(value ? 'true' : 'false');
        case 'number':
        case 'bigint':
            return Color.number(value);
    }

    // * should only have java objects in here
    const classHandle = value.$h ?? value;
    const env = Java.vm.tryGetEnv()?.handle;
    // console.log(value, type, typeof value, value.$h, value instanceof NativePointer);

    if (classHandle) {
        const text = asLocalRef(classHandle, (ptr) => visualObject(ptr, type));
        if (text) return text;
    }

    return black(`${value}`);
}

function visualObject(value: NativePointer, type?: string): string {
    // ? do not ask, i have no idea why this prevents crashes
    String(value) + String(value.readByteArray(8));

    try {
        if (type === ClassesString.String) {
            const str = Java.cast(value, Classes.String);
            return Color.string(str);
        }

        const object = Java.cast(value, Classes.Object);
        //@ts-ignore
        return Classes.String.valueOf(object);
    } catch (e: any) {
        return black(
            `${e.message} ${black('<')}${dim(`${value}`)}${black('>')}${black(`${typeof value}:${type}`)}`,
        );
    }
}

function visualNative(value: NativePointer, type?: string) {
    let text: string | null = null;

    // * anti crashes yey
    if (value !== null && value !== undefined) {
        try {
            // handle primitive types
            switch (type) {
                case 'boolean':
                    text = Color.number(value ? 'true' : 'false');
                    break;
                case 'int': {
                    //@ts-ignore
                    const strInt = Classes.String.valueOf.overload('int').bind(Classes.String);
                    text = Color.number(strInt(value));
                    break;
                }
                case 'float': {
                    //@ts-ignore
                    const strFloat = Classes.String.valueOf.overload('float').bind(Classes.String);
                    text = Color.number(strFloat(value));
                    break;
                }
                case 'double': {
                    //@ts-ignore
                    const strDoubke = Classes.String.valueOf.overload('double').bind(Classes.String);
                    text = Color.number(strDoubke(value));
                    break;
                }
                case 'long':
                    text = Color.number(`${new Int64(value.toString())}`);
                    break;
            }

            if (text !== null) {
                return text;
            }

            // ? do not ask, i have no idea why this prevents crashes
            String(value) + String(value.readByteArray(8));

            if (type === ClassesString.String) {
                const str = Java.cast(value, Classes.String);
                text = Color.string(str);
            } else if (type?.endsWith('[]')) {
                const any = Java.cast(value, Classes.Object);
                const className = any.$className.endsWith(';') ? '[Ljava.lang.Object;' : any.$className;
                const real = Java.cast(value, Java.use(className));
                //@ts-expect-error
                const array = Classes.Arrays.toString.overload(className).call(Classes.Arrays, real);
                return array;
            } else {
                const any = Java.cast(value, Classes.Object);
                //@ts-ignore
                text = Classes.String.valueOf(any);
            }
        } catch (e: any) {
            return black(
                `${e.message}${black('<')}${dim(`${value}`)}${black('>')}${black(`${type}:${typeof value}`)}`,
            );
        }
    } else {
        text = `${Color.number(`${value}`)} ${black(`${type}`)}`;
    }
    // * help
    return (text ??= `ripme: ${value}`);
}

export { visualNative, vs };
