import { ClassLoader, hook, ifKey } from '@clockwork/hooks';
export { dump } from './dump.js';

function hookLocalStorage(fn?: (key: string) => string | undefined) {
    let Cocos2dxLocalStorage: any | undefined;
    ClassLoader.perform(() => {
        if (
            !Cocos2dxLocalStorage &&
            (Cocos2dxLocalStorage = findClass('org.cocos2dx.lib.Cocos2dxLocalStorage'))
        ) {
            hook(Cocos2dxLocalStorage, 'getItem', {
                replace: fn ? ifKey(fn) : undefined,
                logging: { multiline: false },
            });
        }
    });
}

export { hookLocalStorage };
