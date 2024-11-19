import { ClassLoader, hook } from '@clockwork/hooks';
export { dump } from './dump.js';

type CocosLocalStorageScope = {
    fallback(): string | null
}

function hookLocalStorage(fn?: (this: CocosLocalStorageScope, key: string) => string | undefined) {
    let Cocos2dxLocalStorage: any | undefined;
    ClassLoader.perform(() => {
        if (
            !Cocos2dxLocalStorage &&
            (Cocos2dxLocalStorage = findClass('org.cocos2dx.lib.Cocos2dxLocalStorage'))
        ) {
            hook(Cocos2dxLocalStorage, 'getItem', {
<<<<<<< HEAD
                replace: fn ? ifKey(fn) : undefined,
=======
                replace: fn ? function (method, ...args) {
                    const fallback: () => string | null = () => method.call(this, ...args);
                    const result = fn.call({ fallback: fallback }, args[0])
                    return result !== undefined ? result : method.call(this, ...args);
                } : undefined,
>>>>>>> 760230fe663d279907bd1eea45674922a72d97c2
                logging: { multiline: false },
            });
        }
    });
}

export { hookLocalStorage };
