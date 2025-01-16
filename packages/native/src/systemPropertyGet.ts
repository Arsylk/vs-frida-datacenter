import { Libc, isNully } from '@clockwork/common';
import { subLogger, Color } from '@clockwork/logging';
const { gray, green, red } = Color.use();
const logger = subLogger('sysprop');

const spammyKeys = ['debug.stagefright.ccodec_timeout_mult', 'ro.build.version.sdk', 'debug.force_rtl'];

function attachSystemPropertyGet(
    predicate?: (returnAddress: NativePointer) => true | undefined,
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

            if (result !== undefined && result !== null) {
                this.value.writeUtf8String(result);
                logger.info(`${gray(key)}: ${red(value)} -> ${green(result)}`);
                return;
            }

            if (result === null) {
                this.value.writeByteArray(new Uint8Array(value.length + 1).map((_) => 0x0));
                logger.info(`${gray(key)}: ${red(value ?? '')} -> `);
                return;
            }

            logger.info(`${gray(key)}: ${value ?? ''}`);
        },
    });

    false &&
        Interceptor.attach(Libc.__system_property_find, {
            onEnter({ 0: name }) {
                this.name = name;
            },
            onLeave(retval) {
                if (!predicate?.(this.returnAddress)) return;
                //screenshot.googleplex.com/FYjVySd7jQ6PTPF
                const key = this.name?.readCString();
                const value = !isNully(retval) ? retval.readCString() : null;
                const result = fn?.call(this, key, value);

                if (
                    `${key}`.startsWith('log.tag') ||
                    `${key}`.startsWith('persist.log.tag') ||
                    spammyKeys.includes(`${key}`)
                ) {
                    return;
                }

                if (result && value) {
                    logger.info({ tag: 'sysfind' }, `${gray(key)}: ${red(value)} -> ${green(result)}`);
                    return;
                }
                if (result === null && value) {
                    logger.info({ tag: 'sysfind' }, `${gray(key)}: ${red(value)}`);
                }
                if (value === null) {
                    const sub = value !== null ? `${red(value)} -> ` : ' ';
                    logger.info({ tag: 'sysfind' }, `${gray(key)}: ${sub}${Color.number(result)}`);
                    return;
                }

                logger.info({ tag: 'sysfind' }, `${gray(key)}: ${value}`);
            },
        });
}

export { attachSystemPropertyGet };
