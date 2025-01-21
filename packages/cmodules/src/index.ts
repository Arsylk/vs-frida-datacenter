import { Libc } from '@clockwork/common';
import { logger } from '@clockwork/logging';
import _memcmp from '@src/memcmp.c';
import _procmaps from '@src/procmaps.c';

function base64(str: string) {
    const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    str = str.replace(/\s+/g, '').replace(/=/g, ''); // Remove padding as well
    const base64Map = {};
    for (let i = 0; i < base64Chars.length; i++) {
        base64Map[base64Chars[i]] = i;
    }

    let binaryString = '';
    for (let i = 0; i < str.length; i++) {
        const value = base64Map[str[i]]; // Get the 6-bit value
        binaryString += value.toString(2).padStart(6, '0'); // Convert to 6-bit binary string
    }

    let output = '';
    for (let i = 0; i < binaryString.length; i += 8) {
        const byte = binaryString.slice(i, i + 8); // Get an 8-bit chunk
        const charCode = Number.parseInt(byte, 2); // Convert the binary chunk to a decimal value
        output += String.fromCharCode(charCode); // Convert the decimal value to an ASCII character
    }

    return output;
}

function fbase64(input: string) {
    const fixed = input.substring(input.indexOf(',') + 1);
    return base64(fixed);
}

const get_frida_log = (tag: string) =>
    new NativeCallback(
        (str) => {
            const msg = str.readCString();
            logger.info({ tag: tag }, `${msg}`);
        },
        'void',
        ['pointer'],
    );

const LinkerSym = Object.assign(
    {},
    ...Process.getModuleByName('linker64')
        .enumerateSymbols()
        .map(({ name, address }) => {
            return { [name]: address };
        }),
);

const memcmp = new CModule(fbase64(_memcmp), {
    _frida_log: get_frida_log('memcmp'),
});

const procmaps = new CModule(fbase64(_procmaps), {
    frida_log: new NativeCallback(
        (arg0) => {
            const str0 = arg0.readCString();
            logger.info({ tag: 'procmaps' }, `${str0}`);
        },
        'void',
        ['pointer'],
    ),
    perror: Module.getExportByName(null, 'perror'),
    _Unwind_Backtrace: Module.getExportByName(null, '_Unwind_Backtrace'),
    _Unwind_GetIP: Module.getExportByName(null, '_Unwind_GetIP'),
    dl_soinfo_get_soname: LinkerSym.__dl__ZNK6soinfo10get_sonameEv,
    dl_solist_get_head: LinkerSym.__dl__Z15solist_get_headv,
    fclose: Libc.fclose,
    fdopen: Libc.fdopen,
    fgets: Libc.fgets,
    strchr: Libc.strchr,
    strlen: Libc.strlen,
    strtok_r: Libc.strtok_r,
    strtoul: Libc.strtoul,
    syscall: Libc.syscall,
    dladdr: Libc.dladdr,
});

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
(procmaps as any).get_backtrace = new NativeFunction(procmaps.get_backtrace, 'pointer', []);

export { memcmp, procmaps };
