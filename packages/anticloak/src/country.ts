import { hook } from '@clockwork/hooks';
import { Text, Classes } from '@clockwork/common';
import { always, ifKey, ifReturn } from '@clockwork/hooks';
import { Filter } from '@clockwork/logging';

type Config = {
    timezoneId: string;
    mcc: string;
    mnc: string;
    code: string;
    mccmnc: string;
    locale: [string, string];
    country: string;
    operator: string;
};

const Configurations: { [key: string]: Config } = {
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


function mock(key: keyof typeof Configurations): void;
function mock(config: Config): void;
function mock(keyOrConfig: Config | keyof typeof Configurations) {
    const config = typeof keyOrConfig === 'object' ? (keyOrConfig as Config) : Configurations[keyOrConfig];

    const number = `${config.code}${Text.stringNumber(10)}`,
        subscriber = `${config.mccmnc}${Text.stringNumber(15-config.mccmnc.length)}`;
    hook(Classes.TelephonyManager, 'getLine1Number', { replace: always(number) });
    hook(Classes.TelephonyManager, 'getSimOperator', { replace: always(config.mccmnc) });
    hook(Classes.TelephonyManager, 'getSimOperatorName', { replace: always(config.operator) });
    hook(Classes.TelephonyManager, 'getNetworkOperator', { replace: always(config.mccmnc) });
    hook(Classes.TelephonyManager, 'getNetworkOperatorName', { replace: always(config.operator) });
    hook(Classes.TelephonyManager, 'getSimCountryIso', { replace: always(config.country) });
    hook(Classes.TelephonyManager, 'getNetworkCountryIso', { replace: always(config.country) });
    hook(Classes.TelephonyManager, 'getSubscriberId', { replace: always(subscriber) });
    hook(Classes.TimeZone, 'getID', { replace: always(config.timezoneId) });
    hook(Classes.Locale, 'getDefault', {
        replace: () => Classes.Locale.$new(config.locale[1], config.locale[0]),
        logging: { call: false, return: false },
    });
    // hook(Classes.Locale, 'getCountry', { replace: always('BR'), logging: { call: false, return: false } });
    // hook(Classes.Locale, 'getLanguage', { replace: always('pt'), logging: { call: false, return: false } });
    // hook(Classes.Locale, 'getDisplayCountry', { replace: always('Brazil'), logging: { call: false, return: false } });
    // hook(Classes.Locale, 'toString', { replace: always('pt_BR'), logging: { call: false, return: false } });

    hook(Classes.Date, 'getTime', {
        loggingPredicate: Filter.date,
        replace(method, ...args) {
            const calendar = Classes.Calendar.getInstance(Classes.TimeZone.getTimeZone('UTC'));
            const zdt = Classes.ZonedDateTime.ofInstant(Classes.Instant.ofEpochMilli(this.getTime()), Classes.ZoneId.of(config.timezoneId));
            calendar.set(1, zdt.getYear());
            calendar.set(2, zdt.getMonthValue() - 1);
            calendar.set(5, zdt.getDayOfMonth());
            calendar.set(11, zdt.getHour());
            calendar.set(12, zdt.getMinute());
            calendar.set(13, zdt.getSecond());
            calendar.set(14, zdt.getNano() / 1_000_000);
            return calendar.getTimeInMillis();
        },
    });
}

export { mock };
