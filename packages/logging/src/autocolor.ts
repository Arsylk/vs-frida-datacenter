import { use } from './color.js';
const colors = use();
const array = [
    colors.red,
    colors.green,
    colors.yellow,
    colors.blue,
    colors.magenta,
    colors.cyan,
    colors.gray,
];

const colormap = new Map<string, (text: string | number) => string>();
colormap.set('encrypt', colors.blueBright);
colormap.set('decrypt', colors.redBright);
colormap.set('strstr', colors.blueBright);
colormap.set('strcasestr', colors.blueBright);

function getColor(tag: string): (text: string | number) => string {
    let roll = colormap.get(tag);
    if (roll) return roll;
    const hash = hashCode(tag);
    roll = array[Math.abs(hash % array.length)];
    colormap.set(tag, roll);
    return roll;
}

function hashCode(str: string) {
    let hash = 0;
    let i: number;
    let chr: number;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
    }
    return hash;
}

export { getColor };
