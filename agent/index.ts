import { ClassLoader, findHook, getHookUnique } from '@clockwork/hooks';
import * as Network from '@clockwork/network';
import * as Native from '@clockwork/native';
import * as JniTrace from '@clockwork/jnitrace';
import * as Cocos2dx from '@clockwork/cocos2dx';
import * as Unity from '@clockwork/unity';
import { hook } from '@clockwork/hooks';
import { Classes, Libc, enumerateMembers, findClass, stacktrace } from '@clockwork/common';
import { log, logger, Color } from '@clockwork/logging';
import { always, ifKey, ifReturn } from '@clockwork/hooks/dist/addons';
const uniqHook = getHookUnique();
const { blue, blueBright, redBright, magentaBright: pink } = Color.use();

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

function hookCrypto() {
    //  hook(Classes.SecretKeySpec, '$init', {
    //     logging: { multiline: false },
    // });
    // hook(JTypes.Cipher, 'getInstance');
    hook(Classes.Cipher, 'doFinal', {
        after(m, r, ...p) {
            if (this.opmode.value === 1) {
                const str = Classes.String.$new(p[0]);
                log(`[${blueBright('encrypt')}] ${str}`);
            }
            if (this.opmode.value === 2) {
                const str = Classes.String.$new(r);
                log(`[${redBright('decrypt')}] ${str}`);
            }
        },
        logging: { arguments: false, return: false },
    });
}

function hookJson() {
    hook(Classes.JSONObject, '$init', {
        predicate: (_, index) => index !== 0 && index !== 4,
    });
}

function hookPrefs() {
    hook('android.app.SharedPreferencesImpl', 'getString', {
        replace: ifKey((key) => {
            switch (key.trim()) {
                case 'com.lucky.collage.artmygvddc':
                    return 'https://google.pl/search?q=hi';
            }
        }),
    });
    hook('android.app.SharedPreferencesImpl', 'getInt', {
        replace: ifKey((key) => {
            switch (key) {
            }
        }),
    });
    hook('android.app.SharedPreferencesImpl', 'getBoolean', {
        replace: ifKey((key) => {
            switch (key) {
                case 'com.picture.editor.studiocmgjqr':
                    return true;
            }
        }),
    });
    // hook('java.util.Properties', 'getProperty');
}

Java.performNow(() => {
    hookActivity();
    hookWebview();
    // hookJson();
    // hookPrefs();
    // hookCrypto();
    // hook(Classes.URL, 'openConnection');
    hook(Classes.Runtime, 'exec');
    hook('android.telephony.TelephonyManager', 'getSimOperator', {
        replace: ifReturn(() => log(pink(stacktrace()))),
    });
    let x: string[] = [];
    ClassLoader.perform((cl) => {
        uniqHook('III11.IIl1lII11l', 'l1l11', {
            after(method, returnValue, ...args) {
                console.log(`# ${returnValue}`);
            },
            logging: { call: false, return: false },
        });
    });
});

// Network.attachNativeSocket();
// Native.attachRegisterNatives();
Native.attachSystemPropertyGet(function (key) {
    // console.log(DebugSymbol.fromAddress(this.returnAddress));
    switch (key) {
        case 'ro.product.model':
            return 'Raven';
        case 'ro.product.brand':
            return 'Xiaomi';
        case 'ro.build.flavor':
            return 'raven-release';
    }
});

// Cocos2dx.dump({ name: 'libcocos.so', offset: ptr(0x0030be50) });
// Unity.attachStrings();

const predicate = (returnAddress: NativePointer) => {
    const name = Native.Inject.modules.findName(returnAddress);
    if (
        [
            'libpl_droidsonroids_gif.so',
            'libping-lib.so',
            'libpartner-celpher.so',
            'libovpnexec.so',
            'libopvpnutil.so',
            'libopenvpn.so',
            'libkeys.so',
            'libhydra.so',
        ].includes(name ?? '')
    )
        return true;
    return false;
};

JniTrace.attach(({ returnAddress }) => {
    return predicate(returnAddress);
});

['strcmp', 'strncmp', 'strstr'].forEach((ex) => {
    const strcmp = Module.getExportByName(null, ex);
    Native.Inject.attachInModule(predicate, strcmp, {
        onEnter(args) {
            logger.info({ tag: ex }, `"${args[0].readCString()}", "${args[1].readCString()}"`);
        },
    });
});
[
    '__android_log_print',
    'getpid',
    'sprintf',
    'open',
    'access',
    'pthread_kill',
    'kill',
    'fork',
    'pthread_create',
    'exit',
    '_exit',
    'killpg',
    'signal',
    'abort',
    'gettimeofday',
].forEach((ex) => {
    const strcmp = Module.getExportByName(null, ex);
    Native.Inject.attachInModule(predicate, strcmp, {
        onEnter(args) {
            logger.info({ tag: ex }, `"${args[0].readCString()}"`);
        },
    });
});
// Native.Inject.attachInModule('libcocos.so', Libc.access, {
//     onEnter(args) {
//         logger.info({ tag: 'access' }, `"${args[0].readCString()}"`);
//     },
// });

// Interceptor.attach(Module.getExportByName(null, 'pthread_create'), {
//     onEnter(args) {
//         logger.info({ tag: 'pthread_create' }, `${args[0]} ${args[1]} ${args[2]} ${args[3]}`);
//     },
// });
