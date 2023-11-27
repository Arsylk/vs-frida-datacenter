import { ClassLoader, getHookUnique } from '@clockwork/hooks';
import * as Network from '@clockwork/network';
import * as Native from '@clockwork/native';
import * as JniTrace from '@clockwork/jnitrace';
import { createColors } from 'colorette';
const uHook = getHookUnique();
const { blue } = createColors({ useColor: true });

import 'frida-il2cpp-bridge';

Il2Cpp.perform(() => {});
ClassLoader.perform((cl) => {
    console.log(JSON.stringify(cl));
});

Network.attachNativeSocket();
Native.attachRegisterNatives();
Native.attachSystemPropertyGet((key) => {
    switch (key) {
        case 'ro.product.model':
            return 'Raven';
        case 'ro.product.brand':
            return 'Magic of starlight & long values';
    }
});

JniTrace.attach(true);
