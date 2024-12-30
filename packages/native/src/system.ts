import { Consts } from '@clockwork/common';
import { Color, logger } from '@clockwork/logging';
const { gray } = Color.use();
const { a_type } = Consts;

function hookGetauxval() {
    // ? found single case where this would hang the app forever, attach version works fine
    //Interceptor.replace(
    //    Libc.getauxval,
    //    new NativeCallback(
    //        (type) => {
    //            const retval = Libc.getauxval(type);
    //            logger.info({ tag: 'getauxval' }, `${gray(a_type[type as a_type])}: ${ptr(retval)}`);
    //            return retval;
    //        },
    //        'uint32',
    //        ['uint32'],
    //    ),
    //);
    Interceptor.attach(Libc.getauxval, {
        onEnter({ 0: type }) {
            this.type = type;
        },
        onLeave(retval) {
            const numType = Number(this.type);
            logger.info({ tag: 'getauxval' }, `${gray(a_type[numType])}: ${retval}`);
        },
    });
}

function hookSystem() {
    Interceptor.replace(
        Libc.system,
        new NativeCallback(
            (command) => {
                const retval = Libc.system(command);
                return retval;
            },
            'int',
            ['pointer'],
        ),
    );
}

function hookPosixSpawn() {
    Interceptor.attach(Libc.posix_spawn, {
        onEnter({ 0: pid, 1: path, 2: action }) {
            const pathStr = path.readCString();
            logger.info({ tag: 'posix_spawn' }, `pid: ${pid} path: ${pathStr} action: ${action}`);
        },
        onLeave(retval) {
            logger.info({ tag: 'posix_spawn' }, `return: ${retval}`);
        },
    });
}

export { hookGetauxval, hookPosixSpawn, hookSystem };
