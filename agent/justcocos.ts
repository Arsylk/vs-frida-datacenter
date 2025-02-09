import * as Anticloak from '@clockwork/anticloak';
import { Color, logger } from '@clockwork/logging';
import * as Native from '@clockwork/native';
import { hookException, Linker } from '@clockwork/common';
const { red, magentaBright: pink, gray, dim, black } = Color.use();

const predicate: (ptr: NativePointer) => true | undefined = () => true;

Native.attachSystemPropertyGet(predicate, (key) => {
    const value = Anticloak.BuildProp.propMapper(key);
    return value;
});

Native.Files.hookFopen(predicate, true, (path) => {
    if (path?.endsWith('/su') || path?.endsWith('/mountinfo') || path?.endsWith('/maps')) {
        return path.replace(/\/(su|mountinfo|maps)$/i, '/nya');
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
        let item = Linker.getSoListHead();
        let prev: typeof item | null = null;
        while (item) {
            const name = item.getName();
            if (name === 'libfrida-agent-raw.so') {
                prev?.setNext(item.getNext());
            }
            prev = item;
            item = item.getNext();
        }
        hookException([160], {
            onBefore({ x0 }, num) {
                switch (num) {
                    case 160:
                        this._x0 = x0;
                        break;
                }
            },
            onAfter(_, num) {
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

        Native.Files.hookOpendir(predicate, (path) => {
            if (
                path?.startsWith('/proc') &&
                (path?.includes('/task') ||
                    path.endsWith('/fd') ||
                    path.endsWith('/status') ||
                    path.endsWith('/fs/jbd2'))
            )
                return '/dev/null';
        });
    }
});
