/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/quick-format-unescaped/index.js":
/*!******************************************************!*\
  !*** ./node_modules/quick-format-unescaped/index.js ***!
  \******************************************************/
/***/ ((module) => {


function tryStringify (o) {
  try { return JSON.stringify(o) } catch(e) { return '"[Circular]"' }
}

module.exports = format

function format(f, args, opts) {
  var ss = (opts && opts.stringify) || tryStringify
  var offset = 1
  if (typeof f === 'object' && f !== null) {
    var len = args.length + offset
    if (len === 1) return f
    var objects = new Array(len)
    objects[0] = ss(f)
    for (var index = 1; index < len; index++) {
      objects[index] = ss(args[index])
    }
    return objects.join(' ')
  }
  if (typeof f !== 'string') {
    return f
  }
  var argLen = args.length
  if (argLen === 0) return f
  var str = ''
  var a = 1 - offset
  var lastPos = -1
  var flen = (f && f.length) || 0
  for (var i = 0; i < flen;) {
    if (f.charCodeAt(i) === 37 && i + 1 < flen) {
      lastPos = lastPos > -1 ? lastPos : 0
      switch (f.charCodeAt(i + 1)) {
        case 100: // 'd'
        case 102: // 'f'
          if (a >= argLen)
            break
          if (args[a] == null)  break
          if (lastPos < i)
            str += f.slice(lastPos, i)
          str += Number(args[a])
          lastPos = i + 2
          i++
          break
        case 105: // 'i'
          if (a >= argLen)
            break
          if (args[a] == null)  break
          if (lastPos < i)
            str += f.slice(lastPos, i)
          str += Math.floor(Number(args[a]))
          lastPos = i + 2
          i++
          break
        case 79: // 'O'
        case 111: // 'o'
        case 106: // 'j'
          if (a >= argLen)
            break
          if (args[a] === undefined) break
          if (lastPos < i)
            str += f.slice(lastPos, i)
          var type = typeof args[a]
          if (type === 'string') {
            str += '\'' + args[a] + '\''
            lastPos = i + 2
            i++
            break
          }
          if (type === 'function') {
            str += args[a].name || '<anonymous>'
            lastPos = i + 2
            i++
            break
          }
          str += ss(args[a])
          lastPos = i + 2
          i++
          break
        case 115: // 's'
          if (a >= argLen)
            break
          if (lastPos < i)
            str += f.slice(lastPos, i)
          str += String(args[a])
          lastPos = i + 2
          i++
          break
        case 37: // '%'
          if (lastPos < i)
            str += f.slice(lastPos, i)
          str += '%'
          lastPos = i + 2
          i++
          a--
          break
      }
      ++a
    }
    ++i
  }
  if (lastPos === -1)
    return f
  else if (lastPos < flen) {
    str += f.slice(lastPos)
  }

  return str
}


/***/ }),

/***/ "./agent/index.ts":
/*!************************!*\
  !*** ./agent/index.ts ***!
  \************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var hooks_1 = __webpack_require__(/*! @clockwork/hooks */ "./packages/hooks/dist/index.js");
var Anticloak = __importStar(__webpack_require__(/*! @clockwork/anticloak */ "./packages/anticloak/dist/index.js"));
var Network = __importStar(__webpack_require__(/*! @clockwork/network */ "./packages/network/dist/index.js"));
var Native = __importStar(__webpack_require__(/*! @clockwork/native */ "./packages/native/dist/index.js"));
var JniTrace = __importStar(__webpack_require__(/*! @clockwork/jnitrace */ "./packages/jnitrace/dist/index.js"));
var hooks_2 = __webpack_require__(/*! @clockwork/hooks */ "./packages/hooks/dist/index.js");
var common_1 = __webpack_require__(/*! @clockwork/common */ "./packages/common/dist/index.js");
var logging_1 = __webpack_require__(/*! @clockwork/logging */ "./packages/logging/dist/index.js");
var hooks_3 = __webpack_require__(/*! @clockwork/hooks */ "./packages/hooks/dist/index.js");
var uniqHook = (0, hooks_1.getHookUnique)();
var uniqFind = (0, common_1.getFindUnique)();
var _a = logging_1.Color.use(), blue = _a.blue, blueBright = _a.blueBright, redBright = _a.redBright, pink = _a.magentaBright, yellow = _a.yellow, dim = _a.dim;
function hookActivity() {
    (0, hooks_2.hook)(common_1.Classes.Activity, '$init', {
        after: function () {
            console.warn("$init: ".concat(this));
        },
    });
    (0, hooks_2.hook)(common_1.Classes.Activity, 'onCreate', {
        after: function () {
            console.warn(" onCreate: ".concat(this));
        },
        logging: { arguments: false },
    });
    (0, hooks_2.hook)(common_1.Classes.Activity, 'onResume', {
        after: function () {
            console.warn("  onResume: ".concat(this));
        },
        logging: { arguments: false },
    });
    (0, hooks_2.hook)(common_1.Classes.Activity, 'startActivity');
    (0, hooks_2.hook)(common_1.Classes.Activity, 'startActivities');
}
function hookWebview() {
    (0, hooks_2.hook)(common_1.Classes.WebView, 'evaluateJavascript');
    (0, hooks_2.hook)(common_1.Classes.WebView, 'loadDataWithBaseURL');
    (0, hooks_2.hook)(common_1.Classes.WebView, 'loadUrl', {
        after: function (method, returnValue) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            logging_1.logger.info(pink((0, common_1.stacktrace)()));
        },
    });
}
function hookNetwork() {
    (0, hooks_2.hook)(common_1.Classes.URL, 'openConnection', {
        loggingPredicate: logging_1.Filter.url,
    });
    var RealCall = null;
    hooks_1.ClassLoader.perform(function () {
        !RealCall &&
            (RealCall = (0, common_1.findClass)('okhttp3.internal.connection.RealCall')) &&
            (0, hooks_2.hook)(RealCall, 'callStart', {
                after: function (method, returnValue) {
                    var _a, _b, _c;
                    var args = [];
                    for (var _i = 2; _i < arguments.length; _i++) {
                        args[_i - 2] = arguments[_i];
                    }
                    var original = (_a = this.originalRequest) === null || _a === void 0 ? void 0 : _a.value;
                    if (original) {
                        var url = (_b = original._url) === null || _b === void 0 ? void 0 : _b.value;
                        var method_1 = (_c = original._method) === null || _c === void 0 ? void 0 : _c.value;
                        //@ts-ignore
                        logging_1.logger.info("".concat(dim(method_1), " ").concat(logging_1.Color.url(common_1.Classes.String.valueOf(url))));
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
    (0, hooks_2.hook)(common_1.Classes.Cipher, 'doFinal', {
        after: function (m, r) {
            var p = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                p[_i - 2] = arguments[_i];
            }
            if (this.opmode.value === 1) {
                var str = common_1.Classes.String.$new(p[0]);
                logging_1.logger.info({ tag: 'encrypt' }, "".concat(str));
            }
            if (this.opmode.value === 2) {
                try {
                    var str = common_1.Classes.String.$new(r);
                    logging_1.logger.info({ tag: 'decrypt' }, "".concat(str));
                }
                catch (e) {
                    logging_1.logger.info({ tag: 'decrypt' }, "".concat(r));
                }
            }
        },
        logging: { arguments: false, return: false },
    });
}
function hookJson(fn) {
    var getOpt = ['get', 'opt'];
    var types = ['Boolean', 'Double', 'Int', 'JSONArray', 'JSONObject', 'Long', 'String'];
    (0, hooks_2.hook)(common_1.Classes.JSONObject, '$init', {
        loggingPredicate: logging_1.Filter.json,
        logging: { short: true },
        predicate: function (_, index) { return index !== 0; },
    });
    (0, hooks_2.hook)(common_1.Classes.JSONObject, 'has', {
        loggingPredicate: logging_1.Filter.json,
        logging: { multiline: false, short: true },
        replace: function (method, key) {
            var found = (fn === null || fn === void 0 ? void 0 : fn(key, 'has')) !== undefined;
            return found || method.call(this, key);
        },
    });
    var _loop_1 = function (item) {
        (0, hooks_2.hook)(common_1.Classes.JSONObject, item, {
            loggingPredicate: logging_1.Filter.json,
            logging: { multiline: false, short: true },
            replace: fn ? (0, hooks_3.ifKey)(function (key) { return fn(key, item); }) : undefined,
        });
    };
    for (var _i = 0, getOpt_1 = getOpt; _i < getOpt_1.length; _i++) {
        var item = getOpt_1[_i];
        _loop_1(item);
    }
    for (var _a = 0, types_1 = types; _a < types_1.length; _a++) {
        var type = types_1[_a];
        var _loop_2 = function (item) {
            var name_1 = "".concat(item).concat(type);
            (0, hooks_2.hook)(common_1.Classes.JSONObject, name_1, {
                loggingPredicate: logging_1.Filter.json,
                logging: { multiline: false, short: true },
                replace: fn ? (0, hooks_3.ifKey)(function (key) { return fn(key, item); }) : undefined,
            });
        };
        for (var _b = 0, getOpt_2 = getOpt; _b < getOpt_2.length; _b++) {
            var item = getOpt_2[_b];
            _loop_2(item);
        }
    }
    // hook(Classes.JSONObject, 'put')
}
function hookPrefs(fn) {
    var keyFns = ['getBoolean', 'getFloat', 'getInt', 'getLong', 'getString', 'getStringSet'];
    (0, hooks_2.hook)(common_1.Classes.SharedPreferencesImpl, 'contains', {
        loggingPredicate: logging_1.Filter.prefs,
        logging: { multiline: false, short: true },
        replace: function (method, key) {
            var found = (fn === null || fn === void 0 ? void 0 : fn(key, 'contains')) !== undefined;
            return found || method.call(this, key);
        },
    });
    (0, hooks_2.hook)(common_1.Classes.SharedPreferencesImpl, 'getAll', {
        loggingPredicate: logging_1.Filter.prefs,
        logging: { multiline: false, short: true },
    });
    var _loop_3 = function (item) {
        (0, hooks_2.hook)(common_1.Classes.SharedPreferencesImpl, item, {
            loggingPredicate: logging_1.Filter.prefs,
            logging: { multiline: false, short: true },
            replace: fn ? (0, hooks_3.ifKey)(function (key) { return fn(key, item); }) : undefined,
        });
    };
    for (var _i = 0, keyFns_1 = keyFns; _i < keyFns_1.length; _i++) {
        var item = keyFns_1[_i];
        _loop_3(item);
    }
    // hook('java.util.Properties', 'getProperty');
}
function hookDevice() {
    /* device Settings*/
    var Build = {
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
    Reflect.ownKeys(Build).forEach(function (key) {
        var field = common_1.Classes.Build[key];
        if (field)
            field.value = Build[key];
    });
    //buildProperties.ANDROID_ID.value='b6932a00c88d8b50';
}
function hookSettings() {
    var settings = { development_settings_enabled: 0, adb_enabled: 0, install_non_market_apps: 0, play_protect_enabled: 1 };
    [common_1.Classes.Settings$Secure, common_1.Classes.Settings$Global].forEach(function (clazz) {
        return (0, hooks_2.hook)(clazz, 'getInt', {
            logging: { call: true, return: true },
            replace: function (method) {
                var params = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    params[_i - 1] = arguments[_i];
                }
                var key = params[1];
                if (settings.hasOwnProperty(key))
                    return settings[key];
                return method.call.apply(method, __spreadArray([this], params, false));
            },
        });
    });
}
function bypassIntentFlags() {
    (0, hooks_2.hook)(common_1.Classes.PendingIntent, 'getBroadcastAsUser', {
        replace: function (method) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var flags = args[3];
            var flagImmutableSet = (flags & common_1.Classes.PendingIntent.FLAG_IMMUTABLE.value) != 0;
            var flagMutableSet = (flags & common_1.Classes.PendingIntent.FLAG_MUTABLE.value) != 0;
            if (!flagImmutableSet && !flagMutableSet) {
                var newFlags = flags | common_1.Classes.PendingIntent.FLAG_MUTABLE.value;
                args[3] = newFlags;
            }
            return method.call.apply(method, __spreadArray([this], args, false));
        },
    });
}
Java.performNow(function () {
    hookActivity();
    hookWebview();
    hookNetwork();
    hookJson(function (key, method) {
        switch (key) {
            case 'isInstalled':
                return true;
            case 'referrer':
            case 'applink_url':
                return 'utm_amazon';
            case 'gaid':
            case 'android_imei':
            case 'android_meid':
            case 'android_device_id':
                return '4102978102398';
        }
    });
    hookPrefs(function (key, method) {
        switch (key) {
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
            case 'deviceId':
            case 'deviceuuid':
            case 'uuid_worldmap_quiz':
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
            case 'AFConversionData':
            case 'conversionData':
            case 'dataScore':
                return 'utm_medium=Non-organic';
            case 'country':
            case 'userCountry':
            case 'key_real_country':
            case 'KEY_LOCALE':
            case 'oskdoskdue':
                (0, logging_1.log)(pink((0, common_1.stacktrace)()));
                return 0;
        }
    });
    hookCrypto();
    hookSettings();
    (0, hooks_2.hook)(common_1.Classes.Runtime, 'exec', {
        replace: function (method) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if ("".concat(args[0]).includes('nya') === false)
                return common_1.Classes.Runtime.exec.call(this, 'echo nya');
            return method.call.apply(method, __spreadArray([this], args, false));
        },
    });
    Anticloak.Country.mock('BR');
    hookDevice();
    Anticloak.InstallReferrer.replace({ install_referrer: 'utm_medium=Non-organic' });
    (0, hooks_2.hook)(common_1.Classes.Math, 'floor');
    (0, hooks_2.hook)(common_1.Classes.DexPathList, '$init');
    hooks_1.ClassLoader.perform(function (cl) {
    });
});
Network.attachGetAddrInfo();
Network.attachGetHostByName();
Network.attachNativeSocket();
Network.attachInteAton();
// Native.attachRegisterNatives();
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
    if (Native.Inject.isWithinOwnRange(this.returnAddress))
        return 'nya';
});
// Anticloak.Jigau.memoryPatch('l7df3e7c4.so');
// [INFO] {"name": "libcocos.so", "fn_dump": "0x002ad2a0","fn_key": "0 x00293468"}
// Cocos2dx.dump({ name: 'libcocos2djs.so', fn_dump: ptr(0x007ad9a8), fn_key: ptr(0x006a8b50) });
// Cocos2dx.hookLocalStorage(function(key) {
//     switch (key) {
//         case 'force_update':
//             return 'true';
//     }
// })
// Unity.setVersion('2023.2.5f1');
// Unity.attachStrings();
var x = false;
// // setTimeout(() => (x = false), 5000);\
var predicate = function (r) { return x && Native.Inject.isWithinOwnRange(r); };
JniTrace.attach(function (_a) {
    var returnAddress = _a.returnAddress;
    return predicate(returnAddress);
});
// ['strlen', 'strstr', 'strncmp', 'strcmp', 'strcpy', 'strcat'].forEach((ex) => {
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
[
    'fopen',
    'fwrite',
    'stat',
    'access',
    'vprintf',
    '__android_log_print',
    'sprintf',
    'fopen',
    'open',
    'statvfs',
    'access',
    'pthread_kill',
    'kill',
    '_exit',
    'killpg',
    'signal',
    'abort',
].forEach(function (ex) {
    var exp = Module.getExportByName(null, ex);
    Native.Inject.attachInModule(predicate, exp, {
        onEnter: function (args) {
            var arg = ex === '__android_log_print' ? args[2] : args[0];
            switch (ex) {
                case '__android_log_print': {
                    logging_1.logger.info({ tag: ex }, "\"".concat(args[2].readCString(), "\""));
                    return;
                }
                case 'sprintf': {
                    logging_1.logger.info({ tag: ex }, "\"".concat(args[0].readCString(), "\" \"").concat(args[1].readCString(), "\""));
                    return;
                }
                default: {
                    logging_1.logger.info({ tag: ex }, "\"".concat(arg.readCString(), "\" -> ").concat(DebugSymbol.fromAddress(this.returnAddress)));
                    return;
                }
            }
        },
    });
});
['kill'].forEach(function (ex) {
    var kill = Module.getExportByName(null, ex);
    Native.Inject.attachInModule(predicate, kill, {
        onEnter: function (args) {
            logging_1.logger.info({ tag: ex }, "kill called !");
        },
        onLeave: function (retval) { },
    });
});
// Interceptor.replace(Module.getExportByName(null, 'exit'), new NativeCallback(function (code) {
//     if (null == this) {
//         return 0;
//     }
//     return 0;
// }, 'int', ['int', 'int']));
// const fork_ptr = Module.getExportByName('libc.so', 'fork');
// const fork = new NativeFunction(fork_ptr, 'int', []);
// Interceptor.replace(
//     fork_ptr,
//     new NativeCallback(
//         function () {
//             logger.info({ tag: 'fork'}, `${-1}`);
//             // return -1;
//             return fork();
//         },
//         'int',
//         [],
//     ),
// );
// var removeptr = Module.getExportByName('libc.so', 'remove');
// var remove = new NativeFunction(removeptr, 'int', ['pointer']);
// Interceptor.replace(
//     removeptr,
//     new NativeCallback(
//         function (path) {
//             const ret = remove(path);
//             logger.info({ tag: 'remove'}, `${ret}`);
//             return ret
//             //  return -1;
//         },
//         'int',
//         ['pointer'],
//     ),
// );
// var p_pthread_create = Module.getExportByName('libc.so', 'pthread_create');
// var pthread_create = new NativeFunction(p_pthread_create, 'int', ['pointer', 'pointer', 'pointer', 'pointer']);
// Interceptor.replace(
//     p_pthread_create,
//     new NativeCallback(
//         function (ptr0, ptr1, ptr2, ptr3) {
//             const ret = pthread_create(ptr0, ptr1, ptr2, ptr3);
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
//                 // var newstr = bufstr.replaceAll("frida", "libcc");
//                 // buffer.writeUtf8String(newstr);
//                 // console.error(bufstr);
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


/***/ }),

/***/ "./node_modules/pino/browser.js":
/*!**************************************!*\
  !*** ./node_modules/pino/browser.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const format = __webpack_require__(/*! quick-format-unescaped */ "./node_modules/quick-format-unescaped/index.js")

module.exports = pino

const _console = pfGlobalThisOrFallback().console || {}
const stdSerializers = {
  mapHttpRequest: mock,
  mapHttpResponse: mock,
  wrapRequestSerializer: passthrough,
  wrapResponseSerializer: passthrough,
  wrapErrorSerializer: passthrough,
  req: mock,
  res: mock,
  err: asErrValue,
  errWithCause: asErrValue
}
function levelToValue (level, logger) {
  return level === 'silent'
    ? Infinity
    : logger.levels.values[level]
}
const baseLogFunctionSymbol = Symbol('pino.logFuncs')
const hierarchySymbol = Symbol('pino.hierarchy')

const logFallbackMap = {
  error: 'log',
  fatal: 'error',
  warn: 'error',
  info: 'log',
  debug: 'log',
  trace: 'log'
}

function appendChildLogger (parentLogger, childLogger) {
  const newEntry = {
    logger: childLogger,
    parent: parentLogger[hierarchySymbol]
  }
  childLogger[hierarchySymbol] = newEntry
}

function setupBaseLogFunctions (logger, levels, proto) {
  const logFunctions = {}
  levels.forEach(level => {
    logFunctions[level] = proto[level] ? proto[level] : (_console[level] || _console[logFallbackMap[level] || 'log'] || noop)
  })
  logger[baseLogFunctionSymbol] = logFunctions
}

function shouldSerialize (serialize, serializers) {
  if (Array.isArray(serialize)) {
    const hasToFilter = serialize.filter(function (k) {
      return k !== '!stdSerializers.err'
    })
    return hasToFilter
  } else if (serialize === true) {
    return Object.keys(serializers)
  }

  return false
}

function pino (opts) {
  opts = opts || {}
  opts.browser = opts.browser || {}

  const transmit = opts.browser.transmit
  if (transmit && typeof transmit.send !== 'function') { throw Error('pino: transmit option must have a send function') }

  const proto = opts.browser.write || _console
  if (opts.browser.write) opts.browser.asObject = true
  const serializers = opts.serializers || {}
  const serialize = shouldSerialize(opts.browser.serialize, serializers)
  let stdErrSerialize = opts.browser.serialize

  if (
    Array.isArray(opts.browser.serialize) &&
    opts.browser.serialize.indexOf('!stdSerializers.err') > -1
  ) stdErrSerialize = false

  const customLevels = Object.keys(opts.customLevels || {})
  const levels = ['error', 'fatal', 'warn', 'info', 'debug', 'trace'].concat(customLevels)

  if (typeof proto === 'function') {
    levels.forEach(function (level) {
      proto[level] = proto
    })
  }
  if (opts.enabled === false || opts.browser.disabled) opts.level = 'silent'
  const level = opts.level || 'info'
  const logger = Object.create(proto)
  if (!logger.log) logger.log = noop

  setupBaseLogFunctions(logger, levels, proto)
  // setup root hierarchy entry
  appendChildLogger({}, logger)

  Object.defineProperty(logger, 'levelVal', {
    get: getLevelVal
  })
  Object.defineProperty(logger, 'level', {
    get: getLevel,
    set: setLevel
  })

  const setOpts = {
    transmit,
    serialize,
    asObject: opts.browser.asObject,
    levels,
    timestamp: getTimeFunction(opts)
  }
  logger.levels = getLevels(opts)
  logger.level = level

  logger.setMaxListeners = logger.getMaxListeners =
  logger.emit = logger.addListener = logger.on =
  logger.prependListener = logger.once =
  logger.prependOnceListener = logger.removeListener =
  logger.removeAllListeners = logger.listeners =
  logger.listenerCount = logger.eventNames =
  logger.write = logger.flush = noop
  logger.serializers = serializers
  logger._serialize = serialize
  logger._stdErrSerialize = stdErrSerialize
  logger.child = child

  if (transmit) logger._logEvent = createLogEventShape()

  function getLevelVal () {
    return levelToValue(this.level, this)
  }

  function getLevel () {
    return this._level
  }
  function setLevel (level) {
    if (level !== 'silent' && !this.levels.values[level]) {
      throw Error('unknown level ' + level)
    }
    this._level = level

    set(this, setOpts, logger, 'error') // <-- must stay first
    set(this, setOpts, logger, 'fatal')
    set(this, setOpts, logger, 'warn')
    set(this, setOpts, logger, 'info')
    set(this, setOpts, logger, 'debug')
    set(this, setOpts, logger, 'trace')

    customLevels.forEach((level) => {
      set(this, setOpts, logger, level)
    })
  }

  function child (bindings, childOptions) {
    if (!bindings) {
      throw new Error('missing bindings for child Pino')
    }
    childOptions = childOptions || {}
    if (serialize && bindings.serializers) {
      childOptions.serializers = bindings.serializers
    }
    const childOptionsSerializers = childOptions.serializers
    if (serialize && childOptionsSerializers) {
      var childSerializers = Object.assign({}, serializers, childOptionsSerializers)
      var childSerialize = opts.browser.serialize === true
        ? Object.keys(childSerializers)
        : serialize
      delete bindings.serializers
      applySerializers([bindings], childSerialize, childSerializers, this._stdErrSerialize)
    }
    function Child (parent) {
      this._childLevel = (parent._childLevel | 0) + 1

      // make sure bindings are available in the `set` function
      this.bindings = bindings

      if (childSerializers) {
        this.serializers = childSerializers
        this._serialize = childSerialize
      }
      if (transmit) {
        this._logEvent = createLogEventShape(
          [].concat(parent._logEvent.bindings, bindings)
        )
      }
    }
    Child.prototype = this
    const newLogger = new Child(this)

    // must happen before the level is assigned
    appendChildLogger(this, newLogger)
    // required to actually initialize the logger functions for any given child
    newLogger.level = this.level

    return newLogger
  }
  return logger
}

function getLevels (opts) {
  const customLevels = opts.customLevels || {}

  const values = Object.assign({}, pino.levels.values, customLevels)
  const labels = Object.assign({}, pino.levels.labels, invertObject(customLevels))

  return {
    values,
    labels
  }
}

function invertObject (obj) {
  const inverted = {}
  Object.keys(obj).forEach(function (key) {
    inverted[obj[key]] = key
  })
  return inverted
}

pino.levels = {
  values: {
    fatal: 60,
    error: 50,
    warn: 40,
    info: 30,
    debug: 20,
    trace: 10
  },
  labels: {
    10: 'trace',
    20: 'debug',
    30: 'info',
    40: 'warn',
    50: 'error',
    60: 'fatal'
  }
}

pino.stdSerializers = stdSerializers
pino.stdTimeFunctions = Object.assign({}, { nullTime, epochTime, unixTime, isoTime })

function getBindingChain (logger) {
  const bindings = []
  if (logger.bindings) {
    bindings.push(logger.bindings)
  }

  // traverse up the tree to get all bindings
  let hierarchy = logger[hierarchySymbol]
  while (hierarchy.parent) {
    hierarchy = hierarchy.parent
    if (hierarchy.logger.bindings) {
      bindings.push(hierarchy.logger.bindings)
    }
  }

  return bindings.reverse()
}

function set (self, opts, rootLogger, level) {
  // override the current log functions with either `noop` or the base log function
  self[level] = levelToValue(self.level, rootLogger) > levelToValue(level, rootLogger)
    ? noop
    : rootLogger[baseLogFunctionSymbol][level]

  if (!opts.transmit && self[level] === noop) {
    return
  }

  // make sure the log format is correct
  self[level] = createWrap(self, opts, rootLogger, level)

  // prepend bindings if it is not the root logger
  const bindings = getBindingChain(self)
  if (bindings.length === 0) {
    // early exit in case for rootLogger
    return
  }
  self[level] = prependBindingsInArguments(bindings, self[level])
}

function prependBindingsInArguments (bindings, logFunc) {
  return function () {
    return logFunc.apply(this, [...bindings, ...arguments])
  }
}

function createWrap (self, opts, rootLogger, level) {
  return (function (write) {
    return function LOG () {
      const ts = opts.timestamp()
      const args = new Array(arguments.length)
      const proto = (Object.getPrototypeOf && Object.getPrototypeOf(this) === _console) ? _console : this
      for (var i = 0; i < args.length; i++) args[i] = arguments[i]

      if (opts.serialize && !opts.asObject) {
        applySerializers(args, this._serialize, this.serializers, this._stdErrSerialize)
      }
      if (opts.asObject) write.call(proto, asObject(this, level, args, ts))
      else write.apply(proto, args)

      if (opts.transmit) {
        const transmitLevel = opts.transmit.level || self._level
        const transmitValue = rootLogger.levels.values[transmitLevel]
        const methodValue = rootLogger.levels.values[level]
        if (methodValue < transmitValue) return
        transmit(this, {
          ts,
          methodLevel: level,
          methodValue,
          transmitLevel,
          transmitValue: rootLogger.levels.values[opts.transmit.level || self._level],
          send: opts.transmit.send,
          val: levelToValue(self._level, rootLogger)
        }, args)
      }
    }
  })(self[baseLogFunctionSymbol][level])
}

function asObject (logger, level, args, ts) {
  if (logger._serialize) applySerializers(args, logger._serialize, logger.serializers, logger._stdErrSerialize)
  const argsCloned = args.slice()
  let msg = argsCloned[0]
  const o = {}
  if (ts) {
    o.time = ts
  }
  o.level = logger.levels.values[level]
  let lvl = (logger._childLevel | 0) + 1
  if (lvl < 1) lvl = 1
  // deliberate, catching objects, arrays
  if (msg !== null && typeof msg === 'object') {
    while (lvl-- && typeof argsCloned[0] === 'object') {
      Object.assign(o, argsCloned.shift())
    }
    msg = argsCloned.length ? format(argsCloned.shift(), argsCloned) : undefined
  } else if (typeof msg === 'string') msg = format(argsCloned.shift(), argsCloned)
  if (msg !== undefined) o.msg = msg
  return o
}

function applySerializers (args, serialize, serializers, stdErrSerialize) {
  for (const i in args) {
    if (stdErrSerialize && args[i] instanceof Error) {
      args[i] = pino.stdSerializers.err(args[i])
    } else if (typeof args[i] === 'object' && !Array.isArray(args[i])) {
      for (const k in args[i]) {
        if (serialize && serialize.indexOf(k) > -1 && k in serializers) {
          args[i][k] = serializers[k](args[i][k])
        }
      }
    }
  }
}

function transmit (logger, opts, args) {
  const send = opts.send
  const ts = opts.ts
  const methodLevel = opts.methodLevel
  const methodValue = opts.methodValue
  const val = opts.val
  const bindings = logger._logEvent.bindings

  applySerializers(
    args,
    logger._serialize || Object.keys(logger.serializers),
    logger.serializers,
    logger._stdErrSerialize === undefined ? true : logger._stdErrSerialize
  )
  logger._logEvent.ts = ts
  logger._logEvent.messages = args.filter(function (arg) {
    // bindings can only be objects, so reference equality check via indexOf is fine
    return bindings.indexOf(arg) === -1
  })

  logger._logEvent.level.label = methodLevel
  logger._logEvent.level.value = methodValue

  send(methodLevel, logger._logEvent, val)

  logger._logEvent = createLogEventShape(bindings)
}

function createLogEventShape (bindings) {
  return {
    ts: 0,
    messages: [],
    bindings: bindings || [],
    level: { label: '', value: 0 }
  }
}

function asErrValue (err) {
  const obj = {
    type: err.constructor.name,
    msg: err.message,
    stack: err.stack
  }
  for (const key in err) {
    if (obj[key] === undefined) {
      obj[key] = err[key]
    }
  }
  return obj
}

function getTimeFunction (opts) {
  if (typeof opts.timestamp === 'function') {
    return opts.timestamp
  }
  if (opts.timestamp === false) {
    return nullTime
  }
  return epochTime
}

function mock () { return {} }
function passthrough (a) { return a }
function noop () {}

function nullTime () { return false }
function epochTime () { return Date.now() }
function unixTime () { return Math.round(Date.now() / 1000.0) }
function isoTime () { return new Date(Date.now()).toISOString() } // using Date.now() for testability

/* eslint-disable */
/* istanbul ignore next */
function pfGlobalThisOrFallback () {
  function defd (o) { return typeof o !== 'undefined' && o }
  try {
    if (typeof globalThis !== 'undefined') return globalThis
    Object.defineProperty(Object.prototype, 'globalThis', {
      get: function () {
        delete Object.prototype.globalThis
        return (this.globalThis = this)
      },
      configurable: true
    })
    return globalThis
  } catch (e) {
    return defd(self) || defd(window) || defd(this) || {}
  }
}
/* eslint-enable */

module.exports["default"] = pino
module.exports.pino = pino


/***/ }),

/***/ "./node_modules/@frida/tty/index.js":
/*!******************************************!*\
  !*** ./node_modules/@frida/tty/index.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ReadStream: () => (/* binding */ ReadStream),
/* harmony export */   WriteStream: () => (/* binding */ WriteStream),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   isatty: () => (/* binding */ isatty)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  isatty,
  ReadStream,
  WriteStream,
});

function isatty() {
  return false;
}

function ReadStream() {
  throw new Error('tty.ReadStream is not implemented');
}

function WriteStream() {
  throw new Error('tty.WriteStream is not implemented');
}


/***/ }),

/***/ "./node_modules/colorette/index.js":
/*!*****************************************!*\
  !*** ./node_modules/colorette/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bgBlack: () => (/* binding */ bgBlack),
/* harmony export */   bgBlackBright: () => (/* binding */ bgBlackBright),
/* harmony export */   bgBlue: () => (/* binding */ bgBlue),
/* harmony export */   bgBlueBright: () => (/* binding */ bgBlueBright),
/* harmony export */   bgCyan: () => (/* binding */ bgCyan),
/* harmony export */   bgCyanBright: () => (/* binding */ bgCyanBright),
/* harmony export */   bgGreen: () => (/* binding */ bgGreen),
/* harmony export */   bgGreenBright: () => (/* binding */ bgGreenBright),
/* harmony export */   bgMagenta: () => (/* binding */ bgMagenta),
/* harmony export */   bgMagentaBright: () => (/* binding */ bgMagentaBright),
/* harmony export */   bgRed: () => (/* binding */ bgRed),
/* harmony export */   bgRedBright: () => (/* binding */ bgRedBright),
/* harmony export */   bgWhite: () => (/* binding */ bgWhite),
/* harmony export */   bgWhiteBright: () => (/* binding */ bgWhiteBright),
/* harmony export */   bgYellow: () => (/* binding */ bgYellow),
/* harmony export */   bgYellowBright: () => (/* binding */ bgYellowBright),
/* harmony export */   black: () => (/* binding */ black),
/* harmony export */   blackBright: () => (/* binding */ blackBright),
/* harmony export */   blue: () => (/* binding */ blue),
/* harmony export */   blueBright: () => (/* binding */ blueBright),
/* harmony export */   bold: () => (/* binding */ bold),
/* harmony export */   createColors: () => (/* binding */ createColors),
/* harmony export */   cyan: () => (/* binding */ cyan),
/* harmony export */   cyanBright: () => (/* binding */ cyanBright),
/* harmony export */   dim: () => (/* binding */ dim),
/* harmony export */   gray: () => (/* binding */ gray),
/* harmony export */   green: () => (/* binding */ green),
/* harmony export */   greenBright: () => (/* binding */ greenBright),
/* harmony export */   hidden: () => (/* binding */ hidden),
/* harmony export */   inverse: () => (/* binding */ inverse),
/* harmony export */   isColorSupported: () => (/* binding */ isColorSupported),
/* harmony export */   italic: () => (/* binding */ italic),
/* harmony export */   magenta: () => (/* binding */ magenta),
/* harmony export */   magentaBright: () => (/* binding */ magentaBright),
/* harmony export */   red: () => (/* binding */ red),
/* harmony export */   redBright: () => (/* binding */ redBright),
/* harmony export */   reset: () => (/* binding */ reset),
/* harmony export */   strikethrough: () => (/* binding */ strikethrough),
/* harmony export */   underline: () => (/* binding */ underline),
/* harmony export */   white: () => (/* binding */ white),
/* harmony export */   whiteBright: () => (/* binding */ whiteBright),
/* harmony export */   yellow: () => (/* binding */ yellow),
/* harmony export */   yellowBright: () => (/* binding */ yellowBright)
/* harmony export */ });
/* harmony import */ var tty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tty */ "./node_modules/@frida/tty/index.js");


const {
  env = {},
  argv = [],
  platform = "",
} = typeof process === "undefined" ? {} : process

const isDisabled = "NO_COLOR" in env || argv.includes("--no-color")
const isForced = "FORCE_COLOR" in env || argv.includes("--color")
const isWindows = platform === "win32"
const isDumbTerminal = env.TERM === "dumb"

const isCompatibleTerminal =
  tty__WEBPACK_IMPORTED_MODULE_0__ && tty__WEBPACK_IMPORTED_MODULE_0__.isatty && tty__WEBPACK_IMPORTED_MODULE_0__.isatty(1) && env.TERM && !isDumbTerminal

const isCI =
  "CI" in env &&
  ("GITHUB_ACTIONS" in env || "GITLAB_CI" in env || "CIRCLECI" in env)

const isColorSupported =
  !isDisabled &&
  (isForced || (isWindows && !isDumbTerminal) || isCompatibleTerminal || isCI)

const replaceClose = (
  index,
  string,
  close,
  replace,
  head = string.substring(0, index) + replace,
  tail = string.substring(index + close.length),
  next = tail.indexOf(close)
) => head + (next < 0 ? tail : replaceClose(next, tail, close, replace))

const clearBleed = (index, string, open, close, replace) =>
  index < 0
    ? open + string + close
    : open + replaceClose(index, string, close, replace) + close

const filterEmpty =
  (open, close, replace = open, at = open.length + 1) =>
  (string) =>
    string || !(string === "" || string === undefined)
      ? clearBleed(
          ("" + string).indexOf(close, at),
          string,
          open,
          close,
          replace
        )
      : ""

const init = (open, close, replace) =>
  filterEmpty(`\x1b[${open}m`, `\x1b[${close}m`, replace)

const colors = {
  reset: init(0, 0),
  bold: init(1, 22, "\x1b[22m\x1b[1m"),
  dim: init(2, 22, "\x1b[22m\x1b[2m"),
  italic: init(3, 23),
  underline: init(4, 24),
  inverse: init(7, 27),
  hidden: init(8, 28),
  strikethrough: init(9, 29),
  black: init(30, 39),
  red: init(31, 39),
  green: init(32, 39),
  yellow: init(33, 39),
  blue: init(34, 39),
  magenta: init(35, 39),
  cyan: init(36, 39),
  white: init(37, 39),
  gray: init(90, 39),
  bgBlack: init(40, 49),
  bgRed: init(41, 49),
  bgGreen: init(42, 49),
  bgYellow: init(43, 49),
  bgBlue: init(44, 49),
  bgMagenta: init(45, 49),
  bgCyan: init(46, 49),
  bgWhite: init(47, 49),
  blackBright: init(90, 39),
  redBright: init(91, 39),
  greenBright: init(92, 39),
  yellowBright: init(93, 39),
  blueBright: init(94, 39),
  magentaBright: init(95, 39),
  cyanBright: init(96, 39),
  whiteBright: init(97, 39),
  bgBlackBright: init(100, 49),
  bgRedBright: init(101, 49),
  bgGreenBright: init(102, 49),
  bgYellowBright: init(103, 49),
  bgBlueBright: init(104, 49),
  bgMagentaBright: init(105, 49),
  bgCyanBright: init(106, 49),
  bgWhiteBright: init(107, 49),
}

const createColors = ({ useColor = isColorSupported } = {}) =>
  useColor
    ? colors
    : Object.keys(colors).reduce(
        (colors, key) => ({ ...colors, [key]: String }),
        {}
      )

const {
  reset,
  bold,
  dim,
  italic,
  underline,
  inverse,
  hidden,
  strikethrough,
  black,
  red,
  green,
  yellow,
  blue,
  magenta,
  cyan,
  white,
  gray,
  bgBlack,
  bgRed,
  bgGreen,
  bgYellow,
  bgBlue,
  bgMagenta,
  bgCyan,
  bgWhite,
  blackBright,
  redBright,
  greenBright,
  yellowBright,
  blueBright,
  magentaBright,
  cyanBright,
  whiteBright,
  bgBlackBright,
  bgRedBright,
  bgGreenBright,
  bgYellowBright,
  bgBlueBright,
  bgMagentaBright,
  bgCyanBright,
  bgWhiteBright,
} = createColors()


/***/ }),

/***/ "./packages/anticloak/dist/country.js":
/*!********************************************!*\
  !*** ./packages/anticloak/dist/country.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mock: () => (/* binding */ mock)
/* harmony export */ });
/* harmony import */ var _clockwork_hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @clockwork/hooks */ "./packages/hooks/dist/index.js");
/* harmony import */ var _clockwork_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @clockwork/common */ "./packages/common/dist/index.js");
/* harmony import */ var _clockwork_logging__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @clockwork/logging */ "./packages/logging/dist/index.js");




const Configurations = {
    BR: {
        timezoneId: 'America/Sao_Paulo',
        mcc: '724',
        mnc: '10',
        code: '55',
        mccmnc: `${724}${10}`,
        locale: ['BR', 'pt'],
        country: 'br',
        operator: 'Vivo',
    },
    IN: {
        timezoneId: 'Asia/Kolkata',
        mcc: '404',
        mnc: '299',
        code: '91',
        mccmnc: `${404}${299}`,
        locale: ['IN', 'in'],
        country: 'in',
        operator: 'Failed Calls',
    },
    VI: {
        timezoneId: 'America/St_Thomas',
        mcc: '376',
        mnc: '999',
        code: '1340',
        mccmnc: `${999}${1340}`,
        locale: ['VI', 'vi'],
        country: 'vi',
        operator: 'Fix Line',
    },
    VN: {
        timezoneId: 'Asia/Ho_Chi_Minh',
        mcc: '452',
        mnc: '01',
        code: '84',
        mccmnc: `${452}${1}`,
        locale: ['VN', 'vn'],
        country: 'vn',
        operator: 'MobiFone',
    },
};
function mock(keyOrConfig) {
    const config = typeof keyOrConfig === 'object' ? keyOrConfig : Configurations[keyOrConfig];
    const number = `${config.code}${_clockwork_common__WEBPACK_IMPORTED_MODULE_1__.Text.stringNumber(10)}`, subscriber = `${config.mccmnc}${_clockwork_common__WEBPACK_IMPORTED_MODULE_1__.Text.stringNumber(10)}`;
    (0,_clockwork_hooks__WEBPACK_IMPORTED_MODULE_0__.hook)(_clockwork_common__WEBPACK_IMPORTED_MODULE_1__.Classes.TelephonyManager, 'getLine1Number', { replace: (0,_clockwork_hooks__WEBPACK_IMPORTED_MODULE_0__.always)(number) });
    (0,_clockwork_hooks__WEBPACK_IMPORTED_MODULE_0__.hook)(_clockwork_common__WEBPACK_IMPORTED_MODULE_1__.Classes.TelephonyManager, 'getSimOperator', { replace: (0,_clockwork_hooks__WEBPACK_IMPORTED_MODULE_0__.always)(config.mccmnc) });
    (0,_clockwork_hooks__WEBPACK_IMPORTED_MODULE_0__.hook)(_clockwork_common__WEBPACK_IMPORTED_MODULE_1__.Classes.TelephonyManager, 'getSimOperatorName', { replace: (0,_clockwork_hooks__WEBPACK_IMPORTED_MODULE_0__.always)(config.operator) });
    (0,_clockwork_hooks__WEBPACK_IMPORTED_MODULE_0__.hook)(_clockwork_common__WEBPACK_IMPORTED_MODULE_1__.Classes.TelephonyManager, 'getNetworkOperator', { replace: (0,_clockwork_hooks__WEBPACK_IMPORTED_MODULE_0__.always)(config.mccmnc) });
    (0,_clockwork_hooks__WEBPACK_IMPORTED_MODULE_0__.hook)(_clockwork_common__WEBPACK_IMPORTED_MODULE_1__.Classes.TelephonyManager, 'getNetworkOperatorName', { replace: (0,_clockwork_hooks__WEBPACK_IMPORTED_MODULE_0__.always)(config.operator) });
    (0,_clockwork_hooks__WEBPACK_IMPORTED_MODULE_0__.hook)(_clockwork_common__WEBPACK_IMPORTED_MODULE_1__.Classes.TelephonyManager, 'getSimCountryIso', { replace: (0,_clockwork_hooks__WEBPACK_IMPORTED_MODULE_0__.always)(config.country) });
    (0,_clockwork_hooks__WEBPACK_IMPORTED_MODULE_0__.hook)(_clockwork_common__WEBPACK_IMPORTED_MODULE_1__.Classes.TelephonyManager, 'getNetworkCountryIso', { replace: (0,_clockwork_hooks__WEBPACK_IMPORTED_MODULE_0__.always)(config.country) });
    (0,_clockwork_hooks__WEBPACK_IMPORTED_MODULE_0__.hook)(_clockwork_common__WEBPACK_IMPORTED_MODULE_1__.Classes.TelephonyManager, 'getSubscriberId', { replace: (0,_clockwork_hooks__WEBPACK_IMPORTED_MODULE_0__.always)(subscriber) });
    (0,_clockwork_hooks__WEBPACK_IMPORTED_MODULE_0__.hook)(_clockwork_common__WEBPACK_IMPORTED_MODULE_1__.Classes.TimeZone, 'getID', { replace: (0,_clockwork_hooks__WEBPACK_IMPORTED_MODULE_0__.always)(config.timezoneId) });
    (0,_clockwork_hooks__WEBPACK_IMPORTED_MODULE_0__.hook)(_clockwork_common__WEBPACK_IMPORTED_MODULE_1__.Classes.Locale, 'getDefault', {
        replace: () => _clockwork_common__WEBPACK_IMPORTED_MODULE_1__.Classes.Locale.$new(config.locale[1], config.locale[0]),
        logging: { call: false, return: false },
    });
    // hook(Classes.Locale, 'getCountry', { replace: always('BR'), logging: { call: false, return: false } });
    // hook(Classes.Locale, 'getLanguage', { replace: always('pt'), logging: { call: false, return: false } });
    // hook(Classes.Locale, 'getDisplayCountry', { replace: always('Brazil'), logging: { call: false, return: false } });
    // hook(Classes.Locale, 'toString', { replace: always('pt_BR'), logging: { call: false, return: false } });
    (0,_clockwork_hooks__WEBPACK_IMPORTED_MODULE_0__.hook)(_clockwork_common__WEBPACK_IMPORTED_MODULE_1__.Classes.Date, 'getTime', {
        loggingPredicate: _clockwork_logging__WEBPACK_IMPORTED_MODULE_2__.Filter.date,
        replace(method, ...args) {
            const calendar = _clockwork_common__WEBPACK_IMPORTED_MODULE_1__.Classes.Calendar.getInstance(_clockwork_common__WEBPACK_IMPORTED_MODULE_1__.Classes.TimeZone.getTimeZone('UTC'));
            const zdt = _clockwork_common__WEBPACK_IMPORTED_MODULE_1__.Classes.ZonedDateTime.ofInstant(_clockwork_common__WEBPACK_IMPORTED_MODULE_1__.Classes.Instant.ofEpochMilli(this.getTime()), _clockwork_common__WEBPACK_IMPORTED_MODULE_1__.Classes.ZoneId.of(config.timezoneId));
            calendar.set(1, zdt.getYear());
            calendar.set(2, zdt.getMonthValue() - 1);
            calendar.set(5, zdt.getDayOfMonth());
            calendar.set(11, zdt.getHour());
            calendar.set(12, zdt.getMinute());
            calendar.set(13, zdt.getSecond());
            calendar.set(14, zdt.getNano() / 1_000_000);
            return calendar.getTimeInMillis();
            // ? faster and less changes to crash
            // const dateStr = new Date().toLocaleString('en-US', { timeZone: config.timezoneId })
            // console.log("DTS", new Date(dateStr));
            // return new Date(dateStr).getTime()
        },
    });
}

//# sourceMappingURL=country.js.map

/***/ }),

/***/ "./packages/anticloak/dist/index.js":
/*!******************************************!*\
  !*** ./packages/anticloak/dist/index.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Country: () => (/* reexport module object */ _country_js__WEBPACK_IMPORTED_MODULE_2__),
/* harmony export */   InstallReferrer: () => (/* reexport module object */ _installReferrer_js__WEBPACK_IMPORTED_MODULE_1__),
/* harmony export */   Jigau: () => (/* reexport module object */ _jigau_js__WEBPACK_IMPORTED_MODULE_0__)
/* harmony export */ });
/* harmony import */ var _jigau_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./jigau.js */ "./packages/anticloak/dist/jigau.js");
/* harmony import */ var _installReferrer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./installReferrer.js */ "./packages/anticloak/dist/installReferrer.js");
/* harmony import */ var _country_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./country.js */ "./packages/anticloak/dist/country.js");



//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./packages/anticloak/dist/installReferrer.js":
/*!****************************************************!*\
  !*** ./packages/anticloak/dist/installReferrer.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createInstallReferrer: () => (/* binding */ createInstallReferrer),
/* harmony export */   replace: () => (/* binding */ replace)
/* harmony export */ });
/* harmony import */ var _clockwork_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @clockwork/common */ "./packages/common/dist/index.js");
/* harmony import */ var _clockwork_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @clockwork/hooks */ "./packages/hooks/dist/index.js");
/* harmony import */ var _clockwork_logging__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @clockwork/logging */ "./packages/logging/dist/index.js");



const logger = (0,_clockwork_logging__WEBPACK_IMPORTED_MODULE_2__.subLogger)('installreferrer');
function createInstallReferrer(classWrapper, details) {
    const now = Date.now();
    const bundle = _clockwork_common__WEBPACK_IMPORTED_MODULE_0__.Classes.Bundle.$new();
    bundle.putBoolean('google_play_instant', details?.google_play_instant ?? true);
    bundle.putLong('install_begin_timestamp_seconds', details?.install_begin_timestamp_seconds ?? now - 30 * 1000);
    bundle.putLong('install_begin_timestamp_server_seconds', details?.install_begin_timestamp_server_seconds ?? now - 30 * 1000);
    bundle.putString('install_referrer', details?.install_referrer ?? 'utm_medium=Non-Organic');
    bundle.putString('install_version', details?.install_version ?? '1.0.0');
    bundle.putLong('referrer_click_timestamp_seconds', details?.referrer_click_timestamp_seconds ?? now - 65 * 1000);
    bundle.putLong('referrer_click_timestamp_server_seconds', details?.referrer_click_timestamp_server_seconds ?? now - 65 * 1000);
    return classWrapper.$new(bundle);
}
function replace(details = {}) {
    let isHooked = false;
    _clockwork_hooks__WEBPACK_IMPORTED_MODULE_1__.ClassLoader.perform((_) => {
        if (isHooked)
            return;
        const client = (0,_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.findClass)(_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.ClassesString.InstallReferrerClient);
        if (!client)
            return;
        isHooked = true;
        const [startMethod, getMethod] = matchReferrerClientMethods(client);
        performReplace(details, client, startMethod, getMethod);
    });
}
function performReplace(details, client, startMethod, getMethod) {
    const beforeInit = function () {
        const paretnClass = (0,_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.findClass)(this.$className);
        if (!paretnClass) {
            logger.warn(`missing parent class: ${this.$className}`);
            return;
        }
        (0,_clockwork_hooks__WEBPACK_IMPORTED_MODULE_1__.hook)(paretnClass, startMethod, {
            predicate: startConnectionPredicate,
            replace(method, listener) {
                const baseClass = (0,_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.findClass)(_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.ClassesString.InstallReferrerStateListener);
                if (!baseClass) {
                    logger.warn(`missing base class: ${_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.ClassesString.InstallReferrerStateListener}`);
                    return method.call(this, listener);
                }
                const onFinishedMethod = matchStateListenerMethod(baseClass);
                let msg = _clockwork_logging__WEBPACK_IMPORTED_MODULE_2__.Color.method(startMethod);
                msg += _clockwork_logging__WEBPACK_IMPORTED_MODULE_2__.Color.bracket('(');
                msg += _clockwork_logging__WEBPACK_IMPORTED_MODULE_2__.Color.className(listener.$className);
                msg += _clockwork_logging__WEBPACK_IMPORTED_MODULE_2__.Color.bracket(')');
                msg += ' -> ';
                msg += _clockwork_logging__WEBPACK_IMPORTED_MODULE_2__.Color.method(onFinishedMethod);
                msg += `${_clockwork_logging__WEBPACK_IMPORTED_MODULE_2__.Color.bracket('(')}${_clockwork_logging__WEBPACK_IMPORTED_MODULE_2__.Color.number('0')}${_clockwork_logging__WEBPACK_IMPORTED_MODULE_2__.Color.bracket(')')}`;
                logger.info(msg);
                listener[onFinishedMethod](0);
            },
        });
        (0,_clockwork_hooks__WEBPACK_IMPORTED_MODULE_1__.hook)(paretnClass, getMethod, {
            predicate: getInstallReferrerPredicate,
            replace(method) {
                const referrerDetails = (0,_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.findClass)(_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.ClassesString.ReferrerDetails);
                if (!referrerDetails) {
                    logger.warn(`missing referrer class: ${_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.ClassesString.ReferrerDetails}`);
                    return method.call(this);
                }
                (0,_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.enumerateMembers)(referrerDetails, {
                    onMatchMethod(clazz, member) {
                        (0,_clockwork_hooks__WEBPACK_IMPORTED_MODULE_1__.hook)(clazz, member);
                    },
                }, 1);
                return createInstallReferrer(referrerDetails, details);
            },
        });
    };
    (0,_clockwork_hooks__WEBPACK_IMPORTED_MODULE_1__.hook)(client, '$init', { before: beforeInit });
}
function matchReferrerClientMethods(clazz) {
    let startMethod = null, getMethod = null;
    (0,_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.enumerateMembers)(clazz, {
        onMatchMethod(clazz, member) {
            const def = clazz[member];
            if (!def)
                return;
            for (const overload of def.overloads) {
                if (startConnectionPredicate(overload)) {
                    startMethod ??= member;
                    continue;
                }
                if (getInstallReferrerPredicate(overload)) {
                    getMethod ??= member;
                    continue;
                }
            }
        },
    }, 1);
    return [startMethod ?? 'startConnection', getMethod ?? 'getInstallReferrer'];
}
function matchStateListenerMethod(clazz) {
    let found = null;
    (0,_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.enumerateMembers)(clazz, {
        onMatchMethod(clazz, member) {
            const def = clazz[member];
            if (!def)
                return;
            for (const overload of def.overloads) {
                if (onInstallReferrerSetupFinishedPredicate(overload)) {
                    found ??= member;
                    return;
                }
            }
        },
    }, 1);
    return found ?? 'onInstallReferrerSetupFinished';
}
const startConnectionPredicate = ({ returnType, argumentTypes }) => {
    return (returnType.className === 'void' &&
        argumentTypes.length === 1 &&
        argumentTypes[0].className === _clockwork_common__WEBPACK_IMPORTED_MODULE_0__.ClassesString.InstallReferrerStateListener);
};
const getInstallReferrerPredicate = ({ returnType, argumentTypes }) => {
    return returnType.className === _clockwork_common__WEBPACK_IMPORTED_MODULE_0__.ClassesString.ReferrerDetails && argumentTypes.length === 0;
};
const onInstallReferrerSetupFinishedPredicate = ({ returnType, argumentTypes }) => {
    return returnType.className === 'void' && argumentTypes.length === 1 && argumentTypes[0].className === 'int';
};

//# sourceMappingURL=installReferrer.js.map

/***/ }),

/***/ "./packages/anticloak/dist/jigau.js":
/*!******************************************!*\
  !*** ./packages/anticloak/dist/jigau.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   memoryPatch: () => (/* binding */ memoryPatch)
/* harmony export */ });
/* harmony import */ var _clockwork_native__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @clockwork/native */ "./packages/native/dist/index.js");
/* harmony import */ var _clockwork_logging__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @clockwork/logging */ "./packages/logging/dist/index.js");


const NativeLibName = 'libjiagu_64.so';
const Arm64Pattern = '00 03 3f d6 a0 06 00 a9';
/** can be super finniky about other native functions hooked befor it patches the memory */
function memoryPatch(name = NativeLibName) {
    let hookNow = false;
    _clockwork_native__WEBPACK_IMPORTED_MODULE_0__.Inject.afterInitArray((name) => {
        if (name?.includes(NativeLibName)) {
            hookNow = true;
        }
        if (hookNow) {
            let module = null;
            if (hookNow && (module = Process.findModuleByName(NativeLibName))) {
                Memory.scan(module.base, module.size, Arm64Pattern, {
                    onMatch: function (found) {
                        Interceptor.attach(found, function (args) {
                            Memory.protect(args[0], Process.pointerSize, 'rwx');
                            try {
                                const arg0 = args[0].readCString();
                                if (arg0?.includes('/proc/') && arg0?.includes('/maps')) {
                                    args[0].writeUtf8String('/proc/self/cmdline');
                                }
                            }
                            catch (e) { }
                        });
                    },
                    onComplete: function () {
                        _clockwork_logging__WEBPACK_IMPORTED_MODULE_1__.logger.info({ tag: 'jigau' }, 'frida detection nypassed');
                    },
                });
            }
        }
    });
}

//# sourceMappingURL=jigau.js.map

/***/ }),

/***/ "./packages/common/dist/define/java.js":
/*!*********************************************!*\
  !*** ./packages/common/dist/define/java.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ClassesProxy: () => (/* binding */ ClassesProxy),
/* harmony export */   ClassesString: () => (/* binding */ ClassesString)
/* harmony export */ });
/* harmony import */ var _internal_proxy_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../internal/proxy.js */ "./packages/common/dist/internal/proxy.js");

const ClassesString = {
    String: 'java.lang.String',
    Boolean: 'java.lang.Boolean',
    ArrayList: 'java.util.ArrayList',
    System: 'java.lang.System',
    Exception: 'java.lang.Exception',
    StringBuilder: 'java.lang.StringBuilder',
    Class: 'java.lang.Class',
    URL: 'java.net.URL',
    Cipher: 'javax.crypto.Cipher',
    SecretKeySpec: 'javax.crypto.spec.SecretKeySpec',
    Object: 'java.lang.Object',
    ClassLoader: 'java.lang.ClassLoader',
    BaseDexClassLoader: 'dalvik.system.BaseDexClassLoader',
    DexClassLoader: 'dalvik.system.DexClassLoader',
    InMemoryDexClassLoader: 'dalvik.system.InMemoryDexClassLoader',
    PathClassLoader: 'dalvik.system.PathClassLoader',
    Date: 'java.util.Date',
    Integer: 'java.lang.Integer',
    Method: 'java.lang.reflect.Method',
    Runtime: 'java.lang.Runtime',
    Map$Entry: 'java.util.Map$Entry',
    Locale: 'java.util.Locale',
    TimeZone: 'java.util.TimeZone',
    Thread: 'java.lang.Thread',
    Arrays: 'java.util.Arrays',
    Math: 'java.lang.Math',
    DexPathList: 'dalvik.system.DexPathList',
    PendingIntent: 'android.app.PendingIntent',
    ZonedDateTime: 'java.time.ZonedDateTime',
    ZoneId: 'java.time.ZoneId',
    Instant: 'java.time.Instant',
    Calendar: 'java.util.Calendar',
    Application: 'android.app.Application',
    Settings$Secure: 'android.provider.Settings$Secure',
    Settings$Global: 'android.provider.Settings$Global',
    WebView: 'android.webkit.WebView',
    ContentResolver: 'android.content.ContentResolver',
    WebChromeClient: 'android.webkit.WebChromeClient',
    Log: 'android.util.Log',
    JSONObject: 'org.json.JSONObject',
    JSONArray: 'org.json.JSONArray',
    Bundle: 'android.os.Bundle',
    Intent: 'android.content.Intent',
    Activity: 'android.app.Activity',
    SharedPreferences: 'android.content.SharedPreferences',
    SharedPreferencesImpl: 'android.app.SharedPreferencesImpl',
    PackageManager: 'android.content.pm.PackageManager',
    TelephonyManager: 'android.telephony.TelephonyManager',
    Build: 'android.os.Build',
    InstallReferrerClient: 'com.android.installreferrer.api.InstallReferrerClient',
    InstallReferrerStateListener: 'com.android.installreferrer.api.InstallReferrerStateListener',
    ReferrerDetails: 'com.android.installreferrer.api.ReferrerDetails',
};
const ClassesProxy = (0,_internal_proxy_js__WEBPACK_IMPORTED_MODULE_0__.proxyJavaUse)(ClassesString);

//# sourceMappingURL=java.js.map

/***/ }),

/***/ "./packages/common/dist/define/libc.js":
/*!*********************************************!*\
  !*** ./packages/common/dist/define/libc.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LibcFinderProxy: () => (/* binding */ LibcFinderProxy)
/* harmony export */ });
/* harmony import */ var _internal_proxy_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../internal/proxy.js */ "./packages/common/dist/internal/proxy.js");

const LibcFinder = {
    open: () => {
        const ptr = Module.getExportByName('libc.so', 'open');
        return new NativeFunction(ptr, 'int', ['pointer', 'int']);
    },
    // int close(int fd);
    close: () => {
        const ptr = Module.getExportByName('libc.so', 'close');
        return new NativeFunction(ptr, 'int', ['int']);
    },
    // int shutdown(int sockfd, int how);
    shutdown: () => {
        const ptr = Module.getExportByName('libc.so', 'shutdown');
        return new NativeFunction(ptr, 'int', ['int', 'int']);
    },
    mkdir: () => {
        const ptr = Module.getExportByName('libc.so', 'mkdir');
        return new NativeFunction(ptr, 'int', ['pointer', 'int']);
    },
    opendir: () => {
        const ptr = Module.getExportByName('libc.so', 'opendir');
        return new NativeFunction(ptr, 'pointer', ['pointer']);
    },
    closedir: () => {
        const ptr = Module.getExportByName('libc.so', 'closedir');
        return new NativeFunction(ptr, 'int', ['pointer']);
    },
    read: () => {
        const ptr = Module.getExportByName('libc.so', 'read');
        return new NativeFunction(ptr, 'int', ['int', 'pointer', 'int']);
    },
    chmod: () => {
        const ptr = Module.getExportByName('libc.so', 'chmod');
        return new NativeFunction(ptr, 'int', ['pointer', 'int']);
    },
    access: () => {
        const ptr = Module.getExportByName('libc.so', 'access');
        return new NativeFunction(ptr, 'int', ['pointer', 'int']);
    },
    pthread_create: () => {
        const ptr = Module.getExportByName('libc.so', 'pthread_create');
        return new NativeFunction(ptr, 'int', ['pointer', 'pointer', 'pointer', 'pointer']);
    },
    difftime: () => {
        const ptr = Module.getExportByName('libc.so', 'difftime');
        return new NativeFunction(ptr, 'void', ['pointer', 'pointer']);
    },
    // int connect(int sockfd, const struct sockaddr *addr, socklen_t addrlen);
    connect: () => {
        const ptr = Module.getExportByName('libc.so', 'connect');
        return new NativeFunction(ptr, 'int', ['int', 'pointer', 'pointer']);
    },
    // int __system_property_get(const char *name, char *value);
    __system_property_get: () => {
        const ptr = Module.getExportByName('libc.so', '__system_property_get');
        return new NativeFunction(ptr, 'int', ['pointer', 'pointer']);
    },
    // int __system_property_read( const prop_info *pi, char *name, char * value);
    __system_property_read: () => {
        const ptr = Module.getExportByName('libc.so', '__system_property_read');
        return new NativeFunction(ptr, 'int', ['pointer', 'pointer', 'pointer']);
    },
    // struct hostent *gethostbyname(const char *name);
    gethostbyname: () => {
        const ptr = Module.getExportByName('libc.so', 'gethostbyname');
        return new NativeFunction(ptr, 'pointer', ['pointer']);
    },
    // int getaddrinfo(const char *restrict node,
    //                const char *restrict service,
    //                const struct addrinfo *restrict hints,
    //                struct addrinfo **restrict res);
    getaddrinfo: () => {
        const ptr = Module.getExportByName('libc.so', 'getaddrinfo');
        return new NativeFunction(ptr, 'int', ['pointer', 'pointer', 'pointer', 'pointer']);
    },
    // int inet_aton(const char *cp, struct in_addr *addr);
    inet_aton: () => {
        const ptr = Module.getExportByName('libc.so', 'inet_aton');
        return new NativeFunction(ptr, 'int', ['pointer', 'pointer']);
    },
    // pid_t fork(void);
    fork: () => {
        const ptr = Module.getExportByName('libc.so', 'fork');
        return new NativeFunction(ptr, 'int', []);
    },
    // int gettimeofday(struct timeval *restrict tv, struct timezone *_Nullable restrict tz);
    gettimeofday: () => {
        const ptr = Module.getExportByName('libc.so', 'gettimeofday');
        return new NativeFunction(ptr, 'int', ['pointer', 'pointer']);
    },
    // int pthread_mutex_init(pthread_mutex_t *mutex, const pthread_mutexattr_t *attr);
    pthread_mutex_init: () => {
        const ptr = Module.getExportByName('libc.so', 'pthread_mutex_init');
        return new NativeFunction(ptr, 'int', ['pointer', 'pointer']);
    },
    // int pthread_mutex_lock(pthread_mutex_t *mutex);
    pthread_mutex_lock: () => {
        const ptr = Module.getExportByName('libc.so', 'pthread_mutex_lock');
        return new NativeFunction(ptr, 'int', ['pointer']);
    },
    // int pthread_mutex_unlock(pthread_mutex_t *mutex);
    pthread_mutex_unlock: () => {
        const ptr = Module.getExportByName('libc.so', 'pthread_mutex_unlock');
        return new NativeFunction(ptr, 'int', ['pointer']);
    },
    // int pthread_detach(pthread_t thread);
    pthread_detach: () => {
        const ptr = Module.getExportByName('libc.so', 'pthread_detach');
        return new NativeFunction(ptr, 'int', ['pointer']);
    }
};
const LibcFinderProxy = (0,_internal_proxy_js__WEBPACK_IMPORTED_MODULE_0__.proxyCallback)(LibcFinder);

//# sourceMappingURL=libc.js.map

/***/ }),

/***/ "./packages/common/dist/define/std.js":
/*!********************************************!*\
  !*** ./packages/common/dist/define/std.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   String: () => (/* binding */ StdString)
/* harmony export */ });
class StdString {
    static #STD_STRING_SIZE = 3 * Process.pointerSize;
    handle;
    constructor() {
        this.handle = Memory.alloc(StdString.#STD_STRING_SIZE);
    }
    dispose() {
        const [data, isTiny] = this._getData();
        if (!isTiny) {
            //@ts-ignore
            Java.api.$delete(data);
        }
    }
    disposeToString() {
        const result = this.toString();
        this.dispose();
        return result;
    }
    toString() {
        const [data] = this._getData();
        //@ts-ignore
        return data.readUtf8String();
    }
    _getData() {
        const str = this.handle;
        const isTiny = (str.readU8() & 1) === 0;
        const data = isTiny ? str.add(1) : str.add(2 * Process.pointerSize).readPointer();
        return [data, isTiny];
    }
}

//# sourceMappingURL=std.js.map

/***/ }),

/***/ "./packages/common/dist/index.js":
/*!***************************************!*\
  !*** ./packages/common/dist/index.js ***!
  \***************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Classes: () => (/* reexport safe */ _define_java_js__WEBPACK_IMPORTED_MODULE_0__.ClassesProxy),
/* harmony export */   ClassesString: () => (/* reexport safe */ _define_java_js__WEBPACK_IMPORTED_MODULE_0__.ClassesString),
/* harmony export */   Libc: () => (/* reexport safe */ _define_libc_js__WEBPACK_IMPORTED_MODULE_1__.LibcFinderProxy),
/* harmony export */   Std: () => (/* reexport module object */ _define_std_js__WEBPACK_IMPORTED_MODULE_2__),
/* harmony export */   Text: () => (/* reexport module object */ _text_js__WEBPACK_IMPORTED_MODULE_4__),
/* harmony export */   enumerateMembers: () => (/* reexport safe */ _search_js__WEBPACK_IMPORTED_MODULE_3__.enumerateMembers),
/* harmony export */   findClass: () => (/* reexport safe */ _search_js__WEBPACK_IMPORTED_MODULE_3__.findClass),
/* harmony export */   getClass: () => (/* reexport safe */ _search_js__WEBPACK_IMPORTED_MODULE_3__.getClass),
/* harmony export */   getFindUnique: () => (/* reexport safe */ _search_js__WEBPACK_IMPORTED_MODULE_3__.getFindUnique),
/* harmony export */   isJWrapper: () => (/* binding */ isJWrapper),
/* harmony export */   stacktrace: () => (/* binding */ stacktrace),
/* harmony export */   stacktraceList: () => (/* binding */ stacktraceList)
/* harmony export */ });
/* harmony import */ var _define_java_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./define/java.js */ "./packages/common/dist/define/java.js");
/* harmony import */ var _define_libc_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./define/libc.js */ "./packages/common/dist/define/libc.js");
/* harmony import */ var _define_std_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./define/std.js */ "./packages/common/dist/define/std.js");
/* harmony import */ var _search_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./search.js */ "./packages/common/dist/search.js");
/* harmony import */ var _text_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./text.js */ "./packages/common/dist/text.js");





function isJWrapper(clazzOrName) {
    return clazzOrName?.hasOwnProperty('$className');
}
function stacktrace() {
    const e = _define_java_js__WEBPACK_IMPORTED_MODULE_0__.ClassesProxy.Exception.$new();
    return _define_java_js__WEBPACK_IMPORTED_MODULE_0__.ClassesProxy.Log.getStackTraceString(e).split('\n').slice(1).join('\n');
}
function stacktraceList() {
    const e = _define_java_js__WEBPACK_IMPORTED_MODULE_0__.ClassesProxy.Exception.$new();
    const stack = _define_java_js__WEBPACK_IMPORTED_MODULE_0__.ClassesProxy.Log.getStackTraceString(e);
    return `${stack}`.split('\n').slice(1).map((s) => s.substring(s.indexOf('at ') + 3).trim());
}
Object.defineProperties(global, {
    findClass: {
        value: _search_js__WEBPACK_IMPORTED_MODULE_3__.findClass
    },
});

//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./packages/common/dist/internal/proxy.js":
/*!************************************************!*\
  !*** ./packages/common/dist/internal/proxy.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   proxyCallback: () => (/* binding */ proxyCallback),
/* harmony export */   proxyJavaUse: () => (/* binding */ proxyJavaUse)
/* harmony export */ });
function mock() {
    return () => {
        {
            throw new Error('Stub');
        }
    };
}
function proxyJavaUse(data) {
    const init = (key) => Java.use(key);
    const cache = {};
    return new Proxy({}, {
        get: (_, name) => {
            const key = data[name];
            return cache[name] || (cache[name] ??= init(key));
        },
        apply: (_, thisArg, argArray) => {
            return thisArg;
        },
    });
}
function proxyCallback(data) {
    const cache = {};
    return new Proxy({}, {
        get: (_, name) => {
            const init = data[name];
            return cache[name] || (cache[name] ??= init());
        },
        has(_, key) {
            return data.has(key);
        },
        ownKeys(_) {
            return Reflect.ownKeys(data);
        },
        apply: (_, thisArg, argArray) => {
            return thisArg;
        },
    });
}

//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ "./packages/common/dist/search.js":
/*!****************************************!*\
  !*** ./packages/common/dist/search.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   enumerateMembers: () => (/* binding */ enumerateMembers),
/* harmony export */   findClass: () => (/* binding */ findClass),
/* harmony export */   getClass: () => (/* binding */ getClass),
/* harmony export */   getFindUnique: () => (/* binding */ getFindUnique)
/* harmony export */ });
/* harmony import */ var _clockwork_logging__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @clockwork/logging */ "./packages/logging/dist/index.js");

function enumerateMembers(clazz, callback, maxDepth = Infinity) {
    let current = clazz;
    let depth = 0;
    while (depth < maxDepth && current && current.$n !== 'java.lang.Object') {
        const model = current.$l;
        const members = model.list();
        for (const member of members) {
            const handle = model.find(member);
            switch (`${handle}`.charAt(0)) {
                case 'm': {
                    callback.onMatchMethod?.(current, member, depth);
                    break;
                }
                case 'f': {
                    callback.onMatchField?.(current, member, depth);
                    break;
                }
            }
        }
        current = current.$s;
        depth += 1;
    }
    callback.onComplete?.();
}
function findClass(className, ...loaders) {
    try {
        const mLoaders = [...loaders, ...Java.enumerateClassLoadersSync()];
        for (const loader of mLoaders) {
            try {
                if (loader.loadClass(className)) {
                    const factory = Java.ClassFactory.get(loader);
                    const cls = factory.use(className);
                    return cls;
                }
            }
            catch (notFound) { }
        }
    }
    catch (err) {
        _clockwork_logging__WEBPACK_IMPORTED_MODULE_0__.logger.error({ tag: 'findClass' }, JSON.stringify(err));
    }
    return null;
}
function getClass(className, ...loaders) {
    const result = findClass(className, ...loaders);
    if (result)
        return result;
    throw Error(`class not found: ${className}`);
}
function getFindUnique() {
    const found = new Set();
    return (clazzName, fn) => {
        const clazz = findClass(clazzName);
        if (!clazz) {
            _clockwork_logging__WEBPACK_IMPORTED_MODULE_0__.logger.info({ tag: 'findUnique' }, `class ${clazzName} not found !`);
            return;
        }
        const ptr = `${clazz.$l.handle}`;
        if (!found.has(ptr)) {
            found.add(ptr);
            fn(clazz);
        }
    };
}

//# sourceMappingURL=search.js.map

/***/ }),

/***/ "./packages/common/dist/text.js":
/*!**************************************!*\
  !*** ./packages/common/dist/text.js ***!
  \**************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   maxLengh: () => (/* binding */ maxLengh),
/* harmony export */   noLines: () => (/* binding */ noLines),
/* harmony export */   stringNumber: () => (/* binding */ stringNumber),
/* harmony export */   toByteSize: () => (/* binding */ toByteSize),
/* harmony export */   toHex: () => (/* binding */ toHex),
/* harmony export */   toPrettyType: () => (/* binding */ toPrettyType)
/* harmony export */ });
function maxLengh(message, length) {
    const msgString = `${message}`;
    return msgString.substring(0, Math.min(msgString.length, length));
}
function noLines(message) {
    return `${message}`.replaceAll('\n', '\\n');
}
function toHex(decimal) {
    return ('0' + Number(decimal).toString(16)).slice(-2);
}
function toByteSize(size) {
    const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return Number((size / Math.pow(1024, i)).toFixed(2)) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}
function stringNumber(length) {
    let text = '';
    for (let i = 0; i < length; i++) {
        text += `${Math.floor((Math.random() * 10)) % 10}`;
    }
    return text;
}
const PRIMITIVE_TYPE = {
    Z: 'boolean',
    B: 'byte',
    C: 'char',
    D: 'double',
    F: 'float',
    I: 'int',
    J: 'long',
    S: 'short',
    V: 'void',
};
function toPrettyType(type) {
    const len = type.length;
    for (; type.charAt(0) === '['; type = type.substring(1))
        ;
    const depth = len - type.length;
    if (type.charAt(0) === 'L' && type.charAt(type.length - 1) === ';')
        return type.substring(1, type.length - 1).replaceAll('/', '.') + '[]'.repeat(depth);
    return (PRIMITIVE_TYPE[type] ?? type) + '[]'.repeat(depth);
}

//# sourceMappingURL=text.js.map

/***/ }),

/***/ "./packages/hooks/dist/addons.js":
/*!***************************************!*\
  !*** ./packages/hooks/dist/addons.js ***!
  \***************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   always: () => (/* binding */ always),
/* harmony export */   ifKey: () => (/* binding */ ifKey),
/* harmony export */   ifReturn: () => (/* binding */ ifReturn)
/* harmony export */ });
const always = (value) => () => value;
const ifReturn = (fn) => {
    return function (method, ...args) {
        const result = fn.call(this, method, ...args);
        if (result !== undefined)
            return result;
        return method.call(this, ...args);
    };
};
const ifKey = (fn, index) => {
    return ifReturn(function (method, ...args) {
        const key = args[index ?? 0];
        return fn(key);
    });
};

//# sourceMappingURL=addons.js.map

/***/ }),

/***/ "./packages/hooks/dist/classloader.js":
/*!********************************************!*\
  !*** ./packages/hooks/dist/classloader.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ClassLoader: () => (/* binding */ ClassLoader)
/* harmony export */ });
/* harmony import */ var _clockwork_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @clockwork/common */ "./packages/common/dist/index.js");
/* harmony import */ var _hook_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./hook.js */ "./packages/hooks/dist/hook.js");


var ClassLoader;
(function (ClassLoader) {
    const listeners = [];
    function perform(fn) {
        listeners.push(fn);
    }
    ClassLoader.perform = perform;
    function notify(classLoader) {
        for (const listener of listeners)
            listener(classLoader);
    }
    function onNewClassLoader() {
        const loader = this;
        notify(loader);
    }
    function invoke() {
        (0,_hook_js__WEBPACK_IMPORTED_MODULE_1__.hook)(_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.Classes.ClassLoader, '$init', {
            after: onNewClassLoader,
            logging: { arguments: false, call: false },
        });
        (0,_hook_js__WEBPACK_IMPORTED_MODULE_1__.hook)(_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.Classes.BaseDexClassLoader, '$init', {
            after: onNewClassLoader,
            logging: { arguments: false },
        });
        (0,_hook_js__WEBPACK_IMPORTED_MODULE_1__.hook)(_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.Classes.DexClassLoader, '$init', {
            after: onNewClassLoader,
            logging: { arguments: false },
        });
        (0,_hook_js__WEBPACK_IMPORTED_MODULE_1__.hook)(_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.Classes.InMemoryDexClassLoader, '$init', {
            after: onNewClassLoader,
            logging: { arguments: false },
        });
        (0,_hook_js__WEBPACK_IMPORTED_MODULE_1__.hook)(_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.Classes.PathClassLoader, '$init', {
            after: onNewClassLoader,
            logging: { arguments: false },
        });
        (0,_hook_js__WEBPACK_IMPORTED_MODULE_1__.hook)(_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.Classes.Application, 'onCreate', {
            before() {
                const loader = this.getClassLoader() ?? null;
                onNewClassLoader.call(loader);
            },
        });
        notify(null);
    }
    setImmediate(() => Java.performNow(invoke));
})(ClassLoader || (ClassLoader = {}));

//# sourceMappingURL=classloader.js.map

/***/ }),

/***/ "./packages/hooks/dist/hook.js":
/*!*************************************!*\
  !*** ./packages/hooks/dist/hook.js ***!
  \*************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   findHook: () => (/* binding */ findHook),
/* harmony export */   getHookUnique: () => (/* binding */ getHookUnique),
/* harmony export */   hook: () => (/* binding */ hook)
/* harmony export */ });
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logger.js */ "./packages/hooks/dist/logger.js");
/* harmony import */ var _clockwork_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @clockwork/common */ "./packages/common/dist/index.js");
/* harmony import */ var _clockwork_logging__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @clockwork/logging */ "./packages/logging/dist/index.js");
/* harmony import */ var _ids_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ids.js */ "./packages/hooks/dist/ids.js");




function hook(clazzOrName, methodName, params = {}) {
    const { before, replace, after, logging, loggingPredicate } = params;
    const logger = (0,_logger_js__WEBPACK_IMPORTED_MODULE_0__.getLogger)(logging);
    const clazz = (0,_clockwork_common__WEBPACK_IMPORTED_MODULE_1__.isJWrapper)(clazzOrName) ? clazzOrName : Java.use(clazzOrName);
    const method = clazz[methodName];
    if (`${typeof method}` !== 'function') {
        throw Error(`hook: method ${methodName} not found in ${clazz} !`);
    }
    const overloads = method._o;
    const classString = clazz.$className;
    const cId = _ids_js__WEBPACK_IMPORTED_MODULE_3__.Ids.genClassId(classString);
    const mId = _ids_js__WEBPACK_IMPORTED_MODULE_3__.Ids.genMethodId(classString, methodName);
    logger.printHookClass(classString, _ids_js__WEBPACK_IMPORTED_MODULE_3__.Ids.classId(cId));
    for (let i = 0; i < overloads.length; i++) {
        const overload = overloads[i];
        if (params?.predicate?.(overload, i) === false)
            continue;
        const logId = _ids_js__WEBPACK_IMPORTED_MODULE_3__.Ids.uniqueId(cId, mId, i);
        const { argumentTypes } = overload;
        const argTypesString = argumentTypes.map((t) => t.className);
        const returnTypeString = overload.returnType.className;
        logger.printHookMethod(methodName, argTypesString, returnTypeString, logId);
        const methodDef = method.overload(...argTypesString);
        methodDef.implementation = function (...params) {
            const doLog = loggingPredicate ? loggingPredicate.call(this, methodDef, ...params) : true;
            doLog && logger.printCall(classString, methodName, params, returnTypeString, logId, replace !== undefined);
            before?.call(this, methodDef, ...params);
            const returnValue = replace ? replace.call(this, methodDef, ...params) : methodDef.call(this, ...params);
            after?.call(this, methodDef, returnValue, ...params);
            if (returnTypeString !== 'void')
                doLog && logger.printReturn(returnValue, logId);
            return returnValue;
        };
    }
}
function findHook(clazzName, methodName, params) {
    const clazz = (0,_clockwork_common__WEBPACK_IMPORTED_MODULE_1__.findClass)(clazzName);
    if (!clazz) {
        _clockwork_logging__WEBPACK_IMPORTED_MODULE_2__.logger.debug({ tag: 'findHook' }, `class ${clazzName} not found !`);
        return;
    }
    hook(clazz, methodName, params);
}
function getHookUnique() {
    const found = new Set();
    return (clazzName, methodName, params = {}) => {
        const clazz = (0,_clockwork_common__WEBPACK_IMPORTED_MODULE_1__.findClass)(clazzName);
        if (!clazz) {
            _clockwork_logging__WEBPACK_IMPORTED_MODULE_2__.logger.info({ tag: 'hookUnique' }, `class ${clazzName} not found !`);
            return;
        }
        const ptr = `${clazz.$l.handle}::${methodName}`;
        if (!found.has(ptr)) {
            found.add(ptr);
            hook(clazz, methodName, params);
        }
    };
}

//# sourceMappingURL=hook.js.map

/***/ }),

/***/ "./packages/hooks/dist/ids.js":
/*!************************************!*\
  !*** ./packages/hooks/dist/ids.js ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ids: () => (/* binding */ Ids)
/* harmony export */ });
var Ids;
(function (Ids) {
    let currentCId = -1;
    const classIds = {};
    let currentMId = -1;
    const methodIds = {};
    function genClassId(className) {
        const key = `${className}`;
        return (typeof classIds[key] === 'number' ? classIds[key] : classIds[key] = currentCId += 1);
    }
    Ids.genClassId = genClassId;
    function genMethodId(className, method) {
        const key = `${className}::${method}`;
        return (typeof methodIds[key] === 'number' ? methodIds[key] : methodIds[key] = currentMId += 1);
    }
    Ids.genMethodId = genMethodId;
    function classId(cId) {
        return `#id:${cId}`;
    }
    Ids.classId = classId;
    function uniqueId(cId, mId, i) {
        return `${classId(cId)}:${mId}:${i}`;
    }
    Ids.uniqueId = uniqueId;
})(Ids || (Ids = {}));

//# sourceMappingURL=ids.js.map

/***/ }),

/***/ "./packages/hooks/dist/index.js":
/*!**************************************!*\
  !*** ./packages/hooks/dist/index.js ***!
  \**************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ClassLoader: () => (/* reexport safe */ _classloader_js__WEBPACK_IMPORTED_MODULE_1__.ClassLoader),
/* harmony export */   always: () => (/* reexport safe */ _addons_js__WEBPACK_IMPORTED_MODULE_2__.always),
/* harmony export */   findHook: () => (/* reexport safe */ _hook_js__WEBPACK_IMPORTED_MODULE_0__.findHook),
/* harmony export */   getHookUnique: () => (/* reexport safe */ _hook_js__WEBPACK_IMPORTED_MODULE_0__.getHookUnique),
/* harmony export */   hook: () => (/* reexport safe */ _hook_js__WEBPACK_IMPORTED_MODULE_0__.hook),
/* harmony export */   ifKey: () => (/* reexport safe */ _addons_js__WEBPACK_IMPORTED_MODULE_2__.ifKey),
/* harmony export */   ifReturn: () => (/* reexport safe */ _addons_js__WEBPACK_IMPORTED_MODULE_2__.ifReturn)
/* harmony export */ });
/* harmony import */ var _hook_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hook.js */ "./packages/hooks/dist/hook.js");
/* harmony import */ var _classloader_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./classloader.js */ "./packages/hooks/dist/classloader.js");
/* harmony import */ var _addons_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./addons.js */ "./packages/hooks/dist/addons.js");




//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./packages/hooks/dist/logger.js":
/*!***************************************!*\
  !*** ./packages/hooks/dist/logger.js ***!
  \***************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getLogger: () => (/* binding */ getLogger)
/* harmony export */ });
/* harmony import */ var _clockwork_logging__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @clockwork/logging */ "./packages/logging/dist/index.js");
/* harmony import */ var _clockwork_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @clockwork/common */ "./packages/common/dist/index.js");


const { black, gray, red, green, cyan, dim, italic, bold, yellow, hidden } = _clockwork_logging__WEBPACK_IMPORTED_MODULE_0__.Color.use();
const DEFAULT_LOGGER_OPTIONS = {
    spacing: '   ',
    arguments: true,
    return: true,
    multiline: true,
    short: false,
    call: true,
    hook: true,
    enable: true,
};
const HOOK_LOGGER = {
    mapMethod(config, name) {
        return _clockwork_logging__WEBPACK_IMPORTED_MODULE_0__.Color.method(name);
    },
    mapClass(config, className) {
        let type = _clockwork_common__WEBPACK_IMPORTED_MODULE_1__.Text.toPrettyType(className);
        let array = '';
        const index = type.indexOf('[');
        if (index !== -1) {
            array = dim(yellow(type.substring(index)));
            type = type.substring(0, index);
        }
        const splits = type.split('.');
        if (config.short)
            return cyan(splits[splits.length - 1]) + array;
        return splits.map(cyan).join('.') + array;
    },
    mapValue(arg) {
        if (typeof arg === 'string' || arg?.$className === _clockwork_common__WEBPACK_IMPORTED_MODULE_1__.ClassesString.String) {
            return _clockwork_logging__WEBPACK_IMPORTED_MODULE_0__.Color.string(arg);
        }
        if (typeof arg === 'boolean' || typeof arg === 'number') {
            return _clockwork_logging__WEBPACK_IMPORTED_MODULE_0__.Color.number(`${arg}`);
        }
        if (arg === null || arg === undefined) {
            return _clockwork_logging__WEBPACK_IMPORTED_MODULE_0__.Color.number(`${null}`);
        }
        try {
            //@ts-ignore
            return _clockwork_common__WEBPACK_IMPORTED_MODULE_1__.Classes.String.valueOf(arg);
        }
        catch (e) {
            return `${arg}@${typeof arg}`;
        }
    },
    mapArgs(config, args) {
        if (args.length === 0)
            return '';
        if (!config.arguments)
            return gray('...');
        const joinBy = config.multiline ? ', \n' : ', ';
        const joined = args.map((arg) => `${config.multiline ? config.spacing : ''}${this.mapValue(arg)}`).join(joinBy);
        return config.multiline ? `\n${joined}\n` : joined;
    },
    printHookClass(config, className, logId) {
        if (!config.hook)
            return;
        let sb = '';
        sb += bold('Hooking');
        sb += ' ';
        sb += this.mapClass(config, className);
        this.logInfo(sb, logId);
    },
    printHookMethod(config, methodName, argTypes, returnType, logId) {
        if (!config.hook)
            return;
        let sb = '';
        sb += black(dim('  >'));
        sb += this.mapMethod(config, methodName);
        sb += _clockwork_logging__WEBPACK_IMPORTED_MODULE_0__.Color.bracket('(');
        sb += argTypes.map((argType) => this.mapClass(config, argType)).join(', ');
        sb += _clockwork_logging__WEBPACK_IMPORTED_MODULE_0__.Color.bracket(')');
        sb += ': ';
        sb += this.mapClass(config, returnType);
        this.logInfo(sb, logId);
    },
    printCall(config, className, methodName, argValues, returnType, logId, isReplaced = false) {
        if (!config.call)
            return;
        let sb = '';
        sb += dim(isReplaced ? italic('replace') : 'call');
        sb += ' ';
        if (methodName !== '$init') {
            sb += this.mapClass(config, className);
            sb += '::';
            sb += this.mapMethod(config, methodName);
            sb += _clockwork_logging__WEBPACK_IMPORTED_MODULE_0__.Color.bracket('(');
            sb += this.mapArgs(config, argValues);
            sb += _clockwork_logging__WEBPACK_IMPORTED_MODULE_0__.Color.bracket(')');
            sb += ': ';
            sb += this.mapClass(config, returnType);
        }
        else {
            sb += gray('new');
            sb += ' ';
            sb += this.mapClass(config, className);
            sb += _clockwork_logging__WEBPACK_IMPORTED_MODULE_0__.Color.bracket('(');
            sb += this.mapArgs(config, argValues);
            sb += _clockwork_logging__WEBPACK_IMPORTED_MODULE_0__.Color.bracket(')');
        }
        this.logInfo(sb, logId);
    },
    printReturn(config, returnValue, logId) {
        if (!config.return)
            return;
        let sb = '';
        sb += dim('return');
        sb += ' ';
        sb += `${this.mapValue(returnValue)}`;
        this.logInfo(sb, logId);
    },
    mapLogId(logId) {
        // janky support for kitty background, needs to be set per theme
        return ` \x1b[38;2;45;42;46m${hidden(logId)}\x1b[0m`;
    },
    logInfo(text, logId) {
        // fix line endings
        let sb = text.replaceAll(/\r\n?$/gm, '\n');
        // append logId to all lines
        if (logId) {
            sb = sb.replaceAll(/$/gm, `${this.mapLogId(logId)}`);
        }
        _clockwork_logging__WEBPACK_IMPORTED_MODULE_0__.logger.info(sb);
    },
};
const HOOK_LOGGER_JSON = {
    mapMethod(name) {
        return name;
    },
    mapClass(className) {
        let type = _clockwork_common__WEBPACK_IMPORTED_MODULE_1__.Text.toPrettyType(className);
        let array = '';
        const index = type.indexOf('[');
        if (index !== -1) {
            array = type.substring(index);
            type = type.substring(0, index);
        }
        const splits = type.split('.');
        return splits.join('.') + array;
    },
    mapValue(arg) {
        if (typeof arg === 'string' || typeof arg === 'boolean' || typeof arg === 'number' || arg?.$className === _clockwork_common__WEBPACK_IMPORTED_MODULE_1__.ClassesString.String) {
            return `${arg}`;
        }
        if (arg === null || arg === undefined) {
            return null;
        }
        if (typeof arg === 'object' && arg?.$className === undefined)
            try {
                //@ts-ignore
                return _clockwork_common__WEBPACK_IMPORTED_MODULE_1__.Classes.Arrays.toString(arg);
            }
            catch (_) { }
        try {
            //@ts-ignore
            return _clockwork_common__WEBPACK_IMPORTED_MODULE_1__.Classes.String.valueOf(arg);
        }
        catch (e) {
            return `${arg}@${typeof arg}`;
        }
    },
    printHookClass(className, logId) {
        const msg = JSON.stringify({ t: 'jvmclass', cn: this.mapClass(className), id: logId });
        _clockwork_logging__WEBPACK_IMPORTED_MODULE_0__.logger.info(msg);
    },
    printHookMethod(methodName, argTypes, returnType, logId) {
        const msg = JSON.stringify({
            t: 'jvmmethod',
            mn: this.mapMethod(methodName),
            a: argTypes.map((argType) => this.mapClass(argType)),
            r: this.mapClass(returnType),
            id: logId,
        });
        _clockwork_logging__WEBPACK_IMPORTED_MODULE_0__.logger.info(msg);
    },
    printCall(className, methodName, argValues, returnType, logId, isReplaced = false) {
        const msg = JSON.stringify({
            t: 'jvmcall',
            cn: this.mapClass(className),
            mn: this.mapMethod(methodName),
            id: logId,
            av: argValues.map((arg) => this.mapValue(arg)),
            st: (0,_clockwork_common__WEBPACK_IMPORTED_MODULE_1__.stacktraceList)()
        });
        _clockwork_logging__WEBPACK_IMPORTED_MODULE_0__.logger.info(msg);
    },
    printReturn(returnValue, logId) {
        const msg = JSON.stringify({
            t: 'jvmreturn',
            id: logId,
            rv: this.mapValue(returnValue),
        });
        _clockwork_logging__WEBPACK_IMPORTED_MODULE_0__.logger.info(msg);
    },
};
function getPrettyLogger(options) {
    const opt = options ? { ...DEFAULT_LOGGER_OPTIONS, ...options } : DEFAULT_LOGGER_OPTIONS;
    return Object.assign({}, ...Object.entries(HOOK_LOGGER).map(([key, func]) => ({
        [key]: (...args) => func.call(HOOK_LOGGER, opt, ...args),
    })));
}
function getJsonLogger() {
    return HOOK_LOGGER_JSON;
}
function getLogger(options) {
    return getPrettyLogger(options);
    // return getJsonLogger()
}

//# sourceMappingURL=logger.js.map

/***/ }),

/***/ "./packages/jnitrace/dist/index.js":
/*!*****************************************!*\
  !*** ./packages/jnitrace/dist/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   attach: () => (/* binding */ hookLibart)
/* harmony export */ });
/* harmony import */ var _jniEnvInterceptorArm64_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./jniEnvInterceptorArm64.js */ "./packages/jnitrace/dist/jniEnvInterceptorArm64.js");
/* harmony import */ var _clockwork_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @clockwork/common */ "./packages/common/dist/index.js");
/* harmony import */ var _clockwork_logging__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @clockwork/logging */ "./packages/logging/dist/index.js");
/* harmony import */ var _jniMethod_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./jniMethod.js */ "./packages/jnitrace/dist/jniMethod.js");
/* harmony import */ var _tracer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./tracer.js */ "./packages/jnitrace/dist/tracer.js");





const logger = (0,_clockwork_logging__WEBPACK_IMPORTED_MODULE_2__.subLogger)('jnitrace');
const { black, blue, dim, redBright, yellow } = _clockwork_logging__WEBPACK_IMPORTED_MODULE_2__.Color.use();
// TODO fix all of this
let IF_CHECK = function (thisRef) {
    return false;
};
function ColorMethod(jMethodId, method) {
    let sb = '';
    sb += redBright(`${jMethodId}` + ' -' + dim('>'));
    sb += _clockwork_logging__WEBPACK_IMPORTED_MODULE_2__.Color.className(method.className);
    sb += '::';
    sb += _clockwork_logging__WEBPACK_IMPORTED_MODULE_2__.Color.method(method.name);
    sb += _clockwork_logging__WEBPACK_IMPORTED_MODULE_2__.Color.bracket('(');
    sb += method.javaParams.map(_clockwork_logging__WEBPACK_IMPORTED_MODULE_2__.Color.className).join(', ');
    sb += _clockwork_logging__WEBPACK_IMPORTED_MODULE_2__.Color.bracket(')');
    sb += ': ';
    sb += _clockwork_logging__WEBPACK_IMPORTED_MODULE_2__.Color.className(method.javaRet);
    return sb;
}
function ColorMethodInvoke(method, args) {
    let sb = '';
    sb += dim('call');
    sb += ' ';
    sb += _clockwork_logging__WEBPACK_IMPORTED_MODULE_2__.Color.className(method.className);
    sb += '::';
    sb += _clockwork_logging__WEBPACK_IMPORTED_MODULE_2__.Color.method(method.name);
    sb += _clockwork_logging__WEBPACK_IMPORTED_MODULE_2__.Color.bracket('(');
    if (args.length > 0) {
        sb += '\n';
        sb += args.map((arg) => `    ${arg}`).join(', \n');
        sb += '\n';
    }
    sb += _clockwork_logging__WEBPACK_IMPORTED_MODULE_2__.Color.bracket(')');
    sb += ': ';
    sb += _clockwork_logging__WEBPACK_IMPORTED_MODULE_2__.Color.className(method.javaRet);
    return sb;
}
function hookIf(callback, tag) {
    return function (args) {
        if (!IF_CHECK(this))
            return;
        const msg = callback.call(this, args);
        if (!msg)
            return;
        console.log(`[${tag}]`, msg, DebugSymbol.fromAddress(this.returnAddress));
    };
}
function hookIfTag(tag, callback) {
    return hookIf(callback, dim(tag));
}
function formatCallMethod(nativeName, jMethodId, method, args) {
    if (!method)
        return null; // ! TODO fix
    if (args) {
        const mappedArgs = [];
        for (const i in method.parameters) {
            const param = method.parameters[i];
            mappedArgs.push(args[i]);
            switch (param) {
                case 'java.lang.String': {
                    const wrapped = Java.cast(args[i], _clockwork_common__WEBPACK_IMPORTED_MODULE_1__.Classes.String);
                    mappedArgs[i] = _clockwork_logging__WEBPACK_IMPORTED_MODULE_2__.Color.string(wrapped);
                    continue;
                }
                case 'boolean': {
                    const textBoolean = args[i] ? 'true' : 'false';
                    mappedArgs[i] = _clockwork_logging__WEBPACK_IMPORTED_MODULE_2__.Color.number(textBoolean);
                    continue;
                }
                case 'double':
                case 'float':
                case 'int':
                case 'long': {
                    mappedArgs[i] = _clockwork_logging__WEBPACK_IMPORTED_MODULE_2__.Color.number(args[i]);
                    continue;
                }
            }
            if ((args[i] instanceof NativePointer) && args[i]?.isNull()) {
                mappedArgs[i] = _clockwork_logging__WEBPACK_IMPORTED_MODULE_2__.Color.number(null);
                continue;
            }
            try {
                const wrapped = Java.cast(args[i], _clockwork_common__WEBPACK_IMPORTED_MODULE_1__.Classes.Object);
                //@ts-ignore
                mappedArgs[i] = _clockwork_common__WEBPACK_IMPORTED_MODULE_1__.Classes.String.valueOf(wrapped);
            }
            catch (e) {
            }
        }
        return ColorMethodInvoke(method, mappedArgs);
    }
    return null;
}
function formatMethodReturn(value) {
    if (!value || value.isNull())
        return null;
    let text = `${value}`;
    let type = null; // Java.vm.tryGetEnv()?.getObjectClassName(value);
    if (type && (type = _clockwork_common__WEBPACK_IMPORTED_MODULE_1__.Text.toPrettyType(type))) {
        if (type == _clockwork_common__WEBPACK_IMPORTED_MODULE_1__.Classes.String.$className) {
            text = yellow(`"${Java.cast(value, _clockwork_common__WEBPACK_IMPORTED_MODULE_1__.Classes.String)}"`);
        }
        else if (type.includes('.')) {
            text = `${Java.cast(value, _clockwork_common__WEBPACK_IMPORTED_MODULE_1__.Classes.Object)}`;
        }
    }
    return `${dim('return')} ${text}`;
}
/*
GetFieldID is at  0xe39b87c5 _ZN3art3JNI10GetFieldIDEP7_JNIEnvP7_jclassPKcS6_
GetMethodID is at  0xe39a1a19 _ZN3art3JNI11GetMethodIDEP7_JNIEnvP7_jclassPKcS6_
NewStringUTF is at  0xe39cff25 _ZN3art3JNI12NewStringUTFEP7_JNIEnvPKc
RegisterNatives is at  0xe39e08fd _ZN3art3JNI15RegisterNativesEP7_JNIEnvP7_jclassPK15JNINativeMethodi
GetStaticFieldID is at  0xe39c9635 _ZN3art3JNI16GetStaticFieldIDEP7_JNIEnvP7_jclassPKcS6_
GetStaticMethodID is at  0xe39be0ed _ZN3art3JNI17GetStaticMethodIDEP7_JNIEnvP7_jclassPKcS6_
GetStringUTFChars is at  0xe39d06e5 _ZN3art3JNI17GetStringUTFCharsEP7_JNIEnvP8_jstringPh
DefineClass is at 0x????????
FindClass is at  0xe399ae5d _ZN3art3JNI9FindClassEP7_JNIEnvPKc
*/
function hookLibart(predicate) {
    IF_CHECK = predicate;
    const libart = Process.getModuleByName('libart.so');
    const symbols = libart.enumerateSymbols();
    const jniInterceptor = new _jniEnvInterceptorArm64_js__WEBPACK_IMPORTED_MODULE_0__.JNIEnvInterceptorARM64();
    let addrGetStringUTFChars = null;
    let addrNewStringUTF = null;
    const addrsDefineClass = [];
    let addrFindClass = null;
    let addrGetMethodID = null;
    let addrGetStaticMethodID = null;
    let addrGetFieldID = null;
    let addrGetStaticFieldID = null;
    let addrRegisterNatives = null;
    const addrsCallStatic = [];
    const addrsCallNonvirtual = [];
    const addrsCallMethod = [];
    let ToReflectedMethod = null;
    let GetMethodID = null;
    symbols.forEach(({ name, address }) => {
        if (name.includes('art') && name.includes('JNI') && name.includes('_ZN3art3JNIILb0') && !name.includes('CheckJNI')) {
            if (name.includes('GetStringUTFChars')) {
                addrGetStringUTFChars = address;
                logger.trace('GetStringUTFChars is at', address, name);
            }
            else if (name.includes('NewStringUTF')) {
                addrNewStringUTF = address;
                logger.trace('NewStringUTF is at', address, name);
            }
            else if (name.includes('DefineClass')) {
                addrsDefineClass.push(address);
                logger.trace('DefineClass is at', address, name);
            }
            else if (name.includes('FindClass')) {
                addrFindClass = address;
                logger.trace('FindClass is at', address, name);
            }
            else if (name.includes('GetMethodID')) {
                addrGetMethodID = address;
                GetMethodID = new NativeFunction(addrGetMethodID, 'pointer', ['pointer', 'pointer', 'pointer']);
                logger.trace('GetMethodID is at', address, name);
            }
            else if (name.includes('GetStaticMethodID')) {
                addrGetStaticMethodID = address;
                logger.trace('GetStaticMethodID is at', address, name);
            }
            else if (name.includes('GetFieldID')) {
                addrGetFieldID = address;
                logger.trace('GetFieldID is at', address, name);
            }
            else if (name.includes('GetStaticFieldID')) {
                addrGetStaticFieldID = address;
                logger.trace('GetStaticFieldID is at', address, name);
            }
            else if (name.includes('RegisterNatives')) {
                addrRegisterNatives = address;
                logger.trace('RegisterNatives is at', address, name);
            }
            else if (name.includes('CallStatic')) {
                addrsCallStatic.push(new _jniMethod_js__WEBPACK_IMPORTED_MODULE_3__.JNIMethod(name, address));
                logger.trace('CallStatic is at', address, name);
            }
            else if (name.includes('CallNonvirtual')) {
                addrsCallNonvirtual.push(new _jniMethod_js__WEBPACK_IMPORTED_MODULE_3__.JNIMethod(name, address));
                logger.trace('CallNonvirtual is at', address, name);
            }
            else if (name.includes('Call') && name.includes('Method')) {
                console.warn(name);
                addrsCallMethod.push(new _jniMethod_js__WEBPACK_IMPORTED_MODULE_3__.JNIMethod(name, address));
                logger.trace('Call<>Method is at', address, name);
            }
            else if (name.includes('ToReflectedMethod')) {
                ToReflectedMethod = new NativeFunction(address, 'pointer', ['pointer', 'pointer', 'pointer']);
                logger.trace('ToReflectedMethod is at', address, name);
            }
            else if (name.includes('GetArrayLength')) {
                // Interceptor.attach(address, {
                //     onLeave: hookIfTag('GetArrayLength', (retval) => `${retval}`),
                // });
            }
            else if (name.includes('SetByteArrayRegion')) {
                // Interceptor.attach(address, {
                //     onLeave: hookIfTag('SetByteArrayRegion', (retval) => `${retval}`),
                // });
            }
            else if (name.includes('NewObjectArray')) {
                // Interceptor.attach(address, {
                //     onLeave: hookIfTag('NewObjectArray', (retval) => `${retval}`),
                // });
            }
            else if (name.includes('SetObjectArrayElement')) {
                // Interceptor.attach(address, {
                //     onEnter: hookIfTag('SetObjectArrayElement', (args) => `${args[2]} -> ${args[3]}`),
                // });
            }
            else if (name.includes('ReleaseByteArrayElements')) {
                // Interceptor.attach(address, {
                //     onEnter: hookIfTag('ReleaseByteArrayElements', (args) => `${args[2]} -> ${args[3]}`),
                // });
            }
            else if (name.includes('GetByteArrayElements')) {
                // Interceptor.attach(address, {
                //     onLeave: hookIfTag('GetByteArrayElements', (retval) => `${retval}, ${retval.readByteArray(32)}`),
                // });
            }
        }
    });
    addrGetStringUTFChars &&
        Interceptor.attach(addrGetStringUTFChars, {
            // std::tuple< UniqueStringUTFChars, bool > 	GetStringUTFChars (JNIEnv &env, jstring &string)
            onLeave: hookIfTag('GetStringUTFChars', (retval) => yellow(`"${retval.readCString()}"`)),
        });
    addrNewStringUTF &&
        Interceptor.attach(addrNewStringUTF, {
            // jstring & 	NewStringUTF (JNIEnv &env, const char *bytes)
            onEnter: hookIfTag('NewStringUTF', (args) => yellow(`"${args[1].readCString()}"`)),
        });
    // addrsDefineClass.forEach((addres) => {
    //     Interceptor.attach(addres, {
    //         // jclass & 	DefineClass (JNIEnv &env, const char *name, jobject &loader, const jbyte *buf, jsize size)
    //         // auto 	DefineClass (JNIEnv &env, const char *name, jobject &loader, const Array &buf) -> std::enable_if_t< IsArraylike< Array >::value, jclass & >
    //         onEnter: hookIfTag('DefineClass', (args) => args[1].readCString()),
    //     });
    // });
    addrFindClass &&
        Interceptor.attach(addrFindClass, {
            // jclass & 	FindClass (JNIEnv &env, const char *name)
            onEnter: hookIfTag('FindClass', (args) => args[1].readCString()),
        });
    const getMethodId = function (isStatic = false) {
        // jmethodID       GetMethodID(JNIEnv *env, jclass clazz, const char *name, const char *sig);
        // jmethodID GetStaticMethodID(JNIEnv *env, jclass clazz, const char *name, const char *sig);
        return {
            onEnter(args) {
                this.env = args[0];
                this.clazz = args[1];
                this.name = args[2].readCString();
                this.sig = args[3].readCString();
            },
            onLeave: hookIfTag(`Get${isStatic ? 'Static' : ''}MethodID`, function (retval) {
                const className = Java.vm.tryGetEnv().getClassName(this.clazz);
                const method = (0,_tracer_js__WEBPACK_IMPORTED_MODULE_4__.fastpathMethod)(retval, className, this.name, this.sig, isStatic);
                return ColorMethod(retval, method);
            }),
        };
    };
    addrGetMethodID && Interceptor.attach(addrGetMethodID, getMethodId(false));
    addrGetStaticMethodID && Interceptor.attach(addrGetStaticMethodID, getMethodId(true));
    // addrGetFieldID &&
    //     Interceptor.attach(addrGetFieldID, {
    //         // jfieldID & 	GetFieldID (JNIEnv &env, jclass &clazz, const char *name, const char *sig)
    //         onEnter: hookIfTag('GetFieldID', (args) => {
    //             if (args[2] === null) return null;
    //             const clazz = args[1];
    //             const name = args[2].readCString();
    //             const className = Java.vm.tryGetEnv().getClassName(clazz);
    //             const sig = args[3].readCString();
    //             return `${className}::${name}${sig}`;
    //         }),
    //     });
    // addrGetStaticFieldID &&
    //     Interceptor.attach(addrGetStaticFieldID, {
    //         // jfieldID & 	GetStaticFieldID (JNIEnv &env, jclass &clazz, const char *name, const char *sig)
    //         onEnter: hookIfTag('GetStaticFieldID', (args) => {
    //             if (args[2] === null) return null;
    //             const clazz = args[1];
    //             const name = args[2].readCString();
    //             const className = Java.vm.tryGetEnv().getClassName(clazz);
    //             const sig = args[3].readCString();
    //             return `${className}::${name}${sig}`;
    //         }),
    //     });
    addrsCallStatic.forEach(({ address, name }) => {
        Interceptor.attach(address, {
            // std::enable_if_t<!std::is_void< R >::value, R > 	CallStaticMethod (JNIEnv &env, jclass &clazz, jmethodID &method, Args &&... args)
            onEnter: hookIfTag('CallStatic', (rawargs) => {
                const env = rawargs[0];
                const jclass = rawargs[1];
                const jMethodId = rawargs[2];
                const args = rawargs[3];
                const method = (0,_tracer_js__WEBPACK_IMPORTED_MODULE_4__.resolveMethod)(jMethodId, true);
                const callArgs = jniInterceptor.getCallMethodArgs(name, [env, jclass, jMethodId, args], true);
                return formatCallMethod(name, jMethodId, method, callArgs);
            }),
            onLeave: hookIfTag('CallStatic', formatMethodReturn),
        });
    });
    addrsCallNonvirtual.forEach(({ address, name }) => {
        Interceptor.attach(address, {
            // std::enable_if_t< std::is_void< R >::value, R > 	CallNonvirtualMethod (JNIEnv &env, jobject *obj, jclass &clazz, jmethodID &method, Args &&... args)
            onEnter: hookIfTag('CallNonvirtual', (rawargs) => {
                const env = rawargs[0];
                const jobject = rawargs[1];
                const jclass = rawargs[2];
                const jMethodId = rawargs[3];
                const args = rawargs[4];
                const method = (0,_tracer_js__WEBPACK_IMPORTED_MODULE_4__.resolveMethod)(jMethodId, false);
                const callArgs = jniInterceptor.getCallMethodArgs(name, [env, jobject, jclass, jMethodId, args], false);
                return formatCallMethod(name, jMethodId, method, callArgs);
            }),
            onLeave: hookIfTag('CallNonvirtual', formatMethodReturn),
        });
    });
    addrsCallMethod.forEach(({ address, name }) => {
        Interceptor.attach(address, {
            // std::enable_if_t<!std::is_void< R >::value, R > 	CallMethod (JNIEnv &env, jobject *obj, jmethodID &method, Args &&... args)
            onEnter: hookIfTag('CallMethod', (rawargs) => {
                const env = rawargs[0];
                const jobject = rawargs[1];
                const jMethodId = rawargs[2];
                const args = rawargs[3];
                const method = (0,_tracer_js__WEBPACK_IMPORTED_MODULE_4__.resolveMethod)(jMethodId, false);
                const callArgs = jniInterceptor.getCallMethodArgs(name, [env, jobject, jMethodId, args], false);
                // TODO this logging api
                // const cn = Java.vm.tryGetEnv().getObjectClassName(jobject);
                // if (cn.includes('.')) {
                //     const str = Java.cast(jobject, Java.use('java.lang.Object'));
                //     console.warn(str['toString']());
                // }
                return formatCallMethod(name, jMethodId, method, callArgs);
            }),
            onLeave: hookIfTag('CallMethod', formatMethodReturn),
        });
    });
}

//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./packages/jnitrace/dist/javaMethod.js":
/*!**********************************************!*\
  !*** ./packages/jnitrace/dist/javaMethod.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   JavaMethod: () => (/* binding */ JavaMethod)
/* harmony export */ });
/* harmony import */ var _clockwork_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @clockwork/common */ "./packages/common/dist/index.js");

/**
 * Abstracts a Java method referenced in native code.
 */
class JavaMethod {
    className;
    name;
    parameters;
    returnType;
    isStatic;
    #javaParams = null;
    #javaRet = null;
    constructor(className, name, parameters, returnType, isStatic) {
        this.className = className;
        this.name = name;
        this.parameters = parameters;
        this.returnType = returnType;
        this.isStatic = isStatic;
    }
    /**
     * Get the Java param types for the method.
     */
    get javaParams() {
        return this.#javaParams ??= this.parameters.map(_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.Text.toPrettyType);
    }
    /**
     * Get the Java return type of the method.
     */
    get javaRet() {
        return this.#javaRet ??= _clockwork_common__WEBPACK_IMPORTED_MODULE_0__.Text.toPrettyType(this.returnType);
    }
}

//# sourceMappingURL=javaMethod.js.map

/***/ }),

/***/ "./packages/jnitrace/dist/jni.js":
/*!***************************************!*\
  !*** ./packages/jnitrace/dist/jni.js ***!
  \***************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   JNI: () => (/* binding */ JNI),
/* harmony export */   asFunction: () => (/* binding */ asFunction)
/* harmony export */ });
const JNI = {
    NULL0: { jni: { ret: 'NULL', args: [] }, retType: 'void', argTypes: [], name: 'NULL0', offset: 0 },
    NULL1: { jni: { ret: 'NULL', args: [] }, retType: 'void', argTypes: [], name: 'NULL1', offset: 1 },
    NULL2: { jni: { ret: 'NULL', args: [] }, retType: 'void', argTypes: [], name: 'NULL2', offset: 2 },
    NULL3: { jni: { ret: 'NULL', args: [] }, retType: 'void', argTypes: [], name: 'NULL3', offset: 3 },
    GetVersion: { jni: { ret: 'jint', args: ['JNIEnv*'] }, retType: 'int32', argTypes: ['pointer'], name: 'GetVersion', offset: 4 },
    DefineClass: {
        jni: { ret: 'jclass', args: ['JNIEnv*', 'char*', 'jobject', 'jbyte*', 'jsize'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'int32'],
        name: 'DefineClass',
        offset: 5,
    },
    FindClass: {
        jni: { ret: 'jclass', args: ['JNIEnv*', 'char*'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer'],
        name: 'FindClass',
        offset: 6,
    },
    FromReflectedMethod: {
        jni: { ret: 'jmethodID', args: ['JNIEnv*', 'jobject'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer'],
        name: 'FromReflectedMethod',
        offset: 7,
    },
    FromReflectedField: {
        jni: { ret: 'jfieldID', args: ['JNIEnv*', 'jobject'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer'],
        name: 'FromReflectedField',
        offset: 8,
    },
    ToReflectedMethod: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'jclass', 'jmethodID', 'jboolean'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer', 'uint8'],
        name: 'ToReflectedMethod',
        offset: 9,
    },
    GetSuperclass: {
        jni: { ret: 'jclass', args: ['JNIEnv*', 'jclass'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer'],
        name: 'GetSuperclass',
        offset: 10,
    },
    IsAssignableFrom: {
        jni: { ret: 'jboolean', args: ['JNIEnv*', 'jclass', 'jclass'] },
        retType: 'uint8',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'IsAssignableFrom',
        offset: 11,
    },
    ToReflectedField: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'jclass', 'jfieldID', 'jboolean'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer', 'uint8'],
        name: 'ToReflectedField',
        offset: 12,
    },
    Throw: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jthrowable'] },
        retType: 'int32',
        argTypes: ['pointer', 'pointer'],
        name: 'Throw',
        offset: 13,
    },
    ThrowNew: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jclass', 'char*'] },
        retType: 'int32',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'ThrowNew',
        offset: 14,
    },
    ExceptionOccurred: {
        jni: { ret: 'jthrowable', args: ['JNIEnv*'] },
        retType: 'pointer',
        argTypes: ['pointer'],
        name: 'ExceptionOccurred',
        offset: 15,
    },
    ExceptionDescribe: {
        jni: { ret: 'void', args: ['JNIEnv*'] },
        retType: 'void',
        argTypes: ['pointer'],
        name: 'ExceptionDescribe',
        offset: 16,
    },
    ExceptionClear: { jni: { ret: 'void', args: ['JNIEnv*'] }, retType: 'void', argTypes: ['pointer'], name: 'ExceptionClear', offset: 17 },
    FatalError: {
        jni: { ret: 'void', args: ['JNIEnv*', 'char*'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer'],
        name: 'FatalError',
        offset: 18,
    },
    PushLocalFrame: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jint'] },
        retType: 'int32',
        argTypes: ['pointer', 'int32'],
        name: 'PushLocalFrame',
        offset: 19,
    },
    PopLocalFrame: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'jobject'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer'],
        name: 'PopLocalFrame',
        offset: 20,
    },
    NewGlobalRef: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'jobject'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer'],
        name: 'NewGlobalRef',
        offset: 21,
    },
    DeleteGlobalRef: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobject'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer'],
        name: 'DeleteGlobalRef',
        offset: 22,
    },
    DeleteLocalRef: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobject'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer'],
        name: 'DeleteLocalRef',
        offset: 23,
    },
    IsSameObject: {
        jni: { ret: 'jboolean', args: ['JNIEnv*', 'jobject', 'jobject'] },
        retType: 'uint8',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'IsSameObject',
        offset: 24,
    },
    NewLocalRef: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'jobject'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer'],
        name: 'NewLocalRef',
        offset: 25,
    },
    EnsureLocalCapacity: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jint'] },
        retType: 'int32',
        argTypes: ['pointer', 'int32'],
        name: 'EnsureLocalCapacity',
        offset: 26,
    },
    AllocObject: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'jclass'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer'],
        name: 'AllocObject',
        offset: 27,
    },
    NewObject: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'jclass', 'jmethodID', '...'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'NewObject',
        offset: 28,
    },
    NewObjectV: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'jclass', 'jmethodID', 'va_list'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'NewObjectV',
        offset: 29,
    },
    NewObjectA: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'jclass', 'jmethodID', 'jvalue*'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'NewObjectA',
        offset: 30,
    },
    GetObjectClass: {
        jni: { ret: 'jclass', args: ['JNIEnv*', 'jobject'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer'],
        name: 'GetObjectClass',
        offset: 31,
    },
    IsInstanceOf: {
        jni: { ret: 'jboolean', args: ['JNIEnv*', 'jobject', 'jclass'] },
        retType: 'uint8',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'IsInstanceOf',
        offset: 32,
    },
    GetMethodID: {
        jni: { ret: 'jmethodID', args: ['JNIEnv*', 'jclass', 'char*', 'char*'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'GetMethodID',
        offset: 33,
    },
    CallObjectMethod: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'jobject', 'jmethodID', '...'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallObjectMethod',
        offset: 34,
    },
    CallObjectMethodV: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'jobject', 'jmethodID', 'va_list'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallObjectMethodV',
        offset: 35,
    },
    CallObjectMethodA: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'jobject', 'jmethodID', 'jvalue*'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallObjectMethodA',
        offset: 36,
    },
    CallBooleanMethod: {
        jni: { ret: 'jboolean', args: ['JNIEnv*', 'jobject', 'jmethodID', '...'] },
        retType: 'uint8',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallBooleanMethod',
        offset: 37,
    },
    CallBooleanMethodV: {
        jni: { ret: 'jboolean', args: ['JNIEnv*', 'jobject', 'jmethodID', 'va_list'] },
        retType: 'uint8',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallBooleanMethodV',
        offset: 38,
    },
    CallBooleanMethodA: {
        jni: { ret: 'jboolean', args: ['JNIEnv*', 'jobject', 'jmethodID', 'jvalue*'] },
        retType: 'uint8',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallBooleanMethodA',
        offset: 39,
    },
    CallByteMethod: {
        jni: { ret: 'jbyte', args: ['JNIEnv*', 'jobject', 'jmethodID', '...'] },
        retType: 'int8',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallByteMethod',
        offset: 40,
    },
    CallByteMethodV: {
        jni: { ret: 'jbyte', args: ['JNIEnv*', 'jobject', 'jmethodID', 'va_list'] },
        retType: 'int8',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallByteMethodV',
        offset: 41,
    },
    CallByteMethodA: {
        jni: { ret: 'jbyte', args: ['JNIEnv*', 'jobject', 'jmethodID', 'jvalue*'] },
        retType: 'int8',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallByteMethodA',
        offset: 42,
    },
    CallCharMethod: {
        jni: { ret: 'jchar', args: ['JNIEnv*', 'jobject', 'jmethodID', '...'] },
        retType: 'uint16',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallCharMethod',
        offset: 43,
    },
    CallCharMethodV: {
        jni: { ret: 'jchar', args: ['JNIEnv*', 'jobject', 'jmethodID', 'va_list'] },
        retType: 'uint16',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallCharMethodV',
        offset: 44,
    },
    CallCharMethodA: {
        jni: { ret: 'jchar', args: ['JNIEnv*', 'jobject', 'jmethodID', 'jvalue*'] },
        retType: 'uint16',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallCharMethodA',
        offset: 45,
    },
    CallShortMethod: {
        jni: { ret: 'jshort', args: ['JNIEnv*', 'jobject', 'jmethodID', '...'] },
        retType: 'int16',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallShortMethod',
        offset: 46,
    },
    CallShortMethodV: {
        jni: { ret: 'jshort', args: ['JNIEnv*', 'jobject', 'jmethodID', 'va_list'] },
        retType: 'int16',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallShortMethodV',
        offset: 47,
    },
    CallShortMethodA: {
        jni: { ret: 'jshort', args: ['JNIEnv*', 'jobject', 'jmethodID', 'jvalue*'] },
        retType: 'int16',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallShortMethodA',
        offset: 48,
    },
    CallIntMethod: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jobject', 'jmethodID', '...'] },
        retType: 'int32',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallIntMethod',
        offset: 49,
    },
    CallIntMethodV: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jobject', 'jmethodID', 'va_list'] },
        retType: 'int32',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallIntMethodV',
        offset: 50,
    },
    CallIntMethodA: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jobject', 'jmethodID', 'jvalue*'] },
        retType: 'int32',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallIntMethodA',
        offset: 51,
    },
    CallLongMethod: {
        jni: { ret: 'jlong', args: ['JNIEnv*', 'jobject', 'jmethodID', '...'] },
        retType: 'int64',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallLongMethod',
        offset: 52,
    },
    CallLongMethodV: {
        jni: { ret: 'jlong', args: ['JNIEnv*', 'jobject', 'jmethodID', 'va_list'] },
        retType: 'int64',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallLongMethodV',
        offset: 53,
    },
    CallLongMethodA: {
        jni: { ret: 'jlong', args: ['JNIEnv*', 'jobject', 'jmethodID', 'jvalue*'] },
        retType: 'int64',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallLongMethodA',
        offset: 54,
    },
    CallFloatMethod: {
        jni: { ret: 'jfloat', args: ['JNIEnv*', 'jobject', 'jmethodID', '...'] },
        retType: 'float',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallFloatMethod',
        offset: 55,
    },
    CallFloatMethodV: {
        jni: { ret: 'jfloat', args: ['JNIEnv*', 'jobject', 'jmethodID', 'va_list'] },
        retType: 'float',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallFloatMethodV',
        offset: 56,
    },
    CallFloatMethodA: {
        jni: { ret: 'jfloat', args: ['JNIEnv*', 'jobject', 'jmethodID', 'jvalue*'] },
        retType: 'float',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallFloatMethodA',
        offset: 57,
    },
    CallDoubleMethod: {
        jni: { ret: 'jdouble', args: ['JNIEnv*', 'jobject', 'jmethodID', '...'] },
        retType: 'double',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallDoubleMethod',
        offset: 58,
    },
    CallDoubleMethodV: {
        jni: { ret: 'jdouble', args: ['JNIEnv*', 'jobject', 'jmethodID', 'va_list'] },
        retType: 'double',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallDoubleMethodV',
        offset: 59,
    },
    CallDoubleMethodA: {
        jni: { ret: 'jdouble', args: ['JNIEnv*', 'jobject', 'jmethodID', 'jvalue*'] },
        retType: 'double',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallDoubleMethodA',
        offset: 60,
    },
    CallVoidMethod: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobject', 'jmethodID', '...'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallVoidMethod',
        offset: 61,
    },
    CallVoidMethodV: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobject', 'jmethodID', 'va_list'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallVoidMethodV',
        offset: 62,
    },
    CallVoidMethodA: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobject', 'jmethodID', 'jvalue*'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallVoidMethodA',
        offset: 63,
    },
    CallNonvirtualObjectMethod: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', '...'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallNonvirtualObjectMethod',
        offset: 64,
    },
    CallNonvirtualObjectMethodV: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'va_list'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallNonvirtualObjectMethodV',
        offset: 65,
    },
    CallNonvirtualObjectMethodA: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'jvalue*'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallNonvirtualObjectMethodA',
        offset: 66,
    },
    CallNonvirtualBooleanMethod: {
        jni: { ret: 'jboolean', args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', '...'] },
        retType: 'uint8',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallNonvirtualBooleanMethod',
        offset: 67,
    },
    CallNonvirtualBooleanMethodV: {
        jni: { ret: 'jboolean', args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'va_list'] },
        retType: 'uint8',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallNonvirtualBooleanMethodV',
        offset: 68,
    },
    CallNonvirtualBooleanMethodA: {
        jni: { ret: 'jboolean', args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'jvalue*'] },
        retType: 'uint8',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallNonvirtualBooleanMethodA',
        offset: 69,
    },
    CallNonvirtualByteMethod: {
        jni: { ret: 'jbyte', args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', '...'] },
        retType: 'int8',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallNonvirtualByteMethod',
        offset: 70,
    },
    CallNonvirtualByteMethodV: {
        jni: { ret: 'jbyte', args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'va_list'] },
        retType: 'int8',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallNonvirtualByteMethodV',
        offset: 71,
    },
    CallNonvirtualByteMethodA: {
        jni: { ret: 'jbyte', args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'jvalue*'] },
        retType: 'int8',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallNonvirtualByteMethodA',
        offset: 72,
    },
    CallNonvirtualCharMethod: {
        jni: { ret: 'jchar', args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', '...'] },
        retType: 'uint16',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallNonvirtualCharMethod',
        offset: 73,
    },
    CallNonvirtualCharMethodV: {
        jni: { ret: 'jchar', args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'va_list'] },
        retType: 'uint16',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallNonvirtualCharMethodV',
        offset: 74,
    },
    CallNonvirtualCharMethodA: {
        jni: { ret: 'jchar', args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'jvalue*'] },
        retType: 'uint16',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallNonvirtualCharMethodA',
        offset: 75,
    },
    CallNonvirtualShortMethod: {
        jni: { ret: 'jshort', args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', '...'] },
        retType: 'int16',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallNonvirtualShortMethod',
        offset: 76,
    },
    CallNonvirtualShortMethodV: {
        jni: { ret: 'jshort', args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'va_list'] },
        retType: 'int16',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallNonvirtualShortMethodV',
        offset: 77,
    },
    CallNonvirtualShortMethodA: {
        jni: { ret: 'jshort', args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'jvalue*'] },
        retType: 'int16',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallNonvirtualShortMethodA',
        offset: 78,
    },
    CallNonvirtualIntMethod: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', '...'] },
        retType: 'int32',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallNonvirtualIntMethod',
        offset: 79,
    },
    CallNonvirtualIntMethodV: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'va_list'] },
        retType: 'int32',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallNonvirtualIntMethodV',
        offset: 80,
    },
    CallNonvirtualIntMethodA: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'jvalue*'] },
        retType: 'int32',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallNonvirtualIntMethodA',
        offset: 81,
    },
    CallNonvirtualLongMethod: {
        jni: { ret: 'jlong', args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', '...'] },
        retType: 'int64',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallNonvirtualLongMethod',
        offset: 82,
    },
    CallNonvirtualLongMethodV: {
        jni: { ret: 'jlong', args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'va_list'] },
        retType: 'int64',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallNonvirtualLongMethodV',
        offset: 83,
    },
    CallNonvirtualLongMethodA: {
        jni: { ret: 'jlong', args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'jvalue*'] },
        retType: 'int64',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallNonvirtualLongMethodA',
        offset: 84,
    },
    CallNonvirtualFloatMethod: {
        jni: { ret: 'jfloat', args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', '...'] },
        retType: 'float',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallNonvirtualFloatMethod',
        offset: 85,
    },
    CallNonvirtualFloatMethodV: {
        jni: { ret: 'jfloat', args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'va_list'] },
        retType: 'float',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallNonvirtualFloatMethodV',
        offset: 86,
    },
    CallNonvirtualFloatMethodA: {
        jni: { ret: 'jfloat', args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'jvalue*'] },
        retType: 'float',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallNonvirtualFloatMethodA',
        offset: 87,
    },
    CallNonvirtualDoubleMethod: {
        jni: { ret: 'jdouble', args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', '...'] },
        retType: 'double',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallNonvirtualDoubleMethod',
        offset: 88,
    },
    CallNonvirtualDoubleMethodV: {
        jni: { ret: 'jdouble', args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'va_list'] },
        retType: 'double',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallNonvirtualDoubleMethodV',
        offset: 89,
    },
    CallNonvirtualDoubleMethodA: {
        jni: { ret: 'jdouble', args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'jvalue*'] },
        retType: 'double',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallNonvirtualDoubleMethodA',
        offset: 90,
    },
    CallNonvirtualVoidMethod: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', '...'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallNonvirtualVoidMethod',
        offset: 91,
    },
    CallNonvirtualVoidMethodV: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'va_list'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallNonvirtualVoidMethodV',
        offset: 92,
    },
    CallNonvirtualVoidMethodA: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'jvalue*'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallNonvirtualVoidMethodA',
        offset: 93,
    },
    GetFieldID: {
        jni: { ret: 'jfieldID', args: ['JNIEnv*', 'jclass', 'char*', 'char*'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'GetFieldID',
        offset: 94,
    },
    GetObjectField: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'jobject', 'jfieldID'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'GetObjectField',
        offset: 95,
    },
    GetBooleanField: {
        jni: { ret: 'jboolean', args: ['JNIEnv*', 'jobject', 'jfieldID'] },
        retType: 'uint8',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'GetBooleanField',
        offset: 96,
    },
    GetByteField: {
        jni: { ret: 'jbyte', args: ['JNIEnv*', 'jobject', 'jfieldID'] },
        retType: 'int8',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'GetByteField',
        offset: 97,
    },
    GetCharField: {
        jni: { ret: 'jchar', args: ['JNIEnv*', 'jobject', 'jfieldID'] },
        retType: 'uint16',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'GetCharField',
        offset: 98,
    },
    GetShortField: {
        jni: { ret: 'jshort', args: ['JNIEnv*', 'jobject', 'jfieldID'] },
        retType: 'int16',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'GetShortField',
        offset: 99,
    },
    GetIntField: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jobject', 'jfieldID'] },
        retType: 'int32',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'GetIntField',
        offset: 100,
    },
    GetLongField: {
        jni: { ret: 'jlong', args: ['JNIEnv*', 'jobject', 'jfieldID'] },
        retType: 'int64',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'GetLongField',
        offset: 101,
    },
    GetFloatField: {
        jni: { ret: 'jfloat', args: ['JNIEnv*', 'jobject', 'jfieldID'] },
        retType: 'float',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'GetFloatField',
        offset: 102,
    },
    GetDoubleField: {
        jni: { ret: 'jdouble', args: ['JNIEnv*', 'jobject', 'jfieldID'] },
        retType: 'double',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'GetDoubleField',
        offset: 103,
    },
    SetObjectField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobject', 'jfieldID', 'jobject'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'SetObjectField',
        offset: 104,
    },
    SetBooleanField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobject', 'jfieldID', 'jboolean'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'uint8'],
        name: 'SetBooleanField',
        offset: 105,
    },
    SetByteField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobject', 'jfieldID', 'jbyte'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'int8'],
        name: 'SetByteField',
        offset: 106,
    },
    SetCharField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobject', 'jfieldID', 'jchar'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'uint16'],
        name: 'SetCharField',
        offset: 107,
    },
    SetShortField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobject', 'jfieldID', 'jshort'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'int16'],
        name: 'SetShortField',
        offset: 108,
    },
    SetIntField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobject', 'jfieldID', 'jint'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'int32'],
        name: 'SetIntField',
        offset: 109,
    },
    SetLongField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobject', 'jfieldID', 'jlong'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'int64'],
        name: 'SetLongField',
        offset: 110,
    },
    SetFloatField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobject', 'jfieldID', 'jfloat'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'float'],
        name: 'SetFloatField',
        offset: 111,
    },
    SetDoubleField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobject', 'jfieldID', 'jdouble'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'double'],
        name: 'SetDoubleField',
        offset: 112,
    },
    GetStaticMethodID: {
        jni: { ret: 'jmethodID', args: ['JNIEnv*', 'jclass', 'char*', 'char*'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'GetStaticMethodID',
        offset: 113,
    },
    CallStaticObjectMethod: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'jclass', 'jmethodID', '...'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallStaticObjectMethod',
        offset: 114,
    },
    CallStaticObjectMethodV: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'jclass', 'jmethodID', 'va_list'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallStaticObjectMethodV',
        offset: 115,
    },
    CallStaticObjectMethodA: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'jclass', 'jmethodID', 'jvalue*'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallStaticObjectMethodA',
        offset: 116,
    },
    CallStaticBooleanMethod: {
        jni: { ret: 'jboolean', args: ['JNIEnv*', 'jclass', 'jmethodID', '...'] },
        retType: 'uint8',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallStaticBooleanMethod',
        offset: 117,
    },
    CallStaticBooleanMethodV: {
        jni: { ret: 'jboolean', args: ['JNIEnv*', 'jclass', 'jmethodID', 'va_list'] },
        retType: 'uint8',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallStaticBooleanMethodV',
        offset: 118,
    },
    CallStaticBooleanMethodA: {
        jni: { ret: 'jboolean', args: ['JNIEnv*', 'jclass', 'jmethodID', 'jvalue*'] },
        retType: 'uint8',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallStaticBooleanMethodA',
        offset: 119,
    },
    CallStaticByteMethod: {
        jni: { ret: 'jbyte', args: ['JNIEnv*', 'jclass', 'jmethodID', '...'] },
        retType: 'int8',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallStaticByteMethod',
        offset: 120,
    },
    CallStaticByteMethodV: {
        jni: { ret: 'jbyte', args: ['JNIEnv*', 'jclass', 'jmethodID', 'va_list'] },
        retType: 'int8',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallStaticByteMethodV',
        offset: 121,
    },
    CallStaticByteMethodA: {
        jni: { ret: 'jbyte', args: ['JNIEnv*', 'jclass', 'jmethodID', 'jvalue*'] },
        retType: 'int8',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallStaticByteMethodA',
        offset: 122,
    },
    CallStaticCharMethod: {
        jni: { ret: 'jchar', args: ['JNIEnv*', 'jclass', 'jmethodID', '...'] },
        retType: 'uint16',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallStaticCharMethod',
        offset: 123,
    },
    CallStaticCharMethodV: {
        jni: { ret: 'jchar', args: ['JNIEnv*', 'jclass', 'jmethodID', 'va_list'] },
        retType: 'uint16',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallStaticCharMethodV',
        offset: 124,
    },
    CallStaticCharMethodA: {
        jni: { ret: 'jchar', args: ['JNIEnv*', 'jclass', 'jmethodID', 'jvalue*'] },
        retType: 'uint16',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallStaticCharMethodA',
        offset: 125,
    },
    CallStaticShortMethod: {
        jni: { ret: 'jshort', args: ['JNIEnv*', 'jclass', 'jmethodID', '...'] },
        retType: 'int16',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallStaticShortMethod',
        offset: 126,
    },
    CallStaticShortMethodV: {
        jni: { ret: 'jshort', args: ['JNIEnv*', 'jclass', 'jmethodID', 'va_list'] },
        retType: 'int16',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallStaticShortMethodV',
        offset: 127,
    },
    CallStaticShortMethodA: {
        jni: { ret: 'jshort', args: ['JNIEnv*', 'jclass', 'jmethodID', 'jvalue*'] },
        retType: 'int16',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallStaticShortMethodA',
        offset: 128,
    },
    CallStaticIntMethod: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jclass', 'jmethodID', '...'] },
        retType: 'int32',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallStaticIntMethod',
        offset: 129,
    },
    CallStaticIntMethodV: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jclass', 'jmethodID', 'va_list'] },
        retType: 'int32',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallStaticIntMethodV',
        offset: 130,
    },
    CallStaticIntMethodA: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jclass', 'jmethodID', 'jvalue*'] },
        retType: 'int32',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallStaticIntMethodA',
        offset: 131,
    },
    CallStaticLongMethod: {
        jni: { ret: 'jlong', args: ['JNIEnv*', 'jclass', 'jmethodID', '...'] },
        retType: 'int64',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallStaticLongMethod',
        offset: 132,
    },
    CallStaticLongMethodV: {
        jni: { ret: 'jlong', args: ['JNIEnv*', 'jclass', 'jmethodID', 'va_list'] },
        retType: 'int64',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallStaticLongMethodV',
        offset: 133,
    },
    CallStaticLongMethodA: {
        jni: { ret: 'jlong', args: ['JNIEnv*', 'jclass', 'jmethodID', 'jvalue*'] },
        retType: 'int64',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallStaticLongMethodA',
        offset: 134,
    },
    CallStaticFloatMethod: {
        jni: { ret: 'jfloat', args: ['JNIEnv*', 'jclass', 'jmethodID', '...'] },
        retType: 'float',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallStaticFloatMethod',
        offset: 135,
    },
    CallStaticFloatMethodV: {
        jni: { ret: 'jfloat', args: ['JNIEnv*', 'jclass', 'jmethodID', 'va_list'] },
        retType: 'float',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallStaticFloatMethodV',
        offset: 136,
    },
    CallStaticFloatMethodA: {
        jni: { ret: 'jfloat', args: ['JNIEnv*', 'jclass', 'jmethodID', 'jvalue*'] },
        retType: 'float',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallStaticFloatMethodA',
        offset: 137,
    },
    CallStaticDoubleMethod: {
        jni: { ret: 'jdouble', args: ['JNIEnv*', 'jclass', 'jmethodID', '...'] },
        retType: 'double',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallStaticDoubleMethod',
        offset: 138,
    },
    CallStaticDoubleMethodV: {
        jni: { ret: 'jdouble', args: ['JNIEnv*', 'jclass', 'jmethodID', 'va_list'] },
        retType: 'double',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallStaticDoubleMethodV',
        offset: 139,
    },
    CallStaticDoubleMethodA: {
        jni: { ret: 'jdouble', args: ['JNIEnv*', 'jclass', 'jmethodID', 'jvalue*'] },
        retType: 'double',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallStaticDoubleMethodA',
        offset: 140,
    },
    CallStaticVoidMethod: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jclass', 'jmethodID', '...'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallStaticVoidMethod',
        offset: 141,
    },
    CallStaticVoidMethodV: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jclass', 'jmethodID', 'va_list'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallStaticVoidMethodV',
        offset: 142,
    },
    CallStaticVoidMethodA: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jclass', 'jmethodID', 'jvalue*'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'CallStaticVoidMethodA',
        offset: 143,
    },
    GetStaticFieldID: {
        jni: { ret: 'jfieldID', args: ['JNIEnv*', 'jclass', 'char*', 'char*'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'GetStaticFieldID',
        offset: 144,
    },
    GetStaticObjectField: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'jclass', 'jfieldID'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'GetStaticObjectField',
        offset: 145,
    },
    GetStaticBooleanField: {
        jni: { ret: 'jboolean', args: ['JNIEnv*', 'jclass', 'jfieldID'] },
        retType: 'uint8',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'GetStaticBooleanField',
        offset: 146,
    },
    GetStaticByteField: {
        jni: { ret: 'jbyte', args: ['JNIEnv*', 'jclass', 'jfieldID'] },
        retType: 'int8',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'GetStaticByteField',
        offset: 147,
    },
    GetStaticCharField: {
        jni: { ret: 'jchar', args: ['JNIEnv*', 'jclass', 'jfieldID'] },
        retType: 'uint16',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'GetStaticCharField',
        offset: 148,
    },
    GetStaticShortField: {
        jni: { ret: 'jshort', args: ['JNIEnv*', 'jclass', 'jfieldID'] },
        retType: 'int16',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'GetStaticShortField',
        offset: 149,
    },
    GetStaticIntField: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jclass', 'jfieldID'] },
        retType: 'int32',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'GetStaticIntField',
        offset: 150,
    },
    GetStaticLongField: {
        jni: { ret: 'jlong', args: ['JNIEnv*', 'jclass', 'jfieldID'] },
        retType: 'int64',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'GetStaticLongField',
        offset: 151,
    },
    GetStaticFloatField: {
        jni: { ret: 'jfloat', args: ['JNIEnv*', 'jclass', 'jfieldID'] },
        retType: 'float',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'GetStaticFloatField',
        offset: 152,
    },
    GetStaticDoubleField: {
        jni: { ret: 'jdouble', args: ['JNIEnv*', 'jclass', 'jfieldID'] },
        retType: 'double',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'GetStaticDoubleField',
        offset: 153,
    },
    SetStaticObjectField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jclass', 'jfieldID', 'jobject'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'],
        name: 'SetStaticObjectField',
        offset: 154,
    },
    SetStaticBooleanField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jclass', 'jfieldID', 'jboolean'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'uint8'],
        name: 'SetStaticBooleanField',
        offset: 155,
    },
    SetStaticByteField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jclass', 'jfieldID', 'jbyte'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'int8'],
        name: 'SetStaticByteField',
        offset: 156,
    },
    SetStaticCharField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jclass', 'jfieldID', 'jchar'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'uint16'],
        name: 'SetStaticCharField',
        offset: 157,
    },
    SetStaticShortField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jclass', 'jfieldID', 'jshort'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'int16'],
        name: 'SetStaticShortField',
        offset: 158,
    },
    SetStaticIntField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jclass', 'jfieldID', 'jint'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'int32'],
        name: 'SetStaticIntField',
        offset: 159,
    },
    SetStaticLongField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jclass', 'jfieldID', 'jlong'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'int64'],
        name: 'SetStaticLongField',
        offset: 160,
    },
    SetStaticFloatField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jclass', 'jfieldID', 'jfloat'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'float'],
        name: 'SetStaticFloatField',
        offset: 161,
    },
    SetStaticDoubleField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jclass', 'jfieldID', 'jdouble'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'double'],
        name: 'SetStaticDoubleField',
        offset: 162,
    },
    NewString: {
        jni: { ret: 'jstring', args: ['JNIEnv*', 'jchar*', 'jsize'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'int32'],
        name: 'NewString',
        offset: 163,
    },
    GetStringLength: {
        jni: { ret: 'jsize', args: ['JNIEnv*', 'jstring'] },
        retType: 'int32',
        argTypes: ['pointer', 'pointer'],
        name: 'GetStringLength',
        offset: 164,
    },
    GetStringChars: {
        jni: { ret: 'jchar*', args: ['JNIEnv*', 'jstring', 'jboolean*'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'GetStringChars',
        offset: 165,
    },
    ReleaseStringChars: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jstring', 'jchar*'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'ReleaseStringChars',
        offset: 166,
    },
    NewStringUTF: {
        jni: { ret: 'jstring', args: ['JNIEnv*', 'char*'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer'],
        name: 'NewStringUTF',
        offset: 167,
    },
    GetStringUTFLength: {
        jni: { ret: 'jsize', args: ['JNIEnv*', 'jstring'] },
        retType: 'int32',
        argTypes: ['pointer', 'pointer'],
        name: 'GetStringUTFLength',
        offset: 168,
    },
    GetStringUTFChars: {
        jni: { ret: 'char*', args: ['JNIEnv*', 'jstring', 'jboolean*'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'GetStringUTFChars',
        offset: 169,
    },
    ReleaseStringUTFChars: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jstring', 'char*'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'ReleaseStringUTFChars',
        offset: 170,
    },
    GetArrayLength: {
        jni: { ret: 'jsize', args: ['JNIEnv*', 'jarray'] },
        retType: 'int32',
        argTypes: ['pointer', 'pointer'],
        name: 'GetArrayLength',
        offset: 171,
    },
    NewObjectArray: {
        jni: { ret: 'jobjectArray', args: ['JNIEnv*', 'jsize', 'jclass', 'jobject'] },
        retType: 'pointer',
        argTypes: ['pointer', 'int32', 'pointer', 'pointer'],
        name: 'NewObjectArray',
        offset: 172,
    },
    GetObjectArrayElement: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'jobjectArray', 'jsize'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'int32'],
        name: 'GetObjectArrayElement',
        offset: 173,
    },
    SetObjectArrayElement: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobjectArray', 'jsize', 'jobject'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'int32', 'pointer'],
        name: 'SetObjectArrayElement',
        offset: 174,
    },
    NewBooleanArray: {
        jni: { ret: 'jbooleanArray', args: ['JNIEnv*', 'jsize'] },
        retType: 'pointer',
        argTypes: ['pointer', 'int32'],
        name: 'NewBooleanArray',
        offset: 175,
    },
    NewByteArray: {
        jni: { ret: 'jbyteArray', args: ['JNIEnv*', 'jsize'] },
        retType: 'pointer',
        argTypes: ['pointer', 'int32'],
        name: 'NewByteArray',
        offset: 176,
    },
    NewCharArray: {
        jni: { ret: 'jcharArray', args: ['JNIEnv*', 'jsize'] },
        retType: 'pointer',
        argTypes: ['pointer', 'int32'],
        name: 'NewCharArray',
        offset: 177,
    },
    NewShortArray: {
        jni: { ret: 'jshortArray', args: ['JNIEnv*', 'jsize'] },
        retType: 'pointer',
        argTypes: ['pointer', 'int32'],
        name: 'NewShortArray',
        offset: 178,
    },
    NewIntArray: {
        jni: { ret: 'jintArray', args: ['JNIEnv*', 'jsize'] },
        retType: 'pointer',
        argTypes: ['pointer', 'int32'],
        name: 'NewIntArray',
        offset: 179,
    },
    NewLongArray: {
        jni: { ret: 'jlongArray', args: ['JNIEnv*', 'jsize'] },
        retType: 'pointer',
        argTypes: ['pointer', 'int32'],
        name: 'NewLongArray',
        offset: 180,
    },
    NewFloatArray: {
        jni: { ret: 'jfloatArray', args: ['JNIEnv*', 'jsize'] },
        retType: 'pointer',
        argTypes: ['pointer', 'int32'],
        name: 'NewFloatArray',
        offset: 181,
    },
    NewDoubleArray: {
        jni: { ret: 'jdoubleArray', args: ['JNIEnv*', 'jsize'] },
        retType: 'pointer',
        argTypes: ['pointer', 'int32'],
        name: 'NewDoubleArray',
        offset: 182,
    },
    GetBooleanArrayElements: {
        jni: { ret: 'jboolean*', args: ['JNIEnv*', 'jbooleanArray', 'jboolean*'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'GetBooleanArrayElements',
        offset: 183,
    },
    GetByteArrayElements: {
        jni: { ret: 'jbyte*', args: ['JNIEnv*', 'jbyteArray', 'jboolean*'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'GetByteArrayElements',
        offset: 184,
    },
    GetCharArrayElements: {
        jni: { ret: 'jchar*', args: ['JNIEnv*', 'jcharArray', 'jboolean*'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'GetCharArrayElements',
        offset: 185,
    },
    GetShortArrayElements: {
        jni: { ret: 'jshort*', args: ['JNIEnv*', 'jshortArray', 'jboolean*'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'GetShortArrayElements',
        offset: 186,
    },
    GetIntArrayElements: {
        jni: { ret: 'jint*', args: ['JNIEnv*', 'jintArray', 'jboolean*'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'GetIntArrayElements',
        offset: 187,
    },
    GetLongArrayElements: {
        jni: { ret: 'jlong*', args: ['JNIEnv*', 'jlongArray', 'jboolean*'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'GetLongArrayElements',
        offset: 188,
    },
    GetFloatArrayElements: {
        jni: { ret: 'jfloat*', args: ['JNIEnv*', 'jfloatArray', 'jboolean*'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'GetFloatArrayElements',
        offset: 189,
    },
    GetDoubleArrayElements: {
        jni: { ret: 'jdouble*', args: ['JNIEnv*', 'jdoubleArray', 'jboolean*'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'GetDoubleArrayElements',
        offset: 190,
    },
    ReleaseBooleanArrayElements: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jbooleanArray', 'jboolean*', 'jint'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'int32'],
        name: 'ReleaseBooleanArrayElements',
        offset: 191,
    },
    ReleaseByteArrayElements: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jbyteArray', 'jbyte*', 'jint'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'int32'],
        name: 'ReleaseByteArrayElements',
        offset: 192,
    },
    ReleaseCharArrayElements: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jcharArray', 'jchar*', 'jint'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'int32'],
        name: 'ReleaseCharArrayElements',
        offset: 193,
    },
    ReleaseShortArrayElements: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jshortArray', 'jshort*', 'jint'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'int32'],
        name: 'ReleaseShortArrayElements',
        offset: 194,
    },
    ReleaseIntArrayElements: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jintArray', 'jint*', 'jint'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'int32'],
        name: 'ReleaseIntArrayElements',
        offset: 195,
    },
    ReleaseLongArrayElements: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jlongArray', 'jlong*', 'jint'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'int32'],
        name: 'ReleaseLongArrayElements',
        offset: 196,
    },
    ReleaseFloatArrayElements: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jfloatArray', 'jfloat*', 'jint'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'int32'],
        name: 'ReleaseFloatArrayElements',
        offset: 197,
    },
    ReleaseDoubleArrayElements: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jdoubleArray', 'jdouble*', 'jint'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'int32'],
        name: 'ReleaseDoubleArrayElements',
        offset: 198,
    },
    GetBooleanArrayRegion: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jbooleanArray', 'jsize', 'jsize', 'jboolean*'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'],
        name: 'GetBooleanArrayRegion',
        offset: 199,
    },
    GetByteArrayRegion: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jbyteArray', 'jsize', 'jsize', 'jbyte*'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'],
        name: 'GetByteArrayRegion',
        offset: 200,
    },
    GetCharArrayRegion: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jcharArray', 'jsize', 'jsize', 'jchar*'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'],
        name: 'GetCharArrayRegion',
        offset: 201,
    },
    GetShortArrayRegion: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jshortArray', 'jsize', 'jsize', 'jshort*'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'],
        name: 'GetShortArrayRegion',
        offset: 202,
    },
    GetIntArrayRegion: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jintArray', 'jsize', 'jsize', 'jint*'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'],
        name: 'GetIntArrayRegion',
        offset: 203,
    },
    GetLongArrayRegion: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jlongArray', 'jsize', 'jsize', 'jlong*'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'],
        name: 'GetLongArrayRegion',
        offset: 204,
    },
    GetFloatArrayRegion: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jfloatArray', 'jsize', 'jsize', 'jfloat*'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'],
        name: 'GetFloatArrayRegion',
        offset: 205,
    },
    GetDoubleArrayRegion: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jdoubleArray', 'jsize', 'jsize', 'jdouble*'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'],
        name: 'GetDoubleArrayRegion',
        offset: 206,
    },
    SetBooleanArrayRegion: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jbooleanArray', 'jsize', 'jsize', 'jboolean*'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'],
        name: 'SetBooleanArrayRegion',
        offset: 207,
    },
    SetByteArrayRegion: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jbyteArray', 'jsize', 'jsize', 'jbyte*'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'],
        name: 'SetByteArrayRegion',
        offset: 208,
    },
    SetCharArrayRegion: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jcharArray', 'jsize', 'jsize', 'jchar*'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'],
        name: 'SetCharArrayRegion',
        offset: 209,
    },
    SetShortArrayRegion: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jshortArray', 'jsize', 'jsize', 'jshort*'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'],
        name: 'SetShortArrayRegion',
        offset: 210,
    },
    SetIntArrayRegion: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jintArray', 'jsize', 'jsize', 'jint*'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'],
        name: 'SetIntArrayRegion',
        offset: 211,
    },
    SetLongArrayRegion: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jlongArray', 'jsize', 'jsize', 'jlong*'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'],
        name: 'SetLongArrayRegion',
        offset: 212,
    },
    SetFloatArrayRegion: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jfloatArray', 'jsize', 'jsize', 'jfloat*'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'],
        name: 'SetFloatArrayRegion',
        offset: 213,
    },
    SetDoubleArrayRegion: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jdoubleArray', 'jsize', 'jsize', 'jdouble*'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'],
        name: 'SetDoubleArrayRegion',
        offset: 214,
    },
    RegisterNatives: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jclass', 'JNINativeMethod*', 'jint'] },
        retType: 'int32',
        argTypes: ['pointer', 'pointer', 'pointer', 'int32'],
        name: 'RegisterNatives',
        offset: 215,
    },
    UnregisterNatives: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jclass'] },
        retType: 'int32',
        argTypes: ['pointer', 'pointer'],
        name: 'UnregisterNatives',
        offset: 216,
    },
    MonitorEnter: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jobject'] },
        retType: 'int32',
        argTypes: ['pointer', 'pointer'],
        name: 'MonitorEnter',
        offset: 217,
    },
    MonitorExit: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jobject'] },
        retType: 'int32',
        argTypes: ['pointer', 'pointer'],
        name: 'MonitorExit',
        offset: 218,
    },
    GetJavaVM: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'JavaVM**'] },
        retType: 'int32',
        argTypes: ['pointer', 'pointer'],
        name: 'GetJavaVM',
        offset: 219,
    },
    GetStringRegion: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jstring', 'jsize', 'jsize', 'jchar*'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'],
        name: 'GetStringRegion',
        offset: 220,
    },
    GetStringUTFRegion: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jstring', 'jsize', 'jsize', 'char*'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'],
        name: 'GetStringUTFRegion',
        offset: 221,
    },
    GetPrimitiveArrayCritical: {
        jni: { ret: 'void*', args: ['JNIEnv*', 'jarray', 'jboolean*'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'GetPrimitiveArrayCritical',
        offset: 222,
    },
    ReleasePrimitiveArrayCritical: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jarray', 'void*', 'jint'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer', 'int32'],
        name: 'ReleasePrimitiveArrayCritical',
        offset: 223,
    },
    GetStringCritical: {
        jni: { ret: 'jchar*', args: ['JNIEnv*', 'jstring', 'jboolean*'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'GetStringCritical',
        offset: 224,
    },
    ReleaseStringCritical: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jstring', 'jchar*'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer', 'pointer'],
        name: 'ReleaseStringCritical',
        offset: 225,
    },
    NewWeakGlobalRef: {
        jni: { ret: 'jweak', args: ['JNIEnv*', 'jobject'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer'],
        name: 'NewWeakGlobalRef',
        offset: 226,
    },
    DeleteWeakGlobalRef: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jweak'] },
        retType: 'void',
        argTypes: ['pointer', 'pointer'],
        name: 'DeleteWeakGlobalRef',
        offset: 227,
    },
    ExceptionCheck: {
        jni: { ret: 'jboolean', args: ['JNIEnv*'] },
        retType: 'uint8',
        argTypes: ['pointer'],
        name: 'ExceptionCheck',
        offset: 228,
    },
    NewDirectByteBuffer: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'void*', 'jlong'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer', 'int64'],
        name: 'NewDirectByteBuffer',
        offset: 229,
    },
    GetDirectBufferAddress: {
        jni: { ret: 'void*', args: ['JNIEnv*', 'jobject'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer'],
        name: 'GetDirectBufferAddress',
        offset: 230,
    },
    GetDirectBufferCapacity: {
        jni: { ret: 'jlong', args: ['JNIEnv*', 'jobject'] },
        retType: 'int64',
        argTypes: ['pointer', 'pointer'],
        name: 'GetDirectBufferCapacity',
        offset: 231,
    },
    GetObjectRefType: {
        jni: { ret: 'jobjectRefType', args: ['JNIEnv*', 'jobject'] },
        retType: 'pointer',
        argTypes: ['pointer', 'pointer'],
        name: 'GetObjectRefType',
        offset: 232,
    },
};
function convertToFrida(type) {
    if (type.includes('*'))
        return 'pointer';
    if (type.endsWith('Array'))
        return 'pointer';
    switch (type) {
        case 'void':
            return 'void';
        case 'jboolean':
            return 'uint8';
        case 'jbyte':
            return 'int8';
        case 'jchar':
            return 'uint16';
        case 'jshort':
            return 'int16';
        case 'jint':
        case 'jsize':
            return 'int32';
        case 'jlong':
            return 'int64';
        case 'jfloat':
            return 'float';
        case 'jdouble':
            return 'double';
        case 'jthrowable':
        case 'jclass':
        case 'jstring':
        case 'jarray':
        case 'jweak':
        case 'jobject':
            return 'pointer';
        case 'jfieldID':
        case 'jmethodID':
        case 'jobjectRefType':
        case 'va_list':
        case '...':
            return 'pointer';
    }
    throw new Error(`convert: illegal type ${type}`);
}
function asFunction(base, def) {
    const ptr = base.add(def.offset * Process.pointerSize);
    const fn = new NativeFunction(ptr.readPointer(), def.retType, def.argTypes);
    return fn;
}

//# sourceMappingURL=jni.js.map

/***/ }),

/***/ "./packages/jnitrace/dist/jniEnvInterceptor.js":
/*!*****************************************************!*\
  !*** ./packages/jnitrace/dist/jniEnvInterceptor.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   JNIEnvInterceptor: () => (/* binding */ JNIEnvInterceptor)
/* harmony export */ });
/* harmony import */ var _tracer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tracer.js */ "./packages/jnitrace/dist/tracer.js");

const UNION_SIZE = 8;
const METHOD_ID_INDEX = 2;
const NON_VIRTUAL_METHOD_ID_INDEX = 3;
class JNIEnvInterceptor {
    constructor() { }
    getCallMethodArgs(caller, args, isStatic) {
        let methodIndex = METHOD_ID_INDEX;
        if (caller.includes('Nonvirtual')) {
            methodIndex = NON_VIRTUAL_METHOD_ID_INDEX;
        }
        if (caller.endsWith('jmethodIDz'))
            return [];
        if (!caller.endsWith('va_list') && !caller.endsWith('jvalue')) {
            return null;
        }
        const jMethodId = args[methodIndex];
        const isVaList = caller.endsWith('va_list');
        // ? todo do better, confusing flow
        const jMethod = (0,_tracer_js__WEBPACK_IMPORTED_MODULE_0__.resolveMethod)(jMethodId, isStatic);
        if (!jMethod) {
            console.error('[JniEnvInterceptor]', 'Method not found for id:', jMethodId);
            return null;
        }
        const callArgs = [];
        const callArgsPtr = args[args.length - 1];
        if (isVaList)
            this.setUpVaListArgExtract(callArgsPtr);
        for (let i = 0; i < jMethod.javaParams.length; i++) {
            const type = jMethod.javaParams[i];
            let value;
            if (isVaList) {
                const currentPtr = this.extractVaListArgValue(jMethod, i);
                value = this.readValue(currentPtr, type, true);
            }
            else {
                value = this.readValue(callArgsPtr.add(UNION_SIZE * i), type);
            }
            callArgs.push(value);
        }
        if (isVaList)
            this.resetVaListArgExtract();
        return callArgs;
    }
    readValue(currentPtr, type, extend) {
        let value;
        switch (type) {
            case 'boolean': {
                value = currentPtr.readU8();
                break;
            }
            case 'byte': {
                value = currentPtr.readS8();
                break;
            }
            case 'char': {
                value = currentPtr.readU16();
                break;
            }
            case 'short': {
                value = currentPtr.readS16();
                break;
            }
            case 'int': {
                value = currentPtr.readS32();
                break;
            }
            case 'long': {
                value = currentPtr.readS64();
                break;
            }
            case 'double': {
                value = currentPtr.readDouble();
                break;
            }
            case 'float': {
                value = extend === true ? currentPtr.readDouble() : currentPtr.readFloat();
                break;
            }
            case 'pointer':
            default: {
                value = currentPtr.readPointer();
                break;
            }
        }
        return value;
    }
}

//# sourceMappingURL=jniEnvInterceptor.js.map

/***/ }),

/***/ "./packages/jnitrace/dist/jniEnvInterceptorArm64.js":
/*!**********************************************************!*\
  !*** ./packages/jnitrace/dist/jniEnvInterceptorArm64.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   JNIEnvInterceptorARM64: () => (/* binding */ JNIEnvInterceptorARM64)
/* harmony export */ });
/* harmony import */ var _jniEnvInterceptor_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./jniEnvInterceptor.js */ "./packages/jnitrace/dist/jniEnvInterceptor.js");

class JNIEnvInterceptorARM64 extends _jniEnvInterceptor_js__WEBPACK_IMPORTED_MODULE_0__.JNIEnvInterceptor {
    stack = NULL;
    stackIndex = 0;
    grTop = NULL;
    vrTop = NULL;
    grOffs = 0;
    grOffsIndex = 0;
    vrOffs = 0;
    vrOffsIndex = 0;
    constructor() {
        super();
    }
    setUpVaListArgExtract(vaList) {
        const vrStart = 2;
        const grOffset = 3;
        const vrOffset = 4;
        this.stack = vaList.readPointer();
        this.stackIndex = 0;
        this.grTop = vaList.add(Process.pointerSize).readPointer();
        this.vrTop = vaList.add(Process.pointerSize * vrStart).readPointer();
        this.grOffs = vaList.add(Process.pointerSize * grOffset).readS32();
        this.grOffsIndex = 0;
        this.vrOffs = vaList.add(Process.pointerSize * grOffset + vrOffset).readS32();
        this.vrOffsIndex = 0;
    }
    extractVaListArgValue(method, paramId) {
        const MAX_VR_REG_NUM = 8;
        const VR_REG_SIZE = 2;
        const MAX_GR_REG_NUM = 4;
        let currentPtr = NULL;
        if (method.javaParams[paramId] === 'float' || method.javaParams[paramId] === 'double') {
            if (this.vrOffsIndex < MAX_VR_REG_NUM) {
                currentPtr = this.vrTop.add(this.vrOffs).add(this.vrOffsIndex * Process.pointerSize * VR_REG_SIZE);
                this.vrOffsIndex++;
            }
            else {
                currentPtr = this.stack.add(this.stackIndex * Process.pointerSize);
                this.stackIndex++;
            }
        }
        else {
            if (this.grOffsIndex < MAX_GR_REG_NUM) {
                currentPtr = this.grTop.add(this.grOffs).add(this.grOffsIndex * Process.pointerSize);
                this.grOffsIndex++;
            }
            else {
                currentPtr = this.stack.add(this.stackIndex * Process.pointerSize);
                this.stackIndex++;
            }
        }
        return currentPtr;
    }
    resetVaListArgExtract() {
        this.stack = NULL;
        this.stackIndex = 0;
        this.grTop = NULL;
        this.vrTop = NULL;
        this.grOffs = 0;
        this.grOffsIndex = 0;
        this.vrOffs = 0;
        this.vrOffsIndex = 0;
    }
}

//# sourceMappingURL=jniEnvInterceptorArm64.js.map

/***/ }),

/***/ "./packages/jnitrace/dist/jniMethod.js":
/*!*********************************************!*\
  !*** ./packages/jnitrace/dist/jniMethod.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   JNIMethod: () => (/* binding */ JNIMethod)
/* harmony export */ });
class JNIMethod {
    name;
    address;
    constructor(name, address) {
        this.name = name;
        this.address = address;
    }
}

//# sourceMappingURL=jniMethod.js.map

/***/ }),

/***/ "./packages/jnitrace/dist/tracer.js":
/*!******************************************!*\
  !*** ./packages/jnitrace/dist/tracer.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fastpathMethod: () => (/* binding */ fastpathMethod),
/* harmony export */   resolveMethod: () => (/* binding */ resolveMethod)
/* harmony export */ });
/* harmony import */ var _clockwork_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @clockwork/common */ "./packages/common/dist/index.js");
/* harmony import */ var _javaMethod_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./javaMethod.js */ "./packages/jnitrace/dist/javaMethod.js");
/* harmony import */ var _jni_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./jni.js */ "./packages/jnitrace/dist/jni.js");



const Cache = {
    storage: new Map(),
    staticStorage: new Map(),
    get(jMethodId, isStatic) {
        const key = typeof jMethodId === 'string' ? jMethodId : jMethodId.toString();
        return (isStatic ? this.staticStorage : this.storage).get(key) ?? null;
    },
    set(jMethodId, method) {
        const key = typeof jMethodId === 'string' ? jMethodId : jMethodId.toString();
        (method.isStatic ? this.staticStorage : this.storage).set(key, method);
        return method;
    },
};
let cachedBase = null;
let FindClass = null;
let ToReflectedMethod = null;
let getDeclaringClassDesc = null;
const PrimitiveTypes = {
    Z: 'boolean',
    B: 'byte',
    C: 'char',
    D: 'double',
    F: 'float',
    I: 'int',
    J: 'long',
    S: 'short',
    V: 'void',
};
function prettyMethod(methodId, withSignature) {
    const result = new _clockwork_common__WEBPACK_IMPORTED_MODULE_0__.Std.String();
    //@ts-ignore
    Java.api['art::ArtMethod::PrettyMethod'](result, methodId, withSignature ? 1 : 0);
    return result.disposeToString();
}
function resolveMethod(methodId, isStatic) {
    let method = Cache.get(methodId, isStatic);
    if (method)
        return method;
    const env = Java.vm.tryGetEnv();
    if (!env)
        return null;
    if (cachedBase === null)
        cachedBase = env.handle.readPointer();
    if (FindClass === null && cachedBase)
        FindClass = (0,_jni_js__WEBPACK_IMPORTED_MODULE_2__.asFunction)(cachedBase, _jni_js__WEBPACK_IMPORTED_MODULE_2__.JNI.FindClass);
    if (ToReflectedMethod === null && cachedBase)
        ToReflectedMethod = (0,_jni_js__WEBPACK_IMPORTED_MODULE_2__.asFunction)(cachedBase, _jni_js__WEBPACK_IMPORTED_MODULE_2__.JNI.ToReflectedMethod);
    if (getDeclaringClassDesc === null) {
        const getDeclaringClassDescSym = Process.getModuleByName('libart.so')
            .enumerateSymbols()
            .filter((x) => x.name.includes('DeclaringClassDesc'))[0];
        getDeclaringClassDesc = new NativeFunction(getDeclaringClassDescSym.address, 'pointer', ['pointer'], { exceptions: 'propagate' });
    }
    const thisSigPtr = getDeclaringClassDesc(methodId);
    let thisSig = thisSigPtr.readCString();
    thisSig = thisSig?.startsWith('L') && thisSig.endsWith(';') ? thisSig.substring(1, thisSig.length - 1) : thisSig;
    thisSig = thisSig?.replaceAll('/', '.') ?? thisSig;
    const cls = thisSig ? (0,_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.findClass)(thisSig) : null;
    if (!thisSig || !cls)
        return null;
    let matched = null;
    (0,_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.enumerateMembers)(cls, {
        onMatchMethod(clazz, member) {
            for (const overload of clazz[member]._o) {
                if (`${overload.handle}` == `${methodId}`) {
                    matched = overload;
                    method = new _javaMethod_js__WEBPACK_IMPORTED_MODULE_1__.JavaMethod(thisSig ?? '', member, overload.argumentTypes.map((x) => x.className), overload.returnType.className, isStatic);
                    return Cache.set(methodId, method);
                }
            }
        },
    });
    return null;
    // const ptr = Memory.allocUtf8String(thisSig);
    // const jniClassHandle = FindClass?.(env, ptr);
    // const jniMethodReflect = ToReflectedMethod?.(env, jniClassHandle, methodId, isStatic ? 1 : 0);
    // const method = Java.cast(jniMethodReflect, Classes.Method);
    // return new JavaMethod('', '', '', false);
}
function fastpathMethod(methodId, className, name, sig, isStatic) {
    let txt = sig;
    let isArray = false;
    let isOpen = null;
    const arr = [];
    const adder = (raw) => {
        if (raw.length === 1) {
            raw = PrimitiveTypes[raw];
        }
        else {
            raw = raw.replaceAll('/', '.');
        }
        raw = isArray ? `${raw}[]` : raw;
        isArray = false;
        arr.push(raw);
    };
    for (let i = 0; i < txt.length; i++) {
        const c = txt.charAt(i);
        if (c === '[') {
            isArray = true;
            continue;
        }
        if (!isOpen && c === 'L') {
            isOpen = i + 1;
            continue;
        }
        if (isOpen && c === ';') {
            adder(txt.substring(isOpen, i));
            isOpen = null;
            continue;
        }
        if (!isOpen && c in PrimitiveTypes) {
            adder(c);
            continue;
        }
    }
    const ret = arr.pop();
    const method = new _javaMethod_js__WEBPACK_IMPORTED_MODULE_1__.JavaMethod(className, name, arr, ret, isStatic);
    return Cache.set(methodId, method);
}
var thunkPage, thunkOffset;
function makeThunk(size, write) {
    if (!thunkPage) {
        thunkPage = Memory.alloc(Process.pageSize);
    }
    const thunk = thunkPage.add(thunkOffset);
    const arch = Process.arch;
    const Writer = Arm64Writer;
    Memory.patchCode(thunk, size, (code) => {
        const writer = new Writer(code, { pc: thunk });
        write(writer);
        writer.flush();
        if (writer.offset > size) {
            throw new Error(`Wrote ${writer.offset}, exceeding maximum of ${size}`);
        }
    });
    thunkOffset += size;
    return arch === 'arm' ? thunk.or(1) : thunk;
}
function makeCxxMethodWrapperReturningStdStringByValue(impl, argTypes) {
    let thunk = makeThunk(32, (writer) => {
        writer.putMovRegReg('x8', 'x0');
        argTypes.forEach((t, i) => {
            writer.putMovRegReg(`x${i}`, `x${i + 1}`);
        });
        writer.putLdrRegAddress('x7', impl);
        writer.putBrReg('x7');
    });
    const invokeThunk = new NativeFunction(thunk, 'void', ['pointer'].concat(argTypes), { exceptions: 'propagate' });
    const wrapper = function (...args) {
        invokeThunk(...args);
    };
    wrapper.handle = thunk;
    wrapper.impl = impl;
    return wrapper;
}
function makeCxxMethodWrapperReturningPointerByValueGeneric(address, argTypes) {
    return new NativeFunction(address, 'pointer', argTypes, { exceptions: 'propagate' });
}
function atleasttry() {
    resolveMethod(_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.Classes.String.concat.handle, false);
    // const base = Java.vm.getEnv().handle.readPointer();
    // const GetMethodID = asFunction(base, 'GetMethodID');
    // console.warn('GetMethodID', GetMethodID);
    // Interceptor.attach(GetMethodID, {
    //     onEnter(args) {},
    //     onLeave(retval) {
    //         //console.log('on methodId', retval);
    //     },
    // });
    // const RegisterNatives = asFunction(base, 'RegisterNatives');
    // console.warn('RegisterNatives', RegisterNatives);
    // Interceptor.attach(RegisterNatives, {
    //     onEnter(args) {},
    //     onLeave(retval) {
    //         console.log('on RegisterNatives', retval);
    //     },
    // });
    // const FindClass = asFunction(base, 'FindClass');
    // const ToReflectedMethod = asFunction(base, 'ToReflectedMethod');
    // // methodId -> char *
    // const getDeclaringClassDesc = Process.getModuleByName('libart.so')
    //     .enumerateSymbols()
    //     .filter((x) => x.name.includes('DeclaringClassDesc'))[0];
    // const decClassDesc = makeCxxMethodWrapperReturningPointerByValueGeneric(getDeclaringClassDesc.address, ['pointer']);
    // // // methodId -> char *
    // const getSignatureSym = Process.getModuleByName('libart.so')
    //     .enumerateSymbols()
    //     .filter((x) => x.name.includes('_ZN3art9ArtMethod12GetSignatureEv'))[0];
    // const getSignature = makeCxxMethodWrapperReturningPointerByValueGeneric(getSignatureSym.address, ['pointer']);
    // const signatureToStringSym = Process.getModuleByName('libart.so')
    //     .enumerateSymbols()
    //     .filter((x) => x.name.includes('_ZNK3art9Signature8ToStringEv'))[0];
    // const sigToStr = makeCxxMethodWrapperReturningStdStringByValue(signatureToStringSym.address, ['pointer']);
    // (rpc as any).decClassDesc = decClassDesc;
    // (rpc as any).getSignature = getSignature;
    // (rpc as any).prettyMethod = prettyMethod;
    // (rpc as any).sigToStr = sigToStr;
    let w, h;
    const cleanup = (str) => {
        str = str.startsWith('L') && str.endsWith(';') ? str.substring(1, str.length - 1) : str;
        return str.replaceAll('/', '.');
    };
    // console.warn('begin:', (w = Java.use('java.lang.String')));
    // console.warn('begin:', (w = w.substring._o[1]));
    // console.warn('begin:', (h = w.handle));
    // console.warn('begin:', (w = (decClassDesc as any)(h)));
    // console.warn('begin:', (w = w.readCString()));
    // console.warn('begin:', (w = Memory.allocUtf8String(cleanup(w))));
    // console.warn('begin:', w.readCString());
    // console.warn('begin:', (w = (FindClass as any)(Java.vm.getEnv(), w)));
    // console.warn('begin:', (w = (ToReflectedMethod as any)(Java.vm.getEnv(), w, h, 0)));
    // console.warn('begin:', (w = (ToReflectedMethod as any)(Java.vm.getEnv(), w, h, 1)));
    // console.warn('begin:', (w = Java.cast(w, Java.use('java.lang.reflect.Method'))))_;
    // console.warn('begin:', w = (getSignature as any)(h))
    // console.warn('begin:', w = (sigToStr as any)(w))
}

//# sourceMappingURL=tracer.js.map

/***/ }),

/***/ "./packages/logging/dist/autocolor.js":
/*!********************************************!*\
  !*** ./packages/logging/dist/autocolor.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getColor: () => (/* binding */ getColor)
/* harmony export */ });
/* harmony import */ var _color_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./color.js */ "./packages/logging/dist/color.js");

const colors = (0,_color_js__WEBPACK_IMPORTED_MODULE_0__.use)();
const array = [colors.red, colors.green, colors.yellow, colors.blue, colors.magenta, colors.cyan, colors.gray];
const colormap = new Map();
colormap.set('encrypt', colors.blueBright);
colormap.set('decrypt', colors.redBright);
function getColor(tag) {
    let roll = colormap.get(tag);
    if (roll)
        return roll;
    const hash = hashCode(tag);
    roll = array[Math.abs(hash % array.length)];
    colormap.set(tag, roll);
    return roll;
}
function hashCode(str) {
    let hash = 0, i, chr;
    if (str.length === 0)
        return hash;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
    }
    return hash;
}

//# sourceMappingURL=autocolor.js.map

/***/ }),

/***/ "./packages/logging/dist/color.js":
/*!****************************************!*\
  !*** ./packages/logging/dist/color.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   args: () => (/* binding */ args),
/* harmony export */   bracket: () => (/* binding */ bracket),
/* harmony export */   className: () => (/* binding */ className),
/* harmony export */   method: () => (/* binding */ method),
/* harmony export */   number: () => (/* binding */ number),
/* harmony export */   string: () => (/* binding */ string),
/* harmony export */   url: () => (/* binding */ url),
/* harmony export */   use: () => (/* binding */ use)
/* harmony export */ });
/* harmony import */ var colorette__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! colorette */ "./node_modules/colorette/index.js");

const Colors = (0,colorette__WEBPACK_IMPORTED_MODULE_0__.createColors)({ useColor: true });
const { cyan, green, blue, underline, yellow, magenta } = use();
function use() {
    return Colors;
}
const className = (className) => {
    if (!className)
        return className;
    const splits = `${className}`.split('.');
    return splits.map(cyan).join('.');
};
const method = (methodName) => {
    if (!methodName)
        return methodName;
    return green(`${methodName}`);
};
const args = (args) => {
    if (args.length === 0)
        return '';
    const joinBy =  true ? ', \n' : 0;
    const joined = args.map((arg) => `    ${arg}`).join(joinBy);
    return `\n${joined}\n`;
};
const bracket = (char) => {
    if (!char)
        return char;
    return blue(`${char}`);
};
const url = (url) => {
    return underline(`${url}`);
};
const string = (string) => {
    return yellow(`"${string}"`);
};
const number = (number) => {
    return magenta(`${number}`);
};

//# sourceMappingURL=color.js.map

/***/ }),

/***/ "./packages/logging/dist/filter.js":
/*!*****************************************!*\
  !*** ./packages/logging/dist/filter.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Filter: () => (/* binding */ Filter)
/* harmony export */ });
/* harmony import */ var _clockwork_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @clockwork/common */ "./packages/common/dist/index.js");

const prefsMeasurementInternalIgnored = [
    'consent_settings',
    'consent_source',
    'last_upload_attempt',
    'backoff',
    'midnight_offset',
    'last_upload',
    'last_delete_stale',
    'health_monitor:start',
    'health_monitor:count',
    'app_backgrounded',
    'start_new_session',
    'deferred_analytics_collection',
    'measurement_enabled',
    'default_event_parameters',
    'session_timeout',
    'previous_os_version',
    'use_service',
    'deferred_attribution_cache_timestamp',
    'first_open_time',
];
const applovinPrivacyIgnored = [
    'com.applovin.sdk.compliance.has_user_consent',
    'com.applovin.sdk.compliance.is_age_restricted_user',
    'com.applovin.sdk.compliance.is_do_not_sell'
];
const Filter = {
    json: (_, ...args) => {
        let trace = (0,_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.stacktrace)();
        trace = trace.substring(trace.indexOf('\n'));
        if (trace.includes('at org.json.JSONObject.get'))
            return false;
        if (trace.includes('at org.json.JSONObject.opt'))
            return false;
        if (trace.includes('at com.facebook.internal.'))
            return false;
        if (trace.includes('at com.google.android.gms.internal.ads.'))
            return false;
        if (trace.includes('at com.google.firebase.installations.local.PersistedInstallation'))
            return false;
        if (trace.includes('at com.unity3d.services.core.configuration.PrivacyConfigurationLoader'))
            return false;
        return true;
    },
    prefs: (method, ...args) => {
        const trace = (0,_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.stacktrace)();
        if (trace.includes('at com.yandex.mobile.ads.core.initializer.MobileAdsInitializeProvider.'))
            return false;
        if (trace.includes('at com.facebook.FacebookSdk.getLimitEventAndDataUsage'))
            return false;
        if (trace.includes('at com.facebook.internal.'))
            return false;
        if (trace.includes('at com.appsflyer.internal.'))
            return false;
        if (trace.includes('at com.onesignal.OneSignalPrefs.'))
            return false;
        if (trace.includes('at com.google.android.gms.internal.ads.'))
            return false;
        if (trace.includes('at com.google.android.gms.internal.appset'))
            return false;
        if (trace.includes('at com.google.android.gms.measurement.internal.')) {
            if (args[0] && prefsMeasurementInternalIgnored.includes(args[0])) {
                return false;
            }
        }
        if (trace.includes('at com.google.firebase.heartbeatinfo.DefaultHeartBeatController.')) {
            if (args[0] && ['last-used-date'].includes(args[0])) {
                return false;
            }
        }
        if (trace.includes('at com.applovin.impl.privacy.a')) {
            if (args[0] && applovinPrivacyIgnored.includes(args[0])) {
                return false;
            }
        }
        if (trace.includes('at com.applovin.sdk.AppLovinSdk.getInstance') && trace.includes('at com.applovin.impl.sdk.')) {
            if (args[0] && args[0].startsWith('com.applovin.sdk.')) {
                if (method.methodName === 'contains') {
                    return false;
                }
            }
        }
        return true;
    },
    url: () => {
        const trace = (0,_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.stacktrace)();
        if (trace.includes('at com.facebook.internal.'))
            return false;
        if (trace.includes('at com.appsflyer.internal.'))
            return false;
        if (trace.includes('at com.onesignal.OneSignalPrefs.'))
            return false;
        if (trace.includes('at com.google.android.gms.internal.ads.'))
            return false;
        console.log(trace);
        return true;
    },
    date: () => {
        let trace = (0,_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.stacktrace)();
        trace = trace.substring(trace.indexOf('\n'));
        if (trace.includes('at com.facebook.FacebookSdk.getGraphApiVersion('))
            return false;
        if (trace.includes('at com.safedk.android.utils.SdksMapping.printAllSdkVersions'))
            return false;
        if (trace.includes('at com.applovin.sdk.AppLovinInitProvider.onCreate'))
            return false;
        if (trace.includes('at com.google.firebase.provider.FirebaseInitProvider.onCreate'))
            return false;
        if (trace.includes('at com.google.firebase.crashlytics.CrashlyticsRegistrar'))
            return false;
        if (trace.includes('at com.facebook.appevents.internal.') && trace.includes('at android.icu.util.Currency.getAvailableCurrencyCodes'))
            return false;
        // console.log(trace)
        return true;
    }
};

//# sourceMappingURL=filter.js.map

/***/ }),

/***/ "./packages/logging/dist/index.js":
/*!****************************************!*\
  !*** ./packages/logging/dist/index.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Color: () => (/* reexport module object */ _color_js__WEBPACK_IMPORTED_MODULE_2__),
/* harmony export */   Filter: () => (/* reexport safe */ _filter_js__WEBPACK_IMPORTED_MODULE_3__.Filter),
/* harmony export */   error: () => (/* binding */ error),
/* harmony export */   log: () => (/* binding */ log),
/* harmony export */   logger: () => (/* binding */ logger),
/* harmony export */   subLogger: () => (/* binding */ subLogger)
/* harmony export */ });
/* harmony import */ var pino__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pino */ "./node_modules/pino/browser.js");
/* harmony import */ var _autocolor_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./autocolor.js */ "./packages/logging/dist/autocolor.js");
/* harmony import */ var _color_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./color.js */ "./packages/logging/dist/color.js");
/* harmony import */ var _filter_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./filter.js */ "./packages/logging/dist/filter.js");




const logger = (0,pino__WEBPACK_IMPORTED_MODULE_0__.pino)({
    browser: {
        write: (o) => {
            const msg = o['msg'], level = o['level'], tag = o['tag'], id = o['id'];
            let print = `${msg}`;
            if (tag) {
                const color = (0,_autocolor_js__WEBPACK_IMPORTED_MODULE_1__.getColor)(tag);
                const ctag = `[${color(`${tag}`)}${id ? ':' + id : ''}] `;
                print = `${msg}`.replaceAll(/^/g, ctag);
            }
            if (print)
                console.log(print);
        },
    },
});
function log(message, ...optionalParams) {
    logger.info(message, ...optionalParams);
}
function error(message) {
    logger.error(message);
}
function subLogger(tag) {
    return logger.child({ tag: tag });
}

//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./packages/native/dist/hooah.js":
/*!***************************************!*\
  !*** ./packages/native/dist/hooah.js ***!
  \***************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HooahTrace: () => (/* binding */ HooahTrace)
/* harmony export */ });
/* harmony import */ var _inject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./inject.js */ "./packages/native/dist/inject.js");

var Utils;
(function (Utils) {
    const callMnemonics = ['call', 'bl', 'blx', 'blr', 'bx'];
    Utils.insertAt = (str, sub, pos) => `${str.slice(0, pos)}${sub}${str.slice(pos)}`;
    function ba2hex(b) {
        let uint8arr = new Uint8Array(b);
        if (!uint8arr) {
            return '';
        }
        let hexStr = '';
        for (let i = 0; i < uint8arr.length; i++) {
            let hex = (uint8arr[i] & 0xff).toString(16);
            hex = hex.length === 1 ? '0' + hex : hex;
            hexStr += hex;
        }
        return hexStr;
    }
    Utils.ba2hex = ba2hex;
    function getSpacer(space) {
        if (space < 0)
            return '';
        return ' '.repeat(space);
    }
    Utils.getSpacer = getSpacer;
    function isCallInstruction(instruction) {
        return callMnemonics.indexOf(instruction.mnemonic) >= 0;
    }
    Utils.isCallInstruction = isCallInstruction;
    function isJumpInstruction(instruction) {
        return instruction.groups.indexOf('jump') >= 0 || instruction.groups.indexOf('ret') >= 0;
    }
    Utils.isJumpInstruction = isJumpInstruction;
    function isRetInstruction(instuction) {
        return instuction.groups.indexOf('return') >= 0;
    }
    Utils.isRetInstruction = isRetInstruction;
})(Utils || (Utils = {}));
var Color;
(function (Color) {
    const _red = '\x1b[0;31m';
    const _green = '\x1b[0;32m';
    const _yellow = '\x1b[0;33m';
    const _blue = '\x1b[0;34m';
    const _pink = '\x1b[0;35m';
    const _cyan = '\x1b[0;36m';
    const _bold = '\x1b[0;1m';
    const _highlight = '\x1b[0;3m';
    const _highlight_off = '\x1b[0;23m';
    const _resetColor = '\x1b[0m';
    function applyColorFilters(text) {
        text = text.toString();
        text = text.replace(/(\W|^)([a-z]{1,4}\d{0,2})(\W|$)/gm, '$1' + colorify('$2', 'blue') + '$3');
        text = text.replace(/(0x[0123456789abcdef]+)/gm, colorify('$1', 'red'));
        text = text.replace(/#(\d+)/gm, '#' + colorify('$1', 'red'));
        return text;
    }
    Color.applyColorFilters = applyColorFilters;
    function colorify(what, pat) {
        if (pat === 'filter') {
            return applyColorFilters(what);
        }
        let ret = '';
        if (pat.indexOf('red') >= 0) {
            ret += _red;
        }
        else if (pat.indexOf('green') >= 0) {
            ret += _green;
        }
        else if (pat.indexOf('yellow') >= 0) {
            ret += _yellow;
        }
        else if (pat.indexOf('blue') >= 0) {
            ret += _blue;
        }
        else if (pat.indexOf('pink') >= 0) {
            ret += _pink;
        }
        else if (pat.indexOf('cyan') >= 0) {
            ret += _cyan;
        }
        if (pat.indexOf('bold') >= 0) {
            ret += _bold;
        }
        else if (pat.indexOf('highlight') >= 0) {
            ret += _highlight;
        }
        ret += what;
        if (pat.indexOf('highlight') >= 0) {
            ret += _highlight_off;
        }
        ret += _resetColor;
        return ret;
    }
    Color.colorify = colorify;
})(Color || (Color = {}));
var HooahTrace;
(function (HooahTrace) {
    const getSpacer = Utils.getSpacer;
    const treeTrace = [];
    let targetTid = 0;
    let onInstructionCallback = null;
    let moduleMap = new ModuleMap();
    let filtersModuleMap = null;
    const currentExecutionBlockStackRegisters = [];
    const currentExecutionBlock = [];
    let currentBlockStartWidth = 0;
    let currentBlockMaxWidth = 0;
    let hitRetInstruction = false;
    let sessionPrintBlocks = true;
    let sessionPrintOptions;
    let sessionPrevSepCount = 0;
    function trace(params = {}, callback) {
        if (targetTid > 0) {
            console.log('Hooah is already tracing thread: ' + targetTid);
            return 1;
        }
        if (targetTid > 0) {
            console.log('Hooah is already tracing thread: ' + targetTid);
            return;
        }
        const { printBlocks = true, count = -1, filterModules = [], instructions = [], printOptions = {} } = params;
        sessionPrintBlocks = printBlocks;
        sessionPrintOptions = printOptions;
        if (sessionPrintOptions.treeSpaces && sessionPrintOptions.treeSpaces < 4) {
            sessionPrintOptions.treeSpaces = 4;
        }
        targetTid = Process.getCurrentThreadId();
        if (callback) {
            onInstructionCallback = callback;
        }
        else {
            onInstructionCallback = null;
        }
        moduleMap.update();
        filtersModuleMap = new ModuleMap((module) => {
            // do not follow frida agent
            if (module.name.includes('frida-agent') || module.name.includes('hluda-agent')) {
                return true;
            }
            let found = false;
            filterModules.forEach((filter) => {
                if (module.name.indexOf(filter) >= 0) {
                    found = true;
                }
            });
            return found;
        });
        _inject_js__WEBPACK_IMPORTED_MODULE_0__.Inject.afterInitArray(() => {
            moduleMap.update();
            if (filtersModuleMap) {
                filtersModuleMap.update();
            }
        });
        let instructionsCount = 0;
        let startAddress = NULL;
        Stalker.follow(targetTid, {
            transform: function (iterator) {
                let instruction;
                let moduleFilterLocker = false;
                while ((instruction = iterator.next()) !== null) {
                    currentExecutionBlockStackRegisters.length = 0;
                    if (moduleFilterLocker) {
                        iterator.keep();
                        continue;
                    }
                    if (filtersModuleMap && filtersModuleMap.has(instruction.address)) {
                        moduleFilterLocker = true;
                    }
                    if (!moduleFilterLocker) {
                        // basically skip the first block of code (from frida)
                        if (startAddress.compare(NULL) === 0) {
                            startAddress = instruction.address;
                            moduleFilterLocker = true;
                        }
                        else {
                            if (instructions.length > 0 && instructions.indexOf(instruction.mnemonic) < 0) {
                                iterator.keep();
                                continue;
                            }
                            iterator.putCallout(onHitInstruction);
                        }
                    }
                    if (count > 0) {
                        instructionsCount++;
                        if (instructionsCount === count) {
                            stop();
                        }
                    }
                    iterator.keep();
                }
            },
        });
        return 0;
    }
    HooahTrace.trace = trace;
    function stop() {
        Stalker.unfollow(targetTid);
        filtersModuleMap = null;
        onInstructionCallback = null;
        treeTrace.length = 0;
        targetTid = 0;
        currentExecutionBlockStackRegisters.length = 0;
        currentExecutionBlock.length = 0;
        currentBlockMaxWidth = 0;
        sessionPrevSepCount = 0;
    }
    HooahTrace.stop = stop;
    function onHitInstruction(context) {
        const address = context.pc;
        const instruction = Instruction.parse(address);
        const treeTraceLength = treeTrace.length;
        if (onInstructionCallback !== null) {
            if (hitRetInstruction) {
                hitRetInstruction = false;
                if (treeTraceLength > 0) {
                    treeTrace.pop();
                }
            }
            onInstructionCallback.apply({}, [context, instruction]);
            if (sessionPrintBlocks) {
                const { details = false, colored = false, treeSpaces = 4 } = sessionPrintOptions;
                const isCall = Utils.isCallInstruction(instruction);
                const isJump = Utils.isJumpInstruction(instruction);
                const isRet = Utils.isRetInstruction(instruction);
                const printInfo = formatInstruction(context, address, instruction, details, colored, treeSpaces, isJump);
                currentExecutionBlock.push(printInfo);
                if (isJump || isRet) {
                    if (currentExecutionBlock.length > 0) {
                        blockifyBlock(details);
                    }
                    currentExecutionBlock.length = 0;
                    currentBlockMaxWidth = 0;
                }
                if (isCall) {
                    treeTrace.push(instruction.next);
                }
                else if (isRet) {
                    hitRetInstruction = true;
                }
            }
        }
    }
    function blockifyBlock(details) {
        const divMod = currentBlockMaxWidth % 8;
        if (divMod !== 0) {
            currentBlockMaxWidth -= divMod;
            currentBlockMaxWidth += 8;
        }
        const realLineWidth = currentBlockMaxWidth - currentBlockStartWidth;
        const startSpacer = Utils.getSpacer(currentBlockStartWidth + 1);
        let sepCount = (realLineWidth + 8) / 4;
        const topSep = ' _'.repeat(sepCount).substring(1);
        const botSep = ' \u00AF'.repeat(sepCount).substring(1);
        const nextSepCount = currentBlockStartWidth + 1 + botSep.length;
        const emptyLine = formatLine({ data: ' '.repeat(currentBlockMaxWidth), lineLength: currentBlockMaxWidth });
        let topMid = ' ';
        if (sessionPrevSepCount > 0) {
            topMid = '|';
            const sepDiff = sessionPrevSepCount - nextSepCount;
            if (sepDiff < 0) {
                const spacer = Utils.getSpacer(sessionPrevSepCount);
                if (details) {
                    console.log(spacer + '|');
                }
                console.log(spacer + '|' + '_ '.repeat(-sepDiff / 2));
                console.log(spacer + Utils.getSpacer(-sepDiff) + '|');
            }
            else if (sepDiff > 0) {
                const spacer = Utils.getSpacer(nextSepCount);
                console.log(spacer + '|' + '\u00AF '.repeat(sepDiff / 2));
                if (details) {
                    console.log(spacer + '|');
                }
            }
        }
        console.log(startSpacer + topSep + topMid + topSep);
        currentExecutionBlock.forEach((printInfo) => {
            if (details && printInfo.details) {
                console.log(emptyLine);
                printInfo.details.forEach((detailPrintInfo) => {
                    console.log(formatLine(detailPrintInfo));
                });
            }
            console.log(formatLine(printInfo));
            if (details) {
                if (printInfo.postDetails) {
                    printInfo.postDetails.forEach((postPrintInfo) => {
                        console.log(formatLine(postPrintInfo));
                    });
                }
                console.log(emptyLine);
            }
        });
        console.log(startSpacer + botSep + '|' + botSep);
        sessionPrevSepCount = nextSepCount;
        console.log(Utils.getSpacer(sessionPrevSepCount) + '|');
        if (details) {
            console.log(Utils.getSpacer(sessionPrevSepCount) + '|');
        }
    }
    function formatLine(printInfo) {
        let toPrint = printInfo.data;
        toPrint = Utils.insertAt(toPrint, '|    ', currentBlockStartWidth);
        toPrint += Utils.getSpacer(currentBlockMaxWidth - printInfo.lineLength);
        toPrint += '    |';
        return toPrint;
    }
    function formatInstruction(context, address, instruction, details, colored, treeSpaces, isJump) {
        const anyCtx = context;
        let line = '';
        let coloredLine = '';
        let part;
        let intTreeSpace = 0;
        let spaceAtOpStr;
        const append = function (what, color) {
            line += what;
            if (colored) {
                if (color) {
                    coloredLine += Color.colorify(what, color);
                }
                else {
                    coloredLine += what;
                }
            }
        };
        const appendModuleInfo = function (address) {
            const module = moduleMap.find(address);
            if (module !== null) {
                append(' (');
                append(module.name, 'green bold');
                part = '#';
                append(part);
                part = address.sub(module.base).toString();
                append(part, 'red');
                part = ')';
                append(part);
            }
        };
        const addSpace = function (count) {
            append(Utils.getSpacer(count + intTreeSpace - line.length));
        };
        if (treeSpaces > 0 && treeTrace.length > 0) {
            intTreeSpace = treeTrace.length * treeSpaces;
            append(Utils.getSpacer(intTreeSpace));
        }
        currentBlockStartWidth = line.length;
        append(address.toString(), 'red bold');
        appendModuleInfo(address);
        addSpace(40);
        const bytes = instruction.address.readByteArray(instruction.size);
        if (bytes) {
            part = Utils.ba2hex(bytes);
            append(part, 'yellow');
        }
        else {
            let _fix = '';
            for (let i = 0; i < instruction.size; i++) {
                _fix += '00';
            }
            append(_fix, 'yellow');
        }
        addSpace(50);
        append(instruction.mnemonic, 'green bold');
        addSpace(60);
        spaceAtOpStr = line.length;
        append(instruction.opStr, 'filter');
        if (isJump) {
            try {
                let jumpInsn = getJumpInstruction(instruction, anyCtx);
                if (jumpInsn) {
                    appendModuleInfo(jumpInsn.address);
                }
            }
            catch (e) { }
        }
        const lineLength = line.length;
        if (lineLength > currentBlockMaxWidth) {
            currentBlockMaxWidth = lineLength;
        }
        let detailsData = [];
        if (details) {
            if (currentExecutionBlockStackRegisters.length > 0) {
                let postLines = [];
                currentExecutionBlockStackRegisters.forEach((reg) => {
                    const contextVal = getRegisterValue(context, reg.reg);
                    if (contextVal && contextVal != reg.value) {
                        const toStr = contextVal.toString();
                        let str = getSpacer(spaceAtOpStr);
                        if (colored) {
                            str += Color.colorify(reg.reg, 'blue bold') + ' = ' + Color.colorify(toStr, 'red');
                        }
                        else {
                            str += reg.reg + ' = ' + toStr;
                        }
                        postLines.push({ data: str, lineLength: spaceAtOpStr + reg.reg.length + toStr.length + 3 });
                    }
                });
                currentExecutionBlockStackRegisters.length = 0;
                if (currentExecutionBlock.length > 0) {
                    currentExecutionBlock[currentExecutionBlock.length - 1].postDetails = postLines;
                }
            }
            detailsData = formatInstructionDetails(spaceAtOpStr, context, instruction, colored, isJump);
            detailsData.forEach((detail) => {
                if (detail.lineLength > currentBlockMaxWidth) {
                    currentBlockMaxWidth = detail.lineLength;
                }
            });
        }
        return { data: colored ? coloredLine : line, lineLength: lineLength, details: detailsData };
    }
    function formatInstructionDetails(spaceAtOpStr, context, instruction, colored, isJump) {
        const anyContext = context;
        const data = [];
        const visited = new Set();
        let insn = null;
        if (Process.arch === 'arm64') {
            insn = instruction;
        }
        else if (Process.arch === 'ia32' || Process.arch === 'x64') {
            insn = instruction;
        }
        if (insn != null) {
            insn.operands.forEach((op) => {
                let reg;
                let value = null;
                let adds = 0;
                if (op.type === 'mem') {
                    adds = op.value.disp;
                    reg = op.value.base;
                }
                else if (op.type === 'reg') {
                    reg = op.value;
                }
                if (typeof reg !== 'undefined' && !visited.has(reg)) {
                    visited.add(reg);
                    try {
                        value = getRegisterValue(anyContext, reg);
                        if (typeof value !== 'undefined') {
                            currentExecutionBlockStackRegisters.push({ reg: reg.toString(), value: value });
                            value = getRegisterValue(anyContext, reg);
                            let regLabel = reg.toString();
                            data.push([
                                regLabel,
                                value.toString() + (adds > 0 ? '#' + adds.toString(16) : ''),
                                getTelescope(value.add(adds), colored, isJump),
                            ]);
                        }
                    }
                    catch (e) { }
                }
            });
        }
        const applyColor = function (what, color) {
            if (colored && color) {
                what = Color.colorify(what, color);
            }
            return what;
        };
        let lines = [];
        data.forEach((row) => {
            let line = Utils.getSpacer(spaceAtOpStr);
            let lineLength = spaceAtOpStr + row[0].length + row[1].toString().length + 3;
            line += applyColor(row[0], 'blue') + ' = ' + applyColor(row[1], 'filter');
            if (row.length > 2 && row[2] !== null) {
                const printInfo = row[2];
                if (printInfo.lineLength > 0) {
                    line += ' >> ' + printInfo.data;
                    lineLength += printInfo.lineLength + 4;
                }
            }
            lines.push({ data: line, lineLength: lineLength });
        });
        return lines;
    }
    function getTelescope(address, colored, isJump) {
        if (isJump) {
            try {
                const instruction = Instruction.parse(address);
                let ret;
                if (colored) {
                    ret = Color.colorify(instruction.mnemonic, 'green');
                }
                else {
                    ret = instruction.mnemonic;
                }
                ret += ' ' + instruction.opStr;
                return { data: ret, lineLength: instruction.mnemonic.length + instruction.opStr.length + 1 };
            }
            catch (e) { }
        }
        else {
            let count = 0;
            let current = address;
            let result = '';
            let resLen = 0;
            while (true) {
                try {
                    current = current.readPointer();
                    const asStr = current.toString();
                    if (result.length > 0) {
                        result += ' >> ';
                        resLen += 4;
                    }
                    resLen += asStr.length;
                    if (current.compare(0x10000) < 0) {
                        if (colored) {
                            result += Color.colorify(asStr, 'cyan bold');
                        }
                        else {
                            result += asStr;
                        }
                        break;
                    }
                    else {
                        if (colored) {
                            result += Color.colorify(asStr, 'red');
                        }
                        else {
                            result += asStr;
                        }
                        try {
                            let str = address.readUtf8String();
                            if (str && str.length > 0) {
                                let ret = str.replace('\n', ' ');
                                if (colored) {
                                    result += ' (' + Color.colorify(ret, 'green') + ')';
                                }
                                else {
                                    result += ' (' + ret + ')';
                                }
                                resLen += str.length + 3;
                            }
                        }
                        catch (e) { }
                    }
                    if (count === 5) {
                        break;
                    }
                    count += 1;
                }
                catch (e) {
                    break;
                }
            }
            return { data: result, lineLength: resLen };
        }
        return { data: '', lineLength: 0 };
    }
    function getJumpInstruction(instruction, context) {
        let insn = null;
        if (Process.arch === 'arm64') {
            insn = instruction;
        }
        else if (Process.arch === 'ia32' || Process.arch === 'x64') {
            insn = instruction;
        }
        if (insn) {
            if (Utils.isJumpInstruction(instruction)) {
                const lastOp = insn.operands[insn.operands.length - 1];
                switch (lastOp.type) {
                    case 'reg':
                        return Instruction.parse(context[lastOp.value]);
                    case 'imm':
                        return Instruction.parse(ptr(lastOp.value.toString()));
                }
            }
        }
        return null;
    }
    function getRegisterValue(context, reg) {
        if (Process.arch === 'arm64') {
            if (reg.startsWith('w')) {
                return context[reg.replace('w', 'x')].and(0x00000000ffffffff);
            }
        }
        return context[reg];
    }
})(HooahTrace || (HooahTrace = {}));
//# sourceMappingURL=hooah.js.map

/***/ }),

/***/ "./packages/native/dist/index.js":
/*!***************************************!*\
  !*** ./packages/native/dist/index.js ***!
  \***************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HooahTrace: () => (/* reexport safe */ _hooah_js__WEBPACK_IMPORTED_MODULE_4__.HooahTrace),
/* harmony export */   Inject: () => (/* reexport safe */ _inject_js__WEBPACK_IMPORTED_MODULE_2__.Inject),
/* harmony export */   attachRegisterNatives: () => (/* reexport safe */ _registerNatives_js__WEBPACK_IMPORTED_MODULE_0__.attachRegisterNatives),
/* harmony export */   attachSystemPropertyGet: () => (/* reexport safe */ _systemPropertyGet_js__WEBPACK_IMPORTED_MODULE_1__.attachSystemPropertyGet),
/* harmony export */   dumpFile: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_3__.dumpFile),
/* harmony export */   gPtr: () => (/* binding */ gPtr)
/* harmony export */ });
/* harmony import */ var _registerNatives_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./registerNatives.js */ "./packages/native/dist/registerNatives.js");
/* harmony import */ var _systemPropertyGet_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./systemPropertyGet.js */ "./packages/native/dist/systemPropertyGet.js");
/* harmony import */ var _inject_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./inject.js */ "./packages/native/dist/inject.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.js */ "./packages/native/dist/utils.js");
/* harmony import */ var _hooah_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./hooah.js */ "./packages/native/dist/hooah.js");





function gPtr(value) {
    return ptr(value).sub('0x100000');
}

//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./packages/native/dist/inject.js":
/*!****************************************!*\
  !*** ./packages/native/dist/inject.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Inject: () => (/* binding */ Inject)
/* harmony export */ });
/* harmony import */ var _clockwork_logging__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @clockwork/logging */ "./packages/logging/dist/index.js");

const { blue, red, magentaBright: pink } = _clockwork_logging__WEBPACK_IMPORTED_MODULE_0__.Color.use();
// using namespace for singleton with all callbacks
var Inject;
(function (Inject) {
    Inject.modules = new ModuleMap();
    const initArrayCallbacks = [];
    let do_dlopen;
    let call_ctor;
    const linker = Process.getModuleByName(Process.pointerSize === 4 ? 'linker' : 'linker64');
    for (const { name, address } of linker.enumerateSymbols()) {
        if (name.includes('do_dlopen')) {
            do_dlopen = address;
            continue;
        }
        if (name.includes('call_constructor')) {
            call_ctor = address;
            continue;
        }
    }
    // TODO add just hook dlopen_ext
    // const android_dlopen_ext = Module.getExportByName(null, 'android_dlopen_ext');
    Interceptor.attach(do_dlopen, {
        onEnter: function (args) {
            const libPath = (this.libPath = args[0].readCString());
            if (!libPath)
                return;
            const libName = (this.libName = libPath.split('/').pop());
            _clockwork_logging__WEBPACK_IMPORTED_MODULE_0__.logger.info(`[${pink('dlopen')}] ${libPath}`);
            Inject.modules.update();
            return;
            // TODO investigate
            let handle = null;
            const unhook = () => handle?.detach();
            handle = Interceptor.attach(call_ctor, ctorListenerCallback(libName, unhook));
        },
        onLeave: function (retval) {
            if (!this.libPath)
                return;
            onAfterInitArray(this.libName);
        },
    });
    // call_constructor callback
    const ctorListenerCallback = (libName, detach) => ({
        onEnter(args) {
            _clockwork_logging__WEBPACK_IMPORTED_MODULE_0__.logger.info({ tag: 'ctor' }, `${libName} ${red('->')} ${args[0]}`);
        },
        onLeave(retval) {
            _clockwork_logging__WEBPACK_IMPORTED_MODULE_0__.logger.info({ tag: 'ctor' }, `${libName} ${blue('<-')} ${retval}`);
            detach();
        },
    });
    function onAfterInitArray(libName) {
        for (const cb of initArrayCallbacks) {
            cb(libName);
        }
    }
    function afterInitArray(fn) {
        initArrayCallbacks.push(fn);
    }
    Inject.afterInitArray = afterInitArray;
    function afterInitArrayModule(fn) {
        initArrayCallbacks.push((name) => {
            const module = Process.findModuleByName(name);
            if (module)
                fn(module);
        });
    }
    Inject.afterInitArrayModule = afterInitArrayModule;
    function attachInModule(nameOrPredicate, address, callbacks) {
        const fn = typeof nameOrPredicate === 'function' ? nameOrPredicate : (ptr) => Inject.modules.findName(ptr) === nameOrPredicate;
        Interceptor.attach(address, {
            onEnter(args) {
                if (fn(this.returnAddress)) {
                    callbacks?.onEnter?.call?.(this, args);
                }
            },
            onLeave(retval) {
                if (fn(this.returnAddress)) {
                    callbacks?.onLeave?.call(this, retval);
                }
            },
        });
    }
    Inject.attachInModule = attachInModule;
    /** very useful for not hooking hardware, chrome, and other things you that cause crashes */
    function isWithinOwnRange(ptr) {
        const path = Inject.modules.findPath(ptr);
        return path?.includes('/data') === true;
    }
    Inject.isWithinOwnRange = isWithinOwnRange;
})(Inject || (Inject = {}));

//# sourceMappingURL=inject.js.map

/***/ }),

/***/ "./packages/native/dist/registerNatives.js":
/*!*************************************************!*\
  !*** ./packages/native/dist/registerNatives.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   attachRegisterNatives: () => (/* binding */ attachRegisterNatives)
/* harmony export */ });
/* harmony import */ var _clockwork_logging__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @clockwork/logging */ "./packages/logging/dist/index.js");

const { green, redBright, bold, dim, black } = _clockwork_logging__WEBPACK_IMPORTED_MODULE_0__.Color.use();
let cachedVtable = null;
function vtable(instance) {
    if (cachedVtable === null) {
        cachedVtable = instance.handle.readPointer();
    }
    return cachedVtable;
}
function find(offset, returnType, args) {
    const env = Java.vm.tryGetEnv();
    if (!env)
        return null;
    const addr = vtable(env)
        .add(offset * Process.pointerSize)
        .readPointer();
    const func = new NativeFunction(addr, returnType, args);
    return func ?? null;
}
function attachRegisterNatives() {
    const found = find(215, 'int32', ['pointer', 'pointer', 'pointer', 'int32']);
    if (found) {
        Interceptor.attach(found, {
            onEnter(args) {
                logOnEnterRegisterNatives.call(this, args);
            },
        });
        return;
    }
    // fallback previous method
    const libart = Process.getModuleByName('libart.so');
    const symbols = libart.enumerateSymbols();
    symbols.forEach(({ name, address }) => {
        if (name.includes('art') && name.includes('JNI') && name.includes('RegisterNatives') && !name.includes('CheckJNI')) {
            console.log('RegisterNatives is at ', address, name);
            Interceptor.attach(address, {
                onEnter(args) {
                    logOnEnterRegisterNatives.call(this, args);
                    // TODO hook capabilities
                },
            });
        }
    });
}
/*
jint RegisterNatives(JNIEnv *env, jclass clazz, const JNINativeMethod *methods, jint nMethods);
struct JNINativeMethod< R (JNIEnv*, jclass*, Args...) > {
    const char* name;
    const char* signature;
    R (*fnPtr)(JNIEnv*, jclass*, Args...);
};
*/
function logOnEnterRegisterNatives(args) {
    const module = Process.findModuleByAddress(this.returnAddress) ?? Process.findModuleByAddress(args[2]);
    const clazz = args[1];
    const methodsPtr = args[2];
    const nMethods = args[3].toInt32();
    const className = Java.vm.tryGetEnv()?.getClassName(clazz) ?? '<unknown>';
    console.log('[RegisterNatives]', redBright(className), 'methods:', bold(nMethods));
    addToExport({
        module: module?.name,
        name: className,
        methods_ptr: module ? methodsPtr.sub(module.base) : methodsPtr,
        nMethods: nMethods,
        backtrace: module
            ? Thread.backtrace()
                .filter((s) => s > module.base && s < module.base.add(module.size))
                .map((s) => s.sub(module.base))
            : undefined,
    });
    for (let i = 0; i < nMethods; i++) {
        const namePtr = methodsPtr.add(i * Process.pointerSize * 3).readPointer();
        const sigPtr = methodsPtr.add(i * Process.pointerSize * 3 + Process.pointerSize).readPointer();
        const fnPtrPtr = methodsPtr.add(i * Process.pointerSize * 3 + Process.pointerSize * 2).readPointer();
        const name = namePtr.readCString() ?? '';
        const sig = sigPtr.readCString() ?? '';
        const symbol = DebugSymbol.fromAddress(fnPtrPtr);
        console.log(`${black(dim('  >'))}${green(name)}${sig}`, `at:\n    ${symbol}\n    ${DebugSymbol.fromAddress(this.returnAddress)}`);
        // console.log(
        //     '[#]',
        //     JSON.stringify({
        //         class: className,
        //         name: name,
        //         sig: sig,
        //         module: symbol.moduleName,
        //         offset: badConvert(symbol),
        //     }),
        // );
    }
}
function getModuleBase(returnAddress) {
    const debug = DebugSymbol.fromAddress(returnAddress);
    if (!debug.name)
        return null;
    const module = Process.findModuleByName(debug.name);
    if (!module)
        return null;
    return module.base;
}
function badConvert(symbol) {
    const str = symbol.toString();
    const stripped = str.substring(str.lastIndexOf('0x'));
    return ptr(stripped);
}
function addToExport(item) {
    const native = (rpc['RegisterNatives'] ??= []);
    native.push(item);
}

//# sourceMappingURL=registerNatives.js.map

/***/ }),

/***/ "./packages/native/dist/systemPropertyGet.js":
/*!***************************************************!*\
  !*** ./packages/native/dist/systemPropertyGet.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   attachSystemPropertyGet: () => (/* binding */ attachSystemPropertyGet)
/* harmony export */ });
/* harmony import */ var _clockwork_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @clockwork/common */ "./packages/common/dist/index.js");
/* harmony import */ var _clockwork_logging__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @clockwork/logging */ "./packages/logging/dist/index.js");


const { gray, green, red } = _clockwork_logging__WEBPACK_IMPORTED_MODULE_1__.Color.use();
const logger = (0,_clockwork_logging__WEBPACK_IMPORTED_MODULE_1__.subLogger)('sysprop');
function attachSystemPropertyGet(fn) {
    fn &&
        Interceptor.attach(_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.Libc.__system_property_read, {
            onEnter(args) { },
            onLeave(retval) {
                retval.replace(ptr(0x5b));
            },
        });
    Interceptor.attach(_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.Libc.__system_property_get, {
        onEnter: function (args) {
            this.name = args[0].readCString();
            this.value = args[1];
        },
        onLeave: function (retval) {
            const key = this.name;
            const value = this.value.readCString();
            const fValue = value && value.length >= 0 ? value : null;
            const result = fn?.call(this, key, fValue);
            if (!result)
                return logger.info(`${gray(key)}: ${value ?? retval}`);
            this.value.writeUtf8String(result);
            logger.info(`${(gray(key))}: ${red(value ?? retval)} -> ${green(result)}`);
        },
    });
}

//# sourceMappingURL=systemPropertyGet.js.map

/***/ }),

/***/ "./packages/native/dist/utils.js":
/*!***************************************!*\
  !*** ./packages/native/dist/utils.js ***!
  \***************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dellocate: () => (/* binding */ dellocate),
/* harmony export */   dumpFile: () => (/* binding */ dumpFile),
/* harmony export */   getSelfFiles: () => (/* binding */ getSelfFiles),
/* harmony export */   getSelfProcessName: () => (/* binding */ getSelfProcessName)
/* harmony export */ });
/* harmony import */ var _clockwork_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @clockwork/common */ "./packages/common/dist/index.js");

function dellocate(ptr) {
    try {
        const env = Java.vm.tryGetEnv();
        env?.ReleaseStringUTFChars(ptr);
    }
    catch (_) { }
}
function mkdir(path) {
    const cPath = Memory.allocUtf8String(path);
    const dir = _clockwork_common__WEBPACK_IMPORTED_MODULE_0__.Libc.opendir(cPath);
    if (!dir.isNull()) {
        _clockwork_common__WEBPACK_IMPORTED_MODULE_0__.Libc.closedir(dir);
        return false;
    }
    _clockwork_common__WEBPACK_IMPORTED_MODULE_0__.Libc.mkdir(cPath, 755);
    _clockwork_common__WEBPACK_IMPORTED_MODULE_0__.Libc.chmod(cPath, 755);
    dellocate(cPath);
    return true;
}
function getSelfProcessName() {
    const path = Memory.allocUtf8String('/proc/self/cmdline');
    const fd = _clockwork_common__WEBPACK_IMPORTED_MODULE_0__.Libc.open(path, 0);
    dellocate(path);
    if (fd !== -1) {
        const buffer = Memory.alloc(0x1000);
        _clockwork_common__WEBPACK_IMPORTED_MODULE_0__.Libc.read(fd, buffer, 0x1000);
        _clockwork_common__WEBPACK_IMPORTED_MODULE_0__.Libc.close(fd);
        return buffer.readCString();
    }
    return null;
}
function getSelfFiles() {
    const process_name = getSelfProcessName();
    const files_dir = '/data/data/' + process_name + '/files';
    mkdir(files_dir);
    return files_dir;
}
function chmod(path) {
    const cPath = Memory.allocUtf8String(path);
    _clockwork_common__WEBPACK_IMPORTED_MODULE_0__.Libc.chmod(cPath, 755);
    dellocate(cPath);
}
function mkdirs(base_path, file_path) {
    const dir_array = file_path.split('/');
    let path = base_path;
    for (const segment of dir_array) {
        mkdir(path);
        path += `/${segment}`;
    }
}
function dumpFile(stringPtr, size, relativePath, tag) {
    const process_name = getSelfProcessName();
    const filesDir = `/data/data/${process_name}/files`;
    mkdir(filesDir);
    const dexDir = `${filesDir}/dump_${tag}_${process_name}`;
    mkdir(dexDir);
    const fullpath = `${dexDir}/${relativePath}`;
    // Memory.protect(stringPtr, size, 'rw');
    const buffer = stringPtr.readCString(size);
    if (!buffer) {
        return false;
    }
    mkdirs(dexDir, relativePath);
    //@ts-ignore issue with File from esnext 5.4
    const file = new File(fullpath, 'w');
    file.write(buffer);
    file.close();
    return true;
}

//# sourceMappingURL=utils.js.map

/***/ }),

/***/ "./packages/network/dist/hostaddr.js":
/*!*******************************************!*\
  !*** ./packages/network/dist/hostaddr.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   attachGetAddrInfo: () => (/* binding */ attachGetAddrInfo),
/* harmony export */   attachGetHostByName: () => (/* binding */ attachGetHostByName),
/* harmony export */   attachInteAton: () => (/* binding */ attachInteAton)
/* harmony export */ });
/* harmony import */ var _clockwork_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @clockwork/common */ "./packages/common/dist/index.js");
/* harmony import */ var _clockwork_logging__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @clockwork/logging */ "./packages/logging/dist/index.js");


function attachGetHostByName() {
    Interceptor.attach(_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.Libc.gethostbyname, {
        onEnter(args) {
            this.name = args[0].readCString();
        },
        onLeave(retval) {
            _clockwork_logging__WEBPACK_IMPORTED_MODULE_1__.logger.info({ tag: 'gethostbyname' }, `${_clockwork_logging__WEBPACK_IMPORTED_MODULE_1__.Color.url(this.name)} -> result: ${retval}`);
        },
    });
}
function attachGetAddrInfo(detailed = false) {
    Interceptor.attach(_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.Libc.getaddrinfo, {
        onEnter(args) {
            this.host = args[0].readCString();
            this.port = args[1].readCString();
            this.result = args[2];
        },
        onLeave(retval) {
            const resInt = retval.toUInt32();
            const text = !this.port || this.port === 'null' ? `${this.host}` : `${this.host}:${this.port}`;
            const result = resInt === 0x0 ? 'success' : 'failure';
            _clockwork_logging__WEBPACK_IMPORTED_MODULE_1__.logger.info({ tag: 'getaddrinfo' }, `${_clockwork_logging__WEBPACK_IMPORTED_MODULE_1__.Color.url(text)} -> ${result}`);
            if (resInt == 0x0) {
                let ptr = this.result;
                if (!detailed)
                    return;
                const aiFlags = (ptr = ptr.add(0)).readInt();
                const aiFamilty = (ptr = ptr.add(4)).readInt();
                const aiSockType = (ptr = ptr.add(4)).readInt();
                const aiProtocol = (ptr = ptr.add(4)).readInt();
                const aiAddrLen = (ptr = ptr.add(4)).readUInt();
                const aiAddr = (ptr = ptr.add(4)).readPointer();
                const aiCannonName = (ptr = ptr.add(8)).readCString();
                const aiNext = (ptr = ptr.add(8)).readPointer();
                _clockwork_logging__WEBPACK_IMPORTED_MODULE_1__.logger.info({ tag: 'getaddrinfo' }, JSON.stringify({
                    aiFlags: aiFlags,
                    aiFamilty: aiFamilty,
                    aiSockType: aiSockType,
                    aiProtocol: aiProtocol,
                    aiAddrLen: aiAddrLen,
                    aiAddr: aiAddr,
                    aiCannonName: aiCannonName,
                    aiNext: aiNext,
                }, null, 2));
            }
        },
    });
}
function attachInteAton() {
    Interceptor.attach(_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.Libc.inet_aton, {
        onEnter(args) {
            this.addr = args[0].readCString();
        },
        onLeave(retval) {
            _clockwork_logging__WEBPACK_IMPORTED_MODULE_1__.logger.info({ tag: 'inet_aton' }, `${this.addr} -> ${retval}`);
        },
    });
}

//# sourceMappingURL=hostaddr.js.map

/***/ }),

/***/ "./packages/network/dist/index.js":
/*!****************************************!*\
  !*** ./packages/network/dist/index.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   attachGetAddrInfo: () => (/* reexport safe */ _hostaddr_js__WEBPACK_IMPORTED_MODULE_0__.attachGetAddrInfo),
/* harmony export */   attachGetHostByName: () => (/* reexport safe */ _hostaddr_js__WEBPACK_IMPORTED_MODULE_0__.attachGetHostByName),
/* harmony export */   attachInteAton: () => (/* reexport safe */ _hostaddr_js__WEBPACK_IMPORTED_MODULE_0__.attachInteAton),
/* harmony export */   attachNativeSocket: () => (/* reexport safe */ _socket_js__WEBPACK_IMPORTED_MODULE_1__.attachNativeSocket),
/* harmony export */   injectSsl: () => (/* reexport safe */ _trustmanager_js__WEBPACK_IMPORTED_MODULE_2__.injectSsl),
/* harmony export */   useTrustManager: () => (/* reexport safe */ _trustmanager_js__WEBPACK_IMPORTED_MODULE_2__.useTrustManager)
/* harmony export */ });
/* harmony import */ var _hostaddr_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hostaddr.js */ "./packages/network/dist/hostaddr.js");
/* harmony import */ var _socket_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./socket.js */ "./packages/network/dist/socket.js");
/* harmony import */ var _trustmanager_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./trustmanager.js */ "./packages/network/dist/trustmanager.js");



//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./packages/network/dist/socket.js":
/*!*****************************************!*\
  !*** ./packages/network/dist/socket.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   attachNativeSocket: () => (/* binding */ attachNativeSocket)
/* harmony export */ });
/* harmony import */ var _clockwork_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @clockwork/common */ "./packages/common/dist/index.js");
/* harmony import */ var _clockwork_logging__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @clockwork/logging */ "./packages/logging/dist/index.js");


const logger = (0,_clockwork_logging__WEBPACK_IMPORTED_MODULE_1__.subLogger)('socket');
function attachNativeSocket() {
    const stacktrace = false, backtrace = false;
    const tcpSocketFDs = new Map();
    Interceptor.attach(_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.Libc.connect, {
        onEnter(args) {
            this.sockFd = args[0].toInt32();
        },
        onLeave(res) {
            const sockFd = this.sockFd;
            const sockType = Socket.type(sockFd);
            if (!(sockType === 'tcp' || sockType === 'tcp6'))
                return;
            const sockLocal = Socket.localAddress(sockFd);
            const tcpEpLocal = sockLocal ?? undefined;
            const sockRemote = Socket.peerAddress(sockFd);
            const tcpEpRemote = sockRemote ?? undefined;
            if (!tcpEpLocal)
                return;
            // ToDo: if socket FD already exists in the set, a faked 'close' message shall be sent first (currently handled by receiving logic)
            tcpSocketFDs.set(sockFd, tcpEpLocal);
            const msg = {
                socketFd: sockFd,
                pid: Process.id,
                threadId: this.threadId,
                type: 'connect',
                hostIp: tcpEpLocal?.ip,
                port: tcpEpLocal?.port,
                dstIp: tcpEpRemote?.ip,
                dstPort: tcpEpRemote?.port,
                result: res,
            };
            if (stacktrace && Java.available && Java.vm !== null && Java.vm.tryGetEnv()) {
                // checks if Thread is JVM attached (JNI env available)
                const exception = Java.use('java.lang.Exception').$new();
                const trace = exception.getStackTrace();
                // msg.stacktrace = trace.map((traceEl) => {
                //     return {
                //         class: traceEl.getClassName(),
                //         file: traceEl.getFileName(),
                //         line: traceEl.getLineNumber(),
                //         method: traceEl.getMethodName(),
                //         isNative: traceEl.isNativeMethod(),
                //         str: traceEl.toString(),
                //     };
                // });
            }
            if (backtrace) {
                // msg.backtrace = Thread.backtrace(this.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress);
            }
            //send(msg)
            logOpen(msg);
        },
    });
    [_clockwork_common__WEBPACK_IMPORTED_MODULE_0__.Libc.close, _clockwork_common__WEBPACK_IMPORTED_MODULE_0__.Libc.shutdown].forEach((fn, i) => {
        Interceptor.attach(fn, {
            onEnter(args) {
                const sockFd = args[0].toInt32();
                if (!tcpSocketFDs.has(sockFd))
                    return;
                const sockType = Socket.type(sockFd);
                if (tcpSocketFDs.has(sockFd)) {
                    const tcpEP = tcpSocketFDs.get(sockFd);
                    const msg = {
                        socketFd: sockFd,
                        pid: Process.id,
                        threadId: this.threadIds,
                        type: ['close', 'shutdown'][i],
                        hostIp: tcpEP?.ip,
                        port: tcpEP?.port,
                    };
                    tcpSocketFDs.delete(sockFd);
                    //send(msg)
                    logClose(msg);
                }
            },
        });
    });
}
function logOpen(msg) {
    const host = (`${msg.hostIp?.replace('::ffff:', '')}` + String(msg.port ? `:${msg.port}` : ''));
    const dest = (msg.dstIp ? (`, dst@${msg.dstIp.replace('::ffff:', '')}` + String(msg.dstPort ? `:${msg.dstPort}` : '')) : '');
    logger.info(`(pid: ${msg.pid}, thread: ${msg.threadId}, fd: ${msg.socketFd}) ${msg.type} -> [host@${host}${dest}]`);
}
function logClose(msg) {
    const host = (`${msg.hostIp?.replace('::ffff:', '')}` + String(msg.port ? `:${msg.port}` : ''));
    const thread = (msg.threadId ? `, thread: ${msg.threadId}` : '');
    logger.info(`(pid: ${msg.pid}${thread}, fd: ${msg.socketFd}) ${msg.type} -> ${host}`);
}

//# sourceMappingURL=socket.js.map

/***/ }),

/***/ "./packages/network/dist/trustmanager.js":
/*!***********************************************!*\
  !*** ./packages/network/dist/trustmanager.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   injectSsl: () => (/* binding */ injectSsl),
/* harmony export */   useTrustManager: () => (/* binding */ useTrustManager)
/* harmony export */ });
/* harmony import */ var _clockwork_hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @clockwork/hooks */ "./packages/hooks/dist/index.js");
/* harmony import */ var _clockwork_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @clockwork/common */ "./packages/common/dist/index.js");
/* harmony import */ var _clockwork_hooks_dist_addons_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @clockwork/hooks/dist/addons.js */ "./packages/hooks/dist/addons.js");



const className = 'com.google.in.MemoryTrustManager';
const dexBytes = [
    0x64, 0x65, 0x78, 0x0a, 0x30, 0x33, 0x35, 0x00, 0x8e, 0xa2, 0x73, 0xf2, 0xa6, 0xf0, 0x99, 0x67, 0xc8, 0x58, 0x11, 0x3f, 0x19, 0xa2,
    0x78, 0xbd, 0xec, 0x97, 0xf9, 0x80, 0x32, 0x64, 0x19, 0xc5, 0xbc, 0x03, 0x00, 0x00, 0x70, 0x00, 0x00, 0x00, 0x78, 0x56, 0x34, 0x12,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x04, 0x03, 0x00, 0x00, 0x11, 0x00, 0x00, 0x00, 0x70, 0x00, 0x00, 0x00, 0x08, 0x00,
    0x00, 0x00, 0xb4, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0xd4, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x05, 0x00, 0x00, 0x00, 0xf8, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x20, 0x01, 0x00, 0x00, 0x7c, 0x02, 0x00, 0x00, 0x40, 0x01,
    0x00, 0x00, 0x90, 0x01, 0x00, 0x00, 0x98, 0x01, 0x00, 0x00, 0x9b, 0x01, 0x00, 0x00, 0xbf, 0x01, 0x00, 0x00, 0xdb, 0x01, 0x00, 0x00,
    0xef, 0x01, 0x00, 0x00, 0x03, 0x02, 0x00, 0x00, 0x2e, 0x02, 0x00, 0x00, 0x50, 0x02, 0x00, 0x00, 0x69, 0x02, 0x00, 0x00, 0x6c, 0x02,
    0x00, 0x00, 0x71, 0x02, 0x00, 0x00, 0x98, 0x02, 0x00, 0x00, 0xac, 0x02, 0x00, 0x00, 0xc0, 0x02, 0x00, 0x00, 0xd4, 0x02, 0x00, 0x00,
    0xda, 0x02, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x06, 0x00,
    0x00, 0x00, 0x07, 0x00, 0x00, 0x00, 0x09, 0x00, 0x00, 0x00, 0x0b, 0x00, 0x00, 0x00, 0x09, 0x00, 0x00, 0x00, 0x06, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x0a, 0x00, 0x00, 0x00, 0x06, 0x00, 0x00, 0x00, 0x88, 0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x07, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x0c, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x01, 0x00, 0x0d, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x0e, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x80, 0x01, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00,
    0x60, 0x01, 0x00, 0x00, 0xee, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0xe6, 0x02, 0x00, 0x00, 0x01, 0x00,
    0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0xe1, 0x02, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x70, 0x10, 0x04, 0x00, 0x00, 0x00, 0x0e, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x40, 0x01,
    0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x40, 0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00,
    0x07, 0x00, 0x03, 0x00, 0x06, 0x3c, 0x69, 0x6e, 0x69, 0x74, 0x3e, 0x00, 0x01, 0x4c, 0x00, 0x22, 0x4c, 0x63, 0x6f, 0x6d, 0x2f, 0x67,
    0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2f, 0x69, 0x6e, 0x2f, 0x4d, 0x65, 0x6d, 0x6f, 0x72, 0x79, 0x54, 0x72, 0x75, 0x73, 0x74, 0x4d, 0x61,
    0x6e, 0x61, 0x67, 0x65, 0x72, 0x3b, 0x00, 0x1a, 0x4c, 0x64, 0x61, 0x6c, 0x76, 0x69, 0x6b, 0x2f, 0x61, 0x6e, 0x6e, 0x6f, 0x74, 0x61,
    0x74, 0x69, 0x6f, 0x6e, 0x2f, 0x54, 0x68, 0x72, 0x6f, 0x77, 0x73, 0x3b, 0x00, 0x12, 0x4c, 0x6a, 0x61, 0x76, 0x61, 0x2f, 0x6c, 0x61,
    0x6e, 0x67, 0x2f, 0x4f, 0x62, 0x6a, 0x65, 0x63, 0x74, 0x3b, 0x00, 0x12, 0x4c, 0x6a, 0x61, 0x76, 0x61, 0x2f, 0x6c, 0x61, 0x6e, 0x67,
    0x2f, 0x53, 0x74, 0x72, 0x69, 0x6e, 0x67, 0x3b, 0x00, 0x29, 0x4c, 0x6a, 0x61, 0x76, 0x61, 0x2f, 0x73, 0x65, 0x63, 0x75, 0x72, 0x69,
    0x74, 0x79, 0x2f, 0x63, 0x65, 0x72, 0x74, 0x2f, 0x43, 0x65, 0x72, 0x74, 0x69, 0x66, 0x69, 0x63, 0x61, 0x74, 0x65, 0x45, 0x78, 0x63,
    0x65, 0x70, 0x74, 0x69, 0x6f, 0x6e, 0x3b, 0x00, 0x20, 0x4c, 0x6a, 0x61, 0x76, 0x61, 0x78, 0x2f, 0x6e, 0x65, 0x74, 0x2f, 0x73, 0x73,
    0x6c, 0x2f, 0x58, 0x35, 0x30, 0x39, 0x54, 0x72, 0x75, 0x73, 0x74, 0x4d, 0x61, 0x6e, 0x61, 0x67, 0x65, 0x72, 0x3b, 0x00, 0x17, 0x4d,
    0x65, 0x6d, 0x6f, 0x72, 0x79, 0x54, 0x72, 0x75, 0x73, 0x74, 0x4d, 0x61, 0x6e, 0x61, 0x67, 0x65, 0x72, 0x2e, 0x6a, 0x61, 0x76, 0x61,
    0x00, 0x01, 0x56, 0x00, 0x03, 0x56, 0x4c, 0x4c, 0x00, 0x25, 0x5b, 0x4c, 0x6a, 0x61, 0x76, 0x61, 0x2f, 0x73, 0x65, 0x63, 0x75, 0x72,
    0x69, 0x74, 0x79, 0x2f, 0x63, 0x65, 0x72, 0x74, 0x2f, 0x58, 0x35, 0x30, 0x39, 0x43, 0x65, 0x72, 0x74, 0x69, 0x66, 0x69, 0x63, 0x61,
    0x74, 0x65, 0x3b, 0x00, 0x12, 0x63, 0x68, 0x65, 0x63, 0x6b, 0x43, 0x6c, 0x69, 0x65, 0x6e, 0x74, 0x54, 0x72, 0x75, 0x73, 0x74, 0x65,
    0x64, 0x00, 0x12, 0x63, 0x68, 0x65, 0x63, 0x6b, 0x53, 0x65, 0x72, 0x76, 0x65, 0x72, 0x54, 0x72, 0x75, 0x73, 0x74, 0x65, 0x64, 0x00,
    0x12, 0x67, 0x65, 0x74, 0x41, 0x63, 0x63, 0x65, 0x70, 0x74, 0x65, 0x64, 0x49, 0x73, 0x73, 0x75, 0x65, 0x72, 0x73, 0x00, 0x04, 0x74,
    0x68, 0x69, 0x73, 0x00, 0x05, 0x76, 0x61, 0x6c, 0x75, 0x65, 0x00, 0x03, 0x00, 0x07, 0x0e, 0x00, 0x02, 0x01, 0x01, 0x10, 0x1c, 0x01,
    0x18, 0x04, 0x00, 0x00, 0x01, 0x03, 0x00, 0x81, 0x80, 0x04, 0xc8, 0x02, 0x01, 0x81, 0x02, 0x00, 0x01, 0x81, 0x02, 0x00, 0x01, 0x81,
    0x02, 0x00, 0x0f, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00,
    0x11, 0x00, 0x00, 0x00, 0x70, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0xb4, 0x00, 0x00, 0x00, 0x03, 0x00,
    0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0xd4, 0x00, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0xf8, 0x00, 0x00, 0x00,
    0x06, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x20, 0x01, 0x00, 0x00, 0x03, 0x10, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x40, 0x01,
    0x00, 0x00, 0x01, 0x20, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x48, 0x01, 0x00, 0x00, 0x06, 0x20, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00,
    0x60, 0x01, 0x00, 0x00, 0x01, 0x10, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x80, 0x01, 0x00, 0x00, 0x02, 0x20, 0x00, 0x00, 0x11, 0x00,
    0x00, 0x00, 0x90, 0x01, 0x00, 0x00, 0x03, 0x20, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0xe1, 0x02, 0x00, 0x00, 0x04, 0x20, 0x00, 0x00,
    0x01, 0x00, 0x00, 0x00, 0xe6, 0x02, 0x00, 0x00, 0x00, 0x20, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0xee, 0x02, 0x00, 0x00, 0x00, 0x10,
    0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x04, 0x03, 0x00, 0x00,
];
function useTrustManager(loader) {
    loader ??= Java.classFactory.loader ?? undefined;
    if (!loader) {
        throw Error('ClassLoader not found !');
    }
    const InMemoryDexClassLoader = (0,_clockwork_common__WEBPACK_IMPORTED_MODULE_1__.findClass)('dalvik.system.InMemoryDexClassLoader', loader);
    const ByteBuffer = (0,_clockwork_common__WEBPACK_IMPORTED_MODULE_1__.findClass)('java.nio.ByteBuffer', loader);
    if (!InMemoryDexClassLoader || !ByteBuffer) {
        throw Error(`InMemoryDexClassLoader: ${InMemoryDexClassLoader}, ByteBuffer: ${ByteBuffer}`);
    }
    const inMemory = InMemoryDexClassLoader.$new(ByteBuffer.wrap(Java.array('B', dexBytes)), loader);
    return (0,_clockwork_common__WEBPACK_IMPORTED_MODULE_1__.getClass)(className, inMemory);
}
function injectSsl() {
    const uniqHook = (0,_clockwork_hooks__WEBPACK_IMPORTED_MODULE_0__.getHookUnique)();
    const mTrustManagers = [];
    uniqHook('javax.net.ssl.SSLContext', 'init', {
        replace(method, ...args) {
            if (mTrustManagers.length === 0) {
                const mgr = useTrustManager()?.$new();
                if (mgr)
                    mTrustManagers.push(mgr);
            }
            if (mTrustManagers.length > 0) {
                args[1] = mTrustManagers;
            }
            return method.call(this, ...args);
        },
    });
    uniqHook('okhttp3.CertificatePinner', 'check', {
        replace: (0,_clockwork_hooks_dist_addons_js__WEBPACK_IMPORTED_MODULE_2__.always)(true),
    });
    uniqHook('com.android.org.conscrypt.TrustManagerImpl', 'verifyChain', {
        replace: (_, ...params) => params[0],
    });
    uniqHook('com.datatheorem.android.trustkit.pinning.OkHostnameVerifier', 'verify', {
        replace: (0,_clockwork_hooks_dist_addons_js__WEBPACK_IMPORTED_MODULE_2__.always)(true),
    });
    uniqHook('appcelerator.https.PinningTrustManager', 'checkServerTrusted', {
        replace: (0,_clockwork_hooks_dist_addons_js__WEBPACK_IMPORTED_MODULE_2__.always)(null),
    });
}

//# sourceMappingURL=trustmanager.js.map

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./agent/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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OztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpQ0FBaUM7QUFDakMsaUNBQWlDOztBQUVqQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3Q0FBd0MsSUFBSSx3Q0FBd0M7O0FBRXBGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixpQkFBaUI7O0FBRXZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUI7QUFDbkIsMkJBQTJCO0FBQzNCOztBQUVBLHVCQUF1QjtBQUN2Qix3QkFBd0I7QUFDeEIsdUJBQXVCO0FBQ3ZCLHNCQUFzQiw0Q0FBNEM7O0FBRWxFO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxLQUFLO0FBQ0w7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUEseUJBQXNCO0FBQ3RCLG1CQUFtQjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbGNuQixpRUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBLENBQUMsRUFBQzs7QUFFSztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hCMEI7O0FBRTFCO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxFQUFFLHNDQUFzQzs7QUFFeEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxFQUFFLGdDQUFHLElBQUksdUNBQVUsSUFBSSx1Q0FBVTs7QUFFakM7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0JBQXNCLEtBQUssWUFBWSxNQUFNOztBQUU3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTyx3QkFBd0IsOEJBQThCLElBQUk7QUFDakU7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLDBCQUEwQjtBQUN0RDtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3JKc0M7QUFDVTtBQUNSO0FBQ0U7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLElBQUksRUFBRSxHQUFHO0FBQzVCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLElBQUksRUFBRSxJQUFJO0FBQzdCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLElBQUksRUFBRSxLQUFLO0FBQzlCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLElBQUksRUFBRSxFQUFFO0FBQzNCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsWUFBWSxFQUFFLGdFQUFpQixLQUFLLG1CQUFtQixjQUFjLEVBQUUsZ0VBQWlCLEtBQUs7QUFDbkgsSUFBSSxzREFBSSxDQUFDLHNEQUFPLHVDQUF1QyxTQUFTLHdEQUFNLFVBQVU7QUFDaEYsSUFBSSxzREFBSSxDQUFDLHNEQUFPLHVDQUF1QyxTQUFTLHdEQUFNLGlCQUFpQjtBQUN2RixJQUFJLHNEQUFJLENBQUMsc0RBQU8sMkNBQTJDLFNBQVMsd0RBQU0sbUJBQW1CO0FBQzdGLElBQUksc0RBQUksQ0FBQyxzREFBTywyQ0FBMkMsU0FBUyx3REFBTSxpQkFBaUI7QUFDM0YsSUFBSSxzREFBSSxDQUFDLHNEQUFPLCtDQUErQyxTQUFTLHdEQUFNLG1CQUFtQjtBQUNqRyxJQUFJLHNEQUFJLENBQUMsc0RBQU8seUNBQXlDLFNBQVMsd0RBQU0sa0JBQWtCO0FBQzFGLElBQUksc0RBQUksQ0FBQyxzREFBTyw2Q0FBNkMsU0FBUyx3REFBTSxrQkFBa0I7QUFDOUYsSUFBSSxzREFBSSxDQUFDLHNEQUFPLHdDQUF3QyxTQUFTLHdEQUFNLGNBQWM7QUFDckYsSUFBSSxzREFBSSxDQUFDLHNEQUFPLHNCQUFzQixTQUFTLHdEQUFNLHFCQUFxQjtBQUMxRSxJQUFJLHNEQUFJLENBQUMsc0RBQU87QUFDaEIsdUJBQXVCLHNEQUFPO0FBQzlCLG1CQUFtQiw0QkFBNEI7QUFDL0MsS0FBSztBQUNMLDRDQUE0QyxrQ0FBa0MsOEJBQThCO0FBQzVHLDZDQUE2QyxrQ0FBa0MsOEJBQThCO0FBQzdHLG1EQUFtRCxzQ0FBc0MsOEJBQThCO0FBQ3ZILDBDQUEwQyxxQ0FBcUMsOEJBQThCO0FBQzdHLElBQUksc0RBQUksQ0FBQyxzREFBTztBQUNoQiwwQkFBMEIsc0RBQU07QUFDaEM7QUFDQSw2QkFBNkIsc0RBQU8sc0JBQXNCLHNEQUFPO0FBQ2pFLHdCQUF3QixzREFBTyx5QkFBeUIsc0RBQU8sdUNBQXVDLHNEQUFPO0FBQzdHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9FQUFvRSw2QkFBNkI7QUFDakc7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDZ0I7QUFDaEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2Rm9DO0FBQ29CO0FBQ2hCO0FBQ3hDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNId0Y7QUFDbkM7QUFDQztBQUN0RCxlQUFlLDZEQUFTO0FBQ3hCO0FBQ0E7QUFDQSxtQkFBbUIsc0RBQU87QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0EsSUFBSSx5REFBVztBQUNmO0FBQ0E7QUFDQSx1QkFBdUIsNERBQVMsQ0FBQyw0REFBYTtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qiw0REFBUztBQUNyQztBQUNBLGlEQUFpRCxnQkFBZ0I7QUFDakU7QUFDQTtBQUNBLFFBQVEsc0RBQUk7QUFDWjtBQUNBO0FBQ0Esa0NBQWtDLDREQUFTLENBQUMsNERBQWE7QUFDekQ7QUFDQSx1REFBdUQsNERBQWEsOEJBQThCO0FBQ2xHO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQiw0REFBWTtBQUN0Qyx1QkFBdUIsNkRBQWE7QUFDcEMsdUJBQXVCLCtEQUFlO0FBQ3RDLHVCQUF1Qiw2REFBYTtBQUNwQztBQUNBLHVCQUF1Qiw0REFBWTtBQUNuQywwQkFBMEIsNkRBQWEsTUFBTSxFQUFFLDREQUFZLE1BQU0sRUFBRSw2REFBYSxNQUFNO0FBQ3RGO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNULFFBQVEsc0RBQUk7QUFDWjtBQUNBO0FBQ0Esd0NBQXdDLDREQUFTLENBQUMsNERBQWE7QUFDL0Q7QUFDQSwyREFBMkQsNERBQWEsaUJBQWlCO0FBQ3pGO0FBQ0E7QUFDQSxnQkFBZ0IsbUVBQWdCO0FBQ2hDO0FBQ0Esd0JBQXdCLHNEQUFJO0FBQzVCLHFCQUFxQjtBQUNyQixpQkFBaUI7QUFDakI7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0EsSUFBSSxzREFBSSxvQkFBb0Isb0JBQW9CO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBLElBQUksbUVBQWdCO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxtRUFBZ0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQSxvQ0FBb0MsMkJBQTJCO0FBQy9EO0FBQ0E7QUFDQSx1Q0FBdUMsNERBQWE7QUFDcEQ7QUFDQSx1Q0FBdUMsMkJBQTJCO0FBQ2xFLG9DQUFvQyw0REFBYTtBQUNqRDtBQUNBLG1EQUFtRCwyQkFBMkI7QUFDOUU7QUFDQTtBQUMwQztBQUMxQzs7Ozs7Ozs7Ozs7Ozs7OztBQzdINEM7QUFDQTtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxxREFBYTtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCLHFCQUFxQjtBQUNyQjtBQUNBLHdCQUF3QixzREFBTSxRQUFRLGNBQWM7QUFDcEQscUJBQXFCO0FBQ3JCLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ3VCO0FBQ3ZCOzs7Ozs7Ozs7Ozs7Ozs7O0FDcENvRDtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsZ0VBQVk7QUFDTTtBQUN2Qzs7Ozs7Ozs7Ozs7Ozs7O0FDekRxRDtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixpRUFBYTtBQUNWO0FBQzNCOzs7Ozs7Ozs7Ozs7OztBQ2xIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDK0I7QUFDL0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQy9CMEU7QUFDdkI7QUFDWjtBQUM0QztBQUNqRDtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMseURBQU87QUFDckIsV0FBVyx5REFBTztBQUNsQjtBQUNBO0FBQ0EsY0FBYyx5REFBTztBQUNyQixrQkFBa0IseURBQU87QUFDekIsY0FBYyxNQUFNO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBLGVBQWUsaURBQVM7QUFDeEIsS0FBSztBQUNMLENBQUM7QUFDbUs7QUFDcEs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDdUM7QUFDdkM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZDNEM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixPQUFPO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQU0sU0FBUyxrQkFBa0I7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsVUFBVTtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLHNEQUFNLFFBQVEsbUJBQW1CLFdBQVcsV0FBVztBQUNuRTtBQUNBO0FBQ0EsdUJBQXVCLGdCQUFnQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDZ0U7QUFDaEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsRUE7QUFDQSx5QkFBeUIsUUFBUTtBQUNqQztBQUNBO0FBQ0E7QUFDQSxjQUFjLFFBQVE7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsWUFBWTtBQUNoQyxtQkFBbUIsc0NBQXNDO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyx3QkFBd0I7QUFDbkM7QUFDQTtBQUNBLHFFQUFxRTtBQUNyRTtBQUNBO0FBQ0E7QUFDNEU7QUFDNUU7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDbUM7QUFDbkM7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoQjRDO0FBQ1g7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLDhDQUFJLENBQUMsc0RBQU87QUFDcEI7QUFDQSx1QkFBdUIsK0JBQStCO0FBQ3RELFNBQVM7QUFDVCxRQUFRLDhDQUFJLENBQUMsc0RBQU87QUFDcEI7QUFDQSx1QkFBdUIsa0JBQWtCO0FBQ3pDLFNBQVM7QUFDVCxRQUFRLDhDQUFJLENBQUMsc0RBQU87QUFDcEI7QUFDQSx1QkFBdUIsa0JBQWtCO0FBQ3pDLFNBQVM7QUFDVCxRQUFRLDhDQUFJLENBQUMsc0RBQU87QUFDcEI7QUFDQSx1QkFBdUIsa0JBQWtCO0FBQ3pDLFNBQVM7QUFDVCxRQUFRLDhDQUFJLENBQUMsc0RBQU87QUFDcEI7QUFDQSx1QkFBdUIsa0JBQWtCO0FBQ3pDLFNBQVM7QUFDVCxRQUFRLDhDQUFJLENBQUMsc0RBQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxDQUFDLGtDQUFrQztBQUNaO0FBQ3ZCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pEd0M7QUFDa0I7QUFDZDtBQUNiO0FBQy9CLGtEQUFrRDtBQUNsRCxZQUFZLG9EQUFvRDtBQUNoRSxtQkFBbUIscURBQVM7QUFDNUIsa0JBQWtCLDZEQUFVO0FBQzVCO0FBQ0EsV0FBVyxjQUFjO0FBQ3pCLG9DQUFvQyxZQUFZLGVBQWUsT0FBTztBQUN0RTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0Isd0NBQUc7QUFDbkIsZ0JBQWdCLHdDQUFHO0FBQ25CLHVDQUF1Qyx3Q0FBRztBQUMxQyxvQkFBb0Isc0JBQXNCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQix3Q0FBRztBQUN6QixnQkFBZ0IsZ0JBQWdCO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsNERBQVM7QUFDM0I7QUFDQSxRQUFRLHNEQUFNLFNBQVMsaUJBQWlCLFdBQVcsV0FBVztBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUMsc0JBQXNCLDREQUFTO0FBQy9CO0FBQ0EsWUFBWSxzREFBTSxRQUFRLG1CQUFtQixXQUFXLFdBQVc7QUFDbkU7QUFDQTtBQUNBLHVCQUF1QixnQkFBZ0IsSUFBSSxXQUFXO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUN5QztBQUN6Qzs7Ozs7Ozs7Ozs7Ozs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsVUFBVTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixVQUFVLElBQUksT0FBTztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixJQUFJO0FBQzFCO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixhQUFhLEdBQUcsSUFBSSxHQUFHLEVBQUU7QUFDM0M7QUFDQTtBQUNBLENBQUMsa0JBQWtCO0FBQ0o7QUFDZjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxQjBEO0FBQ1g7QUFDbkI7QUFDMEI7QUFDdEQ7Ozs7Ozs7Ozs7Ozs7Ozs7QUNKbUQ7QUFDOEI7QUFDakYsUUFBUSxtRUFBbUUsRUFBRSx5REFBUztBQUN0RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLDREQUFZO0FBQzNCLEtBQUs7QUFDTDtBQUNBLG1CQUFtQixnRUFBaUI7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSwyREFBMkQsNERBQWE7QUFDeEUsbUJBQW1CLDREQUFZO0FBQy9CO0FBQ0E7QUFDQSxtQkFBbUIsNERBQVksSUFBSSxJQUFJO0FBQ3ZDO0FBQ0E7QUFDQSxtQkFBbUIsNERBQVksSUFBSSxLQUFLO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixzREFBTztBQUMxQjtBQUNBO0FBQ0Esc0JBQXNCLElBQUksR0FBRyxXQUFXO0FBQ3hDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0Qyx1Q0FBdUMsRUFBRSxtQkFBbUI7QUFDeEcsdUNBQXVDLE9BQU87QUFDOUMsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyw2REFBYTtBQUMzQjtBQUNBLGNBQWMsNkRBQWE7QUFDM0I7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLDZEQUFhO0FBQy9CO0FBQ0Esa0JBQWtCLDZEQUFhO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLDZEQUFhO0FBQy9CO0FBQ0Esa0JBQWtCLDZEQUFhO0FBQy9CO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLDJCQUEyQjtBQUM1QztBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EseUJBQXlCLEVBQUUsR0FBRyxHQUFHLEtBQUssY0FBYztBQUNwRCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QyxxQkFBcUI7QUFDOUQ7QUFDQSxRQUFRLHNEQUFNO0FBQ2QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsbUJBQW1CLGdFQUFpQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0Esa0hBQWtILDREQUFhO0FBQy9ILHNCQUFzQixJQUFJO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHNEQUFPO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLHNEQUFPO0FBQzFCO0FBQ0E7QUFDQSxzQkFBc0IsSUFBSSxHQUFHLFdBQVc7QUFDeEM7QUFDQSxLQUFLO0FBQ0w7QUFDQSxxQ0FBcUMsd0RBQXdEO0FBQzdGLFFBQVEsc0RBQU07QUFDZCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsUUFBUSxzREFBTTtBQUNkLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixpRUFBYztBQUM5QixTQUFTO0FBQ1QsUUFBUSxzREFBTTtBQUNkLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULFFBQVEsc0RBQU07QUFDZCxLQUFLO0FBQ0w7QUFDQTtBQUNBLDRCQUE0Qix3Q0FBd0M7QUFDcEUsMkJBQTJCO0FBQzNCO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDcUI7QUFDckI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwTnFFO0FBQ25CO0FBQ0k7QUFDWDtBQUNpQjtBQUM1RCxlQUFlLDZEQUFTO0FBQ3hCLFFBQVEsc0NBQXNDLEVBQUUseURBQVM7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFVBQVU7QUFDakMsVUFBVSwrREFBZTtBQUN6QjtBQUNBLFVBQVUsNERBQVk7QUFDdEIsVUFBVSw2REFBYTtBQUN2QixnQ0FBZ0MsK0RBQWU7QUFDL0MsVUFBVSw2REFBYTtBQUN2QjtBQUNBLFVBQVUsK0RBQWU7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSwrREFBZTtBQUN6QjtBQUNBLFVBQVUsNERBQVk7QUFDdEIsVUFBVSw2REFBYTtBQUN2QjtBQUNBO0FBQ0EsdUNBQXVDLElBQUk7QUFDM0M7QUFDQTtBQUNBLFVBQVUsNkRBQWE7QUFDdkI7QUFDQSxVQUFVLCtEQUFlO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixJQUFJO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVELHNEQUFPO0FBQzlELG9DQUFvQyw0REFBWTtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyw0REFBWTtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsNERBQVk7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsNERBQVk7QUFDNUM7QUFDQTtBQUNBO0FBQ0EsbURBQW1ELHNEQUFPO0FBQzFEO0FBQ0EsZ0NBQWdDLHNEQUFPO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsTUFBTTtBQUN4QixxQkFBcUI7QUFDckIsd0JBQXdCLGdFQUFpQjtBQUN6QyxvQkFBb0Isc0RBQU87QUFDM0IsOEJBQThCLGlCQUFpQixzREFBTyxTQUFTO0FBQy9EO0FBQ0E7QUFDQSxzQkFBc0IsaUJBQWlCLHNEQUFPLFNBQVM7QUFDdkQ7QUFDQTtBQUNBLGNBQWMsZUFBZSxFQUFFLEtBQUs7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsOEVBQXNCO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsZUFBZTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsb0RBQVM7QUFDbEQ7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLG9EQUFTO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLG9EQUFTO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyRUFBMkUsT0FBTztBQUNsRixvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0EsK0VBQStFLE9BQU87QUFDdEYsb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBLDJFQUEyRSxPQUFPO0FBQ2xGLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQSxnRkFBZ0YsU0FBUyxLQUFLLFFBQVE7QUFDdEcsb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBLG1GQUFtRixTQUFTLEtBQUssUUFBUTtBQUN6RyxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0EsaUZBQWlGLE9BQU8sSUFBSSx5QkFBeUI7QUFDckgsb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsMkVBQTJFLHFCQUFxQjtBQUNoRyxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0Esb0VBQW9FLHNCQUFzQjtBQUMxRixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWixRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLHFDQUFxQyx5QkFBeUI7QUFDOUQ7QUFDQSwrQkFBK0IsMERBQWM7QUFDN0M7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsVUFBVSxJQUFJLEtBQUssRUFBRSxJQUFJO0FBQ3RELGdCQUFnQjtBQUNoQixZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLFVBQVUsSUFBSSxLQUFLLEVBQUUsSUFBSTtBQUN0RCxnQkFBZ0I7QUFDaEIsWUFBWTtBQUNaLCtCQUErQixlQUFlO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLHlEQUFhO0FBQzVDO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMLG1DQUFtQyxlQUFlO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IseURBQWE7QUFDNUM7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0wsK0JBQStCLGVBQWU7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IseURBQWE7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDZ0M7QUFDaEM7Ozs7Ozs7Ozs7Ozs7OztBQzlWeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3REFBd0QsZ0VBQWlCO0FBQ3pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsZ0VBQWlCO0FBQ2xEO0FBQ0E7QUFDc0I7QUFDdEI7Ozs7Ozs7Ozs7Ozs7OztBQ2pDQTtBQUNBLGFBQWEsT0FBTyx1QkFBdUIsMkRBQTJEO0FBQ3RHLGFBQWEsT0FBTyx1QkFBdUIsMkRBQTJEO0FBQ3RHLGFBQWEsT0FBTyx1QkFBdUIsMkRBQTJEO0FBQ3RHLGFBQWEsT0FBTyx1QkFBdUIsMkRBQTJEO0FBQ3RHLGtCQUFrQixPQUFPLGdDQUFnQywwRUFBMEU7QUFDbkk7QUFDQSxlQUFlLHlFQUF5RTtBQUN4RjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsMkNBQTJDO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxnREFBZ0Q7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLCtDQUErQztBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsc0VBQXNFO0FBQ3JGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSw0Q0FBNEM7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLHdEQUF3RDtBQUN2RTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUscUVBQXFFO0FBQ3BGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSw4Q0FBOEM7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLG1EQUFtRDtBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsc0NBQXNDO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxnQ0FBZ0M7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsc0JBQXNCLE9BQU8sZ0NBQWdDLDhFQUE4RTtBQUMzSTtBQUNBLGVBQWUseUNBQXlDO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSx3Q0FBd0M7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLDhDQUE4QztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsOENBQThDO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSwyQ0FBMkM7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLDJDQUEyQztBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsMERBQTBEO0FBQ3pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSw4Q0FBOEM7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLHdDQUF3QztBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsNkNBQTZDO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxpRUFBaUU7QUFDaEY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLHFFQUFxRTtBQUNwRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUscUVBQXFFO0FBQ3BGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSw2Q0FBNkM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLHlEQUF5RDtBQUN4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsaUVBQWlFO0FBQ2hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxrRUFBa0U7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLHNFQUFzRTtBQUNyRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsc0VBQXNFO0FBQ3JGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxtRUFBbUU7QUFDbEY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLHVFQUF1RTtBQUN0RjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsdUVBQXVFO0FBQ3RGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxnRUFBZ0U7QUFDL0U7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLG9FQUFvRTtBQUNuRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsb0VBQW9FO0FBQ25GO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxnRUFBZ0U7QUFDL0U7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLG9FQUFvRTtBQUNuRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsb0VBQW9FO0FBQ25GO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxpRUFBaUU7QUFDaEY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLHFFQUFxRTtBQUNwRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUscUVBQXFFO0FBQ3BGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSwrREFBK0Q7QUFDOUU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLG1FQUFtRTtBQUNsRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsbUVBQW1FO0FBQ2xGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxnRUFBZ0U7QUFDL0U7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLG9FQUFvRTtBQUNuRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsb0VBQW9FO0FBQ25GO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxpRUFBaUU7QUFDaEY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLHFFQUFxRTtBQUNwRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUscUVBQXFFO0FBQ3BGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxrRUFBa0U7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLHNFQUFzRTtBQUNyRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsc0VBQXNFO0FBQ3JGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSwrREFBK0Q7QUFDOUU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLG1FQUFtRTtBQUNsRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsbUVBQW1FO0FBQ2xGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSw0RUFBNEU7QUFDM0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLGdGQUFnRjtBQUMvRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsZ0ZBQWdGO0FBQy9GO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSw2RUFBNkU7QUFDNUY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLGlGQUFpRjtBQUNoRztBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsaUZBQWlGO0FBQ2hHO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSwwRUFBMEU7QUFDekY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLDhFQUE4RTtBQUM3RjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsOEVBQThFO0FBQzdGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSwwRUFBMEU7QUFDekY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLDhFQUE4RTtBQUM3RjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsOEVBQThFO0FBQzdGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSwyRUFBMkU7QUFDMUY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLCtFQUErRTtBQUM5RjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsK0VBQStFO0FBQzlGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSx5RUFBeUU7QUFDeEY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLDZFQUE2RTtBQUM1RjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsNkVBQTZFO0FBQzVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSwwRUFBMEU7QUFDekY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLDhFQUE4RTtBQUM3RjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsOEVBQThFO0FBQzdGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSwyRUFBMkU7QUFDMUY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLCtFQUErRTtBQUM5RjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsK0VBQStFO0FBQzlGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSw0RUFBNEU7QUFDM0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLGdGQUFnRjtBQUMvRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsZ0ZBQWdGO0FBQy9GO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSx5RUFBeUU7QUFDeEY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLDZFQUE2RTtBQUM1RjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsNkVBQTZFO0FBQzVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxnRUFBZ0U7QUFDL0U7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLDBEQUEwRDtBQUN6RTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsMkRBQTJEO0FBQzFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSx3REFBd0Q7QUFDdkU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLHdEQUF3RDtBQUN2RTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUseURBQXlEO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSx1REFBdUQ7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLHdEQUF3RDtBQUN2RTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUseURBQXlEO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSwwREFBMEQ7QUFDekU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLGtFQUFrRTtBQUNqRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsbUVBQW1FO0FBQ2xGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxnRUFBZ0U7QUFDL0U7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLGdFQUFnRTtBQUMvRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsaUVBQWlFO0FBQ2hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSwrREFBK0Q7QUFDOUU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLGdFQUFnRTtBQUMvRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsaUVBQWlFO0FBQ2hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxrRUFBa0U7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLGlFQUFpRTtBQUNoRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsaUVBQWlFO0FBQ2hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxxRUFBcUU7QUFDcEY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLHFFQUFxRTtBQUNwRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsa0VBQWtFO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxzRUFBc0U7QUFDckY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLHNFQUFzRTtBQUNyRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsK0RBQStEO0FBQzlFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxtRUFBbUU7QUFDbEY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLG1FQUFtRTtBQUNsRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsK0RBQStEO0FBQzlFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxtRUFBbUU7QUFDbEY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLG1FQUFtRTtBQUNsRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsZ0VBQWdFO0FBQy9FO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxvRUFBb0U7QUFDbkY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLG9FQUFvRTtBQUNuRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsOERBQThEO0FBQzdFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxrRUFBa0U7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLGtFQUFrRTtBQUNqRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsK0RBQStEO0FBQzlFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxtRUFBbUU7QUFDbEY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLG1FQUFtRTtBQUNsRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsZ0VBQWdFO0FBQy9FO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxvRUFBb0U7QUFDbkY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLG9FQUFvRTtBQUNuRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsaUVBQWlFO0FBQ2hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxxRUFBcUU7QUFDcEY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLHFFQUFxRTtBQUNwRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsOERBQThEO0FBQzdFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxrRUFBa0U7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLGtFQUFrRTtBQUNqRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsZ0VBQWdFO0FBQy9FO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSx5REFBeUQ7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLDBEQUEwRDtBQUN6RTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsdURBQXVEO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSx1REFBdUQ7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLHdEQUF3RDtBQUN2RTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsc0RBQXNEO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSx1REFBdUQ7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLHdEQUF3RDtBQUN2RTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUseURBQXlEO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxpRUFBaUU7QUFDaEY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLGtFQUFrRTtBQUNqRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsK0RBQStEO0FBQzlFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSwrREFBK0Q7QUFDOUU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLGdFQUFnRTtBQUMvRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsOERBQThEO0FBQzdFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSwrREFBK0Q7QUFDOUU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLGdFQUFnRTtBQUMvRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsaUVBQWlFO0FBQ2hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxzREFBc0Q7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLDRDQUE0QztBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsMERBQTBEO0FBQ3pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxxREFBcUQ7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLDRDQUE0QztBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsNENBQTRDO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSx5REFBeUQ7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLG9EQUFvRDtBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsMkNBQTJDO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxzRUFBc0U7QUFDckY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLDREQUE0RDtBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsb0VBQW9FO0FBQ25GO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxrREFBa0Q7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLCtDQUErQztBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsK0NBQStDO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxnREFBZ0Q7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLDhDQUE4QztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsK0NBQStDO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxnREFBZ0Q7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLGlEQUFpRDtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsbUVBQW1FO0FBQ2xGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSw2REFBNkQ7QUFDNUU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLDZEQUE2RDtBQUM1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsK0RBQStEO0FBQzlFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSwyREFBMkQ7QUFDMUU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLDZEQUE2RDtBQUM1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsK0RBQStEO0FBQzlFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxpRUFBaUU7QUFDaEY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLHNFQUFzRTtBQUNyRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsZ0VBQWdFO0FBQy9FO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxnRUFBZ0U7QUFDL0U7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLGtFQUFrRTtBQUNqRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsOERBQThEO0FBQzdFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxnRUFBZ0U7QUFDL0U7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLGtFQUFrRTtBQUNqRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsb0VBQW9FO0FBQ25GO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxnRkFBZ0Y7QUFDL0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLDBFQUEwRTtBQUN6RjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsMEVBQTBFO0FBQ3pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSw0RUFBNEU7QUFDM0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLHdFQUF3RTtBQUN2RjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsMEVBQTBFO0FBQ3pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSw0RUFBNEU7QUFDM0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLDhFQUE4RTtBQUM3RjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsZ0ZBQWdGO0FBQy9GO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSwwRUFBMEU7QUFDekY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLDBFQUEwRTtBQUN6RjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsNEVBQTRFO0FBQzNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSx3RUFBd0U7QUFDdkY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLDBFQUEwRTtBQUN6RjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsNEVBQTRFO0FBQzNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSw4RUFBOEU7QUFDN0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLHNFQUFzRTtBQUNyRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsMENBQTBDO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSwyQ0FBMkM7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLDJDQUEyQztBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsNENBQTRDO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSx1RUFBdUU7QUFDdEY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLHNFQUFzRTtBQUNyRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsd0RBQXdEO0FBQ3ZFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSwyREFBMkQ7QUFDMUU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLDBEQUEwRDtBQUN6RTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUscURBQXFEO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSw0Q0FBNEM7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLHlDQUF5QztBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsb0NBQW9DO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxxREFBcUQ7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxlQUFlLDRDQUE0QztBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsNENBQTRDO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZSxxREFBcUQ7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkMsS0FBSztBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDMkI7QUFDM0I7Ozs7Ozs7Ozs7Ozs7OztBQzVtRDRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5REFBYTtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLCtCQUErQjtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQzZCO0FBQzdCOzs7Ozs7Ozs7Ozs7Ozs7QUN6RjJEO0FBQzNELHFDQUFxQyxvRUFBaUI7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNrQztBQUNsQzs7Ozs7Ozs7Ozs7Ozs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNxQjtBQUNyQjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDVDhFO0FBQ2pDO0FBQ0Y7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsMkZBQTJGO0FBQzNHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxTQUFTO0FBQ1QsUUFBUSw4Q0FBTTtBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDO0FBQ0Esd0JBQXdCLG1EQUFtRDtBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsMEVBQTBFO0FBQ2pIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsc0JBQXNCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLHlFQUF5RTtBQUNsSDtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1VFTkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mcmlkYS1jbG9ja3dvcmsvLi9ub2RlX21vZHVsZXMvcXVpY2stZm9ybWF0LXVuZXNjYXBlZC9pbmRleC5qcyIsIndlYnBhY2s6Ly9mcmlkYS1jbG9ja3dvcmsvLi9hZ2VudC9pbmRleC50cyIsIndlYnBhY2s6Ly9mcmlkYS1jbG9ja3dvcmsvLi9ub2RlX21vZHVsZXMvcGluby9icm93c2VyLmpzIiwid2VicGFjazovL2ZyaWRhLWNsb2Nrd29yay8uL25vZGVfbW9kdWxlcy9AZnJpZGEvdHR5L2luZGV4LmpzIiwid2VicGFjazovL2ZyaWRhLWNsb2Nrd29yay8uL25vZGVfbW9kdWxlcy9jb2xvcmV0dGUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZnJpZGEtY2xvY2t3b3JrLy4vcGFja2FnZXMvYW50aWNsb2FrL2Rpc3QvY291bnRyeS5qcyIsIndlYnBhY2s6Ly9mcmlkYS1jbG9ja3dvcmsvLi9wYWNrYWdlcy9hbnRpY2xvYWsvZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly9mcmlkYS1jbG9ja3dvcmsvLi9wYWNrYWdlcy9hbnRpY2xvYWsvZGlzdC9pbnN0YWxsUmVmZXJyZXIuanMiLCJ3ZWJwYWNrOi8vZnJpZGEtY2xvY2t3b3JrLy4vcGFja2FnZXMvYW50aWNsb2FrL2Rpc3QvamlnYXUuanMiLCJ3ZWJwYWNrOi8vZnJpZGEtY2xvY2t3b3JrLy4vcGFja2FnZXMvY29tbW9uL2Rpc3QvZGVmaW5lL2phdmEuanMiLCJ3ZWJwYWNrOi8vZnJpZGEtY2xvY2t3b3JrLy4vcGFja2FnZXMvY29tbW9uL2Rpc3QvZGVmaW5lL2xpYmMuanMiLCJ3ZWJwYWNrOi8vZnJpZGEtY2xvY2t3b3JrLy4vcGFja2FnZXMvY29tbW9uL2Rpc3QvZGVmaW5lL3N0ZC5qcyIsIndlYnBhY2s6Ly9mcmlkYS1jbG9ja3dvcmsvLi9wYWNrYWdlcy9jb21tb24vZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly9mcmlkYS1jbG9ja3dvcmsvLi9wYWNrYWdlcy9jb21tb24vZGlzdC9pbnRlcm5hbC9wcm94eS5qcyIsIndlYnBhY2s6Ly9mcmlkYS1jbG9ja3dvcmsvLi9wYWNrYWdlcy9jb21tb24vZGlzdC9zZWFyY2guanMiLCJ3ZWJwYWNrOi8vZnJpZGEtY2xvY2t3b3JrLy4vcGFja2FnZXMvY29tbW9uL2Rpc3QvdGV4dC5qcyIsIndlYnBhY2s6Ly9mcmlkYS1jbG9ja3dvcmsvLi9wYWNrYWdlcy9ob29rcy9kaXN0L2FkZG9ucy5qcyIsIndlYnBhY2s6Ly9mcmlkYS1jbG9ja3dvcmsvLi9wYWNrYWdlcy9ob29rcy9kaXN0L2NsYXNzbG9hZGVyLmpzIiwid2VicGFjazovL2ZyaWRhLWNsb2Nrd29yay8uL3BhY2thZ2VzL2hvb2tzL2Rpc3QvaG9vay5qcyIsIndlYnBhY2s6Ly9mcmlkYS1jbG9ja3dvcmsvLi9wYWNrYWdlcy9ob29rcy9kaXN0L2lkcy5qcyIsIndlYnBhY2s6Ly9mcmlkYS1jbG9ja3dvcmsvLi9wYWNrYWdlcy9ob29rcy9kaXN0L2luZGV4LmpzIiwid2VicGFjazovL2ZyaWRhLWNsb2Nrd29yay8uL3BhY2thZ2VzL2hvb2tzL2Rpc3QvbG9nZ2VyLmpzIiwid2VicGFjazovL2ZyaWRhLWNsb2Nrd29yay8uL3BhY2thZ2VzL2puaXRyYWNlL2Rpc3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZnJpZGEtY2xvY2t3b3JrLy4vcGFja2FnZXMvam5pdHJhY2UvZGlzdC9qYXZhTWV0aG9kLmpzIiwid2VicGFjazovL2ZyaWRhLWNsb2Nrd29yay8uL3BhY2thZ2VzL2puaXRyYWNlL2Rpc3Qvam5pLmpzIiwid2VicGFjazovL2ZyaWRhLWNsb2Nrd29yay8uL3BhY2thZ2VzL2puaXRyYWNlL2Rpc3Qvam5pRW52SW50ZXJjZXB0b3IuanMiLCJ3ZWJwYWNrOi8vZnJpZGEtY2xvY2t3b3JrLy4vcGFja2FnZXMvam5pdHJhY2UvZGlzdC9qbmlFbnZJbnRlcmNlcHRvckFybTY0LmpzIiwid2VicGFjazovL2ZyaWRhLWNsb2Nrd29yay8uL3BhY2thZ2VzL2puaXRyYWNlL2Rpc3Qvam5pTWV0aG9kLmpzIiwid2VicGFjazovL2ZyaWRhLWNsb2Nrd29yay8uL3BhY2thZ2VzL2puaXRyYWNlL2Rpc3QvdHJhY2VyLmpzIiwid2VicGFjazovL2ZyaWRhLWNsb2Nrd29yay8uL3BhY2thZ2VzL2xvZ2dpbmcvZGlzdC9hdXRvY29sb3IuanMiLCJ3ZWJwYWNrOi8vZnJpZGEtY2xvY2t3b3JrLy4vcGFja2FnZXMvbG9nZ2luZy9kaXN0L2NvbG9yLmpzIiwid2VicGFjazovL2ZyaWRhLWNsb2Nrd29yay8uL3BhY2thZ2VzL2xvZ2dpbmcvZGlzdC9maWx0ZXIuanMiLCJ3ZWJwYWNrOi8vZnJpZGEtY2xvY2t3b3JrLy4vcGFja2FnZXMvbG9nZ2luZy9kaXN0L2luZGV4LmpzIiwid2VicGFjazovL2ZyaWRhLWNsb2Nrd29yay8uL3BhY2thZ2VzL25hdGl2ZS9kaXN0L2hvb2FoLmpzIiwid2VicGFjazovL2ZyaWRhLWNsb2Nrd29yay8uL3BhY2thZ2VzL25hdGl2ZS9kaXN0L2luZGV4LmpzIiwid2VicGFjazovL2ZyaWRhLWNsb2Nrd29yay8uL3BhY2thZ2VzL25hdGl2ZS9kaXN0L2luamVjdC5qcyIsIndlYnBhY2s6Ly9mcmlkYS1jbG9ja3dvcmsvLi9wYWNrYWdlcy9uYXRpdmUvZGlzdC9yZWdpc3Rlck5hdGl2ZXMuanMiLCJ3ZWJwYWNrOi8vZnJpZGEtY2xvY2t3b3JrLy4vcGFja2FnZXMvbmF0aXZlL2Rpc3Qvc3lzdGVtUHJvcGVydHlHZXQuanMiLCJ3ZWJwYWNrOi8vZnJpZGEtY2xvY2t3b3JrLy4vcGFja2FnZXMvbmF0aXZlL2Rpc3QvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vZnJpZGEtY2xvY2t3b3JrLy4vcGFja2FnZXMvbmV0d29yay9kaXN0L2hvc3RhZGRyLmpzIiwid2VicGFjazovL2ZyaWRhLWNsb2Nrd29yay8uL3BhY2thZ2VzL25ldHdvcmsvZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly9mcmlkYS1jbG9ja3dvcmsvLi9wYWNrYWdlcy9uZXR3b3JrL2Rpc3Qvc29ja2V0LmpzIiwid2VicGFjazovL2ZyaWRhLWNsb2Nrd29yay8uL3BhY2thZ2VzL25ldHdvcmsvZGlzdC90cnVzdG1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vZnJpZGEtY2xvY2t3b3JrL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2ZyaWRhLWNsb2Nrd29yay93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZnJpZGEtY2xvY2t3b3JrL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZnJpZGEtY2xvY2t3b3JrL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZnJpZGEtY2xvY2t3b3JrL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vZnJpZGEtY2xvY2t3b3JrL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9mcmlkYS1jbG9ja3dvcmsvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuZnVuY3Rpb24gdHJ5U3RyaW5naWZ5IChvKSB7XG4gIHRyeSB7IHJldHVybiBKU09OLnN0cmluZ2lmeShvKSB9IGNhdGNoKGUpIHsgcmV0dXJuICdcIltDaXJjdWxhcl1cIicgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvcm1hdFxuXG5mdW5jdGlvbiBmb3JtYXQoZiwgYXJncywgb3B0cykge1xuICB2YXIgc3MgPSAob3B0cyAmJiBvcHRzLnN0cmluZ2lmeSkgfHwgdHJ5U3RyaW5naWZ5XG4gIHZhciBvZmZzZXQgPSAxXG4gIGlmICh0eXBlb2YgZiA9PT0gJ29iamVjdCcgJiYgZiAhPT0gbnVsbCkge1xuICAgIHZhciBsZW4gPSBhcmdzLmxlbmd0aCArIG9mZnNldFxuICAgIGlmIChsZW4gPT09IDEpIHJldHVybiBmXG4gICAgdmFyIG9iamVjdHMgPSBuZXcgQXJyYXkobGVuKVxuICAgIG9iamVjdHNbMF0gPSBzcyhmKVxuICAgIGZvciAodmFyIGluZGV4ID0gMTsgaW5kZXggPCBsZW47IGluZGV4KyspIHtcbiAgICAgIG9iamVjdHNbaW5kZXhdID0gc3MoYXJnc1tpbmRleF0pXG4gICAgfVxuICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKVxuICB9XG4gIGlmICh0eXBlb2YgZiAhPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZlxuICB9XG4gIHZhciBhcmdMZW4gPSBhcmdzLmxlbmd0aFxuICBpZiAoYXJnTGVuID09PSAwKSByZXR1cm4gZlxuICB2YXIgc3RyID0gJydcbiAgdmFyIGEgPSAxIC0gb2Zmc2V0XG4gIHZhciBsYXN0UG9zID0gLTFcbiAgdmFyIGZsZW4gPSAoZiAmJiBmLmxlbmd0aCkgfHwgMFxuICBmb3IgKHZhciBpID0gMDsgaSA8IGZsZW47KSB7XG4gICAgaWYgKGYuY2hhckNvZGVBdChpKSA9PT0gMzcgJiYgaSArIDEgPCBmbGVuKSB7XG4gICAgICBsYXN0UG9zID0gbGFzdFBvcyA+IC0xID8gbGFzdFBvcyA6IDBcbiAgICAgIHN3aXRjaCAoZi5jaGFyQ29kZUF0KGkgKyAxKSkge1xuICAgICAgICBjYXNlIDEwMDogLy8gJ2QnXG4gICAgICAgIGNhc2UgMTAyOiAvLyAnZidcbiAgICAgICAgICBpZiAoYSA+PSBhcmdMZW4pXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGlmIChhcmdzW2FdID09IG51bGwpICBicmVha1xuICAgICAgICAgIGlmIChsYXN0UG9zIDwgaSlcbiAgICAgICAgICAgIHN0ciArPSBmLnNsaWNlKGxhc3RQb3MsIGkpXG4gICAgICAgICAgc3RyICs9IE51bWJlcihhcmdzW2FdKVxuICAgICAgICAgIGxhc3RQb3MgPSBpICsgMlxuICAgICAgICAgIGkrK1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMTA1OiAvLyAnaSdcbiAgICAgICAgICBpZiAoYSA+PSBhcmdMZW4pXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGlmIChhcmdzW2FdID09IG51bGwpICBicmVha1xuICAgICAgICAgIGlmIChsYXN0UG9zIDwgaSlcbiAgICAgICAgICAgIHN0ciArPSBmLnNsaWNlKGxhc3RQb3MsIGkpXG4gICAgICAgICAgc3RyICs9IE1hdGguZmxvb3IoTnVtYmVyKGFyZ3NbYV0pKVxuICAgICAgICAgIGxhc3RQb3MgPSBpICsgMlxuICAgICAgICAgIGkrK1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNzk6IC8vICdPJ1xuICAgICAgICBjYXNlIDExMTogLy8gJ28nXG4gICAgICAgIGNhc2UgMTA2OiAvLyAnaidcbiAgICAgICAgICBpZiAoYSA+PSBhcmdMZW4pXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGlmIChhcmdzW2FdID09PSB1bmRlZmluZWQpIGJyZWFrXG4gICAgICAgICAgaWYgKGxhc3RQb3MgPCBpKVxuICAgICAgICAgICAgc3RyICs9IGYuc2xpY2UobGFzdFBvcywgaSlcbiAgICAgICAgICB2YXIgdHlwZSA9IHR5cGVvZiBhcmdzW2FdXG4gICAgICAgICAgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBzdHIgKz0gJ1xcJycgKyBhcmdzW2FdICsgJ1xcJydcbiAgICAgICAgICAgIGxhc3RQb3MgPSBpICsgMlxuICAgICAgICAgICAgaSsrXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgc3RyICs9IGFyZ3NbYV0ubmFtZSB8fCAnPGFub255bW91cz4nXG4gICAgICAgICAgICBsYXN0UG9zID0gaSArIDJcbiAgICAgICAgICAgIGkrK1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICB9XG4gICAgICAgICAgc3RyICs9IHNzKGFyZ3NbYV0pXG4gICAgICAgICAgbGFzdFBvcyA9IGkgKyAyXG4gICAgICAgICAgaSsrXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAxMTU6IC8vICdzJ1xuICAgICAgICAgIGlmIChhID49IGFyZ0xlbilcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgaWYgKGxhc3RQb3MgPCBpKVxuICAgICAgICAgICAgc3RyICs9IGYuc2xpY2UobGFzdFBvcywgaSlcbiAgICAgICAgICBzdHIgKz0gU3RyaW5nKGFyZ3NbYV0pXG4gICAgICAgICAgbGFzdFBvcyA9IGkgKyAyXG4gICAgICAgICAgaSsrXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAzNzogLy8gJyUnXG4gICAgICAgICAgaWYgKGxhc3RQb3MgPCBpKVxuICAgICAgICAgICAgc3RyICs9IGYuc2xpY2UobGFzdFBvcywgaSlcbiAgICAgICAgICBzdHIgKz0gJyUnXG4gICAgICAgICAgbGFzdFBvcyA9IGkgKyAyXG4gICAgICAgICAgaSsrXG4gICAgICAgICAgYS0tXG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICAgICsrYVxuICAgIH1cbiAgICArK2lcbiAgfVxuICBpZiAobGFzdFBvcyA9PT0gLTEpXG4gICAgcmV0dXJuIGZcbiAgZWxzZSBpZiAobGFzdFBvcyA8IGZsZW4pIHtcbiAgICBzdHIgKz0gZi5zbGljZShsYXN0UG9zKVxuICB9XG5cbiAgcmV0dXJuIHN0clxufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcbiAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19zZXRNb2R1bGVEZWZhdWx0KSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xufSkgOiBmdW5jdGlvbihvLCB2KSB7XG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xufSk7XG52YXIgX19pbXBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydFN0YXIpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbnZhciBfX3NwcmVhZEFycmF5ID0gKHRoaXMgJiYgdGhpcy5fX3NwcmVhZEFycmF5KSB8fCBmdW5jdGlvbiAodG8sIGZyb20sIHBhY2spIHtcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XG4gICAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBob29rc18xID0gcmVxdWlyZShcIkBjbG9ja3dvcmsvaG9va3NcIik7XG52YXIgQW50aWNsb2FrID0gX19pbXBvcnRTdGFyKHJlcXVpcmUoXCJAY2xvY2t3b3JrL2FudGljbG9ha1wiKSk7XG52YXIgTmV0d29yayA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiQGNsb2Nrd29yay9uZXR3b3JrXCIpKTtcbnZhciBOYXRpdmUgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcIkBjbG9ja3dvcmsvbmF0aXZlXCIpKTtcbnZhciBKbmlUcmFjZSA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiQGNsb2Nrd29yay9qbml0cmFjZVwiKSk7XG52YXIgaG9va3NfMiA9IHJlcXVpcmUoXCJAY2xvY2t3b3JrL2hvb2tzXCIpO1xudmFyIGNvbW1vbl8xID0gcmVxdWlyZShcIkBjbG9ja3dvcmsvY29tbW9uXCIpO1xudmFyIGxvZ2dpbmdfMSA9IHJlcXVpcmUoXCJAY2xvY2t3b3JrL2xvZ2dpbmdcIik7XG52YXIgaG9va3NfMyA9IHJlcXVpcmUoXCJAY2xvY2t3b3JrL2hvb2tzXCIpO1xudmFyIHVuaXFIb29rID0gKDAsIGhvb2tzXzEuZ2V0SG9va1VuaXF1ZSkoKTtcbnZhciB1bmlxRmluZCA9ICgwLCBjb21tb25fMS5nZXRGaW5kVW5pcXVlKSgpO1xudmFyIF9hID0gbG9nZ2luZ18xLkNvbG9yLnVzZSgpLCBibHVlID0gX2EuYmx1ZSwgYmx1ZUJyaWdodCA9IF9hLmJsdWVCcmlnaHQsIHJlZEJyaWdodCA9IF9hLnJlZEJyaWdodCwgcGluayA9IF9hLm1hZ2VudGFCcmlnaHQsIHllbGxvdyA9IF9hLnllbGxvdywgZGltID0gX2EuZGltO1xuZnVuY3Rpb24gaG9va0FjdGl2aXR5KCkge1xuICAgICgwLCBob29rc18yLmhvb2spKGNvbW1vbl8xLkNsYXNzZXMuQWN0aXZpdHksICckaW5pdCcsIHtcbiAgICAgICAgYWZ0ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIiRpbml0OiBcIi5jb25jYXQodGhpcykpO1xuICAgICAgICB9LFxuICAgIH0pO1xuICAgICgwLCBob29rc18yLmhvb2spKGNvbW1vbl8xLkNsYXNzZXMuQWN0aXZpdHksICdvbkNyZWF0ZScsIHtcbiAgICAgICAgYWZ0ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIiBvbkNyZWF0ZTogXCIuY29uY2F0KHRoaXMpKTtcbiAgICAgICAgfSxcbiAgICAgICAgbG9nZ2luZzogeyBhcmd1bWVudHM6IGZhbHNlIH0sXG4gICAgfSk7XG4gICAgKDAsIGhvb2tzXzIuaG9vaykoY29tbW9uXzEuQ2xhc3Nlcy5BY3Rpdml0eSwgJ29uUmVzdW1lJywge1xuICAgICAgICBhZnRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiICBvblJlc3VtZTogXCIuY29uY2F0KHRoaXMpKTtcbiAgICAgICAgfSxcbiAgICAgICAgbG9nZ2luZzogeyBhcmd1bWVudHM6IGZhbHNlIH0sXG4gICAgfSk7XG4gICAgKDAsIGhvb2tzXzIuaG9vaykoY29tbW9uXzEuQ2xhc3Nlcy5BY3Rpdml0eSwgJ3N0YXJ0QWN0aXZpdHknKTtcbiAgICAoMCwgaG9va3NfMi5ob29rKShjb21tb25fMS5DbGFzc2VzLkFjdGl2aXR5LCAnc3RhcnRBY3Rpdml0aWVzJyk7XG59XG5mdW5jdGlvbiBob29rV2VidmlldygpIHtcbiAgICAoMCwgaG9va3NfMi5ob29rKShjb21tb25fMS5DbGFzc2VzLldlYlZpZXcsICdldmFsdWF0ZUphdmFzY3JpcHQnKTtcbiAgICAoMCwgaG9va3NfMi5ob29rKShjb21tb25fMS5DbGFzc2VzLldlYlZpZXcsICdsb2FkRGF0YVdpdGhCYXNlVVJMJyk7XG4gICAgKDAsIGhvb2tzXzIuaG9vaykoY29tbW9uXzEuQ2xhc3Nlcy5XZWJWaWV3LCAnbG9hZFVybCcsIHtcbiAgICAgICAgYWZ0ZXI6IGZ1bmN0aW9uIChtZXRob2QsIHJldHVyblZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgYXJncyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAyOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICBhcmdzW19pIC0gMl0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbG9nZ2luZ18xLmxvZ2dlci5pbmZvKHBpbmsoKDAsIGNvbW1vbl8xLnN0YWNrdHJhY2UpKCkpKTtcbiAgICAgICAgfSxcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGhvb2tOZXR3b3JrKCkge1xuICAgICgwLCBob29rc18yLmhvb2spKGNvbW1vbl8xLkNsYXNzZXMuVVJMLCAnb3BlbkNvbm5lY3Rpb24nLCB7XG4gICAgICAgIGxvZ2dpbmdQcmVkaWNhdGU6IGxvZ2dpbmdfMS5GaWx0ZXIudXJsLFxuICAgIH0pO1xuICAgIHZhciBSZWFsQ2FsbCA9IG51bGw7XG4gICAgaG9va3NfMS5DbGFzc0xvYWRlci5wZXJmb3JtKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgIVJlYWxDYWxsICYmXG4gICAgICAgICAgICAoUmVhbENhbGwgPSAoMCwgY29tbW9uXzEuZmluZENsYXNzKSgnb2todHRwMy5pbnRlcm5hbC5jb25uZWN0aW9uLlJlYWxDYWxsJykpICYmXG4gICAgICAgICAgICAoMCwgaG9va3NfMi5ob29rKShSZWFsQ2FsbCwgJ2NhbGxTdGFydCcsIHtcbiAgICAgICAgICAgICAgICBhZnRlcjogZnVuY3Rpb24gKG1ldGhvZCwgcmV0dXJuVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9hLCBfYiwgX2M7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhcmdzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIF9pID0gMjsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmdzW19pIC0gMl0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBvcmlnaW5hbCA9IChfYSA9IHRoaXMub3JpZ2luYWxSZXF1ZXN0KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcmlnaW5hbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHVybCA9IChfYiA9IG9yaWdpbmFsLl91cmwpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtZXRob2RfMSA9IChfYyA9IG9yaWdpbmFsLl9tZXRob2QpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2luZ18xLmxvZ2dlci5pbmZvKFwiXCIuY29uY2F0KGRpbShtZXRob2RfMSksIFwiIFwiKS5jb25jYXQobG9nZ2luZ18xLkNvbG9yLnVybChjb21tb25fMS5DbGFzc2VzLlN0cmluZy52YWx1ZU9mKHVybCkpKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBob29rQ3J5cHRvKCkge1xuICAgIC8vICBob29rKENsYXNzZXMuU2VjcmV0S2V5U3BlYywgJyRpbml0Jywge1xuICAgIC8vICAgICBsb2dnaW5nOiB7IG11bHRpbGluZTogZmFsc2UgfSxcbiAgICAvLyB9KTtcbiAgICAvLyBob29rKEpUeXBlcy5DaXBoZXIsICdnZXRJbnN0YW5jZScpO1xuICAgICgwLCBob29rc18yLmhvb2spKGNvbW1vbl8xLkNsYXNzZXMuQ2lwaGVyLCAnZG9GaW5hbCcsIHtcbiAgICAgICAgYWZ0ZXI6IGZ1bmN0aW9uIChtLCByKSB7XG4gICAgICAgICAgICB2YXIgcCA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAyOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICBwW19pIC0gMl0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMub3Btb2RlLnZhbHVlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN0ciA9IGNvbW1vbl8xLkNsYXNzZXMuU3RyaW5nLiRuZXcocFswXSk7XG4gICAgICAgICAgICAgICAgbG9nZ2luZ18xLmxvZ2dlci5pbmZvKHsgdGFnOiAnZW5jcnlwdCcgfSwgXCJcIi5jb25jYXQoc3RyKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5vcG1vZGUudmFsdWUgPT09IDIpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RyID0gY29tbW9uXzEuQ2xhc3Nlcy5TdHJpbmcuJG5ldyhyKTtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2luZ18xLmxvZ2dlci5pbmZvKHsgdGFnOiAnZGVjcnlwdCcgfSwgXCJcIi5jb25jYXQoc3RyKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dpbmdfMS5sb2dnZXIuaW5mbyh7IHRhZzogJ2RlY3J5cHQnIH0sIFwiXCIuY29uY2F0KHIpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGxvZ2dpbmc6IHsgYXJndW1lbnRzOiBmYWxzZSwgcmV0dXJuOiBmYWxzZSB9LFxuICAgIH0pO1xufVxuZnVuY3Rpb24gaG9va0pzb24oZm4pIHtcbiAgICB2YXIgZ2V0T3B0ID0gWydnZXQnLCAnb3B0J107XG4gICAgdmFyIHR5cGVzID0gWydCb29sZWFuJywgJ0RvdWJsZScsICdJbnQnLCAnSlNPTkFycmF5JywgJ0pTT05PYmplY3QnLCAnTG9uZycsICdTdHJpbmcnXTtcbiAgICAoMCwgaG9va3NfMi5ob29rKShjb21tb25fMS5DbGFzc2VzLkpTT05PYmplY3QsICckaW5pdCcsIHtcbiAgICAgICAgbG9nZ2luZ1ByZWRpY2F0ZTogbG9nZ2luZ18xLkZpbHRlci5qc29uLFxuICAgICAgICBsb2dnaW5nOiB7IHNob3J0OiB0cnVlIH0sXG4gICAgICAgIHByZWRpY2F0ZTogZnVuY3Rpb24gKF8sIGluZGV4KSB7IHJldHVybiBpbmRleCAhPT0gMDsgfSxcbiAgICB9KTtcbiAgICAoMCwgaG9va3NfMi5ob29rKShjb21tb25fMS5DbGFzc2VzLkpTT05PYmplY3QsICdoYXMnLCB7XG4gICAgICAgIGxvZ2dpbmdQcmVkaWNhdGU6IGxvZ2dpbmdfMS5GaWx0ZXIuanNvbixcbiAgICAgICAgbG9nZ2luZzogeyBtdWx0aWxpbmU6IGZhbHNlLCBzaG9ydDogdHJ1ZSB9LFxuICAgICAgICByZXBsYWNlOiBmdW5jdGlvbiAobWV0aG9kLCBrZXkpIHtcbiAgICAgICAgICAgIHZhciBmb3VuZCA9IChmbiA9PT0gbnVsbCB8fCBmbiA9PT0gdm9pZCAwID8gdm9pZCAwIDogZm4oa2V5LCAnaGFzJykpICE9PSB1bmRlZmluZWQ7XG4gICAgICAgICAgICByZXR1cm4gZm91bmQgfHwgbWV0aG9kLmNhbGwodGhpcywga2V5KTtcbiAgICAgICAgfSxcbiAgICB9KTtcbiAgICB2YXIgX2xvb3BfMSA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICgwLCBob29rc18yLmhvb2spKGNvbW1vbl8xLkNsYXNzZXMuSlNPTk9iamVjdCwgaXRlbSwge1xuICAgICAgICAgICAgbG9nZ2luZ1ByZWRpY2F0ZTogbG9nZ2luZ18xLkZpbHRlci5qc29uLFxuICAgICAgICAgICAgbG9nZ2luZzogeyBtdWx0aWxpbmU6IGZhbHNlLCBzaG9ydDogdHJ1ZSB9LFxuICAgICAgICAgICAgcmVwbGFjZTogZm4gPyAoMCwgaG9va3NfMy5pZktleSkoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gZm4oa2V5LCBpdGVtKTsgfSkgOiB1bmRlZmluZWQsXG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgZm9yICh2YXIgX2kgPSAwLCBnZXRPcHRfMSA9IGdldE9wdDsgX2kgPCBnZXRPcHRfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBnZXRPcHRfMVtfaV07XG4gICAgICAgIF9sb29wXzEoaXRlbSk7XG4gICAgfVxuICAgIGZvciAodmFyIF9hID0gMCwgdHlwZXNfMSA9IHR5cGVzOyBfYSA8IHR5cGVzXzEubGVuZ3RoOyBfYSsrKSB7XG4gICAgICAgIHZhciB0eXBlID0gdHlwZXNfMVtfYV07XG4gICAgICAgIHZhciBfbG9vcF8yID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHZhciBuYW1lXzEgPSBcIlwiLmNvbmNhdChpdGVtKS5jb25jYXQodHlwZSk7XG4gICAgICAgICAgICAoMCwgaG9va3NfMi5ob29rKShjb21tb25fMS5DbGFzc2VzLkpTT05PYmplY3QsIG5hbWVfMSwge1xuICAgICAgICAgICAgICAgIGxvZ2dpbmdQcmVkaWNhdGU6IGxvZ2dpbmdfMS5GaWx0ZXIuanNvbixcbiAgICAgICAgICAgICAgICBsb2dnaW5nOiB7IG11bHRpbGluZTogZmFsc2UsIHNob3J0OiB0cnVlIH0sXG4gICAgICAgICAgICAgICAgcmVwbGFjZTogZm4gPyAoMCwgaG9va3NfMy5pZktleSkoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gZm4oa2V5LCBpdGVtKTsgfSkgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgZm9yICh2YXIgX2IgPSAwLCBnZXRPcHRfMiA9IGdldE9wdDsgX2IgPCBnZXRPcHRfMi5sZW5ndGg7IF9iKyspIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gZ2V0T3B0XzJbX2JdO1xuICAgICAgICAgICAgX2xvb3BfMihpdGVtKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBob29rKENsYXNzZXMuSlNPTk9iamVjdCwgJ3B1dCcpXG59XG5mdW5jdGlvbiBob29rUHJlZnMoZm4pIHtcbiAgICB2YXIga2V5Rm5zID0gWydnZXRCb29sZWFuJywgJ2dldEZsb2F0JywgJ2dldEludCcsICdnZXRMb25nJywgJ2dldFN0cmluZycsICdnZXRTdHJpbmdTZXQnXTtcbiAgICAoMCwgaG9va3NfMi5ob29rKShjb21tb25fMS5DbGFzc2VzLlNoYXJlZFByZWZlcmVuY2VzSW1wbCwgJ2NvbnRhaW5zJywge1xuICAgICAgICBsb2dnaW5nUHJlZGljYXRlOiBsb2dnaW5nXzEuRmlsdGVyLnByZWZzLFxuICAgICAgICBsb2dnaW5nOiB7IG11bHRpbGluZTogZmFsc2UsIHNob3J0OiB0cnVlIH0sXG4gICAgICAgIHJlcGxhY2U6IGZ1bmN0aW9uIChtZXRob2QsIGtleSkge1xuICAgICAgICAgICAgdmFyIGZvdW5kID0gKGZuID09PSBudWxsIHx8IGZuID09PSB2b2lkIDAgPyB2b2lkIDAgOiBmbihrZXksICdjb250YWlucycpKSAhPT0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgcmV0dXJuIGZvdW5kIHx8IG1ldGhvZC5jYWxsKHRoaXMsIGtleSk7XG4gICAgICAgIH0sXG4gICAgfSk7XG4gICAgKDAsIGhvb2tzXzIuaG9vaykoY29tbW9uXzEuQ2xhc3Nlcy5TaGFyZWRQcmVmZXJlbmNlc0ltcGwsICdnZXRBbGwnLCB7XG4gICAgICAgIGxvZ2dpbmdQcmVkaWNhdGU6IGxvZ2dpbmdfMS5GaWx0ZXIucHJlZnMsXG4gICAgICAgIGxvZ2dpbmc6IHsgbXVsdGlsaW5lOiBmYWxzZSwgc2hvcnQ6IHRydWUgfSxcbiAgICB9KTtcbiAgICB2YXIgX2xvb3BfMyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICgwLCBob29rc18yLmhvb2spKGNvbW1vbl8xLkNsYXNzZXMuU2hhcmVkUHJlZmVyZW5jZXNJbXBsLCBpdGVtLCB7XG4gICAgICAgICAgICBsb2dnaW5nUHJlZGljYXRlOiBsb2dnaW5nXzEuRmlsdGVyLnByZWZzLFxuICAgICAgICAgICAgbG9nZ2luZzogeyBtdWx0aWxpbmU6IGZhbHNlLCBzaG9ydDogdHJ1ZSB9LFxuICAgICAgICAgICAgcmVwbGFjZTogZm4gPyAoMCwgaG9va3NfMy5pZktleSkoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gZm4oa2V5LCBpdGVtKTsgfSkgOiB1bmRlZmluZWQsXG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgZm9yICh2YXIgX2kgPSAwLCBrZXlGbnNfMSA9IGtleUZuczsgX2kgPCBrZXlGbnNfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBrZXlGbnNfMVtfaV07XG4gICAgICAgIF9sb29wXzMoaXRlbSk7XG4gICAgfVxuICAgIC8vIGhvb2soJ2phdmEudXRpbC5Qcm9wZXJ0aWVzJywgJ2dldFByb3BlcnR5Jyk7XG59XG5mdW5jdGlvbiBob29rRGV2aWNlKCkge1xuICAgIC8qIGRldmljZSBTZXR0aW5ncyovXG4gICAgdmFyIEJ1aWxkID0ge1xuICAgICAgICBNT0RFTDogJ1NlY3JldCBTQy0xMjI0JyxcbiAgICAgICAgREVWSUNFOiAnRGV2aWNlIFZhbHVlJyxcbiAgICAgICAgQk9BUkQ6ICdEZXZpY2UgQm9hcmQnLFxuICAgICAgICAvLyBQUk9EVUNUOiAnRGV2aWNlIFByb2R1Y3QnLFxuICAgICAgICAvLyBIQVJEV0FSRTogJ0RldmljZSBIYXJkd2FyZScsXG4gICAgICAgIEZJTkdFUlBSSU5UOiAnZm9vL2Jhci9EZXZpY2U6MTEvMTEvMjAyMjp1c2VyL3NpZy1rZXlzJyxcbiAgICAgICAgTUFOVUZBQ1RVUkVSOiAnQ29tcGFueSBDbycsXG4gICAgICAgIEJPT1RMT0FERVI6ICdCb290LUpKMTI5LWFjJyxcbiAgICAgICAgQlJBTkQ6ICdDaGluYSBUZWxlY29tJyxcbiAgICAgICAgSE9TVDogJ0hPU1QgQ28nLFxuICAgICAgICBESVNQTEFZOiAnRm9vIHByb2N1Y3Rpb25zIGFuZCBiYXIgMS0wLTExMScsXG4gICAgICAgIFRBR1M6ICdQcm9kdWN0aW9uIEJ1aWxkJyxcbiAgICAgICAgU0VSSUFMOiAnU2VyaW91c2x5ID8nLFxuICAgICAgICBUWVBFOiAnUHJvZHVjdGlvbiBidWlsZCcsXG4gICAgICAgIFVTRVI6ICdMSU5VWCBHZW5lcmFsJyxcbiAgICAgICAgVU5LTk9XTjogJ0tHVFQgR2VuZXJhbCcsXG4gICAgfTtcbiAgICBSZWZsZWN0Lm93bktleXMoQnVpbGQpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICB2YXIgZmllbGQgPSBjb21tb25fMS5DbGFzc2VzLkJ1aWxkW2tleV07XG4gICAgICAgIGlmIChmaWVsZClcbiAgICAgICAgICAgIGZpZWxkLnZhbHVlID0gQnVpbGRba2V5XTtcbiAgICB9KTtcbiAgICAvL2J1aWxkUHJvcGVydGllcy5BTkRST0lEX0lELnZhbHVlPSdiNjkzMmEwMGM4OGQ4YjUwJztcbn1cbmZ1bmN0aW9uIGhvb2tTZXR0aW5ncygpIHtcbiAgICB2YXIgc2V0dGluZ3MgPSB7IGRldmVsb3BtZW50X3NldHRpbmdzX2VuYWJsZWQ6IDAsIGFkYl9lbmFibGVkOiAwLCBpbnN0YWxsX25vbl9tYXJrZXRfYXBwczogMCwgcGxheV9wcm90ZWN0X2VuYWJsZWQ6IDEgfTtcbiAgICBbY29tbW9uXzEuQ2xhc3Nlcy5TZXR0aW5ncyRTZWN1cmUsIGNvbW1vbl8xLkNsYXNzZXMuU2V0dGluZ3MkR2xvYmFsXS5mb3JFYWNoKGZ1bmN0aW9uIChjbGF6eikge1xuICAgICAgICByZXR1cm4gKDAsIGhvb2tzXzIuaG9vaykoY2xhenosICdnZXRJbnQnLCB7XG4gICAgICAgICAgICBsb2dnaW5nOiB7IGNhbGw6IHRydWUsIHJldHVybjogdHJ1ZSB9LFxuICAgICAgICAgICAgcmVwbGFjZTogZnVuY3Rpb24gKG1ldGhvZCkge1xuICAgICAgICAgICAgICAgIHZhciBwYXJhbXMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgICAgICBwYXJhbXNbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBwYXJhbXNbMV07XG4gICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLmhhc093blByb3BlcnR5KGtleSkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZXR0aW5nc1trZXldO1xuICAgICAgICAgICAgICAgIHJldHVybiBtZXRob2QuY2FsbC5hcHBseShtZXRob2QsIF9fc3ByZWFkQXJyYXkoW3RoaXNdLCBwYXJhbXMsIGZhbHNlKSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGJ5cGFzc0ludGVudEZsYWdzKCkge1xuICAgICgwLCBob29rc18yLmhvb2spKGNvbW1vbl8xLkNsYXNzZXMuUGVuZGluZ0ludGVudCwgJ2dldEJyb2FkY2FzdEFzVXNlcicsIHtcbiAgICAgICAgcmVwbGFjZTogZnVuY3Rpb24gKG1ldGhvZCkge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgYXJnc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBmbGFncyA9IGFyZ3NbM107XG4gICAgICAgICAgICB2YXIgZmxhZ0ltbXV0YWJsZVNldCA9IChmbGFncyAmIGNvbW1vbl8xLkNsYXNzZXMuUGVuZGluZ0ludGVudC5GTEFHX0lNTVVUQUJMRS52YWx1ZSkgIT0gMDtcbiAgICAgICAgICAgIHZhciBmbGFnTXV0YWJsZVNldCA9IChmbGFncyAmIGNvbW1vbl8xLkNsYXNzZXMuUGVuZGluZ0ludGVudC5GTEFHX01VVEFCTEUudmFsdWUpICE9IDA7XG4gICAgICAgICAgICBpZiAoIWZsYWdJbW11dGFibGVTZXQgJiYgIWZsYWdNdXRhYmxlU2V0KSB7XG4gICAgICAgICAgICAgICAgdmFyIG5ld0ZsYWdzID0gZmxhZ3MgfCBjb21tb25fMS5DbGFzc2VzLlBlbmRpbmdJbnRlbnQuRkxBR19NVVRBQkxFLnZhbHVlO1xuICAgICAgICAgICAgICAgIGFyZ3NbM10gPSBuZXdGbGFncztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtZXRob2QuY2FsbC5hcHBseShtZXRob2QsIF9fc3ByZWFkQXJyYXkoW3RoaXNdLCBhcmdzLCBmYWxzZSkpO1xuICAgICAgICB9LFxuICAgIH0pO1xufVxuSmF2YS5wZXJmb3JtTm93KGZ1bmN0aW9uICgpIHtcbiAgICBob29rQWN0aXZpdHkoKTtcbiAgICBob29rV2VidmlldygpO1xuICAgIGhvb2tOZXR3b3JrKCk7XG4gICAgaG9va0pzb24oZnVuY3Rpb24gKGtleSwgbWV0aG9kKSB7XG4gICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgICAgICBjYXNlICdpc0luc3RhbGxlZCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICBjYXNlICdyZWZlcnJlcic6XG4gICAgICAgICAgICBjYXNlICdhcHBsaW5rX3VybCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuICd1dG1fYW1hem9uJztcbiAgICAgICAgICAgIGNhc2UgJ2dhaWQnOlxuICAgICAgICAgICAgY2FzZSAnYW5kcm9pZF9pbWVpJzpcbiAgICAgICAgICAgIGNhc2UgJ2FuZHJvaWRfbWVpZCc6XG4gICAgICAgICAgICBjYXNlICdhbmRyb2lkX2RldmljZV9pZCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuICc0MTAyOTc4MTAyMzk4JztcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGhvb2tQcmVmcyhmdW5jdGlvbiAoa2V5LCBtZXRob2QpIHtcbiAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgIGNhc2UgJ2lzQXVkaXQnOlxuICAgICAgICAgICAgY2FzZSAnSVNfQVVESVQnOlxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIGNhc2UgJ2ludmxkX2lkJzpcbiAgICAgICAgICAgIGNhc2UgJ2tleV91bWVuZ19zcF9vYWlkJzpcbiAgICAgICAgICAgIGNhc2UgJ1VURElEMic6XG4gICAgICAgICAgICBjYXNlICdhZGlkJzpcbiAgICAgICAgICAgIGNhc2UgJ2NvbS5mbHVycnkuc2RrLmFkdmVydGlzaW5nX2lkJzpcbiAgICAgICAgICAgIGNhc2UgJ3Rlbmppbl9hZHZlcnRpc2luZ19pZCc6XG4gICAgICAgICAgICBjYXNlICd1dWlkJzpcbiAgICAgICAgICAgIGNhc2UgJ2dhaWQnOlxuICAgICAgICAgICAgY2FzZSAnS0VZX1VJRCc6XG4gICAgICAgICAgICBjYXNlICdkZXZpY2VJZCc6XG4gICAgICAgICAgICBjYXNlICdkZXZpY2VJZCc6XG4gICAgICAgICAgICBjYXNlICdkZXZpY2V1dWlkJzpcbiAgICAgICAgICAgIGNhc2UgJ3V1aWRfd29ybGRtYXBfcXVpeic6XG4gICAgICAgICAgICAgICAgcmV0dXJuICcxMjNlNDU2Ny1lODliLTQyZDMtYTQ1Ni01NTY2NDI0NDAwMDAnO1xuICAgICAgICAgICAgY2FzZSAnTUVESUFfU09VUkNFJzpcbiAgICAgICAgICAgIGNhc2UgJ3Rlbmppbl9jYW1wYWlnbl9pZCc6XG4gICAgICAgICAgICBjYXNlICd0ZW5qaW5fY2FtcGFpZ25fbmFtZSc6XG4gICAgICAgICAgICBjYXNlICd0ZW5qaW5fYWRfbmV0d29yayc6XG4gICAgICAgICAgICBjYXNlICdsYXN0X2FjdGl2ZV9idXlfbWVkaWFfc291cmNlJzpcbiAgICAgICAgICAgIGNhc2UgJ2xhc3RfYWN0aXZlX2J1eV9jaGFubmVsJzpcbiAgICAgICAgICAgIGNhc2UgJ2xhc3RfYWN0aXZlX2J1eV9jYW1wYWlnbic6XG4gICAgICAgICAgICBjYXNlICd0ZW5qaW5Hb29nbGVJbnN0YWxsUmVmZXJyZXInOlxuICAgICAgICAgICAgY2FzZSAnaW5zdGFsbF9yZWZlcnJlcic6XG4gICAgICAgICAgICBjYXNlICdyZWZlcnJlcic6XG4gICAgICAgICAgICBjYXNlICdhbXVzZXZpbGxlX2RhdGEnOlxuICAgICAgICAgICAgY2FzZSAnQUZDb252ZXJzaW9uRGF0YSc6XG4gICAgICAgICAgICBjYXNlICdjb252ZXJzaW9uRGF0YSc6XG4gICAgICAgICAgICBjYXNlICdkYXRhU2NvcmUnOlxuICAgICAgICAgICAgICAgIHJldHVybiAndXRtX21lZGl1bT1Ob24tb3JnYW5pYyc7XG4gICAgICAgICAgICBjYXNlICdjb3VudHJ5JzpcbiAgICAgICAgICAgIGNhc2UgJ3VzZXJDb3VudHJ5JzpcbiAgICAgICAgICAgIGNhc2UgJ2tleV9yZWFsX2NvdW50cnknOlxuICAgICAgICAgICAgY2FzZSAnS0VZX0xPQ0FMRSc6XG4gICAgICAgICAgICBjYXNlICdvc2tkb3NrZHVlJzpcbiAgICAgICAgICAgICAgICAoMCwgbG9nZ2luZ18xLmxvZykocGluaygoMCwgY29tbW9uXzEuc3RhY2t0cmFjZSkoKSkpO1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgaG9va0NyeXB0bygpO1xuICAgIGhvb2tTZXR0aW5ncygpO1xuICAgICgwLCBob29rc18yLmhvb2spKGNvbW1vbl8xLkNsYXNzZXMuUnVudGltZSwgJ2V4ZWMnLCB7XG4gICAgICAgIHJlcGxhY2U6IGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgIGFyZ3NbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoXCJcIi5jb25jYXQoYXJnc1swXSkuaW5jbHVkZXMoJ255YScpID09PSBmYWxzZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gY29tbW9uXzEuQ2xhc3Nlcy5SdW50aW1lLmV4ZWMuY2FsbCh0aGlzLCAnZWNobyBueWEnKTtcbiAgICAgICAgICAgIHJldHVybiBtZXRob2QuY2FsbC5hcHBseShtZXRob2QsIF9fc3ByZWFkQXJyYXkoW3RoaXNdLCBhcmdzLCBmYWxzZSkpO1xuICAgICAgICB9LFxuICAgIH0pO1xuICAgIEFudGljbG9hay5Db3VudHJ5Lm1vY2soJ0JSJyk7XG4gICAgaG9va0RldmljZSgpO1xuICAgIEFudGljbG9hay5JbnN0YWxsUmVmZXJyZXIucmVwbGFjZSh7IGluc3RhbGxfcmVmZXJyZXI6ICd1dG1fbWVkaXVtPU5vbi1vcmdhbmljJyB9KTtcbiAgICAoMCwgaG9va3NfMi5ob29rKShjb21tb25fMS5DbGFzc2VzLk1hdGgsICdmbG9vcicpO1xuICAgICgwLCBob29rc18yLmhvb2spKGNvbW1vbl8xLkNsYXNzZXMuRGV4UGF0aExpc3QsICckaW5pdCcpO1xuICAgIGhvb2tzXzEuQ2xhc3NMb2FkZXIucGVyZm9ybShmdW5jdGlvbiAoY2wpIHtcbiAgICB9KTtcbn0pO1xuTmV0d29yay5hdHRhY2hHZXRBZGRySW5mbygpO1xuTmV0d29yay5hdHRhY2hHZXRIb3N0QnlOYW1lKCk7XG5OZXR3b3JrLmF0dGFjaE5hdGl2ZVNvY2tldCgpO1xuTmV0d29yay5hdHRhY2hJbnRlQXRvbigpO1xuLy8gTmF0aXZlLmF0dGFjaFJlZ2lzdGVyTmF0aXZlcygpO1xuTmF0aXZlLmF0dGFjaFN5c3RlbVByb3BlcnR5R2V0KGZ1bmN0aW9uIChrZXkpIHtcbiAgICAvLyBjb25zb2xlLmxvZyhEZWJ1Z1N5bWJvbC5mcm9tQWRkcmVzcyh0aGlzLnJldHVybkFkZHJlc3MpKTtcbiAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICBjYXNlICdyby5kZWJ1Z2dhYmxlJzpcbiAgICAgICAgICAgIHJldHVybiAnMCc7XG4gICAgICAgIGNhc2UgJ3JvLnByb2R1Y3QubW9kZWwnOlxuICAgICAgICAgICAgcmV0dXJuICdSYXZlbic7XG4gICAgICAgIGNhc2UgJ3JvLnByb2R1Y3QubWFudWZhY3R1cmVyJzpcbiAgICAgICAgY2FzZSAncm8ucHJvZHVjdC5icmFuZCc6XG4gICAgICAgICAgICByZXR1cm4gJ1hpYW9taSc7XG4gICAgICAgIGNhc2UgJ3JvLmJ1aWxkLmZsYXZvcic6XG4gICAgICAgICAgICByZXR1cm4gJ3JhdmVuLXJlbGVhc2UnO1xuICAgICAgICBjYXNlICdyby5wcm9kdWN0LmJvYXJkJzpcbiAgICAgICAgICAgIHJldHVybiAnc2RtNzIwJztcbiAgICAgICAgY2FzZSAnZ3NtLnZlcnNpb24uYmFzZWJhbmQnOlxuICAgICAgICAgICAgcmV0dXJuICdzJztcbiAgICAgICAgY2FzZSAncm8uYm9vdC5xZW11LmdsdHJhbnNwb3J0Lm5hbWUnOlxuICAgICAgICAgICAgcmV0dXJuICduJztcbiAgICB9XG4gICAgaWYgKE5hdGl2ZS5JbmplY3QuaXNXaXRoaW5Pd25SYW5nZSh0aGlzLnJldHVybkFkZHJlc3MpKVxuICAgICAgICByZXR1cm4gJ255YSc7XG59KTtcbi8vIEFudGljbG9hay5KaWdhdS5tZW1vcnlQYXRjaCgnbDdkZjNlN2M0LnNvJyk7XG4vLyBbSU5GT10ge1wibmFtZVwiOiBcImxpYmNvY29zLnNvXCIsIFwiZm5fZHVtcFwiOiBcIjB4MDAyYWQyYTBcIixcImZuX2tleVwiOiBcIjAgeDAwMjkzNDY4XCJ9XG4vLyBDb2NvczJkeC5kdW1wKHsgbmFtZTogJ2xpYmNvY29zMmRqcy5zbycsIGZuX2R1bXA6IHB0cigweDAwN2FkOWE4KSwgZm5fa2V5OiBwdHIoMHgwMDZhOGI1MCkgfSk7XG4vLyBDb2NvczJkeC5ob29rTG9jYWxTdG9yYWdlKGZ1bmN0aW9uKGtleSkge1xuLy8gICAgIHN3aXRjaCAoa2V5KSB7XG4vLyAgICAgICAgIGNhc2UgJ2ZvcmNlX3VwZGF0ZSc6XG4vLyAgICAgICAgICAgICByZXR1cm4gJ3RydWUnO1xuLy8gICAgIH1cbi8vIH0pXG4vLyBVbml0eS5zZXRWZXJzaW9uKCcyMDIzLjIuNWYxJyk7XG4vLyBVbml0eS5hdHRhY2hTdHJpbmdzKCk7XG52YXIgeCA9IGZhbHNlO1xuLy8gLy8gc2V0VGltZW91dCgoKSA9PiAoeCA9IGZhbHNlKSwgNTAwMCk7XFxcbnZhciBwcmVkaWNhdGUgPSBmdW5jdGlvbiAocikgeyByZXR1cm4geCAmJiBOYXRpdmUuSW5qZWN0LmlzV2l0aGluT3duUmFuZ2Uocik7IH07XG5KbmlUcmFjZS5hdHRhY2goZnVuY3Rpb24gKF9hKSB7XG4gICAgdmFyIHJldHVybkFkZHJlc3MgPSBfYS5yZXR1cm5BZGRyZXNzO1xuICAgIHJldHVybiBwcmVkaWNhdGUocmV0dXJuQWRkcmVzcyk7XG59KTtcbi8vIFsnc3RybGVuJywgJ3N0cnN0cicsICdzdHJuY21wJywgJ3N0cmNtcCcsICdzdHJjcHknLCAnc3RyY2F0J10uZm9yRWFjaCgoZXgpID0+IHtcbi8vICAgICBjb25zdCBzdHJjbXAgPSBNb2R1bGUuZ2V0RXhwb3J0QnlOYW1lKG51bGwsIGV4KTtcbi8vICAgICBOYXRpdmUuSW5qZWN0LmF0dGFjaEluTW9kdWxlKHByZWRpY2F0ZSwgc3RyY21wLCB7XG4vLyAgICAgICAgIG9uRW50ZXIoYXJncykge1xuLy8gICAgICAgICAgICAgdGhpcy5hMCA9IGFyZ3NbMF0ucmVhZENTdHJpbmcoKTtcbi8vICAgICAgICAgICAgIHRoaXMuYTEgPSBhcmdzWzFdLnJlYWRDU3RyaW5nKCk7XG4vLyAgICAgICAgICAgICBsb2dnZXIuaW5mbyh7IHRhZzogZXggfSwgYFwiJHt0aGlzLmEwfVwiLCBcIiR7dGhpcy5hMX1cIiAke0NvbG9yLmJyYWNrZXQoTmF0aXZlLkluamVjdC5tb2R1bGVzLmZpbmROYW1lKHRoaXMucmV0dXJuQWRkcmVzcykpfWApO1xuLy8gICAgICAgICB9LFxuLy8gICAgICAgICBvbkxlYXZlKHJldHZhbCkge30sXG4vLyAgICAgfSk7XG4vLyB9KTtcbltcbiAgICAnZm9wZW4nLFxuICAgICdmd3JpdGUnLFxuICAgICdzdGF0JyxcbiAgICAnYWNjZXNzJyxcbiAgICAndnByaW50ZicsXG4gICAgJ19fYW5kcm9pZF9sb2dfcHJpbnQnLFxuICAgICdzcHJpbnRmJyxcbiAgICAnZm9wZW4nLFxuICAgICdvcGVuJyxcbiAgICAnc3RhdHZmcycsXG4gICAgJ2FjY2VzcycsXG4gICAgJ3B0aHJlYWRfa2lsbCcsXG4gICAgJ2tpbGwnLFxuICAgICdfZXhpdCcsXG4gICAgJ2tpbGxwZycsXG4gICAgJ3NpZ25hbCcsXG4gICAgJ2Fib3J0Jyxcbl0uZm9yRWFjaChmdW5jdGlvbiAoZXgpIHtcbiAgICB2YXIgZXhwID0gTW9kdWxlLmdldEV4cG9ydEJ5TmFtZShudWxsLCBleCk7XG4gICAgTmF0aXZlLkluamVjdC5hdHRhY2hJbk1vZHVsZShwcmVkaWNhdGUsIGV4cCwge1xuICAgICAgICBvbkVudGVyOiBmdW5jdGlvbiAoYXJncykge1xuICAgICAgICAgICAgdmFyIGFyZyA9IGV4ID09PSAnX19hbmRyb2lkX2xvZ19wcmludCcgPyBhcmdzWzJdIDogYXJnc1swXTtcbiAgICAgICAgICAgIHN3aXRjaCAoZXgpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdfX2FuZHJvaWRfbG9nX3ByaW50Jzoge1xuICAgICAgICAgICAgICAgICAgICBsb2dnaW5nXzEubG9nZ2VyLmluZm8oeyB0YWc6IGV4IH0sIFwiXFxcIlwiLmNvbmNhdChhcmdzWzJdLnJlYWRDU3RyaW5nKCksIFwiXFxcIlwiKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSAnc3ByaW50Zic6IHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2luZ18xLmxvZ2dlci5pbmZvKHsgdGFnOiBleCB9LCBcIlxcXCJcIi5jb25jYXQoYXJnc1swXS5yZWFkQ1N0cmluZygpLCBcIlxcXCIgXFxcIlwiKS5jb25jYXQoYXJnc1sxXS5yZWFkQ1N0cmluZygpLCBcIlxcXCJcIikpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2luZ18xLmxvZ2dlci5pbmZvKHsgdGFnOiBleCB9LCBcIlxcXCJcIi5jb25jYXQoYXJnLnJlYWRDU3RyaW5nKCksIFwiXFxcIiAtPiBcIikuY29uY2F0KERlYnVnU3ltYm9sLmZyb21BZGRyZXNzKHRoaXMucmV0dXJuQWRkcmVzcykpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB9KTtcbn0pO1xuWydraWxsJ10uZm9yRWFjaChmdW5jdGlvbiAoZXgpIHtcbiAgICB2YXIga2lsbCA9IE1vZHVsZS5nZXRFeHBvcnRCeU5hbWUobnVsbCwgZXgpO1xuICAgIE5hdGl2ZS5JbmplY3QuYXR0YWNoSW5Nb2R1bGUocHJlZGljYXRlLCBraWxsLCB7XG4gICAgICAgIG9uRW50ZXI6IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgICAgICAgICBsb2dnaW5nXzEubG9nZ2VyLmluZm8oeyB0YWc6IGV4IH0sIFwia2lsbCBjYWxsZWQgIVwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25MZWF2ZTogZnVuY3Rpb24gKHJldHZhbCkgeyB9LFxuICAgIH0pO1xufSk7XG4vLyBJbnRlcmNlcHRvci5yZXBsYWNlKE1vZHVsZS5nZXRFeHBvcnRCeU5hbWUobnVsbCwgJ2V4aXQnKSwgbmV3IE5hdGl2ZUNhbGxiYWNrKGZ1bmN0aW9uIChjb2RlKSB7XG4vLyAgICAgaWYgKG51bGwgPT0gdGhpcykge1xuLy8gICAgICAgICByZXR1cm4gMDtcbi8vICAgICB9XG4vLyAgICAgcmV0dXJuIDA7XG4vLyB9LCAnaW50JywgWydpbnQnLCAnaW50J10pKTtcbi8vIGNvbnN0IGZvcmtfcHRyID0gTW9kdWxlLmdldEV4cG9ydEJ5TmFtZSgnbGliYy5zbycsICdmb3JrJyk7XG4vLyBjb25zdCBmb3JrID0gbmV3IE5hdGl2ZUZ1bmN0aW9uKGZvcmtfcHRyLCAnaW50JywgW10pO1xuLy8gSW50ZXJjZXB0b3IucmVwbGFjZShcbi8vICAgICBmb3JrX3B0cixcbi8vICAgICBuZXcgTmF0aXZlQ2FsbGJhY2soXG4vLyAgICAgICAgIGZ1bmN0aW9uICgpIHtcbi8vICAgICAgICAgICAgIGxvZ2dlci5pbmZvKHsgdGFnOiAnZm9yayd9LCBgJHstMX1gKTtcbi8vICAgICAgICAgICAgIC8vIHJldHVybiAtMTtcbi8vICAgICAgICAgICAgIHJldHVybiBmb3JrKCk7XG4vLyAgICAgICAgIH0sXG4vLyAgICAgICAgICdpbnQnLFxuLy8gICAgICAgICBbXSxcbi8vICAgICApLFxuLy8gKTtcbi8vIHZhciByZW1vdmVwdHIgPSBNb2R1bGUuZ2V0RXhwb3J0QnlOYW1lKCdsaWJjLnNvJywgJ3JlbW92ZScpO1xuLy8gdmFyIHJlbW92ZSA9IG5ldyBOYXRpdmVGdW5jdGlvbihyZW1vdmVwdHIsICdpbnQnLCBbJ3BvaW50ZXInXSk7XG4vLyBJbnRlcmNlcHRvci5yZXBsYWNlKFxuLy8gICAgIHJlbW92ZXB0cixcbi8vICAgICBuZXcgTmF0aXZlQ2FsbGJhY2soXG4vLyAgICAgICAgIGZ1bmN0aW9uIChwYXRoKSB7XG4vLyAgICAgICAgICAgICBjb25zdCByZXQgPSByZW1vdmUocGF0aCk7XG4vLyAgICAgICAgICAgICBsb2dnZXIuaW5mbyh7IHRhZzogJ3JlbW92ZSd9LCBgJHtyZXR9YCk7XG4vLyAgICAgICAgICAgICByZXR1cm4gcmV0XG4vLyAgICAgICAgICAgICAvLyAgcmV0dXJuIC0xO1xuLy8gICAgICAgICB9LFxuLy8gICAgICAgICAnaW50Jyxcbi8vICAgICAgICAgWydwb2ludGVyJ10sXG4vLyAgICAgKSxcbi8vICk7XG4vLyB2YXIgcF9wdGhyZWFkX2NyZWF0ZSA9IE1vZHVsZS5nZXRFeHBvcnRCeU5hbWUoJ2xpYmMuc28nLCAncHRocmVhZF9jcmVhdGUnKTtcbi8vIHZhciBwdGhyZWFkX2NyZWF0ZSA9IG5ldyBOYXRpdmVGdW5jdGlvbihwX3B0aHJlYWRfY3JlYXRlLCAnaW50JywgWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10pO1xuLy8gSW50ZXJjZXB0b3IucmVwbGFjZShcbi8vICAgICBwX3B0aHJlYWRfY3JlYXRlLFxuLy8gICAgIG5ldyBOYXRpdmVDYWxsYmFjayhcbi8vICAgICAgICAgZnVuY3Rpb24gKHB0cjAsIHB0cjEsIHB0cjIsIHB0cjMpIHtcbi8vICAgICAgICAgICAgIGNvbnN0IHJldCA9IHB0aHJlYWRfY3JlYXRlKHB0cjAsIHB0cjEsIHB0cjIsIHB0cjMpO1xuLy8gICAgICAgICAgICAgbG9nZ2VyLmluZm8oeyB0YWc6ICdwdGhyZWFkX2NyZWF0ZScsIHJlcGxhY2U6IHRydWUgfSwgYCR7cHRyMH0sICR7cHRyMX0sICR7cHRyMn0sICR7cHRyM30gLT4gJHtyZXR9YCk7XG4vLyAgICAgICAgICAgICByZXR1cm4gcmV0O1xuLy8gICAgICAgICB9LFxuLy8gICAgICAgICAnaW50Jyxcbi8vICAgICAgICAgWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4vLyAgICAgKSxcbi8vICk7XG4vLyB2YXIgZmdldHNQdHIgPSBNb2R1bGUuZ2V0RXhwb3J0QnlOYW1lKCdsaWJjLnNvJywgJ2ZnZXRzJyk7XG4vLyB2YXIgZmdldHMgPSBuZXcgTmF0aXZlRnVuY3Rpb24oZmdldHNQdHIsICdwb2ludGVyJywgWydwb2ludGVyJywgJ2ludCcsICdwb2ludGVyJ10pO1xuLy8gSW50ZXJjZXB0b3IucmVwbGFjZShcbi8vICAgICBmZ2V0c1B0cixcbi8vICAgICBuZXcgTmF0aXZlQ2FsbGJhY2soXG4vLyAgICAgICAgIGZ1bmN0aW9uIChidWZmZXIsIHNpemUsIGZwKSB7XG4vLyAgICAgICAgICAgICB2YXIgcmV0dmFsID0gZmdldHMoYnVmZmVyLCBzaXplLCBmcCk7XG4vLyAgICAgICAgICAgICB2YXIgYnVmc3RyID0gYnVmZmVyLnJlYWRDU3RyaW5nKCk7XG4vLyAgICAgICAgICAgICBpZiAoYnVmc3RyPy5pbmNsdWRlcygnVHJhY2VyUGlkOicpKSB7XG4vLyAgICAgICAgICAgICAgICAgYnVmZmVyLndyaXRlVXRmOFN0cmluZygnVHJhY2VyUGlkOlxcdDAnKTtcbi8vICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnQnlwYXNzaW5nIFRyYWNlclBJRCBDaGVjaycpO1xuLy8gICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgaWYgKGJ1ZnN0cj8uaW5jbHVkZXMoJ2ZyaWRhJykgfHwgYnVmc3RyPy5pbmNsdWRlcygnaGx1ZGEnKSkge1xuLy8gICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdLZXl3b3JkcyBpbiBCdWZmZXInLCByZXR2YWwpO1xuLy8gICAgICAgICAgICAgICAgIC8vIHZhciBuZXdzdHIgPSBidWZzdHIucmVwbGFjZUFsbChcImZyaWRhXCIsIFwibGliY2NcIik7XG4vLyAgICAgICAgICAgICAgICAgLy8gYnVmZmVyLndyaXRlVXRmOFN0cmluZyhuZXdzdHIpO1xuLy8gICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoYnVmc3RyKTtcbi8vICAgICAgICAgICAgICAgICByZXR1cm4gcmV0dmFsO1xuLy8gICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgcmV0dXJuIHJldHZhbDtcbi8vICAgICAgICAgfSxcbi8vICAgICAgICAgJ3BvaW50ZXInLFxuLy8gICAgICAgICBbJ3BvaW50ZXInLCAnaW50JywgJ3BvaW50ZXInXSxcbi8vICAgICApLFxuLy8gKTtcbi8vIHZhciBmb3BlblB0ciA9IE1vZHVsZS5nZXRFeHBvcnRCeU5hbWUoJ2xpYmMuc28nLCAnZm9wZW4nKTtcbi8vIHZhciBmb3BlbiA9IG5ldyBOYXRpdmVGdW5jdGlvbihmb3BlblB0ciwgJ3BvaW50ZXInLCBbJ3BvaW50ZXInLCAncG9pbnRlciddKTtcbi8vIEludGVyY2VwdG9yLnJlcGxhY2UoXG4vLyAgICAgZm9wZW5QdHIsXG4vLyAgICAgbmV3IE5hdGl2ZUNhbGxiYWNrKFxuLy8gICAgICAgICBmdW5jdGlvbiAocGF0aCwgbW9kZSkge1xuLy8gICAgICAgICAgICAgdmFyIGNoID0gcGF0aC5yZWFkQ1N0cmluZygpO1xuLy8gICAgICAgICAgICAgaWYgKGNoPy5pbmNsdWRlcygnL3Byb2MvJykgJiYgY2g/LmluY2x1ZGVzKCcvJykpIHtcbi8vICAgICAgICAgICAgICAgICBNZW1vcnkucHJvdGVjdChwYXRoLCAoY2gubGVuZ3RoIC8gUHJvY2Vzcy5wYWdlU2l6ZSArIChjaC5sZW5ndGggJSBQcm9jZXNzLnBhZ2VTaXplKSksICdyd3gnKTtcbi8vICAgICAgICAgICAgICAgICBwYXRoLndyaXRlVXRmOFN0cmluZygnL3Byb2MvMTIvY21kbGluZScpO1xuLy8gICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKHsgdGFnOiAnZm9wZW4nLCByZXBsYWNlOiB0cnVlIH0sIGAke3BhdGgucmVhZENTdHJpbmcoKX1gKTtcbi8vICAgICAgICAgICAgICAgICByZXR1cm4gZm9wZW4ocGF0aCwgbW9kZSk7XG4vLyAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICB2YXIgcmV0dmFsID0gZm9wZW4ocGF0aCwgbW9kZSk7XG4vLyAgICAgICAgICAgICBsb2dnZXIuaW5mbyh7IHRhZzogJ2ZvcGVuJyB9LCBgJHtwYXRoLnJlYWRDU3RyaW5nKCl9YCk7XG4vLyAgICAgICAgICAgICByZXR1cm4gcmV0dmFsO1xuLy8gICAgICAgICB9LFxuLy8gICAgICAgICAncG9pbnRlcicsXG4vLyAgICAgICAgIFsncG9pbnRlcicsICdwb2ludGVyJ10sXG4vLyAgICAgKSxcbi8vICk7XG4iLCIndXNlIHN0cmljdCdcblxuY29uc3QgZm9ybWF0ID0gcmVxdWlyZSgncXVpY2stZm9ybWF0LXVuZXNjYXBlZCcpXG5cbm1vZHVsZS5leHBvcnRzID0gcGlub1xuXG5jb25zdCBfY29uc29sZSA9IHBmR2xvYmFsVGhpc09yRmFsbGJhY2soKS5jb25zb2xlIHx8IHt9XG5jb25zdCBzdGRTZXJpYWxpemVycyA9IHtcbiAgbWFwSHR0cFJlcXVlc3Q6IG1vY2ssXG4gIG1hcEh0dHBSZXNwb25zZTogbW9jayxcbiAgd3JhcFJlcXVlc3RTZXJpYWxpemVyOiBwYXNzdGhyb3VnaCxcbiAgd3JhcFJlc3BvbnNlU2VyaWFsaXplcjogcGFzc3Rocm91Z2gsXG4gIHdyYXBFcnJvclNlcmlhbGl6ZXI6IHBhc3N0aHJvdWdoLFxuICByZXE6IG1vY2ssXG4gIHJlczogbW9jayxcbiAgZXJyOiBhc0VyclZhbHVlLFxuICBlcnJXaXRoQ2F1c2U6IGFzRXJyVmFsdWVcbn1cbmZ1bmN0aW9uIGxldmVsVG9WYWx1ZSAobGV2ZWwsIGxvZ2dlcikge1xuICByZXR1cm4gbGV2ZWwgPT09ICdzaWxlbnQnXG4gICAgPyBJbmZpbml0eVxuICAgIDogbG9nZ2VyLmxldmVscy52YWx1ZXNbbGV2ZWxdXG59XG5jb25zdCBiYXNlTG9nRnVuY3Rpb25TeW1ib2wgPSBTeW1ib2woJ3Bpbm8ubG9nRnVuY3MnKVxuY29uc3QgaGllcmFyY2h5U3ltYm9sID0gU3ltYm9sKCdwaW5vLmhpZXJhcmNoeScpXG5cbmNvbnN0IGxvZ0ZhbGxiYWNrTWFwID0ge1xuICBlcnJvcjogJ2xvZycsXG4gIGZhdGFsOiAnZXJyb3InLFxuICB3YXJuOiAnZXJyb3InLFxuICBpbmZvOiAnbG9nJyxcbiAgZGVidWc6ICdsb2cnLFxuICB0cmFjZTogJ2xvZydcbn1cblxuZnVuY3Rpb24gYXBwZW5kQ2hpbGRMb2dnZXIgKHBhcmVudExvZ2dlciwgY2hpbGRMb2dnZXIpIHtcbiAgY29uc3QgbmV3RW50cnkgPSB7XG4gICAgbG9nZ2VyOiBjaGlsZExvZ2dlcixcbiAgICBwYXJlbnQ6IHBhcmVudExvZ2dlcltoaWVyYXJjaHlTeW1ib2xdXG4gIH1cbiAgY2hpbGRMb2dnZXJbaGllcmFyY2h5U3ltYm9sXSA9IG5ld0VudHJ5XG59XG5cbmZ1bmN0aW9uIHNldHVwQmFzZUxvZ0Z1bmN0aW9ucyAobG9nZ2VyLCBsZXZlbHMsIHByb3RvKSB7XG4gIGNvbnN0IGxvZ0Z1bmN0aW9ucyA9IHt9XG4gIGxldmVscy5mb3JFYWNoKGxldmVsID0+IHtcbiAgICBsb2dGdW5jdGlvbnNbbGV2ZWxdID0gcHJvdG9bbGV2ZWxdID8gcHJvdG9bbGV2ZWxdIDogKF9jb25zb2xlW2xldmVsXSB8fCBfY29uc29sZVtsb2dGYWxsYmFja01hcFtsZXZlbF0gfHwgJ2xvZyddIHx8IG5vb3ApXG4gIH0pXG4gIGxvZ2dlcltiYXNlTG9nRnVuY3Rpb25TeW1ib2xdID0gbG9nRnVuY3Rpb25zXG59XG5cbmZ1bmN0aW9uIHNob3VsZFNlcmlhbGl6ZSAoc2VyaWFsaXplLCBzZXJpYWxpemVycykge1xuICBpZiAoQXJyYXkuaXNBcnJheShzZXJpYWxpemUpKSB7XG4gICAgY29uc3QgaGFzVG9GaWx0ZXIgPSBzZXJpYWxpemUuZmlsdGVyKGZ1bmN0aW9uIChrKSB7XG4gICAgICByZXR1cm4gayAhPT0gJyFzdGRTZXJpYWxpemVycy5lcnInXG4gICAgfSlcbiAgICByZXR1cm4gaGFzVG9GaWx0ZXJcbiAgfSBlbHNlIGlmIChzZXJpYWxpemUgPT09IHRydWUpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoc2VyaWFsaXplcnMpXG4gIH1cblxuICByZXR1cm4gZmFsc2Vcbn1cblxuZnVuY3Rpb24gcGlubyAob3B0cykge1xuICBvcHRzID0gb3B0cyB8fCB7fVxuICBvcHRzLmJyb3dzZXIgPSBvcHRzLmJyb3dzZXIgfHwge31cblxuICBjb25zdCB0cmFuc21pdCA9IG9wdHMuYnJvd3Nlci50cmFuc21pdFxuICBpZiAodHJhbnNtaXQgJiYgdHlwZW9mIHRyYW5zbWl0LnNlbmQgIT09ICdmdW5jdGlvbicpIHsgdGhyb3cgRXJyb3IoJ3Bpbm86IHRyYW5zbWl0IG9wdGlvbiBtdXN0IGhhdmUgYSBzZW5kIGZ1bmN0aW9uJykgfVxuXG4gIGNvbnN0IHByb3RvID0gb3B0cy5icm93c2VyLndyaXRlIHx8IF9jb25zb2xlXG4gIGlmIChvcHRzLmJyb3dzZXIud3JpdGUpIG9wdHMuYnJvd3Nlci5hc09iamVjdCA9IHRydWVcbiAgY29uc3Qgc2VyaWFsaXplcnMgPSBvcHRzLnNlcmlhbGl6ZXJzIHx8IHt9XG4gIGNvbnN0IHNlcmlhbGl6ZSA9IHNob3VsZFNlcmlhbGl6ZShvcHRzLmJyb3dzZXIuc2VyaWFsaXplLCBzZXJpYWxpemVycylcbiAgbGV0IHN0ZEVyclNlcmlhbGl6ZSA9IG9wdHMuYnJvd3Nlci5zZXJpYWxpemVcblxuICBpZiAoXG4gICAgQXJyYXkuaXNBcnJheShvcHRzLmJyb3dzZXIuc2VyaWFsaXplKSAmJlxuICAgIG9wdHMuYnJvd3Nlci5zZXJpYWxpemUuaW5kZXhPZignIXN0ZFNlcmlhbGl6ZXJzLmVycicpID4gLTFcbiAgKSBzdGRFcnJTZXJpYWxpemUgPSBmYWxzZVxuXG4gIGNvbnN0IGN1c3RvbUxldmVscyA9IE9iamVjdC5rZXlzKG9wdHMuY3VzdG9tTGV2ZWxzIHx8IHt9KVxuICBjb25zdCBsZXZlbHMgPSBbJ2Vycm9yJywgJ2ZhdGFsJywgJ3dhcm4nLCAnaW5mbycsICdkZWJ1ZycsICd0cmFjZSddLmNvbmNhdChjdXN0b21MZXZlbHMpXG5cbiAgaWYgKHR5cGVvZiBwcm90byA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGxldmVscy5mb3JFYWNoKGZ1bmN0aW9uIChsZXZlbCkge1xuICAgICAgcHJvdG9bbGV2ZWxdID0gcHJvdG9cbiAgICB9KVxuICB9XG4gIGlmIChvcHRzLmVuYWJsZWQgPT09IGZhbHNlIHx8IG9wdHMuYnJvd3Nlci5kaXNhYmxlZCkgb3B0cy5sZXZlbCA9ICdzaWxlbnQnXG4gIGNvbnN0IGxldmVsID0gb3B0cy5sZXZlbCB8fCAnaW5mbydcbiAgY29uc3QgbG9nZ2VyID0gT2JqZWN0LmNyZWF0ZShwcm90bylcbiAgaWYgKCFsb2dnZXIubG9nKSBsb2dnZXIubG9nID0gbm9vcFxuXG4gIHNldHVwQmFzZUxvZ0Z1bmN0aW9ucyhsb2dnZXIsIGxldmVscywgcHJvdG8pXG4gIC8vIHNldHVwIHJvb3QgaGllcmFyY2h5IGVudHJ5XG4gIGFwcGVuZENoaWxkTG9nZ2VyKHt9LCBsb2dnZXIpXG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGxvZ2dlciwgJ2xldmVsVmFsJywge1xuICAgIGdldDogZ2V0TGV2ZWxWYWxcbiAgfSlcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGxvZ2dlciwgJ2xldmVsJywge1xuICAgIGdldDogZ2V0TGV2ZWwsXG4gICAgc2V0OiBzZXRMZXZlbFxuICB9KVxuXG4gIGNvbnN0IHNldE9wdHMgPSB7XG4gICAgdHJhbnNtaXQsXG4gICAgc2VyaWFsaXplLFxuICAgIGFzT2JqZWN0OiBvcHRzLmJyb3dzZXIuYXNPYmplY3QsXG4gICAgbGV2ZWxzLFxuICAgIHRpbWVzdGFtcDogZ2V0VGltZUZ1bmN0aW9uKG9wdHMpXG4gIH1cbiAgbG9nZ2VyLmxldmVscyA9IGdldExldmVscyhvcHRzKVxuICBsb2dnZXIubGV2ZWwgPSBsZXZlbFxuXG4gIGxvZ2dlci5zZXRNYXhMaXN0ZW5lcnMgPSBsb2dnZXIuZ2V0TWF4TGlzdGVuZXJzID1cbiAgbG9nZ2VyLmVtaXQgPSBsb2dnZXIuYWRkTGlzdGVuZXIgPSBsb2dnZXIub24gPVxuICBsb2dnZXIucHJlcGVuZExpc3RlbmVyID0gbG9nZ2VyLm9uY2UgPVxuICBsb2dnZXIucHJlcGVuZE9uY2VMaXN0ZW5lciA9IGxvZ2dlci5yZW1vdmVMaXN0ZW5lciA9XG4gIGxvZ2dlci5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBsb2dnZXIubGlzdGVuZXJzID1cbiAgbG9nZ2VyLmxpc3RlbmVyQ291bnQgPSBsb2dnZXIuZXZlbnROYW1lcyA9XG4gIGxvZ2dlci53cml0ZSA9IGxvZ2dlci5mbHVzaCA9IG5vb3BcbiAgbG9nZ2VyLnNlcmlhbGl6ZXJzID0gc2VyaWFsaXplcnNcbiAgbG9nZ2VyLl9zZXJpYWxpemUgPSBzZXJpYWxpemVcbiAgbG9nZ2VyLl9zdGRFcnJTZXJpYWxpemUgPSBzdGRFcnJTZXJpYWxpemVcbiAgbG9nZ2VyLmNoaWxkID0gY2hpbGRcblxuICBpZiAodHJhbnNtaXQpIGxvZ2dlci5fbG9nRXZlbnQgPSBjcmVhdGVMb2dFdmVudFNoYXBlKClcblxuICBmdW5jdGlvbiBnZXRMZXZlbFZhbCAoKSB7XG4gICAgcmV0dXJuIGxldmVsVG9WYWx1ZSh0aGlzLmxldmVsLCB0aGlzKVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGV2ZWwgKCkge1xuICAgIHJldHVybiB0aGlzLl9sZXZlbFxuICB9XG4gIGZ1bmN0aW9uIHNldExldmVsIChsZXZlbCkge1xuICAgIGlmIChsZXZlbCAhPT0gJ3NpbGVudCcgJiYgIXRoaXMubGV2ZWxzLnZhbHVlc1tsZXZlbF0pIHtcbiAgICAgIHRocm93IEVycm9yKCd1bmtub3duIGxldmVsICcgKyBsZXZlbClcbiAgICB9XG4gICAgdGhpcy5fbGV2ZWwgPSBsZXZlbFxuXG4gICAgc2V0KHRoaXMsIHNldE9wdHMsIGxvZ2dlciwgJ2Vycm9yJykgLy8gPC0tIG11c3Qgc3RheSBmaXJzdFxuICAgIHNldCh0aGlzLCBzZXRPcHRzLCBsb2dnZXIsICdmYXRhbCcpXG4gICAgc2V0KHRoaXMsIHNldE9wdHMsIGxvZ2dlciwgJ3dhcm4nKVxuICAgIHNldCh0aGlzLCBzZXRPcHRzLCBsb2dnZXIsICdpbmZvJylcbiAgICBzZXQodGhpcywgc2V0T3B0cywgbG9nZ2VyLCAnZGVidWcnKVxuICAgIHNldCh0aGlzLCBzZXRPcHRzLCBsb2dnZXIsICd0cmFjZScpXG5cbiAgICBjdXN0b21MZXZlbHMuZm9yRWFjaCgobGV2ZWwpID0+IHtcbiAgICAgIHNldCh0aGlzLCBzZXRPcHRzLCBsb2dnZXIsIGxldmVsKVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBjaGlsZCAoYmluZGluZ3MsIGNoaWxkT3B0aW9ucykge1xuICAgIGlmICghYmluZGluZ3MpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbWlzc2luZyBiaW5kaW5ncyBmb3IgY2hpbGQgUGlubycpXG4gICAgfVxuICAgIGNoaWxkT3B0aW9ucyA9IGNoaWxkT3B0aW9ucyB8fCB7fVxuICAgIGlmIChzZXJpYWxpemUgJiYgYmluZGluZ3Muc2VyaWFsaXplcnMpIHtcbiAgICAgIGNoaWxkT3B0aW9ucy5zZXJpYWxpemVycyA9IGJpbmRpbmdzLnNlcmlhbGl6ZXJzXG4gICAgfVxuICAgIGNvbnN0IGNoaWxkT3B0aW9uc1NlcmlhbGl6ZXJzID0gY2hpbGRPcHRpb25zLnNlcmlhbGl6ZXJzXG4gICAgaWYgKHNlcmlhbGl6ZSAmJiBjaGlsZE9wdGlvbnNTZXJpYWxpemVycykge1xuICAgICAgdmFyIGNoaWxkU2VyaWFsaXplcnMgPSBPYmplY3QuYXNzaWduKHt9LCBzZXJpYWxpemVycywgY2hpbGRPcHRpb25zU2VyaWFsaXplcnMpXG4gICAgICB2YXIgY2hpbGRTZXJpYWxpemUgPSBvcHRzLmJyb3dzZXIuc2VyaWFsaXplID09PSB0cnVlXG4gICAgICAgID8gT2JqZWN0LmtleXMoY2hpbGRTZXJpYWxpemVycylcbiAgICAgICAgOiBzZXJpYWxpemVcbiAgICAgIGRlbGV0ZSBiaW5kaW5ncy5zZXJpYWxpemVyc1xuICAgICAgYXBwbHlTZXJpYWxpemVycyhbYmluZGluZ3NdLCBjaGlsZFNlcmlhbGl6ZSwgY2hpbGRTZXJpYWxpemVycywgdGhpcy5fc3RkRXJyU2VyaWFsaXplKVxuICAgIH1cbiAgICBmdW5jdGlvbiBDaGlsZCAocGFyZW50KSB7XG4gICAgICB0aGlzLl9jaGlsZExldmVsID0gKHBhcmVudC5fY2hpbGRMZXZlbCB8IDApICsgMVxuXG4gICAgICAvLyBtYWtlIHN1cmUgYmluZGluZ3MgYXJlIGF2YWlsYWJsZSBpbiB0aGUgYHNldGAgZnVuY3Rpb25cbiAgICAgIHRoaXMuYmluZGluZ3MgPSBiaW5kaW5nc1xuXG4gICAgICBpZiAoY2hpbGRTZXJpYWxpemVycykge1xuICAgICAgICB0aGlzLnNlcmlhbGl6ZXJzID0gY2hpbGRTZXJpYWxpemVyc1xuICAgICAgICB0aGlzLl9zZXJpYWxpemUgPSBjaGlsZFNlcmlhbGl6ZVxuICAgICAgfVxuICAgICAgaWYgKHRyYW5zbWl0KSB7XG4gICAgICAgIHRoaXMuX2xvZ0V2ZW50ID0gY3JlYXRlTG9nRXZlbnRTaGFwZShcbiAgICAgICAgICBbXS5jb25jYXQocGFyZW50Ll9sb2dFdmVudC5iaW5kaW5ncywgYmluZGluZ3MpXG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9XG4gICAgQ2hpbGQucHJvdG90eXBlID0gdGhpc1xuICAgIGNvbnN0IG5ld0xvZ2dlciA9IG5ldyBDaGlsZCh0aGlzKVxuXG4gICAgLy8gbXVzdCBoYXBwZW4gYmVmb3JlIHRoZSBsZXZlbCBpcyBhc3NpZ25lZFxuICAgIGFwcGVuZENoaWxkTG9nZ2VyKHRoaXMsIG5ld0xvZ2dlcilcbiAgICAvLyByZXF1aXJlZCB0byBhY3R1YWxseSBpbml0aWFsaXplIHRoZSBsb2dnZXIgZnVuY3Rpb25zIGZvciBhbnkgZ2l2ZW4gY2hpbGRcbiAgICBuZXdMb2dnZXIubGV2ZWwgPSB0aGlzLmxldmVsXG5cbiAgICByZXR1cm4gbmV3TG9nZ2VyXG4gIH1cbiAgcmV0dXJuIGxvZ2dlclxufVxuXG5mdW5jdGlvbiBnZXRMZXZlbHMgKG9wdHMpIHtcbiAgY29uc3QgY3VzdG9tTGV2ZWxzID0gb3B0cy5jdXN0b21MZXZlbHMgfHwge31cblxuICBjb25zdCB2YWx1ZXMgPSBPYmplY3QuYXNzaWduKHt9LCBwaW5vLmxldmVscy52YWx1ZXMsIGN1c3RvbUxldmVscylcbiAgY29uc3QgbGFiZWxzID0gT2JqZWN0LmFzc2lnbih7fSwgcGluby5sZXZlbHMubGFiZWxzLCBpbnZlcnRPYmplY3QoY3VzdG9tTGV2ZWxzKSlcblxuICByZXR1cm4ge1xuICAgIHZhbHVlcyxcbiAgICBsYWJlbHNcbiAgfVxufVxuXG5mdW5jdGlvbiBpbnZlcnRPYmplY3QgKG9iaikge1xuICBjb25zdCBpbnZlcnRlZCA9IHt9XG4gIE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgaW52ZXJ0ZWRbb2JqW2tleV1dID0ga2V5XG4gIH0pXG4gIHJldHVybiBpbnZlcnRlZFxufVxuXG5waW5vLmxldmVscyA9IHtcbiAgdmFsdWVzOiB7XG4gICAgZmF0YWw6IDYwLFxuICAgIGVycm9yOiA1MCxcbiAgICB3YXJuOiA0MCxcbiAgICBpbmZvOiAzMCxcbiAgICBkZWJ1ZzogMjAsXG4gICAgdHJhY2U6IDEwXG4gIH0sXG4gIGxhYmVsczoge1xuICAgIDEwOiAndHJhY2UnLFxuICAgIDIwOiAnZGVidWcnLFxuICAgIDMwOiAnaW5mbycsXG4gICAgNDA6ICd3YXJuJyxcbiAgICA1MDogJ2Vycm9yJyxcbiAgICA2MDogJ2ZhdGFsJ1xuICB9XG59XG5cbnBpbm8uc3RkU2VyaWFsaXplcnMgPSBzdGRTZXJpYWxpemVyc1xucGluby5zdGRUaW1lRnVuY3Rpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgeyBudWxsVGltZSwgZXBvY2hUaW1lLCB1bml4VGltZSwgaXNvVGltZSB9KVxuXG5mdW5jdGlvbiBnZXRCaW5kaW5nQ2hhaW4gKGxvZ2dlcikge1xuICBjb25zdCBiaW5kaW5ncyA9IFtdXG4gIGlmIChsb2dnZXIuYmluZGluZ3MpIHtcbiAgICBiaW5kaW5ncy5wdXNoKGxvZ2dlci5iaW5kaW5ncylcbiAgfVxuXG4gIC8vIHRyYXZlcnNlIHVwIHRoZSB0cmVlIHRvIGdldCBhbGwgYmluZGluZ3NcbiAgbGV0IGhpZXJhcmNoeSA9IGxvZ2dlcltoaWVyYXJjaHlTeW1ib2xdXG4gIHdoaWxlIChoaWVyYXJjaHkucGFyZW50KSB7XG4gICAgaGllcmFyY2h5ID0gaGllcmFyY2h5LnBhcmVudFxuICAgIGlmIChoaWVyYXJjaHkubG9nZ2VyLmJpbmRpbmdzKSB7XG4gICAgICBiaW5kaW5ncy5wdXNoKGhpZXJhcmNoeS5sb2dnZXIuYmluZGluZ3MpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJpbmRpbmdzLnJldmVyc2UoKVxufVxuXG5mdW5jdGlvbiBzZXQgKHNlbGYsIG9wdHMsIHJvb3RMb2dnZXIsIGxldmVsKSB7XG4gIC8vIG92ZXJyaWRlIHRoZSBjdXJyZW50IGxvZyBmdW5jdGlvbnMgd2l0aCBlaXRoZXIgYG5vb3BgIG9yIHRoZSBiYXNlIGxvZyBmdW5jdGlvblxuICBzZWxmW2xldmVsXSA9IGxldmVsVG9WYWx1ZShzZWxmLmxldmVsLCByb290TG9nZ2VyKSA+IGxldmVsVG9WYWx1ZShsZXZlbCwgcm9vdExvZ2dlcilcbiAgICA/IG5vb3BcbiAgICA6IHJvb3RMb2dnZXJbYmFzZUxvZ0Z1bmN0aW9uU3ltYm9sXVtsZXZlbF1cblxuICBpZiAoIW9wdHMudHJhbnNtaXQgJiYgc2VsZltsZXZlbF0gPT09IG5vb3ApIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIC8vIG1ha2Ugc3VyZSB0aGUgbG9nIGZvcm1hdCBpcyBjb3JyZWN0XG4gIHNlbGZbbGV2ZWxdID0gY3JlYXRlV3JhcChzZWxmLCBvcHRzLCByb290TG9nZ2VyLCBsZXZlbClcblxuICAvLyBwcmVwZW5kIGJpbmRpbmdzIGlmIGl0IGlzIG5vdCB0aGUgcm9vdCBsb2dnZXJcbiAgY29uc3QgYmluZGluZ3MgPSBnZXRCaW5kaW5nQ2hhaW4oc2VsZilcbiAgaWYgKGJpbmRpbmdzLmxlbmd0aCA9PT0gMCkge1xuICAgIC8vIGVhcmx5IGV4aXQgaW4gY2FzZSBmb3Igcm9vdExvZ2dlclxuICAgIHJldHVyblxuICB9XG4gIHNlbGZbbGV2ZWxdID0gcHJlcGVuZEJpbmRpbmdzSW5Bcmd1bWVudHMoYmluZGluZ3MsIHNlbGZbbGV2ZWxdKVxufVxuXG5mdW5jdGlvbiBwcmVwZW5kQmluZGluZ3NJbkFyZ3VtZW50cyAoYmluZGluZ3MsIGxvZ0Z1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbG9nRnVuYy5hcHBseSh0aGlzLCBbLi4uYmluZGluZ3MsIC4uLmFyZ3VtZW50c10pXG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlV3JhcCAoc2VsZiwgb3B0cywgcm9vdExvZ2dlciwgbGV2ZWwpIHtcbiAgcmV0dXJuIChmdW5jdGlvbiAod3JpdGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gTE9HICgpIHtcbiAgICAgIGNvbnN0IHRzID0gb3B0cy50aW1lc3RhbXAoKVxuICAgICAgY29uc3QgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKVxuICAgICAgY29uc3QgcHJvdG8gPSAoT2JqZWN0LmdldFByb3RvdHlwZU9mICYmIE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKSA9PT0gX2NvbnNvbGUpID8gX2NvbnNvbGUgOiB0aGlzXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV1cblxuICAgICAgaWYgKG9wdHMuc2VyaWFsaXplICYmICFvcHRzLmFzT2JqZWN0KSB7XG4gICAgICAgIGFwcGx5U2VyaWFsaXplcnMoYXJncywgdGhpcy5fc2VyaWFsaXplLCB0aGlzLnNlcmlhbGl6ZXJzLCB0aGlzLl9zdGRFcnJTZXJpYWxpemUpXG4gICAgICB9XG4gICAgICBpZiAob3B0cy5hc09iamVjdCkgd3JpdGUuY2FsbChwcm90bywgYXNPYmplY3QodGhpcywgbGV2ZWwsIGFyZ3MsIHRzKSlcbiAgICAgIGVsc2Ugd3JpdGUuYXBwbHkocHJvdG8sIGFyZ3MpXG5cbiAgICAgIGlmIChvcHRzLnRyYW5zbWl0KSB7XG4gICAgICAgIGNvbnN0IHRyYW5zbWl0TGV2ZWwgPSBvcHRzLnRyYW5zbWl0LmxldmVsIHx8IHNlbGYuX2xldmVsXG4gICAgICAgIGNvbnN0IHRyYW5zbWl0VmFsdWUgPSByb290TG9nZ2VyLmxldmVscy52YWx1ZXNbdHJhbnNtaXRMZXZlbF1cbiAgICAgICAgY29uc3QgbWV0aG9kVmFsdWUgPSByb290TG9nZ2VyLmxldmVscy52YWx1ZXNbbGV2ZWxdXG4gICAgICAgIGlmIChtZXRob2RWYWx1ZSA8IHRyYW5zbWl0VmFsdWUpIHJldHVyblxuICAgICAgICB0cmFuc21pdCh0aGlzLCB7XG4gICAgICAgICAgdHMsXG4gICAgICAgICAgbWV0aG9kTGV2ZWw6IGxldmVsLFxuICAgICAgICAgIG1ldGhvZFZhbHVlLFxuICAgICAgICAgIHRyYW5zbWl0TGV2ZWwsXG4gICAgICAgICAgdHJhbnNtaXRWYWx1ZTogcm9vdExvZ2dlci5sZXZlbHMudmFsdWVzW29wdHMudHJhbnNtaXQubGV2ZWwgfHwgc2VsZi5fbGV2ZWxdLFxuICAgICAgICAgIHNlbmQ6IG9wdHMudHJhbnNtaXQuc2VuZCxcbiAgICAgICAgICB2YWw6IGxldmVsVG9WYWx1ZShzZWxmLl9sZXZlbCwgcm9vdExvZ2dlcilcbiAgICAgICAgfSwgYXJncylcbiAgICAgIH1cbiAgICB9XG4gIH0pKHNlbGZbYmFzZUxvZ0Z1bmN0aW9uU3ltYm9sXVtsZXZlbF0pXG59XG5cbmZ1bmN0aW9uIGFzT2JqZWN0IChsb2dnZXIsIGxldmVsLCBhcmdzLCB0cykge1xuICBpZiAobG9nZ2VyLl9zZXJpYWxpemUpIGFwcGx5U2VyaWFsaXplcnMoYXJncywgbG9nZ2VyLl9zZXJpYWxpemUsIGxvZ2dlci5zZXJpYWxpemVycywgbG9nZ2VyLl9zdGRFcnJTZXJpYWxpemUpXG4gIGNvbnN0IGFyZ3NDbG9uZWQgPSBhcmdzLnNsaWNlKClcbiAgbGV0IG1zZyA9IGFyZ3NDbG9uZWRbMF1cbiAgY29uc3QgbyA9IHt9XG4gIGlmICh0cykge1xuICAgIG8udGltZSA9IHRzXG4gIH1cbiAgby5sZXZlbCA9IGxvZ2dlci5sZXZlbHMudmFsdWVzW2xldmVsXVxuICBsZXQgbHZsID0gKGxvZ2dlci5fY2hpbGRMZXZlbCB8IDApICsgMVxuICBpZiAobHZsIDwgMSkgbHZsID0gMVxuICAvLyBkZWxpYmVyYXRlLCBjYXRjaGluZyBvYmplY3RzLCBhcnJheXNcbiAgaWYgKG1zZyAhPT0gbnVsbCAmJiB0eXBlb2YgbXNnID09PSAnb2JqZWN0Jykge1xuICAgIHdoaWxlIChsdmwtLSAmJiB0eXBlb2YgYXJnc0Nsb25lZFswXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24obywgYXJnc0Nsb25lZC5zaGlmdCgpKVxuICAgIH1cbiAgICBtc2cgPSBhcmdzQ2xvbmVkLmxlbmd0aCA/IGZvcm1hdChhcmdzQ2xvbmVkLnNoaWZ0KCksIGFyZ3NDbG9uZWQpIDogdW5kZWZpbmVkXG4gIH0gZWxzZSBpZiAodHlwZW9mIG1zZyA9PT0gJ3N0cmluZycpIG1zZyA9IGZvcm1hdChhcmdzQ2xvbmVkLnNoaWZ0KCksIGFyZ3NDbG9uZWQpXG4gIGlmIChtc2cgIT09IHVuZGVmaW5lZCkgby5tc2cgPSBtc2dcbiAgcmV0dXJuIG9cbn1cblxuZnVuY3Rpb24gYXBwbHlTZXJpYWxpemVycyAoYXJncywgc2VyaWFsaXplLCBzZXJpYWxpemVycywgc3RkRXJyU2VyaWFsaXplKSB7XG4gIGZvciAoY29uc3QgaSBpbiBhcmdzKSB7XG4gICAgaWYgKHN0ZEVyclNlcmlhbGl6ZSAmJiBhcmdzW2ldIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIGFyZ3NbaV0gPSBwaW5vLnN0ZFNlcmlhbGl6ZXJzLmVycihhcmdzW2ldKVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGFyZ3NbaV0gPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KGFyZ3NbaV0pKSB7XG4gICAgICBmb3IgKGNvbnN0IGsgaW4gYXJnc1tpXSkge1xuICAgICAgICBpZiAoc2VyaWFsaXplICYmIHNlcmlhbGl6ZS5pbmRleE9mKGspID4gLTEgJiYgayBpbiBzZXJpYWxpemVycykge1xuICAgICAgICAgIGFyZ3NbaV1ba10gPSBzZXJpYWxpemVyc1trXShhcmdzW2ldW2tdKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHRyYW5zbWl0IChsb2dnZXIsIG9wdHMsIGFyZ3MpIHtcbiAgY29uc3Qgc2VuZCA9IG9wdHMuc2VuZFxuICBjb25zdCB0cyA9IG9wdHMudHNcbiAgY29uc3QgbWV0aG9kTGV2ZWwgPSBvcHRzLm1ldGhvZExldmVsXG4gIGNvbnN0IG1ldGhvZFZhbHVlID0gb3B0cy5tZXRob2RWYWx1ZVxuICBjb25zdCB2YWwgPSBvcHRzLnZhbFxuICBjb25zdCBiaW5kaW5ncyA9IGxvZ2dlci5fbG9nRXZlbnQuYmluZGluZ3NcblxuICBhcHBseVNlcmlhbGl6ZXJzKFxuICAgIGFyZ3MsXG4gICAgbG9nZ2VyLl9zZXJpYWxpemUgfHwgT2JqZWN0LmtleXMobG9nZ2VyLnNlcmlhbGl6ZXJzKSxcbiAgICBsb2dnZXIuc2VyaWFsaXplcnMsXG4gICAgbG9nZ2VyLl9zdGRFcnJTZXJpYWxpemUgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBsb2dnZXIuX3N0ZEVyclNlcmlhbGl6ZVxuICApXG4gIGxvZ2dlci5fbG9nRXZlbnQudHMgPSB0c1xuICBsb2dnZXIuX2xvZ0V2ZW50Lm1lc3NhZ2VzID0gYXJncy5maWx0ZXIoZnVuY3Rpb24gKGFyZykge1xuICAgIC8vIGJpbmRpbmdzIGNhbiBvbmx5IGJlIG9iamVjdHMsIHNvIHJlZmVyZW5jZSBlcXVhbGl0eSBjaGVjayB2aWEgaW5kZXhPZiBpcyBmaW5lXG4gICAgcmV0dXJuIGJpbmRpbmdzLmluZGV4T2YoYXJnKSA9PT0gLTFcbiAgfSlcblxuICBsb2dnZXIuX2xvZ0V2ZW50LmxldmVsLmxhYmVsID0gbWV0aG9kTGV2ZWxcbiAgbG9nZ2VyLl9sb2dFdmVudC5sZXZlbC52YWx1ZSA9IG1ldGhvZFZhbHVlXG5cbiAgc2VuZChtZXRob2RMZXZlbCwgbG9nZ2VyLl9sb2dFdmVudCwgdmFsKVxuXG4gIGxvZ2dlci5fbG9nRXZlbnQgPSBjcmVhdGVMb2dFdmVudFNoYXBlKGJpbmRpbmdzKVxufVxuXG5mdW5jdGlvbiBjcmVhdGVMb2dFdmVudFNoYXBlIChiaW5kaW5ncykge1xuICByZXR1cm4ge1xuICAgIHRzOiAwLFxuICAgIG1lc3NhZ2VzOiBbXSxcbiAgICBiaW5kaW5nczogYmluZGluZ3MgfHwgW10sXG4gICAgbGV2ZWw6IHsgbGFiZWw6ICcnLCB2YWx1ZTogMCB9XG4gIH1cbn1cblxuZnVuY3Rpb24gYXNFcnJWYWx1ZSAoZXJyKSB7XG4gIGNvbnN0IG9iaiA9IHtcbiAgICB0eXBlOiBlcnIuY29uc3RydWN0b3IubmFtZSxcbiAgICBtc2c6IGVyci5tZXNzYWdlLFxuICAgIHN0YWNrOiBlcnIuc3RhY2tcbiAgfVxuICBmb3IgKGNvbnN0IGtleSBpbiBlcnIpIHtcbiAgICBpZiAob2JqW2tleV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgb2JqW2tleV0gPSBlcnJba2V5XVxuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqXG59XG5cbmZ1bmN0aW9uIGdldFRpbWVGdW5jdGlvbiAob3B0cykge1xuICBpZiAodHlwZW9mIG9wdHMudGltZXN0YW1wID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIG9wdHMudGltZXN0YW1wXG4gIH1cbiAgaWYgKG9wdHMudGltZXN0YW1wID09PSBmYWxzZSkge1xuICAgIHJldHVybiBudWxsVGltZVxuICB9XG4gIHJldHVybiBlcG9jaFRpbWVcbn1cblxuZnVuY3Rpb24gbW9jayAoKSB7IHJldHVybiB7fSB9XG5mdW5jdGlvbiBwYXNzdGhyb3VnaCAoYSkgeyByZXR1cm4gYSB9XG5mdW5jdGlvbiBub29wICgpIHt9XG5cbmZ1bmN0aW9uIG51bGxUaW1lICgpIHsgcmV0dXJuIGZhbHNlIH1cbmZ1bmN0aW9uIGVwb2NoVGltZSAoKSB7IHJldHVybiBEYXRlLm5vdygpIH1cbmZ1bmN0aW9uIHVuaXhUaW1lICgpIHsgcmV0dXJuIE1hdGgucm91bmQoRGF0ZS5ub3coKSAvIDEwMDAuMCkgfVxuZnVuY3Rpb24gaXNvVGltZSAoKSB7IHJldHVybiBuZXcgRGF0ZShEYXRlLm5vdygpKS50b0lTT1N0cmluZygpIH0gLy8gdXNpbmcgRGF0ZS5ub3coKSBmb3IgdGVzdGFiaWxpdHlcblxuLyogZXNsaW50LWRpc2FibGUgKi9cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5mdW5jdGlvbiBwZkdsb2JhbFRoaXNPckZhbGxiYWNrICgpIHtcbiAgZnVuY3Rpb24gZGVmZCAobykgeyByZXR1cm4gdHlwZW9mIG8gIT09ICd1bmRlZmluZWQnICYmIG8gfVxuICB0cnkge1xuICAgIGlmICh0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCcpIHJldHVybiBnbG9iYWxUaGlzXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE9iamVjdC5wcm90b3R5cGUsICdnbG9iYWxUaGlzJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRlbGV0ZSBPYmplY3QucHJvdG90eXBlLmdsb2JhbFRoaXNcbiAgICAgICAgcmV0dXJuICh0aGlzLmdsb2JhbFRoaXMgPSB0aGlzKVxuICAgICAgfSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pXG4gICAgcmV0dXJuIGdsb2JhbFRoaXNcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBkZWZkKHNlbGYpIHx8IGRlZmQod2luZG93KSB8fCBkZWZkKHRoaXMpIHx8IHt9XG4gIH1cbn1cbi8qIGVzbGludC1lbmFibGUgKi9cblxubW9kdWxlLmV4cG9ydHMuZGVmYXVsdCA9IHBpbm9cbm1vZHVsZS5leHBvcnRzLnBpbm8gPSBwaW5vXG4iLCJleHBvcnQgZGVmYXVsdCB7XG4gIGlzYXR0eSxcbiAgUmVhZFN0cmVhbSxcbiAgV3JpdGVTdHJlYW0sXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gaXNhdHR5KCkge1xuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZWFkU3RyZWFtKCkge1xuICB0aHJvdyBuZXcgRXJyb3IoJ3R0eS5SZWFkU3RyZWFtIGlzIG5vdCBpbXBsZW1lbnRlZCcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gV3JpdGVTdHJlYW0oKSB7XG4gIHRocm93IG5ldyBFcnJvcigndHR5LldyaXRlU3RyZWFtIGlzIG5vdCBpbXBsZW1lbnRlZCcpO1xufVxuIiwiaW1wb3J0ICogYXMgdHR5IGZyb20gXCJ0dHlcIlxuXG5jb25zdCB7XG4gIGVudiA9IHt9LFxuICBhcmd2ID0gW10sXG4gIHBsYXRmb3JtID0gXCJcIixcbn0gPSB0eXBlb2YgcHJvY2VzcyA9PT0gXCJ1bmRlZmluZWRcIiA/IHt9IDogcHJvY2Vzc1xuXG5jb25zdCBpc0Rpc2FibGVkID0gXCJOT19DT0xPUlwiIGluIGVudiB8fCBhcmd2LmluY2x1ZGVzKFwiLS1uby1jb2xvclwiKVxuY29uc3QgaXNGb3JjZWQgPSBcIkZPUkNFX0NPTE9SXCIgaW4gZW52IHx8IGFyZ3YuaW5jbHVkZXMoXCItLWNvbG9yXCIpXG5jb25zdCBpc1dpbmRvd3MgPSBwbGF0Zm9ybSA9PT0gXCJ3aW4zMlwiXG5jb25zdCBpc0R1bWJUZXJtaW5hbCA9IGVudi5URVJNID09PSBcImR1bWJcIlxuXG5jb25zdCBpc0NvbXBhdGlibGVUZXJtaW5hbCA9XG4gIHR0eSAmJiB0dHkuaXNhdHR5ICYmIHR0eS5pc2F0dHkoMSkgJiYgZW52LlRFUk0gJiYgIWlzRHVtYlRlcm1pbmFsXG5cbmNvbnN0IGlzQ0kgPVxuICBcIkNJXCIgaW4gZW52ICYmXG4gIChcIkdJVEhVQl9BQ1RJT05TXCIgaW4gZW52IHx8IFwiR0lUTEFCX0NJXCIgaW4gZW52IHx8IFwiQ0lSQ0xFQ0lcIiBpbiBlbnYpXG5cbmV4cG9ydCBjb25zdCBpc0NvbG9yU3VwcG9ydGVkID1cbiAgIWlzRGlzYWJsZWQgJiZcbiAgKGlzRm9yY2VkIHx8IChpc1dpbmRvd3MgJiYgIWlzRHVtYlRlcm1pbmFsKSB8fCBpc0NvbXBhdGlibGVUZXJtaW5hbCB8fCBpc0NJKVxuXG5jb25zdCByZXBsYWNlQ2xvc2UgPSAoXG4gIGluZGV4LFxuICBzdHJpbmcsXG4gIGNsb3NlLFxuICByZXBsYWNlLFxuICBoZWFkID0gc3RyaW5nLnN1YnN0cmluZygwLCBpbmRleCkgKyByZXBsYWNlLFxuICB0YWlsID0gc3RyaW5nLnN1YnN0cmluZyhpbmRleCArIGNsb3NlLmxlbmd0aCksXG4gIG5leHQgPSB0YWlsLmluZGV4T2YoY2xvc2UpXG4pID0+IGhlYWQgKyAobmV4dCA8IDAgPyB0YWlsIDogcmVwbGFjZUNsb3NlKG5leHQsIHRhaWwsIGNsb3NlLCByZXBsYWNlKSlcblxuY29uc3QgY2xlYXJCbGVlZCA9IChpbmRleCwgc3RyaW5nLCBvcGVuLCBjbG9zZSwgcmVwbGFjZSkgPT5cbiAgaW5kZXggPCAwXG4gICAgPyBvcGVuICsgc3RyaW5nICsgY2xvc2VcbiAgICA6IG9wZW4gKyByZXBsYWNlQ2xvc2UoaW5kZXgsIHN0cmluZywgY2xvc2UsIHJlcGxhY2UpICsgY2xvc2VcblxuY29uc3QgZmlsdGVyRW1wdHkgPVxuICAob3BlbiwgY2xvc2UsIHJlcGxhY2UgPSBvcGVuLCBhdCA9IG9wZW4ubGVuZ3RoICsgMSkgPT5cbiAgKHN0cmluZykgPT5cbiAgICBzdHJpbmcgfHwgIShzdHJpbmcgPT09IFwiXCIgfHwgc3RyaW5nID09PSB1bmRlZmluZWQpXG4gICAgICA/IGNsZWFyQmxlZWQoXG4gICAgICAgICAgKFwiXCIgKyBzdHJpbmcpLmluZGV4T2YoY2xvc2UsIGF0KSxcbiAgICAgICAgICBzdHJpbmcsXG4gICAgICAgICAgb3BlbixcbiAgICAgICAgICBjbG9zZSxcbiAgICAgICAgICByZXBsYWNlXG4gICAgICAgIClcbiAgICAgIDogXCJcIlxuXG5jb25zdCBpbml0ID0gKG9wZW4sIGNsb3NlLCByZXBsYWNlKSA9PlxuICBmaWx0ZXJFbXB0eShgXFx4MWJbJHtvcGVufW1gLCBgXFx4MWJbJHtjbG9zZX1tYCwgcmVwbGFjZSlcblxuY29uc3QgY29sb3JzID0ge1xuICByZXNldDogaW5pdCgwLCAwKSxcbiAgYm9sZDogaW5pdCgxLCAyMiwgXCJcXHgxYlsyMm1cXHgxYlsxbVwiKSxcbiAgZGltOiBpbml0KDIsIDIyLCBcIlxceDFiWzIybVxceDFiWzJtXCIpLFxuICBpdGFsaWM6IGluaXQoMywgMjMpLFxuICB1bmRlcmxpbmU6IGluaXQoNCwgMjQpLFxuICBpbnZlcnNlOiBpbml0KDcsIDI3KSxcbiAgaGlkZGVuOiBpbml0KDgsIDI4KSxcbiAgc3RyaWtldGhyb3VnaDogaW5pdCg5LCAyOSksXG4gIGJsYWNrOiBpbml0KDMwLCAzOSksXG4gIHJlZDogaW5pdCgzMSwgMzkpLFxuICBncmVlbjogaW5pdCgzMiwgMzkpLFxuICB5ZWxsb3c6IGluaXQoMzMsIDM5KSxcbiAgYmx1ZTogaW5pdCgzNCwgMzkpLFxuICBtYWdlbnRhOiBpbml0KDM1LCAzOSksXG4gIGN5YW46IGluaXQoMzYsIDM5KSxcbiAgd2hpdGU6IGluaXQoMzcsIDM5KSxcbiAgZ3JheTogaW5pdCg5MCwgMzkpLFxuICBiZ0JsYWNrOiBpbml0KDQwLCA0OSksXG4gIGJnUmVkOiBpbml0KDQxLCA0OSksXG4gIGJnR3JlZW46IGluaXQoNDIsIDQ5KSxcbiAgYmdZZWxsb3c6IGluaXQoNDMsIDQ5KSxcbiAgYmdCbHVlOiBpbml0KDQ0LCA0OSksXG4gIGJnTWFnZW50YTogaW5pdCg0NSwgNDkpLFxuICBiZ0N5YW46IGluaXQoNDYsIDQ5KSxcbiAgYmdXaGl0ZTogaW5pdCg0NywgNDkpLFxuICBibGFja0JyaWdodDogaW5pdCg5MCwgMzkpLFxuICByZWRCcmlnaHQ6IGluaXQoOTEsIDM5KSxcbiAgZ3JlZW5CcmlnaHQ6IGluaXQoOTIsIDM5KSxcbiAgeWVsbG93QnJpZ2h0OiBpbml0KDkzLCAzOSksXG4gIGJsdWVCcmlnaHQ6IGluaXQoOTQsIDM5KSxcbiAgbWFnZW50YUJyaWdodDogaW5pdCg5NSwgMzkpLFxuICBjeWFuQnJpZ2h0OiBpbml0KDk2LCAzOSksXG4gIHdoaXRlQnJpZ2h0OiBpbml0KDk3LCAzOSksXG4gIGJnQmxhY2tCcmlnaHQ6IGluaXQoMTAwLCA0OSksXG4gIGJnUmVkQnJpZ2h0OiBpbml0KDEwMSwgNDkpLFxuICBiZ0dyZWVuQnJpZ2h0OiBpbml0KDEwMiwgNDkpLFxuICBiZ1llbGxvd0JyaWdodDogaW5pdCgxMDMsIDQ5KSxcbiAgYmdCbHVlQnJpZ2h0OiBpbml0KDEwNCwgNDkpLFxuICBiZ01hZ2VudGFCcmlnaHQ6IGluaXQoMTA1LCA0OSksXG4gIGJnQ3lhbkJyaWdodDogaW5pdCgxMDYsIDQ5KSxcbiAgYmdXaGl0ZUJyaWdodDogaW5pdCgxMDcsIDQ5KSxcbn1cblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUNvbG9ycyA9ICh7IHVzZUNvbG9yID0gaXNDb2xvclN1cHBvcnRlZCB9ID0ge30pID0+XG4gIHVzZUNvbG9yXG4gICAgPyBjb2xvcnNcbiAgICA6IE9iamVjdC5rZXlzKGNvbG9ycykucmVkdWNlKFxuICAgICAgICAoY29sb3JzLCBrZXkpID0+ICh7IC4uLmNvbG9ycywgW2tleV06IFN0cmluZyB9KSxcbiAgICAgICAge31cbiAgICAgIClcblxuZXhwb3J0IGNvbnN0IHtcbiAgcmVzZXQsXG4gIGJvbGQsXG4gIGRpbSxcbiAgaXRhbGljLFxuICB1bmRlcmxpbmUsXG4gIGludmVyc2UsXG4gIGhpZGRlbixcbiAgc3RyaWtldGhyb3VnaCxcbiAgYmxhY2ssXG4gIHJlZCxcbiAgZ3JlZW4sXG4gIHllbGxvdyxcbiAgYmx1ZSxcbiAgbWFnZW50YSxcbiAgY3lhbixcbiAgd2hpdGUsXG4gIGdyYXksXG4gIGJnQmxhY2ssXG4gIGJnUmVkLFxuICBiZ0dyZWVuLFxuICBiZ1llbGxvdyxcbiAgYmdCbHVlLFxuICBiZ01hZ2VudGEsXG4gIGJnQ3lhbixcbiAgYmdXaGl0ZSxcbiAgYmxhY2tCcmlnaHQsXG4gIHJlZEJyaWdodCxcbiAgZ3JlZW5CcmlnaHQsXG4gIHllbGxvd0JyaWdodCxcbiAgYmx1ZUJyaWdodCxcbiAgbWFnZW50YUJyaWdodCxcbiAgY3lhbkJyaWdodCxcbiAgd2hpdGVCcmlnaHQsXG4gIGJnQmxhY2tCcmlnaHQsXG4gIGJnUmVkQnJpZ2h0LFxuICBiZ0dyZWVuQnJpZ2h0LFxuICBiZ1llbGxvd0JyaWdodCxcbiAgYmdCbHVlQnJpZ2h0LFxuICBiZ01hZ2VudGFCcmlnaHQsXG4gIGJnQ3lhbkJyaWdodCxcbiAgYmdXaGl0ZUJyaWdodCxcbn0gPSBjcmVhdGVDb2xvcnMoKVxuIiwiaW1wb3J0IHsgaG9vayB9IGZyb20gJ0BjbG9ja3dvcmsvaG9va3MnO1xuaW1wb3J0IHsgVGV4dCwgQ2xhc3NlcyB9IGZyb20gJ0BjbG9ja3dvcmsvY29tbW9uJztcbmltcG9ydCB7IGFsd2F5cyB9IGZyb20gJ0BjbG9ja3dvcmsvaG9va3MnO1xuaW1wb3J0IHsgRmlsdGVyIH0gZnJvbSAnQGNsb2Nrd29yay9sb2dnaW5nJztcbmNvbnN0IENvbmZpZ3VyYXRpb25zID0ge1xuICAgIEJSOiB7XG4gICAgICAgIHRpbWV6b25lSWQ6ICdBbWVyaWNhL1Nhb19QYXVsbycsXG4gICAgICAgIG1jYzogJzcyNCcsXG4gICAgICAgIG1uYzogJzEwJyxcbiAgICAgICAgY29kZTogJzU1JyxcbiAgICAgICAgbWNjbW5jOiBgJHs3MjR9JHsxMH1gLFxuICAgICAgICBsb2NhbGU6IFsnQlInLCAncHQnXSxcbiAgICAgICAgY291bnRyeTogJ2JyJyxcbiAgICAgICAgb3BlcmF0b3I6ICdWaXZvJyxcbiAgICB9LFxuICAgIElOOiB7XG4gICAgICAgIHRpbWV6b25lSWQ6ICdBc2lhL0tvbGthdGEnLFxuICAgICAgICBtY2M6ICc0MDQnLFxuICAgICAgICBtbmM6ICcyOTknLFxuICAgICAgICBjb2RlOiAnOTEnLFxuICAgICAgICBtY2NtbmM6IGAkezQwNH0kezI5OX1gLFxuICAgICAgICBsb2NhbGU6IFsnSU4nLCAnaW4nXSxcbiAgICAgICAgY291bnRyeTogJ2luJyxcbiAgICAgICAgb3BlcmF0b3I6ICdGYWlsZWQgQ2FsbHMnLFxuICAgIH0sXG4gICAgVkk6IHtcbiAgICAgICAgdGltZXpvbmVJZDogJ0FtZXJpY2EvU3RfVGhvbWFzJyxcbiAgICAgICAgbWNjOiAnMzc2JyxcbiAgICAgICAgbW5jOiAnOTk5JyxcbiAgICAgICAgY29kZTogJzEzNDAnLFxuICAgICAgICBtY2NtbmM6IGAkezk5OX0kezEzNDB9YCxcbiAgICAgICAgbG9jYWxlOiBbJ1ZJJywgJ3ZpJ10sXG4gICAgICAgIGNvdW50cnk6ICd2aScsXG4gICAgICAgIG9wZXJhdG9yOiAnRml4IExpbmUnLFxuICAgIH0sXG4gICAgVk46IHtcbiAgICAgICAgdGltZXpvbmVJZDogJ0FzaWEvSG9fQ2hpX01pbmgnLFxuICAgICAgICBtY2M6ICc0NTInLFxuICAgICAgICBtbmM6ICcwMScsXG4gICAgICAgIGNvZGU6ICc4NCcsXG4gICAgICAgIG1jY21uYzogYCR7NDUyfSR7MX1gLFxuICAgICAgICBsb2NhbGU6IFsnVk4nLCAndm4nXSxcbiAgICAgICAgY291bnRyeTogJ3ZuJyxcbiAgICAgICAgb3BlcmF0b3I6ICdNb2JpRm9uZScsXG4gICAgfSxcbn07XG5mdW5jdGlvbiBtb2NrKGtleU9yQ29uZmlnKSB7XG4gICAgY29uc3QgY29uZmlnID0gdHlwZW9mIGtleU9yQ29uZmlnID09PSAnb2JqZWN0JyA/IGtleU9yQ29uZmlnIDogQ29uZmlndXJhdGlvbnNba2V5T3JDb25maWddO1xuICAgIGNvbnN0IG51bWJlciA9IGAke2NvbmZpZy5jb2RlfSR7VGV4dC5zdHJpbmdOdW1iZXIoMTApfWAsIHN1YnNjcmliZXIgPSBgJHtjb25maWcubWNjbW5jfSR7VGV4dC5zdHJpbmdOdW1iZXIoMTApfWA7XG4gICAgaG9vayhDbGFzc2VzLlRlbGVwaG9ueU1hbmFnZXIsICdnZXRMaW5lMU51bWJlcicsIHsgcmVwbGFjZTogYWx3YXlzKG51bWJlcikgfSk7XG4gICAgaG9vayhDbGFzc2VzLlRlbGVwaG9ueU1hbmFnZXIsICdnZXRTaW1PcGVyYXRvcicsIHsgcmVwbGFjZTogYWx3YXlzKGNvbmZpZy5tY2NtbmMpIH0pO1xuICAgIGhvb2soQ2xhc3Nlcy5UZWxlcGhvbnlNYW5hZ2VyLCAnZ2V0U2ltT3BlcmF0b3JOYW1lJywgeyByZXBsYWNlOiBhbHdheXMoY29uZmlnLm9wZXJhdG9yKSB9KTtcbiAgICBob29rKENsYXNzZXMuVGVsZXBob255TWFuYWdlciwgJ2dldE5ldHdvcmtPcGVyYXRvcicsIHsgcmVwbGFjZTogYWx3YXlzKGNvbmZpZy5tY2NtbmMpIH0pO1xuICAgIGhvb2soQ2xhc3Nlcy5UZWxlcGhvbnlNYW5hZ2VyLCAnZ2V0TmV0d29ya09wZXJhdG9yTmFtZScsIHsgcmVwbGFjZTogYWx3YXlzKGNvbmZpZy5vcGVyYXRvcikgfSk7XG4gICAgaG9vayhDbGFzc2VzLlRlbGVwaG9ueU1hbmFnZXIsICdnZXRTaW1Db3VudHJ5SXNvJywgeyByZXBsYWNlOiBhbHdheXMoY29uZmlnLmNvdW50cnkpIH0pO1xuICAgIGhvb2soQ2xhc3Nlcy5UZWxlcGhvbnlNYW5hZ2VyLCAnZ2V0TmV0d29ya0NvdW50cnlJc28nLCB7IHJlcGxhY2U6IGFsd2F5cyhjb25maWcuY291bnRyeSkgfSk7XG4gICAgaG9vayhDbGFzc2VzLlRlbGVwaG9ueU1hbmFnZXIsICdnZXRTdWJzY3JpYmVySWQnLCB7IHJlcGxhY2U6IGFsd2F5cyhzdWJzY3JpYmVyKSB9KTtcbiAgICBob29rKENsYXNzZXMuVGltZVpvbmUsICdnZXRJRCcsIHsgcmVwbGFjZTogYWx3YXlzKGNvbmZpZy50aW1lem9uZUlkKSB9KTtcbiAgICBob29rKENsYXNzZXMuTG9jYWxlLCAnZ2V0RGVmYXVsdCcsIHtcbiAgICAgICAgcmVwbGFjZTogKCkgPT4gQ2xhc3Nlcy5Mb2NhbGUuJG5ldyhjb25maWcubG9jYWxlWzFdLCBjb25maWcubG9jYWxlWzBdKSxcbiAgICAgICAgbG9nZ2luZzogeyBjYWxsOiBmYWxzZSwgcmV0dXJuOiBmYWxzZSB9LFxuICAgIH0pO1xuICAgIC8vIGhvb2soQ2xhc3Nlcy5Mb2NhbGUsICdnZXRDb3VudHJ5JywgeyByZXBsYWNlOiBhbHdheXMoJ0JSJyksIGxvZ2dpbmc6IHsgY2FsbDogZmFsc2UsIHJldHVybjogZmFsc2UgfSB9KTtcbiAgICAvLyBob29rKENsYXNzZXMuTG9jYWxlLCAnZ2V0TGFuZ3VhZ2UnLCB7IHJlcGxhY2U6IGFsd2F5cygncHQnKSwgbG9nZ2luZzogeyBjYWxsOiBmYWxzZSwgcmV0dXJuOiBmYWxzZSB9IH0pO1xuICAgIC8vIGhvb2soQ2xhc3Nlcy5Mb2NhbGUsICdnZXREaXNwbGF5Q291bnRyeScsIHsgcmVwbGFjZTogYWx3YXlzKCdCcmF6aWwnKSwgbG9nZ2luZzogeyBjYWxsOiBmYWxzZSwgcmV0dXJuOiBmYWxzZSB9IH0pO1xuICAgIC8vIGhvb2soQ2xhc3Nlcy5Mb2NhbGUsICd0b1N0cmluZycsIHsgcmVwbGFjZTogYWx3YXlzKCdwdF9CUicpLCBsb2dnaW5nOiB7IGNhbGw6IGZhbHNlLCByZXR1cm46IGZhbHNlIH0gfSk7XG4gICAgaG9vayhDbGFzc2VzLkRhdGUsICdnZXRUaW1lJywge1xuICAgICAgICBsb2dnaW5nUHJlZGljYXRlOiBGaWx0ZXIuZGF0ZSxcbiAgICAgICAgcmVwbGFjZShtZXRob2QsIC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhbGVuZGFyID0gQ2xhc3Nlcy5DYWxlbmRhci5nZXRJbnN0YW5jZShDbGFzc2VzLlRpbWVab25lLmdldFRpbWVab25lKCdVVEMnKSk7XG4gICAgICAgICAgICBjb25zdCB6ZHQgPSBDbGFzc2VzLlpvbmVkRGF0ZVRpbWUub2ZJbnN0YW50KENsYXNzZXMuSW5zdGFudC5vZkVwb2NoTWlsbGkodGhpcy5nZXRUaW1lKCkpLCBDbGFzc2VzLlpvbmVJZC5vZihjb25maWcudGltZXpvbmVJZCkpO1xuICAgICAgICAgICAgY2FsZW5kYXIuc2V0KDEsIHpkdC5nZXRZZWFyKCkpO1xuICAgICAgICAgICAgY2FsZW5kYXIuc2V0KDIsIHpkdC5nZXRNb250aFZhbHVlKCkgLSAxKTtcbiAgICAgICAgICAgIGNhbGVuZGFyLnNldCg1LCB6ZHQuZ2V0RGF5T2ZNb250aCgpKTtcbiAgICAgICAgICAgIGNhbGVuZGFyLnNldCgxMSwgemR0LmdldEhvdXIoKSk7XG4gICAgICAgICAgICBjYWxlbmRhci5zZXQoMTIsIHpkdC5nZXRNaW51dGUoKSk7XG4gICAgICAgICAgICBjYWxlbmRhci5zZXQoMTMsIHpkdC5nZXRTZWNvbmQoKSk7XG4gICAgICAgICAgICBjYWxlbmRhci5zZXQoMTQsIHpkdC5nZXROYW5vKCkgLyAxXzAwMF8wMDApO1xuICAgICAgICAgICAgcmV0dXJuIGNhbGVuZGFyLmdldFRpbWVJbk1pbGxpcygpO1xuICAgICAgICAgICAgLy8gPyBmYXN0ZXIgYW5kIGxlc3MgY2hhbmdlcyB0byBjcmFzaFxuICAgICAgICAgICAgLy8gY29uc3QgZGF0ZVN0ciA9IG5ldyBEYXRlKCkudG9Mb2NhbGVTdHJpbmcoJ2VuLVVTJywgeyB0aW1lWm9uZTogY29uZmlnLnRpbWV6b25lSWQgfSlcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRFRTXCIsIG5ldyBEYXRlKGRhdGVTdHIpKTtcbiAgICAgICAgICAgIC8vIHJldHVybiBuZXcgRGF0ZShkYXRlU3RyKS5nZXRUaW1lKClcbiAgICAgICAgfSxcbiAgICB9KTtcbn1cbmV4cG9ydCB7IG1vY2sgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvdW50cnkuanMubWFwIiwiZXhwb3J0ICogYXMgSmlnYXUgZnJvbSAnLi9qaWdhdS5qcyc7XG5leHBvcnQgKiBhcyBJbnN0YWxsUmVmZXJyZXIgZnJvbSAnLi9pbnN0YWxsUmVmZXJyZXIuanMnO1xuZXhwb3J0ICogYXMgQ291bnRyeSBmcm9tICcuL2NvdW50cnkuanMnO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiaW1wb3J0IHsgZmluZENsYXNzLCBDbGFzc2VzLCBDbGFzc2VzU3RyaW5nLCBlbnVtZXJhdGVNZW1iZXJzIH0gZnJvbSAnQGNsb2Nrd29yay9jb21tb24nO1xuaW1wb3J0IHsgQ2xhc3NMb2FkZXIsIGhvb2sgfSBmcm9tICdAY2xvY2t3b3JrL2hvb2tzJztcbmltcG9ydCB7IHN1YkxvZ2dlciwgQ29sb3IgfSBmcm9tICdAY2xvY2t3b3JrL2xvZ2dpbmcnO1xuY29uc3QgbG9nZ2VyID0gc3ViTG9nZ2VyKCdpbnN0YWxscmVmZXJyZXInKTtcbmZ1bmN0aW9uIGNyZWF0ZUluc3RhbGxSZWZlcnJlcihjbGFzc1dyYXBwZXIsIGRldGFpbHMpIHtcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgIGNvbnN0IGJ1bmRsZSA9IENsYXNzZXMuQnVuZGxlLiRuZXcoKTtcbiAgICBidW5kbGUucHV0Qm9vbGVhbignZ29vZ2xlX3BsYXlfaW5zdGFudCcsIGRldGFpbHM/Lmdvb2dsZV9wbGF5X2luc3RhbnQgPz8gdHJ1ZSk7XG4gICAgYnVuZGxlLnB1dExvbmcoJ2luc3RhbGxfYmVnaW5fdGltZXN0YW1wX3NlY29uZHMnLCBkZXRhaWxzPy5pbnN0YWxsX2JlZ2luX3RpbWVzdGFtcF9zZWNvbmRzID8/IG5vdyAtIDMwICogMTAwMCk7XG4gICAgYnVuZGxlLnB1dExvbmcoJ2luc3RhbGxfYmVnaW5fdGltZXN0YW1wX3NlcnZlcl9zZWNvbmRzJywgZGV0YWlscz8uaW5zdGFsbF9iZWdpbl90aW1lc3RhbXBfc2VydmVyX3NlY29uZHMgPz8gbm93IC0gMzAgKiAxMDAwKTtcbiAgICBidW5kbGUucHV0U3RyaW5nKCdpbnN0YWxsX3JlZmVycmVyJywgZGV0YWlscz8uaW5zdGFsbF9yZWZlcnJlciA/PyAndXRtX21lZGl1bT1Ob24tT3JnYW5pYycpO1xuICAgIGJ1bmRsZS5wdXRTdHJpbmcoJ2luc3RhbGxfdmVyc2lvbicsIGRldGFpbHM/Lmluc3RhbGxfdmVyc2lvbiA/PyAnMS4wLjAnKTtcbiAgICBidW5kbGUucHV0TG9uZygncmVmZXJyZXJfY2xpY2tfdGltZXN0YW1wX3NlY29uZHMnLCBkZXRhaWxzPy5yZWZlcnJlcl9jbGlja190aW1lc3RhbXBfc2Vjb25kcyA/PyBub3cgLSA2NSAqIDEwMDApO1xuICAgIGJ1bmRsZS5wdXRMb25nKCdyZWZlcnJlcl9jbGlja190aW1lc3RhbXBfc2VydmVyX3NlY29uZHMnLCBkZXRhaWxzPy5yZWZlcnJlcl9jbGlja190aW1lc3RhbXBfc2VydmVyX3NlY29uZHMgPz8gbm93IC0gNjUgKiAxMDAwKTtcbiAgICByZXR1cm4gY2xhc3NXcmFwcGVyLiRuZXcoYnVuZGxlKTtcbn1cbmZ1bmN0aW9uIHJlcGxhY2UoZGV0YWlscyA9IHt9KSB7XG4gICAgbGV0IGlzSG9va2VkID0gZmFsc2U7XG4gICAgQ2xhc3NMb2FkZXIucGVyZm9ybSgoXykgPT4ge1xuICAgICAgICBpZiAoaXNIb29rZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGNvbnN0IGNsaWVudCA9IGZpbmRDbGFzcyhDbGFzc2VzU3RyaW5nLkluc3RhbGxSZWZlcnJlckNsaWVudCk7XG4gICAgICAgIGlmICghY2xpZW50KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpc0hvb2tlZCA9IHRydWU7XG4gICAgICAgIGNvbnN0IFtzdGFydE1ldGhvZCwgZ2V0TWV0aG9kXSA9IG1hdGNoUmVmZXJyZXJDbGllbnRNZXRob2RzKGNsaWVudCk7XG4gICAgICAgIHBlcmZvcm1SZXBsYWNlKGRldGFpbHMsIGNsaWVudCwgc3RhcnRNZXRob2QsIGdldE1ldGhvZCk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBwZXJmb3JtUmVwbGFjZShkZXRhaWxzLCBjbGllbnQsIHN0YXJ0TWV0aG9kLCBnZXRNZXRob2QpIHtcbiAgICBjb25zdCBiZWZvcmVJbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCBwYXJldG5DbGFzcyA9IGZpbmRDbGFzcyh0aGlzLiRjbGFzc05hbWUpO1xuICAgICAgICBpZiAoIXBhcmV0bkNsYXNzKSB7XG4gICAgICAgICAgICBsb2dnZXIud2FybihgbWlzc2luZyBwYXJlbnQgY2xhc3M6ICR7dGhpcy4kY2xhc3NOYW1lfWApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGhvb2socGFyZXRuQ2xhc3MsIHN0YXJ0TWV0aG9kLCB7XG4gICAgICAgICAgICBwcmVkaWNhdGU6IHN0YXJ0Q29ubmVjdGlvblByZWRpY2F0ZSxcbiAgICAgICAgICAgIHJlcGxhY2UobWV0aG9kLCBsaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGJhc2VDbGFzcyA9IGZpbmRDbGFzcyhDbGFzc2VzU3RyaW5nLkluc3RhbGxSZWZlcnJlclN0YXRlTGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIGlmICghYmFzZUNsYXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci53YXJuKGBtaXNzaW5nIGJhc2UgY2xhc3M6ICR7Q2xhc3Nlc1N0cmluZy5JbnN0YWxsUmVmZXJyZXJTdGF0ZUxpc3RlbmVyfWApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWV0aG9kLmNhbGwodGhpcywgbGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBvbkZpbmlzaGVkTWV0aG9kID0gbWF0Y2hTdGF0ZUxpc3RlbmVyTWV0aG9kKGJhc2VDbGFzcyk7XG4gICAgICAgICAgICAgICAgbGV0IG1zZyA9IENvbG9yLm1ldGhvZChzdGFydE1ldGhvZCk7XG4gICAgICAgICAgICAgICAgbXNnICs9IENvbG9yLmJyYWNrZXQoJygnKTtcbiAgICAgICAgICAgICAgICBtc2cgKz0gQ29sb3IuY2xhc3NOYW1lKGxpc3RlbmVyLiRjbGFzc05hbWUpO1xuICAgICAgICAgICAgICAgIG1zZyArPSBDb2xvci5icmFja2V0KCcpJyk7XG4gICAgICAgICAgICAgICAgbXNnICs9ICcgLT4gJztcbiAgICAgICAgICAgICAgICBtc2cgKz0gQ29sb3IubWV0aG9kKG9uRmluaXNoZWRNZXRob2QpO1xuICAgICAgICAgICAgICAgIG1zZyArPSBgJHtDb2xvci5icmFja2V0KCcoJyl9JHtDb2xvci5udW1iZXIoJzAnKX0ke0NvbG9yLmJyYWNrZXQoJyknKX1gO1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKG1zZyk7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXJbb25GaW5pc2hlZE1ldGhvZF0oMCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgICAgaG9vayhwYXJldG5DbGFzcywgZ2V0TWV0aG9kLCB7XG4gICAgICAgICAgICBwcmVkaWNhdGU6IGdldEluc3RhbGxSZWZlcnJlclByZWRpY2F0ZSxcbiAgICAgICAgICAgIHJlcGxhY2UobWV0aG9kKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVmZXJyZXJEZXRhaWxzID0gZmluZENsYXNzKENsYXNzZXNTdHJpbmcuUmVmZXJyZXJEZXRhaWxzKTtcbiAgICAgICAgICAgICAgICBpZiAoIXJlZmVycmVyRGV0YWlscykge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIud2FybihgbWlzc2luZyByZWZlcnJlciBjbGFzczogJHtDbGFzc2VzU3RyaW5nLlJlZmVycmVyRGV0YWlsc31gKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1ldGhvZC5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbnVtZXJhdGVNZW1iZXJzKHJlZmVycmVyRGV0YWlscywge1xuICAgICAgICAgICAgICAgICAgICBvbk1hdGNoTWV0aG9kKGNsYXp6LCBtZW1iZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2soY2xhenosIG1lbWJlcik7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSwgMSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUluc3RhbGxSZWZlcnJlcihyZWZlcnJlckRldGFpbHMsIGRldGFpbHMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBob29rKGNsaWVudCwgJyRpbml0JywgeyBiZWZvcmU6IGJlZm9yZUluaXQgfSk7XG59XG5mdW5jdGlvbiBtYXRjaFJlZmVycmVyQ2xpZW50TWV0aG9kcyhjbGF6eikge1xuICAgIGxldCBzdGFydE1ldGhvZCA9IG51bGwsIGdldE1ldGhvZCA9IG51bGw7XG4gICAgZW51bWVyYXRlTWVtYmVycyhjbGF6eiwge1xuICAgICAgICBvbk1hdGNoTWV0aG9kKGNsYXp6LCBtZW1iZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IGRlZiA9IGNsYXp6W21lbWJlcl07XG4gICAgICAgICAgICBpZiAoIWRlZilcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBmb3IgKGNvbnN0IG92ZXJsb2FkIG9mIGRlZi5vdmVybG9hZHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnRDb25uZWN0aW9uUHJlZGljYXRlKG92ZXJsb2FkKSkge1xuICAgICAgICAgICAgICAgICAgICBzdGFydE1ldGhvZCA/Pz0gbWVtYmVyO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGdldEluc3RhbGxSZWZlcnJlclByZWRpY2F0ZShvdmVybG9hZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZ2V0TWV0aG9kID8/PSBtZW1iZXI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB9LCAxKTtcbiAgICByZXR1cm4gW3N0YXJ0TWV0aG9kID8/ICdzdGFydENvbm5lY3Rpb24nLCBnZXRNZXRob2QgPz8gJ2dldEluc3RhbGxSZWZlcnJlciddO1xufVxuZnVuY3Rpb24gbWF0Y2hTdGF0ZUxpc3RlbmVyTWV0aG9kKGNsYXp6KSB7XG4gICAgbGV0IGZvdW5kID0gbnVsbDtcbiAgICBlbnVtZXJhdGVNZW1iZXJzKGNsYXp6LCB7XG4gICAgICAgIG9uTWF0Y2hNZXRob2QoY2xhenosIG1lbWJlcikge1xuICAgICAgICAgICAgY29uc3QgZGVmID0gY2xhenpbbWVtYmVyXTtcbiAgICAgICAgICAgIGlmICghZGVmKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGZvciAoY29uc3Qgb3ZlcmxvYWQgb2YgZGVmLm92ZXJsb2Fkcykge1xuICAgICAgICAgICAgICAgIGlmIChvbkluc3RhbGxSZWZlcnJlclNldHVwRmluaXNoZWRQcmVkaWNhdGUob3ZlcmxvYWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvdW5kID8/PSBtZW1iZXI7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfSwgMSk7XG4gICAgcmV0dXJuIGZvdW5kID8/ICdvbkluc3RhbGxSZWZlcnJlclNldHVwRmluaXNoZWQnO1xufVxuY29uc3Qgc3RhcnRDb25uZWN0aW9uUHJlZGljYXRlID0gKHsgcmV0dXJuVHlwZSwgYXJndW1lbnRUeXBlcyB9KSA9PiB7XG4gICAgcmV0dXJuIChyZXR1cm5UeXBlLmNsYXNzTmFtZSA9PT0gJ3ZvaWQnICYmXG4gICAgICAgIGFyZ3VtZW50VHlwZXMubGVuZ3RoID09PSAxICYmXG4gICAgICAgIGFyZ3VtZW50VHlwZXNbMF0uY2xhc3NOYW1lID09PSBDbGFzc2VzU3RyaW5nLkluc3RhbGxSZWZlcnJlclN0YXRlTGlzdGVuZXIpO1xufTtcbmNvbnN0IGdldEluc3RhbGxSZWZlcnJlclByZWRpY2F0ZSA9ICh7IHJldHVyblR5cGUsIGFyZ3VtZW50VHlwZXMgfSkgPT4ge1xuICAgIHJldHVybiByZXR1cm5UeXBlLmNsYXNzTmFtZSA9PT0gQ2xhc3Nlc1N0cmluZy5SZWZlcnJlckRldGFpbHMgJiYgYXJndW1lbnRUeXBlcy5sZW5ndGggPT09IDA7XG59O1xuY29uc3Qgb25JbnN0YWxsUmVmZXJyZXJTZXR1cEZpbmlzaGVkUHJlZGljYXRlID0gKHsgcmV0dXJuVHlwZSwgYXJndW1lbnRUeXBlcyB9KSA9PiB7XG4gICAgcmV0dXJuIHJldHVyblR5cGUuY2xhc3NOYW1lID09PSAndm9pZCcgJiYgYXJndW1lbnRUeXBlcy5sZW5ndGggPT09IDEgJiYgYXJndW1lbnRUeXBlc1swXS5jbGFzc05hbWUgPT09ICdpbnQnO1xufTtcbmV4cG9ydCB7IHJlcGxhY2UsIGNyZWF0ZUluc3RhbGxSZWZlcnJlciB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5zdGFsbFJlZmVycmVyLmpzLm1hcCIsImltcG9ydCAqIGFzIE5hdGl2ZSBmcm9tICdAY2xvY2t3b3JrL25hdGl2ZSc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICdAY2xvY2t3b3JrL2xvZ2dpbmcnO1xuY29uc3QgTmF0aXZlTGliTmFtZSA9ICdsaWJqaWFndV82NC5zbyc7XG5jb25zdCBBcm02NFBhdHRlcm4gPSAnMDAgMDMgM2YgZDYgYTAgMDYgMDAgYTknO1xuLyoqIGNhbiBiZSBzdXBlciBmaW5uaWt5IGFib3V0IG90aGVyIG5hdGl2ZSBmdW5jdGlvbnMgaG9va2VkIGJlZm9yIGl0IHBhdGNoZXMgdGhlIG1lbW9yeSAqL1xuZnVuY3Rpb24gbWVtb3J5UGF0Y2gobmFtZSA9IE5hdGl2ZUxpYk5hbWUpIHtcbiAgICBsZXQgaG9va05vdyA9IGZhbHNlO1xuICAgIE5hdGl2ZS5JbmplY3QuYWZ0ZXJJbml0QXJyYXkoKG5hbWUpID0+IHtcbiAgICAgICAgaWYgKG5hbWU/LmluY2x1ZGVzKE5hdGl2ZUxpYk5hbWUpKSB7XG4gICAgICAgICAgICBob29rTm93ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaG9va05vdykge1xuICAgICAgICAgICAgbGV0IG1vZHVsZSA9IG51bGw7XG4gICAgICAgICAgICBpZiAoaG9va05vdyAmJiAobW9kdWxlID0gUHJvY2Vzcy5maW5kTW9kdWxlQnlOYW1lKE5hdGl2ZUxpYk5hbWUpKSkge1xuICAgICAgICAgICAgICAgIE1lbW9yeS5zY2FuKG1vZHVsZS5iYXNlLCBtb2R1bGUuc2l6ZSwgQXJtNjRQYXR0ZXJuLCB7XG4gICAgICAgICAgICAgICAgICAgIG9uTWF0Y2g6IGZ1bmN0aW9uIChmb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgSW50ZXJjZXB0b3IuYXR0YWNoKGZvdW5kLCBmdW5jdGlvbiAoYXJncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1lbW9yeS5wcm90ZWN0KGFyZ3NbMF0sIFByb2Nlc3MucG9pbnRlclNpemUsICdyd3gnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhcmcwID0gYXJnc1swXS5yZWFkQ1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJnMD8uaW5jbHVkZXMoJy9wcm9jLycpICYmIGFyZzA/LmluY2x1ZGVzKCcvbWFwcycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmdzWzBdLndyaXRlVXRmOFN0cmluZygnL3Byb2Mvc2VsZi9jbWRsaW5lJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHsgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKHsgdGFnOiAnamlnYXUnIH0sICdmcmlkYSBkZXRlY3Rpb24gbnlwYXNzZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufVxuZXhwb3J0IHsgbWVtb3J5UGF0Y2ggfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWppZ2F1LmpzLm1hcCIsImltcG9ydCB7IHByb3h5SmF2YVVzZSB9IGZyb20gJy4uL2ludGVybmFsL3Byb3h5LmpzJztcbmNvbnN0IENsYXNzZXNTdHJpbmcgPSB7XG4gICAgU3RyaW5nOiAnamF2YS5sYW5nLlN0cmluZycsXG4gICAgQm9vbGVhbjogJ2phdmEubGFuZy5Cb29sZWFuJyxcbiAgICBBcnJheUxpc3Q6ICdqYXZhLnV0aWwuQXJyYXlMaXN0JyxcbiAgICBTeXN0ZW06ICdqYXZhLmxhbmcuU3lzdGVtJyxcbiAgICBFeGNlcHRpb246ICdqYXZhLmxhbmcuRXhjZXB0aW9uJyxcbiAgICBTdHJpbmdCdWlsZGVyOiAnamF2YS5sYW5nLlN0cmluZ0J1aWxkZXInLFxuICAgIENsYXNzOiAnamF2YS5sYW5nLkNsYXNzJyxcbiAgICBVUkw6ICdqYXZhLm5ldC5VUkwnLFxuICAgIENpcGhlcjogJ2phdmF4LmNyeXB0by5DaXBoZXInLFxuICAgIFNlY3JldEtleVNwZWM6ICdqYXZheC5jcnlwdG8uc3BlYy5TZWNyZXRLZXlTcGVjJyxcbiAgICBPYmplY3Q6ICdqYXZhLmxhbmcuT2JqZWN0JyxcbiAgICBDbGFzc0xvYWRlcjogJ2phdmEubGFuZy5DbGFzc0xvYWRlcicsXG4gICAgQmFzZURleENsYXNzTG9hZGVyOiAnZGFsdmlrLnN5c3RlbS5CYXNlRGV4Q2xhc3NMb2FkZXInLFxuICAgIERleENsYXNzTG9hZGVyOiAnZGFsdmlrLnN5c3RlbS5EZXhDbGFzc0xvYWRlcicsXG4gICAgSW5NZW1vcnlEZXhDbGFzc0xvYWRlcjogJ2RhbHZpay5zeXN0ZW0uSW5NZW1vcnlEZXhDbGFzc0xvYWRlcicsXG4gICAgUGF0aENsYXNzTG9hZGVyOiAnZGFsdmlrLnN5c3RlbS5QYXRoQ2xhc3NMb2FkZXInLFxuICAgIERhdGU6ICdqYXZhLnV0aWwuRGF0ZScsXG4gICAgSW50ZWdlcjogJ2phdmEubGFuZy5JbnRlZ2VyJyxcbiAgICBNZXRob2Q6ICdqYXZhLmxhbmcucmVmbGVjdC5NZXRob2QnLFxuICAgIFJ1bnRpbWU6ICdqYXZhLmxhbmcuUnVudGltZScsXG4gICAgTWFwJEVudHJ5OiAnamF2YS51dGlsLk1hcCRFbnRyeScsXG4gICAgTG9jYWxlOiAnamF2YS51dGlsLkxvY2FsZScsXG4gICAgVGltZVpvbmU6ICdqYXZhLnV0aWwuVGltZVpvbmUnLFxuICAgIFRocmVhZDogJ2phdmEubGFuZy5UaHJlYWQnLFxuICAgIEFycmF5czogJ2phdmEudXRpbC5BcnJheXMnLFxuICAgIE1hdGg6ICdqYXZhLmxhbmcuTWF0aCcsXG4gICAgRGV4UGF0aExpc3Q6ICdkYWx2aWsuc3lzdGVtLkRleFBhdGhMaXN0JyxcbiAgICBQZW5kaW5nSW50ZW50OiAnYW5kcm9pZC5hcHAuUGVuZGluZ0ludGVudCcsXG4gICAgWm9uZWREYXRlVGltZTogJ2phdmEudGltZS5ab25lZERhdGVUaW1lJyxcbiAgICBab25lSWQ6ICdqYXZhLnRpbWUuWm9uZUlkJyxcbiAgICBJbnN0YW50OiAnamF2YS50aW1lLkluc3RhbnQnLFxuICAgIENhbGVuZGFyOiAnamF2YS51dGlsLkNhbGVuZGFyJyxcbiAgICBBcHBsaWNhdGlvbjogJ2FuZHJvaWQuYXBwLkFwcGxpY2F0aW9uJyxcbiAgICBTZXR0aW5ncyRTZWN1cmU6ICdhbmRyb2lkLnByb3ZpZGVyLlNldHRpbmdzJFNlY3VyZScsXG4gICAgU2V0dGluZ3MkR2xvYmFsOiAnYW5kcm9pZC5wcm92aWRlci5TZXR0aW5ncyRHbG9iYWwnLFxuICAgIFdlYlZpZXc6ICdhbmRyb2lkLndlYmtpdC5XZWJWaWV3JyxcbiAgICBDb250ZW50UmVzb2x2ZXI6ICdhbmRyb2lkLmNvbnRlbnQuQ29udGVudFJlc29sdmVyJyxcbiAgICBXZWJDaHJvbWVDbGllbnQ6ICdhbmRyb2lkLndlYmtpdC5XZWJDaHJvbWVDbGllbnQnLFxuICAgIExvZzogJ2FuZHJvaWQudXRpbC5Mb2cnLFxuICAgIEpTT05PYmplY3Q6ICdvcmcuanNvbi5KU09OT2JqZWN0JyxcbiAgICBKU09OQXJyYXk6ICdvcmcuanNvbi5KU09OQXJyYXknLFxuICAgIEJ1bmRsZTogJ2FuZHJvaWQub3MuQnVuZGxlJyxcbiAgICBJbnRlbnQ6ICdhbmRyb2lkLmNvbnRlbnQuSW50ZW50JyxcbiAgICBBY3Rpdml0eTogJ2FuZHJvaWQuYXBwLkFjdGl2aXR5JyxcbiAgICBTaGFyZWRQcmVmZXJlbmNlczogJ2FuZHJvaWQuY29udGVudC5TaGFyZWRQcmVmZXJlbmNlcycsXG4gICAgU2hhcmVkUHJlZmVyZW5jZXNJbXBsOiAnYW5kcm9pZC5hcHAuU2hhcmVkUHJlZmVyZW5jZXNJbXBsJyxcbiAgICBQYWNrYWdlTWFuYWdlcjogJ2FuZHJvaWQuY29udGVudC5wbS5QYWNrYWdlTWFuYWdlcicsXG4gICAgVGVsZXBob255TWFuYWdlcjogJ2FuZHJvaWQudGVsZXBob255LlRlbGVwaG9ueU1hbmFnZXInLFxuICAgIEJ1aWxkOiAnYW5kcm9pZC5vcy5CdWlsZCcsXG4gICAgSW5zdGFsbFJlZmVycmVyQ2xpZW50OiAnY29tLmFuZHJvaWQuaW5zdGFsbHJlZmVycmVyLmFwaS5JbnN0YWxsUmVmZXJyZXJDbGllbnQnLFxuICAgIEluc3RhbGxSZWZlcnJlclN0YXRlTGlzdGVuZXI6ICdjb20uYW5kcm9pZC5pbnN0YWxscmVmZXJyZXIuYXBpLkluc3RhbGxSZWZlcnJlclN0YXRlTGlzdGVuZXInLFxuICAgIFJlZmVycmVyRGV0YWlsczogJ2NvbS5hbmRyb2lkLmluc3RhbGxyZWZlcnJlci5hcGkuUmVmZXJyZXJEZXRhaWxzJyxcbn07XG5jb25zdCBDbGFzc2VzUHJveHkgPSBwcm94eUphdmFVc2UoQ2xhc3Nlc1N0cmluZyk7XG5leHBvcnQgeyBDbGFzc2VzUHJveHksIENsYXNzZXNTdHJpbmcgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWphdmEuanMubWFwIiwiaW1wb3J0IHsgcHJveHlDYWxsYmFjayB9IGZyb20gJy4uL2ludGVybmFsL3Byb3h5LmpzJztcbmNvbnN0IExpYmNGaW5kZXIgPSB7XG4gICAgb3BlbjogKCkgPT4ge1xuICAgICAgICBjb25zdCBwdHIgPSBNb2R1bGUuZ2V0RXhwb3J0QnlOYW1lKCdsaWJjLnNvJywgJ29wZW4nKTtcbiAgICAgICAgcmV0dXJuIG5ldyBOYXRpdmVGdW5jdGlvbihwdHIsICdpbnQnLCBbJ3BvaW50ZXInLCAnaW50J10pO1xuICAgIH0sXG4gICAgLy8gaW50IGNsb3NlKGludCBmZCk7XG4gICAgY2xvc2U6ICgpID0+IHtcbiAgICAgICAgY29uc3QgcHRyID0gTW9kdWxlLmdldEV4cG9ydEJ5TmFtZSgnbGliYy5zbycsICdjbG9zZScpO1xuICAgICAgICByZXR1cm4gbmV3IE5hdGl2ZUZ1bmN0aW9uKHB0ciwgJ2ludCcsIFsnaW50J10pO1xuICAgIH0sXG4gICAgLy8gaW50IHNodXRkb3duKGludCBzb2NrZmQsIGludCBob3cpO1xuICAgIHNodXRkb3duOiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHB0ciA9IE1vZHVsZS5nZXRFeHBvcnRCeU5hbWUoJ2xpYmMuc28nLCAnc2h1dGRvd24nKTtcbiAgICAgICAgcmV0dXJuIG5ldyBOYXRpdmVGdW5jdGlvbihwdHIsICdpbnQnLCBbJ2ludCcsICdpbnQnXSk7XG4gICAgfSxcbiAgICBta2RpcjogKCkgPT4ge1xuICAgICAgICBjb25zdCBwdHIgPSBNb2R1bGUuZ2V0RXhwb3J0QnlOYW1lKCdsaWJjLnNvJywgJ21rZGlyJyk7XG4gICAgICAgIHJldHVybiBuZXcgTmF0aXZlRnVuY3Rpb24ocHRyLCAnaW50JywgWydwb2ludGVyJywgJ2ludCddKTtcbiAgICB9LFxuICAgIG9wZW5kaXI6ICgpID0+IHtcbiAgICAgICAgY29uc3QgcHRyID0gTW9kdWxlLmdldEV4cG9ydEJ5TmFtZSgnbGliYy5zbycsICdvcGVuZGlyJyk7XG4gICAgICAgIHJldHVybiBuZXcgTmF0aXZlRnVuY3Rpb24ocHRyLCAncG9pbnRlcicsIFsncG9pbnRlciddKTtcbiAgICB9LFxuICAgIGNsb3NlZGlyOiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHB0ciA9IE1vZHVsZS5nZXRFeHBvcnRCeU5hbWUoJ2xpYmMuc28nLCAnY2xvc2VkaXInKTtcbiAgICAgICAgcmV0dXJuIG5ldyBOYXRpdmVGdW5jdGlvbihwdHIsICdpbnQnLCBbJ3BvaW50ZXInXSk7XG4gICAgfSxcbiAgICByZWFkOiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHB0ciA9IE1vZHVsZS5nZXRFeHBvcnRCeU5hbWUoJ2xpYmMuc28nLCAncmVhZCcpO1xuICAgICAgICByZXR1cm4gbmV3IE5hdGl2ZUZ1bmN0aW9uKHB0ciwgJ2ludCcsIFsnaW50JywgJ3BvaW50ZXInLCAnaW50J10pO1xuICAgIH0sXG4gICAgY2htb2Q6ICgpID0+IHtcbiAgICAgICAgY29uc3QgcHRyID0gTW9kdWxlLmdldEV4cG9ydEJ5TmFtZSgnbGliYy5zbycsICdjaG1vZCcpO1xuICAgICAgICByZXR1cm4gbmV3IE5hdGl2ZUZ1bmN0aW9uKHB0ciwgJ2ludCcsIFsncG9pbnRlcicsICdpbnQnXSk7XG4gICAgfSxcbiAgICBhY2Nlc3M6ICgpID0+IHtcbiAgICAgICAgY29uc3QgcHRyID0gTW9kdWxlLmdldEV4cG9ydEJ5TmFtZSgnbGliYy5zbycsICdhY2Nlc3MnKTtcbiAgICAgICAgcmV0dXJuIG5ldyBOYXRpdmVGdW5jdGlvbihwdHIsICdpbnQnLCBbJ3BvaW50ZXInLCAnaW50J10pO1xuICAgIH0sXG4gICAgcHRocmVhZF9jcmVhdGU6ICgpID0+IHtcbiAgICAgICAgY29uc3QgcHRyID0gTW9kdWxlLmdldEV4cG9ydEJ5TmFtZSgnbGliYy5zbycsICdwdGhyZWFkX2NyZWF0ZScpO1xuICAgICAgICByZXR1cm4gbmV3IE5hdGl2ZUZ1bmN0aW9uKHB0ciwgJ2ludCcsIFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddKTtcbiAgICB9LFxuICAgIGRpZmZ0aW1lOiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHB0ciA9IE1vZHVsZS5nZXRFeHBvcnRCeU5hbWUoJ2xpYmMuc28nLCAnZGlmZnRpbWUnKTtcbiAgICAgICAgcmV0dXJuIG5ldyBOYXRpdmVGdW5jdGlvbihwdHIsICd2b2lkJywgWydwb2ludGVyJywgJ3BvaW50ZXInXSk7XG4gICAgfSxcbiAgICAvLyBpbnQgY29ubmVjdChpbnQgc29ja2ZkLCBjb25zdCBzdHJ1Y3Qgc29ja2FkZHIgKmFkZHIsIHNvY2tsZW5fdCBhZGRybGVuKTtcbiAgICBjb25uZWN0OiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHB0ciA9IE1vZHVsZS5nZXRFeHBvcnRCeU5hbWUoJ2xpYmMuc28nLCAnY29ubmVjdCcpO1xuICAgICAgICByZXR1cm4gbmV3IE5hdGl2ZUZ1bmN0aW9uKHB0ciwgJ2ludCcsIFsnaW50JywgJ3BvaW50ZXInLCAncG9pbnRlciddKTtcbiAgICB9LFxuICAgIC8vIGludCBfX3N5c3RlbV9wcm9wZXJ0eV9nZXQoY29uc3QgY2hhciAqbmFtZSwgY2hhciAqdmFsdWUpO1xuICAgIF9fc3lzdGVtX3Byb3BlcnR5X2dldDogKCkgPT4ge1xuICAgICAgICBjb25zdCBwdHIgPSBNb2R1bGUuZ2V0RXhwb3J0QnlOYW1lKCdsaWJjLnNvJywgJ19fc3lzdGVtX3Byb3BlcnR5X2dldCcpO1xuICAgICAgICByZXR1cm4gbmV3IE5hdGl2ZUZ1bmN0aW9uKHB0ciwgJ2ludCcsIFsncG9pbnRlcicsICdwb2ludGVyJ10pO1xuICAgIH0sXG4gICAgLy8gaW50IF9fc3lzdGVtX3Byb3BlcnR5X3JlYWQoIGNvbnN0IHByb3BfaW5mbyAqcGksIGNoYXIgKm5hbWUsIGNoYXIgKiB2YWx1ZSk7XG4gICAgX19zeXN0ZW1fcHJvcGVydHlfcmVhZDogKCkgPT4ge1xuICAgICAgICBjb25zdCBwdHIgPSBNb2R1bGUuZ2V0RXhwb3J0QnlOYW1lKCdsaWJjLnNvJywgJ19fc3lzdGVtX3Byb3BlcnR5X3JlYWQnKTtcbiAgICAgICAgcmV0dXJuIG5ldyBOYXRpdmVGdW5jdGlvbihwdHIsICdpbnQnLCBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10pO1xuICAgIH0sXG4gICAgLy8gc3RydWN0IGhvc3RlbnQgKmdldGhvc3RieW5hbWUoY29uc3QgY2hhciAqbmFtZSk7XG4gICAgZ2V0aG9zdGJ5bmFtZTogKCkgPT4ge1xuICAgICAgICBjb25zdCBwdHIgPSBNb2R1bGUuZ2V0RXhwb3J0QnlOYW1lKCdsaWJjLnNvJywgJ2dldGhvc3RieW5hbWUnKTtcbiAgICAgICAgcmV0dXJuIG5ldyBOYXRpdmVGdW5jdGlvbihwdHIsICdwb2ludGVyJywgWydwb2ludGVyJ10pO1xuICAgIH0sXG4gICAgLy8gaW50IGdldGFkZHJpbmZvKGNvbnN0IGNoYXIgKnJlc3RyaWN0IG5vZGUsXG4gICAgLy8gICAgICAgICAgICAgICAgY29uc3QgY2hhciAqcmVzdHJpY3Qgc2VydmljZSxcbiAgICAvLyAgICAgICAgICAgICAgICBjb25zdCBzdHJ1Y3QgYWRkcmluZm8gKnJlc3RyaWN0IGhpbnRzLFxuICAgIC8vICAgICAgICAgICAgICAgIHN0cnVjdCBhZGRyaW5mbyAqKnJlc3RyaWN0IHJlcyk7XG4gICAgZ2V0YWRkcmluZm86ICgpID0+IHtcbiAgICAgICAgY29uc3QgcHRyID0gTW9kdWxlLmdldEV4cG9ydEJ5TmFtZSgnbGliYy5zbycsICdnZXRhZGRyaW5mbycpO1xuICAgICAgICByZXR1cm4gbmV3IE5hdGl2ZUZ1bmN0aW9uKHB0ciwgJ2ludCcsIFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddKTtcbiAgICB9LFxuICAgIC8vIGludCBpbmV0X2F0b24oY29uc3QgY2hhciAqY3AsIHN0cnVjdCBpbl9hZGRyICphZGRyKTtcbiAgICBpbmV0X2F0b246ICgpID0+IHtcbiAgICAgICAgY29uc3QgcHRyID0gTW9kdWxlLmdldEV4cG9ydEJ5TmFtZSgnbGliYy5zbycsICdpbmV0X2F0b24nKTtcbiAgICAgICAgcmV0dXJuIG5ldyBOYXRpdmVGdW5jdGlvbihwdHIsICdpbnQnLCBbJ3BvaW50ZXInLCAncG9pbnRlciddKTtcbiAgICB9LFxuICAgIC8vIHBpZF90IGZvcmsodm9pZCk7XG4gICAgZm9yazogKCkgPT4ge1xuICAgICAgICBjb25zdCBwdHIgPSBNb2R1bGUuZ2V0RXhwb3J0QnlOYW1lKCdsaWJjLnNvJywgJ2ZvcmsnKTtcbiAgICAgICAgcmV0dXJuIG5ldyBOYXRpdmVGdW5jdGlvbihwdHIsICdpbnQnLCBbXSk7XG4gICAgfSxcbiAgICAvLyBpbnQgZ2V0dGltZW9mZGF5KHN0cnVjdCB0aW1ldmFsICpyZXN0cmljdCB0diwgc3RydWN0IHRpbWV6b25lICpfTnVsbGFibGUgcmVzdHJpY3QgdHopO1xuICAgIGdldHRpbWVvZmRheTogKCkgPT4ge1xuICAgICAgICBjb25zdCBwdHIgPSBNb2R1bGUuZ2V0RXhwb3J0QnlOYW1lKCdsaWJjLnNvJywgJ2dldHRpbWVvZmRheScpO1xuICAgICAgICByZXR1cm4gbmV3IE5hdGl2ZUZ1bmN0aW9uKHB0ciwgJ2ludCcsIFsncG9pbnRlcicsICdwb2ludGVyJ10pO1xuICAgIH0sXG4gICAgLy8gaW50IHB0aHJlYWRfbXV0ZXhfaW5pdChwdGhyZWFkX211dGV4X3QgKm11dGV4LCBjb25zdCBwdGhyZWFkX211dGV4YXR0cl90ICphdHRyKTtcbiAgICBwdGhyZWFkX211dGV4X2luaXQ6ICgpID0+IHtcbiAgICAgICAgY29uc3QgcHRyID0gTW9kdWxlLmdldEV4cG9ydEJ5TmFtZSgnbGliYy5zbycsICdwdGhyZWFkX211dGV4X2luaXQnKTtcbiAgICAgICAgcmV0dXJuIG5ldyBOYXRpdmVGdW5jdGlvbihwdHIsICdpbnQnLCBbJ3BvaW50ZXInLCAncG9pbnRlciddKTtcbiAgICB9LFxuICAgIC8vIGludCBwdGhyZWFkX211dGV4X2xvY2socHRocmVhZF9tdXRleF90ICptdXRleCk7XG4gICAgcHRocmVhZF9tdXRleF9sb2NrOiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHB0ciA9IE1vZHVsZS5nZXRFeHBvcnRCeU5hbWUoJ2xpYmMuc28nLCAncHRocmVhZF9tdXRleF9sb2NrJyk7XG4gICAgICAgIHJldHVybiBuZXcgTmF0aXZlRnVuY3Rpb24ocHRyLCAnaW50JywgWydwb2ludGVyJ10pO1xuICAgIH0sXG4gICAgLy8gaW50IHB0aHJlYWRfbXV0ZXhfdW5sb2NrKHB0aHJlYWRfbXV0ZXhfdCAqbXV0ZXgpO1xuICAgIHB0aHJlYWRfbXV0ZXhfdW5sb2NrOiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHB0ciA9IE1vZHVsZS5nZXRFeHBvcnRCeU5hbWUoJ2xpYmMuc28nLCAncHRocmVhZF9tdXRleF91bmxvY2snKTtcbiAgICAgICAgcmV0dXJuIG5ldyBOYXRpdmVGdW5jdGlvbihwdHIsICdpbnQnLCBbJ3BvaW50ZXInXSk7XG4gICAgfSxcbiAgICAvLyBpbnQgcHRocmVhZF9kZXRhY2gocHRocmVhZF90IHRocmVhZCk7XG4gICAgcHRocmVhZF9kZXRhY2g6ICgpID0+IHtcbiAgICAgICAgY29uc3QgcHRyID0gTW9kdWxlLmdldEV4cG9ydEJ5TmFtZSgnbGliYy5zbycsICdwdGhyZWFkX2RldGFjaCcpO1xuICAgICAgICByZXR1cm4gbmV3IE5hdGl2ZUZ1bmN0aW9uKHB0ciwgJ2ludCcsIFsncG9pbnRlciddKTtcbiAgICB9XG59O1xuY29uc3QgTGliY0ZpbmRlclByb3h5ID0gcHJveHlDYWxsYmFjayhMaWJjRmluZGVyKTtcbmV4cG9ydCB7IExpYmNGaW5kZXJQcm94eSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGliYy5qcy5tYXAiLCJjbGFzcyBTdGRTdHJpbmcge1xuICAgIHN0YXRpYyAjU1REX1NUUklOR19TSVpFID0gMyAqIFByb2Nlc3MucG9pbnRlclNpemU7XG4gICAgaGFuZGxlO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmhhbmRsZSA9IE1lbW9yeS5hbGxvYyhTdGRTdHJpbmcuI1NURF9TVFJJTkdfU0laRSk7XG4gICAgfVxuICAgIGRpc3Bvc2UoKSB7XG4gICAgICAgIGNvbnN0IFtkYXRhLCBpc1RpbnldID0gdGhpcy5fZ2V0RGF0YSgpO1xuICAgICAgICBpZiAoIWlzVGlueSkge1xuICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICBKYXZhLmFwaS4kZGVsZXRlKGRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGRpc3Bvc2VUb1N0cmluZygpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy50b1N0cmluZygpO1xuICAgICAgICB0aGlzLmRpc3Bvc2UoKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IFtkYXRhXSA9IHRoaXMuX2dldERhdGEoKTtcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIHJldHVybiBkYXRhLnJlYWRVdGY4U3RyaW5nKCk7XG4gICAgfVxuICAgIF9nZXREYXRhKCkge1xuICAgICAgICBjb25zdCBzdHIgPSB0aGlzLmhhbmRsZTtcbiAgICAgICAgY29uc3QgaXNUaW55ID0gKHN0ci5yZWFkVTgoKSAmIDEpID09PSAwO1xuICAgICAgICBjb25zdCBkYXRhID0gaXNUaW55ID8gc3RyLmFkZCgxKSA6IHN0ci5hZGQoMiAqIFByb2Nlc3MucG9pbnRlclNpemUpLnJlYWRQb2ludGVyKCk7XG4gICAgICAgIHJldHVybiBbZGF0YSwgaXNUaW55XTtcbiAgICB9XG59XG5leHBvcnQgeyBTdGRTdHJpbmcgYXMgU3RyaW5nIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zdGQuanMubWFwIiwiaW1wb3J0IHsgQ2xhc3Nlc1Byb3h5IGFzIENsYXNzZXMsIENsYXNzZXNTdHJpbmcgfSBmcm9tICcuL2RlZmluZS9qYXZhLmpzJztcbmltcG9ydCB7IExpYmNGaW5kZXJQcm94eSB9IGZyb20gJy4vZGVmaW5lL2xpYmMuanMnO1xuaW1wb3J0ICogYXMgU3RkIGZyb20gJy4vZGVmaW5lL3N0ZC5qcyc7XG5pbXBvcnQgeyBlbnVtZXJhdGVNZW1iZXJzLCBmaW5kQ2xhc3MsIGdldENsYXNzLCBnZXRGaW5kVW5pcXVlIH0gZnJvbSAnLi9zZWFyY2guanMnO1xuaW1wb3J0ICogYXMgVGV4dCBmcm9tICcuL3RleHQuanMnO1xuZnVuY3Rpb24gaXNKV3JhcHBlcihjbGF6ek9yTmFtZSkge1xuICAgIHJldHVybiBjbGF6ek9yTmFtZT8uaGFzT3duUHJvcGVydHkoJyRjbGFzc05hbWUnKTtcbn1cbmZ1bmN0aW9uIHN0YWNrdHJhY2UoKSB7XG4gICAgY29uc3QgZSA9IENsYXNzZXMuRXhjZXB0aW9uLiRuZXcoKTtcbiAgICByZXR1cm4gQ2xhc3Nlcy5Mb2cuZ2V0U3RhY2tUcmFjZVN0cmluZyhlKS5zcGxpdCgnXFxuJykuc2xpY2UoMSkuam9pbignXFxuJyk7XG59XG5mdW5jdGlvbiBzdGFja3RyYWNlTGlzdCgpIHtcbiAgICBjb25zdCBlID0gQ2xhc3Nlcy5FeGNlcHRpb24uJG5ldygpO1xuICAgIGNvbnN0IHN0YWNrID0gQ2xhc3Nlcy5Mb2cuZ2V0U3RhY2tUcmFjZVN0cmluZyhlKTtcbiAgICByZXR1cm4gYCR7c3RhY2t9YC5zcGxpdCgnXFxuJykuc2xpY2UoMSkubWFwKChzKSA9PiBzLnN1YnN0cmluZyhzLmluZGV4T2YoJ2F0ICcpICsgMykudHJpbSgpKTtcbn1cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGdsb2JhbCwge1xuICAgIGZpbmRDbGFzczoge1xuICAgICAgICB2YWx1ZTogZmluZENsYXNzXG4gICAgfSxcbn0pO1xuZXhwb3J0IHsgQ2xhc3NlcywgQ2xhc3Nlc1N0cmluZywgTGliY0ZpbmRlclByb3h5IGFzIExpYmMsIGlzSldyYXBwZXIsIHN0YWNrdHJhY2UsIHN0YWNrdHJhY2VMaXN0LCBmaW5kQ2xhc3MsIGdldENsYXNzLCBlbnVtZXJhdGVNZW1iZXJzLCBnZXRGaW5kVW5pcXVlLCBUZXh0LCBTdGQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsImZ1bmN0aW9uIG1vY2soKSB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdHViJyk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZnVuY3Rpb24gcHJveHlKYXZhVXNlKGRhdGEpIHtcbiAgICBjb25zdCBpbml0ID0gKGtleSkgPT4gSmF2YS51c2Uoa2V5KTtcbiAgICBjb25zdCBjYWNoZSA9IHt9O1xuICAgIHJldHVybiBuZXcgUHJveHkoe30sIHtcbiAgICAgICAgZ2V0OiAoXywgbmFtZSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qga2V5ID0gZGF0YVtuYW1lXTtcbiAgICAgICAgICAgIHJldHVybiBjYWNoZVtuYW1lXSB8fCAoY2FjaGVbbmFtZV0gPz89IGluaXQoa2V5KSk7XG4gICAgICAgIH0sXG4gICAgICAgIGFwcGx5OiAoXywgdGhpc0FyZywgYXJnQXJyYXkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzQXJnO1xuICAgICAgICB9LFxuICAgIH0pO1xufVxuZnVuY3Rpb24gcHJveHlDYWxsYmFjayhkYXRhKSB7XG4gICAgY29uc3QgY2FjaGUgPSB7fTtcbiAgICByZXR1cm4gbmV3IFByb3h5KHt9LCB7XG4gICAgICAgIGdldDogKF8sIG5hbWUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGluaXQgPSBkYXRhW25hbWVdO1xuICAgICAgICAgICAgcmV0dXJuIGNhY2hlW25hbWVdIHx8IChjYWNoZVtuYW1lXSA/Pz0gaW5pdCgpKTtcbiAgICAgICAgfSxcbiAgICAgICAgaGFzKF8sIGtleSkge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGEuaGFzKGtleSk7XG4gICAgICAgIH0sXG4gICAgICAgIG93bktleXMoXykge1xuICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3Qub3duS2V5cyhkYXRhKTtcbiAgICAgICAgfSxcbiAgICAgICAgYXBwbHk6IChfLCB0aGlzQXJnLCBhcmdBcnJheSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXNBcmc7XG4gICAgICAgIH0sXG4gICAgfSk7XG59XG5leHBvcnQgeyBwcm94eUphdmFVc2UsIHByb3h5Q2FsbGJhY2sgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXByb3h5LmpzLm1hcCIsImltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ0BjbG9ja3dvcmsvbG9nZ2luZyc7XG5mdW5jdGlvbiBlbnVtZXJhdGVNZW1iZXJzKGNsYXp6LCBjYWxsYmFjaywgbWF4RGVwdGggPSBJbmZpbml0eSkge1xuICAgIGxldCBjdXJyZW50ID0gY2xheno7XG4gICAgbGV0IGRlcHRoID0gMDtcbiAgICB3aGlsZSAoZGVwdGggPCBtYXhEZXB0aCAmJiBjdXJyZW50ICYmIGN1cnJlbnQuJG4gIT09ICdqYXZhLmxhbmcuT2JqZWN0Jykge1xuICAgICAgICBjb25zdCBtb2RlbCA9IGN1cnJlbnQuJGw7XG4gICAgICAgIGNvbnN0IG1lbWJlcnMgPSBtb2RlbC5saXN0KCk7XG4gICAgICAgIGZvciAoY29uc3QgbWVtYmVyIG9mIG1lbWJlcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZSA9IG1vZGVsLmZpbmQobWVtYmVyKTtcbiAgICAgICAgICAgIHN3aXRjaCAoYCR7aGFuZGxlfWAuY2hhckF0KDApKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnbSc6IHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sub25NYXRjaE1ldGhvZD8uKGN1cnJlbnQsIG1lbWJlciwgZGVwdGgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSAnZic6IHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sub25NYXRjaEZpZWxkPy4oY3VycmVudCwgbWVtYmVyLCBkZXB0aCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjdXJyZW50ID0gY3VycmVudC4kcztcbiAgICAgICAgZGVwdGggKz0gMTtcbiAgICB9XG4gICAgY2FsbGJhY2sub25Db21wbGV0ZT8uKCk7XG59XG5mdW5jdGlvbiBmaW5kQ2xhc3MoY2xhc3NOYW1lLCAuLi5sb2FkZXJzKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgbUxvYWRlcnMgPSBbLi4ubG9hZGVycywgLi4uSmF2YS5lbnVtZXJhdGVDbGFzc0xvYWRlcnNTeW5jKCldO1xuICAgICAgICBmb3IgKGNvbnN0IGxvYWRlciBvZiBtTG9hZGVycykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAobG9hZGVyLmxvYWRDbGFzcyhjbGFzc05hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZhY3RvcnkgPSBKYXZhLkNsYXNzRmFjdG9yeS5nZXQobG9hZGVyKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2xzID0gZmFjdG9yeS51c2UoY2xhc3NOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNscztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAobm90Rm91bmQpIHsgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgbG9nZ2VyLmVycm9yKHsgdGFnOiAnZmluZENsYXNzJyB9LCBKU09OLnN0cmluZ2lmeShlcnIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5mdW5jdGlvbiBnZXRDbGFzcyhjbGFzc05hbWUsIC4uLmxvYWRlcnMpIHtcbiAgICBjb25zdCByZXN1bHQgPSBmaW5kQ2xhc3MoY2xhc3NOYW1lLCAuLi5sb2FkZXJzKTtcbiAgICBpZiAocmVzdWx0KVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIHRocm93IEVycm9yKGBjbGFzcyBub3QgZm91bmQ6ICR7Y2xhc3NOYW1lfWApO1xufVxuZnVuY3Rpb24gZ2V0RmluZFVuaXF1ZSgpIHtcbiAgICBjb25zdCBmb3VuZCA9IG5ldyBTZXQoKTtcbiAgICByZXR1cm4gKGNsYXp6TmFtZSwgZm4pID0+IHtcbiAgICAgICAgY29uc3QgY2xhenogPSBmaW5kQ2xhc3MoY2xhenpOYW1lKTtcbiAgICAgICAgaWYgKCFjbGF6eikge1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oeyB0YWc6ICdmaW5kVW5pcXVlJyB9LCBgY2xhc3MgJHtjbGF6ek5hbWV9IG5vdCBmb3VuZCAhYCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcHRyID0gYCR7Y2xhenouJGwuaGFuZGxlfWA7XG4gICAgICAgIGlmICghZm91bmQuaGFzKHB0cikpIHtcbiAgICAgICAgICAgIGZvdW5kLmFkZChwdHIpO1xuICAgICAgICAgICAgZm4oY2xhenopO1xuICAgICAgICB9XG4gICAgfTtcbn1cbmV4cG9ydCB7IGdldENsYXNzLCBmaW5kQ2xhc3MsIGdldEZpbmRVbmlxdWUsIGVudW1lcmF0ZU1lbWJlcnMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNlYXJjaC5qcy5tYXAiLCJmdW5jdGlvbiBtYXhMZW5naChtZXNzYWdlLCBsZW5ndGgpIHtcbiAgICBjb25zdCBtc2dTdHJpbmcgPSBgJHttZXNzYWdlfWA7XG4gICAgcmV0dXJuIG1zZ1N0cmluZy5zdWJzdHJpbmcoMCwgTWF0aC5taW4obXNnU3RyaW5nLmxlbmd0aCwgbGVuZ3RoKSk7XG59XG5mdW5jdGlvbiBub0xpbmVzKG1lc3NhZ2UpIHtcbiAgICByZXR1cm4gYCR7bWVzc2FnZX1gLnJlcGxhY2VBbGwoJ1xcbicsICdcXFxcbicpO1xufVxuZnVuY3Rpb24gdG9IZXgoZGVjaW1hbCkge1xuICAgIHJldHVybiAoJzAnICsgTnVtYmVyKGRlY2ltYWwpLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTIpO1xufVxuZnVuY3Rpb24gdG9CeXRlU2l6ZShzaXplKSB7XG4gICAgY29uc3QgaSA9IHNpemUgPT09IDAgPyAwIDogTWF0aC5mbG9vcihNYXRoLmxvZyhzaXplKSAvIE1hdGgubG9nKDEwMjQpKTtcbiAgICByZXR1cm4gTnVtYmVyKChzaXplIC8gTWF0aC5wb3coMTAyNCwgaSkpLnRvRml4ZWQoMikpICogMSArICcgJyArIFsnQicsICdrQicsICdNQicsICdHQicsICdUQiddW2ldO1xufVxuZnVuY3Rpb24gc3RyaW5nTnVtYmVyKGxlbmd0aCkge1xuICAgIGxldCB0ZXh0ID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICB0ZXh0ICs9IGAke01hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiAxMCkpICUgMTB9YDtcbiAgICB9XG4gICAgcmV0dXJuIHRleHQ7XG59XG5jb25zdCBQUklNSVRJVkVfVFlQRSA9IHtcbiAgICBaOiAnYm9vbGVhbicsXG4gICAgQjogJ2J5dGUnLFxuICAgIEM6ICdjaGFyJyxcbiAgICBEOiAnZG91YmxlJyxcbiAgICBGOiAnZmxvYXQnLFxuICAgIEk6ICdpbnQnLFxuICAgIEo6ICdsb25nJyxcbiAgICBTOiAnc2hvcnQnLFxuICAgIFY6ICd2b2lkJyxcbn07XG5mdW5jdGlvbiB0b1ByZXR0eVR5cGUodHlwZSkge1xuICAgIGNvbnN0IGxlbiA9IHR5cGUubGVuZ3RoO1xuICAgIGZvciAoOyB0eXBlLmNoYXJBdCgwKSA9PT0gJ1snOyB0eXBlID0gdHlwZS5zdWJzdHJpbmcoMSkpXG4gICAgICAgIDtcbiAgICBjb25zdCBkZXB0aCA9IGxlbiAtIHR5cGUubGVuZ3RoO1xuICAgIGlmICh0eXBlLmNoYXJBdCgwKSA9PT0gJ0wnICYmIHR5cGUuY2hhckF0KHR5cGUubGVuZ3RoIC0gMSkgPT09ICc7JylcbiAgICAgICAgcmV0dXJuIHR5cGUuc3Vic3RyaW5nKDEsIHR5cGUubGVuZ3RoIC0gMSkucmVwbGFjZUFsbCgnLycsICcuJykgKyAnW10nLnJlcGVhdChkZXB0aCk7XG4gICAgcmV0dXJuIChQUklNSVRJVkVfVFlQRVt0eXBlXSA/PyB0eXBlKSArICdbXScucmVwZWF0KGRlcHRoKTtcbn1cbmV4cG9ydCB7IG1heExlbmdoLCBub0xpbmVzLCB0b0hleCwgdG9CeXRlU2l6ZSwgdG9QcmV0dHlUeXBlLCBzdHJpbmdOdW1iZXIgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRleHQuanMubWFwIiwiY29uc3QgYWx3YXlzID0gKHZhbHVlKSA9PiAoKSA9PiB2YWx1ZTtcbmNvbnN0IGlmUmV0dXJuID0gKGZuKSA9PiB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChtZXRob2QsIC4uLmFyZ3MpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZm4uY2FsbCh0aGlzLCBtZXRob2QsIC4uLmFyZ3MpO1xuICAgICAgICBpZiAocmVzdWx0ICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICByZXR1cm4gbWV0aG9kLmNhbGwodGhpcywgLi4uYXJncyk7XG4gICAgfTtcbn07XG5jb25zdCBpZktleSA9IChmbiwgaW5kZXgpID0+IHtcbiAgICByZXR1cm4gaWZSZXR1cm4oZnVuY3Rpb24gKG1ldGhvZCwgLi4uYXJncykge1xuICAgICAgICBjb25zdCBrZXkgPSBhcmdzW2luZGV4ID8/IDBdO1xuICAgICAgICByZXR1cm4gZm4oa2V5KTtcbiAgICB9KTtcbn07XG5leHBvcnQgeyBhbHdheXMsIGlmUmV0dXJuLCBpZktleSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YWRkb25zLmpzLm1hcCIsImltcG9ydCB7IENsYXNzZXMgfSBmcm9tICdAY2xvY2t3b3JrL2NvbW1vbic7XG5pbXBvcnQgeyBob29rIH0gZnJvbSAnLi9ob29rLmpzJztcbnZhciBDbGFzc0xvYWRlcjtcbihmdW5jdGlvbiAoQ2xhc3NMb2FkZXIpIHtcbiAgICBjb25zdCBsaXN0ZW5lcnMgPSBbXTtcbiAgICBmdW5jdGlvbiBwZXJmb3JtKGZuKSB7XG4gICAgICAgIGxpc3RlbmVycy5wdXNoKGZuKTtcbiAgICB9XG4gICAgQ2xhc3NMb2FkZXIucGVyZm9ybSA9IHBlcmZvcm07XG4gICAgZnVuY3Rpb24gbm90aWZ5KGNsYXNzTG9hZGVyKSB7XG4gICAgICAgIGZvciAoY29uc3QgbGlzdGVuZXIgb2YgbGlzdGVuZXJzKVxuICAgICAgICAgICAgbGlzdGVuZXIoY2xhc3NMb2FkZXIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBvbk5ld0NsYXNzTG9hZGVyKCkge1xuICAgICAgICBjb25zdCBsb2FkZXIgPSB0aGlzO1xuICAgICAgICBub3RpZnkobG9hZGVyKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaW52b2tlKCkge1xuICAgICAgICBob29rKENsYXNzZXMuQ2xhc3NMb2FkZXIsICckaW5pdCcsIHtcbiAgICAgICAgICAgIGFmdGVyOiBvbk5ld0NsYXNzTG9hZGVyLFxuICAgICAgICAgICAgbG9nZ2luZzogeyBhcmd1bWVudHM6IGZhbHNlLCBjYWxsOiBmYWxzZSB9LFxuICAgICAgICB9KTtcbiAgICAgICAgaG9vayhDbGFzc2VzLkJhc2VEZXhDbGFzc0xvYWRlciwgJyRpbml0Jywge1xuICAgICAgICAgICAgYWZ0ZXI6IG9uTmV3Q2xhc3NMb2FkZXIsXG4gICAgICAgICAgICBsb2dnaW5nOiB7IGFyZ3VtZW50czogZmFsc2UgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIGhvb2soQ2xhc3Nlcy5EZXhDbGFzc0xvYWRlciwgJyRpbml0Jywge1xuICAgICAgICAgICAgYWZ0ZXI6IG9uTmV3Q2xhc3NMb2FkZXIsXG4gICAgICAgICAgICBsb2dnaW5nOiB7IGFyZ3VtZW50czogZmFsc2UgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIGhvb2soQ2xhc3Nlcy5Jbk1lbW9yeURleENsYXNzTG9hZGVyLCAnJGluaXQnLCB7XG4gICAgICAgICAgICBhZnRlcjogb25OZXdDbGFzc0xvYWRlcixcbiAgICAgICAgICAgIGxvZ2dpbmc6IHsgYXJndW1lbnRzOiBmYWxzZSB9LFxuICAgICAgICB9KTtcbiAgICAgICAgaG9vayhDbGFzc2VzLlBhdGhDbGFzc0xvYWRlciwgJyRpbml0Jywge1xuICAgICAgICAgICAgYWZ0ZXI6IG9uTmV3Q2xhc3NMb2FkZXIsXG4gICAgICAgICAgICBsb2dnaW5nOiB7IGFyZ3VtZW50czogZmFsc2UgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIGhvb2soQ2xhc3Nlcy5BcHBsaWNhdGlvbiwgJ29uQ3JlYXRlJywge1xuICAgICAgICAgICAgYmVmb3JlKCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxvYWRlciA9IHRoaXMuZ2V0Q2xhc3NMb2FkZXIoKSA/PyBudWxsO1xuICAgICAgICAgICAgICAgIG9uTmV3Q2xhc3NMb2FkZXIuY2FsbChsb2FkZXIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIG5vdGlmeShudWxsKTtcbiAgICB9XG4gICAgc2V0SW1tZWRpYXRlKCgpID0+IEphdmEucGVyZm9ybU5vdyhpbnZva2UpKTtcbn0pKENsYXNzTG9hZGVyIHx8IChDbGFzc0xvYWRlciA9IHt9KSk7XG5leHBvcnQgeyBDbGFzc0xvYWRlciB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y2xhc3Nsb2FkZXIuanMubWFwIiwiaW1wb3J0IHsgZ2V0TG9nZ2VyIH0gZnJvbSAnLi9sb2dnZXIuanMnO1xuaW1wb3J0IHsgaXNKV3JhcHBlciwgZmluZENsYXNzIH0gZnJvbSAnQGNsb2Nrd29yay9jb21tb24nO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQGNsb2Nrd29yay9sb2dnaW5nJztcbmltcG9ydCB7IElkcyB9IGZyb20gJy4vaWRzLmpzJztcbmZ1bmN0aW9uIGhvb2soY2xhenpPck5hbWUsIG1ldGhvZE5hbWUsIHBhcmFtcyA9IHt9KSB7XG4gICAgY29uc3QgeyBiZWZvcmUsIHJlcGxhY2UsIGFmdGVyLCBsb2dnaW5nLCBsb2dnaW5nUHJlZGljYXRlIH0gPSBwYXJhbXM7XG4gICAgY29uc3QgbG9nZ2VyID0gZ2V0TG9nZ2VyKGxvZ2dpbmcpO1xuICAgIGNvbnN0IGNsYXp6ID0gaXNKV3JhcHBlcihjbGF6ek9yTmFtZSkgPyBjbGF6ek9yTmFtZSA6IEphdmEudXNlKGNsYXp6T3JOYW1lKTtcbiAgICBjb25zdCBtZXRob2QgPSBjbGF6elttZXRob2ROYW1lXTtcbiAgICBpZiAoYCR7dHlwZW9mIG1ldGhvZH1gICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRocm93IEVycm9yKGBob29rOiBtZXRob2QgJHttZXRob2ROYW1lfSBub3QgZm91bmQgaW4gJHtjbGF6en0gIWApO1xuICAgIH1cbiAgICBjb25zdCBvdmVybG9hZHMgPSBtZXRob2QuX287XG4gICAgY29uc3QgY2xhc3NTdHJpbmcgPSBjbGF6ei4kY2xhc3NOYW1lO1xuICAgIGNvbnN0IGNJZCA9IElkcy5nZW5DbGFzc0lkKGNsYXNzU3RyaW5nKTtcbiAgICBjb25zdCBtSWQgPSBJZHMuZ2VuTWV0aG9kSWQoY2xhc3NTdHJpbmcsIG1ldGhvZE5hbWUpO1xuICAgIGxvZ2dlci5wcmludEhvb2tDbGFzcyhjbGFzc1N0cmluZywgSWRzLmNsYXNzSWQoY0lkKSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvdmVybG9hZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qgb3ZlcmxvYWQgPSBvdmVybG9hZHNbaV07XG4gICAgICAgIGlmIChwYXJhbXM/LnByZWRpY2F0ZT8uKG92ZXJsb2FkLCBpKSA9PT0gZmFsc2UpXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgY29uc3QgbG9nSWQgPSBJZHMudW5pcXVlSWQoY0lkLCBtSWQsIGkpO1xuICAgICAgICBjb25zdCB7IGFyZ3VtZW50VHlwZXMgfSA9IG92ZXJsb2FkO1xuICAgICAgICBjb25zdCBhcmdUeXBlc1N0cmluZyA9IGFyZ3VtZW50VHlwZXMubWFwKCh0KSA9PiB0LmNsYXNzTmFtZSk7XG4gICAgICAgIGNvbnN0IHJldHVyblR5cGVTdHJpbmcgPSBvdmVybG9hZC5yZXR1cm5UeXBlLmNsYXNzTmFtZTtcbiAgICAgICAgbG9nZ2VyLnByaW50SG9va01ldGhvZChtZXRob2ROYW1lLCBhcmdUeXBlc1N0cmluZywgcmV0dXJuVHlwZVN0cmluZywgbG9nSWQpO1xuICAgICAgICBjb25zdCBtZXRob2REZWYgPSBtZXRob2Qub3ZlcmxvYWQoLi4uYXJnVHlwZXNTdHJpbmcpO1xuICAgICAgICBtZXRob2REZWYuaW1wbGVtZW50YXRpb24gPSBmdW5jdGlvbiAoLi4ucGFyYW1zKSB7XG4gICAgICAgICAgICBjb25zdCBkb0xvZyA9IGxvZ2dpbmdQcmVkaWNhdGUgPyBsb2dnaW5nUHJlZGljYXRlLmNhbGwodGhpcywgbWV0aG9kRGVmLCAuLi5wYXJhbXMpIDogdHJ1ZTtcbiAgICAgICAgICAgIGRvTG9nICYmIGxvZ2dlci5wcmludENhbGwoY2xhc3NTdHJpbmcsIG1ldGhvZE5hbWUsIHBhcmFtcywgcmV0dXJuVHlwZVN0cmluZywgbG9nSWQsIHJlcGxhY2UgIT09IHVuZGVmaW5lZCk7XG4gICAgICAgICAgICBiZWZvcmU/LmNhbGwodGhpcywgbWV0aG9kRGVmLCAuLi5wYXJhbXMpO1xuICAgICAgICAgICAgY29uc3QgcmV0dXJuVmFsdWUgPSByZXBsYWNlID8gcmVwbGFjZS5jYWxsKHRoaXMsIG1ldGhvZERlZiwgLi4ucGFyYW1zKSA6IG1ldGhvZERlZi5jYWxsKHRoaXMsIC4uLnBhcmFtcyk7XG4gICAgICAgICAgICBhZnRlcj8uY2FsbCh0aGlzLCBtZXRob2REZWYsIHJldHVyblZhbHVlLCAuLi5wYXJhbXMpO1xuICAgICAgICAgICAgaWYgKHJldHVyblR5cGVTdHJpbmcgIT09ICd2b2lkJylcbiAgICAgICAgICAgICAgICBkb0xvZyAmJiBsb2dnZXIucHJpbnRSZXR1cm4ocmV0dXJuVmFsdWUsIGxvZ0lkKTtcbiAgICAgICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgICAgICAgfTtcbiAgICB9XG59XG5mdW5jdGlvbiBmaW5kSG9vayhjbGF6ek5hbWUsIG1ldGhvZE5hbWUsIHBhcmFtcykge1xuICAgIGNvbnN0IGNsYXp6ID0gZmluZENsYXNzKGNsYXp6TmFtZSk7XG4gICAgaWYgKCFjbGF6eikge1xuICAgICAgICBsb2dnZXIuZGVidWcoeyB0YWc6ICdmaW5kSG9vaycgfSwgYGNsYXNzICR7Y2xhenpOYW1lfSBub3QgZm91bmQgIWApO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGhvb2soY2xhenosIG1ldGhvZE5hbWUsIHBhcmFtcyk7XG59XG5mdW5jdGlvbiBnZXRIb29rVW5pcXVlKCkge1xuICAgIGNvbnN0IGZvdW5kID0gbmV3IFNldCgpO1xuICAgIHJldHVybiAoY2xhenpOYW1lLCBtZXRob2ROYW1lLCBwYXJhbXMgPSB7fSkgPT4ge1xuICAgICAgICBjb25zdCBjbGF6eiA9IGZpbmRDbGFzcyhjbGF6ek5hbWUpO1xuICAgICAgICBpZiAoIWNsYXp6KSB7XG4gICAgICAgICAgICBsb2dnZXIuaW5mbyh7IHRhZzogJ2hvb2tVbmlxdWUnIH0sIGBjbGFzcyAke2NsYXp6TmFtZX0gbm90IGZvdW5kICFgKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwdHIgPSBgJHtjbGF6ei4kbC5oYW5kbGV9Ojoke21ldGhvZE5hbWV9YDtcbiAgICAgICAgaWYgKCFmb3VuZC5oYXMocHRyKSkge1xuICAgICAgICAgICAgZm91bmQuYWRkKHB0cik7XG4gICAgICAgICAgICBob29rKGNsYXp6LCBtZXRob2ROYW1lLCBwYXJhbXMpO1xuICAgICAgICB9XG4gICAgfTtcbn1cbmV4cG9ydCB7IGhvb2ssIGZpbmRIb29rLCBnZXRIb29rVW5pcXVlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ob29rLmpzLm1hcCIsInZhciBJZHM7XG4oZnVuY3Rpb24gKElkcykge1xuICAgIGxldCBjdXJyZW50Q0lkID0gLTE7XG4gICAgY29uc3QgY2xhc3NJZHMgPSB7fTtcbiAgICBsZXQgY3VycmVudE1JZCA9IC0xO1xuICAgIGNvbnN0IG1ldGhvZElkcyA9IHt9O1xuICAgIGZ1bmN0aW9uIGdlbkNsYXNzSWQoY2xhc3NOYW1lKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IGAke2NsYXNzTmFtZX1gO1xuICAgICAgICByZXR1cm4gKHR5cGVvZiBjbGFzc0lkc1trZXldID09PSAnbnVtYmVyJyA/IGNsYXNzSWRzW2tleV0gOiBjbGFzc0lkc1trZXldID0gY3VycmVudENJZCArPSAxKTtcbiAgICB9XG4gICAgSWRzLmdlbkNsYXNzSWQgPSBnZW5DbGFzc0lkO1xuICAgIGZ1bmN0aW9uIGdlbk1ldGhvZElkKGNsYXNzTmFtZSwgbWV0aG9kKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IGAke2NsYXNzTmFtZX06OiR7bWV0aG9kfWA7XG4gICAgICAgIHJldHVybiAodHlwZW9mIG1ldGhvZElkc1trZXldID09PSAnbnVtYmVyJyA/IG1ldGhvZElkc1trZXldIDogbWV0aG9kSWRzW2tleV0gPSBjdXJyZW50TUlkICs9IDEpO1xuICAgIH1cbiAgICBJZHMuZ2VuTWV0aG9kSWQgPSBnZW5NZXRob2RJZDtcbiAgICBmdW5jdGlvbiBjbGFzc0lkKGNJZCkge1xuICAgICAgICByZXR1cm4gYCNpZDoke2NJZH1gO1xuICAgIH1cbiAgICBJZHMuY2xhc3NJZCA9IGNsYXNzSWQ7XG4gICAgZnVuY3Rpb24gdW5pcXVlSWQoY0lkLCBtSWQsIGkpIHtcbiAgICAgICAgcmV0dXJuIGAke2NsYXNzSWQoY0lkKX06JHttSWR9OiR7aX1gO1xuICAgIH1cbiAgICBJZHMudW5pcXVlSWQgPSB1bmlxdWVJZDtcbn0pKElkcyB8fCAoSWRzID0ge30pKTtcbmV4cG9ydCB7IElkcyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aWRzLmpzLm1hcCIsImltcG9ydCB7IGZpbmRIb29rLCBnZXRIb29rVW5pcXVlLCBob29rIH0gZnJvbSAnLi9ob29rLmpzJztcbmltcG9ydCB7IENsYXNzTG9hZGVyIH0gZnJvbSAnLi9jbGFzc2xvYWRlci5qcyc7XG5leHBvcnQgKiBmcm9tICcuL2FkZG9ucy5qcyc7XG5leHBvcnQgeyBob29rLCBmaW5kSG9vaywgZ2V0SG9va1VuaXF1ZSwgQ2xhc3NMb2FkZXIgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsImltcG9ydCB7IGxvZ2dlciwgQ29sb3IgfSBmcm9tICdAY2xvY2t3b3JrL2xvZ2dpbmcnO1xuaW1wb3J0IHsgQ2xhc3NlcywgQ2xhc3Nlc1N0cmluZywgVGV4dCwgc3RhY2t0cmFjZUxpc3QgfSBmcm9tICdAY2xvY2t3b3JrL2NvbW1vbic7XG5jb25zdCB7IGJsYWNrLCBncmF5LCByZWQsIGdyZWVuLCBjeWFuLCBkaW0sIGl0YWxpYywgYm9sZCwgeWVsbG93LCBoaWRkZW4gfSA9IENvbG9yLnVzZSgpO1xuY29uc3QgREVGQVVMVF9MT0dHRVJfT1BUSU9OUyA9IHtcbiAgICBzcGFjaW5nOiAnICAgJyxcbiAgICBhcmd1bWVudHM6IHRydWUsXG4gICAgcmV0dXJuOiB0cnVlLFxuICAgIG11bHRpbGluZTogdHJ1ZSxcbiAgICBzaG9ydDogZmFsc2UsXG4gICAgY2FsbDogdHJ1ZSxcbiAgICBob29rOiB0cnVlLFxuICAgIGVuYWJsZTogdHJ1ZSxcbn07XG5jb25zdCBIT09LX0xPR0dFUiA9IHtcbiAgICBtYXBNZXRob2QoY29uZmlnLCBuYW1lKSB7XG4gICAgICAgIHJldHVybiBDb2xvci5tZXRob2QobmFtZSk7XG4gICAgfSxcbiAgICBtYXBDbGFzcyhjb25maWcsIGNsYXNzTmFtZSkge1xuICAgICAgICBsZXQgdHlwZSA9IFRleHQudG9QcmV0dHlUeXBlKGNsYXNzTmFtZSk7XG4gICAgICAgIGxldCBhcnJheSA9ICcnO1xuICAgICAgICBjb25zdCBpbmRleCA9IHR5cGUuaW5kZXhPZignWycpO1xuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICBhcnJheSA9IGRpbSh5ZWxsb3codHlwZS5zdWJzdHJpbmcoaW5kZXgpKSk7XG4gICAgICAgICAgICB0eXBlID0gdHlwZS5zdWJzdHJpbmcoMCwgaW5kZXgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNwbGl0cyA9IHR5cGUuc3BsaXQoJy4nKTtcbiAgICAgICAgaWYgKGNvbmZpZy5zaG9ydClcbiAgICAgICAgICAgIHJldHVybiBjeWFuKHNwbGl0c1tzcGxpdHMubGVuZ3RoIC0gMV0pICsgYXJyYXk7XG4gICAgICAgIHJldHVybiBzcGxpdHMubWFwKGN5YW4pLmpvaW4oJy4nKSArIGFycmF5O1xuICAgIH0sXG4gICAgbWFwVmFsdWUoYXJnKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYXJnID09PSAnc3RyaW5nJyB8fCBhcmc/LiRjbGFzc05hbWUgPT09IENsYXNzZXNTdHJpbmcuU3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29sb3Iuc3RyaW5nKGFyZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBhcmcgPT09ICdib29sZWFuJyB8fCB0eXBlb2YgYXJnID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgcmV0dXJuIENvbG9yLm51bWJlcihgJHthcmd9YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFyZyA9PT0gbnVsbCB8fCBhcmcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIENvbG9yLm51bWJlcihgJHtudWxsfWApO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgIHJldHVybiBDbGFzc2VzLlN0cmluZy52YWx1ZU9mKGFyZyk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHthcmd9QCR7dHlwZW9mIGFyZ31gO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBtYXBBcmdzKGNvbmZpZywgYXJncykge1xuICAgICAgICBpZiAoYXJncy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIGlmICghY29uZmlnLmFyZ3VtZW50cylcbiAgICAgICAgICAgIHJldHVybiBncmF5KCcuLi4nKTtcbiAgICAgICAgY29uc3Qgam9pbkJ5ID0gY29uZmlnLm11bHRpbGluZSA/ICcsIFxcbicgOiAnLCAnO1xuICAgICAgICBjb25zdCBqb2luZWQgPSBhcmdzLm1hcCgoYXJnKSA9PiBgJHtjb25maWcubXVsdGlsaW5lID8gY29uZmlnLnNwYWNpbmcgOiAnJ30ke3RoaXMubWFwVmFsdWUoYXJnKX1gKS5qb2luKGpvaW5CeSk7XG4gICAgICAgIHJldHVybiBjb25maWcubXVsdGlsaW5lID8gYFxcbiR7am9pbmVkfVxcbmAgOiBqb2luZWQ7XG4gICAgfSxcbiAgICBwcmludEhvb2tDbGFzcyhjb25maWcsIGNsYXNzTmFtZSwgbG9nSWQpIHtcbiAgICAgICAgaWYgKCFjb25maWcuaG9vaylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgbGV0IHNiID0gJyc7XG4gICAgICAgIHNiICs9IGJvbGQoJ0hvb2tpbmcnKTtcbiAgICAgICAgc2IgKz0gJyAnO1xuICAgICAgICBzYiArPSB0aGlzLm1hcENsYXNzKGNvbmZpZywgY2xhc3NOYW1lKTtcbiAgICAgICAgdGhpcy5sb2dJbmZvKHNiLCBsb2dJZCk7XG4gICAgfSxcbiAgICBwcmludEhvb2tNZXRob2QoY29uZmlnLCBtZXRob2ROYW1lLCBhcmdUeXBlcywgcmV0dXJuVHlwZSwgbG9nSWQpIHtcbiAgICAgICAgaWYgKCFjb25maWcuaG9vaylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgbGV0IHNiID0gJyc7XG4gICAgICAgIHNiICs9IGJsYWNrKGRpbSgnICA+JykpO1xuICAgICAgICBzYiArPSB0aGlzLm1hcE1ldGhvZChjb25maWcsIG1ldGhvZE5hbWUpO1xuICAgICAgICBzYiArPSBDb2xvci5icmFja2V0KCcoJyk7XG4gICAgICAgIHNiICs9IGFyZ1R5cGVzLm1hcCgoYXJnVHlwZSkgPT4gdGhpcy5tYXBDbGFzcyhjb25maWcsIGFyZ1R5cGUpKS5qb2luKCcsICcpO1xuICAgICAgICBzYiArPSBDb2xvci5icmFja2V0KCcpJyk7XG4gICAgICAgIHNiICs9ICc6ICc7XG4gICAgICAgIHNiICs9IHRoaXMubWFwQ2xhc3MoY29uZmlnLCByZXR1cm5UeXBlKTtcbiAgICAgICAgdGhpcy5sb2dJbmZvKHNiLCBsb2dJZCk7XG4gICAgfSxcbiAgICBwcmludENhbGwoY29uZmlnLCBjbGFzc05hbWUsIG1ldGhvZE5hbWUsIGFyZ1ZhbHVlcywgcmV0dXJuVHlwZSwgbG9nSWQsIGlzUmVwbGFjZWQgPSBmYWxzZSkge1xuICAgICAgICBpZiAoIWNvbmZpZy5jYWxsKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBsZXQgc2IgPSAnJztcbiAgICAgICAgc2IgKz0gZGltKGlzUmVwbGFjZWQgPyBpdGFsaWMoJ3JlcGxhY2UnKSA6ICdjYWxsJyk7XG4gICAgICAgIHNiICs9ICcgJztcbiAgICAgICAgaWYgKG1ldGhvZE5hbWUgIT09ICckaW5pdCcpIHtcbiAgICAgICAgICAgIHNiICs9IHRoaXMubWFwQ2xhc3MoY29uZmlnLCBjbGFzc05hbWUpO1xuICAgICAgICAgICAgc2IgKz0gJzo6JztcbiAgICAgICAgICAgIHNiICs9IHRoaXMubWFwTWV0aG9kKGNvbmZpZywgbWV0aG9kTmFtZSk7XG4gICAgICAgICAgICBzYiArPSBDb2xvci5icmFja2V0KCcoJyk7XG4gICAgICAgICAgICBzYiArPSB0aGlzLm1hcEFyZ3MoY29uZmlnLCBhcmdWYWx1ZXMpO1xuICAgICAgICAgICAgc2IgKz0gQ29sb3IuYnJhY2tldCgnKScpO1xuICAgICAgICAgICAgc2IgKz0gJzogJztcbiAgICAgICAgICAgIHNiICs9IHRoaXMubWFwQ2xhc3MoY29uZmlnLCByZXR1cm5UeXBlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHNiICs9IGdyYXkoJ25ldycpO1xuICAgICAgICAgICAgc2IgKz0gJyAnO1xuICAgICAgICAgICAgc2IgKz0gdGhpcy5tYXBDbGFzcyhjb25maWcsIGNsYXNzTmFtZSk7XG4gICAgICAgICAgICBzYiArPSBDb2xvci5icmFja2V0KCcoJyk7XG4gICAgICAgICAgICBzYiArPSB0aGlzLm1hcEFyZ3MoY29uZmlnLCBhcmdWYWx1ZXMpO1xuICAgICAgICAgICAgc2IgKz0gQ29sb3IuYnJhY2tldCgnKScpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9nSW5mbyhzYiwgbG9nSWQpO1xuICAgIH0sXG4gICAgcHJpbnRSZXR1cm4oY29uZmlnLCByZXR1cm5WYWx1ZSwgbG9nSWQpIHtcbiAgICAgICAgaWYgKCFjb25maWcucmV0dXJuKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBsZXQgc2IgPSAnJztcbiAgICAgICAgc2IgKz0gZGltKCdyZXR1cm4nKTtcbiAgICAgICAgc2IgKz0gJyAnO1xuICAgICAgICBzYiArPSBgJHt0aGlzLm1hcFZhbHVlKHJldHVyblZhbHVlKX1gO1xuICAgICAgICB0aGlzLmxvZ0luZm8oc2IsIGxvZ0lkKTtcbiAgICB9LFxuICAgIG1hcExvZ0lkKGxvZ0lkKSB7XG4gICAgICAgIC8vIGphbmt5IHN1cHBvcnQgZm9yIGtpdHR5IGJhY2tncm91bmQsIG5lZWRzIHRvIGJlIHNldCBwZXIgdGhlbWVcbiAgICAgICAgcmV0dXJuIGAgXFx4MWJbMzg7Mjs0NTs0Mjs0Nm0ke2hpZGRlbihsb2dJZCl9XFx4MWJbMG1gO1xuICAgIH0sXG4gICAgbG9nSW5mbyh0ZXh0LCBsb2dJZCkge1xuICAgICAgICAvLyBmaXggbGluZSBlbmRpbmdzXG4gICAgICAgIGxldCBzYiA9IHRleHQucmVwbGFjZUFsbCgvXFxyXFxuPyQvZ20sICdcXG4nKTtcbiAgICAgICAgLy8gYXBwZW5kIGxvZ0lkIHRvIGFsbCBsaW5lc1xuICAgICAgICBpZiAobG9nSWQpIHtcbiAgICAgICAgICAgIHNiID0gc2IucmVwbGFjZUFsbCgvJC9nbSwgYCR7dGhpcy5tYXBMb2dJZChsb2dJZCl9YCk7XG4gICAgICAgIH1cbiAgICAgICAgbG9nZ2VyLmluZm8oc2IpO1xuICAgIH0sXG59O1xuY29uc3QgSE9PS19MT0dHRVJfSlNPTiA9IHtcbiAgICBtYXBNZXRob2QobmFtZSkge1xuICAgICAgICByZXR1cm4gbmFtZTtcbiAgICB9LFxuICAgIG1hcENsYXNzKGNsYXNzTmFtZSkge1xuICAgICAgICBsZXQgdHlwZSA9IFRleHQudG9QcmV0dHlUeXBlKGNsYXNzTmFtZSk7XG4gICAgICAgIGxldCBhcnJheSA9ICcnO1xuICAgICAgICBjb25zdCBpbmRleCA9IHR5cGUuaW5kZXhPZignWycpO1xuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICBhcnJheSA9IHR5cGUuc3Vic3RyaW5nKGluZGV4KTtcbiAgICAgICAgICAgIHR5cGUgPSB0eXBlLnN1YnN0cmluZygwLCBpbmRleCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3BsaXRzID0gdHlwZS5zcGxpdCgnLicpO1xuICAgICAgICByZXR1cm4gc3BsaXRzLmpvaW4oJy4nKSArIGFycmF5O1xuICAgIH0sXG4gICAgbWFwVmFsdWUoYXJnKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYXJnID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgYXJnID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIGFyZyA9PT0gJ251bWJlcicgfHwgYXJnPy4kY2xhc3NOYW1lID09PSBDbGFzc2VzU3RyaW5nLlN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIGAke2FyZ31gO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcmcgPT09IG51bGwgfHwgYXJnID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmc/LiRjbGFzc05hbWUgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgcmV0dXJuIENsYXNzZXMuQXJyYXlzLnRvU3RyaW5nKGFyZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoXykgeyB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgIHJldHVybiBDbGFzc2VzLlN0cmluZy52YWx1ZU9mKGFyZyk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHthcmd9QCR7dHlwZW9mIGFyZ31gO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBwcmludEhvb2tDbGFzcyhjbGFzc05hbWUsIGxvZ0lkKSB7XG4gICAgICAgIGNvbnN0IG1zZyA9IEpTT04uc3RyaW5naWZ5KHsgdDogJ2p2bWNsYXNzJywgY246IHRoaXMubWFwQ2xhc3MoY2xhc3NOYW1lKSwgaWQ6IGxvZ0lkIH0pO1xuICAgICAgICBsb2dnZXIuaW5mbyhtc2cpO1xuICAgIH0sXG4gICAgcHJpbnRIb29rTWV0aG9kKG1ldGhvZE5hbWUsIGFyZ1R5cGVzLCByZXR1cm5UeXBlLCBsb2dJZCkge1xuICAgICAgICBjb25zdCBtc2cgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0OiAnanZtbWV0aG9kJyxcbiAgICAgICAgICAgIG1uOiB0aGlzLm1hcE1ldGhvZChtZXRob2ROYW1lKSxcbiAgICAgICAgICAgIGE6IGFyZ1R5cGVzLm1hcCgoYXJnVHlwZSkgPT4gdGhpcy5tYXBDbGFzcyhhcmdUeXBlKSksXG4gICAgICAgICAgICByOiB0aGlzLm1hcENsYXNzKHJldHVyblR5cGUpLFxuICAgICAgICAgICAgaWQ6IGxvZ0lkLFxuICAgICAgICB9KTtcbiAgICAgICAgbG9nZ2VyLmluZm8obXNnKTtcbiAgICB9LFxuICAgIHByaW50Q2FsbChjbGFzc05hbWUsIG1ldGhvZE5hbWUsIGFyZ1ZhbHVlcywgcmV0dXJuVHlwZSwgbG9nSWQsIGlzUmVwbGFjZWQgPSBmYWxzZSkge1xuICAgICAgICBjb25zdCBtc2cgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0OiAnanZtY2FsbCcsXG4gICAgICAgICAgICBjbjogdGhpcy5tYXBDbGFzcyhjbGFzc05hbWUpLFxuICAgICAgICAgICAgbW46IHRoaXMubWFwTWV0aG9kKG1ldGhvZE5hbWUpLFxuICAgICAgICAgICAgaWQ6IGxvZ0lkLFxuICAgICAgICAgICAgYXY6IGFyZ1ZhbHVlcy5tYXAoKGFyZykgPT4gdGhpcy5tYXBWYWx1ZShhcmcpKSxcbiAgICAgICAgICAgIHN0OiBzdGFja3RyYWNlTGlzdCgpXG4gICAgICAgIH0pO1xuICAgICAgICBsb2dnZXIuaW5mbyhtc2cpO1xuICAgIH0sXG4gICAgcHJpbnRSZXR1cm4ocmV0dXJuVmFsdWUsIGxvZ0lkKSB7XG4gICAgICAgIGNvbnN0IG1zZyA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHQ6ICdqdm1yZXR1cm4nLFxuICAgICAgICAgICAgaWQ6IGxvZ0lkLFxuICAgICAgICAgICAgcnY6IHRoaXMubWFwVmFsdWUocmV0dXJuVmFsdWUpLFxuICAgICAgICB9KTtcbiAgICAgICAgbG9nZ2VyLmluZm8obXNnKTtcbiAgICB9LFxufTtcbmZ1bmN0aW9uIGdldFByZXR0eUxvZ2dlcihvcHRpb25zKSB7XG4gICAgY29uc3Qgb3B0ID0gb3B0aW9ucyA/IHsgLi4uREVGQVVMVF9MT0dHRVJfT1BUSU9OUywgLi4ub3B0aW9ucyB9IDogREVGQVVMVF9MT0dHRVJfT1BUSU9OUztcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgLi4uT2JqZWN0LmVudHJpZXMoSE9PS19MT0dHRVIpLm1hcCgoW2tleSwgZnVuY10pID0+ICh7XG4gICAgICAgIFtrZXldOiAoLi4uYXJncykgPT4gZnVuYy5jYWxsKEhPT0tfTE9HR0VSLCBvcHQsIC4uLmFyZ3MpLFxuICAgIH0pKSk7XG59XG5mdW5jdGlvbiBnZXRKc29uTG9nZ2VyKCkge1xuICAgIHJldHVybiBIT09LX0xPR0dFUl9KU09OO1xufVxuZnVuY3Rpb24gZ2V0TG9nZ2VyKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gZ2V0UHJldHR5TG9nZ2VyKG9wdGlvbnMpO1xuICAgIC8vIHJldHVybiBnZXRKc29uTG9nZ2VyKClcbn1cbmV4cG9ydCB7IGdldExvZ2dlciB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bG9nZ2VyLmpzLm1hcCIsImltcG9ydCB7IEpOSUVudkludGVyY2VwdG9yQVJNNjQgfSBmcm9tICcuL2puaUVudkludGVyY2VwdG9yQXJtNjQuanMnO1xuaW1wb3J0IHsgVGV4dCwgQ2xhc3NlcyB9IGZyb20gJ0BjbG9ja3dvcmsvY29tbW9uJztcbmltcG9ydCB7IENvbG9yLCBzdWJMb2dnZXIgfSBmcm9tICdAY2xvY2t3b3JrL2xvZ2dpbmcnO1xuaW1wb3J0IHsgSk5JTWV0aG9kIH0gZnJvbSAnLi9qbmlNZXRob2QuanMnO1xuaW1wb3J0IHsgZmFzdHBhdGhNZXRob2QsIHJlc29sdmVNZXRob2QgfSBmcm9tICcuL3RyYWNlci5qcyc7XG5jb25zdCBsb2dnZXIgPSBzdWJMb2dnZXIoJ2puaXRyYWNlJyk7XG5jb25zdCB7IGJsYWNrLCBibHVlLCBkaW0sIHJlZEJyaWdodCwgeWVsbG93IH0gPSBDb2xvci51c2UoKTtcbi8vIFRPRE8gZml4IGFsbCBvZiB0aGlzXG5sZXQgSUZfQ0hFQ0sgPSBmdW5jdGlvbiAodGhpc1JlZikge1xuICAgIHJldHVybiBmYWxzZTtcbn07XG5mdW5jdGlvbiBDb2xvck1ldGhvZChqTWV0aG9kSWQsIG1ldGhvZCkge1xuICAgIGxldCBzYiA9ICcnO1xuICAgIHNiICs9IHJlZEJyaWdodChgJHtqTWV0aG9kSWR9YCArICcgLScgKyBkaW0oJz4nKSk7XG4gICAgc2IgKz0gQ29sb3IuY2xhc3NOYW1lKG1ldGhvZC5jbGFzc05hbWUpO1xuICAgIHNiICs9ICc6Oic7XG4gICAgc2IgKz0gQ29sb3IubWV0aG9kKG1ldGhvZC5uYW1lKTtcbiAgICBzYiArPSBDb2xvci5icmFja2V0KCcoJyk7XG4gICAgc2IgKz0gbWV0aG9kLmphdmFQYXJhbXMubWFwKENvbG9yLmNsYXNzTmFtZSkuam9pbignLCAnKTtcbiAgICBzYiArPSBDb2xvci5icmFja2V0KCcpJyk7XG4gICAgc2IgKz0gJzogJztcbiAgICBzYiArPSBDb2xvci5jbGFzc05hbWUobWV0aG9kLmphdmFSZXQpO1xuICAgIHJldHVybiBzYjtcbn1cbmZ1bmN0aW9uIENvbG9yTWV0aG9kSW52b2tlKG1ldGhvZCwgYXJncykge1xuICAgIGxldCBzYiA9ICcnO1xuICAgIHNiICs9IGRpbSgnY2FsbCcpO1xuICAgIHNiICs9ICcgJztcbiAgICBzYiArPSBDb2xvci5jbGFzc05hbWUobWV0aG9kLmNsYXNzTmFtZSk7XG4gICAgc2IgKz0gJzo6JztcbiAgICBzYiArPSBDb2xvci5tZXRob2QobWV0aG9kLm5hbWUpO1xuICAgIHNiICs9IENvbG9yLmJyYWNrZXQoJygnKTtcbiAgICBpZiAoYXJncy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHNiICs9ICdcXG4nO1xuICAgICAgICBzYiArPSBhcmdzLm1hcCgoYXJnKSA9PiBgICAgICR7YXJnfWApLmpvaW4oJywgXFxuJyk7XG4gICAgICAgIHNiICs9ICdcXG4nO1xuICAgIH1cbiAgICBzYiArPSBDb2xvci5icmFja2V0KCcpJyk7XG4gICAgc2IgKz0gJzogJztcbiAgICBzYiArPSBDb2xvci5jbGFzc05hbWUobWV0aG9kLmphdmFSZXQpO1xuICAgIHJldHVybiBzYjtcbn1cbmZ1bmN0aW9uIGhvb2tJZihjYWxsYmFjaywgdGFnKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgICAgIGlmICghSUZfQ0hFQ0sodGhpcykpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGNvbnN0IG1zZyA9IGNhbGxiYWNrLmNhbGwodGhpcywgYXJncyk7XG4gICAgICAgIGlmICghbXNnKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjb25zb2xlLmxvZyhgWyR7dGFnfV1gLCBtc2csIERlYnVnU3ltYm9sLmZyb21BZGRyZXNzKHRoaXMucmV0dXJuQWRkcmVzcykpO1xuICAgIH07XG59XG5mdW5jdGlvbiBob29rSWZUYWcodGFnLCBjYWxsYmFjaykge1xuICAgIHJldHVybiBob29rSWYoY2FsbGJhY2ssIGRpbSh0YWcpKTtcbn1cbmZ1bmN0aW9uIGZvcm1hdENhbGxNZXRob2QobmF0aXZlTmFtZSwgak1ldGhvZElkLCBtZXRob2QsIGFyZ3MpIHtcbiAgICBpZiAoIW1ldGhvZClcbiAgICAgICAgcmV0dXJuIG51bGw7IC8vICEgVE9ETyBmaXhcbiAgICBpZiAoYXJncykge1xuICAgICAgICBjb25zdCBtYXBwZWRBcmdzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgaSBpbiBtZXRob2QucGFyYW1ldGVycykge1xuICAgICAgICAgICAgY29uc3QgcGFyYW0gPSBtZXRob2QucGFyYW1ldGVyc1tpXTtcbiAgICAgICAgICAgIG1hcHBlZEFyZ3MucHVzaChhcmdzW2ldKTtcbiAgICAgICAgICAgIHN3aXRjaCAocGFyYW0pIHtcbiAgICAgICAgICAgICAgICBjYXNlICdqYXZhLmxhbmcuU3RyaW5nJzoge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB3cmFwcGVkID0gSmF2YS5jYXN0KGFyZ3NbaV0sIENsYXNzZXMuU3RyaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgbWFwcGVkQXJnc1tpXSA9IENvbG9yLnN0cmluZyh3cmFwcGVkKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhc2UgJ2Jvb2xlYW4nOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRleHRCb29sZWFuID0gYXJnc1tpXSA/ICd0cnVlJyA6ICdmYWxzZSc7XG4gICAgICAgICAgICAgICAgICAgIG1hcHBlZEFyZ3NbaV0gPSBDb2xvci5udW1iZXIodGV4dEJvb2xlYW4pO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSAnZG91YmxlJzpcbiAgICAgICAgICAgICAgICBjYXNlICdmbG9hdCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnaW50JzpcbiAgICAgICAgICAgICAgICBjYXNlICdsb25nJzoge1xuICAgICAgICAgICAgICAgICAgICBtYXBwZWRBcmdzW2ldID0gQ29sb3IubnVtYmVyKGFyZ3NbaV0pO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoKGFyZ3NbaV0gaW5zdGFuY2VvZiBOYXRpdmVQb2ludGVyKSAmJiBhcmdzW2ldPy5pc051bGwoKSkge1xuICAgICAgICAgICAgICAgIG1hcHBlZEFyZ3NbaV0gPSBDb2xvci5udW1iZXIobnVsbCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHdyYXBwZWQgPSBKYXZhLmNhc3QoYXJnc1tpXSwgQ2xhc3Nlcy5PYmplY3QpO1xuICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgIG1hcHBlZEFyZ3NbaV0gPSBDbGFzc2VzLlN0cmluZy52YWx1ZU9mKHdyYXBwZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQ29sb3JNZXRob2RJbnZva2UobWV0aG9kLCBtYXBwZWRBcmdzKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5mdW5jdGlvbiBmb3JtYXRNZXRob2RSZXR1cm4odmFsdWUpIHtcbiAgICBpZiAoIXZhbHVlIHx8IHZhbHVlLmlzTnVsbCgpKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICBsZXQgdGV4dCA9IGAke3ZhbHVlfWA7XG4gICAgbGV0IHR5cGUgPSBudWxsOyAvLyBKYXZhLnZtLnRyeUdldEVudigpPy5nZXRPYmplY3RDbGFzc05hbWUodmFsdWUpO1xuICAgIGlmICh0eXBlICYmICh0eXBlID0gVGV4dC50b1ByZXR0eVR5cGUodHlwZSkpKSB7XG4gICAgICAgIGlmICh0eXBlID09IENsYXNzZXMuU3RyaW5nLiRjbGFzc05hbWUpIHtcbiAgICAgICAgICAgIHRleHQgPSB5ZWxsb3coYFwiJHtKYXZhLmNhc3QodmFsdWUsIENsYXNzZXMuU3RyaW5nKX1cImApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGUuaW5jbHVkZXMoJy4nKSkge1xuICAgICAgICAgICAgdGV4dCA9IGAke0phdmEuY2FzdCh2YWx1ZSwgQ2xhc3Nlcy5PYmplY3QpfWA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGAke2RpbSgncmV0dXJuJyl9ICR7dGV4dH1gO1xufVxuLypcbkdldEZpZWxkSUQgaXMgYXQgIDB4ZTM5Yjg3YzUgX1pOM2FydDNKTkkxMEdldEZpZWxkSURFUDdfSk5JRW52UDdfamNsYXNzUEtjUzZfXG5HZXRNZXRob2RJRCBpcyBhdCAgMHhlMzlhMWExOSBfWk4zYXJ0M0pOSTExR2V0TWV0aG9kSURFUDdfSk5JRW52UDdfamNsYXNzUEtjUzZfXG5OZXdTdHJpbmdVVEYgaXMgYXQgIDB4ZTM5Y2ZmMjUgX1pOM2FydDNKTkkxMk5ld1N0cmluZ1VURkVQN19KTklFbnZQS2NcblJlZ2lzdGVyTmF0aXZlcyBpcyBhdCAgMHhlMzllMDhmZCBfWk4zYXJ0M0pOSTE1UmVnaXN0ZXJOYXRpdmVzRVA3X0pOSUVudlA3X2pjbGFzc1BLMTVKTklOYXRpdmVNZXRob2RpXG5HZXRTdGF0aWNGaWVsZElEIGlzIGF0ICAweGUzOWM5NjM1IF9aTjNhcnQzSk5JMTZHZXRTdGF0aWNGaWVsZElERVA3X0pOSUVudlA3X2pjbGFzc1BLY1M2X1xuR2V0U3RhdGljTWV0aG9kSUQgaXMgYXQgIDB4ZTM5YmUwZWQgX1pOM2FydDNKTkkxN0dldFN0YXRpY01ldGhvZElERVA3X0pOSUVudlA3X2pjbGFzc1BLY1M2X1xuR2V0U3RyaW5nVVRGQ2hhcnMgaXMgYXQgIDB4ZTM5ZDA2ZTUgX1pOM2FydDNKTkkxN0dldFN0cmluZ1VURkNoYXJzRVA3X0pOSUVudlA4X2pzdHJpbmdQaFxuRGVmaW5lQ2xhc3MgaXMgYXQgMHg/Pz8/Pz8/P1xuRmluZENsYXNzIGlzIGF0ICAweGUzOTlhZTVkIF9aTjNhcnQzSk5JOUZpbmRDbGFzc0VQN19KTklFbnZQS2NcbiovXG5mdW5jdGlvbiBob29rTGliYXJ0KHByZWRpY2F0ZSkge1xuICAgIElGX0NIRUNLID0gcHJlZGljYXRlO1xuICAgIGNvbnN0IGxpYmFydCA9IFByb2Nlc3MuZ2V0TW9kdWxlQnlOYW1lKCdsaWJhcnQuc28nKTtcbiAgICBjb25zdCBzeW1ib2xzID0gbGliYXJ0LmVudW1lcmF0ZVN5bWJvbHMoKTtcbiAgICBjb25zdCBqbmlJbnRlcmNlcHRvciA9IG5ldyBKTklFbnZJbnRlcmNlcHRvckFSTTY0KCk7XG4gICAgbGV0IGFkZHJHZXRTdHJpbmdVVEZDaGFycyA9IG51bGw7XG4gICAgbGV0IGFkZHJOZXdTdHJpbmdVVEYgPSBudWxsO1xuICAgIGNvbnN0IGFkZHJzRGVmaW5lQ2xhc3MgPSBbXTtcbiAgICBsZXQgYWRkckZpbmRDbGFzcyA9IG51bGw7XG4gICAgbGV0IGFkZHJHZXRNZXRob2RJRCA9IG51bGw7XG4gICAgbGV0IGFkZHJHZXRTdGF0aWNNZXRob2RJRCA9IG51bGw7XG4gICAgbGV0IGFkZHJHZXRGaWVsZElEID0gbnVsbDtcbiAgICBsZXQgYWRkckdldFN0YXRpY0ZpZWxkSUQgPSBudWxsO1xuICAgIGxldCBhZGRyUmVnaXN0ZXJOYXRpdmVzID0gbnVsbDtcbiAgICBjb25zdCBhZGRyc0NhbGxTdGF0aWMgPSBbXTtcbiAgICBjb25zdCBhZGRyc0NhbGxOb252aXJ0dWFsID0gW107XG4gICAgY29uc3QgYWRkcnNDYWxsTWV0aG9kID0gW107XG4gICAgbGV0IFRvUmVmbGVjdGVkTWV0aG9kID0gbnVsbDtcbiAgICBsZXQgR2V0TWV0aG9kSUQgPSBudWxsO1xuICAgIHN5bWJvbHMuZm9yRWFjaCgoeyBuYW1lLCBhZGRyZXNzIH0pID0+IHtcbiAgICAgICAgaWYgKG5hbWUuaW5jbHVkZXMoJ2FydCcpICYmIG5hbWUuaW5jbHVkZXMoJ0pOSScpICYmIG5hbWUuaW5jbHVkZXMoJ19aTjNhcnQzSk5JSUxiMCcpICYmICFuYW1lLmluY2x1ZGVzKCdDaGVja0pOSScpKSB7XG4gICAgICAgICAgICBpZiAobmFtZS5pbmNsdWRlcygnR2V0U3RyaW5nVVRGQ2hhcnMnKSkge1xuICAgICAgICAgICAgICAgIGFkZHJHZXRTdHJpbmdVVEZDaGFycyA9IGFkZHJlc3M7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLnRyYWNlKCdHZXRTdHJpbmdVVEZDaGFycyBpcyBhdCcsIGFkZHJlc3MsIG5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobmFtZS5pbmNsdWRlcygnTmV3U3RyaW5nVVRGJykpIHtcbiAgICAgICAgICAgICAgICBhZGRyTmV3U3RyaW5nVVRGID0gYWRkcmVzcztcbiAgICAgICAgICAgICAgICBsb2dnZXIudHJhY2UoJ05ld1N0cmluZ1VURiBpcyBhdCcsIGFkZHJlc3MsIG5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobmFtZS5pbmNsdWRlcygnRGVmaW5lQ2xhc3MnKSkge1xuICAgICAgICAgICAgICAgIGFkZHJzRGVmaW5lQ2xhc3MucHVzaChhZGRyZXNzKTtcbiAgICAgICAgICAgICAgICBsb2dnZXIudHJhY2UoJ0RlZmluZUNsYXNzIGlzIGF0JywgYWRkcmVzcywgbmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChuYW1lLmluY2x1ZGVzKCdGaW5kQ2xhc3MnKSkge1xuICAgICAgICAgICAgICAgIGFkZHJGaW5kQ2xhc3MgPSBhZGRyZXNzO1xuICAgICAgICAgICAgICAgIGxvZ2dlci50cmFjZSgnRmluZENsYXNzIGlzIGF0JywgYWRkcmVzcywgbmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChuYW1lLmluY2x1ZGVzKCdHZXRNZXRob2RJRCcpKSB7XG4gICAgICAgICAgICAgICAgYWRkckdldE1ldGhvZElEID0gYWRkcmVzcztcbiAgICAgICAgICAgICAgICBHZXRNZXRob2RJRCA9IG5ldyBOYXRpdmVGdW5jdGlvbihhZGRyR2V0TWV0aG9kSUQsICdwb2ludGVyJywgWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddKTtcbiAgICAgICAgICAgICAgICBsb2dnZXIudHJhY2UoJ0dldE1ldGhvZElEIGlzIGF0JywgYWRkcmVzcywgbmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChuYW1lLmluY2x1ZGVzKCdHZXRTdGF0aWNNZXRob2RJRCcpKSB7XG4gICAgICAgICAgICAgICAgYWRkckdldFN0YXRpY01ldGhvZElEID0gYWRkcmVzcztcbiAgICAgICAgICAgICAgICBsb2dnZXIudHJhY2UoJ0dldFN0YXRpY01ldGhvZElEIGlzIGF0JywgYWRkcmVzcywgbmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChuYW1lLmluY2x1ZGVzKCdHZXRGaWVsZElEJykpIHtcbiAgICAgICAgICAgICAgICBhZGRyR2V0RmllbGRJRCA9IGFkZHJlc3M7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLnRyYWNlKCdHZXRGaWVsZElEIGlzIGF0JywgYWRkcmVzcywgbmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChuYW1lLmluY2x1ZGVzKCdHZXRTdGF0aWNGaWVsZElEJykpIHtcbiAgICAgICAgICAgICAgICBhZGRyR2V0U3RhdGljRmllbGRJRCA9IGFkZHJlc3M7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLnRyYWNlKCdHZXRTdGF0aWNGaWVsZElEIGlzIGF0JywgYWRkcmVzcywgbmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChuYW1lLmluY2x1ZGVzKCdSZWdpc3Rlck5hdGl2ZXMnKSkge1xuICAgICAgICAgICAgICAgIGFkZHJSZWdpc3Rlck5hdGl2ZXMgPSBhZGRyZXNzO1xuICAgICAgICAgICAgICAgIGxvZ2dlci50cmFjZSgnUmVnaXN0ZXJOYXRpdmVzIGlzIGF0JywgYWRkcmVzcywgbmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChuYW1lLmluY2x1ZGVzKCdDYWxsU3RhdGljJykpIHtcbiAgICAgICAgICAgICAgICBhZGRyc0NhbGxTdGF0aWMucHVzaChuZXcgSk5JTWV0aG9kKG5hbWUsIGFkZHJlc3MpKTtcbiAgICAgICAgICAgICAgICBsb2dnZXIudHJhY2UoJ0NhbGxTdGF0aWMgaXMgYXQnLCBhZGRyZXNzLCBuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG5hbWUuaW5jbHVkZXMoJ0NhbGxOb252aXJ0dWFsJykpIHtcbiAgICAgICAgICAgICAgICBhZGRyc0NhbGxOb252aXJ0dWFsLnB1c2gobmV3IEpOSU1ldGhvZChuYW1lLCBhZGRyZXNzKSk7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLnRyYWNlKCdDYWxsTm9udmlydHVhbCBpcyBhdCcsIGFkZHJlc3MsIG5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobmFtZS5pbmNsdWRlcygnQ2FsbCcpICYmIG5hbWUuaW5jbHVkZXMoJ01ldGhvZCcpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKG5hbWUpO1xuICAgICAgICAgICAgICAgIGFkZHJzQ2FsbE1ldGhvZC5wdXNoKG5ldyBKTklNZXRob2QobmFtZSwgYWRkcmVzcykpO1xuICAgICAgICAgICAgICAgIGxvZ2dlci50cmFjZSgnQ2FsbDw+TWV0aG9kIGlzIGF0JywgYWRkcmVzcywgbmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChuYW1lLmluY2x1ZGVzKCdUb1JlZmxlY3RlZE1ldGhvZCcpKSB7XG4gICAgICAgICAgICAgICAgVG9SZWZsZWN0ZWRNZXRob2QgPSBuZXcgTmF0aXZlRnVuY3Rpb24oYWRkcmVzcywgJ3BvaW50ZXInLCBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10pO1xuICAgICAgICAgICAgICAgIGxvZ2dlci50cmFjZSgnVG9SZWZsZWN0ZWRNZXRob2QgaXMgYXQnLCBhZGRyZXNzLCBuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG5hbWUuaW5jbHVkZXMoJ0dldEFycmF5TGVuZ3RoJykpIHtcbiAgICAgICAgICAgICAgICAvLyBJbnRlcmNlcHRvci5hdHRhY2goYWRkcmVzcywge1xuICAgICAgICAgICAgICAgIC8vICAgICBvbkxlYXZlOiBob29rSWZUYWcoJ0dldEFycmF5TGVuZ3RoJywgKHJldHZhbCkgPT4gYCR7cmV0dmFsfWApLFxuICAgICAgICAgICAgICAgIC8vIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobmFtZS5pbmNsdWRlcygnU2V0Qnl0ZUFycmF5UmVnaW9uJykpIHtcbiAgICAgICAgICAgICAgICAvLyBJbnRlcmNlcHRvci5hdHRhY2goYWRkcmVzcywge1xuICAgICAgICAgICAgICAgIC8vICAgICBvbkxlYXZlOiBob29rSWZUYWcoJ1NldEJ5dGVBcnJheVJlZ2lvbicsIChyZXR2YWwpID0+IGAke3JldHZhbH1gKSxcbiAgICAgICAgICAgICAgICAvLyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG5hbWUuaW5jbHVkZXMoJ05ld09iamVjdEFycmF5JykpIHtcbiAgICAgICAgICAgICAgICAvLyBJbnRlcmNlcHRvci5hdHRhY2goYWRkcmVzcywge1xuICAgICAgICAgICAgICAgIC8vICAgICBvbkxlYXZlOiBob29rSWZUYWcoJ05ld09iamVjdEFycmF5JywgKHJldHZhbCkgPT4gYCR7cmV0dmFsfWApLFxuICAgICAgICAgICAgICAgIC8vIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobmFtZS5pbmNsdWRlcygnU2V0T2JqZWN0QXJyYXlFbGVtZW50JykpIHtcbiAgICAgICAgICAgICAgICAvLyBJbnRlcmNlcHRvci5hdHRhY2goYWRkcmVzcywge1xuICAgICAgICAgICAgICAgIC8vICAgICBvbkVudGVyOiBob29rSWZUYWcoJ1NldE9iamVjdEFycmF5RWxlbWVudCcsIChhcmdzKSA9PiBgJHthcmdzWzJdfSAtPiAke2FyZ3NbM119YCksXG4gICAgICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChuYW1lLmluY2x1ZGVzKCdSZWxlYXNlQnl0ZUFycmF5RWxlbWVudHMnKSkge1xuICAgICAgICAgICAgICAgIC8vIEludGVyY2VwdG9yLmF0dGFjaChhZGRyZXNzLCB7XG4gICAgICAgICAgICAgICAgLy8gICAgIG9uRW50ZXI6IGhvb2tJZlRhZygnUmVsZWFzZUJ5dGVBcnJheUVsZW1lbnRzJywgKGFyZ3MpID0+IGAke2FyZ3NbMl19IC0+ICR7YXJnc1szXX1gKSxcbiAgICAgICAgICAgICAgICAvLyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG5hbWUuaW5jbHVkZXMoJ0dldEJ5dGVBcnJheUVsZW1lbnRzJykpIHtcbiAgICAgICAgICAgICAgICAvLyBJbnRlcmNlcHRvci5hdHRhY2goYWRkcmVzcywge1xuICAgICAgICAgICAgICAgIC8vICAgICBvbkxlYXZlOiBob29rSWZUYWcoJ0dldEJ5dGVBcnJheUVsZW1lbnRzJywgKHJldHZhbCkgPT4gYCR7cmV0dmFsfSwgJHtyZXR2YWwucmVhZEJ5dGVBcnJheSgzMil9YCksXG4gICAgICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBhZGRyR2V0U3RyaW5nVVRGQ2hhcnMgJiZcbiAgICAgICAgSW50ZXJjZXB0b3IuYXR0YWNoKGFkZHJHZXRTdHJpbmdVVEZDaGFycywge1xuICAgICAgICAgICAgLy8gc3RkOjp0dXBsZTwgVW5pcXVlU3RyaW5nVVRGQ2hhcnMsIGJvb2wgPiBcdEdldFN0cmluZ1VURkNoYXJzIChKTklFbnYgJmVudiwganN0cmluZyAmc3RyaW5nKVxuICAgICAgICAgICAgb25MZWF2ZTogaG9va0lmVGFnKCdHZXRTdHJpbmdVVEZDaGFycycsIChyZXR2YWwpID0+IHllbGxvdyhgXCIke3JldHZhbC5yZWFkQ1N0cmluZygpfVwiYCkpLFxuICAgICAgICB9KTtcbiAgICBhZGRyTmV3U3RyaW5nVVRGICYmXG4gICAgICAgIEludGVyY2VwdG9yLmF0dGFjaChhZGRyTmV3U3RyaW5nVVRGLCB7XG4gICAgICAgICAgICAvLyBqc3RyaW5nICYgXHROZXdTdHJpbmdVVEYgKEpOSUVudiAmZW52LCBjb25zdCBjaGFyICpieXRlcylcbiAgICAgICAgICAgIG9uRW50ZXI6IGhvb2tJZlRhZygnTmV3U3RyaW5nVVRGJywgKGFyZ3MpID0+IHllbGxvdyhgXCIke2FyZ3NbMV0ucmVhZENTdHJpbmcoKX1cImApKSxcbiAgICAgICAgfSk7XG4gICAgLy8gYWRkcnNEZWZpbmVDbGFzcy5mb3JFYWNoKChhZGRyZXMpID0+IHtcbiAgICAvLyAgICAgSW50ZXJjZXB0b3IuYXR0YWNoKGFkZHJlcywge1xuICAgIC8vICAgICAgICAgLy8gamNsYXNzICYgXHREZWZpbmVDbGFzcyAoSk5JRW52ICZlbnYsIGNvbnN0IGNoYXIgKm5hbWUsIGpvYmplY3QgJmxvYWRlciwgY29uc3QgamJ5dGUgKmJ1ZiwganNpemUgc2l6ZSlcbiAgICAvLyAgICAgICAgIC8vIGF1dG8gXHREZWZpbmVDbGFzcyAoSk5JRW52ICZlbnYsIGNvbnN0IGNoYXIgKm5hbWUsIGpvYmplY3QgJmxvYWRlciwgY29uc3QgQXJyYXkgJmJ1ZikgLT4gc3RkOjplbmFibGVfaWZfdDwgSXNBcnJheWxpa2U8IEFycmF5ID46OnZhbHVlLCBqY2xhc3MgJiA+XG4gICAgLy8gICAgICAgICBvbkVudGVyOiBob29rSWZUYWcoJ0RlZmluZUNsYXNzJywgKGFyZ3MpID0+IGFyZ3NbMV0ucmVhZENTdHJpbmcoKSksXG4gICAgLy8gICAgIH0pO1xuICAgIC8vIH0pO1xuICAgIGFkZHJGaW5kQ2xhc3MgJiZcbiAgICAgICAgSW50ZXJjZXB0b3IuYXR0YWNoKGFkZHJGaW5kQ2xhc3MsIHtcbiAgICAgICAgICAgIC8vIGpjbGFzcyAmIFx0RmluZENsYXNzIChKTklFbnYgJmVudiwgY29uc3QgY2hhciAqbmFtZSlcbiAgICAgICAgICAgIG9uRW50ZXI6IGhvb2tJZlRhZygnRmluZENsYXNzJywgKGFyZ3MpID0+IGFyZ3NbMV0ucmVhZENTdHJpbmcoKSksXG4gICAgICAgIH0pO1xuICAgIGNvbnN0IGdldE1ldGhvZElkID0gZnVuY3Rpb24gKGlzU3RhdGljID0gZmFsc2UpIHtcbiAgICAgICAgLy8gam1ldGhvZElEICAgICAgIEdldE1ldGhvZElEKEpOSUVudiAqZW52LCBqY2xhc3MgY2xhenosIGNvbnN0IGNoYXIgKm5hbWUsIGNvbnN0IGNoYXIgKnNpZyk7XG4gICAgICAgIC8vIGptZXRob2RJRCBHZXRTdGF0aWNNZXRob2RJRChKTklFbnYgKmVudiwgamNsYXNzIGNsYXp6LCBjb25zdCBjaGFyICpuYW1lLCBjb25zdCBjaGFyICpzaWcpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgb25FbnRlcihhcmdzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbnYgPSBhcmdzWzBdO1xuICAgICAgICAgICAgICAgIHRoaXMuY2xhenogPSBhcmdzWzFdO1xuICAgICAgICAgICAgICAgIHRoaXMubmFtZSA9IGFyZ3NbMl0ucmVhZENTdHJpbmcoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNpZyA9IGFyZ3NbM10ucmVhZENTdHJpbmcoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbkxlYXZlOiBob29rSWZUYWcoYEdldCR7aXNTdGF0aWMgPyAnU3RhdGljJyA6ICcnfU1ldGhvZElEYCwgZnVuY3Rpb24gKHJldHZhbCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IEphdmEudm0udHJ5R2V0RW52KCkuZ2V0Q2xhc3NOYW1lKHRoaXMuY2xhenopO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1ldGhvZCA9IGZhc3RwYXRoTWV0aG9kKHJldHZhbCwgY2xhc3NOYW1lLCB0aGlzLm5hbWUsIHRoaXMuc2lnLCBpc1N0YXRpYyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIENvbG9yTWV0aG9kKHJldHZhbCwgbWV0aG9kKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICB9O1xuICAgIH07XG4gICAgYWRkckdldE1ldGhvZElEICYmIEludGVyY2VwdG9yLmF0dGFjaChhZGRyR2V0TWV0aG9kSUQsIGdldE1ldGhvZElkKGZhbHNlKSk7XG4gICAgYWRkckdldFN0YXRpY01ldGhvZElEICYmIEludGVyY2VwdG9yLmF0dGFjaChhZGRyR2V0U3RhdGljTWV0aG9kSUQsIGdldE1ldGhvZElkKHRydWUpKTtcbiAgICAvLyBhZGRyR2V0RmllbGRJRCAmJlxuICAgIC8vICAgICBJbnRlcmNlcHRvci5hdHRhY2goYWRkckdldEZpZWxkSUQsIHtcbiAgICAvLyAgICAgICAgIC8vIGpmaWVsZElEICYgXHRHZXRGaWVsZElEIChKTklFbnYgJmVudiwgamNsYXNzICZjbGF6eiwgY29uc3QgY2hhciAqbmFtZSwgY29uc3QgY2hhciAqc2lnKVxuICAgIC8vICAgICAgICAgb25FbnRlcjogaG9va0lmVGFnKCdHZXRGaWVsZElEJywgKGFyZ3MpID0+IHtcbiAgICAvLyAgICAgICAgICAgICBpZiAoYXJnc1syXSA9PT0gbnVsbCkgcmV0dXJuIG51bGw7XG4gICAgLy8gICAgICAgICAgICAgY29uc3QgY2xhenogPSBhcmdzWzFdO1xuICAgIC8vICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBhcmdzWzJdLnJlYWRDU3RyaW5nKCk7XG4gICAgLy8gICAgICAgICAgICAgY29uc3QgY2xhc3NOYW1lID0gSmF2YS52bS50cnlHZXRFbnYoKS5nZXRDbGFzc05hbWUoY2xhenopO1xuICAgIC8vICAgICAgICAgICAgIGNvbnN0IHNpZyA9IGFyZ3NbM10ucmVhZENTdHJpbmcoKTtcbiAgICAvLyAgICAgICAgICAgICByZXR1cm4gYCR7Y2xhc3NOYW1lfTo6JHtuYW1lfSR7c2lnfWA7XG4gICAgLy8gICAgICAgICB9KSxcbiAgICAvLyAgICAgfSk7XG4gICAgLy8gYWRkckdldFN0YXRpY0ZpZWxkSUQgJiZcbiAgICAvLyAgICAgSW50ZXJjZXB0b3IuYXR0YWNoKGFkZHJHZXRTdGF0aWNGaWVsZElELCB7XG4gICAgLy8gICAgICAgICAvLyBqZmllbGRJRCAmIFx0R2V0U3RhdGljRmllbGRJRCAoSk5JRW52ICZlbnYsIGpjbGFzcyAmY2xhenosIGNvbnN0IGNoYXIgKm5hbWUsIGNvbnN0IGNoYXIgKnNpZylcbiAgICAvLyAgICAgICAgIG9uRW50ZXI6IGhvb2tJZlRhZygnR2V0U3RhdGljRmllbGRJRCcsIChhcmdzKSA9PiB7XG4gICAgLy8gICAgICAgICAgICAgaWYgKGFyZ3NbMl0gPT09IG51bGwpIHJldHVybiBudWxsO1xuICAgIC8vICAgICAgICAgICAgIGNvbnN0IGNsYXp6ID0gYXJnc1sxXTtcbiAgICAvLyAgICAgICAgICAgICBjb25zdCBuYW1lID0gYXJnc1syXS5yZWFkQ1N0cmluZygpO1xuICAgIC8vICAgICAgICAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IEphdmEudm0udHJ5R2V0RW52KCkuZ2V0Q2xhc3NOYW1lKGNsYXp6KTtcbiAgICAvLyAgICAgICAgICAgICBjb25zdCBzaWcgPSBhcmdzWzNdLnJlYWRDU3RyaW5nKCk7XG4gICAgLy8gICAgICAgICAgICAgcmV0dXJuIGAke2NsYXNzTmFtZX06OiR7bmFtZX0ke3NpZ31gO1xuICAgIC8vICAgICAgICAgfSksXG4gICAgLy8gICAgIH0pO1xuICAgIGFkZHJzQ2FsbFN0YXRpYy5mb3JFYWNoKCh7IGFkZHJlc3MsIG5hbWUgfSkgPT4ge1xuICAgICAgICBJbnRlcmNlcHRvci5hdHRhY2goYWRkcmVzcywge1xuICAgICAgICAgICAgLy8gc3RkOjplbmFibGVfaWZfdDwhc3RkOjppc192b2lkPCBSID46OnZhbHVlLCBSID4gXHRDYWxsU3RhdGljTWV0aG9kIChKTklFbnYgJmVudiwgamNsYXNzICZjbGF6eiwgam1ldGhvZElEICZtZXRob2QsIEFyZ3MgJiYuLi4gYXJncylcbiAgICAgICAgICAgIG9uRW50ZXI6IGhvb2tJZlRhZygnQ2FsbFN0YXRpYycsIChyYXdhcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZW52ID0gcmF3YXJnc1swXTtcbiAgICAgICAgICAgICAgICBjb25zdCBqY2xhc3MgPSByYXdhcmdzWzFdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGpNZXRob2RJZCA9IHJhd2FyZ3NbMl07XG4gICAgICAgICAgICAgICAgY29uc3QgYXJncyA9IHJhd2FyZ3NbM107XG4gICAgICAgICAgICAgICAgY29uc3QgbWV0aG9kID0gcmVzb2x2ZU1ldGhvZChqTWV0aG9kSWQsIHRydWUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNhbGxBcmdzID0gam5pSW50ZXJjZXB0b3IuZ2V0Q2FsbE1ldGhvZEFyZ3MobmFtZSwgW2VudiwgamNsYXNzLCBqTWV0aG9kSWQsIGFyZ3NdLCB0cnVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm9ybWF0Q2FsbE1ldGhvZChuYW1lLCBqTWV0aG9kSWQsIG1ldGhvZCwgY2FsbEFyZ3MpO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBvbkxlYXZlOiBob29rSWZUYWcoJ0NhbGxTdGF0aWMnLCBmb3JtYXRNZXRob2RSZXR1cm4pLFxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICBhZGRyc0NhbGxOb252aXJ0dWFsLmZvckVhY2goKHsgYWRkcmVzcywgbmFtZSB9KSA9PiB7XG4gICAgICAgIEludGVyY2VwdG9yLmF0dGFjaChhZGRyZXNzLCB7XG4gICAgICAgICAgICAvLyBzdGQ6OmVuYWJsZV9pZl90PCBzdGQ6OmlzX3ZvaWQ8IFIgPjo6dmFsdWUsIFIgPiBcdENhbGxOb252aXJ0dWFsTWV0aG9kIChKTklFbnYgJmVudiwgam9iamVjdCAqb2JqLCBqY2xhc3MgJmNsYXp6LCBqbWV0aG9kSUQgJm1ldGhvZCwgQXJncyAmJi4uLiBhcmdzKVxuICAgICAgICAgICAgb25FbnRlcjogaG9va0lmVGFnKCdDYWxsTm9udmlydHVhbCcsIChyYXdhcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZW52ID0gcmF3YXJnc1swXTtcbiAgICAgICAgICAgICAgICBjb25zdCBqb2JqZWN0ID0gcmF3YXJnc1sxXTtcbiAgICAgICAgICAgICAgICBjb25zdCBqY2xhc3MgPSByYXdhcmdzWzJdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGpNZXRob2RJZCA9IHJhd2FyZ3NbM107XG4gICAgICAgICAgICAgICAgY29uc3QgYXJncyA9IHJhd2FyZ3NbNF07XG4gICAgICAgICAgICAgICAgY29uc3QgbWV0aG9kID0gcmVzb2x2ZU1ldGhvZChqTWV0aG9kSWQsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjYWxsQXJncyA9IGpuaUludGVyY2VwdG9yLmdldENhbGxNZXRob2RBcmdzKG5hbWUsIFtlbnYsIGpvYmplY3QsIGpjbGFzcywgak1ldGhvZElkLCBhcmdzXSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmb3JtYXRDYWxsTWV0aG9kKG5hbWUsIGpNZXRob2RJZCwgbWV0aG9kLCBjYWxsQXJncyk7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIG9uTGVhdmU6IGhvb2tJZlRhZygnQ2FsbE5vbnZpcnR1YWwnLCBmb3JtYXRNZXRob2RSZXR1cm4pLFxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICBhZGRyc0NhbGxNZXRob2QuZm9yRWFjaCgoeyBhZGRyZXNzLCBuYW1lIH0pID0+IHtcbiAgICAgICAgSW50ZXJjZXB0b3IuYXR0YWNoKGFkZHJlc3MsIHtcbiAgICAgICAgICAgIC8vIHN0ZDo6ZW5hYmxlX2lmX3Q8IXN0ZDo6aXNfdm9pZDwgUiA+Ojp2YWx1ZSwgUiA+IFx0Q2FsbE1ldGhvZCAoSk5JRW52ICZlbnYsIGpvYmplY3QgKm9iaiwgam1ldGhvZElEICZtZXRob2QsIEFyZ3MgJiYuLi4gYXJncylcbiAgICAgICAgICAgIG9uRW50ZXI6IGhvb2tJZlRhZygnQ2FsbE1ldGhvZCcsIChyYXdhcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZW52ID0gcmF3YXJnc1swXTtcbiAgICAgICAgICAgICAgICBjb25zdCBqb2JqZWN0ID0gcmF3YXJnc1sxXTtcbiAgICAgICAgICAgICAgICBjb25zdCBqTWV0aG9kSWQgPSByYXdhcmdzWzJdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGFyZ3MgPSByYXdhcmdzWzNdO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1ldGhvZCA9IHJlc29sdmVNZXRob2Qoak1ldGhvZElkLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgY2FsbEFyZ3MgPSBqbmlJbnRlcmNlcHRvci5nZXRDYWxsTWV0aG9kQXJncyhuYW1lLCBbZW52LCBqb2JqZWN0LCBqTWV0aG9kSWQsIGFyZ3NdLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgLy8gVE9ETyB0aGlzIGxvZ2dpbmcgYXBpXG4gICAgICAgICAgICAgICAgLy8gY29uc3QgY24gPSBKYXZhLnZtLnRyeUdldEVudigpLmdldE9iamVjdENsYXNzTmFtZShqb2JqZWN0KTtcbiAgICAgICAgICAgICAgICAvLyBpZiAoY24uaW5jbHVkZXMoJy4nKSkge1xuICAgICAgICAgICAgICAgIC8vICAgICBjb25zdCBzdHIgPSBKYXZhLmNhc3Qoam9iamVjdCwgSmF2YS51c2UoJ2phdmEubGFuZy5PYmplY3QnKSk7XG4gICAgICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUud2FybihzdHJbJ3RvU3RyaW5nJ10oKSk7XG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgIHJldHVybiBmb3JtYXRDYWxsTWV0aG9kKG5hbWUsIGpNZXRob2RJZCwgbWV0aG9kLCBjYWxsQXJncyk7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIG9uTGVhdmU6IGhvb2tJZlRhZygnQ2FsbE1ldGhvZCcsIGZvcm1hdE1ldGhvZFJldHVybiksXG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuZXhwb3J0IHsgaG9va0xpYmFydCBhcyBhdHRhY2ggfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsImltcG9ydCB7IFRleHQgfSBmcm9tICdAY2xvY2t3b3JrL2NvbW1vbic7XG4vKipcbiAqIEFic3RyYWN0cyBhIEphdmEgbWV0aG9kIHJlZmVyZW5jZWQgaW4gbmF0aXZlIGNvZGUuXG4gKi9cbmNsYXNzIEphdmFNZXRob2Qge1xuICAgIGNsYXNzTmFtZTtcbiAgICBuYW1lO1xuICAgIHBhcmFtZXRlcnM7XG4gICAgcmV0dXJuVHlwZTtcbiAgICBpc1N0YXRpYztcbiAgICAjamF2YVBhcmFtcyA9IG51bGw7XG4gICAgI2phdmFSZXQgPSBudWxsO1xuICAgIGNvbnN0cnVjdG9yKGNsYXNzTmFtZSwgbmFtZSwgcGFyYW1ldGVycywgcmV0dXJuVHlwZSwgaXNTdGF0aWMpIHtcbiAgICAgICAgdGhpcy5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycyA9IHBhcmFtZXRlcnM7XG4gICAgICAgIHRoaXMucmV0dXJuVHlwZSA9IHJldHVyblR5cGU7XG4gICAgICAgIHRoaXMuaXNTdGF0aWMgPSBpc1N0YXRpYztcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBKYXZhIHBhcmFtIHR5cGVzIGZvciB0aGUgbWV0aG9kLlxuICAgICAqL1xuICAgIGdldCBqYXZhUGFyYW1zKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jamF2YVBhcmFtcyA/Pz0gdGhpcy5wYXJhbWV0ZXJzLm1hcChUZXh0LnRvUHJldHR5VHlwZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgSmF2YSByZXR1cm4gdHlwZSBvZiB0aGUgbWV0aG9kLlxuICAgICAqL1xuICAgIGdldCBqYXZhUmV0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy4jamF2YVJldCA/Pz0gVGV4dC50b1ByZXR0eVR5cGUodGhpcy5yZXR1cm5UeXBlKTtcbiAgICB9XG59XG5leHBvcnQgeyBKYXZhTWV0aG9kIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1qYXZhTWV0aG9kLmpzLm1hcCIsImNvbnN0IEpOSSA9IHtcbiAgICBOVUxMMDogeyBqbmk6IHsgcmV0OiAnTlVMTCcsIGFyZ3M6IFtdIH0sIHJldFR5cGU6ICd2b2lkJywgYXJnVHlwZXM6IFtdLCBuYW1lOiAnTlVMTDAnLCBvZmZzZXQ6IDAgfSxcbiAgICBOVUxMMTogeyBqbmk6IHsgcmV0OiAnTlVMTCcsIGFyZ3M6IFtdIH0sIHJldFR5cGU6ICd2b2lkJywgYXJnVHlwZXM6IFtdLCBuYW1lOiAnTlVMTDEnLCBvZmZzZXQ6IDEgfSxcbiAgICBOVUxMMjogeyBqbmk6IHsgcmV0OiAnTlVMTCcsIGFyZ3M6IFtdIH0sIHJldFR5cGU6ICd2b2lkJywgYXJnVHlwZXM6IFtdLCBuYW1lOiAnTlVMTDInLCBvZmZzZXQ6IDIgfSxcbiAgICBOVUxMMzogeyBqbmk6IHsgcmV0OiAnTlVMTCcsIGFyZ3M6IFtdIH0sIHJldFR5cGU6ICd2b2lkJywgYXJnVHlwZXM6IFtdLCBuYW1lOiAnTlVMTDMnLCBvZmZzZXQ6IDMgfSxcbiAgICBHZXRWZXJzaW9uOiB7IGpuaTogeyByZXQ6ICdqaW50JywgYXJnczogWydKTklFbnYqJ10gfSwgcmV0VHlwZTogJ2ludDMyJywgYXJnVHlwZXM6IFsncG9pbnRlciddLCBuYW1lOiAnR2V0VmVyc2lvbicsIG9mZnNldDogNCB9LFxuICAgIERlZmluZUNsYXNzOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqY2xhc3MnLCBhcmdzOiBbJ0pOSUVudionLCAnY2hhcionLCAnam9iamVjdCcsICdqYnl0ZSonLCAnanNpemUnXSB9LFxuICAgICAgICByZXRUeXBlOiAncG9pbnRlcicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAnaW50MzInXSxcbiAgICAgICAgbmFtZTogJ0RlZmluZUNsYXNzJyxcbiAgICAgICAgb2Zmc2V0OiA1LFxuICAgIH0sXG4gICAgRmluZENsYXNzOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqY2xhc3MnLCBhcmdzOiBbJ0pOSUVudionLCAnY2hhcionXSB9LFxuICAgICAgICByZXRUeXBlOiAncG9pbnRlcicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnRmluZENsYXNzJyxcbiAgICAgICAgb2Zmc2V0OiA2LFxuICAgIH0sXG4gICAgRnJvbVJlZmxlY3RlZE1ldGhvZDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnam1ldGhvZElEJywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3QnXSB9LFxuICAgICAgICByZXRUeXBlOiAncG9pbnRlcicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnRnJvbVJlZmxlY3RlZE1ldGhvZCcsXG4gICAgICAgIG9mZnNldDogNyxcbiAgICB9LFxuICAgIEZyb21SZWZsZWN0ZWRGaWVsZDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamZpZWxkSUQnLCBhcmdzOiBbJ0pOSUVudionLCAnam9iamVjdCddIH0sXG4gICAgICAgIHJldFR5cGU6ICdwb2ludGVyJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdGcm9tUmVmbGVjdGVkRmllbGQnLFxuICAgICAgICBvZmZzZXQ6IDgsXG4gICAgfSxcbiAgICBUb1JlZmxlY3RlZE1ldGhvZDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnam9iamVjdCcsIGFyZ3M6IFsnSk5JRW52KicsICdqY2xhc3MnLCAnam1ldGhvZElEJywgJ2pib29sZWFuJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3BvaW50ZXInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICd1aW50OCddLFxuICAgICAgICBuYW1lOiAnVG9SZWZsZWN0ZWRNZXRob2QnLFxuICAgICAgICBvZmZzZXQ6IDksXG4gICAgfSxcbiAgICBHZXRTdXBlcmNsYXNzOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqY2xhc3MnLCBhcmdzOiBbJ0pOSUVudionLCAnamNsYXNzJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3BvaW50ZXInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0dldFN1cGVyY2xhc3MnLFxuICAgICAgICBvZmZzZXQ6IDEwLFxuICAgIH0sXG4gICAgSXNBc3NpZ25hYmxlRnJvbToge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamJvb2xlYW4nLCBhcmdzOiBbJ0pOSUVudionLCAnamNsYXNzJywgJ2pjbGFzcyddIH0sXG4gICAgICAgIHJldFR5cGU6ICd1aW50OCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdJc0Fzc2lnbmFibGVGcm9tJyxcbiAgICAgICAgb2Zmc2V0OiAxMSxcbiAgICB9LFxuICAgIFRvUmVmbGVjdGVkRmllbGQ6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pvYmplY3QnLCBhcmdzOiBbJ0pOSUVudionLCAnamNsYXNzJywgJ2pmaWVsZElEJywgJ2pib29sZWFuJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3BvaW50ZXInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICd1aW50OCddLFxuICAgICAgICBuYW1lOiAnVG9SZWZsZWN0ZWRGaWVsZCcsXG4gICAgICAgIG9mZnNldDogMTIsXG4gICAgfSxcbiAgICBUaHJvdzoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamludCcsIGFyZ3M6IFsnSk5JRW52KicsICdqdGhyb3dhYmxlJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ2ludDMyJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdUaHJvdycsXG4gICAgICAgIG9mZnNldDogMTMsXG4gICAgfSxcbiAgICBUaHJvd05ldzoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamludCcsIGFyZ3M6IFsnSk5JRW52KicsICdqY2xhc3MnLCAnY2hhcionXSB9LFxuICAgICAgICByZXRUeXBlOiAnaW50MzInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnVGhyb3dOZXcnLFxuICAgICAgICBvZmZzZXQ6IDE0LFxuICAgIH0sXG4gICAgRXhjZXB0aW9uT2NjdXJyZWQ6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2p0aHJvd2FibGUnLCBhcmdzOiBbJ0pOSUVudionXSB9LFxuICAgICAgICByZXRUeXBlOiAncG9pbnRlcicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0V4Y2VwdGlvbk9jY3VycmVkJyxcbiAgICAgICAgb2Zmc2V0OiAxNSxcbiAgICB9LFxuICAgIEV4Y2VwdGlvbkRlc2NyaWJlOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICd2b2lkJywgYXJnczogWydKTklFbnYqJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3ZvaWQnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdFeGNlcHRpb25EZXNjcmliZScsXG4gICAgICAgIG9mZnNldDogMTYsXG4gICAgfSxcbiAgICBFeGNlcHRpb25DbGVhcjogeyBqbmk6IHsgcmV0OiAndm9pZCcsIGFyZ3M6IFsnSk5JRW52KiddIH0sIHJldFR5cGU6ICd2b2lkJywgYXJnVHlwZXM6IFsncG9pbnRlciddLCBuYW1lOiAnRXhjZXB0aW9uQ2xlYXInLCBvZmZzZXQ6IDE3IH0sXG4gICAgRmF0YWxFcnJvcjoge1xuICAgICAgICBqbmk6IHsgcmV0OiAndm9pZCcsIGFyZ3M6IFsnSk5JRW52KicsICdjaGFyKiddIH0sXG4gICAgICAgIHJldFR5cGU6ICd2b2lkJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdGYXRhbEVycm9yJyxcbiAgICAgICAgb2Zmc2V0OiAxOCxcbiAgICB9LFxuICAgIFB1c2hMb2NhbEZyYW1lOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqaW50JywgYXJnczogWydKTklFbnYqJywgJ2ppbnQnXSB9LFxuICAgICAgICByZXRUeXBlOiAnaW50MzInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ2ludDMyJ10sXG4gICAgICAgIG5hbWU6ICdQdXNoTG9jYWxGcmFtZScsXG4gICAgICAgIG9mZnNldDogMTksXG4gICAgfSxcbiAgICBQb3BMb2NhbEZyYW1lOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqb2JqZWN0JywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3QnXSB9LFxuICAgICAgICByZXRUeXBlOiAncG9pbnRlcicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnUG9wTG9jYWxGcmFtZScsXG4gICAgICAgIG9mZnNldDogMjAsXG4gICAgfSxcbiAgICBOZXdHbG9iYWxSZWY6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pvYmplY3QnLCBhcmdzOiBbJ0pOSUVudionLCAnam9iamVjdCddIH0sXG4gICAgICAgIHJldFR5cGU6ICdwb2ludGVyJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdOZXdHbG9iYWxSZWYnLFxuICAgICAgICBvZmZzZXQ6IDIxLFxuICAgIH0sXG4gICAgRGVsZXRlR2xvYmFsUmVmOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICd2b2lkJywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3QnXSB9LFxuICAgICAgICByZXRUeXBlOiAndm9pZCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnRGVsZXRlR2xvYmFsUmVmJyxcbiAgICAgICAgb2Zmc2V0OiAyMixcbiAgICB9LFxuICAgIERlbGV0ZUxvY2FsUmVmOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICd2b2lkJywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3QnXSB9LFxuICAgICAgICByZXRUeXBlOiAndm9pZCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnRGVsZXRlTG9jYWxSZWYnLFxuICAgICAgICBvZmZzZXQ6IDIzLFxuICAgIH0sXG4gICAgSXNTYW1lT2JqZWN0OiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqYm9vbGVhbicsIGFyZ3M6IFsnSk5JRW52KicsICdqb2JqZWN0JywgJ2pvYmplY3QnXSB9LFxuICAgICAgICByZXRUeXBlOiAndWludDgnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnSXNTYW1lT2JqZWN0JyxcbiAgICAgICAgb2Zmc2V0OiAyNCxcbiAgICB9LFxuICAgIE5ld0xvY2FsUmVmOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqb2JqZWN0JywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3QnXSB9LFxuICAgICAgICByZXRUeXBlOiAncG9pbnRlcicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnTmV3TG9jYWxSZWYnLFxuICAgICAgICBvZmZzZXQ6IDI1LFxuICAgIH0sXG4gICAgRW5zdXJlTG9jYWxDYXBhY2l0eToge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamludCcsIGFyZ3M6IFsnSk5JRW52KicsICdqaW50J10gfSxcbiAgICAgICAgcmV0VHlwZTogJ2ludDMyJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdpbnQzMiddLFxuICAgICAgICBuYW1lOiAnRW5zdXJlTG9jYWxDYXBhY2l0eScsXG4gICAgICAgIG9mZnNldDogMjYsXG4gICAgfSxcbiAgICBBbGxvY09iamVjdDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnam9iamVjdCcsIGFyZ3M6IFsnSk5JRW52KicsICdqY2xhc3MnXSB9LFxuICAgICAgICByZXRUeXBlOiAncG9pbnRlcicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnQWxsb2NPYmplY3QnLFxuICAgICAgICBvZmZzZXQ6IDI3LFxuICAgIH0sXG4gICAgTmV3T2JqZWN0OiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqb2JqZWN0JywgYXJnczogWydKTklFbnYqJywgJ2pjbGFzcycsICdqbWV0aG9kSUQnLCAnLi4uJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3BvaW50ZXInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdOZXdPYmplY3QnLFxuICAgICAgICBvZmZzZXQ6IDI4LFxuICAgIH0sXG4gICAgTmV3T2JqZWN0Vjoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnam9iamVjdCcsIGFyZ3M6IFsnSk5JRW52KicsICdqY2xhc3MnLCAnam1ldGhvZElEJywgJ3ZhX2xpc3QnXSB9LFxuICAgICAgICByZXRUeXBlOiAncG9pbnRlcicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ05ld09iamVjdFYnLFxuICAgICAgICBvZmZzZXQ6IDI5LFxuICAgIH0sXG4gICAgTmV3T2JqZWN0QToge1xuICAgICAgICBqbmk6IHsgcmV0OiAnam9iamVjdCcsIGFyZ3M6IFsnSk5JRW52KicsICdqY2xhc3MnLCAnam1ldGhvZElEJywgJ2p2YWx1ZSonXSB9LFxuICAgICAgICByZXRUeXBlOiAncG9pbnRlcicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ05ld09iamVjdEEnLFxuICAgICAgICBvZmZzZXQ6IDMwLFxuICAgIH0sXG4gICAgR2V0T2JqZWN0Q2xhc3M6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pjbGFzcycsIGFyZ3M6IFsnSk5JRW52KicsICdqb2JqZWN0J10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3BvaW50ZXInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0dldE9iamVjdENsYXNzJyxcbiAgICAgICAgb2Zmc2V0OiAzMSxcbiAgICB9LFxuICAgIElzSW5zdGFuY2VPZjoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamJvb2xlYW4nLCBhcmdzOiBbJ0pOSUVudionLCAnam9iamVjdCcsICdqY2xhc3MnXSB9LFxuICAgICAgICByZXRUeXBlOiAndWludDgnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnSXNJbnN0YW5jZU9mJyxcbiAgICAgICAgb2Zmc2V0OiAzMixcbiAgICB9LFxuICAgIEdldE1ldGhvZElEOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqbWV0aG9kSUQnLCBhcmdzOiBbJ0pOSUVudionLCAnamNsYXNzJywgJ2NoYXIqJywgJ2NoYXIqJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3BvaW50ZXInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdHZXRNZXRob2RJRCcsXG4gICAgICAgIG9mZnNldDogMzMsXG4gICAgfSxcbiAgICBDYWxsT2JqZWN0TWV0aG9kOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqb2JqZWN0JywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3QnLCAnam1ldGhvZElEJywgJy4uLiddIH0sXG4gICAgICAgIHJldFR5cGU6ICdwb2ludGVyJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnQ2FsbE9iamVjdE1ldGhvZCcsXG4gICAgICAgIG9mZnNldDogMzQsXG4gICAgfSxcbiAgICBDYWxsT2JqZWN0TWV0aG9kVjoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnam9iamVjdCcsIGFyZ3M6IFsnSk5JRW52KicsICdqb2JqZWN0JywgJ2ptZXRob2RJRCcsICd2YV9saXN0J10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3BvaW50ZXInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsT2JqZWN0TWV0aG9kVicsXG4gICAgICAgIG9mZnNldDogMzUsXG4gICAgfSxcbiAgICBDYWxsT2JqZWN0TWV0aG9kQToge1xuICAgICAgICBqbmk6IHsgcmV0OiAnam9iamVjdCcsIGFyZ3M6IFsnSk5JRW52KicsICdqb2JqZWN0JywgJ2ptZXRob2RJRCcsICdqdmFsdWUqJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3BvaW50ZXInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsT2JqZWN0TWV0aG9kQScsXG4gICAgICAgIG9mZnNldDogMzYsXG4gICAgfSxcbiAgICBDYWxsQm9vbGVhbk1ldGhvZDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamJvb2xlYW4nLCBhcmdzOiBbJ0pOSUVudionLCAnam9iamVjdCcsICdqbWV0aG9kSUQnLCAnLi4uJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3VpbnQ4JyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnQ2FsbEJvb2xlYW5NZXRob2QnLFxuICAgICAgICBvZmZzZXQ6IDM3LFxuICAgIH0sXG4gICAgQ2FsbEJvb2xlYW5NZXRob2RWOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqYm9vbGVhbicsIGFyZ3M6IFsnSk5JRW52KicsICdqb2JqZWN0JywgJ2ptZXRob2RJRCcsICd2YV9saXN0J10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3VpbnQ4JyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnQ2FsbEJvb2xlYW5NZXRob2RWJyxcbiAgICAgICAgb2Zmc2V0OiAzOCxcbiAgICB9LFxuICAgIENhbGxCb29sZWFuTWV0aG9kQToge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamJvb2xlYW4nLCBhcmdzOiBbJ0pOSUVudionLCAnam9iamVjdCcsICdqbWV0aG9kSUQnLCAnanZhbHVlKiddIH0sXG4gICAgICAgIHJldFR5cGU6ICd1aW50OCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0NhbGxCb29sZWFuTWV0aG9kQScsXG4gICAgICAgIG9mZnNldDogMzksXG4gICAgfSxcbiAgICBDYWxsQnl0ZU1ldGhvZDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamJ5dGUnLCBhcmdzOiBbJ0pOSUVudionLCAnam9iamVjdCcsICdqbWV0aG9kSUQnLCAnLi4uJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ2ludDgnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsQnl0ZU1ldGhvZCcsXG4gICAgICAgIG9mZnNldDogNDAsXG4gICAgfSxcbiAgICBDYWxsQnl0ZU1ldGhvZFY6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pieXRlJywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3QnLCAnam1ldGhvZElEJywgJ3ZhX2xpc3QnXSB9LFxuICAgICAgICByZXRUeXBlOiAnaW50OCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0NhbGxCeXRlTWV0aG9kVicsXG4gICAgICAgIG9mZnNldDogNDEsXG4gICAgfSxcbiAgICBDYWxsQnl0ZU1ldGhvZEE6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pieXRlJywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3QnLCAnam1ldGhvZElEJywgJ2p2YWx1ZSonXSB9LFxuICAgICAgICByZXRUeXBlOiAnaW50OCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0NhbGxCeXRlTWV0aG9kQScsXG4gICAgICAgIG9mZnNldDogNDIsXG4gICAgfSxcbiAgICBDYWxsQ2hhck1ldGhvZDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamNoYXInLCBhcmdzOiBbJ0pOSUVudionLCAnam9iamVjdCcsICdqbWV0aG9kSUQnLCAnLi4uJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3VpbnQxNicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0NhbGxDaGFyTWV0aG9kJyxcbiAgICAgICAgb2Zmc2V0OiA0MyxcbiAgICB9LFxuICAgIENhbGxDaGFyTWV0aG9kVjoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamNoYXInLCBhcmdzOiBbJ0pOSUVudionLCAnam9iamVjdCcsICdqbWV0aG9kSUQnLCAndmFfbGlzdCddIH0sXG4gICAgICAgIHJldFR5cGU6ICd1aW50MTYnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsQ2hhck1ldGhvZFYnLFxuICAgICAgICBvZmZzZXQ6IDQ0LFxuICAgIH0sXG4gICAgQ2FsbENoYXJNZXRob2RBOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqY2hhcicsIGFyZ3M6IFsnSk5JRW52KicsICdqb2JqZWN0JywgJ2ptZXRob2RJRCcsICdqdmFsdWUqJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3VpbnQxNicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0NhbGxDaGFyTWV0aG9kQScsXG4gICAgICAgIG9mZnNldDogNDUsXG4gICAgfSxcbiAgICBDYWxsU2hvcnRNZXRob2Q6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pzaG9ydCcsIGFyZ3M6IFsnSk5JRW52KicsICdqb2JqZWN0JywgJ2ptZXRob2RJRCcsICcuLi4nXSB9LFxuICAgICAgICByZXRUeXBlOiAnaW50MTYnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsU2hvcnRNZXRob2QnLFxuICAgICAgICBvZmZzZXQ6IDQ2LFxuICAgIH0sXG4gICAgQ2FsbFNob3J0TWV0aG9kVjoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnanNob3J0JywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3QnLCAnam1ldGhvZElEJywgJ3ZhX2xpc3QnXSB9LFxuICAgICAgICByZXRUeXBlOiAnaW50MTYnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsU2hvcnRNZXRob2RWJyxcbiAgICAgICAgb2Zmc2V0OiA0NyxcbiAgICB9LFxuICAgIENhbGxTaG9ydE1ldGhvZEE6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pzaG9ydCcsIGFyZ3M6IFsnSk5JRW52KicsICdqb2JqZWN0JywgJ2ptZXRob2RJRCcsICdqdmFsdWUqJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ2ludDE2JyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnQ2FsbFNob3J0TWV0aG9kQScsXG4gICAgICAgIG9mZnNldDogNDgsXG4gICAgfSxcbiAgICBDYWxsSW50TWV0aG9kOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqaW50JywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3QnLCAnam1ldGhvZElEJywgJy4uLiddIH0sXG4gICAgICAgIHJldFR5cGU6ICdpbnQzMicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0NhbGxJbnRNZXRob2QnLFxuICAgICAgICBvZmZzZXQ6IDQ5LFxuICAgIH0sXG4gICAgQ2FsbEludE1ldGhvZFY6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2ppbnQnLCBhcmdzOiBbJ0pOSUVudionLCAnam9iamVjdCcsICdqbWV0aG9kSUQnLCAndmFfbGlzdCddIH0sXG4gICAgICAgIHJldFR5cGU6ICdpbnQzMicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0NhbGxJbnRNZXRob2RWJyxcbiAgICAgICAgb2Zmc2V0OiA1MCxcbiAgICB9LFxuICAgIENhbGxJbnRNZXRob2RBOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqaW50JywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3QnLCAnam1ldGhvZElEJywgJ2p2YWx1ZSonXSB9LFxuICAgICAgICByZXRUeXBlOiAnaW50MzInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsSW50TWV0aG9kQScsXG4gICAgICAgIG9mZnNldDogNTEsXG4gICAgfSxcbiAgICBDYWxsTG9uZ01ldGhvZDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamxvbmcnLCBhcmdzOiBbJ0pOSUVudionLCAnam9iamVjdCcsICdqbWV0aG9kSUQnLCAnLi4uJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ2ludDY0JyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnQ2FsbExvbmdNZXRob2QnLFxuICAgICAgICBvZmZzZXQ6IDUyLFxuICAgIH0sXG4gICAgQ2FsbExvbmdNZXRob2RWOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqbG9uZycsIGFyZ3M6IFsnSk5JRW52KicsICdqb2JqZWN0JywgJ2ptZXRob2RJRCcsICd2YV9saXN0J10gfSxcbiAgICAgICAgcmV0VHlwZTogJ2ludDY0JyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnQ2FsbExvbmdNZXRob2RWJyxcbiAgICAgICAgb2Zmc2V0OiA1MyxcbiAgICB9LFxuICAgIENhbGxMb25nTWV0aG9kQToge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamxvbmcnLCBhcmdzOiBbJ0pOSUVudionLCAnam9iamVjdCcsICdqbWV0aG9kSUQnLCAnanZhbHVlKiddIH0sXG4gICAgICAgIHJldFR5cGU6ICdpbnQ2NCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0NhbGxMb25nTWV0aG9kQScsXG4gICAgICAgIG9mZnNldDogNTQsXG4gICAgfSxcbiAgICBDYWxsRmxvYXRNZXRob2Q6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pmbG9hdCcsIGFyZ3M6IFsnSk5JRW52KicsICdqb2JqZWN0JywgJ2ptZXRob2RJRCcsICcuLi4nXSB9LFxuICAgICAgICByZXRUeXBlOiAnZmxvYXQnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsRmxvYXRNZXRob2QnLFxuICAgICAgICBvZmZzZXQ6IDU1LFxuICAgIH0sXG4gICAgQ2FsbEZsb2F0TWV0aG9kVjoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamZsb2F0JywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3QnLCAnam1ldGhvZElEJywgJ3ZhX2xpc3QnXSB9LFxuICAgICAgICByZXRUeXBlOiAnZmxvYXQnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsRmxvYXRNZXRob2RWJyxcbiAgICAgICAgb2Zmc2V0OiA1NixcbiAgICB9LFxuICAgIENhbGxGbG9hdE1ldGhvZEE6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pmbG9hdCcsIGFyZ3M6IFsnSk5JRW52KicsICdqb2JqZWN0JywgJ2ptZXRob2RJRCcsICdqdmFsdWUqJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ2Zsb2F0JyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnQ2FsbEZsb2F0TWV0aG9kQScsXG4gICAgICAgIG9mZnNldDogNTcsXG4gICAgfSxcbiAgICBDYWxsRG91YmxlTWV0aG9kOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqZG91YmxlJywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3QnLCAnam1ldGhvZElEJywgJy4uLiddIH0sXG4gICAgICAgIHJldFR5cGU6ICdkb3VibGUnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsRG91YmxlTWV0aG9kJyxcbiAgICAgICAgb2Zmc2V0OiA1OCxcbiAgICB9LFxuICAgIENhbGxEb3VibGVNZXRob2RWOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqZG91YmxlJywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3QnLCAnam1ldGhvZElEJywgJ3ZhX2xpc3QnXSB9LFxuICAgICAgICByZXRUeXBlOiAnZG91YmxlJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnQ2FsbERvdWJsZU1ldGhvZFYnLFxuICAgICAgICBvZmZzZXQ6IDU5LFxuICAgIH0sXG4gICAgQ2FsbERvdWJsZU1ldGhvZEE6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pkb3VibGUnLCBhcmdzOiBbJ0pOSUVudionLCAnam9iamVjdCcsICdqbWV0aG9kSUQnLCAnanZhbHVlKiddIH0sXG4gICAgICAgIHJldFR5cGU6ICdkb3VibGUnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsRG91YmxlTWV0aG9kQScsXG4gICAgICAgIG9mZnNldDogNjAsXG4gICAgfSxcbiAgICBDYWxsVm9pZE1ldGhvZDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAndm9pZCcsIGFyZ3M6IFsnSk5JRW52KicsICdqb2JqZWN0JywgJ2ptZXRob2RJRCcsICcuLi4nXSB9LFxuICAgICAgICByZXRUeXBlOiAndm9pZCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0NhbGxWb2lkTWV0aG9kJyxcbiAgICAgICAgb2Zmc2V0OiA2MSxcbiAgICB9LFxuICAgIENhbGxWb2lkTWV0aG9kVjoge1xuICAgICAgICBqbmk6IHsgcmV0OiAndm9pZCcsIGFyZ3M6IFsnSk5JRW52KicsICdqb2JqZWN0JywgJ2ptZXRob2RJRCcsICd2YV9saXN0J10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3ZvaWQnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsVm9pZE1ldGhvZFYnLFxuICAgICAgICBvZmZzZXQ6IDYyLFxuICAgIH0sXG4gICAgQ2FsbFZvaWRNZXRob2RBOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICd2b2lkJywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3QnLCAnam1ldGhvZElEJywgJ2p2YWx1ZSonXSB9LFxuICAgICAgICByZXRUeXBlOiAndm9pZCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0NhbGxWb2lkTWV0aG9kQScsXG4gICAgICAgIG9mZnNldDogNjMsXG4gICAgfSxcbiAgICBDYWxsTm9udmlydHVhbE9iamVjdE1ldGhvZDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnam9iamVjdCcsIGFyZ3M6IFsnSk5JRW52KicsICdqb2JqZWN0JywgJ2pjbGFzcycsICdqbWV0aG9kSUQnLCAnLi4uJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3BvaW50ZXInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0NhbGxOb252aXJ0dWFsT2JqZWN0TWV0aG9kJyxcbiAgICAgICAgb2Zmc2V0OiA2NCxcbiAgICB9LFxuICAgIENhbGxOb252aXJ0dWFsT2JqZWN0TWV0aG9kVjoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnam9iamVjdCcsIGFyZ3M6IFsnSk5JRW52KicsICdqb2JqZWN0JywgJ2pjbGFzcycsICdqbWV0aG9kSUQnLCAndmFfbGlzdCddIH0sXG4gICAgICAgIHJldFR5cGU6ICdwb2ludGVyJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsTm9udmlydHVhbE9iamVjdE1ldGhvZFYnLFxuICAgICAgICBvZmZzZXQ6IDY1LFxuICAgIH0sXG4gICAgQ2FsbE5vbnZpcnR1YWxPYmplY3RNZXRob2RBOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqb2JqZWN0JywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3QnLCAnamNsYXNzJywgJ2ptZXRob2RJRCcsICdqdmFsdWUqJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3BvaW50ZXInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0NhbGxOb252aXJ0dWFsT2JqZWN0TWV0aG9kQScsXG4gICAgICAgIG9mZnNldDogNjYsXG4gICAgfSxcbiAgICBDYWxsTm9udmlydHVhbEJvb2xlYW5NZXRob2Q6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pib29sZWFuJywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3QnLCAnamNsYXNzJywgJ2ptZXRob2RJRCcsICcuLi4nXSB9LFxuICAgICAgICByZXRUeXBlOiAndWludDgnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0NhbGxOb252aXJ0dWFsQm9vbGVhbk1ldGhvZCcsXG4gICAgICAgIG9mZnNldDogNjcsXG4gICAgfSxcbiAgICBDYWxsTm9udmlydHVhbEJvb2xlYW5NZXRob2RWOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqYm9vbGVhbicsIGFyZ3M6IFsnSk5JRW52KicsICdqb2JqZWN0JywgJ2pjbGFzcycsICdqbWV0aG9kSUQnLCAndmFfbGlzdCddIH0sXG4gICAgICAgIHJldFR5cGU6ICd1aW50OCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnQ2FsbE5vbnZpcnR1YWxCb29sZWFuTWV0aG9kVicsXG4gICAgICAgIG9mZnNldDogNjgsXG4gICAgfSxcbiAgICBDYWxsTm9udmlydHVhbEJvb2xlYW5NZXRob2RBOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqYm9vbGVhbicsIGFyZ3M6IFsnSk5JRW52KicsICdqb2JqZWN0JywgJ2pjbGFzcycsICdqbWV0aG9kSUQnLCAnanZhbHVlKiddIH0sXG4gICAgICAgIHJldFR5cGU6ICd1aW50OCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnQ2FsbE5vbnZpcnR1YWxCb29sZWFuTWV0aG9kQScsXG4gICAgICAgIG9mZnNldDogNjksXG4gICAgfSxcbiAgICBDYWxsTm9udmlydHVhbEJ5dGVNZXRob2Q6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pieXRlJywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3QnLCAnamNsYXNzJywgJ2ptZXRob2RJRCcsICcuLi4nXSB9LFxuICAgICAgICByZXRUeXBlOiAnaW50OCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnQ2FsbE5vbnZpcnR1YWxCeXRlTWV0aG9kJyxcbiAgICAgICAgb2Zmc2V0OiA3MCxcbiAgICB9LFxuICAgIENhbGxOb252aXJ0dWFsQnl0ZU1ldGhvZFY6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pieXRlJywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3QnLCAnamNsYXNzJywgJ2ptZXRob2RJRCcsICd2YV9saXN0J10gfSxcbiAgICAgICAgcmV0VHlwZTogJ2ludDgnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0NhbGxOb252aXJ0dWFsQnl0ZU1ldGhvZFYnLFxuICAgICAgICBvZmZzZXQ6IDcxLFxuICAgIH0sXG4gICAgQ2FsbE5vbnZpcnR1YWxCeXRlTWV0aG9kQToge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamJ5dGUnLCBhcmdzOiBbJ0pOSUVudionLCAnam9iamVjdCcsICdqY2xhc3MnLCAnam1ldGhvZElEJywgJ2p2YWx1ZSonXSB9LFxuICAgICAgICByZXRUeXBlOiAnaW50OCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnQ2FsbE5vbnZpcnR1YWxCeXRlTWV0aG9kQScsXG4gICAgICAgIG9mZnNldDogNzIsXG4gICAgfSxcbiAgICBDYWxsTm9udmlydHVhbENoYXJNZXRob2Q6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pjaGFyJywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3QnLCAnamNsYXNzJywgJ2ptZXRob2RJRCcsICcuLi4nXSB9LFxuICAgICAgICByZXRUeXBlOiAndWludDE2JyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsTm9udmlydHVhbENoYXJNZXRob2QnLFxuICAgICAgICBvZmZzZXQ6IDczLFxuICAgIH0sXG4gICAgQ2FsbE5vbnZpcnR1YWxDaGFyTWV0aG9kVjoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamNoYXInLCBhcmdzOiBbJ0pOSUVudionLCAnam9iamVjdCcsICdqY2xhc3MnLCAnam1ldGhvZElEJywgJ3ZhX2xpc3QnXSB9LFxuICAgICAgICByZXRUeXBlOiAndWludDE2JyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsTm9udmlydHVhbENoYXJNZXRob2RWJyxcbiAgICAgICAgb2Zmc2V0OiA3NCxcbiAgICB9LFxuICAgIENhbGxOb252aXJ0dWFsQ2hhck1ldGhvZEE6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pjaGFyJywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3QnLCAnamNsYXNzJywgJ2ptZXRob2RJRCcsICdqdmFsdWUqJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3VpbnQxNicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnQ2FsbE5vbnZpcnR1YWxDaGFyTWV0aG9kQScsXG4gICAgICAgIG9mZnNldDogNzUsXG4gICAgfSxcbiAgICBDYWxsTm9udmlydHVhbFNob3J0TWV0aG9kOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqc2hvcnQnLCBhcmdzOiBbJ0pOSUVudionLCAnam9iamVjdCcsICdqY2xhc3MnLCAnam1ldGhvZElEJywgJy4uLiddIH0sXG4gICAgICAgIHJldFR5cGU6ICdpbnQxNicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnQ2FsbE5vbnZpcnR1YWxTaG9ydE1ldGhvZCcsXG4gICAgICAgIG9mZnNldDogNzYsXG4gICAgfSxcbiAgICBDYWxsTm9udmlydHVhbFNob3J0TWV0aG9kVjoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnanNob3J0JywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3QnLCAnamNsYXNzJywgJ2ptZXRob2RJRCcsICd2YV9saXN0J10gfSxcbiAgICAgICAgcmV0VHlwZTogJ2ludDE2JyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsTm9udmlydHVhbFNob3J0TWV0aG9kVicsXG4gICAgICAgIG9mZnNldDogNzcsXG4gICAgfSxcbiAgICBDYWxsTm9udmlydHVhbFNob3J0TWV0aG9kQToge1xuICAgICAgICBqbmk6IHsgcmV0OiAnanNob3J0JywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3QnLCAnamNsYXNzJywgJ2ptZXRob2RJRCcsICdqdmFsdWUqJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ2ludDE2JyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsTm9udmlydHVhbFNob3J0TWV0aG9kQScsXG4gICAgICAgIG9mZnNldDogNzgsXG4gICAgfSxcbiAgICBDYWxsTm9udmlydHVhbEludE1ldGhvZDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamludCcsIGFyZ3M6IFsnSk5JRW52KicsICdqb2JqZWN0JywgJ2pjbGFzcycsICdqbWV0aG9kSUQnLCAnLi4uJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ2ludDMyJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsTm9udmlydHVhbEludE1ldGhvZCcsXG4gICAgICAgIG9mZnNldDogNzksXG4gICAgfSxcbiAgICBDYWxsTm9udmlydHVhbEludE1ldGhvZFY6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2ppbnQnLCBhcmdzOiBbJ0pOSUVudionLCAnam9iamVjdCcsICdqY2xhc3MnLCAnam1ldGhvZElEJywgJ3ZhX2xpc3QnXSB9LFxuICAgICAgICByZXRUeXBlOiAnaW50MzInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0NhbGxOb252aXJ0dWFsSW50TWV0aG9kVicsXG4gICAgICAgIG9mZnNldDogODAsXG4gICAgfSxcbiAgICBDYWxsTm9udmlydHVhbEludE1ldGhvZEE6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2ppbnQnLCBhcmdzOiBbJ0pOSUVudionLCAnam9iamVjdCcsICdqY2xhc3MnLCAnam1ldGhvZElEJywgJ2p2YWx1ZSonXSB9LFxuICAgICAgICByZXRUeXBlOiAnaW50MzInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0NhbGxOb252aXJ0dWFsSW50TWV0aG9kQScsXG4gICAgICAgIG9mZnNldDogODEsXG4gICAgfSxcbiAgICBDYWxsTm9udmlydHVhbExvbmdNZXRob2Q6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2psb25nJywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3QnLCAnamNsYXNzJywgJ2ptZXRob2RJRCcsICcuLi4nXSB9LFxuICAgICAgICByZXRUeXBlOiAnaW50NjQnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0NhbGxOb252aXJ0dWFsTG9uZ01ldGhvZCcsXG4gICAgICAgIG9mZnNldDogODIsXG4gICAgfSxcbiAgICBDYWxsTm9udmlydHVhbExvbmdNZXRob2RWOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqbG9uZycsIGFyZ3M6IFsnSk5JRW52KicsICdqb2JqZWN0JywgJ2pjbGFzcycsICdqbWV0aG9kSUQnLCAndmFfbGlzdCddIH0sXG4gICAgICAgIHJldFR5cGU6ICdpbnQ2NCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnQ2FsbE5vbnZpcnR1YWxMb25nTWV0aG9kVicsXG4gICAgICAgIG9mZnNldDogODMsXG4gICAgfSxcbiAgICBDYWxsTm9udmlydHVhbExvbmdNZXRob2RBOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqbG9uZycsIGFyZ3M6IFsnSk5JRW52KicsICdqb2JqZWN0JywgJ2pjbGFzcycsICdqbWV0aG9kSUQnLCAnanZhbHVlKiddIH0sXG4gICAgICAgIHJldFR5cGU6ICdpbnQ2NCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnQ2FsbE5vbnZpcnR1YWxMb25nTWV0aG9kQScsXG4gICAgICAgIG9mZnNldDogODQsXG4gICAgfSxcbiAgICBDYWxsTm9udmlydHVhbEZsb2F0TWV0aG9kOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqZmxvYXQnLCBhcmdzOiBbJ0pOSUVudionLCAnam9iamVjdCcsICdqY2xhc3MnLCAnam1ldGhvZElEJywgJy4uLiddIH0sXG4gICAgICAgIHJldFR5cGU6ICdmbG9hdCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnQ2FsbE5vbnZpcnR1YWxGbG9hdE1ldGhvZCcsXG4gICAgICAgIG9mZnNldDogODUsXG4gICAgfSxcbiAgICBDYWxsTm9udmlydHVhbEZsb2F0TWV0aG9kVjoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamZsb2F0JywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3QnLCAnamNsYXNzJywgJ2ptZXRob2RJRCcsICd2YV9saXN0J10gfSxcbiAgICAgICAgcmV0VHlwZTogJ2Zsb2F0JyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsTm9udmlydHVhbEZsb2F0TWV0aG9kVicsXG4gICAgICAgIG9mZnNldDogODYsXG4gICAgfSxcbiAgICBDYWxsTm9udmlydHVhbEZsb2F0TWV0aG9kQToge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamZsb2F0JywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3QnLCAnamNsYXNzJywgJ2ptZXRob2RJRCcsICdqdmFsdWUqJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ2Zsb2F0JyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsTm9udmlydHVhbEZsb2F0TWV0aG9kQScsXG4gICAgICAgIG9mZnNldDogODcsXG4gICAgfSxcbiAgICBDYWxsTm9udmlydHVhbERvdWJsZU1ldGhvZDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamRvdWJsZScsIGFyZ3M6IFsnSk5JRW52KicsICdqb2JqZWN0JywgJ2pjbGFzcycsICdqbWV0aG9kSUQnLCAnLi4uJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ2RvdWJsZScsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnQ2FsbE5vbnZpcnR1YWxEb3VibGVNZXRob2QnLFxuICAgICAgICBvZmZzZXQ6IDg4LFxuICAgIH0sXG4gICAgQ2FsbE5vbnZpcnR1YWxEb3VibGVNZXRob2RWOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqZG91YmxlJywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3QnLCAnamNsYXNzJywgJ2ptZXRob2RJRCcsICd2YV9saXN0J10gfSxcbiAgICAgICAgcmV0VHlwZTogJ2RvdWJsZScsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnQ2FsbE5vbnZpcnR1YWxEb3VibGVNZXRob2RWJyxcbiAgICAgICAgb2Zmc2V0OiA4OSxcbiAgICB9LFxuICAgIENhbGxOb252aXJ0dWFsRG91YmxlTWV0aG9kQToge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamRvdWJsZScsIGFyZ3M6IFsnSk5JRW52KicsICdqb2JqZWN0JywgJ2pjbGFzcycsICdqbWV0aG9kSUQnLCAnanZhbHVlKiddIH0sXG4gICAgICAgIHJldFR5cGU6ICdkb3VibGUnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0NhbGxOb252aXJ0dWFsRG91YmxlTWV0aG9kQScsXG4gICAgICAgIG9mZnNldDogOTAsXG4gICAgfSxcbiAgICBDYWxsTm9udmlydHVhbFZvaWRNZXRob2Q6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ3ZvaWQnLCBhcmdzOiBbJ0pOSUVudionLCAnam9iamVjdCcsICdqY2xhc3MnLCAnam1ldGhvZElEJywgJy4uLiddIH0sXG4gICAgICAgIHJldFR5cGU6ICd2b2lkJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsTm9udmlydHVhbFZvaWRNZXRob2QnLFxuICAgICAgICBvZmZzZXQ6IDkxLFxuICAgIH0sXG4gICAgQ2FsbE5vbnZpcnR1YWxWb2lkTWV0aG9kVjoge1xuICAgICAgICBqbmk6IHsgcmV0OiAndm9pZCcsIGFyZ3M6IFsnSk5JRW52KicsICdqb2JqZWN0JywgJ2pjbGFzcycsICdqbWV0aG9kSUQnLCAndmFfbGlzdCddIH0sXG4gICAgICAgIHJldFR5cGU6ICd2b2lkJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsTm9udmlydHVhbFZvaWRNZXRob2RWJyxcbiAgICAgICAgb2Zmc2V0OiA5MixcbiAgICB9LFxuICAgIENhbGxOb252aXJ0dWFsVm9pZE1ldGhvZEE6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ3ZvaWQnLCBhcmdzOiBbJ0pOSUVudionLCAnam9iamVjdCcsICdqY2xhc3MnLCAnam1ldGhvZElEJywgJ2p2YWx1ZSonXSB9LFxuICAgICAgICByZXRUeXBlOiAndm9pZCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnQ2FsbE5vbnZpcnR1YWxWb2lkTWV0aG9kQScsXG4gICAgICAgIG9mZnNldDogOTMsXG4gICAgfSxcbiAgICBHZXRGaWVsZElEOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqZmllbGRJRCcsIGFyZ3M6IFsnSk5JRW52KicsICdqY2xhc3MnLCAnY2hhcionLCAnY2hhcionXSB9LFxuICAgICAgICByZXRUeXBlOiAncG9pbnRlcicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0dldEZpZWxkSUQnLFxuICAgICAgICBvZmZzZXQ6IDk0LFxuICAgIH0sXG4gICAgR2V0T2JqZWN0RmllbGQ6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pvYmplY3QnLCBhcmdzOiBbJ0pOSUVudionLCAnam9iamVjdCcsICdqZmllbGRJRCddIH0sXG4gICAgICAgIHJldFR5cGU6ICdwb2ludGVyJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0dldE9iamVjdEZpZWxkJyxcbiAgICAgICAgb2Zmc2V0OiA5NSxcbiAgICB9LFxuICAgIEdldEJvb2xlYW5GaWVsZDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamJvb2xlYW4nLCBhcmdzOiBbJ0pOSUVudionLCAnam9iamVjdCcsICdqZmllbGRJRCddIH0sXG4gICAgICAgIHJldFR5cGU6ICd1aW50OCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdHZXRCb29sZWFuRmllbGQnLFxuICAgICAgICBvZmZzZXQ6IDk2LFxuICAgIH0sXG4gICAgR2V0Qnl0ZUZpZWxkOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqYnl0ZScsIGFyZ3M6IFsnSk5JRW52KicsICdqb2JqZWN0JywgJ2pmaWVsZElEJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ2ludDgnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnR2V0Qnl0ZUZpZWxkJyxcbiAgICAgICAgb2Zmc2V0OiA5NyxcbiAgICB9LFxuICAgIEdldENoYXJGaWVsZDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamNoYXInLCBhcmdzOiBbJ0pOSUVudionLCAnam9iamVjdCcsICdqZmllbGRJRCddIH0sXG4gICAgICAgIHJldFR5cGU6ICd1aW50MTYnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnR2V0Q2hhckZpZWxkJyxcbiAgICAgICAgb2Zmc2V0OiA5OCxcbiAgICB9LFxuICAgIEdldFNob3J0RmllbGQ6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pzaG9ydCcsIGFyZ3M6IFsnSk5JRW52KicsICdqb2JqZWN0JywgJ2pmaWVsZElEJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ2ludDE2JyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0dldFNob3J0RmllbGQnLFxuICAgICAgICBvZmZzZXQ6IDk5LFxuICAgIH0sXG4gICAgR2V0SW50RmllbGQ6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2ppbnQnLCBhcmdzOiBbJ0pOSUVudionLCAnam9iamVjdCcsICdqZmllbGRJRCddIH0sXG4gICAgICAgIHJldFR5cGU6ICdpbnQzMicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdHZXRJbnRGaWVsZCcsXG4gICAgICAgIG9mZnNldDogMTAwLFxuICAgIH0sXG4gICAgR2V0TG9uZ0ZpZWxkOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqbG9uZycsIGFyZ3M6IFsnSk5JRW52KicsICdqb2JqZWN0JywgJ2pmaWVsZElEJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ2ludDY0JyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0dldExvbmdGaWVsZCcsXG4gICAgICAgIG9mZnNldDogMTAxLFxuICAgIH0sXG4gICAgR2V0RmxvYXRGaWVsZDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamZsb2F0JywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3QnLCAnamZpZWxkSUQnXSB9LFxuICAgICAgICByZXRUeXBlOiAnZmxvYXQnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnR2V0RmxvYXRGaWVsZCcsXG4gICAgICAgIG9mZnNldDogMTAyLFxuICAgIH0sXG4gICAgR2V0RG91YmxlRmllbGQ6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pkb3VibGUnLCBhcmdzOiBbJ0pOSUVudionLCAnam9iamVjdCcsICdqZmllbGRJRCddIH0sXG4gICAgICAgIHJldFR5cGU6ICdkb3VibGUnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnR2V0RG91YmxlRmllbGQnLFxuICAgICAgICBvZmZzZXQ6IDEwMyxcbiAgICB9LFxuICAgIFNldE9iamVjdEZpZWxkOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICd2b2lkJywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3QnLCAnamZpZWxkSUQnLCAnam9iamVjdCddIH0sXG4gICAgICAgIHJldFR5cGU6ICd2b2lkJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnU2V0T2JqZWN0RmllbGQnLFxuICAgICAgICBvZmZzZXQ6IDEwNCxcbiAgICB9LFxuICAgIFNldEJvb2xlYW5GaWVsZDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAndm9pZCcsIGFyZ3M6IFsnSk5JRW52KicsICdqb2JqZWN0JywgJ2pmaWVsZElEJywgJ2pib29sZWFuJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3ZvaWQnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICd1aW50OCddLFxuICAgICAgICBuYW1lOiAnU2V0Qm9vbGVhbkZpZWxkJyxcbiAgICAgICAgb2Zmc2V0OiAxMDUsXG4gICAgfSxcbiAgICBTZXRCeXRlRmllbGQ6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ3ZvaWQnLCBhcmdzOiBbJ0pOSUVudionLCAnam9iamVjdCcsICdqZmllbGRJRCcsICdqYnl0ZSddIH0sXG4gICAgICAgIHJldFR5cGU6ICd2b2lkJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAnaW50OCddLFxuICAgICAgICBuYW1lOiAnU2V0Qnl0ZUZpZWxkJyxcbiAgICAgICAgb2Zmc2V0OiAxMDYsXG4gICAgfSxcbiAgICBTZXRDaGFyRmllbGQ6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ3ZvaWQnLCBhcmdzOiBbJ0pOSUVudionLCAnam9iamVjdCcsICdqZmllbGRJRCcsICdqY2hhciddIH0sXG4gICAgICAgIHJldFR5cGU6ICd2b2lkJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAndWludDE2J10sXG4gICAgICAgIG5hbWU6ICdTZXRDaGFyRmllbGQnLFxuICAgICAgICBvZmZzZXQ6IDEwNyxcbiAgICB9LFxuICAgIFNldFNob3J0RmllbGQ6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ3ZvaWQnLCBhcmdzOiBbJ0pOSUVudionLCAnam9iamVjdCcsICdqZmllbGRJRCcsICdqc2hvcnQnXSB9LFxuICAgICAgICByZXRUeXBlOiAndm9pZCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ2ludDE2J10sXG4gICAgICAgIG5hbWU6ICdTZXRTaG9ydEZpZWxkJyxcbiAgICAgICAgb2Zmc2V0OiAxMDgsXG4gICAgfSxcbiAgICBTZXRJbnRGaWVsZDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAndm9pZCcsIGFyZ3M6IFsnSk5JRW52KicsICdqb2JqZWN0JywgJ2pmaWVsZElEJywgJ2ppbnQnXSB9LFxuICAgICAgICByZXRUeXBlOiAndm9pZCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ2ludDMyJ10sXG4gICAgICAgIG5hbWU6ICdTZXRJbnRGaWVsZCcsXG4gICAgICAgIG9mZnNldDogMTA5LFxuICAgIH0sXG4gICAgU2V0TG9uZ0ZpZWxkOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICd2b2lkJywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3QnLCAnamZpZWxkSUQnLCAnamxvbmcnXSB9LFxuICAgICAgICByZXRUeXBlOiAndm9pZCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ2ludDY0J10sXG4gICAgICAgIG5hbWU6ICdTZXRMb25nRmllbGQnLFxuICAgICAgICBvZmZzZXQ6IDExMCxcbiAgICB9LFxuICAgIFNldEZsb2F0RmllbGQ6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ3ZvaWQnLCBhcmdzOiBbJ0pOSUVudionLCAnam9iamVjdCcsICdqZmllbGRJRCcsICdqZmxvYXQnXSB9LFxuICAgICAgICByZXRUeXBlOiAndm9pZCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ2Zsb2F0J10sXG4gICAgICAgIG5hbWU6ICdTZXRGbG9hdEZpZWxkJyxcbiAgICAgICAgb2Zmc2V0OiAxMTEsXG4gICAgfSxcbiAgICBTZXREb3VibGVGaWVsZDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAndm9pZCcsIGFyZ3M6IFsnSk5JRW52KicsICdqb2JqZWN0JywgJ2pmaWVsZElEJywgJ2pkb3VibGUnXSB9LFxuICAgICAgICByZXRUeXBlOiAndm9pZCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ2RvdWJsZSddLFxuICAgICAgICBuYW1lOiAnU2V0RG91YmxlRmllbGQnLFxuICAgICAgICBvZmZzZXQ6IDExMixcbiAgICB9LFxuICAgIEdldFN0YXRpY01ldGhvZElEOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqbWV0aG9kSUQnLCBhcmdzOiBbJ0pOSUVudionLCAnamNsYXNzJywgJ2NoYXIqJywgJ2NoYXIqJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3BvaW50ZXInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdHZXRTdGF0aWNNZXRob2RJRCcsXG4gICAgICAgIG9mZnNldDogMTEzLFxuICAgIH0sXG4gICAgQ2FsbFN0YXRpY09iamVjdE1ldGhvZDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnam9iamVjdCcsIGFyZ3M6IFsnSk5JRW52KicsICdqY2xhc3MnLCAnam1ldGhvZElEJywgJy4uLiddIH0sXG4gICAgICAgIHJldFR5cGU6ICdwb2ludGVyJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnQ2FsbFN0YXRpY09iamVjdE1ldGhvZCcsXG4gICAgICAgIG9mZnNldDogMTE0LFxuICAgIH0sXG4gICAgQ2FsbFN0YXRpY09iamVjdE1ldGhvZFY6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pvYmplY3QnLCBhcmdzOiBbJ0pOSUVudionLCAnamNsYXNzJywgJ2ptZXRob2RJRCcsICd2YV9saXN0J10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3BvaW50ZXInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsU3RhdGljT2JqZWN0TWV0aG9kVicsXG4gICAgICAgIG9mZnNldDogMTE1LFxuICAgIH0sXG4gICAgQ2FsbFN0YXRpY09iamVjdE1ldGhvZEE6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pvYmplY3QnLCBhcmdzOiBbJ0pOSUVudionLCAnamNsYXNzJywgJ2ptZXRob2RJRCcsICdqdmFsdWUqJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3BvaW50ZXInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsU3RhdGljT2JqZWN0TWV0aG9kQScsXG4gICAgICAgIG9mZnNldDogMTE2LFxuICAgIH0sXG4gICAgQ2FsbFN0YXRpY0Jvb2xlYW5NZXRob2Q6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pib29sZWFuJywgYXJnczogWydKTklFbnYqJywgJ2pjbGFzcycsICdqbWV0aG9kSUQnLCAnLi4uJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3VpbnQ4JyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnQ2FsbFN0YXRpY0Jvb2xlYW5NZXRob2QnLFxuICAgICAgICBvZmZzZXQ6IDExNyxcbiAgICB9LFxuICAgIENhbGxTdGF0aWNCb29sZWFuTWV0aG9kVjoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamJvb2xlYW4nLCBhcmdzOiBbJ0pOSUVudionLCAnamNsYXNzJywgJ2ptZXRob2RJRCcsICd2YV9saXN0J10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3VpbnQ4JyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnQ2FsbFN0YXRpY0Jvb2xlYW5NZXRob2RWJyxcbiAgICAgICAgb2Zmc2V0OiAxMTgsXG4gICAgfSxcbiAgICBDYWxsU3RhdGljQm9vbGVhbk1ldGhvZEE6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pib29sZWFuJywgYXJnczogWydKTklFbnYqJywgJ2pjbGFzcycsICdqbWV0aG9kSUQnLCAnanZhbHVlKiddIH0sXG4gICAgICAgIHJldFR5cGU6ICd1aW50OCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0NhbGxTdGF0aWNCb29sZWFuTWV0aG9kQScsXG4gICAgICAgIG9mZnNldDogMTE5LFxuICAgIH0sXG4gICAgQ2FsbFN0YXRpY0J5dGVNZXRob2Q6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pieXRlJywgYXJnczogWydKTklFbnYqJywgJ2pjbGFzcycsICdqbWV0aG9kSUQnLCAnLi4uJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ2ludDgnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsU3RhdGljQnl0ZU1ldGhvZCcsXG4gICAgICAgIG9mZnNldDogMTIwLFxuICAgIH0sXG4gICAgQ2FsbFN0YXRpY0J5dGVNZXRob2RWOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqYnl0ZScsIGFyZ3M6IFsnSk5JRW52KicsICdqY2xhc3MnLCAnam1ldGhvZElEJywgJ3ZhX2xpc3QnXSB9LFxuICAgICAgICByZXRUeXBlOiAnaW50OCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0NhbGxTdGF0aWNCeXRlTWV0aG9kVicsXG4gICAgICAgIG9mZnNldDogMTIxLFxuICAgIH0sXG4gICAgQ2FsbFN0YXRpY0J5dGVNZXRob2RBOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqYnl0ZScsIGFyZ3M6IFsnSk5JRW52KicsICdqY2xhc3MnLCAnam1ldGhvZElEJywgJ2p2YWx1ZSonXSB9LFxuICAgICAgICByZXRUeXBlOiAnaW50OCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0NhbGxTdGF0aWNCeXRlTWV0aG9kQScsXG4gICAgICAgIG9mZnNldDogMTIyLFxuICAgIH0sXG4gICAgQ2FsbFN0YXRpY0NoYXJNZXRob2Q6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pjaGFyJywgYXJnczogWydKTklFbnYqJywgJ2pjbGFzcycsICdqbWV0aG9kSUQnLCAnLi4uJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3VpbnQxNicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0NhbGxTdGF0aWNDaGFyTWV0aG9kJyxcbiAgICAgICAgb2Zmc2V0OiAxMjMsXG4gICAgfSxcbiAgICBDYWxsU3RhdGljQ2hhck1ldGhvZFY6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pjaGFyJywgYXJnczogWydKTklFbnYqJywgJ2pjbGFzcycsICdqbWV0aG9kSUQnLCAndmFfbGlzdCddIH0sXG4gICAgICAgIHJldFR5cGU6ICd1aW50MTYnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsU3RhdGljQ2hhck1ldGhvZFYnLFxuICAgICAgICBvZmZzZXQ6IDEyNCxcbiAgICB9LFxuICAgIENhbGxTdGF0aWNDaGFyTWV0aG9kQToge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamNoYXInLCBhcmdzOiBbJ0pOSUVudionLCAnamNsYXNzJywgJ2ptZXRob2RJRCcsICdqdmFsdWUqJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3VpbnQxNicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0NhbGxTdGF0aWNDaGFyTWV0aG9kQScsXG4gICAgICAgIG9mZnNldDogMTI1LFxuICAgIH0sXG4gICAgQ2FsbFN0YXRpY1Nob3J0TWV0aG9kOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqc2hvcnQnLCBhcmdzOiBbJ0pOSUVudionLCAnamNsYXNzJywgJ2ptZXRob2RJRCcsICcuLi4nXSB9LFxuICAgICAgICByZXRUeXBlOiAnaW50MTYnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsU3RhdGljU2hvcnRNZXRob2QnLFxuICAgICAgICBvZmZzZXQ6IDEyNixcbiAgICB9LFxuICAgIENhbGxTdGF0aWNTaG9ydE1ldGhvZFY6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pzaG9ydCcsIGFyZ3M6IFsnSk5JRW52KicsICdqY2xhc3MnLCAnam1ldGhvZElEJywgJ3ZhX2xpc3QnXSB9LFxuICAgICAgICByZXRUeXBlOiAnaW50MTYnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsU3RhdGljU2hvcnRNZXRob2RWJyxcbiAgICAgICAgb2Zmc2V0OiAxMjcsXG4gICAgfSxcbiAgICBDYWxsU3RhdGljU2hvcnRNZXRob2RBOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqc2hvcnQnLCBhcmdzOiBbJ0pOSUVudionLCAnamNsYXNzJywgJ2ptZXRob2RJRCcsICdqdmFsdWUqJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ2ludDE2JyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnQ2FsbFN0YXRpY1Nob3J0TWV0aG9kQScsXG4gICAgICAgIG9mZnNldDogMTI4LFxuICAgIH0sXG4gICAgQ2FsbFN0YXRpY0ludE1ldGhvZDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamludCcsIGFyZ3M6IFsnSk5JRW52KicsICdqY2xhc3MnLCAnam1ldGhvZElEJywgJy4uLiddIH0sXG4gICAgICAgIHJldFR5cGU6ICdpbnQzMicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0NhbGxTdGF0aWNJbnRNZXRob2QnLFxuICAgICAgICBvZmZzZXQ6IDEyOSxcbiAgICB9LFxuICAgIENhbGxTdGF0aWNJbnRNZXRob2RWOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqaW50JywgYXJnczogWydKTklFbnYqJywgJ2pjbGFzcycsICdqbWV0aG9kSUQnLCAndmFfbGlzdCddIH0sXG4gICAgICAgIHJldFR5cGU6ICdpbnQzMicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0NhbGxTdGF0aWNJbnRNZXRob2RWJyxcbiAgICAgICAgb2Zmc2V0OiAxMzAsXG4gICAgfSxcbiAgICBDYWxsU3RhdGljSW50TWV0aG9kQToge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamludCcsIGFyZ3M6IFsnSk5JRW52KicsICdqY2xhc3MnLCAnam1ldGhvZElEJywgJ2p2YWx1ZSonXSB9LFxuICAgICAgICByZXRUeXBlOiAnaW50MzInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsU3RhdGljSW50TWV0aG9kQScsXG4gICAgICAgIG9mZnNldDogMTMxLFxuICAgIH0sXG4gICAgQ2FsbFN0YXRpY0xvbmdNZXRob2Q6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2psb25nJywgYXJnczogWydKTklFbnYqJywgJ2pjbGFzcycsICdqbWV0aG9kSUQnLCAnLi4uJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ2ludDY0JyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnQ2FsbFN0YXRpY0xvbmdNZXRob2QnLFxuICAgICAgICBvZmZzZXQ6IDEzMixcbiAgICB9LFxuICAgIENhbGxTdGF0aWNMb25nTWV0aG9kVjoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamxvbmcnLCBhcmdzOiBbJ0pOSUVudionLCAnamNsYXNzJywgJ2ptZXRob2RJRCcsICd2YV9saXN0J10gfSxcbiAgICAgICAgcmV0VHlwZTogJ2ludDY0JyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnQ2FsbFN0YXRpY0xvbmdNZXRob2RWJyxcbiAgICAgICAgb2Zmc2V0OiAxMzMsXG4gICAgfSxcbiAgICBDYWxsU3RhdGljTG9uZ01ldGhvZEE6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2psb25nJywgYXJnczogWydKTklFbnYqJywgJ2pjbGFzcycsICdqbWV0aG9kSUQnLCAnanZhbHVlKiddIH0sXG4gICAgICAgIHJldFR5cGU6ICdpbnQ2NCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0NhbGxTdGF0aWNMb25nTWV0aG9kQScsXG4gICAgICAgIG9mZnNldDogMTM0LFxuICAgIH0sXG4gICAgQ2FsbFN0YXRpY0Zsb2F0TWV0aG9kOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqZmxvYXQnLCBhcmdzOiBbJ0pOSUVudionLCAnamNsYXNzJywgJ2ptZXRob2RJRCcsICcuLi4nXSB9LFxuICAgICAgICByZXRUeXBlOiAnZmxvYXQnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsU3RhdGljRmxvYXRNZXRob2QnLFxuICAgICAgICBvZmZzZXQ6IDEzNSxcbiAgICB9LFxuICAgIENhbGxTdGF0aWNGbG9hdE1ldGhvZFY6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pmbG9hdCcsIGFyZ3M6IFsnSk5JRW52KicsICdqY2xhc3MnLCAnam1ldGhvZElEJywgJ3ZhX2xpc3QnXSB9LFxuICAgICAgICByZXRUeXBlOiAnZmxvYXQnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsU3RhdGljRmxvYXRNZXRob2RWJyxcbiAgICAgICAgb2Zmc2V0OiAxMzYsXG4gICAgfSxcbiAgICBDYWxsU3RhdGljRmxvYXRNZXRob2RBOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqZmxvYXQnLCBhcmdzOiBbJ0pOSUVudionLCAnamNsYXNzJywgJ2ptZXRob2RJRCcsICdqdmFsdWUqJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ2Zsb2F0JyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnQ2FsbFN0YXRpY0Zsb2F0TWV0aG9kQScsXG4gICAgICAgIG9mZnNldDogMTM3LFxuICAgIH0sXG4gICAgQ2FsbFN0YXRpY0RvdWJsZU1ldGhvZDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamRvdWJsZScsIGFyZ3M6IFsnSk5JRW52KicsICdqY2xhc3MnLCAnam1ldGhvZElEJywgJy4uLiddIH0sXG4gICAgICAgIHJldFR5cGU6ICdkb3VibGUnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsU3RhdGljRG91YmxlTWV0aG9kJyxcbiAgICAgICAgb2Zmc2V0OiAxMzgsXG4gICAgfSxcbiAgICBDYWxsU3RhdGljRG91YmxlTWV0aG9kVjoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamRvdWJsZScsIGFyZ3M6IFsnSk5JRW52KicsICdqY2xhc3MnLCAnam1ldGhvZElEJywgJ3ZhX2xpc3QnXSB9LFxuICAgICAgICByZXRUeXBlOiAnZG91YmxlJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnQ2FsbFN0YXRpY0RvdWJsZU1ldGhvZFYnLFxuICAgICAgICBvZmZzZXQ6IDEzOSxcbiAgICB9LFxuICAgIENhbGxTdGF0aWNEb3VibGVNZXRob2RBOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqZG91YmxlJywgYXJnczogWydKTklFbnYqJywgJ2pjbGFzcycsICdqbWV0aG9kSUQnLCAnanZhbHVlKiddIH0sXG4gICAgICAgIHJldFR5cGU6ICdkb3VibGUnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsU3RhdGljRG91YmxlTWV0aG9kQScsXG4gICAgICAgIG9mZnNldDogMTQwLFxuICAgIH0sXG4gICAgQ2FsbFN0YXRpY1ZvaWRNZXRob2Q6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ3ZvaWQnLCBhcmdzOiBbJ0pOSUVudionLCAnamNsYXNzJywgJ2ptZXRob2RJRCcsICcuLi4nXSB9LFxuICAgICAgICByZXRUeXBlOiAndm9pZCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0NhbGxTdGF0aWNWb2lkTWV0aG9kJyxcbiAgICAgICAgb2Zmc2V0OiAxNDEsXG4gICAgfSxcbiAgICBDYWxsU3RhdGljVm9pZE1ldGhvZFY6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ3ZvaWQnLCBhcmdzOiBbJ0pOSUVudionLCAnamNsYXNzJywgJ2ptZXRob2RJRCcsICd2YV9saXN0J10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3ZvaWQnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdDYWxsU3RhdGljVm9pZE1ldGhvZFYnLFxuICAgICAgICBvZmZzZXQ6IDE0MixcbiAgICB9LFxuICAgIENhbGxTdGF0aWNWb2lkTWV0aG9kQToge1xuICAgICAgICBqbmk6IHsgcmV0OiAndm9pZCcsIGFyZ3M6IFsnSk5JRW52KicsICdqY2xhc3MnLCAnam1ldGhvZElEJywgJ2p2YWx1ZSonXSB9LFxuICAgICAgICByZXRUeXBlOiAndm9pZCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0NhbGxTdGF0aWNWb2lkTWV0aG9kQScsXG4gICAgICAgIG9mZnNldDogMTQzLFxuICAgIH0sXG4gICAgR2V0U3RhdGljRmllbGRJRDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamZpZWxkSUQnLCBhcmdzOiBbJ0pOSUVudionLCAnamNsYXNzJywgJ2NoYXIqJywgJ2NoYXIqJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3BvaW50ZXInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdHZXRTdGF0aWNGaWVsZElEJyxcbiAgICAgICAgb2Zmc2V0OiAxNDQsXG4gICAgfSxcbiAgICBHZXRTdGF0aWNPYmplY3RGaWVsZDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnam9iamVjdCcsIGFyZ3M6IFsnSk5JRW52KicsICdqY2xhc3MnLCAnamZpZWxkSUQnXSB9LFxuICAgICAgICByZXRUeXBlOiAncG9pbnRlcicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdHZXRTdGF0aWNPYmplY3RGaWVsZCcsXG4gICAgICAgIG9mZnNldDogMTQ1LFxuICAgIH0sXG4gICAgR2V0U3RhdGljQm9vbGVhbkZpZWxkOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqYm9vbGVhbicsIGFyZ3M6IFsnSk5JRW52KicsICdqY2xhc3MnLCAnamZpZWxkSUQnXSB9LFxuICAgICAgICByZXRUeXBlOiAndWludDgnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnR2V0U3RhdGljQm9vbGVhbkZpZWxkJyxcbiAgICAgICAgb2Zmc2V0OiAxNDYsXG4gICAgfSxcbiAgICBHZXRTdGF0aWNCeXRlRmllbGQ6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pieXRlJywgYXJnczogWydKTklFbnYqJywgJ2pjbGFzcycsICdqZmllbGRJRCddIH0sXG4gICAgICAgIHJldFR5cGU6ICdpbnQ4JyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0dldFN0YXRpY0J5dGVGaWVsZCcsXG4gICAgICAgIG9mZnNldDogMTQ3LFxuICAgIH0sXG4gICAgR2V0U3RhdGljQ2hhckZpZWxkOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqY2hhcicsIGFyZ3M6IFsnSk5JRW52KicsICdqY2xhc3MnLCAnamZpZWxkSUQnXSB9LFxuICAgICAgICByZXRUeXBlOiAndWludDE2JyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0dldFN0YXRpY0NoYXJGaWVsZCcsXG4gICAgICAgIG9mZnNldDogMTQ4LFxuICAgIH0sXG4gICAgR2V0U3RhdGljU2hvcnRGaWVsZDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnanNob3J0JywgYXJnczogWydKTklFbnYqJywgJ2pjbGFzcycsICdqZmllbGRJRCddIH0sXG4gICAgICAgIHJldFR5cGU6ICdpbnQxNicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdHZXRTdGF0aWNTaG9ydEZpZWxkJyxcbiAgICAgICAgb2Zmc2V0OiAxNDksXG4gICAgfSxcbiAgICBHZXRTdGF0aWNJbnRGaWVsZDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamludCcsIGFyZ3M6IFsnSk5JRW52KicsICdqY2xhc3MnLCAnamZpZWxkSUQnXSB9LFxuICAgICAgICByZXRUeXBlOiAnaW50MzInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnR2V0U3RhdGljSW50RmllbGQnLFxuICAgICAgICBvZmZzZXQ6IDE1MCxcbiAgICB9LFxuICAgIEdldFN0YXRpY0xvbmdGaWVsZDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamxvbmcnLCBhcmdzOiBbJ0pOSUVudionLCAnamNsYXNzJywgJ2pmaWVsZElEJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ2ludDY0JyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0dldFN0YXRpY0xvbmdGaWVsZCcsXG4gICAgICAgIG9mZnNldDogMTUxLFxuICAgIH0sXG4gICAgR2V0U3RhdGljRmxvYXRGaWVsZDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamZsb2F0JywgYXJnczogWydKTklFbnYqJywgJ2pjbGFzcycsICdqZmllbGRJRCddIH0sXG4gICAgICAgIHJldFR5cGU6ICdmbG9hdCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdHZXRTdGF0aWNGbG9hdEZpZWxkJyxcbiAgICAgICAgb2Zmc2V0OiAxNTIsXG4gICAgfSxcbiAgICBHZXRTdGF0aWNEb3VibGVGaWVsZDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamRvdWJsZScsIGFyZ3M6IFsnSk5JRW52KicsICdqY2xhc3MnLCAnamZpZWxkSUQnXSB9LFxuICAgICAgICByZXRUeXBlOiAnZG91YmxlJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0dldFN0YXRpY0RvdWJsZUZpZWxkJyxcbiAgICAgICAgb2Zmc2V0OiAxNTMsXG4gICAgfSxcbiAgICBTZXRTdGF0aWNPYmplY3RGaWVsZDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAndm9pZCcsIGFyZ3M6IFsnSk5JRW52KicsICdqY2xhc3MnLCAnamZpZWxkSUQnLCAnam9iamVjdCddIH0sXG4gICAgICAgIHJldFR5cGU6ICd2b2lkJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnU2V0U3RhdGljT2JqZWN0RmllbGQnLFxuICAgICAgICBvZmZzZXQ6IDE1NCxcbiAgICB9LFxuICAgIFNldFN0YXRpY0Jvb2xlYW5GaWVsZDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAndm9pZCcsIGFyZ3M6IFsnSk5JRW52KicsICdqY2xhc3MnLCAnamZpZWxkSUQnLCAnamJvb2xlYW4nXSB9LFxuICAgICAgICByZXRUeXBlOiAndm9pZCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ3VpbnQ4J10sXG4gICAgICAgIG5hbWU6ICdTZXRTdGF0aWNCb29sZWFuRmllbGQnLFxuICAgICAgICBvZmZzZXQ6IDE1NSxcbiAgICB9LFxuICAgIFNldFN0YXRpY0J5dGVGaWVsZDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAndm9pZCcsIGFyZ3M6IFsnSk5JRW52KicsICdqY2xhc3MnLCAnamZpZWxkSUQnLCAnamJ5dGUnXSB9LFxuICAgICAgICByZXRUeXBlOiAndm9pZCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ2ludDgnXSxcbiAgICAgICAgbmFtZTogJ1NldFN0YXRpY0J5dGVGaWVsZCcsXG4gICAgICAgIG9mZnNldDogMTU2LFxuICAgIH0sXG4gICAgU2V0U3RhdGljQ2hhckZpZWxkOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICd2b2lkJywgYXJnczogWydKTklFbnYqJywgJ2pjbGFzcycsICdqZmllbGRJRCcsICdqY2hhciddIH0sXG4gICAgICAgIHJldFR5cGU6ICd2b2lkJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAndWludDE2J10sXG4gICAgICAgIG5hbWU6ICdTZXRTdGF0aWNDaGFyRmllbGQnLFxuICAgICAgICBvZmZzZXQ6IDE1NyxcbiAgICB9LFxuICAgIFNldFN0YXRpY1Nob3J0RmllbGQ6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ3ZvaWQnLCBhcmdzOiBbJ0pOSUVudionLCAnamNsYXNzJywgJ2pmaWVsZElEJywgJ2pzaG9ydCddIH0sXG4gICAgICAgIHJldFR5cGU6ICd2b2lkJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAnaW50MTYnXSxcbiAgICAgICAgbmFtZTogJ1NldFN0YXRpY1Nob3J0RmllbGQnLFxuICAgICAgICBvZmZzZXQ6IDE1OCxcbiAgICB9LFxuICAgIFNldFN0YXRpY0ludEZpZWxkOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICd2b2lkJywgYXJnczogWydKTklFbnYqJywgJ2pjbGFzcycsICdqZmllbGRJRCcsICdqaW50J10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3ZvaWQnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdpbnQzMiddLFxuICAgICAgICBuYW1lOiAnU2V0U3RhdGljSW50RmllbGQnLFxuICAgICAgICBvZmZzZXQ6IDE1OSxcbiAgICB9LFxuICAgIFNldFN0YXRpY0xvbmdGaWVsZDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAndm9pZCcsIGFyZ3M6IFsnSk5JRW52KicsICdqY2xhc3MnLCAnamZpZWxkSUQnLCAnamxvbmcnXSB9LFxuICAgICAgICByZXRUeXBlOiAndm9pZCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ2ludDY0J10sXG4gICAgICAgIG5hbWU6ICdTZXRTdGF0aWNMb25nRmllbGQnLFxuICAgICAgICBvZmZzZXQ6IDE2MCxcbiAgICB9LFxuICAgIFNldFN0YXRpY0Zsb2F0RmllbGQ6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ3ZvaWQnLCBhcmdzOiBbJ0pOSUVudionLCAnamNsYXNzJywgJ2pmaWVsZElEJywgJ2pmbG9hdCddIH0sXG4gICAgICAgIHJldFR5cGU6ICd2b2lkJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAnZmxvYXQnXSxcbiAgICAgICAgbmFtZTogJ1NldFN0YXRpY0Zsb2F0RmllbGQnLFxuICAgICAgICBvZmZzZXQ6IDE2MSxcbiAgICB9LFxuICAgIFNldFN0YXRpY0RvdWJsZUZpZWxkOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICd2b2lkJywgYXJnczogWydKTklFbnYqJywgJ2pjbGFzcycsICdqZmllbGRJRCcsICdqZG91YmxlJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3ZvaWQnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdkb3VibGUnXSxcbiAgICAgICAgbmFtZTogJ1NldFN0YXRpY0RvdWJsZUZpZWxkJyxcbiAgICAgICAgb2Zmc2V0OiAxNjIsXG4gICAgfSxcbiAgICBOZXdTdHJpbmc6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pzdHJpbmcnLCBhcmdzOiBbJ0pOSUVudionLCAnamNoYXIqJywgJ2pzaXplJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3BvaW50ZXInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAnaW50MzInXSxcbiAgICAgICAgbmFtZTogJ05ld1N0cmluZycsXG4gICAgICAgIG9mZnNldDogMTYzLFxuICAgIH0sXG4gICAgR2V0U3RyaW5nTGVuZ3RoOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqc2l6ZScsIGFyZ3M6IFsnSk5JRW52KicsICdqc3RyaW5nJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ2ludDMyJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdHZXRTdHJpbmdMZW5ndGgnLFxuICAgICAgICBvZmZzZXQ6IDE2NCxcbiAgICB9LFxuICAgIEdldFN0cmluZ0NoYXJzOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqY2hhcionLCBhcmdzOiBbJ0pOSUVudionLCAnanN0cmluZycsICdqYm9vbGVhbionXSB9LFxuICAgICAgICByZXRUeXBlOiAncG9pbnRlcicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdHZXRTdHJpbmdDaGFycycsXG4gICAgICAgIG9mZnNldDogMTY1LFxuICAgIH0sXG4gICAgUmVsZWFzZVN0cmluZ0NoYXJzOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICd2b2lkJywgYXJnczogWydKTklFbnYqJywgJ2pzdHJpbmcnLCAnamNoYXIqJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3ZvaWQnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnUmVsZWFzZVN0cmluZ0NoYXJzJyxcbiAgICAgICAgb2Zmc2V0OiAxNjYsXG4gICAgfSxcbiAgICBOZXdTdHJpbmdVVEY6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pzdHJpbmcnLCBhcmdzOiBbJ0pOSUVudionLCAnY2hhcionXSB9LFxuICAgICAgICByZXRUeXBlOiAncG9pbnRlcicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnTmV3U3RyaW5nVVRGJyxcbiAgICAgICAgb2Zmc2V0OiAxNjcsXG4gICAgfSxcbiAgICBHZXRTdHJpbmdVVEZMZW5ndGg6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pzaXplJywgYXJnczogWydKTklFbnYqJywgJ2pzdHJpbmcnXSB9LFxuICAgICAgICByZXRUeXBlOiAnaW50MzInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0dldFN0cmluZ1VURkxlbmd0aCcsXG4gICAgICAgIG9mZnNldDogMTY4LFxuICAgIH0sXG4gICAgR2V0U3RyaW5nVVRGQ2hhcnM6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2NoYXIqJywgYXJnczogWydKTklFbnYqJywgJ2pzdHJpbmcnLCAnamJvb2xlYW4qJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3BvaW50ZXInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnR2V0U3RyaW5nVVRGQ2hhcnMnLFxuICAgICAgICBvZmZzZXQ6IDE2OSxcbiAgICB9LFxuICAgIFJlbGVhc2VTdHJpbmdVVEZDaGFyczoge1xuICAgICAgICBqbmk6IHsgcmV0OiAndm9pZCcsIGFyZ3M6IFsnSk5JRW52KicsICdqc3RyaW5nJywgJ2NoYXIqJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3ZvaWQnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnUmVsZWFzZVN0cmluZ1VURkNoYXJzJyxcbiAgICAgICAgb2Zmc2V0OiAxNzAsXG4gICAgfSxcbiAgICBHZXRBcnJheUxlbmd0aDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnanNpemUnLCBhcmdzOiBbJ0pOSUVudionLCAnamFycmF5J10gfSxcbiAgICAgICAgcmV0VHlwZTogJ2ludDMyJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdHZXRBcnJheUxlbmd0aCcsXG4gICAgICAgIG9mZnNldDogMTcxLFxuICAgIH0sXG4gICAgTmV3T2JqZWN0QXJyYXk6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pvYmplY3RBcnJheScsIGFyZ3M6IFsnSk5JRW52KicsICdqc2l6ZScsICdqY2xhc3MnLCAnam9iamVjdCddIH0sXG4gICAgICAgIHJldFR5cGU6ICdwb2ludGVyJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdpbnQzMicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ05ld09iamVjdEFycmF5JyxcbiAgICAgICAgb2Zmc2V0OiAxNzIsXG4gICAgfSxcbiAgICBHZXRPYmplY3RBcnJheUVsZW1lbnQ6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pvYmplY3QnLCBhcmdzOiBbJ0pOSUVudionLCAnam9iamVjdEFycmF5JywgJ2pzaXplJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3BvaW50ZXInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAnaW50MzInXSxcbiAgICAgICAgbmFtZTogJ0dldE9iamVjdEFycmF5RWxlbWVudCcsXG4gICAgICAgIG9mZnNldDogMTczLFxuICAgIH0sXG4gICAgU2V0T2JqZWN0QXJyYXlFbGVtZW50OiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICd2b2lkJywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3RBcnJheScsICdqc2l6ZScsICdqb2JqZWN0J10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3ZvaWQnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAnaW50MzInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnU2V0T2JqZWN0QXJyYXlFbGVtZW50JyxcbiAgICAgICAgb2Zmc2V0OiAxNzQsXG4gICAgfSxcbiAgICBOZXdCb29sZWFuQXJyYXk6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pib29sZWFuQXJyYXknLCBhcmdzOiBbJ0pOSUVudionLCAnanNpemUnXSB9LFxuICAgICAgICByZXRUeXBlOiAncG9pbnRlcicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAnaW50MzInXSxcbiAgICAgICAgbmFtZTogJ05ld0Jvb2xlYW5BcnJheScsXG4gICAgICAgIG9mZnNldDogMTc1LFxuICAgIH0sXG4gICAgTmV3Qnl0ZUFycmF5OiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqYnl0ZUFycmF5JywgYXJnczogWydKTklFbnYqJywgJ2pzaXplJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3BvaW50ZXInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ2ludDMyJ10sXG4gICAgICAgIG5hbWU6ICdOZXdCeXRlQXJyYXknLFxuICAgICAgICBvZmZzZXQ6IDE3NixcbiAgICB9LFxuICAgIE5ld0NoYXJBcnJheToge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamNoYXJBcnJheScsIGFyZ3M6IFsnSk5JRW52KicsICdqc2l6ZSddIH0sXG4gICAgICAgIHJldFR5cGU6ICdwb2ludGVyJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdpbnQzMiddLFxuICAgICAgICBuYW1lOiAnTmV3Q2hhckFycmF5JyxcbiAgICAgICAgb2Zmc2V0OiAxNzcsXG4gICAgfSxcbiAgICBOZXdTaG9ydEFycmF5OiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqc2hvcnRBcnJheScsIGFyZ3M6IFsnSk5JRW52KicsICdqc2l6ZSddIH0sXG4gICAgICAgIHJldFR5cGU6ICdwb2ludGVyJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdpbnQzMiddLFxuICAgICAgICBuYW1lOiAnTmV3U2hvcnRBcnJheScsXG4gICAgICAgIG9mZnNldDogMTc4LFxuICAgIH0sXG4gICAgTmV3SW50QXJyYXk6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2ppbnRBcnJheScsIGFyZ3M6IFsnSk5JRW52KicsICdqc2l6ZSddIH0sXG4gICAgICAgIHJldFR5cGU6ICdwb2ludGVyJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdpbnQzMiddLFxuICAgICAgICBuYW1lOiAnTmV3SW50QXJyYXknLFxuICAgICAgICBvZmZzZXQ6IDE3OSxcbiAgICB9LFxuICAgIE5ld0xvbmdBcnJheToge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamxvbmdBcnJheScsIGFyZ3M6IFsnSk5JRW52KicsICdqc2l6ZSddIH0sXG4gICAgICAgIHJldFR5cGU6ICdwb2ludGVyJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdpbnQzMiddLFxuICAgICAgICBuYW1lOiAnTmV3TG9uZ0FycmF5JyxcbiAgICAgICAgb2Zmc2V0OiAxODAsXG4gICAgfSxcbiAgICBOZXdGbG9hdEFycmF5OiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqZmxvYXRBcnJheScsIGFyZ3M6IFsnSk5JRW52KicsICdqc2l6ZSddIH0sXG4gICAgICAgIHJldFR5cGU6ICdwb2ludGVyJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdpbnQzMiddLFxuICAgICAgICBuYW1lOiAnTmV3RmxvYXRBcnJheScsXG4gICAgICAgIG9mZnNldDogMTgxLFxuICAgIH0sXG4gICAgTmV3RG91YmxlQXJyYXk6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pkb3VibGVBcnJheScsIGFyZ3M6IFsnSk5JRW52KicsICdqc2l6ZSddIH0sXG4gICAgICAgIHJldFR5cGU6ICdwb2ludGVyJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdpbnQzMiddLFxuICAgICAgICBuYW1lOiAnTmV3RG91YmxlQXJyYXknLFxuICAgICAgICBvZmZzZXQ6IDE4MixcbiAgICB9LFxuICAgIEdldEJvb2xlYW5BcnJheUVsZW1lbnRzOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqYm9vbGVhbionLCBhcmdzOiBbJ0pOSUVudionLCAnamJvb2xlYW5BcnJheScsICdqYm9vbGVhbionXSB9LFxuICAgICAgICByZXRUeXBlOiAncG9pbnRlcicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdHZXRCb29sZWFuQXJyYXlFbGVtZW50cycsXG4gICAgICAgIG9mZnNldDogMTgzLFxuICAgIH0sXG4gICAgR2V0Qnl0ZUFycmF5RWxlbWVudHM6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pieXRlKicsIGFyZ3M6IFsnSk5JRW52KicsICdqYnl0ZUFycmF5JywgJ2pib29sZWFuKiddIH0sXG4gICAgICAgIHJldFR5cGU6ICdwb2ludGVyJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0dldEJ5dGVBcnJheUVsZW1lbnRzJyxcbiAgICAgICAgb2Zmc2V0OiAxODQsXG4gICAgfSxcbiAgICBHZXRDaGFyQXJyYXlFbGVtZW50czoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamNoYXIqJywgYXJnczogWydKTklFbnYqJywgJ2pjaGFyQXJyYXknLCAnamJvb2xlYW4qJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3BvaW50ZXInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnR2V0Q2hhckFycmF5RWxlbWVudHMnLFxuICAgICAgICBvZmZzZXQ6IDE4NSxcbiAgICB9LFxuICAgIEdldFNob3J0QXJyYXlFbGVtZW50czoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnanNob3J0KicsIGFyZ3M6IFsnSk5JRW52KicsICdqc2hvcnRBcnJheScsICdqYm9vbGVhbionXSB9LFxuICAgICAgICByZXRUeXBlOiAncG9pbnRlcicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdHZXRTaG9ydEFycmF5RWxlbWVudHMnLFxuICAgICAgICBvZmZzZXQ6IDE4NixcbiAgICB9LFxuICAgIEdldEludEFycmF5RWxlbWVudHM6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2ppbnQqJywgYXJnczogWydKTklFbnYqJywgJ2ppbnRBcnJheScsICdqYm9vbGVhbionXSB9LFxuICAgICAgICByZXRUeXBlOiAncG9pbnRlcicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdHZXRJbnRBcnJheUVsZW1lbnRzJyxcbiAgICAgICAgb2Zmc2V0OiAxODcsXG4gICAgfSxcbiAgICBHZXRMb25nQXJyYXlFbGVtZW50czoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamxvbmcqJywgYXJnczogWydKTklFbnYqJywgJ2psb25nQXJyYXknLCAnamJvb2xlYW4qJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3BvaW50ZXInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnR2V0TG9uZ0FycmF5RWxlbWVudHMnLFxuICAgICAgICBvZmZzZXQ6IDE4OCxcbiAgICB9LFxuICAgIEdldEZsb2F0QXJyYXlFbGVtZW50czoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamZsb2F0KicsIGFyZ3M6IFsnSk5JRW52KicsICdqZmxvYXRBcnJheScsICdqYm9vbGVhbionXSB9LFxuICAgICAgICByZXRUeXBlOiAncG9pbnRlcicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdHZXRGbG9hdEFycmF5RWxlbWVudHMnLFxuICAgICAgICBvZmZzZXQ6IDE4OSxcbiAgICB9LFxuICAgIEdldERvdWJsZUFycmF5RWxlbWVudHM6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2pkb3VibGUqJywgYXJnczogWydKTklFbnYqJywgJ2pkb3VibGVBcnJheScsICdqYm9vbGVhbionXSB9LFxuICAgICAgICByZXRUeXBlOiAncG9pbnRlcicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdHZXREb3VibGVBcnJheUVsZW1lbnRzJyxcbiAgICAgICAgb2Zmc2V0OiAxOTAsXG4gICAgfSxcbiAgICBSZWxlYXNlQm9vbGVhbkFycmF5RWxlbWVudHM6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ3ZvaWQnLCBhcmdzOiBbJ0pOSUVudionLCAnamJvb2xlYW5BcnJheScsICdqYm9vbGVhbionLCAnamludCddIH0sXG4gICAgICAgIHJldFR5cGU6ICd2b2lkJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAnaW50MzInXSxcbiAgICAgICAgbmFtZTogJ1JlbGVhc2VCb29sZWFuQXJyYXlFbGVtZW50cycsXG4gICAgICAgIG9mZnNldDogMTkxLFxuICAgIH0sXG4gICAgUmVsZWFzZUJ5dGVBcnJheUVsZW1lbnRzOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICd2b2lkJywgYXJnczogWydKTklFbnYqJywgJ2pieXRlQXJyYXknLCAnamJ5dGUqJywgJ2ppbnQnXSB9LFxuICAgICAgICByZXRUeXBlOiAndm9pZCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJywgJ2ludDMyJ10sXG4gICAgICAgIG5hbWU6ICdSZWxlYXNlQnl0ZUFycmF5RWxlbWVudHMnLFxuICAgICAgICBvZmZzZXQ6IDE5MixcbiAgICB9LFxuICAgIFJlbGVhc2VDaGFyQXJyYXlFbGVtZW50czoge1xuICAgICAgICBqbmk6IHsgcmV0OiAndm9pZCcsIGFyZ3M6IFsnSk5JRW52KicsICdqY2hhckFycmF5JywgJ2pjaGFyKicsICdqaW50J10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3ZvaWQnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdpbnQzMiddLFxuICAgICAgICBuYW1lOiAnUmVsZWFzZUNoYXJBcnJheUVsZW1lbnRzJyxcbiAgICAgICAgb2Zmc2V0OiAxOTMsXG4gICAgfSxcbiAgICBSZWxlYXNlU2hvcnRBcnJheUVsZW1lbnRzOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICd2b2lkJywgYXJnczogWydKTklFbnYqJywgJ2pzaG9ydEFycmF5JywgJ2pzaG9ydConLCAnamludCddIH0sXG4gICAgICAgIHJldFR5cGU6ICd2b2lkJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAnaW50MzInXSxcbiAgICAgICAgbmFtZTogJ1JlbGVhc2VTaG9ydEFycmF5RWxlbWVudHMnLFxuICAgICAgICBvZmZzZXQ6IDE5NCxcbiAgICB9LFxuICAgIFJlbGVhc2VJbnRBcnJheUVsZW1lbnRzOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICd2b2lkJywgYXJnczogWydKTklFbnYqJywgJ2ppbnRBcnJheScsICdqaW50KicsICdqaW50J10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3ZvaWQnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdpbnQzMiddLFxuICAgICAgICBuYW1lOiAnUmVsZWFzZUludEFycmF5RWxlbWVudHMnLFxuICAgICAgICBvZmZzZXQ6IDE5NSxcbiAgICB9LFxuICAgIFJlbGVhc2VMb25nQXJyYXlFbGVtZW50czoge1xuICAgICAgICBqbmk6IHsgcmV0OiAndm9pZCcsIGFyZ3M6IFsnSk5JRW52KicsICdqbG9uZ0FycmF5JywgJ2psb25nKicsICdqaW50J10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3ZvaWQnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdpbnQzMiddLFxuICAgICAgICBuYW1lOiAnUmVsZWFzZUxvbmdBcnJheUVsZW1lbnRzJyxcbiAgICAgICAgb2Zmc2V0OiAxOTYsXG4gICAgfSxcbiAgICBSZWxlYXNlRmxvYXRBcnJheUVsZW1lbnRzOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICd2b2lkJywgYXJnczogWydKTklFbnYqJywgJ2pmbG9hdEFycmF5JywgJ2pmbG9hdConLCAnamludCddIH0sXG4gICAgICAgIHJldFR5cGU6ICd2b2lkJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAnaW50MzInXSxcbiAgICAgICAgbmFtZTogJ1JlbGVhc2VGbG9hdEFycmF5RWxlbWVudHMnLFxuICAgICAgICBvZmZzZXQ6IDE5NyxcbiAgICB9LFxuICAgIFJlbGVhc2VEb3VibGVBcnJheUVsZW1lbnRzOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICd2b2lkJywgYXJnczogWydKTklFbnYqJywgJ2pkb3VibGVBcnJheScsICdqZG91YmxlKicsICdqaW50J10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3ZvaWQnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdpbnQzMiddLFxuICAgICAgICBuYW1lOiAnUmVsZWFzZURvdWJsZUFycmF5RWxlbWVudHMnLFxuICAgICAgICBvZmZzZXQ6IDE5OCxcbiAgICB9LFxuICAgIEdldEJvb2xlYW5BcnJheVJlZ2lvbjoge1xuICAgICAgICBqbmk6IHsgcmV0OiAndm9pZCcsIGFyZ3M6IFsnSk5JRW52KicsICdqYm9vbGVhbkFycmF5JywgJ2pzaXplJywgJ2pzaXplJywgJ2pib29sZWFuKiddIH0sXG4gICAgICAgIHJldFR5cGU6ICd2b2lkJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ2ludDMyJywgJ2ludDMyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0dldEJvb2xlYW5BcnJheVJlZ2lvbicsXG4gICAgICAgIG9mZnNldDogMTk5LFxuICAgIH0sXG4gICAgR2V0Qnl0ZUFycmF5UmVnaW9uOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICd2b2lkJywgYXJnczogWydKTklFbnYqJywgJ2pieXRlQXJyYXknLCAnanNpemUnLCAnanNpemUnLCAnamJ5dGUqJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3ZvaWQnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAnaW50MzInLCAnaW50MzInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnR2V0Qnl0ZUFycmF5UmVnaW9uJyxcbiAgICAgICAgb2Zmc2V0OiAyMDAsXG4gICAgfSxcbiAgICBHZXRDaGFyQXJyYXlSZWdpb246IHtcbiAgICAgICAgam5pOiB7IHJldDogJ3ZvaWQnLCBhcmdzOiBbJ0pOSUVudionLCAnamNoYXJBcnJheScsICdqc2l6ZScsICdqc2l6ZScsICdqY2hhcionXSB9LFxuICAgICAgICByZXRUeXBlOiAndm9pZCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdpbnQzMicsICdpbnQzMicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdHZXRDaGFyQXJyYXlSZWdpb24nLFxuICAgICAgICBvZmZzZXQ6IDIwMSxcbiAgICB9LFxuICAgIEdldFNob3J0QXJyYXlSZWdpb246IHtcbiAgICAgICAgam5pOiB7IHJldDogJ3ZvaWQnLCBhcmdzOiBbJ0pOSUVudionLCAnanNob3J0QXJyYXknLCAnanNpemUnLCAnanNpemUnLCAnanNob3J0KiddIH0sXG4gICAgICAgIHJldFR5cGU6ICd2b2lkJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ2ludDMyJywgJ2ludDMyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0dldFNob3J0QXJyYXlSZWdpb24nLFxuICAgICAgICBvZmZzZXQ6IDIwMixcbiAgICB9LFxuICAgIEdldEludEFycmF5UmVnaW9uOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICd2b2lkJywgYXJnczogWydKTklFbnYqJywgJ2ppbnRBcnJheScsICdqc2l6ZScsICdqc2l6ZScsICdqaW50KiddIH0sXG4gICAgICAgIHJldFR5cGU6ICd2b2lkJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ2ludDMyJywgJ2ludDMyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0dldEludEFycmF5UmVnaW9uJyxcbiAgICAgICAgb2Zmc2V0OiAyMDMsXG4gICAgfSxcbiAgICBHZXRMb25nQXJyYXlSZWdpb246IHtcbiAgICAgICAgam5pOiB7IHJldDogJ3ZvaWQnLCBhcmdzOiBbJ0pOSUVudionLCAnamxvbmdBcnJheScsICdqc2l6ZScsICdqc2l6ZScsICdqbG9uZyonXSB9LFxuICAgICAgICByZXRUeXBlOiAndm9pZCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdpbnQzMicsICdpbnQzMicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdHZXRMb25nQXJyYXlSZWdpb24nLFxuICAgICAgICBvZmZzZXQ6IDIwNCxcbiAgICB9LFxuICAgIEdldEZsb2F0QXJyYXlSZWdpb246IHtcbiAgICAgICAgam5pOiB7IHJldDogJ3ZvaWQnLCBhcmdzOiBbJ0pOSUVudionLCAnamZsb2F0QXJyYXknLCAnanNpemUnLCAnanNpemUnLCAnamZsb2F0KiddIH0sXG4gICAgICAgIHJldFR5cGU6ICd2b2lkJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ2ludDMyJywgJ2ludDMyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0dldEZsb2F0QXJyYXlSZWdpb24nLFxuICAgICAgICBvZmZzZXQ6IDIwNSxcbiAgICB9LFxuICAgIEdldERvdWJsZUFycmF5UmVnaW9uOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICd2b2lkJywgYXJnczogWydKTklFbnYqJywgJ2pkb3VibGVBcnJheScsICdqc2l6ZScsICdqc2l6ZScsICdqZG91YmxlKiddIH0sXG4gICAgICAgIHJldFR5cGU6ICd2b2lkJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ2ludDMyJywgJ2ludDMyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0dldERvdWJsZUFycmF5UmVnaW9uJyxcbiAgICAgICAgb2Zmc2V0OiAyMDYsXG4gICAgfSxcbiAgICBTZXRCb29sZWFuQXJyYXlSZWdpb246IHtcbiAgICAgICAgam5pOiB7IHJldDogJ3ZvaWQnLCBhcmdzOiBbJ0pOSUVudionLCAnamJvb2xlYW5BcnJheScsICdqc2l6ZScsICdqc2l6ZScsICdqYm9vbGVhbionXSB9LFxuICAgICAgICByZXRUeXBlOiAndm9pZCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdpbnQzMicsICdpbnQzMicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdTZXRCb29sZWFuQXJyYXlSZWdpb24nLFxuICAgICAgICBvZmZzZXQ6IDIwNyxcbiAgICB9LFxuICAgIFNldEJ5dGVBcnJheVJlZ2lvbjoge1xuICAgICAgICBqbmk6IHsgcmV0OiAndm9pZCcsIGFyZ3M6IFsnSk5JRW52KicsICdqYnl0ZUFycmF5JywgJ2pzaXplJywgJ2pzaXplJywgJ2pieXRlKiddIH0sXG4gICAgICAgIHJldFR5cGU6ICd2b2lkJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ2ludDMyJywgJ2ludDMyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ1NldEJ5dGVBcnJheVJlZ2lvbicsXG4gICAgICAgIG9mZnNldDogMjA4LFxuICAgIH0sXG4gICAgU2V0Q2hhckFycmF5UmVnaW9uOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICd2b2lkJywgYXJnczogWydKTklFbnYqJywgJ2pjaGFyQXJyYXknLCAnanNpemUnLCAnanNpemUnLCAnamNoYXIqJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3ZvaWQnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAnaW50MzInLCAnaW50MzInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnU2V0Q2hhckFycmF5UmVnaW9uJyxcbiAgICAgICAgb2Zmc2V0OiAyMDksXG4gICAgfSxcbiAgICBTZXRTaG9ydEFycmF5UmVnaW9uOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICd2b2lkJywgYXJnczogWydKTklFbnYqJywgJ2pzaG9ydEFycmF5JywgJ2pzaXplJywgJ2pzaXplJywgJ2pzaG9ydConXSB9LFxuICAgICAgICByZXRUeXBlOiAndm9pZCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdpbnQzMicsICdpbnQzMicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdTZXRTaG9ydEFycmF5UmVnaW9uJyxcbiAgICAgICAgb2Zmc2V0OiAyMTAsXG4gICAgfSxcbiAgICBTZXRJbnRBcnJheVJlZ2lvbjoge1xuICAgICAgICBqbmk6IHsgcmV0OiAndm9pZCcsIGFyZ3M6IFsnSk5JRW52KicsICdqaW50QXJyYXknLCAnanNpemUnLCAnanNpemUnLCAnamludConXSB9LFxuICAgICAgICByZXRUeXBlOiAndm9pZCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdpbnQzMicsICdpbnQzMicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdTZXRJbnRBcnJheVJlZ2lvbicsXG4gICAgICAgIG9mZnNldDogMjExLFxuICAgIH0sXG4gICAgU2V0TG9uZ0FycmF5UmVnaW9uOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICd2b2lkJywgYXJnczogWydKTklFbnYqJywgJ2psb25nQXJyYXknLCAnanNpemUnLCAnanNpemUnLCAnamxvbmcqJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3ZvaWQnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAnaW50MzInLCAnaW50MzInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnU2V0TG9uZ0FycmF5UmVnaW9uJyxcbiAgICAgICAgb2Zmc2V0OiAyMTIsXG4gICAgfSxcbiAgICBTZXRGbG9hdEFycmF5UmVnaW9uOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICd2b2lkJywgYXJnczogWydKTklFbnYqJywgJ2pmbG9hdEFycmF5JywgJ2pzaXplJywgJ2pzaXplJywgJ2pmbG9hdConXSB9LFxuICAgICAgICByZXRUeXBlOiAndm9pZCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdpbnQzMicsICdpbnQzMicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdTZXRGbG9hdEFycmF5UmVnaW9uJyxcbiAgICAgICAgb2Zmc2V0OiAyMTMsXG4gICAgfSxcbiAgICBTZXREb3VibGVBcnJheVJlZ2lvbjoge1xuICAgICAgICBqbmk6IHsgcmV0OiAndm9pZCcsIGFyZ3M6IFsnSk5JRW52KicsICdqZG91YmxlQXJyYXknLCAnanNpemUnLCAnanNpemUnLCAnamRvdWJsZSonXSB9LFxuICAgICAgICByZXRUeXBlOiAndm9pZCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdpbnQzMicsICdpbnQzMicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdTZXREb3VibGVBcnJheVJlZ2lvbicsXG4gICAgICAgIG9mZnNldDogMjE0LFxuICAgIH0sXG4gICAgUmVnaXN0ZXJOYXRpdmVzOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqaW50JywgYXJnczogWydKTklFbnYqJywgJ2pjbGFzcycsICdKTklOYXRpdmVNZXRob2QqJywgJ2ppbnQnXSB9LFxuICAgICAgICByZXRUeXBlOiAnaW50MzInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlcicsICdpbnQzMiddLFxuICAgICAgICBuYW1lOiAnUmVnaXN0ZXJOYXRpdmVzJyxcbiAgICAgICAgb2Zmc2V0OiAyMTUsXG4gICAgfSxcbiAgICBVbnJlZ2lzdGVyTmF0aXZlczoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamludCcsIGFyZ3M6IFsnSk5JRW52KicsICdqY2xhc3MnXSB9LFxuICAgICAgICByZXRUeXBlOiAnaW50MzInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ1VucmVnaXN0ZXJOYXRpdmVzJyxcbiAgICAgICAgb2Zmc2V0OiAyMTYsXG4gICAgfSxcbiAgICBNb25pdG9yRW50ZXI6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2ppbnQnLCBhcmdzOiBbJ0pOSUVudionLCAnam9iamVjdCddIH0sXG4gICAgICAgIHJldFR5cGU6ICdpbnQzMicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnTW9uaXRvckVudGVyJyxcbiAgICAgICAgb2Zmc2V0OiAyMTcsXG4gICAgfSxcbiAgICBNb25pdG9yRXhpdDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamludCcsIGFyZ3M6IFsnSk5JRW52KicsICdqb2JqZWN0J10gfSxcbiAgICAgICAgcmV0VHlwZTogJ2ludDMyJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdNb25pdG9yRXhpdCcsXG4gICAgICAgIG9mZnNldDogMjE4LFxuICAgIH0sXG4gICAgR2V0SmF2YVZNOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqaW50JywgYXJnczogWydKTklFbnYqJywgJ0phdmFWTSoqJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ2ludDMyJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdHZXRKYXZhVk0nLFxuICAgICAgICBvZmZzZXQ6IDIxOSxcbiAgICB9LFxuICAgIEdldFN0cmluZ1JlZ2lvbjoge1xuICAgICAgICBqbmk6IHsgcmV0OiAndm9pZCcsIGFyZ3M6IFsnSk5JRW52KicsICdqc3RyaW5nJywgJ2pzaXplJywgJ2pzaXplJywgJ2pjaGFyKiddIH0sXG4gICAgICAgIHJldFR5cGU6ICd2b2lkJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ2ludDMyJywgJ2ludDMyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0dldFN0cmluZ1JlZ2lvbicsXG4gICAgICAgIG9mZnNldDogMjIwLFxuICAgIH0sXG4gICAgR2V0U3RyaW5nVVRGUmVnaW9uOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICd2b2lkJywgYXJnczogWydKTklFbnYqJywgJ2pzdHJpbmcnLCAnanNpemUnLCAnanNpemUnLCAnY2hhcionXSB9LFxuICAgICAgICByZXRUeXBlOiAndm9pZCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdpbnQzMicsICdpbnQzMicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdHZXRTdHJpbmdVVEZSZWdpb24nLFxuICAgICAgICBvZmZzZXQ6IDIyMSxcbiAgICB9LFxuICAgIEdldFByaW1pdGl2ZUFycmF5Q3JpdGljYWw6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ3ZvaWQqJywgYXJnczogWydKTklFbnYqJywgJ2phcnJheScsICdqYm9vbGVhbionXSB9LFxuICAgICAgICByZXRUeXBlOiAncG9pbnRlcicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdHZXRQcmltaXRpdmVBcnJheUNyaXRpY2FsJyxcbiAgICAgICAgb2Zmc2V0OiAyMjIsXG4gICAgfSxcbiAgICBSZWxlYXNlUHJpbWl0aXZlQXJyYXlDcml0aWNhbDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAndm9pZCcsIGFyZ3M6IFsnSk5JRW52KicsICdqYXJyYXknLCAndm9pZConLCAnamludCddIH0sXG4gICAgICAgIHJldFR5cGU6ICd2b2lkJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAnaW50MzInXSxcbiAgICAgICAgbmFtZTogJ1JlbGVhc2VQcmltaXRpdmVBcnJheUNyaXRpY2FsJyxcbiAgICAgICAgb2Zmc2V0OiAyMjMsXG4gICAgfSxcbiAgICBHZXRTdHJpbmdDcml0aWNhbDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnamNoYXIqJywgYXJnczogWydKTklFbnYqJywgJ2pzdHJpbmcnLCAnamJvb2xlYW4qJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3BvaW50ZXInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnR2V0U3RyaW5nQ3JpdGljYWwnLFxuICAgICAgICBvZmZzZXQ6IDIyNCxcbiAgICB9LFxuICAgIFJlbGVhc2VTdHJpbmdDcml0aWNhbDoge1xuICAgICAgICBqbmk6IHsgcmV0OiAndm9pZCcsIGFyZ3M6IFsnSk5JRW52KicsICdqc3RyaW5nJywgJ2pjaGFyKiddIH0sXG4gICAgICAgIHJldFR5cGU6ICd2b2lkJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ1JlbGVhc2VTdHJpbmdDcml0aWNhbCcsXG4gICAgICAgIG9mZnNldDogMjI1LFxuICAgIH0sXG4gICAgTmV3V2Vha0dsb2JhbFJlZjoge1xuICAgICAgICBqbmk6IHsgcmV0OiAnandlYWsnLCBhcmdzOiBbJ0pOSUVudionLCAnam9iamVjdCddIH0sXG4gICAgICAgIHJldFR5cGU6ICdwb2ludGVyJyxcbiAgICAgICAgYXJnVHlwZXM6IFsncG9pbnRlcicsICdwb2ludGVyJ10sXG4gICAgICAgIG5hbWU6ICdOZXdXZWFrR2xvYmFsUmVmJyxcbiAgICAgICAgb2Zmc2V0OiAyMjYsXG4gICAgfSxcbiAgICBEZWxldGVXZWFrR2xvYmFsUmVmOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICd2b2lkJywgYXJnczogWydKTklFbnYqJywgJ2p3ZWFrJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3ZvaWQnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0RlbGV0ZVdlYWtHbG9iYWxSZWYnLFxuICAgICAgICBvZmZzZXQ6IDIyNyxcbiAgICB9LFxuICAgIEV4Y2VwdGlvbkNoZWNrOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqYm9vbGVhbicsIGFyZ3M6IFsnSk5JRW52KiddIH0sXG4gICAgICAgIHJldFR5cGU6ICd1aW50OCcsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0V4Y2VwdGlvbkNoZWNrJyxcbiAgICAgICAgb2Zmc2V0OiAyMjgsXG4gICAgfSxcbiAgICBOZXdEaXJlY3RCeXRlQnVmZmVyOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqb2JqZWN0JywgYXJnczogWydKTklFbnYqJywgJ3ZvaWQqJywgJ2psb25nJ10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3BvaW50ZXInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInLCAnaW50NjQnXSxcbiAgICAgICAgbmFtZTogJ05ld0RpcmVjdEJ5dGVCdWZmZXInLFxuICAgICAgICBvZmZzZXQ6IDIyOSxcbiAgICB9LFxuICAgIEdldERpcmVjdEJ1ZmZlckFkZHJlc3M6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ3ZvaWQqJywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3QnXSB9LFxuICAgICAgICByZXRUeXBlOiAncG9pbnRlcicsXG4gICAgICAgIGFyZ1R5cGVzOiBbJ3BvaW50ZXInLCAncG9pbnRlciddLFxuICAgICAgICBuYW1lOiAnR2V0RGlyZWN0QnVmZmVyQWRkcmVzcycsXG4gICAgICAgIG9mZnNldDogMjMwLFxuICAgIH0sXG4gICAgR2V0RGlyZWN0QnVmZmVyQ2FwYWNpdHk6IHtcbiAgICAgICAgam5pOiB7IHJldDogJ2psb25nJywgYXJnczogWydKTklFbnYqJywgJ2pvYmplY3QnXSB9LFxuICAgICAgICByZXRUeXBlOiAnaW50NjQnLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0dldERpcmVjdEJ1ZmZlckNhcGFjaXR5JyxcbiAgICAgICAgb2Zmc2V0OiAyMzEsXG4gICAgfSxcbiAgICBHZXRPYmplY3RSZWZUeXBlOiB7XG4gICAgICAgIGpuaTogeyByZXQ6ICdqb2JqZWN0UmVmVHlwZScsIGFyZ3M6IFsnSk5JRW52KicsICdqb2JqZWN0J10gfSxcbiAgICAgICAgcmV0VHlwZTogJ3BvaW50ZXInLFxuICAgICAgICBhcmdUeXBlczogWydwb2ludGVyJywgJ3BvaW50ZXInXSxcbiAgICAgICAgbmFtZTogJ0dldE9iamVjdFJlZlR5cGUnLFxuICAgICAgICBvZmZzZXQ6IDIzMixcbiAgICB9LFxufTtcbmZ1bmN0aW9uIGNvbnZlcnRUb0ZyaWRhKHR5cGUpIHtcbiAgICBpZiAodHlwZS5pbmNsdWRlcygnKicpKVxuICAgICAgICByZXR1cm4gJ3BvaW50ZXInO1xuICAgIGlmICh0eXBlLmVuZHNXaXRoKCdBcnJheScpKVxuICAgICAgICByZXR1cm4gJ3BvaW50ZXInO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlICd2b2lkJzpcbiAgICAgICAgICAgIHJldHVybiAndm9pZCc7XG4gICAgICAgIGNhc2UgJ2pib29sZWFuJzpcbiAgICAgICAgICAgIHJldHVybiAndWludDgnO1xuICAgICAgICBjYXNlICdqYnl0ZSc6XG4gICAgICAgICAgICByZXR1cm4gJ2ludDgnO1xuICAgICAgICBjYXNlICdqY2hhcic6XG4gICAgICAgICAgICByZXR1cm4gJ3VpbnQxNic7XG4gICAgICAgIGNhc2UgJ2pzaG9ydCc6XG4gICAgICAgICAgICByZXR1cm4gJ2ludDE2JztcbiAgICAgICAgY2FzZSAnamludCc6XG4gICAgICAgIGNhc2UgJ2pzaXplJzpcbiAgICAgICAgICAgIHJldHVybiAnaW50MzInO1xuICAgICAgICBjYXNlICdqbG9uZyc6XG4gICAgICAgICAgICByZXR1cm4gJ2ludDY0JztcbiAgICAgICAgY2FzZSAnamZsb2F0JzpcbiAgICAgICAgICAgIHJldHVybiAnZmxvYXQnO1xuICAgICAgICBjYXNlICdqZG91YmxlJzpcbiAgICAgICAgICAgIHJldHVybiAnZG91YmxlJztcbiAgICAgICAgY2FzZSAnanRocm93YWJsZSc6XG4gICAgICAgIGNhc2UgJ2pjbGFzcyc6XG4gICAgICAgIGNhc2UgJ2pzdHJpbmcnOlxuICAgICAgICBjYXNlICdqYXJyYXknOlxuICAgICAgICBjYXNlICdqd2Vhayc6XG4gICAgICAgIGNhc2UgJ2pvYmplY3QnOlxuICAgICAgICAgICAgcmV0dXJuICdwb2ludGVyJztcbiAgICAgICAgY2FzZSAnamZpZWxkSUQnOlxuICAgICAgICBjYXNlICdqbWV0aG9kSUQnOlxuICAgICAgICBjYXNlICdqb2JqZWN0UmVmVHlwZSc6XG4gICAgICAgIGNhc2UgJ3ZhX2xpc3QnOlxuICAgICAgICBjYXNlICcuLi4nOlxuICAgICAgICAgICAgcmV0dXJuICdwb2ludGVyJztcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKGBjb252ZXJ0OiBpbGxlZ2FsIHR5cGUgJHt0eXBlfWApO1xufVxuZnVuY3Rpb24gYXNGdW5jdGlvbihiYXNlLCBkZWYpIHtcbiAgICBjb25zdCBwdHIgPSBiYXNlLmFkZChkZWYub2Zmc2V0ICogUHJvY2Vzcy5wb2ludGVyU2l6ZSk7XG4gICAgY29uc3QgZm4gPSBuZXcgTmF0aXZlRnVuY3Rpb24ocHRyLnJlYWRQb2ludGVyKCksIGRlZi5yZXRUeXBlLCBkZWYuYXJnVHlwZXMpO1xuICAgIHJldHVybiBmbjtcbn1cbmV4cG9ydCB7IEpOSSwgYXNGdW5jdGlvbiB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9am5pLmpzLm1hcCIsImltcG9ydCB7IHJlc29sdmVNZXRob2QgfSBmcm9tICcuL3RyYWNlci5qcyc7XG5jb25zdCBVTklPTl9TSVpFID0gODtcbmNvbnN0IE1FVEhPRF9JRF9JTkRFWCA9IDI7XG5jb25zdCBOT05fVklSVFVBTF9NRVRIT0RfSURfSU5ERVggPSAzO1xuY2xhc3MgSk5JRW52SW50ZXJjZXB0b3Ige1xuICAgIGNvbnN0cnVjdG9yKCkgeyB9XG4gICAgZ2V0Q2FsbE1ldGhvZEFyZ3MoY2FsbGVyLCBhcmdzLCBpc1N0YXRpYykge1xuICAgICAgICBsZXQgbWV0aG9kSW5kZXggPSBNRVRIT0RfSURfSU5ERVg7XG4gICAgICAgIGlmIChjYWxsZXIuaW5jbHVkZXMoJ05vbnZpcnR1YWwnKSkge1xuICAgICAgICAgICAgbWV0aG9kSW5kZXggPSBOT05fVklSVFVBTF9NRVRIT0RfSURfSU5ERVg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNhbGxlci5lbmRzV2l0aCgnam1ldGhvZElEeicpKVxuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICBpZiAoIWNhbGxlci5lbmRzV2l0aCgndmFfbGlzdCcpICYmICFjYWxsZXIuZW5kc1dpdGgoJ2p2YWx1ZScpKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBqTWV0aG9kSWQgPSBhcmdzW21ldGhvZEluZGV4XTtcbiAgICAgICAgY29uc3QgaXNWYUxpc3QgPSBjYWxsZXIuZW5kc1dpdGgoJ3ZhX2xpc3QnKTtcbiAgICAgICAgLy8gPyB0b2RvIGRvIGJldHRlciwgY29uZnVzaW5nIGZsb3dcbiAgICAgICAgY29uc3Qgak1ldGhvZCA9IHJlc29sdmVNZXRob2Qoak1ldGhvZElkLCBpc1N0YXRpYyk7XG4gICAgICAgIGlmICghak1ldGhvZCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignW0puaUVudkludGVyY2VwdG9yXScsICdNZXRob2Qgbm90IGZvdW5kIGZvciBpZDonLCBqTWV0aG9kSWQpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY2FsbEFyZ3MgPSBbXTtcbiAgICAgICAgY29uc3QgY2FsbEFyZ3NQdHIgPSBhcmdzW2FyZ3MubGVuZ3RoIC0gMV07XG4gICAgICAgIGlmIChpc1ZhTGlzdClcbiAgICAgICAgICAgIHRoaXMuc2V0VXBWYUxpc3RBcmdFeHRyYWN0KGNhbGxBcmdzUHRyKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBqTWV0aG9kLmphdmFQYXJhbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBqTWV0aG9kLmphdmFQYXJhbXNbaV07XG4gICAgICAgICAgICBsZXQgdmFsdWU7XG4gICAgICAgICAgICBpZiAoaXNWYUxpc3QpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50UHRyID0gdGhpcy5leHRyYWN0VmFMaXN0QXJnVmFsdWUoak1ldGhvZCwgaSk7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLnJlYWRWYWx1ZShjdXJyZW50UHRyLCB0eXBlLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5yZWFkVmFsdWUoY2FsbEFyZ3NQdHIuYWRkKFVOSU9OX1NJWkUgKiBpKSwgdHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYWxsQXJncy5wdXNoKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNWYUxpc3QpXG4gICAgICAgICAgICB0aGlzLnJlc2V0VmFMaXN0QXJnRXh0cmFjdCgpO1xuICAgICAgICByZXR1cm4gY2FsbEFyZ3M7XG4gICAgfVxuICAgIHJlYWRWYWx1ZShjdXJyZW50UHRyLCB0eXBlLCBleHRlbmQpIHtcbiAgICAgICAgbGV0IHZhbHVlO1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2Jvb2xlYW4nOiB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBjdXJyZW50UHRyLnJlYWRVOCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSAnYnl0ZSc6IHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGN1cnJlbnRQdHIucmVhZFM4KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlICdjaGFyJzoge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gY3VycmVudFB0ci5yZWFkVTE2KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlICdzaG9ydCc6IHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGN1cnJlbnRQdHIucmVhZFMxNigpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSAnaW50Jzoge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gY3VycmVudFB0ci5yZWFkUzMyKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlICdsb25nJzoge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gY3VycmVudFB0ci5yZWFkUzY0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlICdkb3VibGUnOiB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBjdXJyZW50UHRyLnJlYWREb3VibGUoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgJ2Zsb2F0Jzoge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gZXh0ZW5kID09PSB0cnVlID8gY3VycmVudFB0ci5yZWFkRG91YmxlKCkgOiBjdXJyZW50UHRyLnJlYWRGbG9hdCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSAncG9pbnRlcic6XG4gICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBjdXJyZW50UHRyLnJlYWRQb2ludGVyKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbn1cbmV4cG9ydCB7IEpOSUVudkludGVyY2VwdG9yIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1qbmlFbnZJbnRlcmNlcHRvci5qcy5tYXAiLCJpbXBvcnQgeyBKTklFbnZJbnRlcmNlcHRvciB9IGZyb20gJy4vam5pRW52SW50ZXJjZXB0b3IuanMnO1xuY2xhc3MgSk5JRW52SW50ZXJjZXB0b3JBUk02NCBleHRlbmRzIEpOSUVudkludGVyY2VwdG9yIHtcbiAgICBzdGFjayA9IE5VTEw7XG4gICAgc3RhY2tJbmRleCA9IDA7XG4gICAgZ3JUb3AgPSBOVUxMO1xuICAgIHZyVG9wID0gTlVMTDtcbiAgICBnck9mZnMgPSAwO1xuICAgIGdyT2Zmc0luZGV4ID0gMDtcbiAgICB2ck9mZnMgPSAwO1xuICAgIHZyT2Zmc0luZGV4ID0gMDtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgc2V0VXBWYUxpc3RBcmdFeHRyYWN0KHZhTGlzdCkge1xuICAgICAgICBjb25zdCB2clN0YXJ0ID0gMjtcbiAgICAgICAgY29uc3QgZ3JPZmZzZXQgPSAzO1xuICAgICAgICBjb25zdCB2ck9mZnNldCA9IDQ7XG4gICAgICAgIHRoaXMuc3RhY2sgPSB2YUxpc3QucmVhZFBvaW50ZXIoKTtcbiAgICAgICAgdGhpcy5zdGFja0luZGV4ID0gMDtcbiAgICAgICAgdGhpcy5nclRvcCA9IHZhTGlzdC5hZGQoUHJvY2Vzcy5wb2ludGVyU2l6ZSkucmVhZFBvaW50ZXIoKTtcbiAgICAgICAgdGhpcy52clRvcCA9IHZhTGlzdC5hZGQoUHJvY2Vzcy5wb2ludGVyU2l6ZSAqIHZyU3RhcnQpLnJlYWRQb2ludGVyKCk7XG4gICAgICAgIHRoaXMuZ3JPZmZzID0gdmFMaXN0LmFkZChQcm9jZXNzLnBvaW50ZXJTaXplICogZ3JPZmZzZXQpLnJlYWRTMzIoKTtcbiAgICAgICAgdGhpcy5nck9mZnNJbmRleCA9IDA7XG4gICAgICAgIHRoaXMudnJPZmZzID0gdmFMaXN0LmFkZChQcm9jZXNzLnBvaW50ZXJTaXplICogZ3JPZmZzZXQgKyB2ck9mZnNldCkucmVhZFMzMigpO1xuICAgICAgICB0aGlzLnZyT2Zmc0luZGV4ID0gMDtcbiAgICB9XG4gICAgZXh0cmFjdFZhTGlzdEFyZ1ZhbHVlKG1ldGhvZCwgcGFyYW1JZCkge1xuICAgICAgICBjb25zdCBNQVhfVlJfUkVHX05VTSA9IDg7XG4gICAgICAgIGNvbnN0IFZSX1JFR19TSVpFID0gMjtcbiAgICAgICAgY29uc3QgTUFYX0dSX1JFR19OVU0gPSA0O1xuICAgICAgICBsZXQgY3VycmVudFB0ciA9IE5VTEw7XG4gICAgICAgIGlmIChtZXRob2QuamF2YVBhcmFtc1twYXJhbUlkXSA9PT0gJ2Zsb2F0JyB8fCBtZXRob2QuamF2YVBhcmFtc1twYXJhbUlkXSA9PT0gJ2RvdWJsZScpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnZyT2Zmc0luZGV4IDwgTUFYX1ZSX1JFR19OVU0pIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UHRyID0gdGhpcy52clRvcC5hZGQodGhpcy52ck9mZnMpLmFkZCh0aGlzLnZyT2Zmc0luZGV4ICogUHJvY2Vzcy5wb2ludGVyU2l6ZSAqIFZSX1JFR19TSVpFKTtcbiAgICAgICAgICAgICAgICB0aGlzLnZyT2Zmc0luZGV4Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UHRyID0gdGhpcy5zdGFjay5hZGQodGhpcy5zdGFja0luZGV4ICogUHJvY2Vzcy5wb2ludGVyU2l6ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFja0luZGV4Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5nck9mZnNJbmRleCA8IE1BWF9HUl9SRUdfTlVNKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFB0ciA9IHRoaXMuZ3JUb3AuYWRkKHRoaXMuZ3JPZmZzKS5hZGQodGhpcy5nck9mZnNJbmRleCAqIFByb2Nlc3MucG9pbnRlclNpemUpO1xuICAgICAgICAgICAgICAgIHRoaXMuZ3JPZmZzSW5kZXgrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQdHIgPSB0aGlzLnN0YWNrLmFkZCh0aGlzLnN0YWNrSW5kZXggKiBQcm9jZXNzLnBvaW50ZXJTaXplKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YWNrSW5kZXgrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3VycmVudFB0cjtcbiAgICB9XG4gICAgcmVzZXRWYUxpc3RBcmdFeHRyYWN0KCkge1xuICAgICAgICB0aGlzLnN0YWNrID0gTlVMTDtcbiAgICAgICAgdGhpcy5zdGFja0luZGV4ID0gMDtcbiAgICAgICAgdGhpcy5nclRvcCA9IE5VTEw7XG4gICAgICAgIHRoaXMudnJUb3AgPSBOVUxMO1xuICAgICAgICB0aGlzLmdyT2ZmcyA9IDA7XG4gICAgICAgIHRoaXMuZ3JPZmZzSW5kZXggPSAwO1xuICAgICAgICB0aGlzLnZyT2ZmcyA9IDA7XG4gICAgICAgIHRoaXMudnJPZmZzSW5kZXggPSAwO1xuICAgIH1cbn1cbmV4cG9ydCB7IEpOSUVudkludGVyY2VwdG9yQVJNNjQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWpuaUVudkludGVyY2VwdG9yQXJtNjQuanMubWFwIiwiY2xhc3MgSk5JTWV0aG9kIHtcbiAgICBuYW1lO1xuICAgIGFkZHJlc3M7XG4gICAgY29uc3RydWN0b3IobmFtZSwgYWRkcmVzcykge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmFkZHJlc3MgPSBhZGRyZXNzO1xuICAgIH1cbn1cbmV4cG9ydCB7IEpOSU1ldGhvZCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9am5pTWV0aG9kLmpzLm1hcCIsImltcG9ydCB7IENsYXNzZXMsIFN0ZCwgZW51bWVyYXRlTWVtYmVycywgZmluZENsYXNzIH0gZnJvbSAnQGNsb2Nrd29yay9jb21tb24nO1xuaW1wb3J0IHsgSmF2YU1ldGhvZCB9IGZyb20gJy4vamF2YU1ldGhvZC5qcyc7XG5pbXBvcnQgeyBKTkksIGFzRnVuY3Rpb24gfSBmcm9tICcuL2puaS5qcyc7XG5jb25zdCBDYWNoZSA9IHtcbiAgICBzdG9yYWdlOiBuZXcgTWFwKCksXG4gICAgc3RhdGljU3RvcmFnZTogbmV3IE1hcCgpLFxuICAgIGdldChqTWV0aG9kSWQsIGlzU3RhdGljKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IHR5cGVvZiBqTWV0aG9kSWQgPT09ICdzdHJpbmcnID8gak1ldGhvZElkIDogak1ldGhvZElkLnRvU3RyaW5nKCk7XG4gICAgICAgIHJldHVybiAoaXNTdGF0aWMgPyB0aGlzLnN0YXRpY1N0b3JhZ2UgOiB0aGlzLnN0b3JhZ2UpLmdldChrZXkpID8/IG51bGw7XG4gICAgfSxcbiAgICBzZXQoak1ldGhvZElkLCBtZXRob2QpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gdHlwZW9mIGpNZXRob2RJZCA9PT0gJ3N0cmluZycgPyBqTWV0aG9kSWQgOiBqTWV0aG9kSWQudG9TdHJpbmcoKTtcbiAgICAgICAgKG1ldGhvZC5pc1N0YXRpYyA/IHRoaXMuc3RhdGljU3RvcmFnZSA6IHRoaXMuc3RvcmFnZSkuc2V0KGtleSwgbWV0aG9kKTtcbiAgICAgICAgcmV0dXJuIG1ldGhvZDtcbiAgICB9LFxufTtcbmxldCBjYWNoZWRCYXNlID0gbnVsbDtcbmxldCBGaW5kQ2xhc3MgPSBudWxsO1xubGV0IFRvUmVmbGVjdGVkTWV0aG9kID0gbnVsbDtcbmxldCBnZXREZWNsYXJpbmdDbGFzc0Rlc2MgPSBudWxsO1xuY29uc3QgUHJpbWl0aXZlVHlwZXMgPSB7XG4gICAgWjogJ2Jvb2xlYW4nLFxuICAgIEI6ICdieXRlJyxcbiAgICBDOiAnY2hhcicsXG4gICAgRDogJ2RvdWJsZScsXG4gICAgRjogJ2Zsb2F0JyxcbiAgICBJOiAnaW50JyxcbiAgICBKOiAnbG9uZycsXG4gICAgUzogJ3Nob3J0JyxcbiAgICBWOiAndm9pZCcsXG59O1xuZnVuY3Rpb24gcHJldHR5TWV0aG9kKG1ldGhvZElkLCB3aXRoU2lnbmF0dXJlKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IFN0ZC5TdHJpbmcoKTtcbiAgICAvL0B0cy1pZ25vcmVcbiAgICBKYXZhLmFwaVsnYXJ0OjpBcnRNZXRob2Q6OlByZXR0eU1ldGhvZCddKHJlc3VsdCwgbWV0aG9kSWQsIHdpdGhTaWduYXR1cmUgPyAxIDogMCk7XG4gICAgcmV0dXJuIHJlc3VsdC5kaXNwb3NlVG9TdHJpbmcoKTtcbn1cbmZ1bmN0aW9uIHJlc29sdmVNZXRob2QobWV0aG9kSWQsIGlzU3RhdGljKSB7XG4gICAgbGV0IG1ldGhvZCA9IENhY2hlLmdldChtZXRob2RJZCwgaXNTdGF0aWMpO1xuICAgIGlmIChtZXRob2QpXG4gICAgICAgIHJldHVybiBtZXRob2Q7XG4gICAgY29uc3QgZW52ID0gSmF2YS52bS50cnlHZXRFbnYoKTtcbiAgICBpZiAoIWVudilcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgaWYgKGNhY2hlZEJhc2UgPT09IG51bGwpXG4gICAgICAgIGNhY2hlZEJhc2UgPSBlbnYuaGFuZGxlLnJlYWRQb2ludGVyKCk7XG4gICAgaWYgKEZpbmRDbGFzcyA9PT0gbnVsbCAmJiBjYWNoZWRCYXNlKVxuICAgICAgICBGaW5kQ2xhc3MgPSBhc0Z1bmN0aW9uKGNhY2hlZEJhc2UsIEpOSS5GaW5kQ2xhc3MpO1xuICAgIGlmIChUb1JlZmxlY3RlZE1ldGhvZCA9PT0gbnVsbCAmJiBjYWNoZWRCYXNlKVxuICAgICAgICBUb1JlZmxlY3RlZE1ldGhvZCA9IGFzRnVuY3Rpb24oY2FjaGVkQmFzZSwgSk5JLlRvUmVmbGVjdGVkTWV0aG9kKTtcbiAgICBpZiAoZ2V0RGVjbGFyaW5nQ2xhc3NEZXNjID09PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IGdldERlY2xhcmluZ0NsYXNzRGVzY1N5bSA9IFByb2Nlc3MuZ2V0TW9kdWxlQnlOYW1lKCdsaWJhcnQuc28nKVxuICAgICAgICAgICAgLmVudW1lcmF0ZVN5bWJvbHMoKVxuICAgICAgICAgICAgLmZpbHRlcigoeCkgPT4geC5uYW1lLmluY2x1ZGVzKCdEZWNsYXJpbmdDbGFzc0Rlc2MnKSlbMF07XG4gICAgICAgIGdldERlY2xhcmluZ0NsYXNzRGVzYyA9IG5ldyBOYXRpdmVGdW5jdGlvbihnZXREZWNsYXJpbmdDbGFzc0Rlc2NTeW0uYWRkcmVzcywgJ3BvaW50ZXInLCBbJ3BvaW50ZXInXSwgeyBleGNlcHRpb25zOiAncHJvcGFnYXRlJyB9KTtcbiAgICB9XG4gICAgY29uc3QgdGhpc1NpZ1B0ciA9IGdldERlY2xhcmluZ0NsYXNzRGVzYyhtZXRob2RJZCk7XG4gICAgbGV0IHRoaXNTaWcgPSB0aGlzU2lnUHRyLnJlYWRDU3RyaW5nKCk7XG4gICAgdGhpc1NpZyA9IHRoaXNTaWc/LnN0YXJ0c1dpdGgoJ0wnKSAmJiB0aGlzU2lnLmVuZHNXaXRoKCc7JykgPyB0aGlzU2lnLnN1YnN0cmluZygxLCB0aGlzU2lnLmxlbmd0aCAtIDEpIDogdGhpc1NpZztcbiAgICB0aGlzU2lnID0gdGhpc1NpZz8ucmVwbGFjZUFsbCgnLycsICcuJykgPz8gdGhpc1NpZztcbiAgICBjb25zdCBjbHMgPSB0aGlzU2lnID8gZmluZENsYXNzKHRoaXNTaWcpIDogbnVsbDtcbiAgICBpZiAoIXRoaXNTaWcgfHwgIWNscylcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgbGV0IG1hdGNoZWQgPSBudWxsO1xuICAgIGVudW1lcmF0ZU1lbWJlcnMoY2xzLCB7XG4gICAgICAgIG9uTWF0Y2hNZXRob2QoY2xhenosIG1lbWJlcikge1xuICAgICAgICAgICAgZm9yIChjb25zdCBvdmVybG9hZCBvZiBjbGF6elttZW1iZXJdLl9vKSB7XG4gICAgICAgICAgICAgICAgaWYgKGAke292ZXJsb2FkLmhhbmRsZX1gID09IGAke21ldGhvZElkfWApIHtcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hlZCA9IG92ZXJsb2FkO1xuICAgICAgICAgICAgICAgICAgICBtZXRob2QgPSBuZXcgSmF2YU1ldGhvZCh0aGlzU2lnID8/ICcnLCBtZW1iZXIsIG92ZXJsb2FkLmFyZ3VtZW50VHlwZXMubWFwKCh4KSA9PiB4LmNsYXNzTmFtZSksIG92ZXJsb2FkLnJldHVyblR5cGUuY2xhc3NOYW1lLCBpc1N0YXRpYyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBDYWNoZS5zZXQobWV0aG9kSWQsIG1ldGhvZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgIH0pO1xuICAgIHJldHVybiBudWxsO1xuICAgIC8vIGNvbnN0IHB0ciA9IE1lbW9yeS5hbGxvY1V0ZjhTdHJpbmcodGhpc1NpZyk7XG4gICAgLy8gY29uc3Qgam5pQ2xhc3NIYW5kbGUgPSBGaW5kQ2xhc3M/LihlbnYsIHB0cik7XG4gICAgLy8gY29uc3Qgam5pTWV0aG9kUmVmbGVjdCA9IFRvUmVmbGVjdGVkTWV0aG9kPy4oZW52LCBqbmlDbGFzc0hhbmRsZSwgbWV0aG9kSWQsIGlzU3RhdGljID8gMSA6IDApO1xuICAgIC8vIGNvbnN0IG1ldGhvZCA9IEphdmEuY2FzdChqbmlNZXRob2RSZWZsZWN0LCBDbGFzc2VzLk1ldGhvZCk7XG4gICAgLy8gcmV0dXJuIG5ldyBKYXZhTWV0aG9kKCcnLCAnJywgJycsIGZhbHNlKTtcbn1cbmZ1bmN0aW9uIGZhc3RwYXRoTWV0aG9kKG1ldGhvZElkLCBjbGFzc05hbWUsIG5hbWUsIHNpZywgaXNTdGF0aWMpIHtcbiAgICBsZXQgdHh0ID0gc2lnO1xuICAgIGxldCBpc0FycmF5ID0gZmFsc2U7XG4gICAgbGV0IGlzT3BlbiA9IG51bGw7XG4gICAgY29uc3QgYXJyID0gW107XG4gICAgY29uc3QgYWRkZXIgPSAocmF3KSA9PiB7XG4gICAgICAgIGlmIChyYXcubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICByYXcgPSBQcmltaXRpdmVUeXBlc1tyYXddO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmF3ID0gcmF3LnJlcGxhY2VBbGwoJy8nLCAnLicpO1xuICAgICAgICB9XG4gICAgICAgIHJhdyA9IGlzQXJyYXkgPyBgJHtyYXd9W11gIDogcmF3O1xuICAgICAgICBpc0FycmF5ID0gZmFsc2U7XG4gICAgICAgIGFyci5wdXNoKHJhdyk7XG4gICAgfTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHR4dC5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBjID0gdHh0LmNoYXJBdChpKTtcbiAgICAgICAgaWYgKGMgPT09ICdbJykge1xuICAgICAgICAgICAgaXNBcnJheSA9IHRydWU7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzT3BlbiAmJiBjID09PSAnTCcpIHtcbiAgICAgICAgICAgIGlzT3BlbiA9IGkgKyAxO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzT3BlbiAmJiBjID09PSAnOycpIHtcbiAgICAgICAgICAgIGFkZGVyKHR4dC5zdWJzdHJpbmcoaXNPcGVuLCBpKSk7XG4gICAgICAgICAgICBpc09wZW4gPSBudWxsO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc09wZW4gJiYgYyBpbiBQcmltaXRpdmVUeXBlcykge1xuICAgICAgICAgICAgYWRkZXIoYyk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXQgPSBhcnIucG9wKCk7XG4gICAgY29uc3QgbWV0aG9kID0gbmV3IEphdmFNZXRob2QoY2xhc3NOYW1lLCBuYW1lLCBhcnIsIHJldCwgaXNTdGF0aWMpO1xuICAgIHJldHVybiBDYWNoZS5zZXQobWV0aG9kSWQsIG1ldGhvZCk7XG59XG52YXIgdGh1bmtQYWdlLCB0aHVua09mZnNldDtcbmZ1bmN0aW9uIG1ha2VUaHVuayhzaXplLCB3cml0ZSkge1xuICAgIGlmICghdGh1bmtQYWdlKSB7XG4gICAgICAgIHRodW5rUGFnZSA9IE1lbW9yeS5hbGxvYyhQcm9jZXNzLnBhZ2VTaXplKTtcbiAgICB9XG4gICAgY29uc3QgdGh1bmsgPSB0aHVua1BhZ2UuYWRkKHRodW5rT2Zmc2V0KTtcbiAgICBjb25zdCBhcmNoID0gUHJvY2Vzcy5hcmNoO1xuICAgIGNvbnN0IFdyaXRlciA9IEFybTY0V3JpdGVyO1xuICAgIE1lbW9yeS5wYXRjaENvZGUodGh1bmssIHNpemUsIChjb2RlKSA9PiB7XG4gICAgICAgIGNvbnN0IHdyaXRlciA9IG5ldyBXcml0ZXIoY29kZSwgeyBwYzogdGh1bmsgfSk7XG4gICAgICAgIHdyaXRlKHdyaXRlcik7XG4gICAgICAgIHdyaXRlci5mbHVzaCgpO1xuICAgICAgICBpZiAod3JpdGVyLm9mZnNldCA+IHNpemUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgV3JvdGUgJHt3cml0ZXIub2Zmc2V0fSwgZXhjZWVkaW5nIG1heGltdW0gb2YgJHtzaXplfWApO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgdGh1bmtPZmZzZXQgKz0gc2l6ZTtcbiAgICByZXR1cm4gYXJjaCA9PT0gJ2FybScgPyB0aHVuay5vcigxKSA6IHRodW5rO1xufVxuZnVuY3Rpb24gbWFrZUN4eE1ldGhvZFdyYXBwZXJSZXR1cm5pbmdTdGRTdHJpbmdCeVZhbHVlKGltcGwsIGFyZ1R5cGVzKSB7XG4gICAgbGV0IHRodW5rID0gbWFrZVRodW5rKDMyLCAod3JpdGVyKSA9PiB7XG4gICAgICAgIHdyaXRlci5wdXRNb3ZSZWdSZWcoJ3g4JywgJ3gwJyk7XG4gICAgICAgIGFyZ1R5cGVzLmZvckVhY2goKHQsIGkpID0+IHtcbiAgICAgICAgICAgIHdyaXRlci5wdXRNb3ZSZWdSZWcoYHgke2l9YCwgYHgke2kgKyAxfWApO1xuICAgICAgICB9KTtcbiAgICAgICAgd3JpdGVyLnB1dExkclJlZ0FkZHJlc3MoJ3g3JywgaW1wbCk7XG4gICAgICAgIHdyaXRlci5wdXRCclJlZygneDcnKTtcbiAgICB9KTtcbiAgICBjb25zdCBpbnZva2VUaHVuayA9IG5ldyBOYXRpdmVGdW5jdGlvbih0aHVuaywgJ3ZvaWQnLCBbJ3BvaW50ZXInXS5jb25jYXQoYXJnVHlwZXMpLCB7IGV4Y2VwdGlvbnM6ICdwcm9wYWdhdGUnIH0pO1xuICAgIGNvbnN0IHdyYXBwZXIgPSBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICBpbnZva2VUaHVuayguLi5hcmdzKTtcbiAgICB9O1xuICAgIHdyYXBwZXIuaGFuZGxlID0gdGh1bms7XG4gICAgd3JhcHBlci5pbXBsID0gaW1wbDtcbiAgICByZXR1cm4gd3JhcHBlcjtcbn1cbmZ1bmN0aW9uIG1ha2VDeHhNZXRob2RXcmFwcGVyUmV0dXJuaW5nUG9pbnRlckJ5VmFsdWVHZW5lcmljKGFkZHJlc3MsIGFyZ1R5cGVzKSB7XG4gICAgcmV0dXJuIG5ldyBOYXRpdmVGdW5jdGlvbihhZGRyZXNzLCAncG9pbnRlcicsIGFyZ1R5cGVzLCB7IGV4Y2VwdGlvbnM6ICdwcm9wYWdhdGUnIH0pO1xufVxuZnVuY3Rpb24gYXRsZWFzdHRyeSgpIHtcbiAgICByZXNvbHZlTWV0aG9kKENsYXNzZXMuU3RyaW5nLmNvbmNhdC5oYW5kbGUsIGZhbHNlKTtcbiAgICAvLyBjb25zdCBiYXNlID0gSmF2YS52bS5nZXRFbnYoKS5oYW5kbGUucmVhZFBvaW50ZXIoKTtcbiAgICAvLyBjb25zdCBHZXRNZXRob2RJRCA9IGFzRnVuY3Rpb24oYmFzZSwgJ0dldE1ldGhvZElEJyk7XG4gICAgLy8gY29uc29sZS53YXJuKCdHZXRNZXRob2RJRCcsIEdldE1ldGhvZElEKTtcbiAgICAvLyBJbnRlcmNlcHRvci5hdHRhY2goR2V0TWV0aG9kSUQsIHtcbiAgICAvLyAgICAgb25FbnRlcihhcmdzKSB7fSxcbiAgICAvLyAgICAgb25MZWF2ZShyZXR2YWwpIHtcbiAgICAvLyAgICAgICAgIC8vY29uc29sZS5sb2coJ29uIG1ldGhvZElkJywgcmV0dmFsKTtcbiAgICAvLyAgICAgfSxcbiAgICAvLyB9KTtcbiAgICAvLyBjb25zdCBSZWdpc3Rlck5hdGl2ZXMgPSBhc0Z1bmN0aW9uKGJhc2UsICdSZWdpc3Rlck5hdGl2ZXMnKTtcbiAgICAvLyBjb25zb2xlLndhcm4oJ1JlZ2lzdGVyTmF0aXZlcycsIFJlZ2lzdGVyTmF0aXZlcyk7XG4gICAgLy8gSW50ZXJjZXB0b3IuYXR0YWNoKFJlZ2lzdGVyTmF0aXZlcywge1xuICAgIC8vICAgICBvbkVudGVyKGFyZ3MpIHt9LFxuICAgIC8vICAgICBvbkxlYXZlKHJldHZhbCkge1xuICAgIC8vICAgICAgICAgY29uc29sZS5sb2coJ29uIFJlZ2lzdGVyTmF0aXZlcycsIHJldHZhbCk7XG4gICAgLy8gICAgIH0sXG4gICAgLy8gfSk7XG4gICAgLy8gY29uc3QgRmluZENsYXNzID0gYXNGdW5jdGlvbihiYXNlLCAnRmluZENsYXNzJyk7XG4gICAgLy8gY29uc3QgVG9SZWZsZWN0ZWRNZXRob2QgPSBhc0Z1bmN0aW9uKGJhc2UsICdUb1JlZmxlY3RlZE1ldGhvZCcpO1xuICAgIC8vIC8vIG1ldGhvZElkIC0+IGNoYXIgKlxuICAgIC8vIGNvbnN0IGdldERlY2xhcmluZ0NsYXNzRGVzYyA9IFByb2Nlc3MuZ2V0TW9kdWxlQnlOYW1lKCdsaWJhcnQuc28nKVxuICAgIC8vICAgICAuZW51bWVyYXRlU3ltYm9scygpXG4gICAgLy8gICAgIC5maWx0ZXIoKHgpID0+IHgubmFtZS5pbmNsdWRlcygnRGVjbGFyaW5nQ2xhc3NEZXNjJykpWzBdO1xuICAgIC8vIGNvbnN0IGRlY0NsYXNzRGVzYyA9IG1ha2VDeHhNZXRob2RXcmFwcGVyUmV0dXJuaW5nUG9pbnRlckJ5VmFsdWVHZW5lcmljKGdldERlY2xhcmluZ0NsYXNzRGVzYy5hZGRyZXNzLCBbJ3BvaW50ZXInXSk7XG4gICAgLy8gLy8gLy8gbWV0aG9kSWQgLT4gY2hhciAqXG4gICAgLy8gY29uc3QgZ2V0U2lnbmF0dXJlU3ltID0gUHJvY2Vzcy5nZXRNb2R1bGVCeU5hbWUoJ2xpYmFydC5zbycpXG4gICAgLy8gICAgIC5lbnVtZXJhdGVTeW1ib2xzKClcbiAgICAvLyAgICAgLmZpbHRlcigoeCkgPT4geC5uYW1lLmluY2x1ZGVzKCdfWk4zYXJ0OUFydE1ldGhvZDEyR2V0U2lnbmF0dXJlRXYnKSlbMF07XG4gICAgLy8gY29uc3QgZ2V0U2lnbmF0dXJlID0gbWFrZUN4eE1ldGhvZFdyYXBwZXJSZXR1cm5pbmdQb2ludGVyQnlWYWx1ZUdlbmVyaWMoZ2V0U2lnbmF0dXJlU3ltLmFkZHJlc3MsIFsncG9pbnRlciddKTtcbiAgICAvLyBjb25zdCBzaWduYXR1cmVUb1N0cmluZ1N5bSA9IFByb2Nlc3MuZ2V0TW9kdWxlQnlOYW1lKCdsaWJhcnQuc28nKVxuICAgIC8vICAgICAuZW51bWVyYXRlU3ltYm9scygpXG4gICAgLy8gICAgIC5maWx0ZXIoKHgpID0+IHgubmFtZS5pbmNsdWRlcygnX1pOSzNhcnQ5U2lnbmF0dXJlOFRvU3RyaW5nRXYnKSlbMF07XG4gICAgLy8gY29uc3Qgc2lnVG9TdHIgPSBtYWtlQ3h4TWV0aG9kV3JhcHBlclJldHVybmluZ1N0ZFN0cmluZ0J5VmFsdWUoc2lnbmF0dXJlVG9TdHJpbmdTeW0uYWRkcmVzcywgWydwb2ludGVyJ10pO1xuICAgIC8vIChycGMgYXMgYW55KS5kZWNDbGFzc0Rlc2MgPSBkZWNDbGFzc0Rlc2M7XG4gICAgLy8gKHJwYyBhcyBhbnkpLmdldFNpZ25hdHVyZSA9IGdldFNpZ25hdHVyZTtcbiAgICAvLyAocnBjIGFzIGFueSkucHJldHR5TWV0aG9kID0gcHJldHR5TWV0aG9kO1xuICAgIC8vIChycGMgYXMgYW55KS5zaWdUb1N0ciA9IHNpZ1RvU3RyO1xuICAgIGxldCB3LCBoO1xuICAgIGNvbnN0IGNsZWFudXAgPSAoc3RyKSA9PiB7XG4gICAgICAgIHN0ciA9IHN0ci5zdGFydHNXaXRoKCdMJykgJiYgc3RyLmVuZHNXaXRoKCc7JykgPyBzdHIuc3Vic3RyaW5nKDEsIHN0ci5sZW5ndGggLSAxKSA6IHN0cjtcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlQWxsKCcvJywgJy4nKTtcbiAgICB9O1xuICAgIC8vIGNvbnNvbGUud2FybignYmVnaW46JywgKHcgPSBKYXZhLnVzZSgnamF2YS5sYW5nLlN0cmluZycpKSk7XG4gICAgLy8gY29uc29sZS53YXJuKCdiZWdpbjonLCAodyA9IHcuc3Vic3RyaW5nLl9vWzFdKSk7XG4gICAgLy8gY29uc29sZS53YXJuKCdiZWdpbjonLCAoaCA9IHcuaGFuZGxlKSk7XG4gICAgLy8gY29uc29sZS53YXJuKCdiZWdpbjonLCAodyA9IChkZWNDbGFzc0Rlc2MgYXMgYW55KShoKSkpO1xuICAgIC8vIGNvbnNvbGUud2FybignYmVnaW46JywgKHcgPSB3LnJlYWRDU3RyaW5nKCkpKTtcbiAgICAvLyBjb25zb2xlLndhcm4oJ2JlZ2luOicsICh3ID0gTWVtb3J5LmFsbG9jVXRmOFN0cmluZyhjbGVhbnVwKHcpKSkpO1xuICAgIC8vIGNvbnNvbGUud2FybignYmVnaW46Jywgdy5yZWFkQ1N0cmluZygpKTtcbiAgICAvLyBjb25zb2xlLndhcm4oJ2JlZ2luOicsICh3ID0gKEZpbmRDbGFzcyBhcyBhbnkpKEphdmEudm0uZ2V0RW52KCksIHcpKSk7XG4gICAgLy8gY29uc29sZS53YXJuKCdiZWdpbjonLCAodyA9IChUb1JlZmxlY3RlZE1ldGhvZCBhcyBhbnkpKEphdmEudm0uZ2V0RW52KCksIHcsIGgsIDApKSk7XG4gICAgLy8gY29uc29sZS53YXJuKCdiZWdpbjonLCAodyA9IChUb1JlZmxlY3RlZE1ldGhvZCBhcyBhbnkpKEphdmEudm0uZ2V0RW52KCksIHcsIGgsIDEpKSk7XG4gICAgLy8gY29uc29sZS53YXJuKCdiZWdpbjonLCAodyA9IEphdmEuY2FzdCh3LCBKYXZhLnVzZSgnamF2YS5sYW5nLnJlZmxlY3QuTWV0aG9kJykpKSlfO1xuICAgIC8vIGNvbnNvbGUud2FybignYmVnaW46JywgdyA9IChnZXRTaWduYXR1cmUgYXMgYW55KShoKSlcbiAgICAvLyBjb25zb2xlLndhcm4oJ2JlZ2luOicsIHcgPSAoc2lnVG9TdHIgYXMgYW55KSh3KSlcbn1cbmV4cG9ydCB7IHJlc29sdmVNZXRob2QsIGZhc3RwYXRoTWV0aG9kIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD10cmFjZXIuanMubWFwIiwiaW1wb3J0IHsgdXNlIH0gZnJvbSAnLi9jb2xvci5qcyc7XG5jb25zdCBjb2xvcnMgPSB1c2UoKTtcbmNvbnN0IGFycmF5ID0gW2NvbG9ycy5yZWQsIGNvbG9ycy5ncmVlbiwgY29sb3JzLnllbGxvdywgY29sb3JzLmJsdWUsIGNvbG9ycy5tYWdlbnRhLCBjb2xvcnMuY3lhbiwgY29sb3JzLmdyYXldO1xuY29uc3QgY29sb3JtYXAgPSBuZXcgTWFwKCk7XG5jb2xvcm1hcC5zZXQoJ2VuY3J5cHQnLCBjb2xvcnMuYmx1ZUJyaWdodCk7XG5jb2xvcm1hcC5zZXQoJ2RlY3J5cHQnLCBjb2xvcnMucmVkQnJpZ2h0KTtcbmZ1bmN0aW9uIGdldENvbG9yKHRhZykge1xuICAgIGxldCByb2xsID0gY29sb3JtYXAuZ2V0KHRhZyk7XG4gICAgaWYgKHJvbGwpXG4gICAgICAgIHJldHVybiByb2xsO1xuICAgIGNvbnN0IGhhc2ggPSBoYXNoQ29kZSh0YWcpO1xuICAgIHJvbGwgPSBhcnJheVtNYXRoLmFicyhoYXNoICUgYXJyYXkubGVuZ3RoKV07XG4gICAgY29sb3JtYXAuc2V0KHRhZywgcm9sbCk7XG4gICAgcmV0dXJuIHJvbGw7XG59XG5mdW5jdGlvbiBoYXNoQ29kZShzdHIpIHtcbiAgICBsZXQgaGFzaCA9IDAsIGksIGNocjtcbiAgICBpZiAoc3RyLmxlbmd0aCA9PT0gMClcbiAgICAgICAgcmV0dXJuIGhhc2g7XG4gICAgZm9yIChpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgICBjaHIgPSBzdHIuY2hhckNvZGVBdChpKTtcbiAgICAgICAgaGFzaCA9IChoYXNoIDw8IDUpIC0gaGFzaCArIGNocjtcbiAgICAgICAgaGFzaCB8PSAwO1xuICAgIH1cbiAgICByZXR1cm4gaGFzaDtcbn1cbmV4cG9ydCB7IGdldENvbG9yIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hdXRvY29sb3IuanMubWFwIiwiaW1wb3J0IHsgY3JlYXRlQ29sb3JzIH0gZnJvbSAnY29sb3JldHRlJztcbmNvbnN0IENvbG9ycyA9IGNyZWF0ZUNvbG9ycyh7IHVzZUNvbG9yOiB0cnVlIH0pO1xuY29uc3QgeyBjeWFuLCBncmVlbiwgYmx1ZSwgdW5kZXJsaW5lLCB5ZWxsb3csIG1hZ2VudGEgfSA9IHVzZSgpO1xuZnVuY3Rpb24gdXNlKCkge1xuICAgIHJldHVybiBDb2xvcnM7XG59XG5jb25zdCBjbGFzc05hbWUgPSAoY2xhc3NOYW1lKSA9PiB7XG4gICAgaWYgKCFjbGFzc05hbWUpXG4gICAgICAgIHJldHVybiBjbGFzc05hbWU7XG4gICAgY29uc3Qgc3BsaXRzID0gYCR7Y2xhc3NOYW1lfWAuc3BsaXQoJy4nKTtcbiAgICByZXR1cm4gc3BsaXRzLm1hcChjeWFuKS5qb2luKCcuJyk7XG59O1xuY29uc3QgbWV0aG9kID0gKG1ldGhvZE5hbWUpID0+IHtcbiAgICBpZiAoIW1ldGhvZE5hbWUpXG4gICAgICAgIHJldHVybiBtZXRob2ROYW1lO1xuICAgIHJldHVybiBncmVlbihgJHttZXRob2ROYW1lfWApO1xufTtcbmNvbnN0IGFyZ3MgPSAoYXJncykgPT4ge1xuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIGNvbnN0IGpvaW5CeSA9IHRydWUgPyAnLCBcXG4nIDogJywgJztcbiAgICBjb25zdCBqb2luZWQgPSBhcmdzLm1hcCgoYXJnKSA9PiBgICAgICR7YXJnfWApLmpvaW4oam9pbkJ5KTtcbiAgICByZXR1cm4gYFxcbiR7am9pbmVkfVxcbmA7XG59O1xuY29uc3QgYnJhY2tldCA9IChjaGFyKSA9PiB7XG4gICAgaWYgKCFjaGFyKVxuICAgICAgICByZXR1cm4gY2hhcjtcbiAgICByZXR1cm4gYmx1ZShgJHtjaGFyfWApO1xufTtcbmNvbnN0IHVybCA9ICh1cmwpID0+IHtcbiAgICByZXR1cm4gdW5kZXJsaW5lKGAke3VybH1gKTtcbn07XG5jb25zdCBzdHJpbmcgPSAoc3RyaW5nKSA9PiB7XG4gICAgcmV0dXJuIHllbGxvdyhgXCIke3N0cmluZ31cImApO1xufTtcbmNvbnN0IG51bWJlciA9IChudW1iZXIpID0+IHtcbiAgICByZXR1cm4gbWFnZW50YShgJHtudW1iZXJ9YCk7XG59O1xuZXhwb3J0IHsgY2xhc3NOYW1lLCBtZXRob2QsIGFyZ3MsIGJyYWNrZXQsIHVybCwgc3RyaW5nLCBudW1iZXIsIHVzZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29sb3IuanMubWFwIiwiaW1wb3J0IHsgc3RhY2t0cmFjZSB9IGZyb20gJ0BjbG9ja3dvcmsvY29tbW9uJztcbmNvbnN0IHByZWZzTWVhc3VyZW1lbnRJbnRlcm5hbElnbm9yZWQgPSBbXG4gICAgJ2NvbnNlbnRfc2V0dGluZ3MnLFxuICAgICdjb25zZW50X3NvdXJjZScsXG4gICAgJ2xhc3RfdXBsb2FkX2F0dGVtcHQnLFxuICAgICdiYWNrb2ZmJyxcbiAgICAnbWlkbmlnaHRfb2Zmc2V0JyxcbiAgICAnbGFzdF91cGxvYWQnLFxuICAgICdsYXN0X2RlbGV0ZV9zdGFsZScsXG4gICAgJ2hlYWx0aF9tb25pdG9yOnN0YXJ0JyxcbiAgICAnaGVhbHRoX21vbml0b3I6Y291bnQnLFxuICAgICdhcHBfYmFja2dyb3VuZGVkJyxcbiAgICAnc3RhcnRfbmV3X3Nlc3Npb24nLFxuICAgICdkZWZlcnJlZF9hbmFseXRpY3NfY29sbGVjdGlvbicsXG4gICAgJ21lYXN1cmVtZW50X2VuYWJsZWQnLFxuICAgICdkZWZhdWx0X2V2ZW50X3BhcmFtZXRlcnMnLFxuICAgICdzZXNzaW9uX3RpbWVvdXQnLFxuICAgICdwcmV2aW91c19vc192ZXJzaW9uJyxcbiAgICAndXNlX3NlcnZpY2UnLFxuICAgICdkZWZlcnJlZF9hdHRyaWJ1dGlvbl9jYWNoZV90aW1lc3RhbXAnLFxuICAgICdmaXJzdF9vcGVuX3RpbWUnLFxuXTtcbmNvbnN0IGFwcGxvdmluUHJpdmFjeUlnbm9yZWQgPSBbXG4gICAgJ2NvbS5hcHBsb3Zpbi5zZGsuY29tcGxpYW5jZS5oYXNfdXNlcl9jb25zZW50JyxcbiAgICAnY29tLmFwcGxvdmluLnNkay5jb21wbGlhbmNlLmlzX2FnZV9yZXN0cmljdGVkX3VzZXInLFxuICAgICdjb20uYXBwbG92aW4uc2RrLmNvbXBsaWFuY2UuaXNfZG9fbm90X3NlbGwnXG5dO1xuY29uc3QgRmlsdGVyID0ge1xuICAgIGpzb246IChfLCAuLi5hcmdzKSA9PiB7XG4gICAgICAgIGxldCB0cmFjZSA9IHN0YWNrdHJhY2UoKTtcbiAgICAgICAgdHJhY2UgPSB0cmFjZS5zdWJzdHJpbmcodHJhY2UuaW5kZXhPZignXFxuJykpO1xuICAgICAgICBpZiAodHJhY2UuaW5jbHVkZXMoJ2F0IG9yZy5qc29uLkpTT05PYmplY3QuZ2V0JykpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmICh0cmFjZS5pbmNsdWRlcygnYXQgb3JnLmpzb24uSlNPTk9iamVjdC5vcHQnKSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKHRyYWNlLmluY2x1ZGVzKCdhdCBjb20uZmFjZWJvb2suaW50ZXJuYWwuJykpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmICh0cmFjZS5pbmNsdWRlcygnYXQgY29tLmdvb2dsZS5hbmRyb2lkLmdtcy5pbnRlcm5hbC5hZHMuJykpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmICh0cmFjZS5pbmNsdWRlcygnYXQgY29tLmdvb2dsZS5maXJlYmFzZS5pbnN0YWxsYXRpb25zLmxvY2FsLlBlcnNpc3RlZEluc3RhbGxhdGlvbicpKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAodHJhY2UuaW5jbHVkZXMoJ2F0IGNvbS51bml0eTNkLnNlcnZpY2VzLmNvcmUuY29uZmlndXJhdGlvbi5Qcml2YWN5Q29uZmlndXJhdGlvbkxvYWRlcicpKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIHByZWZzOiAobWV0aG9kLCAuLi5hcmdzKSA9PiB7XG4gICAgICAgIGNvbnN0IHRyYWNlID0gc3RhY2t0cmFjZSgpO1xuICAgICAgICBpZiAodHJhY2UuaW5jbHVkZXMoJ2F0IGNvbS55YW5kZXgubW9iaWxlLmFkcy5jb3JlLmluaXRpYWxpemVyLk1vYmlsZUFkc0luaXRpYWxpemVQcm92aWRlci4nKSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKHRyYWNlLmluY2x1ZGVzKCdhdCBjb20uZmFjZWJvb2suRmFjZWJvb2tTZGsuZ2V0TGltaXRFdmVudEFuZERhdGFVc2FnZScpKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAodHJhY2UuaW5jbHVkZXMoJ2F0IGNvbS5mYWNlYm9vay5pbnRlcm5hbC4nKSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKHRyYWNlLmluY2x1ZGVzKCdhdCBjb20uYXBwc2ZseWVyLmludGVybmFsLicpKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAodHJhY2UuaW5jbHVkZXMoJ2F0IGNvbS5vbmVzaWduYWwuT25lU2lnbmFsUHJlZnMuJykpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmICh0cmFjZS5pbmNsdWRlcygnYXQgY29tLmdvb2dsZS5hbmRyb2lkLmdtcy5pbnRlcm5hbC5hZHMuJykpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmICh0cmFjZS5pbmNsdWRlcygnYXQgY29tLmdvb2dsZS5hbmRyb2lkLmdtcy5pbnRlcm5hbC5hcHBzZXQnKSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKHRyYWNlLmluY2x1ZGVzKCdhdCBjb20uZ29vZ2xlLmFuZHJvaWQuZ21zLm1lYXN1cmVtZW50LmludGVybmFsLicpKSB7XG4gICAgICAgICAgICBpZiAoYXJnc1swXSAmJiBwcmVmc01lYXN1cmVtZW50SW50ZXJuYWxJZ25vcmVkLmluY2x1ZGVzKGFyZ3NbMF0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0cmFjZS5pbmNsdWRlcygnYXQgY29tLmdvb2dsZS5maXJlYmFzZS5oZWFydGJlYXRpbmZvLkRlZmF1bHRIZWFydEJlYXRDb250cm9sbGVyLicpKSB7XG4gICAgICAgICAgICBpZiAoYXJnc1swXSAmJiBbJ2xhc3QtdXNlZC1kYXRlJ10uaW5jbHVkZXMoYXJnc1swXSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRyYWNlLmluY2x1ZGVzKCdhdCBjb20uYXBwbG92aW4uaW1wbC5wcml2YWN5LmEnKSkge1xuICAgICAgICAgICAgaWYgKGFyZ3NbMF0gJiYgYXBwbG92aW5Qcml2YWN5SWdub3JlZC5pbmNsdWRlcyhhcmdzWzBdKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodHJhY2UuaW5jbHVkZXMoJ2F0IGNvbS5hcHBsb3Zpbi5zZGsuQXBwTG92aW5TZGsuZ2V0SW5zdGFuY2UnKSAmJiB0cmFjZS5pbmNsdWRlcygnYXQgY29tLmFwcGxvdmluLmltcGwuc2RrLicpKSB7XG4gICAgICAgICAgICBpZiAoYXJnc1swXSAmJiBhcmdzWzBdLnN0YXJ0c1dpdGgoJ2NvbS5hcHBsb3Zpbi5zZGsuJykpIHtcbiAgICAgICAgICAgICAgICBpZiAobWV0aG9kLm1ldGhvZE5hbWUgPT09ICdjb250YWlucycpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIHVybDogKCkgPT4ge1xuICAgICAgICBjb25zdCB0cmFjZSA9IHN0YWNrdHJhY2UoKTtcbiAgICAgICAgaWYgKHRyYWNlLmluY2x1ZGVzKCdhdCBjb20uZmFjZWJvb2suaW50ZXJuYWwuJykpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmICh0cmFjZS5pbmNsdWRlcygnYXQgY29tLmFwcHNmbHllci5pbnRlcm5hbC4nKSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKHRyYWNlLmluY2x1ZGVzKCdhdCBjb20ub25lc2lnbmFsLk9uZVNpZ25hbFByZWZzLicpKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAodHJhY2UuaW5jbHVkZXMoJ2F0IGNvbS5nb29nbGUuYW5kcm9pZC5nbXMuaW50ZXJuYWwuYWRzLicpKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBjb25zb2xlLmxvZyh0cmFjZSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgZGF0ZTogKCkgPT4ge1xuICAgICAgICBsZXQgdHJhY2UgPSBzdGFja3RyYWNlKCk7XG4gICAgICAgIHRyYWNlID0gdHJhY2Uuc3Vic3RyaW5nKHRyYWNlLmluZGV4T2YoJ1xcbicpKTtcbiAgICAgICAgaWYgKHRyYWNlLmluY2x1ZGVzKCdhdCBjb20uZmFjZWJvb2suRmFjZWJvb2tTZGsuZ2V0R3JhcGhBcGlWZXJzaW9uKCcpKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAodHJhY2UuaW5jbHVkZXMoJ2F0IGNvbS5zYWZlZGsuYW5kcm9pZC51dGlscy5TZGtzTWFwcGluZy5wcmludEFsbFNka1ZlcnNpb25zJykpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmICh0cmFjZS5pbmNsdWRlcygnYXQgY29tLmFwcGxvdmluLnNkay5BcHBMb3ZpbkluaXRQcm92aWRlci5vbkNyZWF0ZScpKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAodHJhY2UuaW5jbHVkZXMoJ2F0IGNvbS5nb29nbGUuZmlyZWJhc2UucHJvdmlkZXIuRmlyZWJhc2VJbml0UHJvdmlkZXIub25DcmVhdGUnKSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKHRyYWNlLmluY2x1ZGVzKCdhdCBjb20uZ29vZ2xlLmZpcmViYXNlLmNyYXNobHl0aWNzLkNyYXNobHl0aWNzUmVnaXN0cmFyJykpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmICh0cmFjZS5pbmNsdWRlcygnYXQgY29tLmZhY2Vib29rLmFwcGV2ZW50cy5pbnRlcm5hbC4nKSAmJiB0cmFjZS5pbmNsdWRlcygnYXQgYW5kcm9pZC5pY3UudXRpbC5DdXJyZW5jeS5nZXRBdmFpbGFibGVDdXJyZW5jeUNvZGVzJykpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRyYWNlKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59O1xuZXhwb3J0IHsgRmlsdGVyIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXIuanMubWFwIiwiaW1wb3J0IHsgcGlubyB9IGZyb20gJ3Bpbm8nO1xuaW1wb3J0IHsgZ2V0Q29sb3IgfSBmcm9tICcuL2F1dG9jb2xvci5qcyc7XG5pbXBvcnQgKiBhcyBDb2xvciBmcm9tICcuL2NvbG9yLmpzJztcbmltcG9ydCB7IEZpbHRlciB9IGZyb20gJy4vZmlsdGVyLmpzJztcbmNvbnN0IGxvZ2dlciA9IHBpbm8oe1xuICAgIGJyb3dzZXI6IHtcbiAgICAgICAgd3JpdGU6IChvKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBtc2cgPSBvWydtc2cnXSwgbGV2ZWwgPSBvWydsZXZlbCddLCB0YWcgPSBvWyd0YWcnXSwgaWQgPSBvWydpZCddO1xuICAgICAgICAgICAgbGV0IHByaW50ID0gYCR7bXNnfWA7XG4gICAgICAgICAgICBpZiAodGFnKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29sb3IgPSBnZXRDb2xvcih0YWcpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGN0YWcgPSBgWyR7Y29sb3IoYCR7dGFnfWApfSR7aWQgPyAnOicgKyBpZCA6ICcnfV0gYDtcbiAgICAgICAgICAgICAgICBwcmludCA9IGAke21zZ31gLnJlcGxhY2VBbGwoL14vZywgY3RhZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJpbnQpXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocHJpbnQpO1xuICAgICAgICB9LFxuICAgIH0sXG59KTtcbmZ1bmN0aW9uIGxvZyhtZXNzYWdlLCAuLi5vcHRpb25hbFBhcmFtcykge1xuICAgIGxvZ2dlci5pbmZvKG1lc3NhZ2UsIC4uLm9wdGlvbmFsUGFyYW1zKTtcbn1cbmZ1bmN0aW9uIGVycm9yKG1lc3NhZ2UpIHtcbiAgICBsb2dnZXIuZXJyb3IobWVzc2FnZSk7XG59XG5mdW5jdGlvbiBzdWJMb2dnZXIodGFnKSB7XG4gICAgcmV0dXJuIGxvZ2dlci5jaGlsZCh7IHRhZzogdGFnIH0pO1xufVxuZXhwb3J0IHsgbG9nLCBlcnJvciwgc3ViTG9nZ2VyLCBsb2dnZXIsIENvbG9yLCBGaWx0ZXIgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsImltcG9ydCB7IEluamVjdCB9IGZyb20gJy4vaW5qZWN0LmpzJztcbnZhciBVdGlscztcbihmdW5jdGlvbiAoVXRpbHMpIHtcbiAgICBjb25zdCBjYWxsTW5lbW9uaWNzID0gWydjYWxsJywgJ2JsJywgJ2JseCcsICdibHInLCAnYngnXTtcbiAgICBVdGlscy5pbnNlcnRBdCA9IChzdHIsIHN1YiwgcG9zKSA9PiBgJHtzdHIuc2xpY2UoMCwgcG9zKX0ke3N1Yn0ke3N0ci5zbGljZShwb3MpfWA7XG4gICAgZnVuY3Rpb24gYmEyaGV4KGIpIHtcbiAgICAgICAgbGV0IHVpbnQ4YXJyID0gbmV3IFVpbnQ4QXJyYXkoYik7XG4gICAgICAgIGlmICghdWludDhhcnIpIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICBsZXQgaGV4U3RyID0gJyc7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdWludDhhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBoZXggPSAodWludDhhcnJbaV0gJiAweGZmKS50b1N0cmluZygxNik7XG4gICAgICAgICAgICBoZXggPSBoZXgubGVuZ3RoID09PSAxID8gJzAnICsgaGV4IDogaGV4O1xuICAgICAgICAgICAgaGV4U3RyICs9IGhleDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGV4U3RyO1xuICAgIH1cbiAgICBVdGlscy5iYTJoZXggPSBiYTJoZXg7XG4gICAgZnVuY3Rpb24gZ2V0U3BhY2VyKHNwYWNlKSB7XG4gICAgICAgIGlmIChzcGFjZSA8IDApXG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIHJldHVybiAnICcucmVwZWF0KHNwYWNlKTtcbiAgICB9XG4gICAgVXRpbHMuZ2V0U3BhY2VyID0gZ2V0U3BhY2VyO1xuICAgIGZ1bmN0aW9uIGlzQ2FsbEluc3RydWN0aW9uKGluc3RydWN0aW9uKSB7XG4gICAgICAgIHJldHVybiBjYWxsTW5lbW9uaWNzLmluZGV4T2YoaW5zdHJ1Y3Rpb24ubW5lbW9uaWMpID49IDA7XG4gICAgfVxuICAgIFV0aWxzLmlzQ2FsbEluc3RydWN0aW9uID0gaXNDYWxsSW5zdHJ1Y3Rpb247XG4gICAgZnVuY3Rpb24gaXNKdW1wSW5zdHJ1Y3Rpb24oaW5zdHJ1Y3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIGluc3RydWN0aW9uLmdyb3Vwcy5pbmRleE9mKCdqdW1wJykgPj0gMCB8fCBpbnN0cnVjdGlvbi5ncm91cHMuaW5kZXhPZigncmV0JykgPj0gMDtcbiAgICB9XG4gICAgVXRpbHMuaXNKdW1wSW5zdHJ1Y3Rpb24gPSBpc0p1bXBJbnN0cnVjdGlvbjtcbiAgICBmdW5jdGlvbiBpc1JldEluc3RydWN0aW9uKGluc3R1Y3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIGluc3R1Y3Rpb24uZ3JvdXBzLmluZGV4T2YoJ3JldHVybicpID49IDA7XG4gICAgfVxuICAgIFV0aWxzLmlzUmV0SW5zdHJ1Y3Rpb24gPSBpc1JldEluc3RydWN0aW9uO1xufSkoVXRpbHMgfHwgKFV0aWxzID0ge30pKTtcbnZhciBDb2xvcjtcbihmdW5jdGlvbiAoQ29sb3IpIHtcbiAgICBjb25zdCBfcmVkID0gJ1xceDFiWzA7MzFtJztcbiAgICBjb25zdCBfZ3JlZW4gPSAnXFx4MWJbMDszMm0nO1xuICAgIGNvbnN0IF95ZWxsb3cgPSAnXFx4MWJbMDszM20nO1xuICAgIGNvbnN0IF9ibHVlID0gJ1xceDFiWzA7MzRtJztcbiAgICBjb25zdCBfcGluayA9ICdcXHgxYlswOzM1bSc7XG4gICAgY29uc3QgX2N5YW4gPSAnXFx4MWJbMDszNm0nO1xuICAgIGNvbnN0IF9ib2xkID0gJ1xceDFiWzA7MW0nO1xuICAgIGNvbnN0IF9oaWdobGlnaHQgPSAnXFx4MWJbMDszbSc7XG4gICAgY29uc3QgX2hpZ2hsaWdodF9vZmYgPSAnXFx4MWJbMDsyM20nO1xuICAgIGNvbnN0IF9yZXNldENvbG9yID0gJ1xceDFiWzBtJztcbiAgICBmdW5jdGlvbiBhcHBseUNvbG9yRmlsdGVycyh0ZXh0KSB7XG4gICAgICAgIHRleHQgPSB0ZXh0LnRvU3RyaW5nKCk7XG4gICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoLyhcXFd8XikoW2Etel17MSw0fVxcZHswLDJ9KShcXFd8JCkvZ20sICckMScgKyBjb2xvcmlmeSgnJDInLCAnYmx1ZScpICsgJyQzJyk7XG4gICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoLygweFswMTIzNDU2Nzg5YWJjZGVmXSspL2dtLCBjb2xvcmlmeSgnJDEnLCAncmVkJykpO1xuICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC8jKFxcZCspL2dtLCAnIycgKyBjb2xvcmlmeSgnJDEnLCAncmVkJykpO1xuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gICAgQ29sb3IuYXBwbHlDb2xvckZpbHRlcnMgPSBhcHBseUNvbG9yRmlsdGVycztcbiAgICBmdW5jdGlvbiBjb2xvcmlmeSh3aGF0LCBwYXQpIHtcbiAgICAgICAgaWYgKHBhdCA9PT0gJ2ZpbHRlcicpIHtcbiAgICAgICAgICAgIHJldHVybiBhcHBseUNvbG9yRmlsdGVycyh3aGF0KTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcmV0ID0gJyc7XG4gICAgICAgIGlmIChwYXQuaW5kZXhPZigncmVkJykgPj0gMCkge1xuICAgICAgICAgICAgcmV0ICs9IF9yZWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocGF0LmluZGV4T2YoJ2dyZWVuJykgPj0gMCkge1xuICAgICAgICAgICAgcmV0ICs9IF9ncmVlbjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChwYXQuaW5kZXhPZigneWVsbG93JykgPj0gMCkge1xuICAgICAgICAgICAgcmV0ICs9IF95ZWxsb3c7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocGF0LmluZGV4T2YoJ2JsdWUnKSA+PSAwKSB7XG4gICAgICAgICAgICByZXQgKz0gX2JsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocGF0LmluZGV4T2YoJ3BpbmsnKSA+PSAwKSB7XG4gICAgICAgICAgICByZXQgKz0gX3Bpbms7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocGF0LmluZGV4T2YoJ2N5YW4nKSA+PSAwKSB7XG4gICAgICAgICAgICByZXQgKz0gX2N5YW47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhdC5pbmRleE9mKCdib2xkJykgPj0gMCkge1xuICAgICAgICAgICAgcmV0ICs9IF9ib2xkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHBhdC5pbmRleE9mKCdoaWdobGlnaHQnKSA+PSAwKSB7XG4gICAgICAgICAgICByZXQgKz0gX2hpZ2hsaWdodDtcbiAgICAgICAgfVxuICAgICAgICByZXQgKz0gd2hhdDtcbiAgICAgICAgaWYgKHBhdC5pbmRleE9mKCdoaWdobGlnaHQnKSA+PSAwKSB7XG4gICAgICAgICAgICByZXQgKz0gX2hpZ2hsaWdodF9vZmY7XG4gICAgICAgIH1cbiAgICAgICAgcmV0ICs9IF9yZXNldENvbG9yO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgICBDb2xvci5jb2xvcmlmeSA9IGNvbG9yaWZ5O1xufSkoQ29sb3IgfHwgKENvbG9yID0ge30pKTtcbmV4cG9ydCB2YXIgSG9vYWhUcmFjZTtcbihmdW5jdGlvbiAoSG9vYWhUcmFjZSkge1xuICAgIGNvbnN0IGdldFNwYWNlciA9IFV0aWxzLmdldFNwYWNlcjtcbiAgICBjb25zdCB0cmVlVHJhY2UgPSBbXTtcbiAgICBsZXQgdGFyZ2V0VGlkID0gMDtcbiAgICBsZXQgb25JbnN0cnVjdGlvbkNhbGxiYWNrID0gbnVsbDtcbiAgICBsZXQgbW9kdWxlTWFwID0gbmV3IE1vZHVsZU1hcCgpO1xuICAgIGxldCBmaWx0ZXJzTW9kdWxlTWFwID0gbnVsbDtcbiAgICBjb25zdCBjdXJyZW50RXhlY3V0aW9uQmxvY2tTdGFja1JlZ2lzdGVycyA9IFtdO1xuICAgIGNvbnN0IGN1cnJlbnRFeGVjdXRpb25CbG9jayA9IFtdO1xuICAgIGxldCBjdXJyZW50QmxvY2tTdGFydFdpZHRoID0gMDtcbiAgICBsZXQgY3VycmVudEJsb2NrTWF4V2lkdGggPSAwO1xuICAgIGxldCBoaXRSZXRJbnN0cnVjdGlvbiA9IGZhbHNlO1xuICAgIGxldCBzZXNzaW9uUHJpbnRCbG9ja3MgPSB0cnVlO1xuICAgIGxldCBzZXNzaW9uUHJpbnRPcHRpb25zO1xuICAgIGxldCBzZXNzaW9uUHJldlNlcENvdW50ID0gMDtcbiAgICBmdW5jdGlvbiB0cmFjZShwYXJhbXMgPSB7fSwgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKHRhcmdldFRpZCA+IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdIb29haCBpcyBhbHJlYWR5IHRyYWNpbmcgdGhyZWFkOiAnICsgdGFyZ2V0VGlkKTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YXJnZXRUaWQgPiAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnSG9vYWggaXMgYWxyZWFkeSB0cmFjaW5nIHRocmVhZDogJyArIHRhcmdldFRpZCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgeyBwcmludEJsb2NrcyA9IHRydWUsIGNvdW50ID0gLTEsIGZpbHRlck1vZHVsZXMgPSBbXSwgaW5zdHJ1Y3Rpb25zID0gW10sIHByaW50T3B0aW9ucyA9IHt9IH0gPSBwYXJhbXM7XG4gICAgICAgIHNlc3Npb25QcmludEJsb2NrcyA9IHByaW50QmxvY2tzO1xuICAgICAgICBzZXNzaW9uUHJpbnRPcHRpb25zID0gcHJpbnRPcHRpb25zO1xuICAgICAgICBpZiAoc2Vzc2lvblByaW50T3B0aW9ucy50cmVlU3BhY2VzICYmIHNlc3Npb25QcmludE9wdGlvbnMudHJlZVNwYWNlcyA8IDQpIHtcbiAgICAgICAgICAgIHNlc3Npb25QcmludE9wdGlvbnMudHJlZVNwYWNlcyA9IDQ7XG4gICAgICAgIH1cbiAgICAgICAgdGFyZ2V0VGlkID0gUHJvY2Vzcy5nZXRDdXJyZW50VGhyZWFkSWQoKTtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBvbkluc3RydWN0aW9uQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG9uSW5zdHJ1Y3Rpb25DYWxsYmFjayA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgbW9kdWxlTWFwLnVwZGF0ZSgpO1xuICAgICAgICBmaWx0ZXJzTW9kdWxlTWFwID0gbmV3IE1vZHVsZU1hcCgobW9kdWxlKSA9PiB7XG4gICAgICAgICAgICAvLyBkbyBub3QgZm9sbG93IGZyaWRhIGFnZW50XG4gICAgICAgICAgICBpZiAobW9kdWxlLm5hbWUuaW5jbHVkZXMoJ2ZyaWRhLWFnZW50JykgfHwgbW9kdWxlLm5hbWUuaW5jbHVkZXMoJ2hsdWRhLWFnZW50JykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgZmlsdGVyTW9kdWxlcy5mb3JFYWNoKChmaWx0ZXIpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobW9kdWxlLm5hbWUuaW5kZXhPZihmaWx0ZXIpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGZvdW5kO1xuICAgICAgICB9KTtcbiAgICAgICAgSW5qZWN0LmFmdGVySW5pdEFycmF5KCgpID0+IHtcbiAgICAgICAgICAgIG1vZHVsZU1hcC51cGRhdGUoKTtcbiAgICAgICAgICAgIGlmIChmaWx0ZXJzTW9kdWxlTWFwKSB7XG4gICAgICAgICAgICAgICAgZmlsdGVyc01vZHVsZU1hcC51cGRhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBpbnN0cnVjdGlvbnNDb3VudCA9IDA7XG4gICAgICAgIGxldCBzdGFydEFkZHJlc3MgPSBOVUxMO1xuICAgICAgICBTdGFsa2VyLmZvbGxvdyh0YXJnZXRUaWQsIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybTogZnVuY3Rpb24gKGl0ZXJhdG9yKSB7XG4gICAgICAgICAgICAgICAgbGV0IGluc3RydWN0aW9uO1xuICAgICAgICAgICAgICAgIGxldCBtb2R1bGVGaWx0ZXJMb2NrZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB3aGlsZSAoKGluc3RydWN0aW9uID0gaXRlcmF0b3IubmV4dCgpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50RXhlY3V0aW9uQmxvY2tTdGFja1JlZ2lzdGVycy5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAobW9kdWxlRmlsdGVyTG9ja2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVyYXRvci5rZWVwKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZmlsdGVyc01vZHVsZU1hcCAmJiBmaWx0ZXJzTW9kdWxlTWFwLmhhcyhpbnN0cnVjdGlvbi5hZGRyZXNzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlRmlsdGVyTG9ja2VyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIW1vZHVsZUZpbHRlckxvY2tlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYmFzaWNhbGx5IHNraXAgdGhlIGZpcnN0IGJsb2NrIG9mIGNvZGUgKGZyb20gZnJpZGEpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhcnRBZGRyZXNzLmNvbXBhcmUoTlVMTCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydEFkZHJlc3MgPSBpbnN0cnVjdGlvbi5hZGRyZXNzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZUZpbHRlckxvY2tlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5zdHJ1Y3Rpb25zLmxlbmd0aCA+IDAgJiYgaW5zdHJ1Y3Rpb25zLmluZGV4T2YoaW5zdHJ1Y3Rpb24ubW5lbW9uaWMpIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVyYXRvci5rZWVwKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVyYXRvci5wdXRDYWxsb3V0KG9uSGl0SW5zdHJ1Y3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb3VudCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3RydWN0aW9uc0NvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5zdHJ1Y3Rpb25zQ291bnQgPT09IGNvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGl0ZXJhdG9yLmtlZXAoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIEhvb2FoVHJhY2UudHJhY2UgPSB0cmFjZTtcbiAgICBmdW5jdGlvbiBzdG9wKCkge1xuICAgICAgICBTdGFsa2VyLnVuZm9sbG93KHRhcmdldFRpZCk7XG4gICAgICAgIGZpbHRlcnNNb2R1bGVNYXAgPSBudWxsO1xuICAgICAgICBvbkluc3RydWN0aW9uQ2FsbGJhY2sgPSBudWxsO1xuICAgICAgICB0cmVlVHJhY2UubGVuZ3RoID0gMDtcbiAgICAgICAgdGFyZ2V0VGlkID0gMDtcbiAgICAgICAgY3VycmVudEV4ZWN1dGlvbkJsb2NrU3RhY2tSZWdpc3RlcnMubGVuZ3RoID0gMDtcbiAgICAgICAgY3VycmVudEV4ZWN1dGlvbkJsb2NrLmxlbmd0aCA9IDA7XG4gICAgICAgIGN1cnJlbnRCbG9ja01heFdpZHRoID0gMDtcbiAgICAgICAgc2Vzc2lvblByZXZTZXBDb3VudCA9IDA7XG4gICAgfVxuICAgIEhvb2FoVHJhY2Uuc3RvcCA9IHN0b3A7XG4gICAgZnVuY3Rpb24gb25IaXRJbnN0cnVjdGlvbihjb250ZXh0KSB7XG4gICAgICAgIGNvbnN0IGFkZHJlc3MgPSBjb250ZXh0LnBjO1xuICAgICAgICBjb25zdCBpbnN0cnVjdGlvbiA9IEluc3RydWN0aW9uLnBhcnNlKGFkZHJlc3MpO1xuICAgICAgICBjb25zdCB0cmVlVHJhY2VMZW5ndGggPSB0cmVlVHJhY2UubGVuZ3RoO1xuICAgICAgICBpZiAob25JbnN0cnVjdGlvbkNhbGxiYWNrICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoaGl0UmV0SW5zdHJ1Y3Rpb24pIHtcbiAgICAgICAgICAgICAgICBoaXRSZXRJbnN0cnVjdGlvbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmICh0cmVlVHJhY2VMZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyZWVUcmFjZS5wb3AoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvbkluc3RydWN0aW9uQ2FsbGJhY2suYXBwbHkoe30sIFtjb250ZXh0LCBpbnN0cnVjdGlvbl0pO1xuICAgICAgICAgICAgaWYgKHNlc3Npb25QcmludEJsb2Nrcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGV0YWlscyA9IGZhbHNlLCBjb2xvcmVkID0gZmFsc2UsIHRyZWVTcGFjZXMgPSA0IH0gPSBzZXNzaW9uUHJpbnRPcHRpb25zO1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzQ2FsbCA9IFV0aWxzLmlzQ2FsbEluc3RydWN0aW9uKGluc3RydWN0aW9uKTtcbiAgICAgICAgICAgICAgICBjb25zdCBpc0p1bXAgPSBVdGlscy5pc0p1bXBJbnN0cnVjdGlvbihpbnN0cnVjdGlvbik7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNSZXQgPSBVdGlscy5pc1JldEluc3RydWN0aW9uKGluc3RydWN0aW9uKTtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmludEluZm8gPSBmb3JtYXRJbnN0cnVjdGlvbihjb250ZXh0LCBhZGRyZXNzLCBpbnN0cnVjdGlvbiwgZGV0YWlscywgY29sb3JlZCwgdHJlZVNwYWNlcywgaXNKdW1wKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50RXhlY3V0aW9uQmxvY2sucHVzaChwcmludEluZm8pO1xuICAgICAgICAgICAgICAgIGlmIChpc0p1bXAgfHwgaXNSZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRFeGVjdXRpb25CbG9jay5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBibG9ja2lmeUJsb2NrKGRldGFpbHMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRFeGVjdXRpb25CbG9jay5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50QmxvY2tNYXhXaWR0aCA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpc0NhbGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJlZVRyYWNlLnB1c2goaW5zdHJ1Y3Rpb24ubmV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGlzUmV0KSB7XG4gICAgICAgICAgICAgICAgICAgIGhpdFJldEluc3RydWN0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gYmxvY2tpZnlCbG9jayhkZXRhaWxzKSB7XG4gICAgICAgIGNvbnN0IGRpdk1vZCA9IGN1cnJlbnRCbG9ja01heFdpZHRoICUgODtcbiAgICAgICAgaWYgKGRpdk1vZCAhPT0gMCkge1xuICAgICAgICAgICAgY3VycmVudEJsb2NrTWF4V2lkdGggLT0gZGl2TW9kO1xuICAgICAgICAgICAgY3VycmVudEJsb2NrTWF4V2lkdGggKz0gODtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZWFsTGluZVdpZHRoID0gY3VycmVudEJsb2NrTWF4V2lkdGggLSBjdXJyZW50QmxvY2tTdGFydFdpZHRoO1xuICAgICAgICBjb25zdCBzdGFydFNwYWNlciA9IFV0aWxzLmdldFNwYWNlcihjdXJyZW50QmxvY2tTdGFydFdpZHRoICsgMSk7XG4gICAgICAgIGxldCBzZXBDb3VudCA9IChyZWFsTGluZVdpZHRoICsgOCkgLyA0O1xuICAgICAgICBjb25zdCB0b3BTZXAgPSAnIF8nLnJlcGVhdChzZXBDb3VudCkuc3Vic3RyaW5nKDEpO1xuICAgICAgICBjb25zdCBib3RTZXAgPSAnIFxcdTAwQUYnLnJlcGVhdChzZXBDb3VudCkuc3Vic3RyaW5nKDEpO1xuICAgICAgICBjb25zdCBuZXh0U2VwQ291bnQgPSBjdXJyZW50QmxvY2tTdGFydFdpZHRoICsgMSArIGJvdFNlcC5sZW5ndGg7XG4gICAgICAgIGNvbnN0IGVtcHR5TGluZSA9IGZvcm1hdExpbmUoeyBkYXRhOiAnICcucmVwZWF0KGN1cnJlbnRCbG9ja01heFdpZHRoKSwgbGluZUxlbmd0aDogY3VycmVudEJsb2NrTWF4V2lkdGggfSk7XG4gICAgICAgIGxldCB0b3BNaWQgPSAnICc7XG4gICAgICAgIGlmIChzZXNzaW9uUHJldlNlcENvdW50ID4gMCkge1xuICAgICAgICAgICAgdG9wTWlkID0gJ3wnO1xuICAgICAgICAgICAgY29uc3Qgc2VwRGlmZiA9IHNlc3Npb25QcmV2U2VwQ291bnQgLSBuZXh0U2VwQ291bnQ7XG4gICAgICAgICAgICBpZiAoc2VwRGlmZiA8IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzcGFjZXIgPSBVdGlscy5nZXRTcGFjZXIoc2Vzc2lvblByZXZTZXBDb3VudCk7XG4gICAgICAgICAgICAgICAgaWYgKGRldGFpbHMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc3BhY2VyICsgJ3wnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coc3BhY2VyICsgJ3wnICsgJ18gJy5yZXBlYXQoLXNlcERpZmYgLyAyKSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coc3BhY2VyICsgVXRpbHMuZ2V0U3BhY2VyKC1zZXBEaWZmKSArICd8Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChzZXBEaWZmID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNwYWNlciA9IFV0aWxzLmdldFNwYWNlcihuZXh0U2VwQ291bnQpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNwYWNlciArICd8JyArICdcXHUwMEFGICcucmVwZWF0KHNlcERpZmYgLyAyKSk7XG4gICAgICAgICAgICAgICAgaWYgKGRldGFpbHMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc3BhY2VyICsgJ3wnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coc3RhcnRTcGFjZXIgKyB0b3BTZXAgKyB0b3BNaWQgKyB0b3BTZXApO1xuICAgICAgICBjdXJyZW50RXhlY3V0aW9uQmxvY2suZm9yRWFjaCgocHJpbnRJbmZvKSA9PiB7XG4gICAgICAgICAgICBpZiAoZGV0YWlscyAmJiBwcmludEluZm8uZGV0YWlscykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVtcHR5TGluZSk7XG4gICAgICAgICAgICAgICAgcHJpbnRJbmZvLmRldGFpbHMuZm9yRWFjaCgoZGV0YWlsUHJpbnRJbmZvKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGZvcm1hdExpbmUoZGV0YWlsUHJpbnRJbmZvKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhmb3JtYXRMaW5lKHByaW50SW5mbykpO1xuICAgICAgICAgICAgaWYgKGRldGFpbHMpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJpbnRJbmZvLnBvc3REZXRhaWxzKSB7XG4gICAgICAgICAgICAgICAgICAgIHByaW50SW5mby5wb3N0RGV0YWlscy5mb3JFYWNoKChwb3N0UHJpbnRJbmZvKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhmb3JtYXRMaW5lKHBvc3RQcmludEluZm8pKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVtcHR5TGluZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zb2xlLmxvZyhzdGFydFNwYWNlciArIGJvdFNlcCArICd8JyArIGJvdFNlcCk7XG4gICAgICAgIHNlc3Npb25QcmV2U2VwQ291bnQgPSBuZXh0U2VwQ291bnQ7XG4gICAgICAgIGNvbnNvbGUubG9nKFV0aWxzLmdldFNwYWNlcihzZXNzaW9uUHJldlNlcENvdW50KSArICd8Jyk7XG4gICAgICAgIGlmIChkZXRhaWxzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhVdGlscy5nZXRTcGFjZXIoc2Vzc2lvblByZXZTZXBDb3VudCkgKyAnfCcpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGZvcm1hdExpbmUocHJpbnRJbmZvKSB7XG4gICAgICAgIGxldCB0b1ByaW50ID0gcHJpbnRJbmZvLmRhdGE7XG4gICAgICAgIHRvUHJpbnQgPSBVdGlscy5pbnNlcnRBdCh0b1ByaW50LCAnfCAgICAnLCBjdXJyZW50QmxvY2tTdGFydFdpZHRoKTtcbiAgICAgICAgdG9QcmludCArPSBVdGlscy5nZXRTcGFjZXIoY3VycmVudEJsb2NrTWF4V2lkdGggLSBwcmludEluZm8ubGluZUxlbmd0aCk7XG4gICAgICAgIHRvUHJpbnQgKz0gJyAgICB8JztcbiAgICAgICAgcmV0dXJuIHRvUHJpbnQ7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGZvcm1hdEluc3RydWN0aW9uKGNvbnRleHQsIGFkZHJlc3MsIGluc3RydWN0aW9uLCBkZXRhaWxzLCBjb2xvcmVkLCB0cmVlU3BhY2VzLCBpc0p1bXApIHtcbiAgICAgICAgY29uc3QgYW55Q3R4ID0gY29udGV4dDtcbiAgICAgICAgbGV0IGxpbmUgPSAnJztcbiAgICAgICAgbGV0IGNvbG9yZWRMaW5lID0gJyc7XG4gICAgICAgIGxldCBwYXJ0O1xuICAgICAgICBsZXQgaW50VHJlZVNwYWNlID0gMDtcbiAgICAgICAgbGV0IHNwYWNlQXRPcFN0cjtcbiAgICAgICAgY29uc3QgYXBwZW5kID0gZnVuY3Rpb24gKHdoYXQsIGNvbG9yKSB7XG4gICAgICAgICAgICBsaW5lICs9IHdoYXQ7XG4gICAgICAgICAgICBpZiAoY29sb3JlZCkge1xuICAgICAgICAgICAgICAgIGlmIChjb2xvcikge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcmVkTGluZSArPSBDb2xvci5jb2xvcmlmeSh3aGF0LCBjb2xvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcmVkTGluZSArPSB3aGF0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgYXBwZW5kTW9kdWxlSW5mbyA9IGZ1bmN0aW9uIChhZGRyZXNzKSB7XG4gICAgICAgICAgICBjb25zdCBtb2R1bGUgPSBtb2R1bGVNYXAuZmluZChhZGRyZXNzKTtcbiAgICAgICAgICAgIGlmIChtb2R1bGUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBhcHBlbmQoJyAoJyk7XG4gICAgICAgICAgICAgICAgYXBwZW5kKG1vZHVsZS5uYW1lLCAnZ3JlZW4gYm9sZCcpO1xuICAgICAgICAgICAgICAgIHBhcnQgPSAnIyc7XG4gICAgICAgICAgICAgICAgYXBwZW5kKHBhcnQpO1xuICAgICAgICAgICAgICAgIHBhcnQgPSBhZGRyZXNzLnN1Yihtb2R1bGUuYmFzZSkudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICBhcHBlbmQocGFydCwgJ3JlZCcpO1xuICAgICAgICAgICAgICAgIHBhcnQgPSAnKSc7XG4gICAgICAgICAgICAgICAgYXBwZW5kKHBhcnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBhZGRTcGFjZSA9IGZ1bmN0aW9uIChjb3VudCkge1xuICAgICAgICAgICAgYXBwZW5kKFV0aWxzLmdldFNwYWNlcihjb3VudCArIGludFRyZWVTcGFjZSAtIGxpbmUubGVuZ3RoKSk7XG4gICAgICAgIH07XG4gICAgICAgIGlmICh0cmVlU3BhY2VzID4gMCAmJiB0cmVlVHJhY2UubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaW50VHJlZVNwYWNlID0gdHJlZVRyYWNlLmxlbmd0aCAqIHRyZWVTcGFjZXM7XG4gICAgICAgICAgICBhcHBlbmQoVXRpbHMuZ2V0U3BhY2VyKGludFRyZWVTcGFjZSkpO1xuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnRCbG9ja1N0YXJ0V2lkdGggPSBsaW5lLmxlbmd0aDtcbiAgICAgICAgYXBwZW5kKGFkZHJlc3MudG9TdHJpbmcoKSwgJ3JlZCBib2xkJyk7XG4gICAgICAgIGFwcGVuZE1vZHVsZUluZm8oYWRkcmVzcyk7XG4gICAgICAgIGFkZFNwYWNlKDQwKTtcbiAgICAgICAgY29uc3QgYnl0ZXMgPSBpbnN0cnVjdGlvbi5hZGRyZXNzLnJlYWRCeXRlQXJyYXkoaW5zdHJ1Y3Rpb24uc2l6ZSk7XG4gICAgICAgIGlmIChieXRlcykge1xuICAgICAgICAgICAgcGFydCA9IFV0aWxzLmJhMmhleChieXRlcyk7XG4gICAgICAgICAgICBhcHBlbmQocGFydCwgJ3llbGxvdycpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IF9maXggPSAnJztcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5zdHJ1Y3Rpb24uc2l6ZTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgX2ZpeCArPSAnMDAnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXBwZW5kKF9maXgsICd5ZWxsb3cnKTtcbiAgICAgICAgfVxuICAgICAgICBhZGRTcGFjZSg1MCk7XG4gICAgICAgIGFwcGVuZChpbnN0cnVjdGlvbi5tbmVtb25pYywgJ2dyZWVuIGJvbGQnKTtcbiAgICAgICAgYWRkU3BhY2UoNjApO1xuICAgICAgICBzcGFjZUF0T3BTdHIgPSBsaW5lLmxlbmd0aDtcbiAgICAgICAgYXBwZW5kKGluc3RydWN0aW9uLm9wU3RyLCAnZmlsdGVyJyk7XG4gICAgICAgIGlmIChpc0p1bXApIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbGV0IGp1bXBJbnNuID0gZ2V0SnVtcEluc3RydWN0aW9uKGluc3RydWN0aW9uLCBhbnlDdHgpO1xuICAgICAgICAgICAgICAgIGlmIChqdW1wSW5zbikge1xuICAgICAgICAgICAgICAgICAgICBhcHBlbmRNb2R1bGVJbmZvKGp1bXBJbnNuLmFkZHJlc3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7IH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsaW5lTGVuZ3RoID0gbGluZS5sZW5ndGg7XG4gICAgICAgIGlmIChsaW5lTGVuZ3RoID4gY3VycmVudEJsb2NrTWF4V2lkdGgpIHtcbiAgICAgICAgICAgIGN1cnJlbnRCbG9ja01heFdpZHRoID0gbGluZUxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZGV0YWlsc0RhdGEgPSBbXTtcbiAgICAgICAgaWYgKGRldGFpbHMpIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50RXhlY3V0aW9uQmxvY2tTdGFja1JlZ2lzdGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IHBvc3RMaW5lcyA9IFtdO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRFeGVjdXRpb25CbG9ja1N0YWNrUmVnaXN0ZXJzLmZvckVhY2goKHJlZykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250ZXh0VmFsID0gZ2V0UmVnaXN0ZXJWYWx1ZShjb250ZXh0LCByZWcucmVnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRleHRWYWwgJiYgY29udGV4dFZhbCAhPSByZWcudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvU3RyID0gY29udGV4dFZhbC50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHN0ciA9IGdldFNwYWNlcihzcGFjZUF0T3BTdHIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbG9yZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gQ29sb3IuY29sb3JpZnkocmVnLnJlZywgJ2JsdWUgYm9sZCcpICsgJyA9ICcgKyBDb2xvci5jb2xvcmlmeSh0b1N0ciwgJ3JlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9IHJlZy5yZWcgKyAnID0gJyArIHRvU3RyO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zdExpbmVzLnB1c2goeyBkYXRhOiBzdHIsIGxpbmVMZW5ndGg6IHNwYWNlQXRPcFN0ciArIHJlZy5yZWcubGVuZ3RoICsgdG9TdHIubGVuZ3RoICsgMyB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRFeGVjdXRpb25CbG9ja1N0YWNrUmVnaXN0ZXJzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRFeGVjdXRpb25CbG9jay5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRFeGVjdXRpb25CbG9ja1tjdXJyZW50RXhlY3V0aW9uQmxvY2subGVuZ3RoIC0gMV0ucG9zdERldGFpbHMgPSBwb3N0TGluZXM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGV0YWlsc0RhdGEgPSBmb3JtYXRJbnN0cnVjdGlvbkRldGFpbHMoc3BhY2VBdE9wU3RyLCBjb250ZXh0LCBpbnN0cnVjdGlvbiwgY29sb3JlZCwgaXNKdW1wKTtcbiAgICAgICAgICAgIGRldGFpbHNEYXRhLmZvckVhY2goKGRldGFpbCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChkZXRhaWwubGluZUxlbmd0aCA+IGN1cnJlbnRCbG9ja01heFdpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRCbG9ja01heFdpZHRoID0gZGV0YWlsLmxpbmVMZW5ndGg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgZGF0YTogY29sb3JlZCA/IGNvbG9yZWRMaW5lIDogbGluZSwgbGluZUxlbmd0aDogbGluZUxlbmd0aCwgZGV0YWlsczogZGV0YWlsc0RhdGEgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZm9ybWF0SW5zdHJ1Y3Rpb25EZXRhaWxzKHNwYWNlQXRPcFN0ciwgY29udGV4dCwgaW5zdHJ1Y3Rpb24sIGNvbG9yZWQsIGlzSnVtcCkge1xuICAgICAgICBjb25zdCBhbnlDb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgY29uc3QgZGF0YSA9IFtdO1xuICAgICAgICBjb25zdCB2aXNpdGVkID0gbmV3IFNldCgpO1xuICAgICAgICBsZXQgaW5zbiA9IG51bGw7XG4gICAgICAgIGlmIChQcm9jZXNzLmFyY2ggPT09ICdhcm02NCcpIHtcbiAgICAgICAgICAgIGluc24gPSBpbnN0cnVjdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChQcm9jZXNzLmFyY2ggPT09ICdpYTMyJyB8fCBQcm9jZXNzLmFyY2ggPT09ICd4NjQnKSB7XG4gICAgICAgICAgICBpbnNuID0gaW5zdHJ1Y3Rpb247XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluc24gIT0gbnVsbCkge1xuICAgICAgICAgICAgaW5zbi5vcGVyYW5kcy5mb3JFYWNoKChvcCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCByZWc7XG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBsZXQgYWRkcyA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKG9wLnR5cGUgPT09ICdtZW0nKSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZHMgPSBvcC52YWx1ZS5kaXNwO1xuICAgICAgICAgICAgICAgICAgICByZWcgPSBvcC52YWx1ZS5iYXNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChvcC50eXBlID09PSAncmVnJykge1xuICAgICAgICAgICAgICAgICAgICByZWcgPSBvcC52YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByZWcgIT09ICd1bmRlZmluZWQnICYmICF2aXNpdGVkLmhhcyhyZWcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZpc2l0ZWQuYWRkKHJlZyk7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGdldFJlZ2lzdGVyVmFsdWUoYW55Q29udGV4dCwgcmVnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEV4ZWN1dGlvbkJsb2NrU3RhY2tSZWdpc3RlcnMucHVzaCh7IHJlZzogcmVnLnRvU3RyaW5nKCksIHZhbHVlOiB2YWx1ZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGdldFJlZ2lzdGVyVmFsdWUoYW55Q29udGV4dCwgcmVnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVnTGFiZWwgPSByZWcudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnB1c2goW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWdMYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUudG9TdHJpbmcoKSArIChhZGRzID4gMCA/ICcjJyArIGFkZHMudG9TdHJpbmcoMTYpIDogJycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRUZWxlc2NvcGUodmFsdWUuYWRkKGFkZHMpLCBjb2xvcmVkLCBpc0p1bXApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7IH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhcHBseUNvbG9yID0gZnVuY3Rpb24gKHdoYXQsIGNvbG9yKSB7XG4gICAgICAgICAgICBpZiAoY29sb3JlZCAmJiBjb2xvcikge1xuICAgICAgICAgICAgICAgIHdoYXQgPSBDb2xvci5jb2xvcmlmeSh3aGF0LCBjb2xvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gd2hhdDtcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IGxpbmVzID0gW107XG4gICAgICAgIGRhdGEuZm9yRWFjaCgocm93KSA9PiB7XG4gICAgICAgICAgICBsZXQgbGluZSA9IFV0aWxzLmdldFNwYWNlcihzcGFjZUF0T3BTdHIpO1xuICAgICAgICAgICAgbGV0IGxpbmVMZW5ndGggPSBzcGFjZUF0T3BTdHIgKyByb3dbMF0ubGVuZ3RoICsgcm93WzFdLnRvU3RyaW5nKCkubGVuZ3RoICsgMztcbiAgICAgICAgICAgIGxpbmUgKz0gYXBwbHlDb2xvcihyb3dbMF0sICdibHVlJykgKyAnID0gJyArIGFwcGx5Q29sb3Iocm93WzFdLCAnZmlsdGVyJyk7XG4gICAgICAgICAgICBpZiAocm93Lmxlbmd0aCA+IDIgJiYgcm93WzJdICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJpbnRJbmZvID0gcm93WzJdO1xuICAgICAgICAgICAgICAgIGlmIChwcmludEluZm8ubGluZUxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbGluZSArPSAnID4+ICcgKyBwcmludEluZm8uZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgbGluZUxlbmd0aCArPSBwcmludEluZm8ubGluZUxlbmd0aCArIDQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGluZXMucHVzaCh7IGRhdGE6IGxpbmUsIGxpbmVMZW5ndGg6IGxpbmVMZW5ndGggfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbGluZXM7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldFRlbGVzY29wZShhZGRyZXNzLCBjb2xvcmVkLCBpc0p1bXApIHtcbiAgICAgICAgaWYgKGlzSnVtcCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbnN0cnVjdGlvbiA9IEluc3RydWN0aW9uLnBhcnNlKGFkZHJlc3MpO1xuICAgICAgICAgICAgICAgIGxldCByZXQ7XG4gICAgICAgICAgICAgICAgaWYgKGNvbG9yZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gQ29sb3IuY29sb3JpZnkoaW5zdHJ1Y3Rpb24ubW5lbW9uaWMsICdncmVlbicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gaW5zdHJ1Y3Rpb24ubW5lbW9uaWM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldCArPSAnICcgKyBpbnN0cnVjdGlvbi5vcFN0cjtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhOiByZXQsIGxpbmVMZW5ndGg6IGluc3RydWN0aW9uLm1uZW1vbmljLmxlbmd0aCArIGluc3RydWN0aW9uLm9wU3RyLmxlbmd0aCArIDEgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7IH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgICAgICBsZXQgY3VycmVudCA9IGFkZHJlc3M7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gJyc7XG4gICAgICAgICAgICBsZXQgcmVzTGVuID0gMDtcbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucmVhZFBvaW50ZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXNTdHIgPSBjdXJyZW50LnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9ICcgPj4gJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc0xlbiArPSA0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJlc0xlbiArPSBhc1N0ci5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50LmNvbXBhcmUoMHgxMDAwMCkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29sb3JlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBDb2xvci5jb2xvcmlmeShhc1N0ciwgJ2N5YW4gYm9sZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IGFzU3RyO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29sb3JlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBDb2xvci5jb2xvcmlmeShhc1N0ciwgJ3JlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IGFzU3RyO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3RyID0gYWRkcmVzcy5yZWFkVXRmOFN0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdHIgJiYgc3RyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJldCA9IHN0ci5yZXBsYWNlKCdcXG4nLCAnICcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29sb3JlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9ICcgKCcgKyBDb2xvci5jb2xvcmlmeShyZXQsICdncmVlbicpICsgJyknO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9ICcgKCcgKyByZXQgKyAnKSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzTGVuICs9IHN0ci5sZW5ndGggKyAzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7IH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoY291bnQgPT09IDUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvdW50ICs9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7IGRhdGE6IHJlc3VsdCwgbGluZUxlbmd0aDogcmVzTGVuIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgZGF0YTogJycsIGxpbmVMZW5ndGg6IDAgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0SnVtcEluc3RydWN0aW9uKGluc3RydWN0aW9uLCBjb250ZXh0KSB7XG4gICAgICAgIGxldCBpbnNuID0gbnVsbDtcbiAgICAgICAgaWYgKFByb2Nlc3MuYXJjaCA9PT0gJ2FybTY0Jykge1xuICAgICAgICAgICAgaW5zbiA9IGluc3RydWN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKFByb2Nlc3MuYXJjaCA9PT0gJ2lhMzInIHx8IFByb2Nlc3MuYXJjaCA9PT0gJ3g2NCcpIHtcbiAgICAgICAgICAgIGluc24gPSBpbnN0cnVjdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5zbikge1xuICAgICAgICAgICAgaWYgKFV0aWxzLmlzSnVtcEluc3RydWN0aW9uKGluc3RydWN0aW9uKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RPcCA9IGluc24ub3BlcmFuZHNbaW5zbi5vcGVyYW5kcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGxhc3RPcC50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3JlZyc6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gSW5zdHJ1Y3Rpb24ucGFyc2UoY29udGV4dFtsYXN0T3AudmFsdWVdKTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnaW1tJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBJbnN0cnVjdGlvbi5wYXJzZShwdHIobGFzdE9wLnZhbHVlLnRvU3RyaW5nKCkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldFJlZ2lzdGVyVmFsdWUoY29udGV4dCwgcmVnKSB7XG4gICAgICAgIGlmIChQcm9jZXNzLmFyY2ggPT09ICdhcm02NCcpIHtcbiAgICAgICAgICAgIGlmIChyZWcuc3RhcnRzV2l0aCgndycpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRleHRbcmVnLnJlcGxhY2UoJ3cnLCAneCcpXS5hbmQoMHgwMDAwMDAwMGZmZmZmZmZmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29udGV4dFtyZWddO1xuICAgIH1cbn0pKEhvb2FoVHJhY2UgfHwgKEhvb2FoVHJhY2UgPSB7fSkpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aG9vYWguanMubWFwIiwiaW1wb3J0IHsgYXR0YWNoUmVnaXN0ZXJOYXRpdmVzIH0gZnJvbSAnLi9yZWdpc3Rlck5hdGl2ZXMuanMnO1xuaW1wb3J0IHsgYXR0YWNoU3lzdGVtUHJvcGVydHlHZXQgfSBmcm9tICcuL3N5c3RlbVByb3BlcnR5R2V0LmpzJztcbmltcG9ydCB7IEluamVjdCB9IGZyb20gJy4vaW5qZWN0LmpzJztcbmltcG9ydCB7IGR1bXBGaWxlIH0gZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQgeyBIb29haFRyYWNlIH0gZnJvbSAnLi9ob29haC5qcyc7XG5mdW5jdGlvbiBnUHRyKHZhbHVlKSB7XG4gICAgcmV0dXJuIHB0cih2YWx1ZSkuc3ViKCcweDEwMDAwMCcpO1xufVxuZXhwb3J0IHsgZ1B0ciwgYXR0YWNoUmVnaXN0ZXJOYXRpdmVzLCBhdHRhY2hTeXN0ZW1Qcm9wZXJ0eUdldCwgSW5qZWN0LCBkdW1wRmlsZSwgSG9vYWhUcmFjZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiaW1wb3J0IHsgQ29sb3IsIGxvZ2dlciB9IGZyb20gJ0BjbG9ja3dvcmsvbG9nZ2luZyc7XG5jb25zdCB7IGJsdWUsIHJlZCwgbWFnZW50YUJyaWdodDogcGluayB9ID0gQ29sb3IudXNlKCk7XG4vLyB1c2luZyBuYW1lc3BhY2UgZm9yIHNpbmdsZXRvbiB3aXRoIGFsbCBjYWxsYmFja3NcbnZhciBJbmplY3Q7XG4oZnVuY3Rpb24gKEluamVjdCkge1xuICAgIEluamVjdC5tb2R1bGVzID0gbmV3IE1vZHVsZU1hcCgpO1xuICAgIGNvbnN0IGluaXRBcnJheUNhbGxiYWNrcyA9IFtdO1xuICAgIGxldCBkb19kbG9wZW47XG4gICAgbGV0IGNhbGxfY3RvcjtcbiAgICBjb25zdCBsaW5rZXIgPSBQcm9jZXNzLmdldE1vZHVsZUJ5TmFtZShQcm9jZXNzLnBvaW50ZXJTaXplID09PSA0ID8gJ2xpbmtlcicgOiAnbGlua2VyNjQnKTtcbiAgICBmb3IgKGNvbnN0IHsgbmFtZSwgYWRkcmVzcyB9IG9mIGxpbmtlci5lbnVtZXJhdGVTeW1ib2xzKCkpIHtcbiAgICAgICAgaWYgKG5hbWUuaW5jbHVkZXMoJ2RvX2Rsb3BlbicpKSB7XG4gICAgICAgICAgICBkb19kbG9wZW4gPSBhZGRyZXNzO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5hbWUuaW5jbHVkZXMoJ2NhbGxfY29uc3RydWN0b3InKSkge1xuICAgICAgICAgICAgY2FsbF9jdG9yID0gYWRkcmVzcztcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIFRPRE8gYWRkIGp1c3QgaG9vayBkbG9wZW5fZXh0XG4gICAgLy8gY29uc3QgYW5kcm9pZF9kbG9wZW5fZXh0ID0gTW9kdWxlLmdldEV4cG9ydEJ5TmFtZShudWxsLCAnYW5kcm9pZF9kbG9wZW5fZXh0Jyk7XG4gICAgSW50ZXJjZXB0b3IuYXR0YWNoKGRvX2Rsb3Blbiwge1xuICAgICAgICBvbkVudGVyOiBmdW5jdGlvbiAoYXJncykge1xuICAgICAgICAgICAgY29uc3QgbGliUGF0aCA9ICh0aGlzLmxpYlBhdGggPSBhcmdzWzBdLnJlYWRDU3RyaW5nKCkpO1xuICAgICAgICAgICAgaWYgKCFsaWJQYXRoKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGNvbnN0IGxpYk5hbWUgPSAodGhpcy5saWJOYW1lID0gbGliUGF0aC5zcGxpdCgnLycpLnBvcCgpKTtcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBbJHtwaW5rKCdkbG9wZW4nKX1dICR7bGliUGF0aH1gKTtcbiAgICAgICAgICAgIEluamVjdC5tb2R1bGVzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgLy8gVE9ETyBpbnZlc3RpZ2F0ZVxuICAgICAgICAgICAgbGV0IGhhbmRsZSA9IG51bGw7XG4gICAgICAgICAgICBjb25zdCB1bmhvb2sgPSAoKSA9PiBoYW5kbGU/LmRldGFjaCgpO1xuICAgICAgICAgICAgaGFuZGxlID0gSW50ZXJjZXB0b3IuYXR0YWNoKGNhbGxfY3RvciwgY3Rvckxpc3RlbmVyQ2FsbGJhY2sobGliTmFtZSwgdW5ob29rKSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uTGVhdmU6IGZ1bmN0aW9uIChyZXR2YWwpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5saWJQYXRoKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIG9uQWZ0ZXJJbml0QXJyYXkodGhpcy5saWJOYW1lKTtcbiAgICAgICAgfSxcbiAgICB9KTtcbiAgICAvLyBjYWxsX2NvbnN0cnVjdG9yIGNhbGxiYWNrXG4gICAgY29uc3QgY3Rvckxpc3RlbmVyQ2FsbGJhY2sgPSAobGliTmFtZSwgZGV0YWNoKSA9PiAoe1xuICAgICAgICBvbkVudGVyKGFyZ3MpIHtcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKHsgdGFnOiAnY3RvcicgfSwgYCR7bGliTmFtZX0gJHtyZWQoJy0+Jyl9ICR7YXJnc1swXX1gKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25MZWF2ZShyZXR2YWwpIHtcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKHsgdGFnOiAnY3RvcicgfSwgYCR7bGliTmFtZX0gJHtibHVlKCc8LScpfSAke3JldHZhbH1gKTtcbiAgICAgICAgICAgIGRldGFjaCgpO1xuICAgICAgICB9LFxuICAgIH0pO1xuICAgIGZ1bmN0aW9uIG9uQWZ0ZXJJbml0QXJyYXkobGliTmFtZSkge1xuICAgICAgICBmb3IgKGNvbnN0IGNiIG9mIGluaXRBcnJheUNhbGxiYWNrcykge1xuICAgICAgICAgICAgY2IobGliTmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gYWZ0ZXJJbml0QXJyYXkoZm4pIHtcbiAgICAgICAgaW5pdEFycmF5Q2FsbGJhY2tzLnB1c2goZm4pO1xuICAgIH1cbiAgICBJbmplY3QuYWZ0ZXJJbml0QXJyYXkgPSBhZnRlckluaXRBcnJheTtcbiAgICBmdW5jdGlvbiBhZnRlckluaXRBcnJheU1vZHVsZShmbikge1xuICAgICAgICBpbml0QXJyYXlDYWxsYmFja3MucHVzaCgobmFtZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbW9kdWxlID0gUHJvY2Vzcy5maW5kTW9kdWxlQnlOYW1lKG5hbWUpO1xuICAgICAgICAgICAgaWYgKG1vZHVsZSlcbiAgICAgICAgICAgICAgICBmbihtb2R1bGUpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgSW5qZWN0LmFmdGVySW5pdEFycmF5TW9kdWxlID0gYWZ0ZXJJbml0QXJyYXlNb2R1bGU7XG4gICAgZnVuY3Rpb24gYXR0YWNoSW5Nb2R1bGUobmFtZU9yUHJlZGljYXRlLCBhZGRyZXNzLCBjYWxsYmFja3MpIHtcbiAgICAgICAgY29uc3QgZm4gPSB0eXBlb2YgbmFtZU9yUHJlZGljYXRlID09PSAnZnVuY3Rpb24nID8gbmFtZU9yUHJlZGljYXRlIDogKHB0cikgPT4gSW5qZWN0Lm1vZHVsZXMuZmluZE5hbWUocHRyKSA9PT0gbmFtZU9yUHJlZGljYXRlO1xuICAgICAgICBJbnRlcmNlcHRvci5hdHRhY2goYWRkcmVzcywge1xuICAgICAgICAgICAgb25FbnRlcihhcmdzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZuKHRoaXMucmV0dXJuQWRkcmVzcykpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPy5vbkVudGVyPy5jYWxsPy4odGhpcywgYXJncyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uTGVhdmUocmV0dmFsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZuKHRoaXMucmV0dXJuQWRkcmVzcykpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzPy5vbkxlYXZlPy5jYWxsKHRoaXMsIHJldHZhbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIEluamVjdC5hdHRhY2hJbk1vZHVsZSA9IGF0dGFjaEluTW9kdWxlO1xuICAgIC8qKiB2ZXJ5IHVzZWZ1bCBmb3Igbm90IGhvb2tpbmcgaGFyZHdhcmUsIGNocm9tZSwgYW5kIG90aGVyIHRoaW5ncyB5b3UgdGhhdCBjYXVzZSBjcmFzaGVzICovXG4gICAgZnVuY3Rpb24gaXNXaXRoaW5Pd25SYW5nZShwdHIpIHtcbiAgICAgICAgY29uc3QgcGF0aCA9IEluamVjdC5tb2R1bGVzLmZpbmRQYXRoKHB0cik7XG4gICAgICAgIHJldHVybiBwYXRoPy5pbmNsdWRlcygnL2RhdGEnKSA9PT0gdHJ1ZTtcbiAgICB9XG4gICAgSW5qZWN0LmlzV2l0aGluT3duUmFuZ2UgPSBpc1dpdGhpbk93blJhbmdlO1xufSkoSW5qZWN0IHx8IChJbmplY3QgPSB7fSkpO1xuZXhwb3J0IHsgSW5qZWN0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmplY3QuanMubWFwIiwiaW1wb3J0IHsgQ29sb3IgfSBmcm9tICdAY2xvY2t3b3JrL2xvZ2dpbmcnO1xuY29uc3QgeyBncmVlbiwgcmVkQnJpZ2h0LCBib2xkLCBkaW0sIGJsYWNrIH0gPSBDb2xvci51c2UoKTtcbmxldCBjYWNoZWRWdGFibGUgPSBudWxsO1xuZnVuY3Rpb24gdnRhYmxlKGluc3RhbmNlKSB7XG4gICAgaWYgKGNhY2hlZFZ0YWJsZSA9PT0gbnVsbCkge1xuICAgICAgICBjYWNoZWRWdGFibGUgPSBpbnN0YW5jZS5oYW5kbGUucmVhZFBvaW50ZXIoKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhY2hlZFZ0YWJsZTtcbn1cbmZ1bmN0aW9uIGZpbmQob2Zmc2V0LCByZXR1cm5UeXBlLCBhcmdzKSB7XG4gICAgY29uc3QgZW52ID0gSmF2YS52bS50cnlHZXRFbnYoKTtcbiAgICBpZiAoIWVudilcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgYWRkciA9IHZ0YWJsZShlbnYpXG4gICAgICAgIC5hZGQob2Zmc2V0ICogUHJvY2Vzcy5wb2ludGVyU2l6ZSlcbiAgICAgICAgLnJlYWRQb2ludGVyKCk7XG4gICAgY29uc3QgZnVuYyA9IG5ldyBOYXRpdmVGdW5jdGlvbihhZGRyLCByZXR1cm5UeXBlLCBhcmdzKTtcbiAgICByZXR1cm4gZnVuYyA/PyBudWxsO1xufVxuZnVuY3Rpb24gYXR0YWNoUmVnaXN0ZXJOYXRpdmVzKCkge1xuICAgIGNvbnN0IGZvdW5kID0gZmluZCgyMTUsICdpbnQzMicsIFsncG9pbnRlcicsICdwb2ludGVyJywgJ3BvaW50ZXInLCAnaW50MzInXSk7XG4gICAgaWYgKGZvdW5kKSB7XG4gICAgICAgIEludGVyY2VwdG9yLmF0dGFjaChmb3VuZCwge1xuICAgICAgICAgICAgb25FbnRlcihhcmdzKSB7XG4gICAgICAgICAgICAgICAgbG9nT25FbnRlclJlZ2lzdGVyTmF0aXZlcy5jYWxsKHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gZmFsbGJhY2sgcHJldmlvdXMgbWV0aG9kXG4gICAgY29uc3QgbGliYXJ0ID0gUHJvY2Vzcy5nZXRNb2R1bGVCeU5hbWUoJ2xpYmFydC5zbycpO1xuICAgIGNvbnN0IHN5bWJvbHMgPSBsaWJhcnQuZW51bWVyYXRlU3ltYm9scygpO1xuICAgIHN5bWJvbHMuZm9yRWFjaCgoeyBuYW1lLCBhZGRyZXNzIH0pID0+IHtcbiAgICAgICAgaWYgKG5hbWUuaW5jbHVkZXMoJ2FydCcpICYmIG5hbWUuaW5jbHVkZXMoJ0pOSScpICYmIG5hbWUuaW5jbHVkZXMoJ1JlZ2lzdGVyTmF0aXZlcycpICYmICFuYW1lLmluY2x1ZGVzKCdDaGVja0pOSScpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUmVnaXN0ZXJOYXRpdmVzIGlzIGF0ICcsIGFkZHJlc3MsIG5hbWUpO1xuICAgICAgICAgICAgSW50ZXJjZXB0b3IuYXR0YWNoKGFkZHJlc3MsIHtcbiAgICAgICAgICAgICAgICBvbkVudGVyKGFyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nT25FbnRlclJlZ2lzdGVyTmF0aXZlcy5jYWxsKHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICAvLyBUT0RPIGhvb2sgY2FwYWJpbGl0aWVzXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG59XG4vKlxuamludCBSZWdpc3Rlck5hdGl2ZXMoSk5JRW52ICplbnYsIGpjbGFzcyBjbGF6eiwgY29uc3QgSk5JTmF0aXZlTWV0aG9kICptZXRob2RzLCBqaW50IG5NZXRob2RzKTtcbnN0cnVjdCBKTklOYXRpdmVNZXRob2Q8IFIgKEpOSUVudiosIGpjbGFzcyosIEFyZ3MuLi4pID4ge1xuICAgIGNvbnN0IGNoYXIqIG5hbWU7XG4gICAgY29uc3QgY2hhciogc2lnbmF0dXJlO1xuICAgIFIgKCpmblB0cikoSk5JRW52KiwgamNsYXNzKiwgQXJncy4uLik7XG59O1xuKi9cbmZ1bmN0aW9uIGxvZ09uRW50ZXJSZWdpc3Rlck5hdGl2ZXMoYXJncykge1xuICAgIGNvbnN0IG1vZHVsZSA9IFByb2Nlc3MuZmluZE1vZHVsZUJ5QWRkcmVzcyh0aGlzLnJldHVybkFkZHJlc3MpID8/IFByb2Nlc3MuZmluZE1vZHVsZUJ5QWRkcmVzcyhhcmdzWzJdKTtcbiAgICBjb25zdCBjbGF6eiA9IGFyZ3NbMV07XG4gICAgY29uc3QgbWV0aG9kc1B0ciA9IGFyZ3NbMl07XG4gICAgY29uc3Qgbk1ldGhvZHMgPSBhcmdzWzNdLnRvSW50MzIoKTtcbiAgICBjb25zdCBjbGFzc05hbWUgPSBKYXZhLnZtLnRyeUdldEVudigpPy5nZXRDbGFzc05hbWUoY2xhenopID8/ICc8dW5rbm93bj4nO1xuICAgIGNvbnNvbGUubG9nKCdbUmVnaXN0ZXJOYXRpdmVzXScsIHJlZEJyaWdodChjbGFzc05hbWUpLCAnbWV0aG9kczonLCBib2xkKG5NZXRob2RzKSk7XG4gICAgYWRkVG9FeHBvcnQoe1xuICAgICAgICBtb2R1bGU6IG1vZHVsZT8ubmFtZSxcbiAgICAgICAgbmFtZTogY2xhc3NOYW1lLFxuICAgICAgICBtZXRob2RzX3B0cjogbW9kdWxlID8gbWV0aG9kc1B0ci5zdWIobW9kdWxlLmJhc2UpIDogbWV0aG9kc1B0cixcbiAgICAgICAgbk1ldGhvZHM6IG5NZXRob2RzLFxuICAgICAgICBiYWNrdHJhY2U6IG1vZHVsZVxuICAgICAgICAgICAgPyBUaHJlYWQuYmFja3RyYWNlKClcbiAgICAgICAgICAgICAgICAuZmlsdGVyKChzKSA9PiBzID4gbW9kdWxlLmJhc2UgJiYgcyA8IG1vZHVsZS5iYXNlLmFkZChtb2R1bGUuc2l6ZSkpXG4gICAgICAgICAgICAgICAgLm1hcCgocykgPT4gcy5zdWIobW9kdWxlLmJhc2UpKVxuICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgfSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuTWV0aG9kczsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG5hbWVQdHIgPSBtZXRob2RzUHRyLmFkZChpICogUHJvY2Vzcy5wb2ludGVyU2l6ZSAqIDMpLnJlYWRQb2ludGVyKCk7XG4gICAgICAgIGNvbnN0IHNpZ1B0ciA9IG1ldGhvZHNQdHIuYWRkKGkgKiBQcm9jZXNzLnBvaW50ZXJTaXplICogMyArIFByb2Nlc3MucG9pbnRlclNpemUpLnJlYWRQb2ludGVyKCk7XG4gICAgICAgIGNvbnN0IGZuUHRyUHRyID0gbWV0aG9kc1B0ci5hZGQoaSAqIFByb2Nlc3MucG9pbnRlclNpemUgKiAzICsgUHJvY2Vzcy5wb2ludGVyU2l6ZSAqIDIpLnJlYWRQb2ludGVyKCk7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBuYW1lUHRyLnJlYWRDU3RyaW5nKCkgPz8gJyc7XG4gICAgICAgIGNvbnN0IHNpZyA9IHNpZ1B0ci5yZWFkQ1N0cmluZygpID8/ICcnO1xuICAgICAgICBjb25zdCBzeW1ib2wgPSBEZWJ1Z1N5bWJvbC5mcm9tQWRkcmVzcyhmblB0clB0cik7XG4gICAgICAgIGNvbnNvbGUubG9nKGAke2JsYWNrKGRpbSgnICA+JykpfSR7Z3JlZW4obmFtZSl9JHtzaWd9YCwgYGF0OlxcbiAgICAke3N5bWJvbH1cXG4gICAgJHtEZWJ1Z1N5bWJvbC5mcm9tQWRkcmVzcyh0aGlzLnJldHVybkFkZHJlc3MpfWApO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcbiAgICAgICAgLy8gICAgICdbI10nLFxuICAgICAgICAvLyAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAvLyAgICAgICAgIGNsYXNzOiBjbGFzc05hbWUsXG4gICAgICAgIC8vICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgLy8gICAgICAgICBzaWc6IHNpZyxcbiAgICAgICAgLy8gICAgICAgICBtb2R1bGU6IHN5bWJvbC5tb2R1bGVOYW1lLFxuICAgICAgICAvLyAgICAgICAgIG9mZnNldDogYmFkQ29udmVydChzeW1ib2wpLFxuICAgICAgICAvLyAgICAgfSksXG4gICAgICAgIC8vICk7XG4gICAgfVxufVxuZnVuY3Rpb24gZ2V0TW9kdWxlQmFzZShyZXR1cm5BZGRyZXNzKSB7XG4gICAgY29uc3QgZGVidWcgPSBEZWJ1Z1N5bWJvbC5mcm9tQWRkcmVzcyhyZXR1cm5BZGRyZXNzKTtcbiAgICBpZiAoIWRlYnVnLm5hbWUpXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIGNvbnN0IG1vZHVsZSA9IFByb2Nlc3MuZmluZE1vZHVsZUJ5TmFtZShkZWJ1Zy5uYW1lKTtcbiAgICBpZiAoIW1vZHVsZSlcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIG1vZHVsZS5iYXNlO1xufVxuZnVuY3Rpb24gYmFkQ29udmVydChzeW1ib2wpIHtcbiAgICBjb25zdCBzdHIgPSBzeW1ib2wudG9TdHJpbmcoKTtcbiAgICBjb25zdCBzdHJpcHBlZCA9IHN0ci5zdWJzdHJpbmcoc3RyLmxhc3RJbmRleE9mKCcweCcpKTtcbiAgICByZXR1cm4gcHRyKHN0cmlwcGVkKTtcbn1cbmZ1bmN0aW9uIGFkZFRvRXhwb3J0KGl0ZW0pIHtcbiAgICBjb25zdCBuYXRpdmUgPSAocnBjWydSZWdpc3Rlck5hdGl2ZXMnXSA/Pz0gW10pO1xuICAgIG5hdGl2ZS5wdXNoKGl0ZW0pO1xufVxuZXhwb3J0IHsgYXR0YWNoUmVnaXN0ZXJOYXRpdmVzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZWdpc3Rlck5hdGl2ZXMuanMubWFwIiwiaW1wb3J0IHsgTGliYyB9IGZyb20gJ0BjbG9ja3dvcmsvY29tbW9uJztcbmltcG9ydCB7IHN1YkxvZ2dlciwgQ29sb3IgfSBmcm9tICdAY2xvY2t3b3JrL2xvZ2dpbmcnO1xuY29uc3QgeyBncmF5LCBncmVlbiwgcmVkIH0gPSBDb2xvci51c2UoKTtcbmNvbnN0IGxvZ2dlciA9IHN1YkxvZ2dlcignc3lzcHJvcCcpO1xuZnVuY3Rpb24gYXR0YWNoU3lzdGVtUHJvcGVydHlHZXQoZm4pIHtcbiAgICBmbiAmJlxuICAgICAgICBJbnRlcmNlcHRvci5hdHRhY2goTGliYy5fX3N5c3RlbV9wcm9wZXJ0eV9yZWFkLCB7XG4gICAgICAgICAgICBvbkVudGVyKGFyZ3MpIHsgfSxcbiAgICAgICAgICAgIG9uTGVhdmUocmV0dmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dmFsLnJlcGxhY2UocHRyKDB4NWIpKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIEludGVyY2VwdG9yLmF0dGFjaChMaWJjLl9fc3lzdGVtX3Byb3BlcnR5X2dldCwge1xuICAgICAgICBvbkVudGVyOiBmdW5jdGlvbiAoYXJncykge1xuICAgICAgICAgICAgdGhpcy5uYW1lID0gYXJnc1swXS5yZWFkQ1N0cmluZygpO1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IGFyZ3NbMV07XG4gICAgICAgIH0sXG4gICAgICAgIG9uTGVhdmU6IGZ1bmN0aW9uIChyZXR2YWwpIHtcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IHRoaXMubmFtZTtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy52YWx1ZS5yZWFkQ1N0cmluZygpO1xuICAgICAgICAgICAgY29uc3QgZlZhbHVlID0gdmFsdWUgJiYgdmFsdWUubGVuZ3RoID49IDAgPyB2YWx1ZSA6IG51bGw7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBmbj8uY2FsbCh0aGlzLCBrZXksIGZWYWx1ZSk7XG4gICAgICAgICAgICBpZiAoIXJlc3VsdClcbiAgICAgICAgICAgICAgICByZXR1cm4gbG9nZ2VyLmluZm8oYCR7Z3JheShrZXkpfTogJHt2YWx1ZSA/PyByZXR2YWx9YCk7XG4gICAgICAgICAgICB0aGlzLnZhbHVlLndyaXRlVXRmOFN0cmluZyhyZXN1bHQpO1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oYCR7KGdyYXkoa2V5KSl9OiAke3JlZCh2YWx1ZSA/PyByZXR2YWwpfSAtPiAke2dyZWVuKHJlc3VsdCl9YCk7XG4gICAgICAgIH0sXG4gICAgfSk7XG59XG5leHBvcnQgeyBhdHRhY2hTeXN0ZW1Qcm9wZXJ0eUdldCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3lzdGVtUHJvcGVydHlHZXQuanMubWFwIiwiaW1wb3J0IHsgTGliYyB9IGZyb20gJ0BjbG9ja3dvcmsvY29tbW9uJztcbmZ1bmN0aW9uIGRlbGxvY2F0ZShwdHIpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBlbnYgPSBKYXZhLnZtLnRyeUdldEVudigpO1xuICAgICAgICBlbnY/LlJlbGVhc2VTdHJpbmdVVEZDaGFycyhwdHIpO1xuICAgIH1cbiAgICBjYXRjaCAoXykgeyB9XG59XG5mdW5jdGlvbiBta2RpcihwYXRoKSB7XG4gICAgY29uc3QgY1BhdGggPSBNZW1vcnkuYWxsb2NVdGY4U3RyaW5nKHBhdGgpO1xuICAgIGNvbnN0IGRpciA9IExpYmMub3BlbmRpcihjUGF0aCk7XG4gICAgaWYgKCFkaXIuaXNOdWxsKCkpIHtcbiAgICAgICAgTGliYy5jbG9zZWRpcihkaXIpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIExpYmMubWtkaXIoY1BhdGgsIDc1NSk7XG4gICAgTGliYy5jaG1vZChjUGF0aCwgNzU1KTtcbiAgICBkZWxsb2NhdGUoY1BhdGgpO1xuICAgIHJldHVybiB0cnVlO1xufVxuZnVuY3Rpb24gZ2V0U2VsZlByb2Nlc3NOYW1lKCkge1xuICAgIGNvbnN0IHBhdGggPSBNZW1vcnkuYWxsb2NVdGY4U3RyaW5nKCcvcHJvYy9zZWxmL2NtZGxpbmUnKTtcbiAgICBjb25zdCBmZCA9IExpYmMub3BlbihwYXRoLCAwKTtcbiAgICBkZWxsb2NhdGUocGF0aCk7XG4gICAgaWYgKGZkICE9PSAtMSkge1xuICAgICAgICBjb25zdCBidWZmZXIgPSBNZW1vcnkuYWxsb2MoMHgxMDAwKTtcbiAgICAgICAgTGliYy5yZWFkKGZkLCBidWZmZXIsIDB4MTAwMCk7XG4gICAgICAgIExpYmMuY2xvc2UoZmQpO1xuICAgICAgICByZXR1cm4gYnVmZmVyLnJlYWRDU3RyaW5nKCk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuZnVuY3Rpb24gZ2V0U2VsZkZpbGVzKCkge1xuICAgIGNvbnN0IHByb2Nlc3NfbmFtZSA9IGdldFNlbGZQcm9jZXNzTmFtZSgpO1xuICAgIGNvbnN0IGZpbGVzX2RpciA9ICcvZGF0YS9kYXRhLycgKyBwcm9jZXNzX25hbWUgKyAnL2ZpbGVzJztcbiAgICBta2RpcihmaWxlc19kaXIpO1xuICAgIHJldHVybiBmaWxlc19kaXI7XG59XG5mdW5jdGlvbiBjaG1vZChwYXRoKSB7XG4gICAgY29uc3QgY1BhdGggPSBNZW1vcnkuYWxsb2NVdGY4U3RyaW5nKHBhdGgpO1xuICAgIExpYmMuY2htb2QoY1BhdGgsIDc1NSk7XG4gICAgZGVsbG9jYXRlKGNQYXRoKTtcbn1cbmZ1bmN0aW9uIG1rZGlycyhiYXNlX3BhdGgsIGZpbGVfcGF0aCkge1xuICAgIGNvbnN0IGRpcl9hcnJheSA9IGZpbGVfcGF0aC5zcGxpdCgnLycpO1xuICAgIGxldCBwYXRoID0gYmFzZV9wYXRoO1xuICAgIGZvciAoY29uc3Qgc2VnbWVudCBvZiBkaXJfYXJyYXkpIHtcbiAgICAgICAgbWtkaXIocGF0aCk7XG4gICAgICAgIHBhdGggKz0gYC8ke3NlZ21lbnR9YDtcbiAgICB9XG59XG5mdW5jdGlvbiBkdW1wRmlsZShzdHJpbmdQdHIsIHNpemUsIHJlbGF0aXZlUGF0aCwgdGFnKSB7XG4gICAgY29uc3QgcHJvY2Vzc19uYW1lID0gZ2V0U2VsZlByb2Nlc3NOYW1lKCk7XG4gICAgY29uc3QgZmlsZXNEaXIgPSBgL2RhdGEvZGF0YS8ke3Byb2Nlc3NfbmFtZX0vZmlsZXNgO1xuICAgIG1rZGlyKGZpbGVzRGlyKTtcbiAgICBjb25zdCBkZXhEaXIgPSBgJHtmaWxlc0Rpcn0vZHVtcF8ke3RhZ31fJHtwcm9jZXNzX25hbWV9YDtcbiAgICBta2RpcihkZXhEaXIpO1xuICAgIGNvbnN0IGZ1bGxwYXRoID0gYCR7ZGV4RGlyfS8ke3JlbGF0aXZlUGF0aH1gO1xuICAgIC8vIE1lbW9yeS5wcm90ZWN0KHN0cmluZ1B0ciwgc2l6ZSwgJ3J3Jyk7XG4gICAgY29uc3QgYnVmZmVyID0gc3RyaW5nUHRyLnJlYWRDU3RyaW5nKHNpemUpO1xuICAgIGlmICghYnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgbWtkaXJzKGRleERpciwgcmVsYXRpdmVQYXRoKTtcbiAgICAvL0B0cy1pZ25vcmUgaXNzdWUgd2l0aCBGaWxlIGZyb20gZXNuZXh0IDUuNFxuICAgIGNvbnN0IGZpbGUgPSBuZXcgRmlsZShmdWxscGF0aCwgJ3cnKTtcbiAgICBmaWxlLndyaXRlKGJ1ZmZlcik7XG4gICAgZmlsZS5jbG9zZSgpO1xuICAgIHJldHVybiB0cnVlO1xufVxuZXhwb3J0IHsgZGVsbG9jYXRlLCBnZXRTZWxmUHJvY2Vzc05hbWUsIGdldFNlbGZGaWxlcywgZHVtcEZpbGUgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXV0aWxzLmpzLm1hcCIsImltcG9ydCB7IExpYmMgfSBmcm9tICdAY2xvY2t3b3JrL2NvbW1vbic7XG5pbXBvcnQgeyBsb2dnZXIsIENvbG9yIH0gZnJvbSAnQGNsb2Nrd29yay9sb2dnaW5nJztcbmZ1bmN0aW9uIGF0dGFjaEdldEhvc3RCeU5hbWUoKSB7XG4gICAgSW50ZXJjZXB0b3IuYXR0YWNoKExpYmMuZ2V0aG9zdGJ5bmFtZSwge1xuICAgICAgICBvbkVudGVyKGFyZ3MpIHtcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IGFyZ3NbMF0ucmVhZENTdHJpbmcoKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25MZWF2ZShyZXR2YWwpIHtcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKHsgdGFnOiAnZ2V0aG9zdGJ5bmFtZScgfSwgYCR7Q29sb3IudXJsKHRoaXMubmFtZSl9IC0+IHJlc3VsdDogJHtyZXR2YWx9YCk7XG4gICAgICAgIH0sXG4gICAgfSk7XG59XG5mdW5jdGlvbiBhdHRhY2hHZXRBZGRySW5mbyhkZXRhaWxlZCA9IGZhbHNlKSB7XG4gICAgSW50ZXJjZXB0b3IuYXR0YWNoKExpYmMuZ2V0YWRkcmluZm8sIHtcbiAgICAgICAgb25FbnRlcihhcmdzKSB7XG4gICAgICAgICAgICB0aGlzLmhvc3QgPSBhcmdzWzBdLnJlYWRDU3RyaW5nKCk7XG4gICAgICAgICAgICB0aGlzLnBvcnQgPSBhcmdzWzFdLnJlYWRDU3RyaW5nKCk7XG4gICAgICAgICAgICB0aGlzLnJlc3VsdCA9IGFyZ3NbMl07XG4gICAgICAgIH0sXG4gICAgICAgIG9uTGVhdmUocmV0dmFsKSB7XG4gICAgICAgICAgICBjb25zdCByZXNJbnQgPSByZXR2YWwudG9VSW50MzIoKTtcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSAhdGhpcy5wb3J0IHx8IHRoaXMucG9ydCA9PT0gJ251bGwnID8gYCR7dGhpcy5ob3N0fWAgOiBgJHt0aGlzLmhvc3R9OiR7dGhpcy5wb3J0fWA7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSByZXNJbnQgPT09IDB4MCA/ICdzdWNjZXNzJyA6ICdmYWlsdXJlJztcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKHsgdGFnOiAnZ2V0YWRkcmluZm8nIH0sIGAke0NvbG9yLnVybCh0ZXh0KX0gLT4gJHtyZXN1bHR9YCk7XG4gICAgICAgICAgICBpZiAocmVzSW50ID09IDB4MCkge1xuICAgICAgICAgICAgICAgIGxldCBwdHIgPSB0aGlzLnJlc3VsdDtcbiAgICAgICAgICAgICAgICBpZiAoIWRldGFpbGVkKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgY29uc3QgYWlGbGFncyA9IChwdHIgPSBwdHIuYWRkKDApKS5yZWFkSW50KCk7XG4gICAgICAgICAgICAgICAgY29uc3QgYWlGYW1pbHR5ID0gKHB0ciA9IHB0ci5hZGQoNCkpLnJlYWRJbnQoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBhaVNvY2tUeXBlID0gKHB0ciA9IHB0ci5hZGQoNCkpLnJlYWRJbnQoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBhaVByb3RvY29sID0gKHB0ciA9IHB0ci5hZGQoNCkpLnJlYWRJbnQoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBhaUFkZHJMZW4gPSAocHRyID0gcHRyLmFkZCg0KSkucmVhZFVJbnQoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBhaUFkZHIgPSAocHRyID0gcHRyLmFkZCg0KSkucmVhZFBvaW50ZXIoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBhaUNhbm5vbk5hbWUgPSAocHRyID0gcHRyLmFkZCg4KSkucmVhZENTdHJpbmcoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBhaU5leHQgPSAocHRyID0gcHRyLmFkZCg4KSkucmVhZFBvaW50ZXIoKTtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyh7IHRhZzogJ2dldGFkZHJpbmZvJyB9LCBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgIGFpRmxhZ3M6IGFpRmxhZ3MsXG4gICAgICAgICAgICAgICAgICAgIGFpRmFtaWx0eTogYWlGYW1pbHR5LFxuICAgICAgICAgICAgICAgICAgICBhaVNvY2tUeXBlOiBhaVNvY2tUeXBlLFxuICAgICAgICAgICAgICAgICAgICBhaVByb3RvY29sOiBhaVByb3RvY29sLFxuICAgICAgICAgICAgICAgICAgICBhaUFkZHJMZW46IGFpQWRkckxlbixcbiAgICAgICAgICAgICAgICAgICAgYWlBZGRyOiBhaUFkZHIsXG4gICAgICAgICAgICAgICAgICAgIGFpQ2Fubm9uTmFtZTogYWlDYW5ub25OYW1lLFxuICAgICAgICAgICAgICAgICAgICBhaU5leHQ6IGFpTmV4dCxcbiAgICAgICAgICAgICAgICB9LCBudWxsLCAyKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfSk7XG59XG5mdW5jdGlvbiBhdHRhY2hJbnRlQXRvbigpIHtcbiAgICBJbnRlcmNlcHRvci5hdHRhY2goTGliYy5pbmV0X2F0b24sIHtcbiAgICAgICAgb25FbnRlcihhcmdzKSB7XG4gICAgICAgICAgICB0aGlzLmFkZHIgPSBhcmdzWzBdLnJlYWRDU3RyaW5nKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uTGVhdmUocmV0dmFsKSB7XG4gICAgICAgICAgICBsb2dnZXIuaW5mbyh7IHRhZzogJ2luZXRfYXRvbicgfSwgYCR7dGhpcy5hZGRyfSAtPiAke3JldHZhbH1gKTtcbiAgICAgICAgfSxcbiAgICB9KTtcbn1cbmV4cG9ydCB7IGF0dGFjaEdldEFkZHJJbmZvLCBhdHRhY2hHZXRIb3N0QnlOYW1lLCBhdHRhY2hJbnRlQXRvbiB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aG9zdGFkZHIuanMubWFwIiwiZXhwb3J0IHsgYXR0YWNoR2V0QWRkckluZm8sIGF0dGFjaEdldEhvc3RCeU5hbWUsIGF0dGFjaEludGVBdG9uIH0gZnJvbSAnLi9ob3N0YWRkci5qcyc7XG5leHBvcnQgeyBhdHRhY2hOYXRpdmVTb2NrZXQgfSBmcm9tICcuL3NvY2tldC5qcyc7XG5leHBvcnQgeyB1c2VUcnVzdE1hbmFnZXIsIGluamVjdFNzbCB9IGZyb20gJy4vdHJ1c3RtYW5hZ2VyLmpzJztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsImltcG9ydCB7IExpYmMgfSBmcm9tICdAY2xvY2t3b3JrL2NvbW1vbic7XG5pbXBvcnQgeyBzdWJMb2dnZXIgfSBmcm9tICdAY2xvY2t3b3JrL2xvZ2dpbmcnO1xuY29uc3QgbG9nZ2VyID0gc3ViTG9nZ2VyKCdzb2NrZXQnKTtcbmZ1bmN0aW9uIGF0dGFjaE5hdGl2ZVNvY2tldCgpIHtcbiAgICBjb25zdCBzdGFja3RyYWNlID0gZmFsc2UsIGJhY2t0cmFjZSA9IGZhbHNlO1xuICAgIGNvbnN0IHRjcFNvY2tldEZEcyA9IG5ldyBNYXAoKTtcbiAgICBJbnRlcmNlcHRvci5hdHRhY2goTGliYy5jb25uZWN0LCB7XG4gICAgICAgIG9uRW50ZXIoYXJncykge1xuICAgICAgICAgICAgdGhpcy5zb2NrRmQgPSBhcmdzWzBdLnRvSW50MzIoKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25MZWF2ZShyZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHNvY2tGZCA9IHRoaXMuc29ja0ZkO1xuICAgICAgICAgICAgY29uc3Qgc29ja1R5cGUgPSBTb2NrZXQudHlwZShzb2NrRmQpO1xuICAgICAgICAgICAgaWYgKCEoc29ja1R5cGUgPT09ICd0Y3AnIHx8IHNvY2tUeXBlID09PSAndGNwNicpKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGNvbnN0IHNvY2tMb2NhbCA9IFNvY2tldC5sb2NhbEFkZHJlc3Moc29ja0ZkKTtcbiAgICAgICAgICAgIGNvbnN0IHRjcEVwTG9jYWwgPSBzb2NrTG9jYWwgPz8gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3Qgc29ja1JlbW90ZSA9IFNvY2tldC5wZWVyQWRkcmVzcyhzb2NrRmQpO1xuICAgICAgICAgICAgY29uc3QgdGNwRXBSZW1vdGUgPSBzb2NrUmVtb3RlID8/IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGlmICghdGNwRXBMb2NhbClcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAvLyBUb0RvOiBpZiBzb2NrZXQgRkQgYWxyZWFkeSBleGlzdHMgaW4gdGhlIHNldCwgYSBmYWtlZCAnY2xvc2UnIG1lc3NhZ2Ugc2hhbGwgYmUgc2VudCBmaXJzdCAoY3VycmVudGx5IGhhbmRsZWQgYnkgcmVjZWl2aW5nIGxvZ2ljKVxuICAgICAgICAgICAgdGNwU29ja2V0RkRzLnNldChzb2NrRmQsIHRjcEVwTG9jYWwpO1xuICAgICAgICAgICAgY29uc3QgbXNnID0ge1xuICAgICAgICAgICAgICAgIHNvY2tldEZkOiBzb2NrRmQsXG4gICAgICAgICAgICAgICAgcGlkOiBQcm9jZXNzLmlkLFxuICAgICAgICAgICAgICAgIHRocmVhZElkOiB0aGlzLnRocmVhZElkLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdjb25uZWN0JyxcbiAgICAgICAgICAgICAgICBob3N0SXA6IHRjcEVwTG9jYWw/LmlwLFxuICAgICAgICAgICAgICAgIHBvcnQ6IHRjcEVwTG9jYWw/LnBvcnQsXG4gICAgICAgICAgICAgICAgZHN0SXA6IHRjcEVwUmVtb3RlPy5pcCxcbiAgICAgICAgICAgICAgICBkc3RQb3J0OiB0Y3BFcFJlbW90ZT8ucG9ydCxcbiAgICAgICAgICAgICAgICByZXN1bHQ6IHJlcyxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAoc3RhY2t0cmFjZSAmJiBKYXZhLmF2YWlsYWJsZSAmJiBKYXZhLnZtICE9PSBudWxsICYmIEphdmEudm0udHJ5R2V0RW52KCkpIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVja3MgaWYgVGhyZWFkIGlzIEpWTSBhdHRhY2hlZCAoSk5JIGVudiBhdmFpbGFibGUpXG4gICAgICAgICAgICAgICAgY29uc3QgZXhjZXB0aW9uID0gSmF2YS51c2UoJ2phdmEubGFuZy5FeGNlcHRpb24nKS4kbmV3KCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdHJhY2UgPSBleGNlcHRpb24uZ2V0U3RhY2tUcmFjZSgpO1xuICAgICAgICAgICAgICAgIC8vIG1zZy5zdGFja3RyYWNlID0gdHJhY2UubWFwKCh0cmFjZUVsKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBjbGFzczogdHJhY2VFbC5nZXRDbGFzc05hbWUoKSxcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGZpbGU6IHRyYWNlRWwuZ2V0RmlsZU5hbWUoKSxcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGxpbmU6IHRyYWNlRWwuZ2V0TGluZU51bWJlcigpLFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgbWV0aG9kOiB0cmFjZUVsLmdldE1ldGhvZE5hbWUoKSxcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGlzTmF0aXZlOiB0cmFjZUVsLmlzTmF0aXZlTWV0aG9kKCksXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBzdHI6IHRyYWNlRWwudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAvLyAgICAgfTtcbiAgICAgICAgICAgICAgICAvLyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChiYWNrdHJhY2UpIHtcbiAgICAgICAgICAgICAgICAvLyBtc2cuYmFja3RyYWNlID0gVGhyZWFkLmJhY2t0cmFjZSh0aGlzLmNvbnRleHQsIEJhY2t0cmFjZXIuQUNDVVJBVEUpLm1hcChEZWJ1Z1N5bWJvbC5mcm9tQWRkcmVzcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL3NlbmQobXNnKVxuICAgICAgICAgICAgbG9nT3Blbihtc2cpO1xuICAgICAgICB9LFxuICAgIH0pO1xuICAgIFtMaWJjLmNsb3NlLCBMaWJjLnNodXRkb3duXS5mb3JFYWNoKChmbiwgaSkgPT4ge1xuICAgICAgICBJbnRlcmNlcHRvci5hdHRhY2goZm4sIHtcbiAgICAgICAgICAgIG9uRW50ZXIoYXJncykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNvY2tGZCA9IGFyZ3NbMF0udG9JbnQzMigpO1xuICAgICAgICAgICAgICAgIGlmICghdGNwU29ja2V0RkRzLmhhcyhzb2NrRmQpKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgY29uc3Qgc29ja1R5cGUgPSBTb2NrZXQudHlwZShzb2NrRmQpO1xuICAgICAgICAgICAgICAgIGlmICh0Y3BTb2NrZXRGRHMuaGFzKHNvY2tGZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGNwRVAgPSB0Y3BTb2NrZXRGRHMuZ2V0KHNvY2tGZCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1zZyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvY2tldEZkOiBzb2NrRmQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IFByb2Nlc3MuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJlYWRJZDogdGhpcy50aHJlYWRJZHMsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBbJ2Nsb3NlJywgJ3NodXRkb3duJ11baV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBob3N0SXA6IHRjcEVQPy5pcCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcnQ6IHRjcEVQPy5wb3J0LFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB0Y3BTb2NrZXRGRHMuZGVsZXRlKHNvY2tGZCk7XG4gICAgICAgICAgICAgICAgICAgIC8vc2VuZChtc2cpXG4gICAgICAgICAgICAgICAgICAgIGxvZ0Nsb3NlKG1zZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBsb2dPcGVuKG1zZykge1xuICAgIGNvbnN0IGhvc3QgPSAoYCR7bXNnLmhvc3RJcD8ucmVwbGFjZSgnOjpmZmZmOicsICcnKX1gICsgU3RyaW5nKG1zZy5wb3J0ID8gYDoke21zZy5wb3J0fWAgOiAnJykpO1xuICAgIGNvbnN0IGRlc3QgPSAobXNnLmRzdElwID8gKGAsIGRzdEAke21zZy5kc3RJcC5yZXBsYWNlKCc6OmZmZmY6JywgJycpfWAgKyBTdHJpbmcobXNnLmRzdFBvcnQgPyBgOiR7bXNnLmRzdFBvcnR9YCA6ICcnKSkgOiAnJyk7XG4gICAgbG9nZ2VyLmluZm8oYChwaWQ6ICR7bXNnLnBpZH0sIHRocmVhZDogJHttc2cudGhyZWFkSWR9LCBmZDogJHttc2cuc29ja2V0RmR9KSAke21zZy50eXBlfSAtPiBbaG9zdEAke2hvc3R9JHtkZXN0fV1gKTtcbn1cbmZ1bmN0aW9uIGxvZ0Nsb3NlKG1zZykge1xuICAgIGNvbnN0IGhvc3QgPSAoYCR7bXNnLmhvc3RJcD8ucmVwbGFjZSgnOjpmZmZmOicsICcnKX1gICsgU3RyaW5nKG1zZy5wb3J0ID8gYDoke21zZy5wb3J0fWAgOiAnJykpO1xuICAgIGNvbnN0IHRocmVhZCA9IChtc2cudGhyZWFkSWQgPyBgLCB0aHJlYWQ6ICR7bXNnLnRocmVhZElkfWAgOiAnJyk7XG4gICAgbG9nZ2VyLmluZm8oYChwaWQ6ICR7bXNnLnBpZH0ke3RocmVhZH0sIGZkOiAke21zZy5zb2NrZXRGZH0pICR7bXNnLnR5cGV9IC0+ICR7aG9zdH1gKTtcbn1cbmV4cG9ydCB7IGF0dGFjaE5hdGl2ZVNvY2tldCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c29ja2V0LmpzLm1hcCIsImltcG9ydCB7IGdldEhvb2tVbmlxdWUgfSBmcm9tICdAY2xvY2t3b3JrL2hvb2tzJztcbmltcG9ydCB7IGZpbmRDbGFzcywgZ2V0Q2xhc3MgfSBmcm9tICdAY2xvY2t3b3JrL2NvbW1vbic7XG5pbXBvcnQgeyBhbHdheXMgfSBmcm9tICdAY2xvY2t3b3JrL2hvb2tzL2Rpc3QvYWRkb25zLmpzJztcbmNvbnN0IGNsYXNzTmFtZSA9ICdjb20uZ29vZ2xlLmluLk1lbW9yeVRydXN0TWFuYWdlcic7XG5jb25zdCBkZXhCeXRlcyA9IFtcbiAgICAweDY0LCAweDY1LCAweDc4LCAweDBhLCAweDMwLCAweDMzLCAweDM1LCAweDAwLCAweDhlLCAweGEyLCAweDczLCAweGYyLCAweGE2LCAweGYwLCAweDk5LCAweDY3LCAweGM4LCAweDU4LCAweDExLCAweDNmLCAweDE5LCAweGEyLFxuICAgIDB4NzgsIDB4YmQsIDB4ZWMsIDB4OTcsIDB4ZjksIDB4ODAsIDB4MzIsIDB4NjQsIDB4MTksIDB4YzUsIDB4YmMsIDB4MDMsIDB4MDAsIDB4MDAsIDB4NzAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4NzgsIDB4NTYsIDB4MzQsIDB4MTIsXG4gICAgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwNCwgMHgwMywgMHgwMCwgMHgwMCwgMHgxMSwgMHgwMCwgMHgwMCwgMHgwMCwgMHg3MCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwOCwgMHgwMCxcbiAgICAweDAwLCAweDAwLCAweGI0LCAweDAwLCAweDAwLCAweDAwLCAweDAzLCAweDAwLCAweDAwLCAweDAwLCAweGQ0LCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAwLFxuICAgIDB4MDUsIDB4MDAsIDB4MDAsIDB4MDAsIDB4ZjgsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDEsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MjAsIDB4MDEsIDB4MDAsIDB4MDAsIDB4N2MsIDB4MDIsIDB4MDAsIDB4MDAsIDB4NDAsIDB4MDEsXG4gICAgMHgwMCwgMHgwMCwgMHg5MCwgMHgwMSwgMHgwMCwgMHgwMCwgMHg5OCwgMHgwMSwgMHgwMCwgMHgwMCwgMHg5YiwgMHgwMSwgMHgwMCwgMHgwMCwgMHhiZiwgMHgwMSwgMHgwMCwgMHgwMCwgMHhkYiwgMHgwMSwgMHgwMCwgMHgwMCxcbiAgICAweGVmLCAweDAxLCAweDAwLCAweDAwLCAweDAzLCAweDAyLCAweDAwLCAweDAwLCAweDJlLCAweDAyLCAweDAwLCAweDAwLCAweDUwLCAweDAyLCAweDAwLCAweDAwLCAweDY5LCAweDAyLCAweDAwLCAweDAwLCAweDZjLCAweDAyLFxuICAgIDB4MDAsIDB4MDAsIDB4NzEsIDB4MDIsIDB4MDAsIDB4MDAsIDB4OTgsIDB4MDIsIDB4MDAsIDB4MDAsIDB4YWMsIDB4MDIsIDB4MDAsIDB4MDAsIDB4YzAsIDB4MDIsIDB4MDAsIDB4MDAsIDB4ZDQsIDB4MDIsIDB4MDAsIDB4MDAsXG4gICAgMHhkYSwgMHgwMiwgMHgwMCwgMHgwMCwgMHgwMiwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMywgMHgwMCwgMHgwMCwgMHgwMCwgMHgwNCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwNSwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwNiwgMHgwMCxcbiAgICAweDAwLCAweDAwLCAweDA3LCAweDAwLCAweDAwLCAweDAwLCAweDA5LCAweDAwLCAweDAwLCAweDAwLCAweDBiLCAweDAwLCAweDAwLCAweDAwLCAweDA5LCAweDAwLCAweDAwLCAweDAwLCAweDA2LCAweDAwLCAweDAwLCAweDAwLFxuICAgIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MGEsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDYsIDB4MDAsIDB4MDAsIDB4MDAsIDB4ODgsIDB4MDEsIDB4MDAsIDB4MDAsIDB4MDEsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDcsIDB4MDAsXG4gICAgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMSwgMHgwMCwgMHgwYywgMHgwMCwgMHgwMCwgMHgwMCxcbiAgICAweDAwLCAweDAwLCAweDAxLCAweDAwLCAweDBkLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAyLCAweDAwLCAweDBlLCAweDAwLCAweDAwLCAweDAwLCAweDAyLCAweDAwLCAweDAwLCAweDAwLCAweDAwLCAweDAwLFxuICAgIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDEsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDIsIDB4MDAsIDB4MDAsIDB4MDAsIDB4ODAsIDB4MDEsIDB4MDAsIDB4MDAsIDB4MDgsIDB4MDAsIDB4MDAsIDB4MDAsXG4gICAgMHg2MCwgMHgwMSwgMHgwMCwgMHgwMCwgMHhlZSwgMHgwMiwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMSwgMHgwMCwgMHgwMCwgMHgwMCwgMHhlNiwgMHgwMiwgMHgwMCwgMHgwMCwgMHgwMSwgMHgwMCxcbiAgICAweDAxLCAweDAwLCAweDAxLCAweDAwLCAweDAwLCAweDAwLCAweGUxLCAweDAyLCAweDAwLCAweDAwLCAweDA0LCAweDAwLCAweDAwLCAweDAwLCAweDcwLCAweDEwLCAweDA0LCAweDAwLCAweDAwLCAweDAwLCAweDBlLCAweDAwLFxuICAgIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDIsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDEsIDB4MDAsIDB4MDAsIDB4MDAsIDB4NDAsIDB4MDEsXG4gICAgMHgwMCwgMHgwMCwgMHgwMiwgMHgwMCwgMHgwMCwgMHgwMCwgMHg0MCwgMHgwMSwgMHgwMCwgMHgwMCwgMHgwMSwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwNSwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMiwgMHgwMCwgMHgwMCwgMHgwMCxcbiAgICAweDA3LCAweDAwLCAweDAzLCAweDAwLCAweDA2LCAweDNjLCAweDY5LCAweDZlLCAweDY5LCAweDc0LCAweDNlLCAweDAwLCAweDAxLCAweDRjLCAweDAwLCAweDIyLCAweDRjLCAweDYzLCAweDZmLCAweDZkLCAweDJmLCAweDY3LFxuICAgIDB4NmYsIDB4NmYsIDB4NjcsIDB4NmMsIDB4NjUsIDB4MmYsIDB4NjksIDB4NmUsIDB4MmYsIDB4NGQsIDB4NjUsIDB4NmQsIDB4NmYsIDB4NzIsIDB4NzksIDB4NTQsIDB4NzIsIDB4NzUsIDB4NzMsIDB4NzQsIDB4NGQsIDB4NjEsXG4gICAgMHg2ZSwgMHg2MSwgMHg2NywgMHg2NSwgMHg3MiwgMHgzYiwgMHgwMCwgMHgxYSwgMHg0YywgMHg2NCwgMHg2MSwgMHg2YywgMHg3NiwgMHg2OSwgMHg2YiwgMHgyZiwgMHg2MSwgMHg2ZSwgMHg2ZSwgMHg2ZiwgMHg3NCwgMHg2MSxcbiAgICAweDc0LCAweDY5LCAweDZmLCAweDZlLCAweDJmLCAweDU0LCAweDY4LCAweDcyLCAweDZmLCAweDc3LCAweDczLCAweDNiLCAweDAwLCAweDEyLCAweDRjLCAweDZhLCAweDYxLCAweDc2LCAweDYxLCAweDJmLCAweDZjLCAweDYxLFxuICAgIDB4NmUsIDB4NjcsIDB4MmYsIDB4NGYsIDB4NjIsIDB4NmEsIDB4NjUsIDB4NjMsIDB4NzQsIDB4M2IsIDB4MDAsIDB4MTIsIDB4NGMsIDB4NmEsIDB4NjEsIDB4NzYsIDB4NjEsIDB4MmYsIDB4NmMsIDB4NjEsIDB4NmUsIDB4NjcsXG4gICAgMHgyZiwgMHg1MywgMHg3NCwgMHg3MiwgMHg2OSwgMHg2ZSwgMHg2NywgMHgzYiwgMHgwMCwgMHgyOSwgMHg0YywgMHg2YSwgMHg2MSwgMHg3NiwgMHg2MSwgMHgyZiwgMHg3MywgMHg2NSwgMHg2MywgMHg3NSwgMHg3MiwgMHg2OSxcbiAgICAweDc0LCAweDc5LCAweDJmLCAweDYzLCAweDY1LCAweDcyLCAweDc0LCAweDJmLCAweDQzLCAweDY1LCAweDcyLCAweDc0LCAweDY5LCAweDY2LCAweDY5LCAweDYzLCAweDYxLCAweDc0LCAweDY1LCAweDQ1LCAweDc4LCAweDYzLFxuICAgIDB4NjUsIDB4NzAsIDB4NzQsIDB4NjksIDB4NmYsIDB4NmUsIDB4M2IsIDB4MDAsIDB4MjAsIDB4NGMsIDB4NmEsIDB4NjEsIDB4NzYsIDB4NjEsIDB4NzgsIDB4MmYsIDB4NmUsIDB4NjUsIDB4NzQsIDB4MmYsIDB4NzMsIDB4NzMsXG4gICAgMHg2YywgMHgyZiwgMHg1OCwgMHgzNSwgMHgzMCwgMHgzOSwgMHg1NCwgMHg3MiwgMHg3NSwgMHg3MywgMHg3NCwgMHg0ZCwgMHg2MSwgMHg2ZSwgMHg2MSwgMHg2NywgMHg2NSwgMHg3MiwgMHgzYiwgMHgwMCwgMHgxNywgMHg0ZCxcbiAgICAweDY1LCAweDZkLCAweDZmLCAweDcyLCAweDc5LCAweDU0LCAweDcyLCAweDc1LCAweDczLCAweDc0LCAweDRkLCAweDYxLCAweDZlLCAweDYxLCAweDY3LCAweDY1LCAweDcyLCAweDJlLCAweDZhLCAweDYxLCAweDc2LCAweDYxLFxuICAgIDB4MDAsIDB4MDEsIDB4NTYsIDB4MDAsIDB4MDMsIDB4NTYsIDB4NGMsIDB4NGMsIDB4MDAsIDB4MjUsIDB4NWIsIDB4NGMsIDB4NmEsIDB4NjEsIDB4NzYsIDB4NjEsIDB4MmYsIDB4NzMsIDB4NjUsIDB4NjMsIDB4NzUsIDB4NzIsXG4gICAgMHg2OSwgMHg3NCwgMHg3OSwgMHgyZiwgMHg2MywgMHg2NSwgMHg3MiwgMHg3NCwgMHgyZiwgMHg1OCwgMHgzNSwgMHgzMCwgMHgzOSwgMHg0MywgMHg2NSwgMHg3MiwgMHg3NCwgMHg2OSwgMHg2NiwgMHg2OSwgMHg2MywgMHg2MSxcbiAgICAweDc0LCAweDY1LCAweDNiLCAweDAwLCAweDEyLCAweDYzLCAweDY4LCAweDY1LCAweDYzLCAweDZiLCAweDQzLCAweDZjLCAweDY5LCAweDY1LCAweDZlLCAweDc0LCAweDU0LCAweDcyLCAweDc1LCAweDczLCAweDc0LCAweDY1LFxuICAgIDB4NjQsIDB4MDAsIDB4MTIsIDB4NjMsIDB4NjgsIDB4NjUsIDB4NjMsIDB4NmIsIDB4NTMsIDB4NjUsIDB4NzIsIDB4NzYsIDB4NjUsIDB4NzIsIDB4NTQsIDB4NzIsIDB4NzUsIDB4NzMsIDB4NzQsIDB4NjUsIDB4NjQsIDB4MDAsXG4gICAgMHgxMiwgMHg2NywgMHg2NSwgMHg3NCwgMHg0MSwgMHg2MywgMHg2MywgMHg2NSwgMHg3MCwgMHg3NCwgMHg2NSwgMHg2NCwgMHg0OSwgMHg3MywgMHg3MywgMHg3NSwgMHg2NSwgMHg3MiwgMHg3MywgMHgwMCwgMHgwNCwgMHg3NCxcbiAgICAweDY4LCAweDY5LCAweDczLCAweDAwLCAweDA1LCAweDc2LCAweDYxLCAweDZjLCAweDc1LCAweDY1LCAweDAwLCAweDAzLCAweDAwLCAweDA3LCAweDBlLCAweDAwLCAweDAyLCAweDAxLCAweDAxLCAweDEwLCAweDFjLCAweDAxLFxuICAgIDB4MTgsIDB4MDQsIDB4MDAsIDB4MDAsIDB4MDEsIDB4MDMsIDB4MDAsIDB4ODEsIDB4ODAsIDB4MDQsIDB4YzgsIDB4MDIsIDB4MDEsIDB4ODEsIDB4MDIsIDB4MDAsIDB4MDEsIDB4ODEsIDB4MDIsIDB4MDAsIDB4MDEsIDB4ODEsXG4gICAgMHgwMiwgMHgwMCwgMHgwZiwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMSwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMSwgMHgwMCwgMHgwMCwgMHgwMCxcbiAgICAweDExLCAweDAwLCAweDAwLCAweDAwLCAweDcwLCAweDAwLCAweDAwLCAweDAwLCAweDAyLCAweDAwLCAweDAwLCAweDAwLCAweDA4LCAweDAwLCAweDAwLCAweDAwLCAweGI0LCAweDAwLCAweDAwLCAweDAwLCAweDAzLCAweDAwLFxuICAgIDB4MDAsIDB4MDAsIDB4MDMsIDB4MDAsIDB4MDAsIDB4MDAsIDB4ZDQsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDUsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDUsIDB4MDAsIDB4MDAsIDB4MDAsIDB4ZjgsIDB4MDAsIDB4MDAsIDB4MDAsXG4gICAgMHgwNiwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMSwgMHgwMCwgMHgwMCwgMHgwMCwgMHgyMCwgMHgwMSwgMHgwMCwgMHgwMCwgMHgwMywgMHgxMCwgMHgwMCwgMHgwMCwgMHgwMSwgMHgwMCwgMHgwMCwgMHgwMCwgMHg0MCwgMHgwMSxcbiAgICAweDAwLCAweDAwLCAweDAxLCAweDIwLCAweDAwLCAweDAwLCAweDAxLCAweDAwLCAweDAwLCAweDAwLCAweDQ4LCAweDAxLCAweDAwLCAweDAwLCAweDA2LCAweDIwLCAweDAwLCAweDAwLCAweDAxLCAweDAwLCAweDAwLCAweDAwLFxuICAgIDB4NjAsIDB4MDEsIDB4MDAsIDB4MDAsIDB4MDEsIDB4MTAsIDB4MDAsIDB4MDAsIDB4MDIsIDB4MDAsIDB4MDAsIDB4MDAsIDB4ODAsIDB4MDEsIDB4MDAsIDB4MDAsIDB4MDIsIDB4MjAsIDB4MDAsIDB4MDAsIDB4MTEsIDB4MDAsXG4gICAgMHgwMCwgMHgwMCwgMHg5MCwgMHgwMSwgMHgwMCwgMHgwMCwgMHgwMywgMHgyMCwgMHgwMCwgMHgwMCwgMHgwMSwgMHgwMCwgMHgwMCwgMHgwMCwgMHhlMSwgMHgwMiwgMHgwMCwgMHgwMCwgMHgwNCwgMHgyMCwgMHgwMCwgMHgwMCxcbiAgICAweDAxLCAweDAwLCAweDAwLCAweDAwLCAweGU2LCAweDAyLCAweDAwLCAweDAwLCAweDAwLCAweDIwLCAweDAwLCAweDAwLCAweDAxLCAweDAwLCAweDAwLCAweDAwLCAweGVlLCAweDAyLCAweDAwLCAweDAwLCAweDAwLCAweDEwLFxuICAgIDB4MDAsIDB4MDAsIDB4MDEsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDQsIDB4MDMsIDB4MDAsIDB4MDAsXG5dO1xuZnVuY3Rpb24gdXNlVHJ1c3RNYW5hZ2VyKGxvYWRlcikge1xuICAgIGxvYWRlciA/Pz0gSmF2YS5jbGFzc0ZhY3RvcnkubG9hZGVyID8/IHVuZGVmaW5lZDtcbiAgICBpZiAoIWxvYWRlcikge1xuICAgICAgICB0aHJvdyBFcnJvcignQ2xhc3NMb2FkZXIgbm90IGZvdW5kICEnKTtcbiAgICB9XG4gICAgY29uc3QgSW5NZW1vcnlEZXhDbGFzc0xvYWRlciA9IGZpbmRDbGFzcygnZGFsdmlrLnN5c3RlbS5Jbk1lbW9yeURleENsYXNzTG9hZGVyJywgbG9hZGVyKTtcbiAgICBjb25zdCBCeXRlQnVmZmVyID0gZmluZENsYXNzKCdqYXZhLm5pby5CeXRlQnVmZmVyJywgbG9hZGVyKTtcbiAgICBpZiAoIUluTWVtb3J5RGV4Q2xhc3NMb2FkZXIgfHwgIUJ5dGVCdWZmZXIpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoYEluTWVtb3J5RGV4Q2xhc3NMb2FkZXI6ICR7SW5NZW1vcnlEZXhDbGFzc0xvYWRlcn0sIEJ5dGVCdWZmZXI6ICR7Qnl0ZUJ1ZmZlcn1gKTtcbiAgICB9XG4gICAgY29uc3QgaW5NZW1vcnkgPSBJbk1lbW9yeURleENsYXNzTG9hZGVyLiRuZXcoQnl0ZUJ1ZmZlci53cmFwKEphdmEuYXJyYXkoJ0InLCBkZXhCeXRlcykpLCBsb2FkZXIpO1xuICAgIHJldHVybiBnZXRDbGFzcyhjbGFzc05hbWUsIGluTWVtb3J5KTtcbn1cbmZ1bmN0aW9uIGluamVjdFNzbCgpIHtcbiAgICBjb25zdCB1bmlxSG9vayA9IGdldEhvb2tVbmlxdWUoKTtcbiAgICBjb25zdCBtVHJ1c3RNYW5hZ2VycyA9IFtdO1xuICAgIHVuaXFIb29rKCdqYXZheC5uZXQuc3NsLlNTTENvbnRleHQnLCAnaW5pdCcsIHtcbiAgICAgICAgcmVwbGFjZShtZXRob2QsIC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIGlmIChtVHJ1c3RNYW5hZ2Vycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtZ3IgPSB1c2VUcnVzdE1hbmFnZXIoKT8uJG5ldygpO1xuICAgICAgICAgICAgICAgIGlmIChtZ3IpXG4gICAgICAgICAgICAgICAgICAgIG1UcnVzdE1hbmFnZXJzLnB1c2gobWdyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtVHJ1c3RNYW5hZ2Vycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgYXJnc1sxXSA9IG1UcnVzdE1hbmFnZXJzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG1ldGhvZC5jYWxsKHRoaXMsIC4uLmFyZ3MpO1xuICAgICAgICB9LFxuICAgIH0pO1xuICAgIHVuaXFIb29rKCdva2h0dHAzLkNlcnRpZmljYXRlUGlubmVyJywgJ2NoZWNrJywge1xuICAgICAgICByZXBsYWNlOiBhbHdheXModHJ1ZSksXG4gICAgfSk7XG4gICAgdW5pcUhvb2soJ2NvbS5hbmRyb2lkLm9yZy5jb25zY3J5cHQuVHJ1c3RNYW5hZ2VySW1wbCcsICd2ZXJpZnlDaGFpbicsIHtcbiAgICAgICAgcmVwbGFjZTogKF8sIC4uLnBhcmFtcykgPT4gcGFyYW1zWzBdLFxuICAgIH0pO1xuICAgIHVuaXFIb29rKCdjb20uZGF0YXRoZW9yZW0uYW5kcm9pZC50cnVzdGtpdC5waW5uaW5nLk9rSG9zdG5hbWVWZXJpZmllcicsICd2ZXJpZnknLCB7XG4gICAgICAgIHJlcGxhY2U6IGFsd2F5cyh0cnVlKSxcbiAgICB9KTtcbiAgICB1bmlxSG9vaygnYXBwY2VsZXJhdG9yLmh0dHBzLlBpbm5pbmdUcnVzdE1hbmFnZXInLCAnY2hlY2tTZXJ2ZXJUcnVzdGVkJywge1xuICAgICAgICByZXBsYWNlOiBhbHdheXMobnVsbCksXG4gICAgfSk7XG59XG5leHBvcnQgeyB1c2VUcnVzdE1hbmFnZXIsIGluamVjdFNzbCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dHJ1c3RtYW5hZ2VyLmpzLm1hcCIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9hZ2VudC9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==