import * as Cocos2dx from '@clockwork/Cocos2dx';
import * as Anticloak from '@clockwork/anticloak';
import {
    Classes,
    ClassesString,
    Consts,
    Struct,
    Text,
    emitter,
    enumerateMembers,
    findClass,
    getFindUnique,
    isNully,
    stacktrace,
    tryNull,
} from '@clockwork/common';
import { toHex, uuid } from '@clockwork/common/dist/text';
import * as Dump from '@clockwork/dump';
import { ClassLoader, Filter, always, compat, getHookUnique, hook, ifKey } from '@clockwork/hooks';
import type { FridaMethodThisCompat } from '@clockwork/hooks/dist/types';
import * as JniTrace from '@clockwork/jnitrace';
import { Color, logger } from '@clockwork/logging';
import * as Native from '@clockwork/native';
import { predicate } from '@clockwork/native';
import { getSelfProcessName } from '@clockwork/native/dist/utils';
import * as Network from '@clockwork/network';
import * as Unity from '@clockwork/unity';
const { red, green, redBright, magentaBright: pink, gray, dim, black } = Color.use();
const uniqHook = getHookUnique(false);
const uniqFind = getFindUnique(false);

function hookActivity() {
    7893429;
    hook(Classes.Activity, '$init', {
        after() {
            logger.info({ tag: 'activity' }, `${gray('$init')}: ${this.$className}`);
        },
    });
    hook(Classes.Activity, 'onCreate', {
        after() {
            logger.info({ tag: 'activity' }, `${gray('onCreate')}: ${this.$className}`);
        },
        logging: { arguments: false },
    });
    hook(Classes.Activity, 'onResume', {
        after() {
            logger.info({ tag: 'activity' }, `${gray('onResume')}: ${this.$className}`);
        },
        logging: { arguments: false },
    });
    hook(Classes.Activity, 'startActivity');
    hook(Classes.Activity, 'startActivities');
}

function hookWebview(trace?: boolean) {
    const logging = { short: true };
    hook(Classes.WebView, 'evaluateJavascript', {
        logging: {
            ...logging,
            transform: (value, type, id) => (id === 0 ? Text.maxLengh(value, 300) : value),
        },
    });
    hook(Classes.WebView, 'loadDataWithBaseURL', {
        logging: {
            ...logging,
            transform: (value, type, id) => (id === 1 ? Text.maxLengh(value, 300) : value),
        },
    });
    hook(Classes.WebView, 'loadUrl', {
        logging: logging,
        after() {
            if (trace) {
                const strace = stacktrace();
                if (
                    !strace.includes('com.google.android.gms.ads.internal.webview.') &&
                    !strace.includes('com.google.android.gms.internal.')
                ) {
                    logger.info(pink(strace));
                }
            }
        },
    });
}

function hookNetwork() {
    hook(Classes.URL, 'openConnection', {
        loggingPredicate: Filter.url,
    });
    let RealCall: Java.Wrapper | null = null;
    ClassLoader.perform(() => {
        !RealCall &&
            (RealCall = findClass('okhttp3.internal.connection.RealCall')) &&
            'callStart' in RealCall &&
            hook(RealCall, 'callStart', {
                after() {
                    const original = this.originalRequest?.value;
                    if (original) {
                        const url = original._url?.value;
                        const method = original._method?.value;
                        logger.info(
                            //@ts-ignore
                            `${dim(method)} ${Color.url(
                                //@ts-ignore
                                Classes.String.valueOf(url),
                            )}`,
                        );
                    }
                },
            });
    });

    hook(Classes.InetSocketAddress, '$init', {
        logging: { multiline: false, short: true },
    });

    function byteBufferToBase64(buffer: Java.Wrapper, limit: number = buffer.remaining()): string {
        buffer.mark();
        const rawarr: number[] = [];
        for (let i = 0; i < limit; i += 1) rawarr.push(0);
        const bytes = Java.array('byte', rawarr);
        buffer.get(bytes);
        const b64 = Classes.String.$new(Classes.Base64.getEncoder().encode(bytes));
        buffer.reset();
        return b64;
    }

    hook(Classes.DatagramChannelImpl, 'send', {
        before(method, buffer) {
            const b64 = byteBufferToBase64(buffer);
            logger.info(
                { tag: 'send' },
                `${this.localAddress()} -> ${this.remoteAddress()} | ${gray(`${b64}`)}`,
            );
        },
    });
    hook(Classes.DatagramChannelImpl, 'read', {
        logging: { multiline: false },
        after(method, returnValue, buffer) {
            buffer.position(0);
            const b64 = byteBufferToBase64(buffer, returnValue);
            logger.info(
                { tag: 'read' },
                `${this.remoteAddress()} -> ${this.localAddress()} | ${gray(`${b64}`)}`,
            );
        },
    });
}

