function maxLengh(message: any, length: number): string {
    const msgString = `${message}`;
    return msgString.substring(0, Math.min(msgString.length, length));
}

function noLines(message: any): string {
    return `${message}`.replaceAll('\n', '\\n');
}

function toHex(decimal: any): string {
    return ('0' + Number(decimal).toString(16)).slice(-2);
}

function toByteSize(size: number): string {
    const i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return Number((size / Math.pow(1024, i)).toFixed(2)) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}

export { maxLengh, noLines, toHex, toByteSize };
