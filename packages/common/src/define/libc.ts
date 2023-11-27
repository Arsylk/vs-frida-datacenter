import { PropertyCallbackMapper, proxyCallback } from '../internal/proxy.js';

const LibcFinder = {
    open: () => {
        const ptr = Module.getExportByName('libc.so', 'open');
        return new NativeFunction(ptr, 'int', ['pointer', 'int']);
    },
    // int close(int fd);
    close: () => {
        const ptr = Module.getExportByName('libc.so', 'close');
        return new NativeFunction(ptr, 'int', ['int']);
    },
    // int shutdown(int sockfd, int how);
    shutdown: () => {
        const ptr = Module.getExportByName('libc.so', 'shutdown');
        return new NativeFunction(ptr, 'int', ['int', 'int']);
    },
    mkdir: () => {
        const ptr = Module.getExportByName('libc.so', 'mkdir');
        return new NativeFunction(ptr, 'int', ['pointer', 'int']);
    },
    opendir: () => {
        const ptr = Module.getExportByName('libc.so', 'opendir');
        return new NativeFunction(ptr, 'pointer', ['pointer']);
    },
    closedir: () => {
        const ptr = Module.getExportByName('libc.so', 'closedir');
        return new NativeFunction(ptr, 'int', ['pointer']);
    },
    read: () => {
        const ptr = Module.getExportByName('libc.so', 'read');
        return new NativeFunction(ptr, 'int', ['int', 'pointer', 'int']);
    },
    chmod: () => {
        const ptr = Module.getExportByName('libc.so', 'chmod');
        return new NativeFunction(ptr, 'int', ['pointer', 'int']);
    },
    access: () => {
        const ptr = Module.getExportByName('libc.so', 'access');
        return new NativeFunction(ptr, 'int', ['pointer', 'int']);
    },
    pthread_create: () => {
        const ptr = Module.getExportByName('libc.so', 'pthread_create');
        return new NativeFunction(ptr, 'int', ['pointer', 'pointer', 'pointer', 'pointer']);
    },
    difftime: () => {
        const ptr = Module.getExportByName('libc.so', 'difftime');
        return new NativeFunction(ptr, 'void', ['pointer', 'pointer']);
    },
    // int connect(int sockfd, const struct sockaddr *addr, socklen_t addrlen);
    connect: () => {
        const ptr = Module.getExportByName('libc.so', 'connect');
        return new NativeFunction(ptr, 'int', ['int', 'pointer', 'pointer']);
    },
    // int __system_property_get(const char *name, char *value);
    __system_property_get: () => {
        const ptr = Module.getExportByName('libc.so', '__system_property_get');
        return new NativeFunction(ptr, 'int', ['pointer', 'pointer']);
    },
    // int __system_property_read( const prop_info *pi, char *name, char * value);
    __system_property_read: () => {
        const ptr = Module.getExportByName('libc.so', '__system_property_read');
        return new NativeFunction(ptr, 'int', ['pointer', 'pointer', 'pointer']);
    },
    
};

type LibcType = PropertyCallbackMapper<typeof LibcFinder>;
const LibcFinderProxy: LibcType = proxyCallback(LibcFinder);
export { LibcType, LibcFinderProxy};
