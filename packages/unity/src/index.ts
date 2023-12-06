
import 'frida-il2cpp-bridge'

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
                    m.name != 'wstrcpy',
            )
            .and()
            .attach();
    })
}


export { attachStrings }