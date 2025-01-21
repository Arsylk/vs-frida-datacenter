import { getSelfProcessName } from '@clockwork/native';
import * as Anticloak from '@clockwork/anticloak';
import { Color, logger } from '@clockwork/logging';
import * as Native from '@clockwork/native';
import { hookException, Struct, Syscalls } from '@clockwork/common';
const { red, green, redBright, magentaBright: pink, gray, dim, black } = Color.use();

const predicate: (ptr: NativePointer) => true | undefined = () => true;

Native.attachSystemPropertyGet(predicate, (key) => {
    const value = Anticloak.BuildProp.propMapper(key);
    return value;
});

Native.Files.hookFopen(predicate, true, (path) => {
    if (path?.endsWith('/su') || path?.endsWith('/mountinfo')) {
        return path.replace(/\/(su|mountinfo)$/, '/nya');
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
    Libc.fgets,
    new NativeCallback(
        function (buffer, size, fp) {
            const retval = Libc.fgets(buffer, size, fp);

            if (predicate(this.returnAddress)) {
                const endUserMssg = buffer.readCString()?.trimEnd();
                if (
                    endUserMssg?.includes('KSU') ||
                    endUserMssg?.includes('debug_ramdisk') ||
                    endUserMssg?.includes('devpts') ||
                    endUserMssg?.includes('tracefs') ||
                    endUserMssg?.includes('tmpfs') ||
                    endUserMssg?.includes('ramdisk') ||
                    endUserMssg?.includes('virtio') ||
                    endUserMssg?.includes('weishu') ||
                    endUserMssg?.includes('magisk') ||
                    endUserMssg?.includes('frida') ||
                    endUserMssg?.includes('gbond') ||
                    endUserMssg?.includes('termux')
                ) {
                    logger.info({ tag: 'fgets' }, `${endUserMssg} ${red('SKIP')}`);
                    Libc.fclose(fp);
                    return Libc.fgets(buffer, size, fp);
                }
            }
            return retval;
        },
        'pointer',
        ['pointer', 'int', 'pointer'],
    ),
);

Native.Inject.onPrelinkOnce((module) => {
    const { base, name, size } = module;
    if (name === 'libreveny.so') {
        let _x0: any = null;
        hookException([160], {
            onBefore({ x0, x8 }) {
                const num = x8.toInt32();
                switch (num) {
                    case 160:
                        _x0 = x0;
                        break;
                }
            },
            onAfter({ x0 }, num) {
                switch (num) {
                    case 160:
                        {
                            const addr = _x0.add(0x41 * 2);
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

        Native.Strings.hookStrstr(predicate);

        const buffer = Memory.alloc(512);
        Interceptor.replace(
            Libc.open,
            new NativeCallback(
                (pathnameptr, flag) => {
                    const pathname = pathnameptr.readCString();
                    //logger.info({ tag: 'open' }, `${pathname} ${flag}`);
                    const realFd = Libc.open(pathnameptr, flag).value;
                    if (pathname?.includes('maps')) {
                        const path = `/data/data/${getSelfProcessName()}/fake_map`;
                        //@ts-ignore
                        const file = new File(path, 'w');

                        while (Libc.read(realFd, buffer, 512) !== 0) {
                            const oneLine = buffer.readCString();

                            if (!oneLine?.includes('tmp')) {
                                file.write(oneLine);
                            }
                        }
                        Libc.close(realFd);
                        const newPathname = Memory.allocUtf8String(path);
                        return Libc.open(newPathname, flag).value;
                    }
                    return realFd;
                },
                'int',
                ['pointer', 'int'],
            ),
        );
        Native.Files.hookDirent(() => true);
        Native.Files.hookOpendir(
            () => true,
            (path) => {
                if (
                    path?.startsWith('/proc') &&
                    (path?.includes('/task') ||
                        path.endsWith('/fd') ||
                        path.endsWith('/status') ||
                        path.endsWith('/fs/jbd2'))
                )
                    return '/dev/null';
            },
        );
    }
});
