import * as Native from '@clockwork/native';
import { gPtr } from '@clockwork/native';
import * as Anticloak from '@clockwork/anticloak';
import { logger } from '@clockwork/logging';
import * as Dump from '@clockwork/dump';
import * as JniTrace from '@clockwork/jnitrace';
import { Libc, Struct, Text } from '@clockwork/common';
import target from '@reversense/interruptor/index.linux.arm64.js';

const Interruptor = target.LinuxArm64({})

logger.info({ tag: 'pid' }, `xx ${Process.id}`);

Native.attachSystemPropertyGet(function (key) {
    const mapped = Anticloak.BuildProp.propMapper(key);
    if (mapped) return mapped;
});

Anticloak.generic();
Anticloak.hookDevice();
Anticloak.hookSettings();

Dump.initSoDump()
let isNativeEnabled = true;
const predicate = (r) => isNativeEnabled && Native.Inject.isWithinOwnRange(r);
JniTrace.attach(({ returnAddress }) => {
    return predicate(returnAddress);
});

// Native.Strings.hookStrstr(predicate);
Native.Strings.hookStrlen(predicate);
Native.Strings.hookStrcpy(predicate);
Native.Files.hookAccess(predicate);
Native.Files.hookOpen(predicate);
Native.Files.hookFopen(predicate);
Native.Files.hookRemove(predicate);
Native.Files.hookStat(predicate);
Native.Strings.hookStrstr(predicate);
hookFgets();
hookPthreadCreate();
hookLocaltime();
hookSscanf();

// Native.Inject.afterInitArrayModule(function ({ name, base, size }) {
//     function dump(addr: NativePointer, limit: number) {
//         let i = 0;
//         while (i < limit) {
//             let insn = Instruction.parse(addr.add(i));
//             i += insn.size;
//             logger.info({ tag: 'insn', id: addr.add(i) }, `${insn}`);
//         }
//         hexdump(addr, { length: limit });
//     }

//     if (name.includes('libnative-lib') || name.includes('libhello-jni')) {
//         // onModule(base, this.threadId);
//         // addSyscall(base, gPtr(0x105aa4 + 0x4));

//         const getCallback = (insns: ArrayBuffer, ptr: NativePointer) => {
//             const callback = new NativeCallback(function () {}, 'void', []);

//             const freemem = Memory.alloc(Process.pageSize);
//             Memory.patchCode(freemem, Process.pageSize, function (code) {
//                 const writer = new Arm64Writer(code, { pc: freemem });
//                 // write initial instruction
//                 // writer.putBytes(insns);

//                 // call native callback
//                 // writer.putLdrRegAddress('x16', callback);
//                 // writer.putBlrReg('x16');

//                 // writer.putBranchAddress(ptr);
//                 // write syscall
//                 // writer.putInstruction(0xd4000001);

//                 // writer.flush();
//             });

//             return freemem;
//         };
//         const syscalls: NativePointer[] = [];
//         Memory.protect(base, size, 'rwx');
//         Memory.scan(base, size, '01 00 00 d4', {
//             onMatch(address) {
//                 logger.info({tag: 'found', id: address}, `${DebugSymbol.fromAddress(address)}`)
//                 syscalls.push(address);
//             },
//             onComplete() {
//                 logger.info({ tag: 'syscall', id: 'complete' }, `found ${syscalls.length} syscalls`);
//                 syscalls.forEach((address) => {
//                     logger.info(`---------------------------------------------------------------------------------`);
//                     logger.info({ tag: 'syscall' }, `found syscall at ${address} -> ${Instruction.parse(address)}`);
//                     // dump(address.sub(12), 24)

//                     const beginAt = address.sub(36);
//                     Memory.patchCode(beginAt, 20, function (code) {
//                         const writer = new Arm64Writer(code, { pc: beginAt });
//                         const insns = beginAt.readByteArray(20)!;
//                         const madeCb = getCallback(insns, address.add(16));
//                         dump(beginAt, 40);
//                         // writer.putBranchAddress(madeCb);
//                         logger.info('changed into -!->');
//                         dump(madeCb, 40);
//                         // dump(address.sub(12), 24)
//                     });
//                 });
//             },
//         });
//     }
// });

function hookPthreadCreate() {
    logger.info({ tag: 'hook' }, `pthread_create at ${Libc.pthread_create}`);
    Interceptor.replace(
        Libc.pthread_create,
        new NativeCallback(
            function (ptr0, ptr1, ptr2, ptr3) {
                const ret = Libc.pthread_create(ptr0, ptr1, ptr2, ptr3);
                logger.info({ tag: 'pthread_create' }, `${ptr0}, ${ptr1}, ${ptr2}, ${ptr3} -> ${ret}`);
                return ret;
            },
            'int',
            ['pointer', 'pointer', 'pointer', 'pointer'],
        ),
    );
}

