import type { RichCpuContext, SyscallCallingConvention } from './types.js';

const CC: SyscallCallingConvention = {
    OP: 'syscall',
    NR: 'rax',
    RET: 'rax',
    ARG0: 'rdi',
    ARG1: 'rsi',
    ARG2: 'rdx',
    ARG3: 'r10',
    ARG4: 'r8',
    ARG5: 'r9',
    PC: 'rip',
};

function hookSyscalls() {
    const opts: StalkerOptions = {
        events: {
            call: true,
        },
        transform: (iterator: StalkerArm64Iterator) => {
            let instruction: Arm64Instruction | null = null;
            let next = 0;
            while ((instruction = iterator.next() as Arm64Instruction) !== null) {
                next = 1;
                next = trace(iterator, instruction, {});

                if (next === -1) {
                    continue;
                }
                if (next > 0) {
                    iterator.keep();
                }
            }
        },
    };
}

type Params = {
    isSyscallExcluded?(svc: number): boolean;
    isModuleExcluded?(module: Module | null): boolean;
    onLeave?: boolean;
    debug?: true;
};
function trace(iterator: StalkerArm64Iterator, insn: Arm64Instruction, params?: Params) {
    const nparams: Params = params ?? {};
    const keep = 1;
    if (nparams.onLeave) {
        iterator.putCallout((context: PortableCpuContext) => {
            const richCtx = context as RichCpuContext;
            const n = richCtx[CC.NR].toInt32();

            if (richCtx.dxc == null) richCtx.dxc = { FD: {} };
            if (nparams.isSyscallExcluded?.(n)) return;

            if (this.debug.syscallLookup) {
                console.log(`[DEBUG][SYSCALL][${richCtx.dxc.orig}][${n}] BEFORE ret Parsing}`);
            }
            this.traceSyscallRet(richCtx);
            if (this.debug.syscallLookup) {
                console.log(`[DEBUG][SYSCALL][${richCtx.dxc.orig}][${n}] AFTER ret Parsing}`);
            }

            const hook = this.svc_hk[n];
            if (hook == null) return;

            if (hook.onLeave != null) {
                hook.onLeave(richCtx);
            }
        });

        nparams.onLeave = false;
    }

    const m = Process.findModuleByAddress(insn.address);
    if (insn.mnemonic === CC.OP) {
        nparams.onLeave = true;
        iterator.putCallout((context: PortableCpuContext) => {
            const richCtx = context as RichCpuContext;
            const n = richCtx[CC.NR].toInt32();
            const PC = richCtx[CC.PC];

            const m = Process.findModuleByAddress(PC);

            // debug
            if (nparams.debug) {
                if (m != null) {
                    console.log(
                        `[DEBUG][SYSCALL][BEFORE FILTER][${PC} : ${m.name} ${PC.sub(m.base)}] > ${Instruction.parse(PC)} > NUM ${n}`,
                    );
                } else {
                    console.log(
                        `[DEBUG][SYSCALL][BEFORE FILTER][${PC} : UNKNOW MODULE ${PC} - MODULE_BASE ] > ${Instruction.parse(PC)} > NUM ${n}`,
                    );
                }
            }

            if (nparams.isModuleExcluded?.(m)) return;
            //f(this.scope.syscalls.isExcluded!=null && this.scope.syscalls.isExcluded(n)) return;
            if (this.scope.syscalls?.isExcluded?.(n)) return;

            if (richCtx.dxc == null) richCtx.dxc = { FD: {} };
            const hook = this.svc_hk[n];

            richCtx.dxc.orig = context.pc;

            if (hook != null && hook.onEnter != null) {
                hook.onEnter(richCtx);
            }

            if (this.debug.syscallLookup) {
                console.log(`[DEBUG][SYSCALL][${richCtx.dxc.orig}][${n}] BEFORE arg Parsing}`);
            }
            this.traceSyscall(richCtx, hook);
            if (this.debug.syscallLookup) {
                console.log(
                    `[DEBUG][SYSCALL][${richCtx.dxc.orig}][${n}] AFTER arg Parsing = \n\t${richCtx.log}`,
                );
            }
        });
    }

    return keep;
}

export { hookSyscalls };
