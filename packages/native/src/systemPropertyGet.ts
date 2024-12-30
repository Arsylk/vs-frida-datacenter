import { Libc, isNully } from '@clockwork/common';
import { subLogger, Color } from '@clockwork/logging';
const { gray, green, red } = Color.use();
const logger = subLogger('sysprop');

const spammyKeys = ['debug.stagefright.ccodec_timeout_mult', 'ro.build.version.sdk'];

function attachSystemPropertyGet(
    fn?: (this: InvocationContext, key: string, value: string | null) => string | null | undefined,
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

            if (spammyKeys.includes(key)) {
                return;
            }

            if (result) {
                this.value.writeUtf8String(result);
                logger.info(`${gray(key)}: ${red(value ?? '')} -> ${green(result)}`);
                return;
            }

            if (result === null) {
                this.value.writeByteArray([0x0, 0x0, 0x0, 0x0]);
                logger.info(`${gray(key)}: ${Color.keyword(null)}`);
                return;
            }

            logger.info(`${gray(key)}: ${value ?? ''}`);
        },
    });

    Interceptor.attach(Libc.__system_property_find, {
        onEnter({ 0: name }) {
            this.name = name;
        },
        onLeave(retval) {
            const key = this.name?.readCString();
            const value = !isNully(retval) ? retval.readCString() : null;
            const result = fn?.call(this, key, value);

            if (result === null && value !== null) {
                logger.info({ tag: 'sysfind' }, `${gray(key)}: ${red(value)} -> ${Color.keyword(null)}`);
                return;
            }
            if (value !== null) {
                logger.info({ tag: 'sysfind' }, `${gray(key)}: ${result}`);
                return;
            }

            logger.info({ tag: 'sysfind' }, `${gray(key)}: ${Color.keyword(null)}`);
        },
    });
}

export { attachSystemPropertyGet };
