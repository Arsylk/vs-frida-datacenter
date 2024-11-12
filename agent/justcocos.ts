import * as Anticloak from '@clockwork/anticloak';

const INSTALL_REFERRER =
    'utm_source=Organic';
Anticloak.InstallReferrer.replace({ install_referrer: INSTALL_REFERRER })