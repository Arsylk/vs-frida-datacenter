function maxLengh(message: any, length: number): string {
    const msgString = `${message}`;
    return msgString.substring(0, Math.min(msgString.length, length));
}

function noLines(message: any): string {
    return `${message}`.replaceAll('\n', '\\n');
}

function toHex(decimal: any): string {
    return `0${Number(decimal).toString(16)}`.slice(-2);
}

function toByteSize(size: number): string {
    const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return `${Number((size / 1024 ** i).toFixed(2)) * 1} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`;
}

function stringNumber(length: number): string {
    let text = '';
    for (let i = 0; i < length; i++) {
        text += `${Math.floor(Math.random() * 10) % 10}`;
    }
    return text;
}

function uuid() {
    const range = '0123456789abcdefghijklmnopqrstuvwxyz';
    const rnd = () => range.charAt(Math.round(Math.random() * (range.length - 1)));
    const len = (n: number) => {
        const arr = Array(n);
        for (let i = 0; i < n; i += 1) {
            arr.push(rnd());
        }
        return arr.join('');
    };
    return Array(len(8), len(4), len(4), len(4), len(12)).join('-');
}

const PRIMITIVE_TYPE: { [key: string]: string } = {
    Z: 'boolean',
    B: 'byte',
    C: 'char',
    D: 'double',
    F: 'float',
    I: 'int',
    J: 'long',
    S: 'short',
    V: 'void',
};

function toPrettyType(type: string): string {
    const len = type.length;
    for (; type.charAt(0) === '['; type = type.substring(1));
    const depth = len - type.length;
    if (type.charAt(0) === 'L' && type.charAt(type.length - 1) === ';')
        return type.substring(1, type.length - 1).replaceAll('/', '.') + '[]'.repeat(depth);
    return (PRIMITIVE_TYPE[type] ?? type) + '[]'.repeat(depth);
}

function base64(input: string) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let output = '';
    let i = 0;

    while (i < input.length) {
        const a = input.charCodeAt(i++);
        const b = input.charCodeAt(i++);
        const c = input.charCodeAt(i++);
        const index1 = a >> 2;
        const index2 = ((a & 3) << 4) | (b >> 4);
        const index3 = Number.isNaN(b) ? 64 : ((b & 15) << 2) | (c >> 6);
        const index4 = Number.isNaN(c) ? 64 : c & 63;

        output += chars.charAt(index1) + chars.charAt(index2) + chars.charAt(index3) + chars.charAt(index4);
    }

    return output;
}

export { base64, maxLengh, noLines, stringNumber, toByteSize, toHex, toPrettyType, uuid };
