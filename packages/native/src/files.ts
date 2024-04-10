import { Libc, Struct } from '@clockwork/common';
import { Color, logger } from '@clockwork/logging';
import { Inject } from './inject.js';
import { number } from '@clockwork/logging/dist/color.js';
import { readFdPath } from './utils.js';
const { bold, dim, green, red, italic, gray } = Color.use();

enum Mode {
    F_OK = 0,
    X_OK = 1,
    W_OK = 2,
    R_OK = 4,
}

function hookAccess(predicate: (ptr: NativePointer) => boolean, fn?: (path: string, mode: Mode, isOk: boolean) => void) {
    const empty = dim('-');
    function log(this: InvocationContext | CallbackContext, path: string | null, mode: Mode | null, ret: number, tag: string) {
        const isOk = ret !== -1;
        mode ??= 0;
        const mask = `?${mode & Mode.R_OK ? 'R' : empty}${mode & Mode.W_OK ? 'W' : empty}${mode & Mode.X_OK ? 'X' : empty}`;
        const uri = isOk ? dim(green(`${path}`)) : dim(red(`${path}`));

        logger.info({ tag: tag }, `${uri} ${mask}`);
    }

    Interceptor.replace(
        Libc.access,
        new NativeCallback(
            function (pathname, mode) {
                const ret = Libc.access(pathname, mode);
                if (predicate(this.returnAddress)) {
                    log.call(this, pathname.readCString(), mode as Mode, ret, 'access');
                }
                return ret;
            },
            'int',
            ['pointer', 'int'],
        ),
    );
    Interceptor.replace(
        Libc.faccessat,
        new NativeCallback(
            function (fd, path, mode, flag) {
                const ret = Libc.faccessat(fd, path, mode, flag);
                if (predicate(this.returnAddress)) {
                    log.call(this, path.readCString(), mode as Mode, ret, 'faccessat');
                }
                return ret;
            },
            'int',
            ['int', 'pointer', 'int', 'int'],
        ),
    );
}

function hookOpen(predicate: (ptr: NativePointer) => boolean) {
    function log(
        this: InvocationContext | CallbackContext,
        uri: string | null,
        flags: number | null,
        mode: number | null,
        ret: number,
        key: string,
    ) {
        const isOk = ret !== -1;
        const struri = !isOk ? red(gray(`${uri}`)) : gray(`${uri}`);

        logger.info({ tag: key }, `${struri} flags: ${flags}, ${mode ?  'mode: ' + mode : ''}`);
    }
    Interceptor.replace(
        Libc.open,
        new NativeCallback(
            function (pathname, flags, ...any) {
                const ret = Libc.open(pathname, flags, ...any);
                if (predicate(this.returnAddress)) {
                    log.call(this, pathname.readCString(), flags, null, ret, 'open');
                }
                return ret;
            },
            'int',
            ['pointer', 'int'],
        ),
    );
    Interceptor.replace(
        Libc.creat,
        new NativeCallback(
            function (pathname, mode) {
                const ret = Libc.creat(pathname, mode);
                if (predicate(this.returnAddress)) {
                    log.call(this, pathname.readCString(), null, mode, ret, 'creat');
                }
                return ret;
            },
            'int',
            ['pointer', 'int'],
        ),
    );
    Interceptor.replace(
        Libc.openat,
        new NativeCallback(
            function (dirfd, pathname, flags, ...any) {
                const ret = Libc.openat(dirfd, pathname, flags, ...any);
                if (predicate(this.returnAddress)) {
                    log.call(this, pathname.readCString(), flags, null, ret, 'openat');
                }
                return ret;
            },
            'int',
            ['int', 'pointer', 'int'],
        ),
    );
}

