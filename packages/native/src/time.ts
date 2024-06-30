import { Libc } from '@clockwork/common';
import { Color, logger } from '@clockwork/logging';
const { gray, bold } = Color.use()

function hookDifftime(predicate: (ptr: NativePointer) => boolean) {
    Interceptor.replace(
        Libc.difftime,
        new NativeCallback(
            function (time_0, time_1) {
                const ret = Libc.difftime(time_0, time_1);
                if (predicate(this.returnAddress)) 
                    logger.info({ tag: 'difftime' }, `${gray(`${time_0}`)} - ${gray(`${time_1}`)} = ${bold(`${ret}`)}`)
                return ret
            }, 
            'double',
            ['pointer', 'pointer'],
        ),
    );
}

export { hookDifftime }