import * as Anticloak from '@clockwork/anticloak';
import { emitter } from '@clockwork/common';
import * as Dump from '@clockwork/dump';
import { Color, logger } from '@clockwork/logging';
import * as Native from '@clockwork/native';
const { gray } = Color.use()

const predicate = (r: NativePointer) => {
    function isWithinOwnRange(ptr: NativePointer) {
        const path = Native.Inject.modules.findPath(ptr);
        return path?.includes('/data') === true && !path.includes('/com.google.android.trichromelibrary');
    }
    return isWithinOwnRange(r);
};

const regs_map = new Map<any, any>();
let pre_regs: any = [];

function formatArm64Regs(context: any) {
    const regs: any[] = []
    regs.push(context.x0);
    regs.push(context.x1);
    regs.push(context.x2);
    regs.push(context.x3);
    regs.push(context.x4);
    regs.push(context.x5);
    regs.push(context.x6);
    regs.push(context.x7);
    regs.push(context.x8);
    regs.push(context.x9);
    regs.push(context.x10);
    regs.push(context.x11);
    regs.push(context.x12);
    regs.push(context.x13);
    regs.push(context.x14);
    regs.push(context.x15);
    regs.push(context.x16);
    regs.push(context.x17);
    regs.push(context.x18);
    regs.push(context.x19);
    regs.push(context.x20);
    regs.push(context.x21);
    regs.push(context.x22);
    regs.push(context.x23);
    regs.push(context.x24);
    regs.push(context.x25);
    regs.push(context.x26);
    regs.push(context.x27);
    regs.push(context.x28);
    regs.push(context.fp);
    regs.push(context.lr);
    regs.push(context.sp);
    regs.push(context.pc);
    regs_map.set('x0', context.x0);
    regs_map.set('x1', context.x1);
    regs_map.set('x2', context.x2);
    regs_map.set('x3', context.x3);
    regs_map.set('x4', context.x4);
    regs_map.set('x5', context.x5);
    regs_map.set('x6', context.x6);
    regs_map.set('x7', context.x7);
    regs_map.set('x8', context.x8);
    regs_map.set('x9', context.x9);
    regs_map.set('x10', context.x10);
    regs_map.set('x11', context.x11);
    regs_map.set('x12', context.x12);
    regs_map.set('x13', context.x13);
    regs_map.set('x14', context.x14);
    regs_map.set('x15', context.x15);
    regs_map.set('x16', context.x16);
    regs_map.set('x17', context.x17);
    regs_map.set('x18', context.x18);
    regs_map.set('x19', context.x19);
    regs_map.set('x20', context.x20);
    regs_map.set('x21', context.x21);
    regs_map.set('x22', context.x22);
    regs_map.set('x23', context.x23);
    regs_map.set('x24', context.x24);
    regs_map.set('x25', context.x25);
    regs_map.set('x26', context.x26);
    regs_map.set('x27', context.x27);
    regs_map.set('x28', context.x28);
    regs_map.set('fp', context.fp);
    regs_map.set('lr', context.lr);
    regs_map.set('sp', context.sp);
    regs_map.set('pc', context.pc);
    return regs;
}

function getRegsString(index) {
    let reg: any;
    if (index === 31) {
        reg = "sp"
    } else {
        reg = `x${index}`;
    }
    return reg;
}


function isRegsChange(context, ins) {
    const currentRegs = formatArm64Regs(context);
    const entity = {};
    let logInfo = "";
    // 打印寄存器信息
    for (let i = 0; i < 32; i++) {
        if (i === 30) {
            continue
        }
        const preReg = pre_regs[i] ? pre_regs[i] : 0x0;
        let currentReg = currentRegs[i];
        if (Number(preReg) !== Number(currentReg)) {
            if (logInfo === "") {
                //尝试读取string
                let changeString: any = "";
                try {
                    const nativePointer = new NativePointer(currentReg);
                    changeString = nativePointer.readCString();
                } catch (e) {
                    changeString = "";
                }
                if (changeString !== "") {
                    currentReg = `${currentReg} (${changeString})`;
                }
                logInfo = ` ${getRegsString(i)}: ${preReg} --> ${currentReg}, `;
            } else {
                logInfo = `${logInfo} ${getRegsString(i)}: ${preReg} --> ${currentReg}, `;
            }
        }
    }

    (entity as any).info = logInfo;
    pre_regs = currentRegs;
    return entity;
}

let x = false
// Anticloak.Debug.hookPtrace();
// Native.Pthread.hookPthread_create();
emitter.on('dump', (args) => { Dump.dumpLib(args) })
function run(module) {
    // (Native.addressOf as any).transform = (ptr) => ptr.sub(module.base).add(0x7169250000)
    logger.info({ tag: 'base' }, stringifyData(module))
    // JniTrace.attach((thisRef) => predicate(thisRef.returnAddress));
    // Native.TheEnd.hook(predicate);
    // Native.Strings.hookStrstr(() => true);
    const hookme = () => {
        Interceptor.attach(module.getExportByName('cJSON_Parse'), {
            onEnter(args) {
                logger.info({ tag: 'cJSON_Parse' }, `${args[0].readCString()}`)
                const stacktrace = Thread.backtrace(this.context, Backtracer.FUZZY)
                    .map(t => Native.addressOf(t, true))
                    .join('\n\t');
                logger.info(
                    { tag: 'cJSON_Parse' },
                    `${Native.addressOf(this.returnAddress)} ${stacktrace}`,
                );
            },
        })
        Interceptor.attach(module.getExportByName('cJSON_GetObjectItem'), {
            onEnter({ 0: thisRef, 1: key }) {
                logger.info({ tag: 'cJSON_GetObjectItem' }, `${key.readCString()}`)
            },
        })
        Interceptor.attach(module.getExportByName('cJSON_CreateObject'), {
            onEnter({ 0: thisRef }) {
                logger.info({ tag: 'cJSON_CreateObject' }, `${thisRef}`)
            },
        })
    }
    hookme()

    const codeexec: any[] = []
    MemoryAccessMonitor.enable({ base: module.base.add(0x1ca728), size: 0x100 }, {
        onAccess(details) {
            logger.info({ tag: 'mwatch' }, `${details.operation} ${details.from} -> ${details.address}`)
            console.log(hexdump(details.from))
            console.log(Native.addressOf(details.from))
        },
    })
}
Native.Inject.afterInitArrayModule((module) => {
    if (module.name === 'libthe_box.so') {
        run(module)
    }
})

function printRet(addr) {
    console.log('ret', addr)
}
function stringifyData(data: any) {
    const mapped = Reflect.ownKeys(data).map((k: symbol | string) => {
        const value = data[k as string];
        return `${gray(k as string)}: ${value}`;

    })
    return `{ ${mapped.join(', ')} }`
}

const INSTALL_REFERRER =
    'utm_source=Organic';
Anticloak.InstallReferrer.replace({ install_referrer: INSTALL_REFERRER })
