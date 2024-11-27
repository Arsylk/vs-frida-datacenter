import * as Anticloak from '@clockwork/anticloak';
import { getFindUnique } from '@clockwork/common';
import { getHookUnique } from '@clockwork/hooks';
import * as JniTrace from '@clockwork/jnitrace';
import { logger } from '@clockwork/logging';
import * as Native from '@clockwork/native';
import { getSelfProcessName } from '@clockwork/native/dist/utils';
const uniqHook = getHookUnique(true);
const uniqFind = getFindUnique(false);


const predicate = (r: NativePointer) => {
    function isWithinOwnRange(ptr: NativePointer) {
        const path = Native.Inject.modules.findPath(ptr);
        return path?.includes('/data') === true && !path.includes('/com.google.android.trichromelibrary');
    }
    return isWithinOwnRange(r);
};

JniTrace.attach((thisRef) => predicate(thisRef.returnAddress))

Native.Files.hookFopen(predicate, true, (path) => {
    if (path === '/proc/self/maps' || path === `/proc/${Process.id}/maps`) {
        return `/data/data/${getSelfProcessName()}/files/fake_maps`;
    }
    if (path?.endsWith('/su')) {
        return path.replace(/\/su$/, '/nya');
    }
});
Native.Files.hookAccess(predicate);
Native.Files.hookOpendir(predicate);
Native.Files.hookStat(predicate);
Native.Files.hookRemove(predicate);
// Native.Strings.hookStrlen(predicate)
// Native.Strings.hookStrcpy(predicate);
// Native.Strings.hookStrcmp(predicate);
// Native.Strings.hookStrstr(predicate);
Native.Strings.hookStrtoLong(predicate);

Native.TheEnd.hook(predicate);

Native.System.hookSystem();
Native.System.hookGetauxval();
Native.System.hookPosixSpawn();

// Native.Time.hookDifftime(predicate);
// Native.Time.hookTime(predicate);
// Native.Time.hookLocaltime(predicate);
// Native.Time.hookGettimeofday(predicate);
Native.Pthread.hookPthread_create();
Native.Pthread.hookPthread_join();
// Native.Logcat.hookLogcat();

Anticloak.Debug.hookPtrace();


Interceptor.attach(Libc.sprintf, {
    onEnter(args) {
        this.dst = args[0];
    },
    onLeave(retval) {
        const text = this.dst.readCString();
        logger.info({ tag: 'sprintf' }, `${text}`);
    },
});

Interceptor.attach(Libc.vsnprintf, {
    onEnter(args) {
        this.dst = args[0];
    },
    onLeave(retval) {
        if (predicate(this.returnAddress)) {
            const text = this.dst.readCString();
            logger.info({ tag: 'vsnprintf' }, `${text}`);
        }
    },
});

// // Interceptor.attach(Libc.syscall, {

// //     onEnter({ 0: _sysno, 1: args }) {
// //         if (predicate(this.returnAddress)) {
// //             const sysno = _sysno.toUInt32();
// //             logger.info({ tag: 'syscall' }, `${sysno} ${Native.addressOf(this.returnAddress)} `);
// //         }
// //     },
// // });

// // // Interceptor.attach(Module.getExportByName(null, 'dl_iterate_phdr'), {
// // //     onEnter(args) {
// // //         if (predicate(this.returnAddress)) {
// // //             logger.info({ tag: 'dl_iterate_phdr' }, `${args[0]} `);
// // //         }
// // //     },
// // // });
