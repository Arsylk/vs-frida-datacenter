import { createHash } from 'crypto';
import { Inject, dumpFile } from '@clockwork/native';
import { Text } from '@clockwork/common';
import { Color, subLogger } from '@clockwork/logging';
const { red, dim, blue } = Color.use();
const logger = subLogger('cocos2dx');

type ModuleOffset = { name: string; offset: NativePointer };

function hookLegacy(): NativePointer[] {
    //@ts-ignore
    const array = Module.enumerateExportsSync(libname).filter(({ name }) => name.includes('evalString' && name.includes('ScriptEngine')));
    return array;
}

/**
 *  __int64 __fastcall se::ScriptEngine::evalString(
 *         se::ScriptEngine *this,
 *         const char *scripts,
 *         unsigned __int64 len,
 *         se::Value *a4,
 *         const char *filename)
 * */
const hookEvalString: InvocationListenerCallbacks = {
    onEnter(args) {
        const [_, scripts, len, a4, filename] = [args[0], args[1], args[2], args[3], args[4]];
        let length: number | null = null;
        let path: string | null = null;
        let data: string | null = null;
        if (filename && (path = filename.readCString())) {
            length = len.toUInt32();
        } else if ((data = scripts.readCString())) {
            path = createHash('sha256').update(data).digest('hex') + '.js';
            length = data.length;
        }
        if (!length || !path) return;
        const result = dumpFile(scripts, length, path, 'cocos2dx');
        logger.info(`${path} ${result ? dim(Text.toByteSize(length)) : 'error'}`);
    },
    onLeave(retval) {},
};

const hookLuaLLoadbuffer: InvocationListenerCallbacks = {
    onEnter(args) {
        const [scripts, len] = [args[1], args[2]];
        const length = len.toInt32();
        const buffer = scripts.readCString(length);
        if (buffer) {
            const path = createHash('sha256').update(buffer).digest('hex') + '.lua';
            const result = dumpFile(scripts, length, path, 'cocos2dx');
            logger.info(`${path} ${result ? dim(Text.toByteSize(length)) : 'error'}`);
        }
    },
    onLeave(retval) {},
};

function dump(...targets: ModuleOffset[]) {
    const notFoundId = setTimeout(() => logger.warn('10 seconds have passed and no cocos2dx methods were called yet'), 10000)
    Inject.afterInitArrayModule((module: Module) => {
        const addresses: NativePointer[] = [];
        targets.forEach(({ name, offset }) => {
            if (name === module.name) {
                addresses.push(module.base.add(offset));
            }
        });
        if (parseInt(Frida.version.split('.')[0]) <= 15) {
            addresses.push(...hookLegacy());
        } else {
            let hookTemp = module.findExportByName('_ZN2se12ScriptEngine10evalStringEPKclPNS_5ValueES2_');
            hookTemp ??= module.findExportByName('_ZN2se12ScriptEngine10evalStringEPKcjPNS_5ValueES2_');
            hookTemp ??= module.findExportByName('_ZN2se12ScriptEngine10evalStringEPKciPNS_5ValueES2_');
            hookTemp && addresses.push(hookTemp);
        }
        addresses.forEach((address) => {
            logger.info(`evalString ${module.name} ${DebugSymbol.fromAddress(address)}`);
            Interceptor.attach(address, hookEvalString);
        });
        const lual = module.findExportByName('luaL_loadbuffer');
        if (lual) {
            logger.info(`luaL_loadbuffer ${module.name} ${lual}`);
            Interceptor.attach(lual, hookLuaLLoadbuffer);
        }
        const xxtea_decrypt = module.findExportByName('_Z13xxtea_decryptPhjS_jPj');
        if (xxtea_decrypt) {
            logger.info(`xxtea_decrypt ${module.name} ${xxtea_decrypt}`);
            Interceptor.attach(xxtea_decrypt, {
                onEnter: function (args) {
                    logger.info('key -> ' + args[2].readCString(Math.min(args[3].toUInt32(), 16)));
                },
                onLeave: function (retval) {},
            });
        }

        if (addresses.length > 0 || lual || xxtea_decrypt) {
            // logger.warn('dump: no cocos2dx functions found')
            clearTimeout(notFoundId)
        }
    });
}

export { dump };