function hookRuntimeExec() {
    const mReplace = (sArg: string) => {
        sArg = sArg.replace(/su$/g, 'nya');
        sArg = sArg.replace(/^rm -r/g, 'file ');
        sArg = sArg.replace(/^getprop/g, 'ls');
        return Classes.String.$new(`${sArg}`);
    };

    false &&
        hook(Classes.Runtime, 'exec', {
            replace(method, ...args) {
                // string array
                if (method.argumentTypes[0].name === '[Ljava/lang/String;') {
                    const cloned = Array(args[0].length);
                    for (let i = 0; i < args[0].length; i += 1) {
                        cloned[i] = mReplace(`${args[0][i]}`);
                    }
                    args[0] = Java.array(ClassesString.String, cloned);
                }
                // single string
                else {
                    args[0] = mReplace(`${args[0]}`);
                }
                // if (`${args[0]}`.includes('nya') === false) return Classes.Runtime.exec.call(this, 'echo nya');
                return method.call(this, ...args);
            },
        });
    hook(Classes.ProcessBuilder, 'start', {
        before(method, ...args) {
            const newlist: string[] = [];
            for (let i = 0; i < this._command.value.size(); i += 1) {
                const newvalue = mReplace(`${this._command.value.get(i)}`);
                this._command.value.set(i, newvalue);
                newlist.push(newvalue);
            }
        },
    });
}

function hookCrypto() {
    hook(Classes.SecretKeySpec, '$init', {
        logging: {
            multiline: false,
            short: true,
            transform: (value, type, id) =>
                (id === 0 || undefined) &&
                tryNull(() => [
                    (() => {
                        let sb = '';
                        for (const b of value) {
                            sb += toHex(b);
                        }
                        return [sb];
                    })(),
                    `${ClassesString.Object}[]`,
                ]),
        },
    });
    hook(Classes.Cipher, 'getInstance', {
        logging: { multiline: false, short: true },
    });
    hook(Classes.Cipher, 'doFinal', {
        before(method, ...args) {},
        after(method, returnValue, ...args) {
            if (this.opmode.value === 1) {
                let str = tryNull(() => Classes.String.$new(args[0], Classes.StandardCharsets.UTF_8.value));
                str ??= tryNull(() => Classes.String.$new(args[0]));
                str ??= tryNull(() =>
                    (Classes.Arrays.toString as Java.MethodDispatcher)
                        .overload('[B')
                        .call(Classes.Arrays, args[0]),
                );
                str ??= `${args[0]}`;
                logger.info({ tag: 'encrypt' }, `${str}`);
            }
            if (this.opmode.value === 2) {
                let transformed = tryNull(() =>
                    Classes.String.$new(returnValue, Classes.StandardCharsets.UTF_8.value),
                );
                transformed ??= tryNull(() => Classes.String.$new(returnValue));
                transformed ??= tryNull(() =>
                    (Classes.Arrays.toString as Java.MethodDispatcher)
                        .overload('[B')
                        .call(Classes.Arrays, returnValue),
                );
                //@ts-ignore
                transformed ??= `${Classes.String.valueOf(returnValue)}`;
                logger.info({ tag: 'decrypt' }, `${transformed}`);
                //logger.info({ tag: 'decrypt' }, pink(stacktrace()));
            }
        },
        logging: { arguments: false, return: false },
    });
}

