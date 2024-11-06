import * as Anticloak from '@clockwork/anticloak';
import { emitter } from '@clockwork/common';
import { initSoDump, scheduleDexDump } from '@clockwork/dump';
import * as JniTrace from '@clockwork/jnitrace';
import { Color, logger } from '@clockwork/logging';
import * as Native from '@clockwork/native';
import * as Network from '@clockwork/network';
const { white, gray } = Color.use();


const predicate = (r: NativePointer) => {
    function isWithinOwnRange(ptr: NativePointer) {
        const path = Native.Inject.modules.findPath(ptr);
        return path?.includes('/data') === true && !path.includes('/com.google.android.trichromelibrary');
    }
    return isWithinOwnRange(r);
}

let en = true;
setTimeout(() => (en = true), 5000);
JniTrace.attach((thisRef) => en && predicate(thisRef.returnAddress))

Network.injectSsl();
Anticloak.InstallReferrer.replace({ install_referrer: 'utm_source=facebook_ads&utm_medium=Non-rganic&media_source=true_network&http_referrer=BingSearch' });
return
// initSoDump()

Native.Files.hookAccess(predicate);
Native.Files.hookOpen(predicate, function (path) {
    if (path?.includes('.dex')) {
    }
});
Native.Files.hookFopen(predicate, true, (path) => {
    if (path === '/proc/self/maps' || path === `/proc/${Process.id}/maps`) {
        // return `/data/data/${getSelfProcessName()}/files/fake_maps`;
    }
    if (path?.endsWith('/su')) {
        return path.replace(/\/su$/, '/nya')
    }
});
Native.Files.hookOpendir(predicate);
Native.Files.hookStat(predicate);
Native.Files.hookRemove(predicate);
Native.Strings.hookStrlen(predicate);
// Native.Strings.hookStrcpy(predicate);
// Native.Strings.hookStrcmp(predicate);
// Native.Strings.hookStrstr(predicate);
// Native.Strings.hookStrtoLong(predicate);

Native.TheEnd.hook(predicate);

Native.System.hookSystem();
Native.System.hookGetauxval();

// Native.Time.hookDifftime(predicate);
// Native.Time.hookTime(predicate);
// Native.Time.hookLocaltime(predicate);
// Native.Time.hookGettimeofday(predicate);
Native.Pthread.hookPthread_create();
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

Interceptor.attach(Libc.posix_spawn, {
    onEnter({ 0: pid, 1: path, 2: action }) {
        const pathStr = path.readCString();
        logger.info({ tag: 'posix_spawn' }, `${pathStr} ${action}`);
    },
    onLeave(retval) {
        logger.info({ tag: 'posix_spawn' }, `${retval}`);
    },
});

emitter.on('so', initSoDump)
emitter.on('dex', scheduleDexDump.bind(0));
