import { ClassLoader, findHook, getHookUnique } from '@clockwork/hooks';
import * as Anticloak from '@clockwork/anticloak';
import * as Network from '@clockwork/network';
import * as Native from '@clockwork/native';
import * as Cocos2dx from '@clockwork/cocos2dx';
import * as Unity from '@clockwork/unity';
import { hook } from '@clockwork/hooks';
import {
    Text,
    Classes,
    Libc,
    enumerateMembers,
    findClass,
    stacktraceList,
    getFindUnique,
    ClassesString,
    stacktrace,
} from '@clockwork/common';
import { log, Filter, Color, logger } from '@clockwork/logging';
import { always, ifKey, ifReturn } from '@clockwork/hooks';
import { dumpFile, gPtr } from '@clockwork/native';
import { createHash } from 'crypto';
import * as Dump from '@clockwork/dump';
import * as JniTrace from '@clockwork/jnitrace';
import { DefaultDeserializer } from 'v8';
import { method } from '@clockwork/logging/dist/color';
import { isTypeAliasDeclaration } from 'frida-compile/ext/typescript';
const uniqHook = getHookUnique();
const uniqFind = getFindUnique();
const { blue, blueBright, redBright, magentaBright: pink, yellow, dim } = Color.use();

function hookActivity() {
    hook(Classes.Activity, '$init', {
        after() {
            console.warn(`$init: ${this}`);
        },
    });
    hook(Classes.Activity, 'onCreate', {
        after() {
            console.warn(` onCreate: ${this}`);
        },
        logging: { arguments: false },
    });
    hook(Classes.Activity, 'onResume', {
        after() {
            console.warn(`  onResume: ${this}`);
        },
        logging: { arguments: false },
    });
    hook(Classes.Activity, 'startActivity');
    hook(Classes.Activity, 'startActivities');
}

function hookWebview(trace?: boolean) {
    hook(Classes.WebView, 'evaluateJavascript');
    hook(Classes.WebView, 'loadDataWithBaseURL');
    hook(Classes.WebView, 'loadUrl', {
        after(method, returnValue, ...args) {
            if (trace) {
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
                        //@ts-ignore
                        logger.info(`${dim(method)} ${Color.url(Classes.String.valueOf(url))}`);
                    }
                },
            });
    });

    hook(Classes.InetSocketAddress, '$init', { logging: { multiline: false, short: true } });
}