function hookJson(fn?: (key: string, method: string, fallback: () => Java.Wrapper) => any) {
    const getOpt = ['get', 'opt'];
    const types = ['Boolean', 'Double', 'Int', 'JSONArray', 'JSONObject', 'Long', 'String'];

    hook(Classes.JSONObject, '$init', {
        loggingPredicate: Filter.json,
        logging: { short: true },
        predicate: (_, index) => index !== 0,
    });

    hook(Classes.JSONObject, 'has', {
        loggingPredicate: Filter.json,
        logging: { multiline: false, short: true },
        replace(method, key) {
            const bound = method.bind(this, key);
            const found = fn?.(key, 'has', bound) !== undefined;
            return found || bound();
        },
    });

    for (const item of getOpt) {
        hook(Classes.JSONObject, item, {
            loggingPredicate: Filter.json,
            logging: { multiline: false, short: true },
            replace(method, ...args) {
                const bound = method.bind(this, ...args);
                const value = fn?.(args[0], item, bound);
                return value !== undefined ? value : bound();
            },
        });
    }

    for (const type of types) {
        for (const item of getOpt) {
            const name = `${item}${type}`;
            hook(Classes.JSONObject, name, {
                loggingPredicate: Filter.json,
                logging: { multiline: false, short: true },
                replace(method, ...args) {
                    const bound = method.bind(this, ...args);
                    const value = fn?.(args[0], item, bound);
                    return value !== undefined ? value : bound();
                },
            });
        }
    }
    // hook(Classes.JSONObject, 'put')
}

function hookPrefs(fn?: (this: FridaMethodThisCompat, key: string, method: string) => any) {
    const keyFns = ['getBoolean', 'getFloat', 'getInt', 'getLong', 'getString', 'getStringSet'];

    hook(Classes.SharedPreferencesImpl, 'contains', {
        loggingPredicate: Filter.prefs,
        logging: { multiline: false, short: true },
        replace: compat(function () {
            const found = fn?.call(this, this.originalArgs[0], 'contains') !== undefined;
            return found || this.fallback();
        }),
    });
    hook(Classes.SharedPreferencesImpl, 'getAll', {
        loggingPredicate: Filter.prefs,
        logging: { multiline: false, short: true },
    });

    for (const item of keyFns) {
        hook(Classes.SharedPreferencesImpl, item, {
            loggingPredicate: Filter.prefs,
            logging: { multiline: false, short: true },
            replace: compat(function () {
                const result = fn?.call(this, this.originalArgs[0], item);
                return result !== undefined ? result : this.fallback();
            }),
        });
    }
    // hook('java.util.Properties', 'getProperty');
}

function hookPreferences(fn?: (key: string, method: string) => any) {
    let Preferences: Java.Wrapper | null = null;
    let Preferences$Key: Java.Wrapper | null = null;
    ClassLoader.perform(() => {
        !Preferences &&
            (Preferences = findClass(ClassesString.Preferences)) &&
            hook(Preferences, '$init', {
                predicate(method) {
                    return method.argumentTypes.length > 0;
                },
                after(method, returnValue, ...args) {
                    const contains = function (this: Java.Wrapper, method: Java.Method, key: string) {
                        const found = fn?.(key, 'contains') !== undefined;
                        return found || method.call(this, key);
                    };
                    const get = function (this: Java.Wrapper, method: Java.Method, key: Java.Wrapper) {
                        const keyStr = key.getName();
                        const result = fn?.(keyStr, method.name);
                        if (result !== undefined) return result;
                        return method.call(this, key);
                    };

                    'contains' in this &&
                        hook(this.$className, 'contains', {
                            replace: fn ? contains : undefined,
                            logging: { short: true, multiline: false },
                        });
                    'get' in this &&
                        hook(this.$className, 'get', {
                            replace: fn ? get : undefined,
                            logging: { short: true, multiline: false },
                        });
                    'asMap' in this &&
                        hook(this.$className, 'asMap', {
                            logging: { short: true, multiline: false },
                        });
                },
            });
        !Preferences$Key &&
            (Preferences$Key = findClass(ClassesString.Preferences$Key)) &&
            hook(Preferences$Key, '$init', {
                logging: { multiline: false, short: true },
            });
    });
}

