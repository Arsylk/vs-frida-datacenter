import { Color, logger } from "@clockwork/logging";
const { blue, red, magentaBright: pink } = Color.use()

// using namespace for singleton with all callbacks
namespace JNIHook {
    let afterInitArrayCallback: ((module: Module, method: NativePointer | null) => void) | null = null;

    let do_dlopen: NativePointer;
    let call_ctor: NativePointer;

    const linker = Process.getModuleByName(Process.pointerSize === 4 ? 'linker' : 'linker64');
    for (const { name, address } of linker.enumerateSymbols()) {
        if (name.includes('do_dlopen')) {
            do_dlopen = address;
            continue;
        }
        if (name.includes('call_constructor')) {
            call_ctor = address;
            continue;
        }
    }

    // TODO add just hook dlopen_ext
    // const android_dlopen_ext = Module.getExportByName(null, 'android_dlopen_ext');
    Interceptor.attach(do_dlopen!!, {
        onEnter: function (args) {
            const libPath = (this.libPath = args[0].readCString());
            if (!libPath) return;
            const libName = (this.libName = libPath.split('/').pop()!!);
            logger.info(`[${pink('dlopen')}] ${libPath}`);

            return;
            // TODO investigate 
            let handle: InvocationListener | null = null;
            const unhook = () => handle?.detach();
            handle = Interceptor.attach(call_ctor, ctorListenerCallback(libName, unhook));
        },
        onLeave: function (retval) {
            if (!this.libPath) return;
            onAfterInitArray(this.libName);
        },
    });

    // call_constructor callback
    const ctorListenerCallback: (libName: string, detach: () => void) => InvocationListenerCallbacks = (libName: string, detach: () => void) => ({
        onEnter(args) {
            logger.debug('[Ctor]', libName, red('->'), args[0]);
        },
        onLeave(retval) {
            logger.debug('[Ctor]', libName, blue('<-'), retval);
            detach();
        },
    });

    function onAfterInitArray(libName: string) {
        const module = Process.findModuleByName(libName);
        if (module) {
            const JNI_OnLoad = module.findExportByName('JNI_OnLoad');
            afterInitArrayCallback?.(module, JNI_OnLoad ?? null);
        }
    }

    export function afterInitArray(callback: (module: Module, method: NativePointer | null) => void) {
        afterInitArrayCallback = callback;
    }
}

export { JNIHook };
