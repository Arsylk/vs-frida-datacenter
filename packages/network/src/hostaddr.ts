import { logger, Color } from '@clockwork/logging';

function attachGetHostByName() {
    const gethostbyname = Module.getExportByName('libc.so', 'gethostbyname');
    Interceptor.attach(gethostbyname, {
        onEnter(args) {
            this.name = args[0].readCString();
        },
        onLeave(res) {
            logger.info({ tag: 'gethostbyname' }, `${Color.url(this.name)} -> result: ${res}`);
        },
    });
}

function attachGetAddrInfo(detailed: boolean = false) {
    const getaddrinfo = Module.getExportByName('libc.so', 'getaddrinfo');
    Interceptor.attach(getaddrinfo, {
        onEnter(args) {
            this.host = args[0].readCString();
            this.port = args[1].readCString();
            this.result = args[2];
        },
        onLeave(res) {
            const resInt = res.toUInt32();
            const text = !this.port || this.port === 'null' ? `${this.host}` : `${this.host}:${this.port}`;
            const result = resInt === 0x0 ? 'success' : 'failure';
            logger.info({ tag: 'getaddrinfo' }, `${Color.url(text)} -> ${result}`);
            if (resInt == 0x0) {
                let ptr: NativePointer = this.result;
                if (!detailed) return;

                const aiFlags = (ptr = ptr.add(0)).readInt();
                const aiFamilty = (ptr = ptr.add(4)).readInt();
                const aiSockType = (ptr = ptr.add(4)).readInt();
                const aiProtocol = (ptr = ptr.add(4)).readInt();
                const aiAddrLen = (ptr = ptr.add(4)).readUInt();
                const aiAddr = (ptr = ptr.add(4)).readPointer();
                const aiCannonName = (ptr = ptr.add(8)).readCString();
                const aiNext = (ptr = ptr.add(8)).readPointer();
                logger.info(
                    { tag: 'getaddrinfo' },
                    JSON.stringify(
                        {
                            aiFlags: aiFlags,
                            aiFamilty: aiFamilty,
                            aiSockType: aiSockType,
                            aiProtocol: aiProtocol,
                            aiAddrLen: aiAddrLen,
                            aiAddr: aiAddr,
                            aiCannonName: aiCannonName,
                            aiNext: aiNext,
                        },
                        null,
                        2,
                    ),
                );
            }
        },
    });
}

export { attachGetAddrInfo, attachGetHostByName };
