import { JNI, asFunction, asLocalRef } from '@clockwork/jnitrace';
import { Color } from '@clockwork/logging';
import { ClassesString } from './define/java.js';
import { toHex } from './text.js';
const { black, gray, red, green, orange, dim, italic, bold, yellow, hidden } = Color.use();

function vs(value: any, type?: string, jniEnv: NativePointer = Java.vm.tryGetEnv()?.handle): string {
    if (value === undefined) return Color.number(undefined);
    if (value === null) return Color.number(null);

    //loop over array until max length
    if (type?.endsWith('[]')) {
        const baseType = type.replace(/[\\[\\]]/g, '')
        const itemType = type.substring(0, type.length - 2)
        const items: string[] = [];
        // biome-ignore lint/style/useConst: 
        let getItem = (i: number) => value[i];
        let size = value.size ?? value.length;

        // native pointer to array only
        if (!size) {
            const GetArrayItem = asFunction(jniEnv, JNI.GetObjectArrayElement)
            size = asFunction(jniEnv, JNI.GetArrayLength)(jniEnv, value.$h ?? value)
            getItem = (i: number) => vs(GetArrayItem(jniEnv, value.$h ?? value, i), itemType, jniEnv)
            // return `${black('[')} ${gray(itemType)}<${dim(orange(size))}> ${black(']')}`;
        }
        //     let GetArrayItem: any;
        //     switch (baseType) {
        //         // case 'boolean':
        //         //     GetArrayItem = JNI.GetBooleanArrayElements
        //         //     break;
        //         // case 'char':
        //         //     GetArrayItem = JNI.GetCharArrayElements
        //         //     break;
        //         // case 'short':
        //         //     GetArrayItem = JNI.GetShortArrayElements
        //         //     break;
        //         // case 'int':
        //         //     GetArrayItem = JNI.GetIntArrayElements
        //         //     break;
        //         // case 'byte': {
        //         //     const bArr = asFunction(jniEnv, JNI.GetByteArrayElements)(jniEnv, value, ptr(0x0))
        //         //     getItem = (i: number) => bArr.add(4 * i).readS8()
        //         //     break;
        //         // }
        //         // case 'long':
        //         //     GetArrayItem = JNI.GetLongArrayElements
        //         //     break;
        //         // case 'flaot':
        //         //     GetArrayItem = JNI.GetFloatArrayElements
        //         //     break;
        //         // case 'double':
        //         //     GetArrayItem = JNI.GetDoubleArrayElements
        //         //     break;
        //         default:
        //             GetArrayItem = asFunction(jniEnv, JNI.GetObjectArrayElement)
        //             getItem = (i: number) => {
        //                 let item = GetArrayItem(jniEnv, value.$h ?? value, i)
        //                 if (!isNully(item)) switch (baseType) {
        //                     case 'boolean': {
        //                         item = item.readU8();
        //                         break;
        //                     }
        //                     case 'byte': {
        //                         item = item.readS8();
        //                         break;
        //                     }
        //                     case 'char': {
        //                         item = item.readU16();
        //                         break;
        //                     }
        //                     case 'short': {
        //                         item = item.readS16();
        //                         break;
        //                     }
        //                     case 'int': {
        //                         item = item.readS32();
        //                         break;
        //                     }
        //                     case 'long': {
        //                         item = item.readS64();
        //                         break;
        //                     }
        //                     case 'double': {
        //                         item = item.readDouble();
        //                         break;
        //                     }
        //                     case 'float': {
        //                         item = item.readFloat();
        //                         break;
        //                     }
        //                 }
        //                 return `${vs(item, itemType, jniEnv)}`
        //             }
        //     }
        // }

        let messageSize = 0;
        for (let i = 0; i < size; i += 1) {
            const mapped = `${getItem(i)}`;
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
            return Color.number(strFloat(Number(value)));
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
    const handleStr = `${classHandle}`
    // console.log(value, type, typeof value, value.$h, value instanceof NativePointer);
    // return `${classHandle}`;

    if (handleStr === '0x0') {
        return Color.number(null)
    }

    if (classHandle) {
        const text = (handleStr.length === 12) ? asLocalRef(jniEnv, classHandle, (ptr: NativePointer) => visualObject(ptr, type)) : visualObject(classHandle, type)
        if (text) return text;
    }

    return black(`${value}`);
}

function visualObject(value: NativePointer, type?: string): string {
    // ? do not ask, i have no idea why this prevents crashes
    // String(value) + String(value.readByteArray(8));

    try {
        if (type === ClassesString.String || type === ClassesString.CharSequence) {
            const str = Java.cast(value, Classes.CharSequence);
            return Color.string(str);
        }

        if (type === ClassesString.InputDevice) {
            const dev = Java.cast(value, Classes.InputDevice);
            return `${ClassesString.InputDevice}(name=${dev.getName()})`;
        }

        if (type === ClassesString.OpenSSLX509Certificate) {
            const win = Java.cast(value, Classes.OpenSSLX509Certificate);
            return `${ClassesString.OpenSSLX509Certificate}(issuer=${win.getIssuerX500Principal()})`;
        }

        if (type === ClassesString.Certificate) {
            const win = Java.cast(value, Classes.Certificate);
            return `${ClassesString.Certificate}(issuer=${win.getType()})`;
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
