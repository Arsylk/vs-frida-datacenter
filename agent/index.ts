import * as Anticloak from '@clockwork/anticloak';
import {
    Classes,
    ClassesString,
    Text,
    emitter,
    enumerateMembers,
    findClass,
    getFindUnique,
    stacktrace,
    tryNull,
} from '@clockwork/common';
import { toHex } from '@clockwork/common/dist/text';
import * as Dump from '@clockwork/dump';
import { ClassLoader, Filter, always, compat, getHookUnique, hook, ifKey } from '@clockwork/hooks';
import type { FridaMethodThisCompat } from '@clockwork/hooks/dist/types';
import * as JniTrace from '@clockwork/jnitrace';
import { Color, logger } from '@clockwork/logging';
import * as Native from '@clockwork/native';
import { getSelfProcessName } from '@clockwork/native/dist/utils.js';
import * as Network from '@clockwork/network';
import * as Unity from '@clockwork/unity';
const { red, green, redBright, magentaBright: pink, gray, dim, black } = Color.use();
const uniqHook = getHookUnique(false);
const uniqFind = getFindUnique(false);

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
                logger.info({ tag: 'exec' }, pink(stacktrace()));
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
            logger.info({ tag: 'exec' }, `${newlist} ${pink(stacktrace())}`);
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
        before(method, ...args) {
        },
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
        predicate: (_, index) => index !== 0 && _.argumentTypes.length === 1 && _.argumentTypes[0].className === ClassesString.String,
        replace(method, ...args) {
            if (`${args[0]}`.includes("isApp")) {
                method.call(this, '{"imgs":null,"ty":"okhttp/4.12.0","user_info":"send me t","v":"2","isApp":1,"user":"TestNya","timestamp":1732709955063,"token":"ab2398df147908df45530b2fe3e4f42d"}')
                logger.info({ tag: 'trace' }, pink(stacktrace()))

            }
            method.call(this, ...args)
        }
    });

    hook(Classes.JSONObject, 'has', {
        loggingPredicate: Filter.json,
        logging: { multiline: false, short: true },
        replace(method, key) {
            const bound = method.bind(this, key)
            const found = fn?.(key, 'has', bound) !== undefined;
            return found || bound();
        },
    });

    for (const item of getOpt) {
        hook(Classes.JSONObject, item, {
            loggingPredicate: Filter.json,
            logging: { multiline: false, short: true },
            replace(method, ...args) {
                const bound = method.bind(this, ...args)
                const value = fn?.(args[0], item, bound)
                return value !== undefined ? value : bound()
            }
        });
    }

    for (const type of types) {
        for (const item of getOpt) {
            const name = `${item}${type}`;
            hook(Classes.JSONObject, name, {
                loggingPredicate: Filter.json,
                logging: { multiline: false, short: true },
                replace(method, ...args) {
                    const bound = method.bind(this, ...args)
                    const value = fn?.(args[0], item, bound)
                    return value !== undefined ? value : bound()
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
                    hook(clazz, member);
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
        logging: { call: false, return: false },
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
    const C4_URL = 'https://google.pl/search?q=hi';
    const AD_ID = 'fwqna41l-mrux-l4pi-mi6q-imrr3t83da4n';
    const INSTALL_REFERRER =
        'utm_source=facebook_ads&utm_medium=Non-rganic&media_source=true_network&http_referrer=BingSearch';
    hookActivity();
    hookWebview(true);
    hookNetwork();
    hookJson(function (key, _method, fallback) {
        switch (key) {
            case 'install_referrer':
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
                return 'BR';
        }
    });
    hookPreferences(() => { });
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

    hook(Classes.ApplicationPackageManager, 'getPackageInfo', {
        logging: { multiline: false, short: true },
        replace(method, ...args) {
            if (`${args[0]}` === 'com.topjohnwu.magisk') {
                args[0] = 'come.just.test.fake.app';
            }
            return method.call(this, ...args);
        },
        after(_method, returnValue) {
            const mPackage = this.mContext.value.getPackageName();
            if (mPackage === returnValue?.packageName?.value) {
            }
        },
    });

    Anticloak.Debug.hookVMDebug();
    // Anticloak.Debug.hookDigestEquals();
    Anticloak.Debug.hookVerify();
    Anticloak.generic();
    Anticloak.hookDevice();
    Anticloak.hookSettings();
    Anticloak.hookAdId(AD_ID);
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
        replace: ifKey((key) => {
            const value = Anticloak.BuildProp.systemMapper(key);
            return value;
        }),
    });

    hook(Classes.DisplayManager, 'createVirtualDisplay');

    hook(Classes.SimpleDateFormat, 'parse', {
        logging: { short: true, multiline: false },
    });

    hook(Classes.DexPathList, '$init', {
        logging: { short: true, multiline: false },
    });

    // hook(Classes.Runtime, 'loadLibrary0', { logging: { short: true, yymultiline: false } });

    hook('android.app.ForegroundServiceTypePolicy$ForegroundServiceTypePolicyInfo', 'isTypeDisabled', {
        replace() { return false }
    })
    hook('android.app.ForegroundServiceTypePolicy$ForegroundServiceTypePermissions', 'checkPermissions', {
        replace() { return 0 }
    })
    hook(Classes.Service, '$init', {
        before(method, ...args) {
            const clazz = findClass(this.$className)
            clazz && hook(clazz, 'startForeground', {
                predicate: (overload) => overload.argumentTypes.length === 2,
                replace(method, arg0, arg1) {
                    return clazz.startForeground(this, arg0, arg1, Classes.ServiceInfo.FOREGROUND_SERVICE_TYPE_SYSTEM_EXEMPTED.value)
                }
            })
        },
    })

    ClassLoader.perform(() => { });
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
    logger.error(
        { tag: 'exception' },
        `${black(exception.type)}: ${exception.memory?.operation} ${exception.memory?.address} at: ${gray(`${exception.address}`)} x0: ${red(`${ctx.x0}`)} x1: ${red(`${ctx.x1}`)}`,
    );
    return exception.type === 'abort' && false;
});

Native.initLibart();
// Cocos2dx.dump({ name: 'libcocos2djs.so', fn_dump: ptr(0x0080004c), fn_key: ptr(0x006f9170) });
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

// Unity.setVersion('2022.3.16f1');
Unity.patchSsl();
Unity.attachStrings();
Unity.attachScenes();

emitter.on('il2cpp', Unity.listGameObjects);

const isNativeEnabled = true;
const predicate = (r) => {
    function isWithinOwnRange(ptr: NativePointer) {
        const path = Native.Inject.modules.findPath(ptr);

        return path?.includes('/data') === true && !path.includes('/com.google.android.trichromelibrary');
    }

    if (!isNativeEnabled) return false;
    if (!r) return false;
    if (isWithinOwnRange(r)) return true;
    return !true && Native.Inject.modules.find(r) === null;
};

let enable = true;
setTimeout(() => (enable = true), 9000);
emitter.on('jni', (_) => (enable = !enable));
JniTrace.attach(({ returnAddress }) => {
    return enable && predicate(returnAddress);
});

// Dump.initSoDump();

Native.Files.hookAccess(predicate);
// Native.Files.hookOpen(predicate);
Native.Files.hookFopen(predicate, true, (path) => {
    if (path === '/proc/self/maps' || path === `/proc/${Process.id}/maps`) {
        return `/data/data/${getSelfProcessName()}/files/fake_maps`;
    }
    if (path?.endsWith('/su')) {
        return path.replace(/\/su$/, '/nya');
    }
});
Native.Files.hookOpendir(predicate);
// Native.Files.hookStat(predicate);
Native.Files.hookRemove(predicate);
// Native.Strings.hookStrlen(predicate);
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
Anticloak.Debug.hookPtrace();
Native.Pthread.hookPthread_create();
// Native.Logcat.hookLogcat();
// Anticloak.Jigau.memoryPatch();

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

emitter.on('so', () => Dump.initSoDump());
emitter.on('dex', () => Dump.scheduleDexDump(0));

const GL_ENUM = {
    7936: 'GL_VENDOR',
    7937: 'GL_RENDERER',
    7938: 'GL_VERSION',
    7939: 'GL_EXTENSIONS',
};
Interceptor.attach(Module.getExportByName(null, 'glGetString'), {
    onEnter(args: any) {
        this.name = args[0];
    },
    onLeave(retval) {
        const name = this.name.toInt32();
        const label = GL_ENUM[name] ?? 'UNKNOWN';
        if (label === 'GL_VENDOR' || label === 'GL_RENDERER' || label === 'GL_EXTENSIONS') {
            const value = retval.readCString();
            const newvalue = value?.replace(
                /x86|sdk|open|source|emulator|google|aosp|apple|ranchu|goldfish|cuttlefish|generic|unknown|android_emu/gi,
                'nya',
            );
            retval.writeUtf8String(newvalue ?? '');
        }
        logger.info({ tag: 'opengl' }, `${label}(${dim(`${this.name}`)}) -> ${retval.readCString()}`);
    },
});

const fork_ptr = Module.getExportByName('libc.so', 'fork');
const fork = new NativeFunction(fork_ptr, 'int', []);
Interceptor.replace(
    fork_ptr,
    new NativeCallback(
        function () {
            const retval = fork();
            logger.info({ tag: 'fork' }, `${retval} ${Native.addressOf(this.returnAddress)}`);
            return retval;
            // return -1;
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
                // const endUserMssg = buffer.readCString()?.trimEnd();
                // logger.info({ tag: 'fgets' }, `${endUserMssg}`);
            }
            return retval;
        },
        'pointer',
        ['pointer', 'int', 'pointer'],
    ),
);

// // setTimeout(() => {
// const dir = `/data/data/com.scoutant.shorttv/files`;
// Libc.system(Memory.allocUtf8String(`mkdir -p ${dir}`));

// // @ts-ignore
// File.writeAllText(`${dir}/fake_maps`, File.readAllText('/proc/self/maps'));
// })
// '));
