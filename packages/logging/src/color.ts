import { createColors } from 'colorette';
const Colors = createColors({ useColor: true });
const { cyan, green } = use();

function use() {
    return Colors;
}

const className: (className: any) => string = (className: any) => {
    if (!className) return className;
    const splits: string[] = `${className}`.split('.');
    return splits.map(cyan).join('.');
};

const method: (methodName: any) => string = (methodName: any) => {
    if (!methodName) return methodName;
    return green(`${methodName}`);
};

const args: (args: string[]) => string = (args: string[]) => {
    if (args.length === 0) return '';
    const joinBy = true ? ', \n' : ', ';
    const joined = args.map((arg: any) => `    ${arg}`).join(joinBy);
    return `\n${joined}\n`;
};

export { className, method, args, use };
