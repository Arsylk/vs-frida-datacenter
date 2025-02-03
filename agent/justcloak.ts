import * as Anticloak from '@clockwork/anticloak';
import { ProcMaps } from '@clockwork/cmodules';
import { Linker } from '@clockwork/common';
import { dumpLib } from '@clockwork/dump';
import { Color, logger } from '@clockwork/logging';
import { getSelfProcessName } from '@clockwork/native';
import * as Native from '@clockwork/native';
import * as JniTrace from '@clockwork/jnitrace';
const { red, green, redBright, magentaBright: pink, gray, dim, black } = Color.use();

const predicate: (ptr: NativePointer) => true | undefined = () => true;

Native.attachSystemPropertyGet(predicate, (key) => {
    const value = Anticloak.BuildProp.propMapper(key);
    return value;
});

// JniTrace.attach((r) => Native.predicate(r.returnAddress), true);

// Native.Files.hookFopen(predicate, true, (path) => {
//     if (path?.endsWith('/su') || path?.endsWith('/mountinfo') || path?.endsWith('/maps')) {
//         return path.replace(/\/(su|mountinfo|maps)$/, '/nya');
//     }
//     if (
//         path?.includes('magisk') ||
//         path?.includes('supolicy') ||
//         path?.toLowerCase()?.includes('superuser')
//     ) {
//         return path.replace(/(magisk|supolicy|superuser)/gi, 'nya');
//     }
// });
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

Native.Pthread.hookPthread_create();
Native.Files.hookFgets(predicate);
Native.Files.hookOpen(
    (r) => !ProcMaps.isFridaAddress(r),
    (path) => {
        if (path?.endsWith('/build.prop')) return '/dev/null';
        if (path?.endsWith('/maps')) return '/dev/null';
        if (path?.endsWith('/status')) return '/proc/9/status';
        if (path?.includes('classes') && path?.includes('.dex')) dumpLib('libjiagu_64.so', true);
    },
);

setImmediate(
    Java.perform.bind(Java, () => {
        Classes.Thread.sleep(5_000);
    }),
);

