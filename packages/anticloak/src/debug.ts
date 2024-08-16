import { Libc } from '@clockwork/common';
import { always, hook } from '@clockwork/hooks';
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

function hookVMDebug() {
    hook(Classes.VMDebug, 'isDebuggerConnected', { replace: always(false) });
}

export { hookPtrace, hookVMDebug };
