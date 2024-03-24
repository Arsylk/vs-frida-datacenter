import { Libc } from '@clockwork/common';
import { logger } from '@clockwork/logging';

function hookExit(predicate: (ptr: NativePointer) => boolean) {
    const array: ('exit' | '_exit')[] = ['exit', '_exit'];
    array.forEach((key) => {
        const func = Libc[key];
        Interceptor.replace(
            func,
            new NativeCallback(
                function (code) {
                    logger.info({ tag: key }, `code: ${code}`);
                    return 0;
                },
                'void',
                ['pointer'],
            ),
        );
    });
}

function hookKill(predicate: (ptr: NativePointer) => boolean) {
    Interceptor.replace(
        Libc.kill,
        new NativeCallback(
            function (pid, code) {
                logger.info({ tag: 'kill' }, `kill(${pid}, ${code}) called !`);
                return 0;
            },
            'int',
            ['int', 'int'],
        ),
    );
}

function hook(predicate: (ptr: NativePointer) => boolean) {
    hookKill(predicate)
    hookExit(predicate)
}

export { hookExit, hookKill, hook }
