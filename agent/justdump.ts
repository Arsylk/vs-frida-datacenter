import * as Anticloak from '@clockwork/anticloak';
import { Text, emitter, getFindUnique, stacktrace, tryNull } from '@clockwork/common';
import { initSoDump } from '@clockwork/dump';
import { getHookUnique } from '@clockwork/hooks';
import * as JniTrace from '@clockwork/jnitrace';
import { Color, logger } from '@clockwork/logging';
import * as Native from '@clockwork/native';
import { predicate } from '@clockwork/native';
import { getSelfProcessName } from '@clockwork/native/dist/utils';
const { red } = Color.use();
const uniqHook = getHookUnique(true);
const uniqFind = getFindUnique(false);

Java.performNow(Anticloak.hookPackageManager);
Java.performNow(() => {
    uniqHook('com.cocos.lib.CocosActivity', 'loadNativeHelper');
});

//let start = !true;
//JniTrace.attach((thisRef) => predicate(thisRef.returnAddress), false);
//setTimeout(() => (start = !true), 8000);
//emitter.on('jni', () => (start = !start));

Native.Files.hookFopen(predicate, true, (path) => {
    if (path === '/proc/self/maps' || path === `/proc/${Process.id}/maps` || path?.endsWith('/smaps')) {
        return `/data/data/${getSelfProcessName()}/files/fake_maps`;
    }
    if (path?.includes('magisk')) {
        return path.replace(/magisk/, 'nya');
    }
    if (path?.endsWith('/su')) {
        return path.replace(/\/su$/, '/nya');
    }
});

Native.Strings.hookStrstr(predicate);
//Native.Strings.hookStrlen(predicate);
//Native.Strings.hookStrcpy(predicate);
//Native.Strings.hookStrcmp(predicate);
//Native.Strings.hookStrtoLong(predicate);
Native.System.hookSystem();
//Native.System.hookGetauxval();
Native.System.hookPosixSpawn();
//Native.Time.hookDifftime(predicate);
//Native.Time.hookTime(predicate);
//Native.Time.hookLocaltime(predicate);
//Native.Time.hookGettimeofday(predicate);
Native.Pthread.hookPthread_create({
    after(threadId, returnAddress) {
        //if (predicate(returnAddress)) {
        //    stalk(threadId, Process.getModuleByAddress(returnAddress));
        //}
    },
});
Native.Pthread.hookPthread_join();
//Native.Logcat.hookLogcat(function (msg) {
//    if (msg.includes('Kill Process')) {
//        const stacktrace = Thread.backtrace(this.context, Backtracer.FUZZY)
//            .map((x) => Native.addressOf(x, true))
//            .join('\n\t');
//        logger.info(stacktrace);
//    }
//});

Anticloak.Debug.hookPtrace();

//Interceptor.attach(Libc.sprintf, {
//    onEnter(args) {
//        this.dst = args[0];
//    },
//    onLeave(retval) {
//        const text = this.dst.readCString();
//        logger.info({ tag: 'sprintf' }, `${text}`);
//    },
//});
//
//Interceptor.attach(Libc.vsnprintf, {
//    onEnter(args) {
//        this.dst = args[0];
//    },
//    onLeave(retval) {
//        if (predicate(this.returnAddress)) {
//            const text = this.dst.readCString();
//            logger.info({ tag: 'vsnprintf' }, `${text}`);
//        }
//    },
//});
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
                    endUserMssg?.includes('magisk')
                ) {
                    logger.info({ tag: 'fgets' }, `${endUserMssg} ${red('SKIP')}`);
                    return Libc.fgets(buffer, size, fp);
                }
                logger.info({ tag: 'fgets' }, `${endUserMssg}`);
            }
            return retval;
        },
        'pointer',
        ['pointer', 'int', 'pointer'],
    ),
);
//Interceptor.replace(
//    Libc.nanosleep,
//    new NativeCallback(
//        () => {
//            //logger.info({ tag: 'nanosleep' }, `${Native.addressOf(this.returnAddress)}`);
//            return 0;
//        },
//        'int',
//        ['pointer', 'pointer'],
//    ),
//);

