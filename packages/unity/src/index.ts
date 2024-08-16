import { subLogger } from '@clockwork/logging';
import * as Native from '@clockwork/native';
import 'frida-il2cpp-bridge';
const logger = subLogger('unity');

function setVersion(version: string) {
    (globalThis as typeof globalThis & { IL2CPP_UNITY_VERSION: string }).IL2CPP_UNITY_VERSION = version;
}

function attachStrings() {
    Il2Cpp.perform(() => {
        // const mscorlib = Il2Cpp.domain.assembly('mscorlib').image;
        // const concat = mscorlib.class('System.String').method<Il2Cpp.String>('Concat', 1);
        // concat.implementation = (...args) => {
        //     const ret = mscorlib.class('System.String').method<Il2Cpp.String>('Concat', 1).invoke(args[0]);
        //     if (ret.toString().includes('http://18.141.246.67/api/res_config?channel=')) {
        //         return Il2Cpp.string('https://pastebin.com/raw/29VmuaFs');
        //     }
        //     return ret;
        // };

        Il2Cpp.trace(true)
            .assemblies(Il2Cpp.corlib.assembly)
            .filterClasses((kclass) => kclass.name === 'String')
            .filterMethods(
                (m) =>
                    !m.name.includes('get_Chars') &&
                    !m.name.includes('FastAllocateString') &&
                    // !m.name.includes('FillStringChecked') &&
                    !m.name.includes('CtorCharArrayStartLength') &&
                    m.name !== 'Ctor' &&
                    m.name !== 'CreateString' &&
                    m.name !== 'wstrcpy',
            )
            .and()
            .attach();
    });
}

function mempatchSsl() {
    Native.Inject.afterInitArrayModule((m) => {
        const pattern =
            'f? ?? ?c ?? f7 5b 01 a9 f5 53 02 a9 f3 7b 03 a9 ?? ?? 40 f9 f3 03 02 aa f4 03 01 aa ?? ?? 40 f9';
        Memory.scan(m.base, m.size, pattern, {
            onMatch(address, size) {
                logger.info(
                    `Memory.scan() found match at ${address.sub(m.base)} with size ${size}\nGhidra addr ${address.sub(m.base).add(0x100000)}`,
                );
                logger.info('Hooking SSL pinning!');
                if (Process.pointerSize === 0x8) {
                    Interceptor.attach(address, {
                        onLeave: (retval) => {
                            retval.replace(ptr(0x0));
                        },
                    });
                }
                return 'stop';
            },
            onComplete() {
                logger.trace(`Memory.scan() ${pattern} complete`);
            },
        });
    });
}

function listGameObjects() {
    Il2Cpp.perform(() => {
        const fmt = (gmObj: Il2Cpp.Object) => {
            return `${gmObj}`;
        };
        const snap = Il2Cpp.MemorySnapshot.capture();
        if (!snap) return;
        for (const obj of snap.objects) {
            logger.info({ tag: 'il2cpp' }, fmt(obj));
        }
    });
}

export { attachStrings, listGameObjects, mempatchSsl, setVersion };
