import { Color, logger } from '@clockwork/logging';
import { Text } from '@clockwork/common';
const { blue, red, magentaBright: pink } = Color.use();

type NatveFunctionCallbacks = {
    onEnter?: (this: InvocationContext, args: InvocationArguments) => void;
    onLeave?: (this: InvocationContext, retval: InvocationReturnValue) => void;
};

// using namespace for singleton with all callbacks
namespace Inject {
    export const ctorIgnored = [
        'org.apache.http.legacy.odex',
        'androidx.window.sidecar.odex',
        'com.android.location.provider.odex',
        'com.android.media.remotedisplay.odex',
        'split_MeasurementDynamite_installtime.odex',
        'libwebviewchromium_plat_support.so',
        'base.odex',
        'libandroid.so',
        'libmonochrome_64.so',
        'libEGL.so',
        'libEGL_emulation.so',
        'libGLESv1_CM.so',
        'libGLESv1_CM_emulation.so',
        'libGLESv2.so',
        'libGLESv2_emulation.so',
        'liblog.so',
        'libc.so',
        'libsentry.so',
        'libsentry-android.so',
    ];

    export const modules = new ModuleMap();
    const initArrayCallbacks: ((this: InvocationContext, name: string) => void)[] = [];
    const prelinkCallbacks: ((module: Module) => void)[] = [];
    const prelinkOnceCallbacks: ((module: Module) => void)[] = [];
    const prelinked = new Set<string>();

    let do_dlopen: NativePointer | null = null;
    let call_ctor: NativePointer | null = null;
    let prelink_image: NativePointer | null = null;

    const linker = Process.getModuleByName(Process.pointerSize === 4 ? 'linker' : 'linker64');
    for (const sym of linker.enumerateSymbols()) {
        const { name, address } = sym;
        if (name.includes('do_dlopen')) {
            logger.debug({ tag: 'do_dlopen' }, Text.stringify(sym));
            do_dlopen = address;
            continue;
        }
        if (name.includes('call_constructor')) {
            logger.debug({ tag: 'call_constructor' }, Text.stringify(sym));
            call_ctor = address;
            continue;
        }
        if (name.includes('phdr_table_get_dynamic_section')) {
            // __dl__Z30phdr_table_get_dynamic_sectionPK10elf64_phdrmyPP9Elf64_DynPj
            prelink_image = address;
        }
    }

    prelink_image &&
        Interceptor.attach(prelink_image, {
            onEnter(args) {
                const ctx = this.context as Arm64CpuContext;
                const x2_load_bias = ctx.x2 as NativePointer;
                const thumb = 0; // 1 for thumb
                const _init_offset = 0x15a8 + thumb;
                const _init = x2_load_bias.add(_init_offset);

                // this is some black magic stuff
                const module = Process.getModuleByAddress(_init);
                logger.info({ tag: 'phdr_init' }, `${Text.stringify(module)}`);
                modules.update();
                doOnPrelink(module);
            },
        });

    // TODO add just hook dlopen_ext
    // const android_dlopen_ext = Module.getExportByName(null, 'android_dlopen_ext');
    do_dlopen &&
        Interceptor.attach(do_dlopen, {
            onEnter: function (args) {
                const libPath = (this.libPath = args[0].readCString());
                if (!libPath) return;
                const libName = (this.libName = `${libPath.split('/').pop()}`);
                logger.info({ tag: 'do_dlopen' }, `${libPath}`);
                modules.update();

                if (ctorIgnored.includes(libName)) return;
                // TODO investigat
                let handle: InvocationListener | null = null;
                const unhook = () => handle?.detach();
                call_ctor && (handle = Interceptor.attach(call_ctor, ctorListenerCallback(libName, unhook)));
            },
            onLeave: function (retval) {
                modules.update();
                const libName = this.libName;
                if (libName) onAfterInitArray(libName, this);
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
            modules.update();
            detach();
        },
    });

    function doOnPrelink(module: Module) {
        const key = module.name;
        const unique = !prelinked.has(key);
        prelinked.add(key);
        if (unique) {
            for (const cb of prelinkOnceCallbacks) {
                cb(module);
            }
        }
        for (const cb of prelinkCallbacks) {
            cb(module);
        }
    }

    function onAfterInitArray(libName: string, ctx: InvocationContext) {
        for (const cb of initArrayCallbacks) {
            cb.call(ctx, libName);
        }
    }

    export function onPrelink(fn: (module: Module) => void) {
        prelinkCallbacks.push(fn);
    }

    export function onPrelinkOnce(fn: (module: Module) => void) {
        prelinkCallbacks.push(fn);
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

    export function attachInModule(
        name: string,
        address: NativePointer,
        callbacks: NatveFunctionCallbacks,
    ): void;
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
            typeof nameOrPredicate === 'function'
                ? nameOrPredicate
                : (ptr: NativePointer) => modules.findName(ptr) === nameOrPredicate;
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
        afterInitArrayModule(({ name, base }: Module) => {
            if (name === module) {
                const ptr = base.add(offset);
                Interceptor.attach(ptr, callback);
            }
        });
    }

    /** very useful for not hooking hardware, chrome, and other things you that cause crashes */
    export function isWithinOwnRange(ptr: NativePointer): boolean {
        const path = modules.findPath(ptr);
        return path?.includes('/data') === true && !path.includes('/com.google.android.trichromelibrary');
    }
}

export { Inject };
