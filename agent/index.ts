import { ClassLoader, findHook, getHookUnique } from '@clockwork/hooks';
import * as Anticloak from '@clockwork/anticloak';
import * as Network from '@clockwork/network';
import * as Native from '@clockwork/native';
import * as JniTrace from '@clockwork/jnitrace';
import * as Cocos2dx from '@clockwork/cocos2dx';
import * as Unity from '@clockwork/unity';
import { hook } from '@clockwork/hooks';
import { Text, Classes, Libc, enumerateMembers, findClass, stacktrace, getFindUnique, ClassesString } from '@clockwork/common';
import { log, Filter, Color, logger } from '@clockwork/logging';
import { always, ifKey, ifReturn } from '@clockwork/hooks/dist/addons';
import { dumpFile, gPtr } from '@clockwork/native';
import { createHash } from 'crypto';
import * as Dump from '@clockwork/dump';
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
}

function hookWebview() {
    hook(Classes.WebView, 'evaluateJavascript');
    hook(Classes.WebView, 'loadDataWithBaseURL');
    hook(Classes.WebView, 'loadUrl');
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
        replace: ifKey(function (key) {
            switch (key) {
            }
        }),
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

function hookCountry() {
    const timezoneId = 'America/Sao_Paulo';
    const mcc = '724',
        mnc = '10',
        code = '55',
        mccmnc = `${mcc}${mnc}`;
    const locale = ['BR', 'pt'],
        country = 'br',
        operator = 'Vivo';
    const number = `${code}${Text.stringNumber(10)}`,
        subscriber = `${mccmnc}${Text.stringNumber(10)}`;
    hook(Classes.TelephonyManager, 'getLine1Number', { replace: always(number) });
    hook(Classes.TelephonyManager, 'getSimOperator', { replace: always(mccmnc) });
    hook(Classes.TelephonyManager, 'getSimOperatorName', { replace: always(operator) });
    hook(Classes.TelephonyManager, 'getNetworkOperator', { replace: always(mccmnc) });
    hook(Classes.TelephonyManager, 'getNetworkOperatorName', { replace: always(operator) });
    hook(Classes.TelephonyManager, 'getSimCountryIso', { replace: always(country) });
    hook(Classes.TelephonyManager, 'getNetworkCountryIso', { replace: always(country) });
    hook(Classes.TelephonyManager, 'getSubscriberId', { replace: always(subscriber) });
    hook(Classes.TimeZone, 'getID', { replace: always(timezoneId) });
    hook(Classes.Locale, 'getDefault', {
        replace: () => Classes.Locale.$new(locale[1], locale[0]),
        logging: { call: false, return: false },
    });
    // hook(Classes.Locale, 'getCountry', { replace: always('BR') });
    // hook(Classes.Locale, 'getLanguage', { replace: always('pt') });
    // hook(Classes.Locale, 'getDisplayCountry', { replace: always('Brazil') });
    // hook(Classes.Locale, 'toString', { replace: always('pt_BR') });
}

function hookDevice() {
    /* device Settings*/
    const Build = {
        MODEL: 'Secret SC-1224',
        DEVICE: 'Device Value',
        BOARD: 'Device Board',
        // PRODUCT: 'Device Product',
        // HARDWARE: 'Device Hardware',
        FINGERPRINT: 'foo/bar/Device:11/11/2022:user/sig-keys',
        MANUFACTURER: 'Company Co',
        BOOTLOADER: 'Boot-JJ129-ac',
        BRAND: 'China Telecom',
        HOST: 'HOST Co',
        DISPLAY: 'Foo procuctions and bar 1-0-111',
        TAGS: 'Production Build',
        SERIAL: 'Seriously ?',
        TYPE: 'Production build',
        USER: 'LINUX General',
        UNKNOWN: 'KGTT General',
    };
    Reflect.ownKeys(Build).forEach((key: any) => {
        const field = Classes.Build[key];
        if (field) field.value = Build[key];
    });
    //buildProperties.ANDROID_ID.value='b6932a00c88d8b50';
}

function hookSettings() {
    const settings = { development_settings_enabled: 0, adb_enabled: 0, install_non_market_apps: 0, play_protect_enabled: 1 };
    hook(Classes.Settings$Secure, 'getInt', {
        logging: { call: true, return: true },
        replace(method, ...params) {
            const key = params[1];
            if (settings.hasOwnProperty(key)) return settings[key];
            return method.call(this, ...params);
        },
    });
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

Java.performNow(() => {
    hookActivity();
    hookWebview();
    hookNetwork();
    hookJson(function (key, method) {
        switch (key) {
            case 'referrer':
                return 'utm_amazon';
        }
    });
    hookPrefs(function (key, method) {
        switch (key) {
            case 'LOAD_WHEEL':
                return true;
            case 'invld_id':
            case 'key_umeng_sp_oaid':
            case 'UTDID2':
                return 'https://google.pl/search?q=nya';
            case 'adid':
            case 'tenjin_advertising_id':
            case 'uuid':
            case 'KEY_UID':
            case 'deviceId':
            case 'deviceuuid':
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
            case 'amuseville_data':
                return 'utm_medium=Non-organic';
            case 'userCountry':
            case 'key_real_country':
                return 'BR';
            case '9hgm':
            case 'vv4gW':
                return 'https://google.pl/search?q=hi';
        }
    });
    hookCrypto();
    hookSettings();
    hook(Classes.Runtime, 'exec', {
        replace(method, ...args) {
            if (`${args[0]}`.includes('nya') === false) return Classes.Runtime.exec.call(this, 'echo nya');
            return method.call(this, ...args);
        },
    });
    hookCountry();
    hookDevice();
    Anticloak.InstallReferrer.replace({ install_referrer: 'utm_medium=Non-organic' });

    hook(Classes.DexPathList, '$init');

    //
    let x: any = 0;
    ClassLoader.perform((cl) => {
        // logger.info({ tag: 'cl' }, `${cl?.$className} ${cl}`);
    });
});

Network.attachGetAddrInfo();
Network.attachGetHostByName();
Network.attachNativeSocket();
Network.attachInteAton();
Native.attachRegisterNatives();
Native.attachSystemPropertyGet(function (key) {
    // console.log(DebugSymbol.fromAddress(this.returnAddress));
    switch (key) {
        case 'ro.debuggable':
            return '0';
        case 'ro.product.model':
            return 'Raven';
        case 'ro.product.manufacturer':
        case 'ro.product.brand':
            return 'Xiaomi';
        case 'ro.build.flavor':
            return 'raven-release';
        case 'ro.product.board':
            return 'sdm720';
        case 'gsm.version.baseband':
            return 's';
        case 'ro.boot.qemu.gltransport.name':
            return 'n';
    }
    // if (Native.Inject.isWithinOwnRange(this.returnAddress)) return 'nya';
});

// Anticloak.Jigau.memoryPatch('l7df3e7c4.so');
// [INFO] {"name": "libcocos.so", "fn_dump": "0x002ad2a0", "fn_key": "0x00293468"}
// Cocos2dx.dump({ name: 'libcocos2djs.so', fn_dump: ptr(0x00c0036c), fn_key: ptr(0x00c0036c) });
// Unity.setVersion('2020.3.0f1c1');
// Unity.attachStrings();

let x = false;
// // setTimeout(() => (x = false), 5000);
const predicate = (r) => x && Native.Inject.isWithinOwnRange(r);
// JniTrace.attach(({ returnAddress }) => {
//     return predicate(returnAddress);
// });

// [/*'free',*/ 'strlen', 'strstr', 'strncmp', 'strcmp'].forEach((ex) => {
//     const strcmp = Module.getExportByName(null, ex);
//     Native.Inject.attachInModule(predicate, strcmp, {
//         onEnter(args) {
//             this.a0 = args[0].readCString();
//             this.a1 = args[1].readCString();
//             logger.info({ tag: ex }, `"${this.a0}", "${this.a1}" ${Color.bracket(Native.Inject.modules.findName(this.returnAddress))}`);
//         },
//         onLeave(retval) {},
//     });
// });
// [
//     'fopen',
//     'fwrite',
//     'stat',
//     'access',
//     'vprintf',
//     '__android_log_print',
//     'sprintf',
//     'open',
//     'statvfs',
//     'access',
//     'pthread_kill',
//     'kill',
//     'exit',
//     '_exit',
//     'killpg',
//     'signal',
//     'abort',
// ].forEach((ex) => {
//     const exp = Module.getExportByName(null, ex);
//     Native.Inject.attachInModule(predicate, exp, {
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
//                     logger.info({ tag: ex }, `"${arg.readCString()}"`);
//                     return;
//                 }
//             }
//         },
//     });
// });

// ['kill'].forEach((ex) => {
//     const kill = Module.getExportByName(null, ex);
//     Native.Inject.attachInModule(predicate, kill, {
//         onEnter(args) {
//             logger.info({ tag: ex }, `kill called !`);
//         },
//         onLeave(retval) {},
//     });
// });
