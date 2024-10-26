import { a_type } from "@clockwork/common/dist/define/enum.js";
import { Color, logger } from "@clockwork/logging";
const { gray } = Color.use();

function hookGetauxval() {
    Interceptor.replace(
        Libc.getauxval,
        new NativeCallback(
            function(type) {
                const retval = Libc.getauxval(type);
                logger.info({ tag: 'getauxval' }, `${gray(a_type[type as a_type])}: ${ptr(retval)}`);
                return retval;
            },
            'uint32',
            ['uint32'],
        ),
    )
}

function hookSystem() {
    Interceptor.replace(Libc.system, new NativeCallback(function(command) {
        const retval = Libc.system(command);
        return retval;
    }, 'int', ['pointer']));
}


export { hookGetauxval, hookSystem };
