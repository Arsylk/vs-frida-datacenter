import { Libc } from '@clockwork/common';
import { logger } from '@clockwork/logging';
import { addressOf } from './utils.js';

function hookExit(predicate: (ptr: NativePointer) => boolean) {
    const array: ('exit' | '_exit' | 'abort')[] = ['exit', '_exit', 'abort'];
    for (const key of array) {
        //@ts-ignore
        const func: NativeFunction<any, any> = Libc[key] as NativeFunction<any, any>;
        Interceptor.replace(
            func,
            new NativeCallback(
                function (code) {
                    const stacktrace = Thread.backtrace(this?.context, Backtracer.FUZZY)
                        .map((x) => addressOf(x, true))
                        .join('\n\t');
                    logger.info({ tag: key }, `code: ${code} ${stacktrace}`);
                    return 0;
                },
                'void',
                ['pointer'],
            ),
        );
    }
    Interceptor.replace(
        //@ts-ignore
        Libc.raise,
        new NativeCallback(
            function (err) {
                const stacktrace = Thread.backtrace(this?.context, Backtracer.FUZZY)
                    .map((x) => addressOf(x, true))
                    .join('\n\t');
                logger.info(
                    { tag: 'raise' },
                    `err: ${err} ${addressOf(this?.returnAddress ?? NULL)} ${stacktrace}`,
                );
                return 0;
            },
            'int',
            ['int'],
        ),
    );
}

function hookKill(predicate: (ptr: NativePointer) => boolean) {
    Interceptor.replace(
        Libc.kill,
        new NativeCallback(
            // for some reason entire `this` object can be undefined here ?
            (pid, code) => {
                const stacktrace = Thread.backtrace(this?.context, Backtracer.FUZZY).join('\n\t');
                const strAddress = addressOf(this?.returnAddress ?? NULL);
                logger.info({ tag: 'kill' }, `kill(${pid}, ${code}) ${strAddress}\n${stacktrace}`);
                return 0;
            },
            'int',
            ['int', 'int'],
        ),
    );
}

function hookSignal(predicate: (ptr: NativePointer) => boolean) {
    try {
        Interceptor.replace(
            Libc.signal,
            new NativeCallback(
                (sig, handler) => {
                    const stacktrace = Thread.backtrace(this.context, Backtracer.FUZZY).join('\n\t');
                    logger.info(
                        { tag: 'signal' },
                        `signal(${sig}, ${handler}) ${addressOf(this.returnAddress)} ${stacktrace}`,
                    );
                    return Libc.signal(sig, handler);
                },
                'pointer',
                ['int', 'pointer'],
            ),
        );
    } catch (e) {
        Interceptor.attach(Libc.signal, {
            onEnter({ 0: sig, 1: handler }) {
                const stacktrace = Thread.backtrace(this.context, Backtracer.FUZZY).join('\n\t');
                logger.info(
                    { tag: 'signal' },
                    `signal(${sig}, ${handler}) ${addressOf(this.returnAddress)} ${stacktrace}`,
                );
            },
        });
    }
}

function hookPError(predicate: (ptr: NativePointer) => boolean) {
    try {
        Interceptor.replace(
            Libc.perror,
            new NativeCallback(
                (err) => {
                    const stacktrace = Thread.backtrace(this.context, Backtracer.FUZZY).join('\n\t');
                    logger.info(
                        { tag: 'perror' },
                        `perror(${err.readCString()}) ${addressOf(this.returnAddress)} ${stacktrace}`,
                    );
                    return Libc.perror(err);
                },
                'void',
                ['pointer'],
            ),
        );
    } catch (error) {}
}
function hook(predicate: (ptr: NativePointer) => boolean) {
    hookKill(predicate);
    hookExit(predicate);
    hookSignal(predicate);
    hookPError(predicate);
}

export { hook, hookExit, hookKill };
