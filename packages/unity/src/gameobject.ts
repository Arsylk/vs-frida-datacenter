import { Struct } from '@clockwork/common';
import { logger } from '@clockwork/logging';
import * as Native from '@clockwork/native';
import { gPtr } from '@clockwork/native';

function hookSetActive() {
    let _SetActive: any = null;
    Native.Inject.afterInitArrayModule(({ base, name }) => {
        if (name === 'libil2cpp.so') {
            // TODO this address from ghidra
            const addr = base.add(gPtr(0x160e2dc));
            !_SetActive &&
                (_SetActive = new NativeFunction(addr, 'void', ['pointer', 'pointer'])) &&
                Interceptor.replace(
                    addr,
                    new NativeCallback(
                        (__this, value) => {
                            const _o = __this.readPointer();
                            const il2class = Struct.Unity.Il2CppClass(_o);
                            logger.info(
                                { tag: 'setactive' },
                                `setActive(${__this}, ${value}) ${JSON.stringify(Struct.toObject(il2class))}`,
                            );
                            return _SetActive(__this, value);
                            // return _SetActive(__this, ptr(0x1));
                        },
                        'void',
                        ['pointer', 'pointer'],
                    ),
                );
        }
    });
}
