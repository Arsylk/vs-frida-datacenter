import { subLogger } from '@clockwork/logging';
import * as Native from '@clockwork/native';
import 'frida-il2cpp-bridge';
const logger = subLogger('unity');

function setVersion(version: string) {
    (globalThis as typeof globalThis & {IL2CPP_UNITY_VERSION: string}).IL2CPP_UNITY_VERSION = version;
}

function attachStrings() {
    Il2Cpp.perform(() => {
        Il2Cpp.trace(true)
            .assemblies(Il2Cpp.corlib.assembly)
            .filterClasses((kclass) => kclass.name === 'String')
            .filterMethods(
                (m) =>
                    !m.name.includes('get_Chars') &&
                    !m.name.includes('FastAllocateString') &&
                    !m.name.includes('FillStringChecked') &&
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
        const pattern = 'f? ?? ?c ?? f7 5b 01 a9 f5 53 02 a9 f3 7b 03 a9 ?? ?? 40 f9 f3 03 02 aa f4 03 01 aa ?? ?? 40 f9';
        Memory.scan(m.base, m.size, pattern, {
            onMatch(address, size) {
                logger.info(
                    // biome-ignore lint/style/useTemplate: <explanation>
                    'Memory.scan() found match at ' +
                        address.sub(m.base) +
                        ' with size ' +
                        size +
                        '\nGhidra addr ' +
                        address.sub(m.base).add(0x100000),
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

export { attachStrings, mempatchSsl, setVersion };