Native.Inject.onPrelinkOnce((module) => {
    const isNotFrida = (r: NativePointer) => !ProcMaps.isFridaAddress(r);
    const { base, name, size } = module;
    if (name === 'libjiagu_64.so') {
        Linker.patchSoList();
        Native.log(Libc.dlopen, 'si', { predicate: isNotFrida });
        Native.Files.hookDirent(isNotFrida);
        Native.Files.hookOpendir(isNotFrida, (path) => {
            if (
                path?.startsWith('/proc') &&
                (path?.includes('/task') ||
                    path.endsWith('/fd') ||
                    path.endsWith('/status') ||
                    path.endsWith('/fs/jbd2'))
            )
                return '/dev/null';
        });
        return;

        Native.log(Libc.open, 'si', {
            call(args) {
                this.path = args[0];
            },
            ret(retval) {
                const fd = retval.toInt32();
                const fdp = this.path.readCString();
                if (fdp?.endsWith('/status') || fdp?.endsWith('/maps') || fdp?.endsWith('/comm')) {
                    Libc.close(fd);
                }
            },
        });
        // Native.log(Libc.read, 'iip', { predicate: (ret) => !Native.addressOf(ret).includes('libbase') });
        // hookException([160], {
        //     onBefore({ x0 }, num) {
        //         switch (num) {
        //             case 160:
        //                 this._x0 = x0;
        //                 break;
        //         }
        //     },
        //     onAfter({ x0 }, num) {
        //         switch (num) {
        //             case 160:
        //                 {
        //                     const addr = this._x0.add(0x41 * 2);
        //                     const text = addr.readCString().toLowerCase();
        //
        //                     for (const key of ['ksu', 'kernelsu', 'lineage', 'dirty']) {
        //                         const i = text.indexOf(key);
        //                         if (i !== -1) {
        //                             addr.add(i).writeByteArray(new Array(key.length).fill(0x0));
        //                         }
        //                     }
        //                 }
        //                 break;
        //         }
        //     },
        // });

        // Native.Strings.hookStrstr((r) => !ProcMaps.isFridaAddress(r));
        // Native.Files.hookReadlink((r) => !ProcMaps.isFridaAddress(r));
        // Native.Files.hookAccess((r) => !ProcMaps.isFridaAddress(r));
        return;
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

                        const _contents = File.readAllText(pathname)
                            .split('\n')
                            .filter((line) => !line.includes('/tmp'))
                            .filter((line) => !line.includes('com.android.adb'))
                            .filter((line) => !line.includes('frida'))
                            .filter((line) => !line.includes('libadb'))
                            .filter((line) => !line.includes('shadow map'))
                            .filter((line) => !line.includes('startup_agent'))
                            .filter((line) => !line.includes('libperfetto_hprof'))
                            .filter((line) => !line.includes('libopenjdkjvmti'))
                            .filter((line) => !line.includes('libnpt'))
                            .filter((line) => !line.includes('libdt_fd_forward'))
                            .filter((line) => !line.includes('jwdp'))
                            .filter((line) => !(line.includes('rwxp') && line.includes('libart.so')))
                            .filter((line) => !line.includes('boot'))
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

        // let _arg: any = null;
        // Native.log(Libc.dladdr, 'pp', {
        //     call(args) {
        //         _arg = args[1];
        //     },
        //     ret(retval) {
        //         logger.info(
        //             { tag: 'dladdr' },
        //             `${_arg.readPointer().readCString()} ${_arg
        //                 .add(0x8 * 2)
        //                 .readPointer()
        //                 .readCString()}`,
        //         );
        //         logger.info(
        //             { tag: 'dladdr' },
        //             `${_arg.add(0x8).readPointer()} ${_arg.add(0x8 * 3).readPointer()}`,
        //         );
        //     },
        // });
        Native.log(Libc.strrchr, 'sc');
        // Native.log(
        //     Process.getModuleByName('libart.so')
        //         .enumerateSymbols()
        //         .filter((x) => x.name.includes('art_sigsegv_fault'))[0].address,
        //     '',
        //     {
        //         call(args) {
        //             printStacktrace(this.context, this.returnAddress);
        //         },
        //     },
        // );
        //
        // Native.log(
        //     Process.getModuleByName('libsigchain.so')
        //         .enumerateExports()
        //         .filter((x) => x.name.includes('signal'))[0].address,
        //     '',
        //     {
        //         call(args) {
        //             printStacktrace(this.context, this.returnAddress);
        //         },
        //     },
        // );
        // Native.log(module.getExportByName('inotify_init'), '');

        //Native.log(Libc.open, 'si', {
        //    ret(retval) {
        //        ProcMaps.printStacktrace(this.context);
        //    },
        //});
        // Native.log(Libc.memmove, 'ppi', {
        //     nolog: true,
        //     predicate: (ret) => !ProcMaps.isFridaAddress(ret),
        //     call(args) {
        //         const size = args[2].toInt32();
        //         const a1 = hexdump(args[1], {
        //             header: false,
        //             ansi: true,
        //             length: Math.min(size, 0xf * 6),
        //         });
        //         if (size === 1531368) {
        //             logger.info({ tag: 'path' }, `${args[0]}`);
        //             globalThis.__arg.writePointer(args[0]);
        //         }
        //         // logger.info({ tag: 'memmove' }, `\n${a1}`);
        //         // logger.info(
        //         //     { tag: 'memmove' },
        //         //     '==============================================================================',
        //         // );
        //     },
        // });
        // Native.log(Libc.memcmp, 'ppi', {
        //     //base: Module.getBaseAddress('libjiagu_64.so'),
        //     predicate: (ret) => !ProcMaps.isFridaAddress(ret),
        //     call(args) {
        //         const size = args[2].toInt32();
        //         const a0 = hexdump(args[0], { header: false, ansi: true, length: Math.min(size, 0xf) });
        //         const a1 = hexdump(args[1], {
        //             header: false,
        //             ansi: true,
        //             length: Math.min(size, 0xf * 6),
        //         });
        //         logger.info({ tag: 'memcmp' }, `\n${a0}`);
        //         logger.info({ tag: 'memcmp' }, `\n${a1}`);
        //         logger.info(
        //             { tag: 'memcmp' },
        //             '==============================================================================',
        //         );
        //     },
        // });
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
