import { Text } from '@clockwork/common';
import { EnvWrapper, JNI, asFunction } from '@clockwork/jnitrace';
import { Color, logger } from '@clockwork/logging';
const { white, gray } = Color.use();

let wEnv: EnvWrapper;
Java.perform(() => {
    wEnv = new EnvWrapper(Java.vm.getEnv());

    const NewGlobalRef = wEnv.getFunction(JNI.NewGlobalRef);
    Interceptor.attach(NewGlobalRef, {
        onEnter({ 0: env, 1: nonGlobalRef }) {
            this.env = env;
            this.nonGlobalRef = nonGlobalRef;
        },
        onLeave(retval) {
            const env: NativePointer = this.env;
            const nonGlobalRef: NativePointer = this.nonGlobalRef;
            if (env && nonGlobalRef && retval && !retval.isNull() && retval !== ptr(0x0)) {
                const getObjectClass = asFunction(env, JNI.GetObjectClass);
                const refClass = getObjectClass(env, nonGlobalRef);
                const type = Text.toPrettyType(Java.cast(refClass, Classes.Class).getName());
                const tryerr = (fn: () => any) => {
                    try {
                        return `${fn()}`;
                    } catch (e) {
                        return `${{ err: e.message }}`;
                    }
                };
                const run = (ref) => {
                    return Classes.String.format(
                        '%s',
                        tryerr(() => ref),
                        tryerr(() => Java.cast(ref, Classes.Object)),
                        //@ts-ignore
                        tryerr(() => Classes.String.valueOf(ref)),
                        //@ts-ignore
                        tryerr(() =>
                            Classes.String.format.overload('java.lang.String', '[Ljava.lang.Object;')(
                                Classes.String.$enw('%s'),
                                Java.array(Classes.String.$new('%s'), [ref]),
                            ),
                        ),
                    );
                };

                logger.info({ tag: 'global' }, run(retval));
                logger.info({ tag: ' local' }, run(nonGlobalRef));
                logger.info('');
            }
        },
    });
});