function hookCrypto() {
    //  hook(Classes.SecretKeySpec, '$init', {
    //     logging: { multiline: false },
    // });
    // hook(JTypes.Cipher, 'getInstance');
    hook(Classes.Cipher, 'doFinal', {
        after(m, r, ...p) {
            if (this.opmode.value === 1) {
                const str = Classes.String.$new(p[0]);
                logger.info({ tag: 'encrypt' }, `${str}`);
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

function bypassIntentFlags() {
    hook(Classes.PendingIntent, 'getBroadcastAsUser', {
        replace(method, ...args) {
            const flags = args[3];
            const flagImmutableSet = (flags & Classes.PendingIntent.FLAG_IMMUTABLE.value) != 0;
            const flagMutableSet = (flags & Classes.PendingIntent.FLAG_MUTABLE.value) != 0;
            if (!flagImmutableSet && !flagMutableSet) {
                const newFlags = flags | Classes.PendingIntent.FLAG_MUTABLE.value;
                args[3] = newFlags;
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

Java.performNow(() => {
    const INSTALL_REFERRER = 'utm_medium=Non-organic&utm_source=facebook_ads';
    hookActivity();
    hookWebview();
    hookNetwork();
    hookJson(function (key, method) {
        switch (key) {
            case 'install_referrer':
            case 'referrer':
            case 'applink_url':
                return INSTALL_REFERRER;
            case 'gaid':
            case 'android_imei':
            case 'android_meid':
            case 'android_device_id':
                return '4102978102398';
            case 'status':
                return 1;
        }
    });
    hookPrefs(function (key, method) {
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
            case 'deviceuuid':
            case 'uuid_worldmap_quiz':
            case 'AdPlatformSequenceNative':
            case 'AdAlternativeBanner':
            case 'AdAlternativeNative':
                return '123e4567-e89b-42d3-a456-556642440000';
            case 'MEDIA_SOURCE':
            case 'tenjin_campaign_id':
            case 'tenjin_campaign_name':
            case 'tenjin_ad_network':
            case 'last_active_buy_media_source':
            case 'last_active_buy_channel':
            case 'last_active_buy_campaign':
            case 'tenjinGoogleInstallReferrer':
            case 'install_referrer':
            case 'referrer':
            case 'AFConversionData':
            case 'conversionData':
            case 'dataScore':
                return INSTALL_REFERRER;
            case 'country':
            case 'userCountry':
            case 'key_real_country':
            case 'KEY_LOCALE':
                return 'BR';
                return true;
            case 'card':
                return 'https://google.pl/search?q=hi';
        }
    });
    hookCrypto();
    hook(Classes.Runtime, 'exec', {
        replace(method, ...args) {
            // if (`${args[0]}`.includes('nya') === false) return Classes.Runtime.exec.call(this, 'echo nya');
            return method.call(this, ...args);
        },
    });
    hook(Classes.Process, 'killProcess', {
        replace: () => logger.info({ tag: 'killProcess' }, redBright(stacktrace())),
        logging: { multiline: false, return: false },
    });

    hook(Classes.Activity, 'finish', { replace: () => {}, logging: { multiline: false, return: false } });
    hook(Classes.Activity, 'finishAffinity', { replace: () => {}, logging: { multiline: false, return: false } });

    hook(Classes.ApplicationPackageManager, 'getPackageInfo', {
        logging: { multiline: false, short: true },
        after(method, returnValue, ...args) {
            const mPackage = this.mContext.value.getPackageName();
            if (mPackage === returnValue?.packageName?.value) {
            }
        },
    });

    Anticloak.generic();
    Anticloak.hookDevice();
    Anticloak.hookSettings();
    Anticloak.Country.mock('BR');
    Anticloak.InstallReferrer.replace({ install_referrer: INSTALL_REFERRER });

    hook(Classes.SystemProperties, 'get', {
        logging: { multiline: false, short: true },
        replace: ifKey(function (key) {
            const value = Anticloak.BuildProp.propMapper(key);
            return value;
        }),
    });
    hook(Classes.System, 'getProperty', {
        logging: { multiline: false, short: true },
        replace: ifKey(function (key) {
            const value = Anticloak.BuildProp.systemMapper(key);
            return value;
        }),
    });

    // hook('android.app.Dialog', 'show', { replace() {this.dismiss()} });

    //     Java.use(() => {
    // const ClockworkHandler = Java.registerClass({
    //         name: 'DefaultUncaughtExceptionHandler',
    //         implements: [Classes.Thread$UncaughtExceptionHandler],
    //         methods: {
    //             uncaughtException: {
    //                 argumentTypes: [ClassesString.Thread, ClassesString.Throwable],
    //                 returnType: 'void',
    //                 implementation: function (thread, err) {
    //                     logger.error({ tag: 'ungandled' }, `{$err}`);
    //                 },
    //             },
    //         },
    //     });
    // Classes.Thread.setDefaultUncaughtExceptionHandler(ClockworkHandler.$new());
    // })

    hook(Classes.DexPathList, '$init', { logging: { short: true, multiline: false } });
    ClassLoader.perform((cl) => {});
});

Network.attachGetAddrInfo();
Network.attachGetHostByName();
Network.attachNativeSocket();
Network.attachInteAton();
// Native.attachRegisterNatives();
Native.attachSystemPropertyGet(function (key) {
    const value = Anticloak.BuildProp.propMapper(key);
    if (value) return value;
    // if (Native.Inject.isWithinOwnRange(this.returnAddress)) return 'nya';
});

// Anticloak.Jigau.memoryPatch()
// [INFO] {"name": "libcocos.so", "fn_dump": "0x002ad2a0"cklc"fn_key": "0 x00293468"}
// Cocos2dx.dump({ name: 'libcocos2djs.so', fn_dump: ptr(0x007b6a1c), fn_key: ptr(0x006a7da0) });
// Cocos2dx.hookLocalStorage(function (key) {
//     switch (key) {
//         case 'force_update':
//             return 'true';
//     }
// });
// Unity.setVersion('2020.3.26f1');
// Unity.attachStrings();

let isNativeEnabled = true;
const predicate = (r) => isNativeEnabled && Native.Inject.isWithinOwnRange(r);
JniTrace.attach(({ returnAddress }) => {
    return true && predicate(returnAddress);
});

Native.Files.hookAccess(predicate);
Native.Files.hookOpen(predicate);
Native.Files.hookFopen(predicate);
Native.Files.hookStat(predicate);
Native.Files.hookRemove(predicate);
Native.Strings.hookStrlen(predicate);
Native.Strings.hookStrstr(predicate);
Native.Strings.hookStrcpy(predicate);

// Native.Strings.hookStrcmp(predicate);
// function doonce(dec: (string) => string) {
//     const store: {[key: string]: string} = {};
//     //@ts-ignore
//     const file = new File("/data/local/tmp/allargs.txt", "r")
//     let line;
//     //@ts-ignore
//     while (line = file.readLine()) {
//         const decoded = dec(line);
//         store[line] = decoded
//         //@ts-ignore
//         // outfile.write(msg)
//     }
//     const ser = JSON.stringify(store);
//     const ptr = Memory.allocUtf8String(ser)
//     Native.dumpFile(ptr, ser.length, "jsondu.json", "cracked")
// }
[
    'fwrite',
    'faccessat',
    'vprintf',
    '__android_log_print',
    'sprintf',
    'statvfs',
    'pthread_kill',
    'kill',
    '_exit',
    'killpg',
    'signal',
    'abort',

    'execl',
    'execlp',
    'execle',
    'execv',
    'execvp',
    'execvpe',
].forEach((ex) => {
    const exp = Module.getExportByName(null, ex);
    Native.Inject.attachInModule(predicate, exp, {
        onEnter(args) {
            const arg = ex === '__android_log_print' ? args[2] : args[0];
            switch (ex) {
                case '__android_log_print': {
                    logger.info({ tag: ex }, `"${args[2].readCString()}"`);
                    return;
                }
                case 'sprintf': {
                    logger.info({ tag: ex }, `"${args[0].readCString()}" "${args[1].readCString()}"`);
                    return;
                }
                default: {
                    logger.info({ tag: ex }, `"${arg.readCString()}" -> ${DebugSymbol.fromAddress(this.returnAddress)}`);
                    return;
                }
            }
        },
    });
});

['kill'].forEach((ex) => {
    const kill = Module.getExportByName(null, ex);
    Native.Inject.attachInModule(predicate, kill, {
        onEnter(args) {
            logger.info({ tag: ex }, `kill called !`);
        },
        onLeave(retval) {},
    });
});

Interceptor.replace(
    Module.getExportByName(null, 'exit'),
    new NativeCallback(
        function (code) {
            logger.info({ tag: 'exit' }, `exit(${code}) called !`);
            return 0;
        },
        'int',
        ['int', 'int'],
    ),
);

const fork_ptr = Module.getExportByName('libc.so', 'fork');
const fork = new NativeFunction(fork_ptr, 'int', []);
Interceptor.replace(
    fork_ptr,
    new NativeCallback(
        function () {
            logger.info({ tag: 'fork' }, `${-1}`);
            // return -1;
            return fork();
        },
        'int',
        [],
    ),
);

// Interceptor.replace(
//     Libc.pthread_create,
//     new NativeCallback(
//         function (ptr0, ptr1, ptr2, ptr3) {
//             const ret = Libc.pthread_create(ptr0, ptr1, ptr2, ptr3);
//             logger.info({ tag: 'pthread_create', replace: true }, `${ptr0}, ${ptr1}, ${ptr2}, ${ptr3} -> ${ret}`);
//             return ret;
//         },
//         'int',
//         ['pointer', 'pointer', 'pointer', 'pointer'],
//     ),
// );
// var fgetsPtr = Module.getExportByName('libc.so', 'fgets');
// var fgets = new NativeFunction(fgetsPtr, 'pointer', ['pointer', 'int', 'pointer']);
// Interceptor.replace(
//     fgetsPtr,
//     new NativeCallback(
//         function (buffer, size, fp) {
//             var retval = fgets(buffer, size, fp);
//             var bufstr = buffer.readCString();

//             if (bufstr?.includes('TracerPid:')) {
//                 buffer.writeUtf8String('TracerPid:\t0');
//                 console.log('Bypassing TracerPID Check');
//             }

//             if (bufstr?.includes('frida') || bufstr?.includes('hluda')) {
//                 console.log('Keywords in Buffer', retval);
//                 var newstr = bufstr.replace("frida", "libcc");
//                 buffer.writeUtf8String(newstr);
//                 console.error(bufstr);
//                 return retval;
//             }
//             return retval;
//         },
//         'pointer',
//         ['pointer', 'int', 'pointer'],
//     ),
// );
// var fopenPtr = Module.getExportByName('libc.so', 'fopen');
// var fopen = new NativeFunction(fopenPtr, 'pointer', ['pointer', 'pointer']);
// Interceptor.replace(
//     fopenPtr,
//     new NativeCallback(
//         function (path, mode) {
//             var ch = path.readCString();
//             if (ch?.includes('/proc/') && ch?.includes('/')) {
//                 Memory.protect(path, (ch.length / Process.pageSize + (ch.length % Process.pageSize)), 'rwx');
//                 path.writeUtf8String('/proc/12/cmdline');
//                 logger.info({ tag: 'fopen', replace: true }, `${path.readCString()}`);
//                 return fopen(path, mode);
//             }
//             var retval = fopen(path, mode);
//             logger.info({ tag: 'fopen' }, `${path.readCString()}`);
//             return retval;
//         },
//         'pointer',
//         ['pointer', 'pointer'],
//     ),
// );
