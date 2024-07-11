import { findClass, Classes, ClassesString, enumerateMembers } from '@clockwork/common';
import { ClassLoader, hook } from '@clockwork/hooks';
import type { MethodOverload } from '@clockwork/hooks/dist/types';
import { subLogger, Color } from '@clockwork/logging';
const logger = subLogger('installreferrer');

interface ReferrerDetails {
    google_play_instant?: boolean;
    install_begin_timestamp_seconds?: number;
    install_begin_timestamp_server_seconds?: number;
    install_referrer?: string;
    install_version?: string;
    referrer_click_timestamp_seconds?: number;
    referrer_click_timestamp_server_seconds?: number;
}

function createInstallReferrer(classWrapper: Java.Wrapper, details: ReferrerDetails): Java.Wrapper {
    const now = Date.now() / 1000;
    const bundle = Classes.Bundle.$new();
    bundle.putBoolean('google_play_instant', details?.google_play_instant ?? true);
    bundle.putLong('install_begin_timestamp_seconds', details?.install_begin_timestamp_seconds ?? now - 30);
    bundle.putLong(
        'install_begin_timestamp_server_seconds',
        details?.install_begin_timestamp_server_seconds ?? now - 30,
    );
    bundle.putString('install_referrer', details?.install_referrer ?? 'utm_medium=Non-Organic');
    bundle.putString('install_version', details?.install_version ?? '1.0.0');
    bundle.putLong('referrer_click_timestamp_seconds', details?.referrer_click_timestamp_seconds ?? now - 65);
    bundle.putLong(
        'referrer_click_timestamp_server_seconds',
        details?.referrer_click_timestamp_server_seconds ?? now - 65,
    );
    return classWrapper.$new(bundle);
}

function replace(details: ReferrerDetails = {}) {
    let isHooked = false;
    ClassLoader.perform((_) => {
        if (isHooked) return;

        const client = findClass(ClassesString.InstallReferrerClient);
        if (!client) return;
        isHooked = true;

        const [startMethod, getMethod] = matchReferrerClientMethods(client);
        performReplace(details, client, startMethod, getMethod);
    });
}

function performReplace(
    details: ReferrerDetails,
    client: Java.Wrapper,
    startMethod: string,
    getMethod: string,
) {
    const beforeInit = function (this: Java.Wrapper) {
        const paretnClass = findClass(this.$className);
        if (!paretnClass) {
            logger.warn(`missing parent class: ${this.$className}`);
            return;
        }

        hook(paretnClass, startMethod, {
            predicate: startConnectionPredicate,
            replace(method, listener) {
                const baseClass = findClass(ClassesString.InstallReferrerStateListener);
                if (!baseClass) {
                    logger.warn(`missing base class: ${ClassesString.InstallReferrerStateListener}`);
                    return method.call(this, listener);
                }

                const onFinishedMethod = matchStateListenerMethod(baseClass);

                let msg = Color.method(startMethod);
                msg += Color.bracket('(');
                msg += Color.className(listener.$className);
                msg += Color.bracket(')');
                msg += ' -> ';
                msg += Color.method(onFinishedMethod);
                msg += `${Color.bracket('(')}${Color.number('0')}${Color.bracket(')')}`;
                logger.info(msg);

                listener[onFinishedMethod](0);
            },
        });

        hook(paretnClass, getMethod, {
            predicate: getInstallReferrerPredicate,
            replace(method) {
                const referrerDetails = findClass(ClassesString.ReferrerDetails);
                if (!referrerDetails) {
                    logger.warn(`missing referrer class: ${ClassesString.ReferrerDetails}`);
                    return method.call(this);
                }

                enumerateMembers(
                    referrerDetails,
                    {
                        onMatchMethod(clazz, member) {
                            hook(clazz, member);
                        },
                    },
                    1,
                );

                return createInstallReferrer(referrerDetails, details);
            },
        });
    };

    hook(client, '$init', { before: beforeInit });
}

function matchReferrerClientMethods(clazz: Java.Wrapper): [string, string] {
    let startMethod = null;
    let getMethod = null;
    enumerateMembers(
        clazz,
        {
            onMatchMethod(clazz, member) {
                const def = clazz[member];
                if (!def) return;
                for (const overload of def.overloads) {
                    if (startConnectionPredicate(overload)) {
                        startMethod ??= member;
                        continue;
                    }

                    if (getInstallReferrerPredicate(overload)) {
                        getMethod ??= member;
                    }
                }
            },
        },
        1,
    );

    return [startMethod ?? 'startConnection', getMethod ?? 'getInstallReferrer'];
}

function matchStateListenerMethod(clazz: Java.Wrapper): string {
    let found = null;
    enumerateMembers(
        clazz,
        {
            onMatchMethod(clazz, member) {
                const def = clazz[member];
                if (!def) return;
                for (const overload of def.overloads) {
                    if (onInstallReferrerSetupFinishedPredicate(overload)) {
                        found ??= member;
                        return;
                    }
                }
            },
        },
        1,
    );

    return found ?? 'onInstallReferrerSetupFinished';
}

const startConnectionPredicate: (overload: MethodOverload) => boolean = ({ returnType, argumentTypes }) => {
    return (
        returnType.className === 'void' &&
        argumentTypes.length === 1 &&
        argumentTypes[0].className === ClassesString.InstallReferrerStateListener
    );
};
const getInstallReferrerPredicate: (overload: MethodOverload) => boolean = ({
    returnType,
    argumentTypes,
}) => {
    return returnType.className === ClassesString.ReferrerDetails && argumentTypes.length === 0;
};
const onInstallReferrerSetupFinishedPredicate: (overload: MethodOverload) => boolean = ({
    returnType,
    argumentTypes,
}) => {
    return (
        returnType.className === 'void' && argumentTypes.length === 1 && argumentTypes[0].className === 'int'
    );
};

export { replace, createInstallReferrer };
