import { ClassLoader, getHookUnique } from '@clockwork/hooks';
import * as Network from '@clockwork/network';
import * as Native from '@clockwork/native';
import * as JniTrace from '@clockwork/jnitrace';
import * as Cocos2dx from '@clockwork/cocos2dx';
import { createColors } from 'colorette';
import { hook } from '@clockwork/hooks';
import { Classes, stacktrace } from '@clockwork/common';
import { log } from '@clockwork/logging';
import { ifKey } from '@clockwork/hooks/dist/addons';
const uHook = getHookUnique();
const { blue, blueBright, redBright } = createColors({ useColor: true });

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

function hookCrypto() {
    //  hook(Classes.SecretKeySpec, '$init', {
    //     logging: { multiline: false },
    // });
    // hook(JTypes.Cipher, 'getInstance');
    hook(Classes.Cipher, 'doFinal', {
        after(m, r, ...p) {
            if (this.opmode.value === 1) {
                const str = Classes.String.$new(p[0]);
                log(`${blueBright('[encrypt]')} ${str}`);
            }
            if (this.opmode.value === 2) {
                const str = Classes.String.$new(r);
                log(`${redBright('[decrypt]')} ${str}`);
                if (`${str}`.includes('idiot')) {
                    log(stacktrace());
                }
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
            switch (key) {
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
            }
        }),
    });
    // hook('java.util.Properties', 'getProperty');
}

Java.performNow(() => {
    hookActivity();
    hook(Classes.WebView, 'loadUrl');
    // hookJson();
    hookPrefs();
    hookCrypto();

    ClassLoader.perform((cl) => {
        console.log(JSON.stringify(cl), cl);
    });
});

// Network.attachNativeSocket();
Native.attachRegisterNatives();
Native.attachSystemPropertyGet((key) => {
    switch (key) {
        case 'ro.product.model':
            return 'Raven';
        case 'ro.product.brand':
            return 'Xiaomi';
    }
});

// JniTrace.attach(true);

Cocos2dx.dump()
