import { Classes } from '@clockwork/common';
import { Filter } from '@clockwork/logging';
import { always, hook, ifKey } from '@clockwork/hooks';
import { HookParameters } from '@clockwork/hooks/dist/types.js';

export * as Jigau from './jigau.js';
export * as InstallReferrer from './installReferrer.js';
export * as Country from './country.js';

function hookDevice(override?: { [key: string]: string | undefined }) {
    /* device Settings*/
    const Build: { [key: string]: string } = {
        MODEL: 'Xiaomi 6 Pro',
        DEVICE: 'raven',
        BOARD: 'sdm720',
        PRODUCT: 'raven',
        HARDWARE: 'Device Hardware',
        FINGERPRINT: 'xiaomi/raven/raven:12/SQ1D.220205.003/8069835:user/release-keys',
        MANUFACTURER: 'Xiaomi',
        BOOTLOADER: 'Boot-JJ129-ac',
        BRAND: 'Xiaomi',
        HOST: 'HOST Co',
        DISPLAY: 'Foo procuctions and bar 1-0-111',
        TAGS: 'release-keys',
        SERIAL: 'Seriously ?',
        TYPE: 'Production build',
        USER: 'LINUX General',
        UNKNOWN: 'KGTT General',
        ANDROID_ID: 'b6932a00c88d8b50',
    };

    const merged = override ? { ...Build, ...override } : { ...Build };
    Reflect.ownKeys(merged).forEach((key: any) => {
        const field = Classes.Build[key];
        const value = merged[key];
        if (field && value) {
            field.value = value;
        }
    });
}

function hookSettings(fn?: (key: string) => number | undefined) {
    const mapper = function (key: string): number | undefined {
        switch (key) {
            case 'development_settings_enabled':
            case 'adb_enabled':
            case 'install_non_market_apps':
                return 0;
            case 'play_protect_enabled':
                return 1;
        }
    };

    [Classes.Settings$Secure, Classes.Settings$Global].forEach((clazz) =>
        hook(clazz, 'getInt', {
            loggingPredicate: Filter.settings,
            logging: { multiline: false, short: true },
            replace: ifKey((key) => fn?.(key) ?? mapper(key), 1),
        }),
    );
}

function hookInstallerPackage() {
    hook(Classes.ApplicationPackageManager, 'getInstallerPackageName', { 
        replace: always('com.android.vending'),
        logging: {
            short: true,
            multiline: false,
        }
    });
}

function hookLocationHardware() {
    hook(Classes.LocationManager, 'getGnssHardwareModelName', { replace: always('Model Name Unknown') });
}

function hookSensor() {
    const params: HookParameters = {
        replace(method, ...args) {
            const value = `${method.call(this, ...args)}`
            return value.replace(/open|source|emulator|google|aosp|ranchu|goldfish|cuttlefish/gi, 'nya')
        },
        logging: {
            short: true,
            multiline: false,
        }
    }
    hook(Classes.Sensor, 'getVendor', params)
    hook(Classes.Sensor, 'getName', params)
}

function generic() {
    hookInstallerPackage();
    hookLocationHardware();
    hookSensor()
}

export { hookDevice, hookSettings, hookInstallerPackage, generic };
