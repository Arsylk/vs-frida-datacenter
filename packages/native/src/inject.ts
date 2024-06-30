import { Color, logger } from '@clockwork/logging';
const { blue, red, magentaBright: pink } = Color.use();

type NatveFunctionCallbacks = {
    onEnter?: (this: InvocationContext, args: InvocationArguments) => void;
    onLeave?: (this: InvocationContext, retval: InvocationReturnValue) => void;
};

// using namespace for singleton with all callbacks
namespace Inject {
    export const modules = new ModuleMap();
    const initArrayCallbacks: ((this: InvocationContext, name: string) => void)[] = [];

    let do_dlopen: NativePointer;
    let call_ctor: NativePointer;
    let prelink_image: NativePointer;

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
        if (name.includes('phdr_table_get_dynamic_section')) {
            prelink_image = address;
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
            modules.update();

            return;
            // TODO investigate
            let handle: InvocationListener | null = null;
            const unhook = () => handle?.detach();
            handle = Interceptor.attach(call_ctor, ctorListenerCallback(libName, unhook));
        },
        onLeave: function (retval) {
            modules.update();
            if (!this.libPath) return;
            onAfterInitArray(this.libName, this);
        },
    });

    // call_constructor callback
    const ctorListenerCallback: (libName: string, detach: () => void) => InvocationListenerCallbacks = (
        libName: string,
        detach: () => void,
    ) => ({
        onEnter(args) {
            logger.info({ tag: 'ctor' }, `${libName} ${red('->')} ${args[0]}`);
        },
        onLeave(retval) {
            logger.info({ tag: 'ctor' }, `${libName} ${blue('<-')} ${retval}`);
            detach();
        },
    });

    function onAfterInitArray(libName: string, ctx: InvocationContext) {
        for (const cb of initArrayCallbacks) {
            cb.call(ctx, libName);
        }
    }

    export function afterInitArray(fn: (this: InvocationContext, name: string) => void) {
        initArrayCallbacks.push(fn);
    }

    export function afterInitArrayModule(fn: (this: InvocationContext, module: Module) => void) {
        initArrayCallbacks.push(function (name) {
            const module = Process.findModuleByName(name);
            if (module) fn.call(this, module);
        });
    }

    export function attachInModule(name: string, address: NativePointer, callbacks: NatveFunctionCallbacks): void;
    export function attachInModule(
        predicate: (ptr: NativePointer) => boolean,
        address: NativePointer,
        callbacks: NatveFunctionCallbacks,
    ): void;
    export function attachInModule(
        nameOrPredicate: string | ((ptr: NativePointer) => boolean),
        address: NativePointer,
        callbacks: NatveFunctionCallbacks,
    ): void {
        const fn =
            typeof nameOrPredicate === 'function' ? nameOrPredicate : (ptr: NativePointer) => modules.findName(ptr) === nameOrPredicate;
        Interceptor.attach(address, {
            onEnter(args) {
                if (fn(this.returnAddress)) {
                    callbacks?.onEnter?.call?.(this, args);
                }
            },
            onLeave(retval) {
                if (fn(this.returnAddress)) {
                    callbacks?.onLeave?.call(this, retval);
                }
            },
        });
    }

    export function attachRelativeTo(
        module: string, 
        offset: NativePointer, 
        callback: NatveFunctionCallbacks,
    ) {
        afterInitArrayModule(({name, base}: Module) => {
            if (name === module) {
                const ptr = base.add(offset)
                console.log('attach to: ', ptr)
                Interceptor.attach(ptr, callback);
            }
        })
    }

    /** very useful for not hooking hardware, chrome, and other things you that cause crashes */
    export function isWithinOwnRange(ptr: NativePointer): boolean {
        const path = modules.findPath(ptr);
        return path?.includes('/data') === true && !path.includes('/com.google.android.trichromelibrary');
    }
}

export { Inject };
