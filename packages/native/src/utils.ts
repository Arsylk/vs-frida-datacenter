import { ProcMaps } from '@clockwork/cmodules';
import { Libc, Consts } from '@clockwork/common';
import { Color, logger } from '@clockwork/logging';
const { gray, black } = Color.use();

function dellocate(ptr: NativePointer) {
    try {
        const env = Java.vm.tryGetEnv();
        env?.ReleaseStringUTFChars(ptr);
    } catch (_) {}
}

function mkdir(path: string): boolean {
    const cPath = Memory.allocUtf8String(path);
    const dir = Libc.opendir(cPath);
    if (!dir.isNull()) {
        Libc.closedir(dir);
        return false;
    }
    Libc.mkdir(cPath, 755);
    Libc.chmod(cPath, 755);
    dellocate(cPath);

    return true;
}

function getSelfProcessName(): string | null {
    const path = Memory.allocUtf8String('/proc/self/cmdline');
    const { value: fd } = Libc.open(path, 0);
    dellocate(path);
    if (fd !== -1) {
        const buffer = Memory.alloc(0x1000);
        Libc.read(fd, buffer, 0x1000);
        Libc.close(fd);
        return buffer.readCString();
    }
    return null;
}

function getSelfFiles(): string {
    const process_name = getSelfProcessName();
    const files_dir = `/data/data/${process_name}/files`;
    mkdir(files_dir);
    return files_dir;
}

Object.defineProperties(addressOf, {
    transform: {
        writable: true,
        value: (ptr: NativePointer) => ptr,
    },
});

function addressOf(ptr: NativePointer, extended?: boolean) {
    if (!ptr) return;
    const str = ProcMaps.addressOf(ptr);
    return str;

    const surround = (str: any) => `${black('⟨')}${str}${black('⟩')}`;
    const debug = DebugSymbol.fromAddress(ptr);
    ptr = (addressOf as any).transform(ptr);

    if (debug.moduleName) {
        const rel = debug.name ?? `0x${ptr.toString(16)}`;
        return surround(`${debug.moduleName}${gray('!')}${rel} ${extended ? `0x${ptr.toString(16)}` : ''}`);
    }
    return surround(`0x${ptr.toString(16)}`);
    // for (const { base, name, size } of Inject.modules.values()) {
    //     if (ptr > base && ptr < base.add(size) && !name.endsWith('.oat')) {
    //         return surround(`${name}${gray('!')}0x${ptr.sub(base).toString(16)} 0x${ptr.toString(16)}`)
    //     }
    // }
    // return surround(`0x${ptr.toString(16)}`)
}

function chmod(path: string): void {
    const cPath = Memory.allocUtf8String(path);
    Libc.chmod(cPath, 755);
    dellocate(cPath);
}

function mkdirs(base_path: string, file_path: string): void {
    const dir_array = file_path.split('/');
    let path = base_path;
    for (const segment of dir_array) {
        mkdir(path);
        path += `/${segment}`;
    }
}

function dumpFile(stringPtr: NativePointer, size: number, relativePath: string, tag: string): boolean {
    const process_name = getSelfProcessName();
    const filesDir = `/data/data/${process_name}/files`;
    mkdir(filesDir);

    const dexDir = `${filesDir}/dump_${tag}_${process_name}`;
    mkdir(dexDir);

    const fullpath = `${dexDir}/${relativePath}`;
    // Memory.protect(stringPtr, size, 'rw');
    const buffer = stringPtr.readCString(size);
    if (!buffer) {
        return false;
    }

    mkdirs(dexDir, relativePath);
    //@ts-ignore issue with File from esnext 5.4
    const file: any = new File(fullpath, 'w');
    file.write(buffer);
    file.close();
    return true;
}

function readFdPath(fd: number, bufsize: number = Consts.PATH_MAX): string | null {
    const buf = Memory.alloc(bufsize);
    const path = Memory.allocUtf8String(`/proc/self/fd/${fd}`);

    const _ = Libc.readlink(path, buf, bufsize);
    const str = buf.readCString();
    dellocate(buf);
    dellocate(path);
    return str;
}

function readFpPath(fp: NativePointer): string | null {
    const { value: fd } = Libc.fileno(fp) as UnixSystemFunctionResult<number>;
    if (fd !== -1) {
        return readFdPath(fd);
    }
    return null;
}

function readTidName(tid: number): string {
    if (tid <= 0) return '';
    //@ts-ignore
    return File.readAllText(`/proc/self/task/${tid}/comm`);
}

function tryDemangle<T extends string | null>(name: T): T {
    if (!name) return name;
    try {
        if (!Libc.__cxa_demangle) {
            throw Error('__cxa_demangle not found');
        }
        const str = Memory.allocUtf8String(name);
        const len = Memory.alloc(4).writeUInt(name.length);
        const buf = Libc.__cxa_demangle(str, NULL, len, NULL);
        dellocate(str);
        const demangled = buf.readCString();
        dellocate(buf);
        if (demangled && demangled.length > 0) return demangled as T;
    } catch (e) {}
    return name;
}

const sscanf = new NativeFunction(Module.getExportByName('libc.so', 'sscanf'), 'int', [
    'pointer',
    'pointer',
    'pointer',
    'pointer',
    'pointer',
    'pointer',
    'pointer',
    'pointer',
    'pointer',
]);
function tryResolveMapsSymbol(loc: NativePointer, pid: number = Process.id): DebugSymbol | null {
    try {
        const path = Memory.allocUtf8String(`/proc/${pid}/maps`);
        const mode = Memory.allocUtf8String('r');
        const fd = Libc.fopen(path, mode);
        dellocate(path);
        dellocate(mode);
        if (!fd.value.isNull()) {
            let nread: NativePointer;
            const size = 0x1000;
            const linePtr = Memory.alloc(size);
            const [begin, end] = [Memory.alloc(12), Memory.alloc(12)];
            const [perm, foo, dev, inode, mapname] = [
                Memory.alloc(12),
                Memory.alloc(12),
                Memory.alloc(Process.pointerSize),
                Memory.alloc(Process.pointerSize),
                Memory.alloc(size),
            ];

            const template = Memory.allocUtf8String('%lx-%lx %s %lx %s %ld %s');
            while ((nread = Libc.fgets(linePtr, size, fd.value))) {
                const read = sscanf(linePtr, template, begin, end, perm, foo, dev, inode, mapname);
                logger.info({ tag: 'mapres' }, `${linePtr.readCString()} ${read}`);
            }
            dellocate(template);

            Libc.fclose(fd.value);
        }
    } catch (e) {
        console.error(`${e}`);
    }
    return null;
}

export {
    addressOf,
    dellocate,
    dumpFile,
    getSelfFiles,
    getSelfProcessName,
    mkdir,
    readFdPath,
    readFpPath,
    readTidName,
    tryDemangle,
};
