import { PropertyCallbackMapper, proxyCallback } from '../internal/proxy.js';

const LibcFinder = {
    // int open(const char *pathname, int flags, mode_t mode);
    open: () => {
        const ptr = Module.getExportByName('libc.so', 'open');
        return new NativeFunction(ptr, 'int', ['pointer', 'int']);
    },
    // int creat(const char *pathname, mode_t mode);
    creat: () => {
        const ptr = Module.getExportByName('libc.so', 'creat');
        return new NativeFunction(ptr, 'int', ['pointer', 'int']);
    },
    // int openat(int dirfd, const char *pathname, int flags);
    openat: () => {
        const ptr = Module.getExportByName('libc.so', 'openat');
        return new NativeFunction(ptr, 'int', ['int', 'pointer', 'int']);
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
    // ssize_t readlink(const char *path, char *buf, size_t bufsiz);
    readlink: () => {
        const ptr = Module.getExportByName('libc.so', 'readlink');
        return new NativeFunction(ptr, 'int', ['pointer', 'pointer', 'int']);
    },
    read: () => {
        const ptr = Module.getExportByName('libc.so', 'read');
        return new NativeFunction(ptr, 'int', ['int', 'pointer', 'int']);
    },
    // off_t lseek(int fd, off_t offset, int whence);
    lseek: () => {
        const ptr = Module.getExportByName('libc.so', 'lseek');
        return new NativeFunction(ptr, 'pointer', ['int', 'pointer', 'int']);
    },
    // FILE *fopen(const char *restrict pathname, const char *restrict mode);
    fopen: () => {
        const ptr = Module.getExportByName('libc.so', 'fopen');
        return new NativeFunction(ptr, 'pointer', ['pointer', 'pointer']);
    },
    // FILE *fdopen(int fd, const char *mode);
    fdopen: () => {
        const ptr = Module.getExportByName('libc.so', 'fdopen');
        return new NativeFunction(ptr, 'pointer', ['int', 'pointer']);
    },
    // FILE *freopen(const char *restrict pathname, const char *restrict mode, FILE *restrict stream);
    freopen: () => {
        const ptr = Module.getExportByName('libc.so', 'freopen');
        return new NativeFunction(ptr, 'pointer', ['pointer', 'pointer', 'pointer']);
    },
    chmod: () => {
        const ptr = Module.getExportByName('libc.so', 'chmod');
        return new NativeFunction(ptr, 'int', ['pointer', 'int']);
    },
    // int access(const char *pathname, int mode);
    access: () => {
        const ptr = Module.getExportByName('libc.so', 'access');
        return new NativeFunction(ptr, 'int', ['pointer', 'int']);
    },
    // int faccessat(int fd, const char *path, int amode, int flag);
    faccessat: () => {
        const ptr = Module.getExportByName('libc.so', 'faccessat');
        return new NativeFunction(ptr, 'int', ['int', 'pointer', 'int', 'int']);
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
    // struct hostent *gethostbyname(const char *name);
    gethostbyname: () => {
        const ptr = Module.getExportByName('libc.so', 'gethostbyname');
        return new NativeFunction(ptr, 'pointer', ['pointer']);
    },
    // int getaddrinfo(const char *restrict node,
    //                const char *restrict service,
    //                const struct addrinfo *restrict hints,
    //                struct addrinfo **restrict res);
    getaddrinfo: () => {
        const ptr = Module.getExportByName('libc.so', 'getaddrinfo');
        return new NativeFunction(ptr, 'int', ['pointer', 'pointer', 'pointer', 'pointer']);
    },
    // int inet_aton(const char *cp, struct in_addr *addr);
    inet_aton: () => {
        const ptr = Module.getExportByName('libc.so', 'inet_aton');
        return new NativeFunction(ptr, 'int', ['pointer', 'pointer']);
    },
    // pid_t fork(void);
    fork: () => {
        const ptr = Module.getExportByName('libc.so', 'fork');
        return new NativeFunction(ptr, 'int', []);
    },
    // int gettimeofday(struct timeval *restrict tv, struct timezone *_Nullable restrict tz);
    gettimeofday: () => {
        const ptr = Module.getExportByName('libc.so', 'gettimeofday');
        return new NativeFunction(ptr, 'int', ['pointer', 'pointer']);
    },
    // int pthread_mutex_init(pthread_mutex_t *mutex, const pthread_mutexattr_t *attr);
    pthread_mutex_init: () => {
        const ptr = Module.getExportByName('libc.so', 'pthread_mutex_init');
        return new NativeFunction(ptr, 'int', ['pointer', 'pointer']);
    },
    // int pthread_mutex_lock(pthread_mutex_t *mutex);
    pthread_mutex_lock: () => {
        const ptr = Module.getExportByName('libc.so', 'pthread_mutex_lock');
        return new NativeFunction(ptr, 'int', ['pointer']);
    },
    // int pthread_mutex_unlock(pthread_mutex_t *mutex);
    pthread_mutex_unlock: () => {
        const ptr = Module.getExportByName('libc.so', 'pthread_mutex_unlock');
        return new NativeFunction(ptr, 'int', ['pointer']);
    },
    // int pthread_detach(pthread_t thread);
    pthread_detach: () => {
        const ptr = Module.getExportByName('libc.so', 'pthread_detach');
        return new NativeFunction(ptr, 'int', ['pointer']);
    },
    // char *strstr(const char *haystack, const char *needle);
    strstr: () => {
        const ptr = Module.getExportByName('libc.so', 'strstr');
        return new NativeFunction(ptr, 'pointer', ['pointer', 'pointer']);
    },
    // char *strcasestr(const char *haystack, const char *needle);
    strcasestr: () => {
        const ptr = Module.getExportByName('libc.so', 'strcasestr');
        return new NativeFunction(ptr, 'pointer', ['pointer', 'pointer']);
    },
    // size_t *strlen(const char *str);
    strlen: () => {
        const ptr = Module.getExportByName('libc.so', 'strlen');
        return new NativeFunction(ptr, 'int', ['pointer']);
    },
    // int strcmp(const char *s1, const char *s2);
    strcmp: () => {
        const ptr = Module.getExportByName('libc.so', 'strcmp');
        return new NativeFunction(ptr, 'int', ['pointer', 'pointer']);
    },
    // int strncmp(const char *s1, const char *s2);
    strncmp: () => {
        const ptr = Module.getExportByName('libc.so', 'strncmp');
        return new NativeFunction(ptr, 'int', ['pointer', 'pointer']);
    },
    // char *stpcpy(char *restrict dst, const char *restrict src);
    stpcpy: () => {
        const ptr = Module.getExportByName('libc.so', 'stpcpy');
        return new NativeFunction(ptr, 'pointer', ['pointer', 'pointer']);
    },
    // char *strcpy(char *restrict dst, const char *restrict src);
    strcpy: () => {
        const ptr = Module.getExportByName('libc.so', 'strcpy');
        return new NativeFunction(ptr, 'pointer', ['pointer', 'pointer']);
    },
    // char *strcat(char *restrict dst, const char *restrict src);
    strcat: () => {
        const ptr = Module.getExportByName('libc.so', 'strcat');
        return new NativeFunction(ptr, 'pointer', ['pointer', 'pointer']);
    },
    //  char *fgets(char *restrict s, int n, FILE *restrict stream);
    fgets: () => {
        const ptr = Module.getExportByName('libc.so', 'fgets');
        return new NativeFunction(ptr, 'pointer', ['pointer', 'int', 'pointer']);
    },
    //  int fstat(int fd, struct stat *statbuf);
    stat: () => {
        const ptr = Module.getExportByName('libc.so', 'stat');
        return new NativeFunction(ptr, 'int', ['pointer', 'pointer']);
    },
    //  int fstat(int fd, struct stat *statbuf);
    fstat: () => {
        const ptr = Module.getExportByName('libc.so', 'fstat');
        return new NativeFunction(ptr, 'int', ['int', 'pointer']);
    },
    //  int fstat(int fd, struct stat *statbuf);
    lstat: () => {
        const ptr = Module.getExportByName('libc.so', 'lstat');
        return new NativeFunction(ptr, 'int', ['pointer', 'pointer']);
    },
    // time_t time(time_t *t);
    time: () => {
        const ptr = Module.getExportByName('libc.so', 'time');
        return new NativeFunction(ptr, 'pointer', ['pointer']);
    },
    // struct tm *localtime(const time_t *timep);
    localtime: () => {
        const ptr = Module.getExportByName('libc.so', 'localtime');
        return new NativeFunction(ptr, 'pointer', ['pointer']);
    },
    // int sscanf(const char *restrict str, const char *restrict format, ...);
    sscanf: () => {
        const ptr = Module.getExportByName('libc.so', 'sscanf');
        return new NativeFunction(ptr, 'int', ['pointer', 'pointer', '...']);
    }, 
    // pid_t getpid(void);
    getpid: () => {
        const ptr = Module.getExportByName('libc.so', 'getpid');
        return new NativeFunction(ptr, 'pointer', []);
    },
    // int remove(const char *pathname);
    remove: () => {
        const ptr = Module.getExportByName('libc.so', 'remove');
        return new NativeFunction(ptr, 'int', ['pointer']);
    },
    // int remove(const char *pathname);
    unlink: () => {
        const ptr = Module.getExportByName('libc.so', 'unlink');
        return new NativeFunction(ptr, 'int', ['pointer']);
    },
    // [[noretunr]] void exit(int status);
    exit: () => {
        const ptr = Module.getExportByName('libc.so', 'exit');
        return new NativeFunction(ptr, 'void', ['int']);
    },
    // [[noretunr]] void exit(int status);
    _exit: () => {
        const ptr = Module.getExportByName('libc.so', '_exit');
        return new NativeFunction(ptr, 'void', ['int']);
    },
    // int kill(pid_t pid, int sig); 
    kill: () => {
        const ptr = Module.getExportByName('libc.so', 'kill');
        return new NativeFunction(ptr, 'int', ['pointer', 'int']);
    }
};

type LibcType = PropertyCallbackMapper<typeof LibcFinder>;
const LibcFinderProxy: LibcType = proxyCallback(LibcFinder);
export { LibcType, LibcFinderProxy };
