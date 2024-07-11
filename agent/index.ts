import * as Anticloak from '@clockwork/anticloak';
import {
    Classes,
    ClassesString,
    Libc,
    emitter,
    enumerateMembers,
    findClass,
    getFindUnique,
    stacktrace,
    stacktraceList,
    Std,
    Struct,
} from '@clockwork/common';
import { ClassLoader, Filter, always, getHookUnique, hook, ifKey } from '@clockwork/hooks';
import * as JniTrace from '@clockwork/jnitrace';
import { Color, logger } from '@clockwork/logging';
import * as Native from '@clockwork/native';
import * as Network from '@clockwork/network';
import * as Unity from '@clockwork/unity';
import * as Cocos2dx from '@clockwork/cocos2dx';
import * as Dump from '@clockwork/dump';
const uniqHook = getHookUnique();
const uniqFind = getFindUnique();
const { blue, blueBright, redBright, magentaBright: pink, gray, dim } = Color.use();

function hookActivity() {
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
    hook(Classes.WebView, 'evaluateJavascript', { logging: logging });
    hook(Classes.WebView, 'loadDataWithBaseURL', { logging: logging });
    hook(Classes.WebView, 'loadUrl', {
        logging: logging,
        after(method, returnValue, ...args) {
            if (trace) {
                logger.info(pink(stacktrace()));
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
            hook(RealCall, 'callStart', {
                after(method, returnValue, ...args) {
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
}

function hookRuntimeExec() {
    const wrapReplace = (arg0: any, replace: (str: string) => string) => {
        if (typeof arg0 === 'string') {
            arg0 = replace(arg0);
        } else {
            for (const i in arg0) {
                if (!Number.isNaN(Number(i))) {
                    arg0[i] = replace(arg0[i]);
                }
            }
        }
        return arg0;
    };
    hook(Classes.Runtime, 'exec', {
        replace(method, ...args) {
            if (`${args[0]}`.includes('getprop ro.board.platform')) {
                args[0] = wrapReplace(args[0], (str) =>
                    str.replace('getprop ro.board.platform', 'echo sdm720'),
                );
            }
            if (`${args[0]}`.includes('su@object')) {
                args[0] = wrapReplace(args[0], (str) => str.replace('su', 'sh'));
            }
            if (`${args[0]}` === 'su') {
                args[0] = 'nya';
            }
            if (`${args[0]}`.startsWith('rm ')) {
                args[0] = wrapReplace(args[0], (str) => str.replace(/^rm -r/, 'file '));
            }
            // if (`${args[0]}`.includes('nya') === false) return Classes.Runtime.exec.call(this, 'echo nya');
            return method.call(this, ...args);
        },
    });
}

function hookCrypto() {
    hook(Classes.SecretKeySpec, '$init', {
        logging: { multiline: false, short: true },
    });
    hook(Classes.Cipher, 'getInstance', {
        logging: { multiline: false, short: true },
    });
    hook(Classes.Cipher, 'doFinal', {
        after(m, r, ...p) {
            if (this.opmode.value === 1) {
                try {
                    const str = Classes.String.$new(p[0]);
                    logger.info({ tag: 'encrypt' }, `${str}`);
                } catch (e) {
                    logger.info({ tag: 'encrypt' }, `${p[0]}`);
                }
            }
            if (this.opmode.value === 2) {
                try {
                    const str = Classes.String.$new(r);
                    logger.info({ tag: 'decrypt' }, `${str}`);
                } catch (e) {
                    logger.info({ tag: 'decrypt' }, `${r}`);
                }
            }
        },
        logging: { arguments: false, return: false },
    });
}

function hookJson(fn?: (key: string, method: string) => any) {
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
            const found = fn?.(key, 'has') !== undefined;
            return found || method.call(this, key);
        },
    });

    for (const item of getOpt) {
        hook(Classes.JSONObject, item, {
            loggingPredicate: Filter.json,
            logging: { multiline: false, short: true },
            replace: fn ? ifKey((key) => fn(key, item)) : undefined,
        });
    }

    for (const type of types) {
        for (const item of getOpt) {
            const name = `${item}${type}`;
            hook(Classes.JSONObject, name, {
                loggingPredicate: Filter.json,
                logging: { multiline: false, short: true },
                replace: fn ? ifKey((key) => fn(key, item)) : undefined,
            });
        }
    }
    // hook(Classes.JSONObject, 'put')
}

function hookPrefs(fn?: (key: string, method: string) => any) {
    const keyFns = ['getBoolean', 'getFloat', 'getInt', 'getLong', 'getString', 'getStringSet'];

    hook(Classes.SharedPreferencesImpl, 'contains', {
        loggingPredicate: Filter.prefs,
        logging: { multiline: false, short: true },
        replace(method, key) {
            const found = fn?.(key, 'contains') !== undefined;
            return found || method.call(this, key);
        },
    });
    hook(Classes.SharedPreferencesImpl, 'getAll', {
        loggingPredicate: Filter.prefs,
        logging: { multiline: false, short: true },
    });

    for (const item of keyFns) {
        hook(Classes.SharedPreferencesImpl, item, {
            loggingPredicate: Filter.prefs,
            logging: { multiline: false, short: true },
            replace: fn ? ifKey((key) => fn(key, item)) : undefined,
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
                onMatchMethod(clazz, member, depth) {
                    hook(clazz, member);
                },
            });
        }

        if (
            !FirebaseFirestore &&
            (FirebaseFirestore = findClass('com.google.firebase.firestore.FirebaseFirestore'))
        ) {
            hook(FirebaseFirestore, '$init', { logging: { short: true } });
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
            hook(QuerySnapshot, '$init', { logging: { short: true } });
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
    });
    hook(Classes.PendingIntent, 'checkPendingIntent', {
        replace(method, ...args) {
            return;
        },
    });
    hook('android.os.UserHandle', 'isCore', { replace: always(true) });
}

function bypassReceiverFlags() {
    hook(Classes.ContextImpl, 'registerReceiverInternal', {
        replace(method, ...args) {
            const EXPORTED = Classes.Context.RECEIVER_EXPORTED.value;
            const NOT_EXPORTED = Classes.Context.RECEIVER_NOT_EXPORTED.value;
            if ((args[6] & NOT_EXPORTED) === 0) {
                args[6] |= EXPORTED;
            }
            return method.call(this, ...args);
        },
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

Java.deoptimizeEverything();
Java.performNow(() => {
    // hook(Classes.URL, '$init', {replace(method, ...args) {
    //     if (`${args[0]}` === 'https://muizgLw7vnwg.shop') args[0] = 'https://google.pl/'
    //     return method.call(this, ...args);
    // }})
    // hook('com.android.org.conscrypt.TrustManagerImpl', 'verifyChain', {
    //     replace: (_, ...params) => params[0],
    //     logging: {arguments: false, return: false}
    // });
    // return
    const AD_ID = '123e4567-e89b-42d3-a456-556642440000';
    const C4_URL = 'https://google.pl/search?q=hi';
    const INSTALL_REFERRER =
        'utm_source=facebook_ads&utm_medium=Non-organic&media_source=true_network&http_referrer=BingSearch';
    hookActivity();
    hookWebview(true);
    hookNetwork();
    hookJson((key, method) => {
        switch (key) {
            case 'install_referrer':
            case 'referrer':
            case 'applink_url':
            case 'af_message':
            case 'af_status':
            case 'tracker_name':
            case 'network':
            case 'campaign':
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
            case 'gaid':
            case 'KEY_UID':
            case 'deviceId':
            case 'device_id':
            case 'deviceuuid':
            case 'uuid_worldmap_quiz':
            case 'AdPlatformSequenceNative':
            case 'AdAlternativeBanner':
            case 'AdAlternativeNative':
            case 'paidv1_id':
            case 'paidv2_id':
            case 'userId':
            case 'SPU_PSID_KEY':
            case 'SPU_SESSIONID_KEY':
            case 'cloud_iqid':
            case 'google_gaid':
                return AD_ID;
            case 'MEDIA_SOURCE':
            case 'tenjin_campaign_id':
            case 'tenjin_campaign_name':
            case 'tenjin_ad_network':
            case 'last_active_buy_media_source':
            case 'last_active_buy_channel':
            case 'last_active_buy_campaign':
            case 'tenjinGoogleInstallReferrer':
            case 'install_referrer':
            case 'media_source':
            case 'media_campaign':
            case 'utm_source':
            case 'utm_medium':
            case 'referrer':
            case 'AFConversionData':
            case 'conversionData':
            case 'dataScore':
            case 'raw_referrers':
            case 'attribution':
                return INSTALL_REFERRER;
            case 'country':
            case 'userCountry':
            case 'key_real_country':
            case 'KEY_LOCALE':
                return 'BR';
        }
    });
    hookPreferences((key, method) => {});
    hookFirestore();
    hookCrypto();
    hookRuntimeExec();

    hook(Classes.Process, 'killProcess', {
        after: () => {
            logger.info({ tag: 'killProcess' }, redBright(stacktrace()));
        },
        logging: { multiline: false, return: false },
    });
    hook(Classes.ActivityManager, 'getRunningAppProcesses');
    hook(Classes.ActivityManager$RunningAppProcessInfo, '$init');

    // hook(Classes.Activity, 'finish', { replace: () => {}, logging: { multiline: false, return: false } });
    // hook(Classes.Activity, 'finishAffinity', { replace: () => {}, logging: { multiline: false, return: false } });

    hook(Classes.ApplicationPackageManager, 'getPackageInfo', {
        logging: { multiline: false, short: true },
        replace(method, ...args) {
            if (`${args[0]}` === 'com.topjohnwu.magisk') {
                args[0] = 'com.hi.this.package.is.not.real';
            }
            return method.call(this, ...args);
        },
        after(method, returnValue, ...args) {
            const mPackage = this.mContext.value.getPackageName();
            if (mPackage === returnValue?.packageName?.value) {
            }
        },
    });

    hook(Classes.VMDebug, 'isDebuggerConnected', { replace: always(false) });
    Anticloak.generic();
    Anticloak.hookDevice();
    Anticloak.hookSettings();
    Anticloak.hookAdId(AD_ID);
    Anticloak.Country.mock('BR');
    Anticloak.InstallReferrer.replace({ install_referrer: INSTALL_REFERRER });

    hook(Classes.SystemProperties, 'get', {
        loggingPredicate: (method, ...args) => `${args[0]}` !== 'debug.force_rtl',
        logging: { multiline: false, short: true },
        replace: ifKey((key) => {
            const value = Anticloak.BuildProp.propMapper(key);
            return value;
        }),
    });
    hook(Classes.System, 'getProperty', {
        loggingPredicate: (method, ...args) =>
            `${args[0]}` !== 'line.separator' && `${args[0]}` !== 'jsse.enableSNIExtension',
        logging: { multiline: false, short: true },
        replace: ifKey((key) => {
            const value = Anticloak.BuildProp.systemMapper(key);
            return value;
        }),
    });

    hook(Classes.SimpleDateFormat, 'parse', {
        logging: { short: true, multiline: false },
    });

    hook(Classes.DexPathList, '$init', {
        logging: { short: true, multiline: false },
    });
    ClassLoader.perform((cl) => {});
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

// Native.initLibart();
// Cocos2dx.dump({ name: 'libcocos.so', fn_dump: ptr(0x0030d47c), fn_key: ptr(0x002ef814) });
// Cocos2dx.hookLocalStorage((key) => {
//     switch (key) {
//         case 'isRealUser':
//         case 'force_update':
//             return 'true';
//     }
// });
// Unity.setVersion('2023.2.12f1');
Unity.attachStrings();
Unity.mempatchSsl();

let enable = !true;
setTimeout(() => (enable = !true), 6000);
emitter.on('jni', (_, args) => {
    enable = !enable;
});

const isNativeEnabled = false;
const predicate = (r) => {
    function isWithinOwnRange(ptr: NativePointer) {
        const path = Native.Inject.modules.findPath(ptr);
        return path?.includes('/data') === true && !path.includes('/com.google.android.trichromelibrary');
    }

    if (!isNativeEnabled) return false;
    if (isWithinOwnRange(r)) return true;
    return false && Native.Inject.modules.find(r) === null;
};

JniTrace.attach(({ returnAddress }) => {
    return enable && predicate(returnAddress);
});

Native.Files.hookAccess(predicate);
Native.Files.hookOpen(predicate);
Native.Files.hookFopen(predicate, undefined, true);
// Native.Files.hookStat(predicate);
// Native.Files.hookReadlink(predicate);
Native.Files.hookRemove(predicate, (path) => false);
// Native.Strings.hookStrlen(predicate);
// Native.Strings.hookStrcpy(predicate);
// Native.Strings.hookStrcmp(predicate);
// Native.Strings.hookStrstr(predicate);
Native.TheEnd.hook(predicate);

// Native.Time.hookDifftime(predicate);
// Native.Time.hookTime(predicate);
// Native.Time.hookLocaltime(predicate);
// Native.Time.hookGettimeofday(predicate);
Anticloak.Debug.hookPtrace();

// Native.Logcat.hookLogcat();
Interceptor.attach(Libc.system, {
    onEnter(args) {
        logger.info({ tag: 'system' }, `system(${args[0].readCString()})`);
    },
});
// [
//     'fwrite',
//     'faccessat',

//     'vprintf',
//     '__android_log_print',
//     'sprintf',
//     'statvfs',
//     'pthread_kill',
//     'killpg',
//     'signal',
//     'abort',
// ].forEach((ex) => {
//     const exp = Module.getExportByName(null, ex);
//     Interceptor.attach(exp, {
//         onEnter(args) {
//             const arg = ex === '__android_log_print' ? args[2] : args[0];
//             switch (ex) {
//                 case '__android_log_print': {
//                     logger.info({ tag: ex }, `"${args[2].readCString()}"`);
//                     return;
//                 }
//                 case 'sprintf': {
//                     logger.info({ tag: ex }, `"${args[0].readCString()}" "${args[1].readCString()}"`);
//                     return;
//                 }
//                 default: {
//                     logger.info({ tag: ex }, `"${arg.readCString()}" -> ${DebugSymbol.fromAddress(this.returnAddress)}`);
//                     return;
//                 }
//             }
// },
//     });
// });
const fork_ptr = Module.getExportByName('libc.so', 'fork');
const fork = new NativeFunction(fork_ptr, 'int', []);
Interceptor.replace(
    fork_ptr,
    new NativeCallback(
        () => {
            const retval = fork();
            logger.info({ tag: 'fork' }, `${retval}`);
            // return -1;
            return retval;
        },
        'int',
        [],
    ),
);
Interceptor.replace(
    Libc.pthread_create,
    new NativeCallback(
        (ptr0, ptr1, ptr2, ptr3) => {
            const ret = Libc.pthread_create(ptr0, ptr1, ptr2, ptr3);
            logger.info(
                { tag: 'pthread_create', replace: true },
                `${ptr0}, ${ptr1}, ${DebugSymbol.fromAddress(ptr2)}, ${ptr3} -> ${ret}`,
            );
            return ret;
        },
        'int',
        ['pointer', 'pointer', 'pointer', 'pointer'],
    ),
);
// const fgetsPtr = Module.getExportByName('libc.so', 'fgets');
// const fgets = new NativeFunction(fgetsPtr, 'pointer', ['pointer', 'int', 'pointer']);
// Interceptor.replace(
//     fgetsPtr,
//     new NativeCallback(
//         (buffer, size, fp) => {
//             const retval = fgets(buffer, size, fp);
//             logger.info({ tag: 'fgets' }, buffer.readCString()?.trimEnd());
//             return retval;
//         },
//         'pointer',
//         ['pointer', 'int', 'pointer'],
//     ),
// );
