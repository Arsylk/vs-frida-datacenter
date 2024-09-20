import { tryNull } from '@clockwork/common';
import { Color, logger } from '@clockwork/logging';
import { readTidName, tryDemangle } from './utils.js';
const { bold, dim, green, red, gray, black } = Color.use();

function hookPthread_create() {
    Interceptor.replace(
        Libc.pthread_create,
        new NativeCallback(
            (thread, attr, start_routine, arg) => {
                const ret = Libc.pthread_create(thread, attr, start_routine, arg);
                // magic ?
                const tid = thread.readPointer().add(16).readUInt();

                const method = DebugSymbol.fromAddress(start_routine);
                const name = tryDemangle(method.name);
                const threadName = tryNull(() => readTidName(tid));

                const fTid = dim(ret === 0 ? green(tid) : red(tid));
                const fThreadName = threadName ? `, ${bold(threadName)} ` : ' ';
                const fMethod = `[${gray(`${method.moduleName}`)} ${black(`${name}`)}] ${gray(`${method.address}`)}`;
                logger.info(
                    { tag: 'pthread_create' },
                    `${gray('tid:')} ${fTid}, ${attr}${fThreadName}${fMethod}, ${arg.readPointer()}`,
                );
                return ret;
            },
            'int',
            ['pointer', 'pointer', 'pointer', 'pointer'],
        ),
    );
}

export { hookPthread_create };
