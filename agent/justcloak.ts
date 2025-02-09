import * as Anticloak from '@clockwork/anticloak';
import { ProcMaps } from '@clockwork/cmodules';
import { Linker, Text, hookException } from '@clockwork/common';
import { dumpLib } from '@clockwork/dump';
import { always, hook } from '@clockwork/hooks';
import * as JniTrace from '@clockwork/jnitrace';
import { Color, logger } from '@clockwork/logging';
import { getSelfProcessName } from '@clockwork/native';
import * as Native from '@clockwork/native';
import { InterruptorAgent } from '@reversense/interruptor/src/common/InterruptorAgent';
const { red, green, redBright, magentaBright: pink, gray, dim, black } = Color.use();

const predicate: (ptr: NativePointer) => true | undefined = () => true;

Native.attachSystemPropertyGet(predicate, (key) => {
    const value = Anticloak.BuildProp.propMapper(key);
    return value;
});

Native.Files.hookFopen(predicate, true, (path) => {
    if (
        path?.endsWith('/su') ||
        path?.endsWith('/mountinfo') ||
        path?.endsWith('/maps') ||
        path?.endsWith('/stat') ||
        path?.endsWith('/comm')
    ) {
        return path.replace(/\/(su|mountinfo|maps)$/, '/nya');
    }
    if (
        path?.includes('magisk') ||
        path?.includes('supolicy') ||
        path?.toLowerCase()?.includes('superuser')
    ) {
        return path.replace(/(magisk|supolicy|superuser)/gi, 'nya');
    }
});

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

//setImmediate(Java.performNow.bind(Java, () => Anticloak.Country.mock('VN')));
//setImmediate(
//    Java.perform.bind(Java, () => {
//        logger.info({ tag: 'pid' }, `${Process.id}`);
//        Classes.Thread.sleep(1_000);
//    }),
//);