function hookFirestore() {
    let FirebaseFirestore: Java.Wrapper | null = null;
    let QueryDocumentSnapshot: Java.Wrapper | null = null;
    let QuerySnapshot: Java.Wrapper | null = null;
    let DocumentSnapshot: Java.Wrapper | null = null;
    let test: Java.Wrapper | null = null;
    const fn = () => {
        if (!test && (test = findClass('net.envelopment.carding.meretrix.QefSneakSecta'))) {
            enumerateMembers(test, {
                onMatchMethod(clazz, member) {
                    if (member === 'checkIsRunningInEmulator')
                        hook(clazz, member, { replace: always(false) });
                    else hook(clazz, member);
                },
            });
        }

        if (
            !FirebaseFirestore &&
            (FirebaseFirestore = findClass('com.google.firebase.firestore.FirebaseFirestore'))
        ) {
            hook(FirebaseFirestore, '$init', {
                predicate: (overload) => overload.argumentTypes.length > 0,
                logging: { short: true },
            });

            'collection' in FirebaseFirestore &&
                hook(FirebaseFirestore, 'collection', {
                    logging: { short: true, multiline: false },
                });
        }
        if (
            !QueryDocumentSnapshot &&
            (QueryDocumentSnapshot = findClass('com.google.firebase.firestore.QueryDocumentSnapshot'))
        ) {
            'getId' in QueryDocumentSnapshot &&
                hook(QueryDocumentSnapshot, 'getId', {
                    logging: { short: true, multiline: false },
                });
            'getData' in QueryDocumentSnapshot &&
                hook(QueryDocumentSnapshot, 'getData', {
                    logging: { short: true, multiline: false },
                });
        }
        if (!QuerySnapshot && (QuerySnapshot = findClass('com.google.firebase.firestore.QuerySnapshot'))) {
            hook(QuerySnapshot, '$init', {
                loggingPredicate: (method) => method.argumentTypes.length > 0,
                logging: { short: true },
            });
        }
        if (
            !DocumentSnapshot &&
            (DocumentSnapshot = findClass('com.google.firebase.firestore.DocumentSnapshot'))
        ) {
            hook(DocumentSnapshot, '$init', { logging: { short: true } });
            'get' in DocumentSnapshot && hook(DocumentSnapshot, 'get', { logging: { short: true } });
        }
    };
    ClassLoader.perform(fn);
}

function bypassIntentFlags() {
    if (Classes.Build$VERSION.SDK_INT.value < 34) return;
    hook(Classes.PendingIntent, 'getBroadcastAsUser', {
        replace(method, ...args) {
            const flags = args[3];
            const flagImmutableSet = (flags & Classes.PendingIntent.FLAG_IMMUTABLE.value) !== 0;
            const flagMutableSet = (flags & Classes.PendingIntent.FLAG_MUTABLE.value) !== 0;
            if (!flagImmutableSet && !flagMutableSet) {
                const newFlags = flags | Classes.PendingIntent.FLAG_MUTABLE.value;
                args[3] = newFlags;
            }
            return method.call(this, ...args);
        },
        logging: { call: false, return: false },
    });
    hook(Classes.PendingIntent, 'checkPendingIntent', {
        replace(method, ...args) {
            return;
        },
        logging: { call: false, return: false },
    });
    hook('android.os.UserHandle', 'isCore', {
        replace: always(true),
        logging: { call: false, return: false },
    });
}

function bypassReceiverFlags() {
    if (Classes.Build$VERSION.SDK_INT.value < 34) return;
    hook(Classes.ContextImpl, 'registerReceiverInternal', {
        replace(method, ...args) {
            const EXPORTED = Classes.Context.RECEIVER_EXPORTED.value;
            const NOT_EXPORTED = Classes.Context.RECEIVER_NOT_EXPORTED.value;
            if ((args[6] & NOT_EXPORTED) === 0) {
                args[6] |= EXPORTED;
            }

            return method.call(this, ...args);
        },
        logging: {
            call: false,
            return: false,
        },
    });

    hook('android.app.AlarmManager', 'setExact', {
        replace: function (method) {
            method.call(this, false);
        },
        logging: { call: false, return: false },
    });
}

function swapIntent(target: string, dest: string) {
    hook(Classes.Intent, '$init', {
        predicate: (_, index) => index === 1,
        replace(method, context, clazz) {
            logger.info(clazz.getName());
            if (`${clazz.getName()}` === target) {
                clazz = findClass(dest)?.class;
            }
            return method.call(this, context, clazz);
        },
    });
}

