import { Libc } from '@clockwork/common';
import { logger } from '@clockwork/logging';

function hookExit(predicate: (ptr: NativePointer) => boolean) {
    const array: ('exit' | '_exit' | 'abort')[] = ['exit', '_exit', 'abort'];
    for (const key of array) {
        //@ts-ignore
        const func: NativeFunction<any, any> = Libc[key] as NativeFunction<any, any>;
        Interceptor.replace(
            func,
            new NativeCallback(
                function (code) {
                    const stacktrace = Thread.backtrace(this.context, Backtracer.ACCURATE)
                        .map(DebugSymbol.fromAddress)
                        .join('\n');
                    logger.info({ tag: key }, `code: ${code} ${stacktrace}`);
                    return 0;
                },
                'void',
                ['pointer'],
            ),
        );
    }
    //@ts-ignore
    Interceptor.replace(
        //@ts-ignore
        Libc.raise,
        new NativeCallback(
            function (err) {
                const stacktrace = Thread.backtrace(this.context, Backtracer.ACCURATE)
                    .map(DebugSymbol.fromAddress)
                    .join('\n');
                logger.info({ tag: 'raise' }, `err: ${err} ${stacktrace}`);
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
            (pid, code) => {
                logger.info({ tag: 'kill' }, `kill(${pid}, ${code}) called !`);
                return 0;
            },
            'int',
            ['int', 'int'],
        ),
    );
}

function hook(predicate: (ptr: NativePointer) => boolean) {
    hookKill(predicate);
    hookExit(predicate);
}

export { hook, hookExit, hookKill };
