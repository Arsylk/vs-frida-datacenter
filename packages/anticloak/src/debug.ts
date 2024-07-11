import { Libc } from '@clockwork/common';
import { logger } from '@clockwork/logging';

function hookPtrace() {
    const replace = Interceptor.replaceFast(
        Libc.ptrace,
        new NativeCallback(
            function (
                this: CallbackContext,
                request: number,
                pid: number,
                addr: NativePointer,
                data: NativePointer,
            ) {
                logger.info(
                    { tag: 'ptrace' },
                    `${request} ${pid} ${addr} ${data} ${DebugSymbol.fromAddress(this.returnAddress)}`,
                );
                return 0;
            },
            'long',
            ['int', 'int', 'pointer', 'pointer'],
        ),
    );
}

export { hookPtrace };
