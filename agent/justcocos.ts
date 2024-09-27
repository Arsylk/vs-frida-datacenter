import { enumerateMembers, getFindUnique, stacktrace } from '@clockwork/common';
import { ClassLoader, hook } from '@clockwork/hooks';
import { logger } from '@clockwork/logging';
import * as Network from '@clockwork/network';

const uniqFind = getFindUnique(false);

Network.injectSsl();
Java.performNow(() => {
    // Anticloak.InstallReferrer.replace({ install_referrer: 'facebook' });
    hook(Classes.WebView, 'loadUrl', {
        after(method, returnValue, ...args) {
            logger.info(stacktrace());
        },
    });

    hook(Classes.String, 'join');
    hook(Classes.InetSocketAddress, '$init');

    ClassLoader.perform(() => {
        uniqFind('com.vivo.eas.JavaBuilderPrivacy', (clazz) => {
            hook(clazz, '$init');
            enumerateMembers(clazz, {
                onMatchMethod(clazz, member, depth) {
                    hook(clazz, member);
                },
            });
        });
        uniqFind('com.vivo.eas.ReleaseSingletonAbstract', (clazz) =>
            enumerateMembers(clazz, {
                onMatchMethod(clazz, member, depth) {
                    hook(clazz, member);
                },
            }),
        );
    });
});
