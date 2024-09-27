import { InstallReferrer } from '@clockwork/anticloak';
import * as Network from '@clockwork/network';

Java.performNow(() => {
    const INSTALL_REFERRER =
        'utm_source=facebook_ads&utm_medium=Non-organic&media_source=true_network&http_referrer=BingSearch';
    InstallReferrer.replace({ install_referrer: INSTALL_REFERRER });
});

Network.injectSsl();
