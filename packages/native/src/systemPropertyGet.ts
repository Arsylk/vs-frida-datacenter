import { Libc } from '@clockwork/common';
import { subLogger, Color } from '@clockwork/logging';
const { gray, green, red } = Color.use();
const logger = subLogger('sysprop');

const spammyKeys = ['debug.stagefright.ccodec_timeout_mult'];

function attachSystemPropertyGet(
    fn?: (this: InvocationContext, key: string, value: string | null) => string | undefined,
) {
    fn &&
        Interceptor.attach(Libc.__system_property_read, {
            onEnter(args) {},
            onLeave(retval) {
                retval.replace(ptr(0x5b));
            },
        });
    Interceptor.attach(Libc.__system_property_get, {
        onEnter: function (args) {
            this.name = args[0].readCString();
            this.value = args[1];
        },
        onLeave: function (retval) {
            const key: string = this.name;
            const value: string = this.value.readCString();
            const fValue = value && value.length >= 0 ? value : null;
            const result = fn?.call(this, key, fValue);
            if (result !== undefined) {
                this.value.writeUtf8String(result);
                logger.info(`${gray(key)}: ${red(value ?? retval)} -> ${green(result)}`);
            } else {
                if (!spammyKeys.includes(key)) {
                    logger.info(`${gray(key)}: ${value ?? retval}`);
                }
            }
        },
    });
}

export { attachSystemPropertyGet };