function hookFgets() {
    Interceptor.replace(
        Libc.fgets,
        new NativeCallback(
            function (s, n, stream) {
                const ret = Libc.fgets(s, n, stream);
                const str = s.readCString();
                logger.info({ tag: 'fgets' }, `${s}, ${n}, ${stream} -> "${str?.replace('\n', '\\n')}"`);
                return ret;
            },
            'pointer',
            ['pointer', 'int', 'pointer'],
        ),
    );
}

function hookLocaltime() {
    logger.info({ tag: 'hook' }, `localtime at ${Libc.localtime}`);
    Interceptor.replace(
        Libc.localtime,
        new NativeCallback(
            function (t) {
                const ret = Libc.localtime(t);
                logger.info({ tag: 'localtime' }, `${JSON.stringify(Struct.toObject(Struct.Time.tm(ret)))}`);
                return ret;
            },
            'pointer',
            ['pointer'],
        ),
    );
}

function hookSscanf() {
    logger.info({ tag: 'hook' }, `sscanf at ${Libc.sscanf}`);
    // const cmod = new CModule(`
    // #include <stdio.h>

    // int replace_sscanf(const char *str, const char *format, ...) {

    // }
    // `);
    // logger.info({ tag: 'hook' }, `sscanf at ${Libc.sscanf}`);
    // Interceptor.replaceFast(
    //     Libc.sscanf,
    //     new NativeCallback(
    //         function (...args) {
    //             const ctx = (this.context as Arm64CpuContext);
    //             const pattern = `${ctx.x1.readCString()}`;

    //             let tmp = pattern.replace(/%%/g, '')
    //             const count = tmp.length-tmp.replace(/%/g, '').length
    //             logger.info({ tag: 'despair' },  `args(${count}) {
    //                 x0: ${ctx.x0.readCString()},
    //                 x1: ${ctx.x1.readCString()},
    //                 x2: ${ctx.x2},
    //                 x3: ${ctx.x3},
    //                 x4: ${ctx.x4},
    //                 x5: ${ctx.x5},
    //                 x6: ${ctx.x6},
    //                 x7: ${ctx.x7},
    //             }`);
    //             //@ts-ignore
    //             const ret = Libc.sscanf(ctx.x0, ctx.x1, ...[ctx.x2, ctx.x3, ctx.x4, ctx.x5, ctx.x6, ctx.x7].slice(0, count + 1));
    //             logger.info({ tag: 'hope' }, 'after boi !');

    //             // logger.info({ tag: 'sscanf' }, `${format} -> "${format?.readCString()?.replace('\n', '\\n')}"`);
    //             return ret;
    //         },
    //         'int',
    //         []
    //     )
    // );
    const regex = /^([a-z0-9]{10}-[a-z0-9]{10}) ([r-])([w-])([x-])([p-]) (.*)$/;
    Native.Inject.attachInModule(Native.Inject.isWithinOwnRange, Libc.sscanf, {
        onEnter(args) {
            this.str = args[0];
            this.format = args[1];

            const str = args[0].readCString();
            const found = str?.match(regex);
            if (found) {
                const repl = `${found[1]} ${found[2]}${found[3]}x${found[5]} ${found[6]}`;
                args[0].writeUtf8String(repl);
                logger.info({ tag: 'sscanf' }, `${args[0].readCString()} -> ${DebugSymbol.fromAddress(this.returnAddress)}`);
            }
        },
        onLeave(retval) {
            const str = this.str.readCString();
            const format = this.format.readCString();
            logger.info({ tag: 'sscanf' }, `${str}, ${format} -> ${DebugSymbol.fromAddress(this.returnAddress)}`);
        },
    });
}

function onModule(base: NativePointer, id: number) {
    logger.info({ tag: 'hook' }, `onmodule at ${base}`);
    Stalker.follow(id, {
        events: {
            call: false, // CALL instructions: yes please
            // Other events:
            ret: false, // RET instructions
            exec: false, // all instructions: not recommended as it's
            //                   a lot of data
            block: false, // block executed: coarse execution trace
            compile: false, // block compiled: useful for coverage
        },
        onReceive(events) {},
        transform(iterator) {
            let instruction = iterator.next();
            logger.info({ tag: 'onmodule' });
            do {
                if (instruction.mnemonic == 'syscall') {
                    logger.info({ tag: 'onmodule' }, 'Found syscall!');
                }
                iterator.keep();
            } while ((instruction = iterator.next()) !== null);
        },
    });
}

function addSyscall(base: NativePointer, offset: NativePointer) {
    logger.info({ tag: 'syscall' }, `${hexdump(base.add(offset).sub(12), { length: 20 })}`);
    Native.Syscall.hookSyscall(
        base.add(offset),
        new NativeCallback(
            function (dirfd, pathname, mode, flags) {
                //@ts-ignore
                const path = pathname?.readCString();
                logger.info({ tag: 'syscalll' }, `called at ${this.returnAddress} arg0: ${path}`);
                return 0;
            },
            'int',
            ['int', 'pointer', 'int', 'int'],
        ),
    );
}
