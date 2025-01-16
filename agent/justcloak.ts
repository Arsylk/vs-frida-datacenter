import { getSelfProcessName } from '@clockwork/native';
import * as Anticloak from '@clockwork/anticloak';
import { Color, logger } from '@clockwork/logging';
import * as Native from '@clockwork/native';
import { hookException } from '@clockwork/common';
import { initSoDump } from '@clockwork/dump';
const { red, green, redBright, magentaBright: pink, gray, dim, black } = Color.use();

const predicate: (ptr: NativePointer) => true | undefined = () => true;

Native.attachSystemPropertyGet(predicate, (key) => {
    const value = Anticloak.BuildProp.propMapper(key);
    return value;
});

Native.Files.hookFopen(predicate, true, (path) => {
    //if (path?.endsWith('/maps') || path?.endsWith('/smaps') || path?.includes('/proc/self/environ')) {
    //    return `/data/data/${getSelfProcessName()}/files/fakes`;
    //}
    if (path?.endsWith('/su')) {
        return path.replace(/\/su$/, '/nya');
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
                    endUserMssg?.includes('gbond')
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
        let _x0 = null;
        hookException([160], {
            onBefore({ x0 }) {
                _x0 = x0;
            },
            onAfter({ x0 }) {
                const addr = _x0.add(0x41 * 2);
                const text = addr.readCString().toLowerCase();
                for (const key of ['ksu', 'kernelsu', 'lineage', 'dirty']) {
                    const i = text.indexOf(key);
                    if (i !== -1) {
                        addr.add(i).writeByteArray(new Array(key.length).map((_) => 0x0));
                    }
                }
            },
        });

        Anticloak.Debug.hookPtrace();
        Native.Strings.hookStrcpy(predicate);
        Native.Strings.hookStrcmp(predicate);
        //Native.Strings.hookStrlen(predicate);
        Native.Strings.hookStrstr(predicate);
        Native.Strings.hookStrchr(predicate);
        Native.Strings.hookStrcat(predicate);

        Interceptor.attach(Libc.memcmp, {
            onEnter({ 0: dest, 1: source, 2: length }) {
                this.dest = dest;
                this.source = source;
                this.length = length.toInt32();
            },
            onLeave(retval) {
                const data = this.dest.readByteArray(Math.min(this.length, 0x100));
                const da = this.source.readByteArray(Math.min(this.length, 0x100));
                logger.info({ tag: 'memcmp' }, `${hexdump(data, { header: false })}`);
                logger.info({ tag: 'memcmp' }, `${hexdump(da, { header: false })}`);
                logger.info({ tag: 'memcmp' }, `${'='.repeat(100)}`);
            },
        });
        const buffer = Memory.alloc(512);
        const buffer2 = Memory.alloc(512);
        const buffer3 = Memory.alloc(512);
        const buffer4 = Memory.alloc(512);
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
                        const newPathname = Memory.allocUtf8String(path);
                        return Libc.open(newPathname, flag).value;
                    }
                    //logger.info({ tag: 'open' }, `${pathname} ${flag}`);
                    if (pathname?.includes('task')) {
                        const path = `/data/data/${getSelfProcessName()}/fake_t`;
                        const file = new File(path, 'w');
                        while (Libc.read(realFd, buffer2, 512) !== 0) {
                            const oneLine = buffer2.readCString();

                            let buffer = `${oneLine}`;
                            buffer = buffer.replaceAll('re.frida.server', 'nya');
                            buffer = buffer.replaceAll('frida-agent-64.so', 'nya');
                            buffer = buffer.replaceAll('rida-agent-64.so', 'nya');
                            buffer = buffer.replaceAll('agent-64.so', 'nya');
                            buffer = buffer.replaceAll('frida-agent-32.so', 'nya');
                            buffer = buffer.replaceAll('frida-helper-32', 'nya');
                            buffer = buffer.replaceAll('frida-helper', 'nya');
                            buffer = buffer.replaceAll('frida-agent', 'nya');
                            buffer = buffer.replaceAll('pool-frida', 'nya');
                            buffer = buffer.replaceAll('frida', 'nya');
                            buffer = buffer.replaceAll('/data/local/tmp', '/data');
                            buffer = buffer.replaceAll('server', 'nya');
                            buffer = buffer.replaceAll('frida-server', 'nya');
                            buffer = buffer.replaceAll('linjector', 'nya');
                            buffer = buffer.replaceAll('gum-js-loop', 'nya');
                            buffer = buffer.replaceAll('frida_agent_main', 'nya');
                            buffer = buffer.replaceAll('gmain', 'nya');
                            buffer = buffer.replaceAll('magisk', 'nya');
                            buffer = buffer.replaceAll('.magisk', 'nya');
                            buffer = buffer.replaceAll('/sbin/.magisk', 'nya');
                            buffer = buffer.replaceAll('libriru', 'nya');
                            buffer = buffer.replaceAll('xposed', 'nya');
                            buffer = buffer.replaceAll('pool-spawner', 'nya');
                            buffer = buffer.replaceAll('gdbus', 'nya');
                            buffer = buffer.replaceAll('ggbond', 'nya');
                            buffer = buffer.replaceAll(':rpc', 'nya');
                            if (!buffer?.includes('tmp')) {
                                file.write(buffer);
                            }
                        }
                        const newpathname = Memory.allocUtf8String(path);
                        return Libc.open(newpathname, flag).value;
                    }
                    //if (pathname?.includes('/smaps')) {
                    //    const path = `/data/data/${getselfprocessname()}/fake_smaps`;
                    //    //@ts-ignore
                    //    const file = new file(path, 'w');
                    //    while (libc.read(realfd, buffer3, 512) !== 0) {
                    //        const oneline = buffer3.readcstring();
                    //        if (!oneline?.includes('tmp')) {
                    //            //@ts-ignore
                    //            file.write(oneline);
                    //        }
                    //    }
                    //    const newpathname = memory.allocutf8string(path);
                    //    return libc.open(newpathname, flag).value;
                    //}
                    //if (pathname?.includes('/cmdline')) {
                    //    const path = `/data/data/${getselfprocessname()}/fake_environ`;
                    //    //@ts-ignore
                    //    const file = new file(path, 'w');
                    //    while (libc.read(realfd, buffer4, 512) !== 0) {
                    //        const oneline = buffer4.readcstring();
                    //        logger.info({ tag: 'env' }, `${oneline}`);
                    //        //@ts-ignore
                    //        file.write(oneline);
                    //    }
                    //    const newpathname = memory.allocutf8string(path);
                    //    return libc.open(newpathname, flag).value;
                    //}
                    return realFd;
                },
                'int',
                ['pointer', 'int'],
            ),
        );
        //native.files.hookopen(predicate);
        Native.Files.hookAccess(predicate);
        Native.Files.hookReadlink(predicate);
        Native.Files.hookStat(predicate);
        Native.Files.hookRemove(predicate);
        Native.Files.hookDirent(() => true);
        Native.Files.hookOpendir(
            () => true,
            (path) => {
                if (
                    path?.startsWith('/proc') &&
                    (path?.includes('/task') || path?.endsWith('/fd') || path?.endsWith('/status'))
                )
                    return '/dev/null';
                if (path?.includes('/proc/fs/jbd2')) {
                    return '/dev/null';
                }
            },
        );
    }
});
