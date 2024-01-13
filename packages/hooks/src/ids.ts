namespace Ids {
    let currentCId: number = -1;
    const classIds: { [key: string]: number } = {};
    let currentMId: number = -1;
    const methodIds: { [key: string]: number } = {};

    export function genClassId(className: string): number {
        const key = `${className}`;
        return (typeof classIds[key] === 'number' ? classIds[key] : classIds[key] = currentCId += 1);
    }

    export function genMethodId(className: string, method: string): number {
        const key = `${className}::${method}`;
        return (typeof methodIds[key] === 'number' ? methodIds[key] : methodIds[key] = currentMId += 1);
    }

    export function classId(cId: number): string {
        return `#id:${cId}`;
    }

    export function uniqueId(cId: number, mId: number, i: number): string {
        return `${classId(cId)}:${mId}:${i}`;
    }
}

export { Ids };
