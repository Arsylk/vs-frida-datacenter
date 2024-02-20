import 'frida-il2cpp-bridge';

function setVersion(version: string) {
    (globalThis as any).IL2CPP_UNITY_VERSION = version;
}

function attachStrings() {
    Il2Cpp.perform(() => {
        Il2Cpp.trace(true)
            .assemblies(Il2Cpp.corlib.assembly)
            .filterClasses((kclass) => kclass.name == 'String')
            .filterMethods(
                (m) =>
                    !m.name.includes('get_Chars') &&
                    !m.name.includes('FastAllocateString') &&
                    !m.name.includes('FillStringChecked') &&
                    m.name != 'Ctor' &&
                    m.name != 'CreateString' &&
                    m.name != 'wstrcpy',
            )
            .and()
            .attach();
    });
}

export { setVersion, attachStrings };
