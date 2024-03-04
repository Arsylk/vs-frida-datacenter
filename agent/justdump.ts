import { Jigau } from '@clockwork/anticloak';
import * as Dump from '@clockwork/dump';
import * as Native from '@clockwork/native';
import * as Anticloak from '@clockwork/anticloak';
import { Classes, findClass, getFindUnique } from '@clockwork/common';
import * as Cocos2dx from '@clockwork/cocos2dx';
import { ClassLoader, hook } from '@clockwork/hooks';
import { logger, Color } from '@clockwork/logging';

Jigau.memoryPatch();
Dump.scheduleDexDump(10_000);
Dump.initSoDump();
Native.attachSystemPropertyGet(function (key) {
    switch (key) {
        case 'ro.debuggable':
            return '0';
        case 'ro.product.model':
            return 'Raven';
        case 'ro.product.brand':
            return 'Xiaomi';
        case 'ro.build.flavor':
            return 'raven-release';
        case 'ro.product.board':
            return 'sdm720';
        case 'gsm.version.baseband':
            return 's';
    }
    // if (Native.Inject.isWithinOwnRange(this.returnAddress)) return 'nya';
});


Anticloak.generic();
Anticloak.hookDevice();
Anticloak.hookSettings();