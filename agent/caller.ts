import { ClassLoader, findHook, getHookUnique } from '@clockwork/hooks';
import { getFindUnique } from '@clockwork/common';

setImmediate(() => {
    send({ type: 'setImmediate' });

    let resolved: Java.Wrapper | null;

    let className: string;
    recv((message: any, _: ArrayBuffer | null) => {
        className = message;
    }).wait();
    let methodName: string;

    function tryFind() {
        if (!resolved && (resolved = findClass(className))) {
            send({ type: 'found-class' });
        }
    }

    tryFind();
    Java.performNow(() => {
        ClassLoader.perform(tryFind);
    });
});

function mainloop(message: any, rawData: ArrayBuffer | null) {
    const tape = message?.payload?.type;
    if (tape === 'perform-resolve') {
        if (!focus) {
            send({ type: 'error-not-found' });
            return recv(mainloop);
        }
        const untyped = message.payload.data;
        return workloop(untyped as string[]);
    }

    recv(mainloop);
}

function workloop(data: string[]) {
    const mapper: (str: string) => string | null = (str: string) => {
        let dec: string | null;
        try {
            //@ts-ignore
            dec = `${focus[methodName](key)}`;
        } catch (ex) {
            dec = null;
        }
        return dec;
    };

    const output: { [key: string]: string | null } = {};
    for (const key of data) {
        output[key] = mapper(key);
    }
    const text = JSON.stringify(output);
    return send({ type: 'data-mapped', data: text });
}
