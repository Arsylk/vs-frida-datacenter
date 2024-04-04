import { Libc } from '@clockwork/common';
import { subLogger } from '@clockwork/logging';
const logger = subLogger('socket');

type ProcessID = number;

type SocketOpenMessage = {
    socketFd: number;
    pid: ProcessID;
    threadId: ThreadId;
    type: string;
    hostIp?: string;
    port?: number;
    dstIp?: string;
    dstPort?: number;

    result?: InvocationReturnValue;
};

type SocketCloseMessage = {
    socketFd: number;
    pid: ProcessID;
    threadId: ThreadId;
    type: string;
    hostIp?: string;
    port?: number;
};

function attachNativeSocket() {
    const stacktrace: boolean = false,
        backtrace: boolean = false;
    const tcpSocketFDs = new Map<number, TcpEndpointAddress>();

    Interceptor.attach(Libc.connect, {
        onEnter(args) {
            this.sockFd = args[0].toInt32();
        },
        onLeave(res) {
            const sockFd: number = this.sockFd;
            const sockType = Socket.type(sockFd);
            if (!(sockType === 'tcp' || sockType === 'tcp6')) return;

            const sockLocal: TcpEndpointAddress | null = Socket.localAddress(sockFd) as TcpEndpointAddress | null;
            const tcpEpLocal = sockLocal ?? undefined;
            const sockRemote: TcpEndpointAddress | null = Socket.peerAddress(sockFd) as TcpEndpointAddress | null;
            const tcpEpRemote = sockRemote ?? undefined

            if (!tcpEpLocal) return;
            // ToDo: if socket FD already exists in the set, a faked 'close' message shall be sent first (currently handled by receiving logic)
            tcpSocketFDs.set(sockFd, tcpEpLocal);
            const msg: SocketOpenMessage = {
                socketFd: sockFd,
                pid: Process.id,
                threadId: this.threadId,
                type: 'connect',
                hostIp: tcpEpLocal?.ip,
                port: tcpEpLocal?.port,
                dstIp: tcpEpRemote?.ip,
                dstPort: tcpEpRemote?.port,
                result: res,
            };

            if (stacktrace && Java.available && Java.vm !== null && Java.vm.tryGetEnv()) {
                // checks if Thread is JVM attached (JNI env available)
                const exception = Java.use('java.lang.Exception').$new();
                const trace: any[] = exception.getStackTrace();
                // msg.stacktrace = trace.map((traceEl) => {
                //     return {
                //         class: traceEl.getClassName(),
                //         file: traceEl.getFileName(),
                //         line: traceEl.getLineNumber(),
                //         method: traceEl.getMethodName(),
                //         isNative: traceEl.isNativeMethod(),
                //         str: traceEl.toString(),
                //     };
                // });
            }

            if (backtrace) {
                // msg.backtrace = Thread.backtrace(this.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress);
            }

            //send(msg)
            logOpen(msg);
        },
    });

    [Libc.close, Libc.shutdown].forEach((fn, i) => {
        Interceptor.attach(fn, {
            onEnter(args) {
                const sockFd = args[0].toInt32();
                if (!tcpSocketFDs.has(sockFd)) return;
                const sockType = Socket.type(sockFd);
                if (tcpSocketFDs.has(sockFd)) {
                    const tcpEP = tcpSocketFDs.get(sockFd);
                    const msg: SocketCloseMessage = {
                        socketFd: sockFd,
                        pid: Process.id,
                        threadId: this.threadIds,
                        type: ['close', 'shutdown'][i],
                        hostIp: tcpEP?.ip,
                        port: tcpEP?.port,
                    };
                    tcpSocketFDs.delete(sockFd);
                    //send(msg)
                    logClose(msg);
                }
            },
        });
    });
}

function logOpen(msg: SocketOpenMessage) {
    const host = (`${msg.hostIp?.replace('::ffff:', '')}` + String(msg.port ? `:${msg.port}` : ''));
    const dest = (msg.dstIp ? (`, dst@${msg.dstIp.replace('::ffff:', '')}` + String(msg.dstPort ? `:${msg.dstPort}` : '')) : '');
    logger.info(`(pid: ${msg.pid}, thread: ${msg.threadId}, fd: ${msg.socketFd}) ${msg.type} -> [host@${host}${dest}]`);
}

function logClose(msg: SocketCloseMessage) {
    const host = (`${msg.hostIp?.replace('::ffff:', '')}` + String(msg.port ? `:${msg.port}` : ''));
    const thread = (msg.threadId ? `, thread: ${msg.threadId}` : '');
    logger.info(`(pid: ${msg.pid}${thread}, fd: ${msg.socketFd}) ${msg.type} -> ${host}`);
}

export { attachNativeSocket };