const inRange = (module: { base: NativePointer; size: number }, ptr: NativePointer) =>
    ptr >= module.base && module.base.add(module.size) > ptr;
const conds: any[] = [];
Native.Inject.onPrelinkOnce((module: Module) => {
    const { base, name, size } = module;
    if (name === 'libcocos.so') {
        conds.push(inRange.bind(null, module));
        JniTrace.attach((x) => conds.find((c) => c(x.returnAddress)), true);
    }
    if (name === 'libcocos_helper.so') {
        conds.push(inRange.bind(null, module));
        //const sus = base.add(0x79f0);
        //Memory.protect(sus, 4, 'rwx');
        //sus.writeByteArray([0x21, 0x40, 0x10, 0x90]);
        //Memory.protect(sus, 4, 'rx');
        //logger.info({ tag: 'help' }, `${Instruction.parse(sus)}`);
        //stalk(Process.getCurrentThreadId(), module);
        //Native.Files.hookOpen(predicate);
        //Native.Files.hookAccess(predicate);
        //Native.Files.hookReadlink(predicate);
        //Native.Files.hookDirent(predicate);
        //Native.Files.hookOpendir(predicate, (path) => {
        //    if (
        //        (path?.startsWith('/proc') && (path?.endsWith('/task') || path?.endsWith('/fd'))) ||
        //        path?.endsWith('/sys/module') ||
        //        path?.endsWith('/system/priv-app')
        //    )
        //        return '/dev/null';
        //});
        //Native.Files.hookStat(predicate);
        //Native.Files.hookRemove(predicate);
    }
});

function stalk(pid: number, module: Module) {
    const func_addr: { [key: string]: string } = {};
    let times = 0;

    Stalker.exclude(Process.getModuleByName('libc.so'));
    Stalker.exclude(Process.getModuleByName('libart.so'));
    Stalker.exclude(Process.getModuleByName('libartbase.so'));
    Stalker.exclude(Process.getModuleByName('libnetd_client.so'));
    Stalker.exclude(Process.getModuleByName('libdl.so'));
    Stalker.exclude(Process.getModuleByName('libc++.so'));
    Stalker.exclude(Process.getModuleByName('liblog.so'));
    Stalker.exclude(Process.getModuleByName('boot.oat'));
    Stalker.exclude(Process.getModuleByName('boot-framework.oat'));
    Stalker.exclude(Process.getModuleByName('libandroidfw.so'));
    Stalker.exclude(Process.getModuleByName('libselinux.so'));
    Stalker.exclude(Process.getModuleByName('libopenjdkjvm.so'));
    Stalker.exclude(Process.getModuleByName('libbase.so'));
    Stalker.exclude(Process.getModuleByName('libandroid_runtime.so'));
    Stalker.exclude(Process.getModuleByName('libcocos.so'));

    File.writeAllBytes(
        '/data/data/com.msmbet.zxczzzwaoaskz-FZkMteCZAExdP79731-qfA==/files/mynewlibcocos.so',
        ptr(0x72fba05000).readByteArray(24317952),
    );
    Stalker.follow(pid, {
        events: {
            call: false,
            ret: true,
            exec: false,
            block: false,
            compile: false,
        },
        onReceive: (events: ArrayBuffer) => {},
        transform: (iterator: StalkerArm64Iterator) => {
            let instruction = iterator.next();
            do {
                if (
                    instruction?.groups.includes('call') &&
                    `${Native.addressOf(instruction.address)}`.includes('cocos')
                ) {
                    iterator.putCallout((ctx: Arm64CpuContext) => {
                        const inst = Instruction.parse(ctx.pc);
                        //@ts-ignore
                        const addr = inst.mnemonic === 'bl' ? inst.operands[0].value : ctx.x8;
                        logger.info(
                            { tag: 'call' },
                            `${times}:${inst} ${Native.addressOf(addr)} ${Native.addressOf(ctx.pc)}`,
                        );
                        times = times + 1;
                    });
                }
                iterator.keep();
            } while ((instruction = iterator.next()) !== null);
        },
        onCallSummary: (summary) => {},
    });
}
