import { asLocalRef } from '@clockwork/jnitrace';
import { Color } from '@clockwork/logging';
import { ClassesString } from './define/java.js';
import { toHex } from './text.js';
const { black, gray, red, green, cyan, dim, italic, bold, yellow, hidden } = Color.use();


function vs(value: any, type?: string, jniEnv: NativePointer = Java.vm.tryGetEnv()?.handle): string {
    if (value === undefined) return Color.number(undefined);
    if (value === null) return Color.number(null);

    //loop over array until max length
    if (type?.endsWith('[]')) {
        const itemType = type.substring(type.length - 3);
        const items = [];
        const size = value.size ?? value.length;6
        let messageSize = 0;
        for (let i = 0; i < size; i += 1) {
            const mapped = `${value[i]}`;
            items.push(mapped);
            messageSize += mapped.length;
            if ((messageSize > 200 || i >= 16) && i + 1 < size) {
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
            const strByte = `0x${toHex(value)}`;
            return Color.number(strByte);
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
            return Color.number(strInt(Number(value)));
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
    // console.log(value, type, typeof value, value.$h, value instanceof NativePointer);

    if (classHandle) {
        const text = asLocalRef(jniEnv, classHandle, (ptr: NativePointer) => visualObject(ptr, type));
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

        if (type === ClassesString.InputDevice) {
            const dev = Java.cast(value, Classes.InputDevice);
            return `${ClassesString.InputDevice}(name=${dev.getName()})`;
        }

        if (type === ClassesString.OpenSSLX509Certificate) {
            const win = Java.cast(value, Classes.OpenSSLX509Certificate);
            return `${ClassesString.OpenSSLX509Certificate}(frame=${win.getFrame()})`;
        }

        if (type === ClassesString.WindowInsets) {
            const win = Java.cast(value, Classes.WindowInsets);
            return `${ClassesString.WindowInsets}(frame=${win.getFrame()})`;
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

export { visualObject, vs };
