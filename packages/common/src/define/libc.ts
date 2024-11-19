import { type PropertyCallbackMapper, proxyCallback } from '../internal/proxy.js';

const LibcFinder = {
    // int open(const char *pathname, int flags);
    open: () => {
        const ptr = Module.getExportByName('libc.so', 'open');
        return new SystemFunction(ptr, 'int', ['pointer', 'int']);
    },
    // int fileno(FILE *stream);
    fileno: () => {
        const ptr = Module.getExportByName('libc.so', 'fileno');
        return new SystemFunction(ptr, 'int', ['pointer']);
    },
    // ssize_t write(int fd, const void *buf, size_t count);
    write: () => {
        const ptr = Module.getExportByName('libc.so', 'write');
        return new SystemFunction(ptr, 'int', ['int', 'pointer', 'int']);
    },
    // int creat(const char *pathname, mode_t mode);
    creat: () => {
        const ptr = Module.getExportByName('libc.so', 'creat');
        return new NativeFunction(ptr, 'int', ['pointer', 'int']);
    },
    // int openat(int dirfd, const char *pathname, int flags);
    openat: () => {
        const ptr = Module.getExportByName('libc.so', 'openat');
        return new NativeFunction(ptr, 'int', ['int', 'pointer', 'int', '...']);
    },
    // int close(int fd);
    close: () => {
        const ptr = Module.getExportByName('libc.so', 'close');
        return new NativeFunction(ptr, 'int', ['int']);
    },
    // int close(int fd);
    fclose: () => {
        const ptr = Module.getExportByName('libc.so', 'fclose');
        return new NativeFunction(ptr, 'int', ['pointer']);
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
    // DIR *opendir(const char *name);
    opendir: () => {
        const ptr = Module.getExportByName('libc.so', 'opendir');
        return new NativeFunction(ptr, 'pointer', ['pointer']);
    },
    // DIR *fdopendir(int fd);
    fdopendir: () => {
        const ptr = Module.getExportByName('libc.so', 'fdopendir');
        return new NativeFunction(ptr, 'pointer', ['int']);
    },
    // struct dirent *readdir(DIR *dirp);
    readdir: () => {
        const ptr = Module.getExportByName('libc.so', 'readdir');
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
    // ssize_t read(int fd, void buf[.count], size_t count);
    read: () => {
        const ptr = Module.getExportByName('libc.so', 'read');
        return new NativeFunction(ptr, 'uint', ['int', 'pointer', 'uint']);
    },
    // off_t lseek(int fd, off_t offset, int whence);
    lseek: () => {
        const ptr = Module.getExportByName('libc.so', 'lseek');
        return new NativeFunction(ptr, 'pointer', ['int', 'pointer', 'int']);
    },
    // FILE *fopen(const char *restrict pathname, const char *restrict mode);
    fopen: () => {
        const ptr = Module.getExportByName('libc.so', 'fopen');
        return new SystemFunction(ptr, 'pointer', ['pointer', 'pointer']);
    },
    // FILE *fdopen(int fd, const char *mode);
    fdopen: () => {
        const ptr = Module.getExportByName('libc.so', 'fdopen');
        return new SystemFunction(ptr, 'pointer', ['int', 'pointer']);
    },
    // FILE *freopen(const char *restrict pathname, const char *restrict mode, FILE *restrict stream);
    freopen: () => {
        const ptr = Module.getExportByName('libc.so', 'freopen');
        return new SystemFunction(ptr, 'pointer', ['pointer', 'pointer', 'pointer']);
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
    // int pthread_create(pthread_t *restrict thread, const pthread_attr_t *restrict attr, void *(*start_routine)(void *), void *restrict arg);
    pthread_create: () => {
        const ptr = Module.getExportByName('libc.so', 'pthread_create');
        return new NativeFunction(ptr, 'int', ['pointer', 'pointer', 'pointer', 'pointer']);
    },
    // pthread_t pthread_self(void);
    pthread_self: () => {
        const ptr = Module.getExportByName('libc.so', 'pthread_self');
        return new NativeFunction(ptr, 'pointer', []);
    },
    // int pthread_getattr_np(pthread_t thread, pthread_attr_t *attr);
    pthread_getattr_np: () => {
        const ptr = Module.getExportByName('libc.so', 'pthread_getattr_np');
        return new NativeFunction(ptr, 'int', ['pointer', 'pointer']);
    },
    // int pthread_join(pthread_t thread, void **retval);
    pthread_join: () => {
        const ptr = Module.getExportByName('libc.so', 'pthread_join');
        return new NativeFunction(ptr, 'int', ['pointer', 'pointer']);
    },
    // int pthread_gettid_np(pthread_t *thread);
    pthread_gettid_np: () => {
        const ptr = Module.getExportByName('libc.so', 'pthread_gettid_np');
        return new NativeFunction(ptr, 'uint', ['pointer']);
    },
    // int pthread_getname_np(pthread_t *thread, const char * name, size_t len);
    pthread_getname_np: () => {
        const ptr = Module.getExportByName('libc.so', 'pthread_getname_np');
        return new NativeFunction(ptr, 'int', ['pointer', 'pointer', 'size_t']);
    },
    // double difftime(time_t __time1, time_t __time0)
    difftime: () => {
        const ptr = Module.getExportByName('libc.so', 'difftime');
        return new NativeFunction(ptr, 'double', ['pointer', 'pointer']);
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
    // int execv(const char *path, char *const argv[]);
    execv: () => {
        const ptr = Module.getExportByName('libc.so', 'execv');
        return new NativeFunction(ptr, 'int', ['pointer', 'pointer']);
    },
    // void *dlopen(const char *filename, int flags);
    dlopen: () => {
        const ptr = Module.getExportByName('libc.so', 'dlopen');
        return new NativeFunction(ptr, 'pointer', ['pointer', 'int']);
    },
    // void *dlsym(void *restrict handle, const char *restrict symbol);
    dlsym: () => {
        const ptr = Module.getExportByName('libc.so', 'dlsym');
        return new NativeFunction(ptr, 'pointer', ['pointer', 'pointer']);
    },
    // int dlclose(void *handle);
    dlclose: () => {
        const ptr = Module.getExportByName('libc.so', 'dlclose');
        return new NativeFunction(ptr, 'int', ['pointer']);
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
    // int __statfs64(const char *, size_t, struct statfs *);
    __statfs64: () => {
        const ptr = Module.getExportByName('libc.so', '__statfs64');
        return new NativeFunction(ptr, 'int', ['pointer', 'int', 'pointer']);
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
    // ssize_t getline(char **restrict lineptr, size_t *restrict n, FILE *restrict stream);
    getline: () => {
        const ptr = Module.getExportByName('libc.so', 'getline');
        return new NativeFunction(ptr, 'int', ['pointer', 'pointer', 'int']);
    },
    // int sscanf(const char *restrict str, const char *restrict format, ...);
    sscanf: () => {
        const ptr = Module.getExportByName('libc.so', 'sscanf');
        return new NativeFunction(ptr, 'int', ['pointer', 'pointer', '...']);
    },
    // FILE *popen(const char *command, const char *type);
    popen: () => {
        const ptr = Module.getExportByName('libc.so', 'popen');
        return new NativeFunction(ptr, 'pointer', ['pointer', 'pointer']);
    },
    // FILE *pclose(FD);
    pclose: () => {
        const ptr = Module.getExportByName('libc.so', 'pclose');
        return new NativeFunction(ptr, 'int', ['pointer']);
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
    // int unlink(const char *pathname);
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
    // [[noretunr]] void abort(int status);
    abort: () => {
        const ptr = Module.getExportByName('libc.so', 'abort');
        return new NativeFunction(ptr, 'void', ['int']);
    },
    // [[noretunr]] void abort(int status);
    raise: () => {
        const ptr = Module.getExportByName('libc.so', 'raise');
        return new NativeFunction(ptr, 'int', ['int']);
    },
    // int rcx(pid_t pid, int sig);
    kill: () => {
        const ptr = Module.getExportByName('libc.so', 'kill');
        return new NativeFunction(ptr, 'int', ['pointer', 'int']);
    },
    // long ptrace(enum __ptrace_request request, pid_t pid, void *addr, void *data);
    ptrace: () => {
        const ptr = Module.getExportByName('libc.so', 'ptrace');
        return new NativeFunction(ptr, 'long', ['int', 'int', 'pointer', 'pointer']);
    },
    // int system(const char *command);
    system: () => {
        const ptr = Module.getExportByName('libc.so', 'system');
        return new NativeFunction(ptr, 'int', ['pointer']);
    },
    // int system(const char *command);
    strerror: () => {
        const ptr = Module.getExportByName('libc.so', 'strerror');
        return new NativeFunction(ptr, 'pointer', ['int']);
    },
    // int sprintf ( char * str, const char * format, ... );
    sprintf: () => {
        const ptr = Module.getExportByName('libc.so', 'sprintf');
        return new NativeFunction(ptr, 'int', ['pointer', 'pointer', '...']);
    },
    // int vsnprintf (char * s, size_t n, const char * format, va_list arg );
    vsnprintf: () => {
        const ptr = Module.getExportByName('libc.so', 'vsnprintf');
        return new NativeFunction(ptr, 'int', ['pointer', 'int', 'pointer', '...']);
    },
    // long int atol ( const char * str );
    atoi: () => {
        const ptr = Module.getExportByName('libc.so', 'atol');
        return new NativeFunction(ptr, 'long', ['pointer']);
    },
    // int atoi (const char * str);
    atol: () => {
        const ptr = Module.getExportByName('libc.so', 'atoi');
        return new NativeFunction(ptr, 'int', ['pointer']);
    },
    // long int strtol (const char* str, char** endptr, int base);
    strtol: () => {
        const ptr = Module.getExportByName('libc.so', 'strtol');
        return new NativeFunction(ptr, 'int32', ['pointer', 'pointer', 'int']);
    },
    // unsigned long int strtoul (const char* str, char** endptr, int base);
    strtoul: () => {
        const ptr = Module.getExportByName('libc.so', 'strtoul');
        return new NativeFunction(ptr, 'uint32', ['pointer', 'pointer', 'int']);
    },
    // long long int strtoll (const char* str, char** endptr, int base);
    strtoll: () => {
        const ptr = Module.getExportByName('libc.so', 'strtoll');
        return new NativeFunction(ptr, 'int64', ['pointer', 'pointer', 'int']);
    },
    // unsigned long long int strtoull (const char* str, char** endptr, int base);
    strtoull: () => {
        const ptr = Module.getExportByName('libc.so', 'strtoull');
        return new NativeFunction(ptr, 'uint64', ['pointer', 'pointer', 'int']);
    },
    // int memcmp (const void * ptr1, const void * ptr2, size_t num);
    memcmp: () => {
        const ptr = Module.getExportByName('libc.so', 'memcmp');
        return new NativeFunction(ptr, 'int', ['pointer', 'pointer', 'int']);
    },
    // unsigned long getauxval(unsigned long type);
    getauxval: () => {
        const ptr = Module.getExportByName('libc.so', 'getauxval');
        return new NativeFunction(ptr, 'uint32', ['uint32']);
    },
    // int posix_spawn(pid_t *restrict pid, const char *restrict path,
    //                 const posix_spawn_file_actions_t *restrict file_actions,
    //                 const po six_spawnattr_t *restrict attrp, 
    //                 char *const argv[restrict], 
    //                 char *const envp[restrict]);
    posix_spawn: () => {
        const ptr = Module.getExportByName('libc.so', 'posix_spawn');
        return new NativeFunction(ptr, 'int', ['int', 'pointer', 'pointer', 'pointer', 'pointer']);
    },
    // long syscall(long number, ...);
    syscall: () => {
        const ptr = Module.getExportByName('libc.so', 'syscall');
        return new NativeFunction(ptr, 'int32', ['int32', '...']);
    },
    // __sighandler_t signal(int __sig,__sighandler_t __handler);
    signal: () => {
        const ptr = Module.getExportByName('libc.so', 'signal');
        return new NativeFunction(ptr, 'pointer', ['int', 'pointer']);
    },
    // char * __cxa_demangle (const char *mangled_name, char *output_buffer, size_t *length, int *status)
    __cxa_demangle: () => {
        // const pt  = Module.getExportByName('libunwindstack.so', '__cxa_demangle');
        const ptr = DebugSymbol.fromName('__cxa_demangle').address;
        return new NativeFunction(ptr, 'pointer', ['pointer', 'pointer', 'pointer', 'pointer']);
    },
};

type LibcType = PropertyCallbackMapper<typeof LibcFinder>;
const LibcFinderProxy: LibcType = proxyCallback(LibcFinder);
export { LibcFinderProxy, type LibcType };
`
  #include <gum/guminterceptor.h>
  #include <stdio.h>
  #include <stdarg.h>

  void init() {
    printf("hi")
  }
`;