Native.TheEnd.hook(() => true);
Native.Inject.onPrelinkOnce((module) => {
    const isNotFrida = (r: NativePointer) => !ProcMaps.isFridaAddress(r) && `${r}`.includes('0xab');
    const { base, name, size } = module;
    if (name === 'base.odex') {
        Linker.patchSoList();
    }
    if (name === 'libjiagu_64.so' || name === 'libcovault-appsec.so' || name === 'libreveny.so') {
        //Native.memWatch(sus, 8, (details) => {
        //    logger.info({ tag: 'change' }, 'Text.stringify(details)');
        //});

        const addrs = [0x2250c, 0x7a824];
        MemoryAccessMonitor.enable(
            addrs.map((off) => ({ base: base.add(off), size: 8 })),
            {
                onAccess(details) {
                    const { operation, from, rangeIndex } = details;
                    i;
                },
            },
        );
        for (const off of addrs) {
            const addr = base.add(off);
            Memory.patchCode(addr, 8, () => {
                const writer = new Arm64Writer(addr);
                writer.putNop();
                writer.flush();
            });
        }

        Native.Files.hookOpen(
            (r) => !ProcMaps.isFridaAddress(r),
            (path) => {
                if (path?.endsWith('/build.prop')) return '/dev/null';
                if (path?.endsWith('/maps')) return `${path}/nya`;
                if (path?.endsWith('/status')) return `${path}/nya`;
                if (path?.endsWith('/mounts')) return `${path}/nya`;
                if (path?.endsWith('/mods')) return `${path}/nya`;
                if (path?.endsWith('/comm')) return `${path}/nya`;

                //if (path?.includes('classes') && path?.includes('.dex')) hexdump(NULL);
            },
        );

        Native.replace(Libc.dlopen, 'pointer', ['pointer', 'int'], (s0, i1) => {
            const str = s0.readCString();
            const list = Linker.getParsedList();
            for (const { base, name } of list) {
                if (str === name) {
                    return base;
                }
            }
        });
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
        //Native.log(Libc.read, 'iip', { predicate: (ret) => !ProcMaps.isFridaAddress(ret) });
        hookException([160], {
            onBefore({ x0 }, num) {
                switch (num) {
                    case 160:
                        this._x0 = x0;
                        break;
                }
            },
            onAfter({ x0 }, num) {
                switch (num) {
                    case 160:
                        {
                            const addr = this._x0.add(0x41 * 2);
                            const text = addr.readCString().toLowerCase();

                            for (const key of ['ksu', 'kernelsu', 'lineage', 'dirty']) {
                                const i = text.indexOf(key);
                                if (i !== -1) {
                                    addr.add(i).writeByteArray(new Array(key.length).fill(0x0));
                                }
                            }
                        }
                        break;
                }
            },
        });

        Native.Strings.hookStrstr(Native.isInRange.bind(module));
        Native.Strings.hookStrtok(Native.isInRange.bind(module));
        Native.Strings.hookStrcmp((r) => !ProcMaps.isFridaAddress(r));
        //Native.Files.hookReadlink((r) => !ProcMaps.isFridaAddress(r));
        Native.Files.hookAccess((r) => !ProcMaps.isFridaAddress(r));
        Native.Files.hookRemove((r) => !ProcMaps.isFridaAddress(r));

        // let _arg: any = null;
        const cb = new NativeCallback(
            function (arg0, arg1) {
                const ret = Libc.dladdr(arg0, arg1);

                if (Native.isInRange(module, this.returnAddress)) {
                    let name = null;
                    name = Native.addressOf(arg1);
                    logger.info({ tag: 'dladdr' }, `(${arg0}, ${arg1}) -> ${name} ${ret}`);
                }
                return ret;
            },
            'int',
            ['pointer', 'pointer'],
        );
        Interceptor.replace(Libc.dladdr, cb);

        Native.log(
            Process.getModuleByName('libart.so')
                .enumerateSymbols()
                .filter((x) => x.name.includes('art_sigsegv_fault'))[0].address,
            '',
            {
                call(args) {
                    ProcMaps.printStacktrace(this.context);
                },
            },
        );

        const lib_signal = new NativeFunction(
            Process.getModuleByName('libsigchain.so')
                .enumerateExports()
                .filter((x) => x.name.includes('signal'))[0].address,
            'int',
            ['int', 'pointer'],
        );
        Native.replace(lib_signal, 'int', ['int', 'pointer'], function (signo, handler) {
            logger.info({ tag: 'signal' }, `signo: ${signo} ${Native.addressOf(this.returnAddress)}`);
            ProcMaps.printStacktrace(this.context);
            dumpLib(name);
            return 0;
        });
        //Native.log(
        //    Process.getModuleByName('libsigchain.so')
        //        .enumerateExports()
        //        .filter((x) => x.name.includes('signal'))[0].address,
        //    '',
        //    {
        //        call(args) {
        //            this.context, this.returnAddress;
        //        },
        //    },
        //);

        Native.log(Libc.memcmp, 'ppi', {
            nolog: true,
            predicate: (ret) => !ProcMaps.isFridaAddress(ret),
            call(args) {
                const size = args[2].toInt32();
                const a0 = hexdump(args[0], {
                    header: false,
                    ansi: true,
                    length: Math.min(size, 0xf * 6),
                });
                const a1 = hexdump(args[1], {
                    header: false,
                    ansi: true,
                    length: Math.min(size, 0xf * 6),
                });
                const addr = Native.addressOf(this.returnAddress);
                if (addr.includes('0xc631c')) return;
                logger.info({ tag: 'memcmp' }, `${this.returnAddress} ${addr}`);
                logger.info({ tag: 'memcmp' }, `\n${a0}`);
                logger.info({ tag: 'memcmp' }, `\n${a1}`);
                logger.info(
                    { tag: 'memcmp' },
                    '==============================================================================',
                );
            },
        });
        //Native.log(Libc.memmove, 'ppi', {
        //    nolog: true,
        //    predicate: (ret) =>
        //        !ProcMaps.isFridaAddress(ret) && !`${Native.addressOf(ret)}`.includes('0xc631c'),
        //    call(args) {
        //        const size = args[2].toInt32();
        //        const a1 = hexdump(args[1], {
        //            header: false,
        //            ansi: true,
        //            length: Math.min(size, 0xf * 6),
        //        });
        //        const addr = Native.addressOf(this.returnAddress);
        //        if (addr.includes('0xc631c') || (addr.includes('fread_unlocked') && addr.includes('0x9c')))
        //            return;
        //        logger.info({ tag: 'memmove' }, `${this.returnAddress} ${addr}`);
        //        logger.info({ tag: 'memmove' }, `\n${a1}`);
        //        logger.info(
        //            { tag: 'memmove' },
        //            '==============================================================================',
        //        );
        //    },
        //});
    }
});