function hookFopen(
    predicate: (ptr: NativePointer) => boolean,
    fn?: (path: string, mode: Mode, isOk: boolean) => void,
    statfd: boolean = false,
) {
    function log(
        this: InvocationContext | CallbackContext,
        uri: string | number | null,
        mode: string | null,
        stream: NativePointer | null,
        ret: NativePointer,
        key: string,
    ) {
        const isFd = typeof uri === 'number';
        let strpath = isFd ? `<fd:${uri}>` : `${uri}`;
        const isOk = ret && !ret.isNull();

        if (isFd && statfd) {
            const infs = readFdPath(uri);
            strpath += `-> "${infs}"`;
        }

        const struri = isOk ? dim(`${strpath}`) : dim(red(`${strpath}`));
        const strmod = `${mode}`.padEnd(2);
        logger.info({ tag: key }, `${struri} ${strmod} ${!stream ? '' : `->${stream}`}`);
    }

    Interceptor.replace(
        Libc.fopen,
        new NativeCallback(
            function (pathname, mode) {
                const ret = Libc.fopen(pathname, mode);
                if (predicate(this.returnAddress)) {
                    log.call(this, pathname.readCString(), mode.readCString(), null, ret, 'fopen');
                }
                return ret;
            },
            'pointer',
            ['pointer', 'pointer'],
        ),
    );
    Interceptor.replace(
        Libc.fdopen,
        new NativeCallback(
            function (fd, mode) {
                const ret = Libc.fdopen(fd, mode);
                if (predicate(this.returnAddress)) {
                    log.call(this, fd, mode.readCString(), null, ret, 'fdopen');
                }
                return ret;
            },
            'pointer',
            ['int', 'pointer'],
        ),
    );
    Interceptor.replace(
        Libc.freopen,
        new NativeCallback(
            function (pathname, mode, stream) {
                const ret = Libc.freopen(pathname, mode, stream);
                if (predicate(this.returnAddress)) {
                    log.call(this, pathname.readCString(), mode.readCString(), stream, ret, 'freopen');
                }
                return ret;
            },
            'pointer',
            ['pointer', 'pointer', 'pointer'],
        ),
    );
}

function hookStat(predicate: (ptr: NativePointer) => boolean) {
    function log(this: InvocationContext | CallbackContext, uri: string | number | null, statbuf: NativePointer, ret: number, tag: string) {
        const isFd = typeof uri === 'number';
        const strpath = isFd ? `<fd:${uri}>` : `${uri}`;
        const isOk = ret === 0;

        let strmsg = isOk ? dim(`${strpath}`) : dim(red(`${strpath}`));
        if (isFd) {
            const target = readFdPath(uri);
            strmsg += ` -> "${gray(`${target}`)}"`;
        }

        strmsg += `@${statbuf}`;
        // const stat = Struct.Stat.stat(statbuf);
        // strmsg += ` ${JSON.stringify(Struct.toObject(stat))}`

        logger.info({ tag: tag }, strmsg);
    }

    const array: ('stat' | 'lstat')[] = ['stat', 'lstat'];
    array.forEach((key) => {
        const func = Libc[key];
        Interceptor.replace(
            func,
            new NativeCallback(
                function (pathname, statbuf) {
                    const ret = func(pathname, statbuf);
                    if (predicate(this.returnAddress)) {
                        log.call(this, pathname.readCString(), statbuf, ret, key);
                    }
                    return ret;
                },
                'int',
                ['pointer', 'pointer'],
            ),
        );
    });
    Interceptor.replace(
        Libc.fstat,
        new NativeCallback(
            function (fd, statbuf) {
                const ret = Libc.fstat(fd, statbuf);
                if (predicate(this.returnAddress)) {
                    log.call(this, fd, statbuf, ret, 'fstat');
                }
                return ret;
            },
            'int',
            ['int', 'pointer'],
        ),
    );
}

function hookRemove(predicate: (ptr: NativePointer) => boolean) {
    const array: ('remove' | 'unlink')[] = ['remove', 'unlink'];
    array.forEach((key) => {
        const func = Libc[key];
        Interceptor.replace(
            func,
            new NativeCallback(
                function (pathname) {
                    const ret = func(pathname);
                    if (predicate(this.returnAddress)) {
                        const strpath = pathname.readCString();
                        // const isOk = ret !== -1;

                        logger.info({ tag: key }, `${bold(gray(`${strpath}`))}`);
                    }
                    return ret;
                },
                'int',
                ['pointer'],
            ),
        );
    });
}

function hookReadlink(predicate: (ptr: NativePointer) => boolean) {
    Interceptor.replace(
        Libc.readlink,
        new NativeCallback(
            function (pathname, buf, bufsize) {
                const ret = Libc.readlink(pathname, buf, bufsize);
                if (predicate(this.returnAddress)) {
                    const lnstring = pathname.readCString();
                    const rlstring = buf.readCString(bufsize);
                    const frlstring = rlstring?.replace(/�.*$/g, '')
                    logger.info({ tag: 'readlink' }, `"${lnstring}" -> "${frlstring}"`);
                }
                return 0;
            },
            'int',
            ['pointer', 'pointer', 'int'],
        ),
    );
}

export { hookAccess, hookOpen, hookFopen, hookStat, hookRemove, hookReadlink };