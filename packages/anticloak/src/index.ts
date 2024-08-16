import { Classes, Text, enumerateMembers, getFindUnique } from '@clockwork/common';
import { ClassLoader, Filter, always, hook, ifKey } from '@clockwork/hooks';
import type { HookParameters } from '@clockwork/hooks/dist/types.js';
import { buildMapper } from './buildprop.js';

export * as BuildProp from './buildprop.js';
export * as Country from './country.js';
export * as Debug from './debug.js';
export * as InstallReferrer from './installReferrer.js';
export * as Jigau from './jigau.js';

function hookDevice(fn?: (key: string) => number | undefined) {
    enumerateMembers(Classes.Build, {
        onMatchField(clazz, member) {
            const field = clazz[member];
            const mapped = fn?.(member) ?? buildMapper(member);
            if (field && mapped) {
                let casted: any = mapped;
                if (field.fieldReturnType.className === 'boolean') {
                    casted = Boolean(mapped);
                }
                field.value = casted;
            }
        },
    });
}

function hookSettings(fn?: (key: string) => number | undefined) {
    const mapper = (key: string): number | undefined => {
        switch (key) {
            case 'development_settings_enabled':
            case 'adb_enabled':
            case 'install_non_market_apps':
                return 0;
            case 'play_protect_enabled':
                return 1;
        }
    };

    for (const clazz of [Classes.Settings$Secure, Classes.Settings$Global]) {
        hook(clazz, 'getInt', {
            loggingPredicate: Filter.settings,
            logging: { multiline: false, short: true },
            replace: ifKey((key) => fn?.(key) ?? mapper(key), 1),
        });
    }
}

function hookAdId(id = Text.uuid()) {
    const uniqFind = getFindUnique();
    ClassLoader.perform(() => {
        uniqFind('com.google.android.gms.ads.identifier.AdvertisingIdClient$Info', (clazz) => {
            'getId' in clazz && hook(clazz, 'getId', { replace: always(id) });
        });
    });
}

function hookInstallerPackage() {
    hook(Classes.ApplicationPackageManager, 'getInstallerPackageName', {
        replace: always('com.android.vending'),
        logging: {
            short: true,
            multiline: false,
        },
    });
}

function hookLocationHardware() {
    hook(Classes.LocationManager, 'getGnssHardwareModelName', {
        replace: always('Model Name Unknown'),
    });
}

function hookSensor() {
    const params: HookParameters = {
        replace(method, ...args) {
            const value = `${method.call(this, ...args)}`;
            return value.replace(/open|source|emulator|google|aosp|ranchu|goldfish|cuttlefish/gi, 'nya');
        },
        logging: {
            short: true,
            multiline: false,
        },
    };
    hook(Classes.Sensor, 'getVendor', params);
    hook(Classes.Sensor, 'getName', params);
}

function generic() {
    hookInstallerPackage();
    hookLocationHardware();
    hookSensor();
}

export { generic, hookAdId, hookDevice, hookInstallerPackage, hookSettings };