Java.performNow(() => {
    const C4_URL = 'https://google.pl/search?q=hi';
    const AD_ID = 'fwqna41l-mrux-l4pi-mi6q-imrr3t83da4n';
    const INSTALL_REFERRER =
        'utm_source=facebook_ads&utm_medium=Non-organic&media_source=true_network&http_referrer=BingSearch';
    hookActivity();
    hookWebview(true);
    hookNetwork();
    hookJson((key, _method, fallback) => {
        switch (key) {
            case 'errer':
            case 'referrer':
            case 'applink_url':
            case 'af_message':
            case 'af_status':
            case 'tracker_name':
            case 'network':
            case 'campaign':
            case 'google_utm_source':
                return INSTALL_REFERRER;
            case 'gaid':
            case 'android_imei':
            case 'android_meid':
            case 'android_device_id':
                return '4102978102398';
        }
    });
    hookPrefs((key, _method) => {
        switch (key) {
            case 'oskdoskdue':
                return 0;
            case 'isAudit':
            case 'IS_AUDIT':
                return false;
            case 'invld_id':
            case 'key_umeng_sp_oaid':
            case 'UTDID2':
            case 'adid':
            case 'com.flurry.sdk.advertising_id':
            case 'tenjin_advertising_id':
            case 'uuid':
            case 'AF_CAMPAIGN':
                return 'Non-organic';
            case 'country':
            case 'userCountry':
            case 'key_real_country':
            case 'KEY_LOCALE':
            case 'key_country':
            case 'Plat_Lang':
                return 'BR';
        }
    });
    hook(Classes.SharedPreferencesImpl$EditorImpl, 'putString');
    hookPreferences(() => {});
    hookFirestore();
    hookCrypto();
    hookRuntimeExec();

    bypassIntentFlags();
    bypassReceiverFlags();

    // hook('android.content.ContextWrapper', 'getSharedPreferences', {
    //     logging: { multiline: false, short: true, return: false },
    // });

    hook(Classes.Process, 'killProcess', {
        after: () => {
            logger.info({ tag: 'killProcess' }, redBright(stacktrace()));
        },
        logging: { multiline: false, return: false },
    });
    hook(Classes.ActivityManager, 'getRunningAppProcesses', {
        logging: { short: true, multiline: false },
    });
    hook(Classes.ActivityManager$RunningAppProcessInfo, '$init', {
        logging: { short: true, multiline: false },
    });

    // hook(Classes.Activity, 'finish', { replace: () => {}, logging: { multiline: false, return: false } });
    // hook(Classes.Activity, 'finishAffinity', {
    //     replace: () => {},
    //     logging: { multiline: false, return: false },
    // });

    Anticloak.Debug.hookVMDebug();
    // Anticloak.Debug.hookDigestEquals();
    Anticloak.Debug.hookVerify();
    Anticloak.generic();
    Anticloak.hookDevice();
    Anticloak.hookSettings();
    Anticloak.hookAdId(AD_ID);
    Anticloak.hookPackageManager();
    Anticloak.Country.mock('BR');
    Anticloak.InstallReferrer.replace({ install_referrer: INSTALL_REFERRER });

    hook(Classes.SystemProperties, 'get', {
        loggingPredicate: Filter.systemproperties,
        logging: { multiline: false, short: true },
        replace: ifKey((key) => {
            const value = Anticloak.BuildProp.propMapper(key);
            return value;
        }),
    });
    hook(Classes.System, 'getProperty', {
        loggingPredicate: Filter.systemprop,
        logging: { multiline: false, short: true },
        replace(method, ...args) {
            const fallback = () => method.call(this, ...args);
            const value = Anticloak.BuildProp.systemMapper(args[0], fallback);
            return value ?? fallback();
        },
    });

    hook(Classes.DisplayManager, 'createVirtualDisplay');

    hook(Classes.SimpleDateFormat, 'parse', {
        logging: { short: true, multiline: false },
    });
    hook(Classes.DexPathList, '$init', {
        logging: { short: true, multiline: false },
    });

    hook(Classes.URLEncoder, 'encode', {
        logging: { short: true, multiline: false },
    });

    // hook(Classes.Runtime, 'loadLibrary0', { logging: { short: true, yymultiline: false } });
    const conf = { logging: { short: true, multiline: false } };
    ClassLoader.perform(() => {
        uniqFind('EventFlowToLiveData.AdapterFlowToFlowCategorize', (clazz) => {
            enumerateMembers(clazz, {
                onMatchMethod(clazz, member, depth) {
                    hook(clazz, member, conf);
                },
            });
        });
    });
});

Network.injectSsl();
Network.attachGetAddrInfo();
Network.attachGetHostByName();
Network.attachNativeSocket();
Network.attachInteAton();
// Native.attachRegisterNatives();
Native.attachSystemPropertyGet((key) => {
    const value = Anticloak.BuildProp.propMapper(key);
    return value;
});

