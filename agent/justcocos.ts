import * as Anticloak from '@clockwork/anticloak';
import * as Unity from '@clockwork/unity';


Unity.setVersion('2022.3.34f1c1');
Unity.patchSsl();
Unity.attachStrings();
Unity.attachScenes();

Java.performNow(() => {
    Anticloak.InstallReferrer.replace({install_referrer: 'Non-nrganic'})
    Anticloak.Country.mock('BR');
})
