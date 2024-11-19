import { Libc, tryNull } from '@clockwork/common';
import { always, hook } from '@clockwork/hooks';
import { logger } from '@clockwork/logging';
<<<<<<< HEAD
=======
import { traceInModules } from '@clockwork/native';
>>>>>>> 760230fe663d279907bd1eea45674922a72d97c2

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
<<<<<<< HEAD
                    `${request} ${pid} ${addr} ${data} ${DebugSymbol.fromAddress(this.returnAddress)}`,
=======
                    `${request} ${pid} ${addr} ${data} ${traceInModules(this.returnAddress)}`,
>>>>>>> 760230fe663d279907bd1eea45674922a72d97c2
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

function hookDigestEquals() {
    hook(Classes.MessageDigest, 'equals', {
        replace(method, ...args) {
            return (
                tryNull(() => {
                    const thisClazz = Reflect.get(this, '$className');
                    const otherClazz = Reflect.get(args[0], '$className');
                    return thisClazz === otherClazz;
                }) ?? false
            );
        },
    });
}

function hookVerify() {
    hook(Classes.Signature, 'verify', { replace: always(true) });
}

export { hookDigestEquals, hookPtrace, hookVerify, hookVMDebug };