Process.setExceptionHandler((exception: ExceptionDetails) => {
    const ctx = exception.context as Arm64CpuContext;
    //logger.error(
    //{ tag: 'exception' },
    //`${black(exception.type)}: ${exception.memory?.operation} ${exception.memory?.address} at: ${gray(`${exception.address}`)} x0: ${red(`${ctx.x0}`)} x1: ${red(`${ctx.x1}`)}`,

    return exception.type === 'abort';
});

Native.initLibart();
//Dump.initSoDump();
//Dump.hookArtLoader();
//Cocos2dx.dump({ name: 'libcocos2djs.so', fn_dump: ptr(0x0080fbcc), fn_key: ptr(0x00702580) });
// Cocos2dx.hookLocalStorage(function (key) {
//     switch (key) {
//         case '__FirstLanuchTime':
//             return 'false';
//         case 'GMNeedLog':
//             return 'true';
//         case 'isRealUser':
//         case 'force_update':
//             return 'true';
//     }
// });

//Unity.setVersion('2023.2.19f1');
//Unity.patchSsl();
//Unity.attachScenes();
//Unity.attachStrings();

let enable = true;
JniTrace.attach(({ returnAddress }) => {
    return enable && predicate(returnAddress);
}, true);
emitter.on('jni', (_) => (enable = !enable));
emitter.on('so', (lib, sync) => Dump.dumpLib(lib, sync === true));
emitter.on('dex', () => Dump.initDexDump());
emitter.on('il2cpp', Unity.listGameObjects);

Native.Pthread.hookPthread_create();
Native.Pthread.hookPthread_join();

Native.Files.hookFopen(predicate, true, (path) => {
    if (path?.endsWith('/smaps') || path?.includes('/proc/self/environ')) {
        return `/data/data/${getSelfProcessName()}/files/fake_maps`;
    }
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
//Native.Strings.hookStrtoLong(predicate);

Native.hookGlGetString();
Native.System.hookSystem();
Native.System.hookGetauxval();
Native.TheEnd.hook(predicate);

//Interceptor.attach(Libc.vsnprintf, {
//    onEnter(args) {
//        this.dst = args[0];
//    },
//    onLeave(retval) {
//        if (predicate(this.returnAddress)) {
//            const text = this.dst.readCString();
//            logger.info({ tag: 'vsnprintf' }, `${text} ${Native.addressOf(this.returnAddress)}`);
//        }
//    },
//});
//Interceptor.attach(Libc.sprintf, {
//    onEnter(args) {
//        this.dst = args[0];
//    },
//    onLeave(retval) {
//        const text = this.dst.readCString();
//        logger.info({ tag: 'sprintf' }, `${text}`);
//    },
//});

Interceptor.attach(Libc.posix_spawn, {
    onEnter({ 0: pid, 1: path, 2: action }) {
        const pathStr = path.readCString();
        logger.info({ tag: 'posix_spawn' }, `${pathStr} ${action}`);
    },
    onLeave(retval) {
        logger.info({ tag: 'posix_spawn' }, `${retval}`);
    },
});

Interceptor.replace(
    Libc.nanosleep,
    new NativeCallback(
        () => {
            //if (predicate(this.returnAddress)) {
            //    logger.info({ tag: 'nanosleep' }, `${Native.addressOf(this.returnAddress)}`);
            //}
            return 0;
        },
        'int',
        ['pointer', 'pointer'],
    ),
);

Interceptor.replace(
    Libc.fork,
    new NativeCallback(
        function () {
            const retval = Libc.fork();
            //const retval = -1;
            logger.info({ tag: 'fork' }, `${retval} ${Native.addressOf(this.returnAddress)}`);
            return retval;
        },
        'int',
        [],
    ),
);

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
                    endUserMssg?.includes('magisk')
                ) {
                    logger.info({ tag: 'fgets' }, `${endUserMssg} ${red('SKIP')}`);
                    Libc.fclose(fp);
                    return Libc.fgets(buffer, size, fp);
                }
                //logger.info(
                //    { tag: 'fgets' },
                //    `${endUserMssg} ${strOneLine(fp.readPointer(), 100)} ${fp.add(Process.pointerSize).readPointer()}`,
                //);
            }
            return retval;
        },
        'pointer',
        ['pointer', 'int', 'pointer'],
    ),
);

