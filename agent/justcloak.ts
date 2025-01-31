import { getSelfProcessName } from '@clockwork/native';
import * as Anticloak from '@clockwork/anticloak';
import { Color, logger } from '@clockwork/logging';
import * as Native from '@clockwork/native';
import { ProcMaps } from '@clockwork/cmodules';
import { hookException } from '@clockwork/common';
import { prebindSourceFile } from 'frida-compile/ext/typescript';
import { dumpLib } from '@clockwork/dump';
const { red, green, redBright, magentaBright: pink, gray, dim, black } = Color.use();

const predicate: (ptr: NativePointer) => true | undefined = () => true;

Native.attachSystemPropertyGet(predicate, (key) => {
    const value = Anticloak.BuildProp.propMapper(key);
    return value;
});

//Native.Files.hookFopen(predicate, true, (path) => {
//    if (path?.endsWith('/su') || path?.endsWith('/mountinfo')) {
//        return path.replace(/\/(su|mountinfo)$/, '/nya');
//    }
//    if (
//        path?.includes('magisk') ||
//        path?.includes('supolicy') ||
//        path?.toLowerCase()?.includes('superuser')
//    ) {
//        return path.replace(/(magisk|supolicy|superuser)/gi, 'nya');
//    }
//});
Interceptor.replace(
    Libc.popen,
    new NativeCallback(
        (a0, a1) => {
            logger.info({ tag: 'popen' }, `${a0.readCString()}`);
            return Libc.popen(Memory.allocUtf8String('nya'), a1);
        },
        'pointer',
        ['pointer', 'pointer'],
    ),
);

Native.Files.hookFgets(predicate);

Native.Inject.onPrelinkOnce((module) => {
    const { base, name, size } = module;
    if (name === 'libjiagu_64.so') {
        //hookException([], {
        //    onBefore({ x0, x8 }) {
        //        const num = x8.toInt32();
        //        switch (num) {
        //            case 160:
        //                _x0 = x0;
        //                break;
        //        }
        //    },
        //    onAfter({ x0 }, num) {
        //        switch (num) {
        //            case 160:
        //                {
        //                    const addr = _x0.add(0x41 * 2);
        //                    const text = addr.readCString().toLowerCase();
        //
        //                    for (const key of ['ksu', 'kernelsu', 'lineage', 'dirty']) {
        //                        const i = text.indexOf(key);
        //                        if (i !== -1) {
        //                            addr.add(i).writeByteArray(new Array(key.length).fill(0x0));
        //                        }
        //                    }
        //                }
        //                break;
        //        }
        //    },
        //});

        Native.Strings.hookStrstr((r) => !ProcMaps.isFridaAddress(r));
        Interceptor.replace(
            Libc.open,
            new NativeCallback(
                (pathnameptr, flag) => {
                    const pathname = pathnameptr.readCString();
                    logger.info({ tag: 'open' }, `${pathname} ${flag}`);
                    if (pathname?.startsWith('/proc/') && pathname?.endsWith('/maps')) {
                        const path = `${Native.getSelfFiles()}/fd/`;
                        Native.mkdir(path);
                        const newpathname = `${path}${pathname.replaceAll('/', '_')}`;

                        const contents = File.readAllText(pathname)
                            .split('\n')
                            .filter((line) => !line.includes('/tmp'))
                            .filter((line) => !line.includes('com.android.adb'))
                            .filter((line) => !line.includes('libadb'))
                            .filter((line) => !line.includes('shadow map'))
                            .filter((line) => !(line.includes('rwxp') && line.includes('libart.so')))
                            .filter((line) => !(line.includes('rwxp') && line.includes('boot.oat')))
                            .filter((line) => !(line.includes('rwxp') && line.includes('libGLESv1_CM.so')))
                            .filter((line) => !line.match(/r[w-][x-]p .+\/memfd:jit-cache/))
                            .join('\n');
                        File.writeAllText(newpathname, '');

                        return Libc.open(Memory.allocUtf8String(newpathname), flag).value;
                    }
                    const realFd = Libc.open(pathnameptr, flag).value;
                    return realFd;
                },
                'int',
                ['pointer', 'int'],
            ),
        );
        const s = () => dumpLib('libjiagu_64.so');

        //Native.log(Libc.open, 'si', {
        //    ret(retval) {
        //        ProcMaps.printStacktrace(this.context);
        //    },
        //});
        Native.log(
            Libc.memcpy,
            'ppi',
            {
                predicate: (ret) => !ProcMaps.isFridaAddress(ret),
                call(args) {
                    const size = args[2].toInt32();
                    const a1 = hexdump(args[1], {
                        header: false,
                        ansi: true,
                        length: Math.min(size, 0xf * 6),
                    });
                    logger.info({ tag: 'memcpy' }, `\n${a1}`);
                    logger.info(
                        { tag: 'memcpy' },
                        '==============================================================================',
                    );
                },
            },
            s,
        );
        Native.log(Libc.memmove, 'ppi', {
            predicate: (ret) => !ProcMaps.isFridaAddress(ret),
            call(args) {
                const size = args[2].toInt32();
                const a1 = hexdump(args[1], {
                    header: false,
                    ansi: true,
                    length: Math.min(size, 0xf * 6),
                });
                logger.info({ tag: 'memmove' }, `\n${a1}`);
                logger.info(
                    { tag: 'memmove' },
                    '==============================================================================',
                );
            },
        });
        Native.log(
            Libc.memcmp,
            'ppi',
            {
                //base: Module.getBaseAddress('libjiagu_64.so'),
                predicate: (ret) => !ProcMaps.isFridaAddress(ret),
                call(args) {
                    const size = args[2].toInt32();
                    const a0 = hexdump(args[0], { header: false, ansi: true, length: Math.min(size, 0xf) });
                    const a1 = hexdump(args[1], {
                        header: false,
                        ansi: true,
                        length: Math.min(size, 0xf * 6),
                    });
                    logger.info({ tag: 'memcmp' }, `\n${a0}`);
                    logger.info({ tag: 'memcmp' }, `\n${a1}`);
                    logger.info(
                        { tag: 'memcmp' },
                        '==============================================================================',
                    );
                },
            },
            s,
        );
        //Native.Files.hookDirent(() =>
        //Native.Files.hookOpendir(
        //    () => truea0,
        //    (path) => {
        //        if (
        //            path?.startsWith('/proc') &&
        //            (path?.includes('/task') ||
        //                path.endsWith('/fd') ||
        //                path.endsWith('/status') ||
        //                path.endsWith('/fs/jbd2'))
        //        )
        //            return '/dev/null';
        //    },
        //);
    }
});
