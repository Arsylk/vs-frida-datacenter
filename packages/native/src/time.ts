import { Libc, Struct } from '@clockwork/common';
import { Color, logger } from '@clockwork/logging';
const { gray, bold, black } = Color.use();

function hookDifftime(predicate: (ptr: NativePointer) => boolean) {
    Interceptor.replace(
        Libc.difftime,
        new NativeCallback(
            function (time_0, time_1) {
                const ret = Libc.difftime(time_0, time_1);
                if (predicate(this.returnAddress))
                    logger.info(
                        { tag: 'difftime' },
                        `${gray(`${time_0}`)} - ${gray(`${time_1}`)} = ${bold(`${ret}`)}`,
                    );
                return ret;
            },
            'double',
            ['pointer', 'pointer'],
        ),
    );
}
function hookTime(predicate: (ptr: NativePointer) => boolean) {
    Interceptor.replace(
        Libc.time,
        new NativeCallback(
            function (time_t) {
                const ret = Libc.time(time_t);
                if (predicate(this.returnAddress)) logger.info({ tag: 'time' }, `${gray(`${time_t}`)}`);
                return ret;
            },
            'pointer',
            ['pointer'],
        ),
    );
}

function hookLocaltime(predicate: (ptr: NativePointer) => boolean) {
    Interceptor.replace(
        Libc.localtime,
        new NativeCallback(
            function (time_t) {
                const ret = Libc.time(time_t);
                if (predicate(this.returnAddress)) logger.info({ tag: 'localtime' }, `${gray(`${time_t}`)}`);
                return ret;
            },
            'pointer',
            ['pointer'],
        ),
    );
}

function hookGettimeofday(predicate: (ptr: NativePointer) => boolean) {
    Interceptor.replace(
        Libc.gettimeofday,
        new NativeCallback(
            function (tv, tz) {
                const ret = Libc.gettimeofday(tv, tz);
                if (predicate(this.returnAddress)) {
                    const timeval = Struct.Time.timeval(tv);
                    const timezone = Struct.Time.timezone(tz);
                    logger.info(
                        { tag: 'gettimeofday' },
                        `${gray(JSON.stringify(timeval))} ${gray(JSON.stringify(timezone))} ${black(ret)}`,
                    );
                }

                return ret;
            },
            'int',
            ['pointer', 'pointer'],
        ),
    );
}

export { hookDifftime, hookTime, hookLocaltime, hookGettimeofday };
