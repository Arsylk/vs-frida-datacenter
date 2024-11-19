import * as Anticloak from '@clockwork/anticloak';
<<<<<<< HEAD
import * as Unity from '@clockwork/unity';


Unity.setVersion('2022.3.34f1c1');
Unity.patchSsl();
Unity.attachStrings();
Unity.attachScenes();

Java.performNow(() => {
    Anticloak.InstallReferrer.replace({install_referrer: 'Non-nrganic'})
    Anticloak.Country.mock('BR');
})
=======

const INSTALL_REFERRER =
    'utm_source=Organic';
Anticloak.InstallReferrer.replace({ install_referrer: INSTALL_REFERRER })
>>>>>>> 760230fe663d279907bd1eea45674922a72d97c2
