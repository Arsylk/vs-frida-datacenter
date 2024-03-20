import { Classes, enumerateMembers } from '@clockwork/common';
import { Filter, logger } from '@clockwork/logging';
import { always, hook, ifKey } from '@clockwork/hooks';
import { HookParameters } from '@clockwork/hooks/dist/types.js';
import { buildMapper } from './buildprop.js';

export * as Jigau from './jigau.js';
export * as InstallReferrer from './installReferrer.js';
export * as Country from './country.js';
export * as BuildProp from './buildprop.js';

function hookDevice(fn?: (key: string) => number | undefined) {
    enumerateMembers(Classes.Build, {
        onMatchField(clazz, member) {
            const field = clazz[member]
            const mapped = fn?.(member) ?? buildMapper(member);
            if (field && mapped) {
                let casted: any = mapped;
                if (field.fieldReturnType.className === 'boolean') {
                    casted = Boolean(mapped);
                }
                field.value = casted
            }
        },
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
        },
    });
}

function hookLocationHardware() {
    hook(Classes.LocationManager, 'getGnssHardwareModelName', { replace: always('Model Name Unknown') });
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

export { hookDevice, hookSettings, hookInstallerPackage, generic };
