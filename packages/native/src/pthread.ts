import { tryNull } from '@clockwork/common';
import { Color, logger } from '@clockwork/logging';
import { readTidName, tryDemangle } from './utils.js';
const { bold, dim, green, red, gray, black } = Color.use();

function hookPthread_create() {
    Interceptor.replace(
        Libc.pthread_create,
        new NativeCallback(
            (ptr0, ptr1, ptr2, ptr3) => {
                const ret = Libc.pthread_create(ptr0, ptr1, ptr2, ptr3);
                // magic ?
                const tid = ptr0.readPointer().add(16).readUInt();

                const method = DebugSymbol.fromAddress(ptr2);
                const name = tryDemangle(method.name);
                const threadName = tryNull(() => readTidName(tid));

                const fTid = dim(ret === 0 ? green(tid) : red(tid));
                const fThreadName = threadName ? `, ${bold(threadName)} ` : ' ';
                const fMethod = `[${gray(`${method.moduleName}`)} ${black(`${name}`)}] ${gray(`${method.address}`)}`;
                logger.info(
                    { tag: 'pthread_create' },
                    `${gray('tid:')} ${fTid}, ${ptr1}${fThreadName}${fMethod}, ${ptr3}`,
                );
                return ret;
            },
            'int',
            ['pointer', 'pointer', 'pointer', 'pointer'],
        ),
    );
}

export { hookPthread_create };
