import { Linker as LinkerStruct } from './struct.js';
const { soinfo } = LinkerStruct;

let _dl_solist_get_head = NULL;
let soinfo_get_soname = NULL;

const linker = Process.getModuleByName('linker64');
const syms = linker.enumerateSymbols();
for (const i in syms) {
    const sym = syms[i];

    switch (sym.name) {
        case '__dl__Z15solist_get_headv':
            _dl_solist_get_head = sym.address;
            break;
        case '__dl__ZNK6soinfo10get_sonameEv':
            soinfo_get_soname = sym.address;
            break;
    }
}

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class Linker {
    static #getSoListHead = new NativeFunction(_dl_solist_get_head, 'pointer', []);

    static getSoListHead() {
        const ptr = Linker.#getSoListHead();
        return new SoInfo(ptr);
    }
}

class SoInfo {
    static #getSoName = new NativeFunction(soinfo_get_soname, 'pointer', ['pointer']);

    #struct: ReturnType<typeof soinfo>;
    constructor(ptr: NativePointer) {
        this.#struct = soinfo(ptr);
    }

    getNext(): SoInfo {
        return new SoInfo(this.#struct.next.value);
    }

    getName(): string {
        const ptr = SoInfo.#getSoName(this.#struct.ptr);
        return `${ptr.readCString()}`;
    }

    getBase(): NativePointer {
        return this.#struct.base.value;
    }

    getSize(): number {
        return this.#struct.size.value.toNumber();
    }
}

const cm = new CModule(
    `
#include <gum/guminterceptor.h>
#include <stdio.h>
#include <string.h>


//extern int fclose(void* __fp);
//extern char* fgets(char* __buf, int __size, void* __fp);
//extern unsigned long strtoul(const char* __s, char** __end_ptr, int __base);
//extern char* strtok(char* __s, const char* __delimiter);

typedef unsigned char __u8;
typedef unsigned short __u16;
typedef unsigned int __u32;
typedef unsigned long long __u64;
typedef unsigned long sigset_t;

void *call_read_maps(void *args){
    uint64_t addr = (uint64_t) args;
    FILE *fp = g_fopen("/proc/self/maps", "r");
    char line[1024];
    char _line[1024];
    uint64_t start, end;
    while (g_fgets(line, sizeof(line), fp) != NULL) {
        g_strcpy(_line, line);
        start = (uint64_t) g_strtoul(strtok(line, "-"), NULL, 16);
        end = (uint64_t) g_strtoul(strtok(NULL, " "), NULL, 16);
        if (addr >= start && addr < end) {
          break;
        }
    }
    g_fclose(fp);
    return (void *)_line;
}
`,
    {},
);

Object.defineProperty(global, 'cm', { value: cm });
Object.defineProperty(global, 'SoInfo', { value: SoInfo });
Object.defineProperty(global, 'Linker', { value: Linker });