Native.Inject.afterInitArrayModule((module: Module) => {
    const { base, name, size } = module;
    if (name === 'libreveny.so') {
        for (const range of module.enumerateRanges('--x')) {
            logger.info({ tag: 'range' }, `${Text.stringify(range)}`);
            Memory.scan(range.base, range.size, 'D4 00 00 4?', {
                onMatch(address, size) {
                    logger.info({ tag: 'memsvc' }, `${address}`);
                },
            });
        }
    }
});

Native.Inject.onPrelinkOnce((module) => {
    const { base, name, size } = module;
    if (name === 'libgojni.so' || name === 'libreveny.so') {
        Interceptor.attach(Libc.syscall, {
            onEnter: function (args) {
                if (predicate(this.returnAddress)) {
                    const ctx = this.context as Arm64CpuContext;
                    const attr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
                        .map((i) => `x${i}`)
                        .map((k) => [k, Reflect.get(ctx, k)]);
                    const cttx = Object.fromEntries(attr);
                    logger.info(
                        { tag: 'syscall:in' },
                        `${Text.stringify(cttx)} ${Native.addressOf(this.returnAddress)}`,
                    );
                }
            },
            onLeave(retval) {
                if (predicate(this.returnAddress)) {
                    const ctx = this.context as Arm64CpuContext;
                    const attr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
                        .map((i) => `x${i}`)
                        .map((k) => [k, Reflect.get(ctx, k)]);
                    const cttx = Object.fromEntries(attr);
                    logger.info(
                        { tag: 'syscall:out' },
                        `${Text.stringify(cttx)} ${Native.addressOf(this.returnAddress)}`,
                    );
                }
            },
        });
        //Interceptor.replace(
        //    Module.getExportByName(null, 'fcntl'),
        //    new NativeCallback(
        //        function (fd, op) {
        //            const ctx = this.context as Arm64CpuContext;
        //            const ret = Libc.fcntl(fd, op);
        //
        //            const key = Consts.keyname(Consts.cmd, op);
        //            logger.info(
        //                { tag: 'fcntl' },
        //                `${ctx.x5.readCString()} ${String(key)} ${ctx.x0} ${ctx.x1} ${ctx.x2} ${ctx.x3} ${ctx.x4} ${ctx.x5} ${ctx.x6} ${ctx.x7} -> ${ret}`,
        //            );
        //
        //            return ret;
        //        },
        //        'int',
        //        ['int', 'int'],
        //    ),
        //);
        Anticloak.Debug.hookPtrace();
        Native.Strings.hookStrcpy(predicate);
        //Native.Strings.hookStrcmp(predicate);
        //Native.Strings.hookStrlen(predicate);
        Native.Strings.hookStrstr(predicate);
        Native.Strings.hookStrchr(predicate);
        Native.Strings.hookStrcat(predicate);
        Native.Files.hookOpen(predicate);

        Native.Files.hookAccess(predicate);
        Native.Files.hookReadlink(predicate);
        Native.Files.hookStat(predicate);
        Native.Files.hookRemove(predicate);
        Native.Files.hookDirent(predicate);
        Native.Files.hookOpendir(predicate, (path) => {
            if (path?.startsWith('/proc') && (path?.endsWith('/task') || path?.endsWith('/fd')))
                return '/dev/null';
            if (path?.includes('/proc/fs/jbd2')) {
                return '/nya/nya/nya';
            }
        });

        //@ts-ignore
        //Native.log(module.findExportByName('dlsym'), {});

        //Interceptor.replace(
        //    Libc.dlsym,
        //    new NativeCallback(
        //        function (handle, name) {
        //            const ret = Libc.dlsym(handle, name);
        //            const strName = name.readCString();
        //            logger.info(
        //                { tag: 'dlsym' },
        //                `${Text.stringify({ handle: handle, name: strName })} -> ${ret}`,
        //            );
        //            return ret;
        //        },
        //        'pointer',
        //        ['pointer', 'pointer'],
        //    ),
        //);
    }
});

//setTimeout(() => {
//    const dir = '/data/data/com.reveny.nativecheck/files';
//    Libc.system(Memory.allocUtf8String(`mkdir -p ${dir}`));
//
//    // @ts-ignore
//    File.writeAllText(`${dir}/fake_maps`, File.readAllText('/proc/self/maps'));
//});
