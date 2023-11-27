import { createColors } from 'colorette';
const colors = createColors({ useColor: true });
const array = [colors.red, colors.green, colors.yellow, colors.blue, colors.magenta, colors.cyan, colors.gray];

const colormap = new Map<string, (text: string | number) => string>();

function getColor(tag: string): (text: string | number) => string {
    let roll = colormap.get(tag);
    if (roll) return roll;
    const hash = hashCode(tag);
    console.log(tag, roll, hash)
    roll = array[Math.abs(hash % array.length)];
    colormap.set(tag, roll);
    return roll;
}

function hashCode(str: string) {
    let hash = 0,
        i: number,
        chr: number;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
    }
    return hash;
}

export { getColor };
