// import { Color } from '@clockwork/logging';
// const { white, gray } = Color.use();

// let wEnv: EnvWrapper;
// Java.perform(() => {
//     wEnv = new EnvWrapper(Java.vm.getEnv());

//     const NewGlobalRef = wEnv.getFunction(JNI.NewGlobalRef);
//     Interceptor.attach(NewGlobalRef, {
//         onEnter({ 0: env, 1: nonGlobalRef }) {
//             this.env = env;
//             this.nonGlobalRef = nonGlobalRef;
//         },
//         onLeave(retval) {
//             const env: NativePointer = this.env;
//             const nonGlobalRef: NativePointer = this.nonGlobalRef;
//             if (env && nonGlobalRef && retval && !retval.isNull() && retval !== ptr(0x0)) {
//                 const getObjectClass = asFunction(env, JNI.GetObjectClass);
//                 const refClass = getObjectClass(env, nonGlobalRef);
//                 const type = Text.toPrettyType(Java.cast(refClass, Classes.Class).getName());
//                 function tryerr(fn: () => any): string {
//                     try {
//                         const v = fn();
//                         return `${v}: ${gray(typeof v)}`;
//                     } catch (e) {
//                         return `${{ err: e.message }}`;
//                     }
//                 }
//                 function run(ref) {
//                     return Classes.String.format(
//                         '%s',
//                         tryerr(() => ref),
//                         tryerr(() => Java.cast(ref, Classes.Object)),
//                         //@ts-ignore
//                         tryerr(() => Classes.String.valueOf(ref)),
//                         //@ts-ignore
//                         tryerr(() => Classes.String.format(Classes.String.$enw('%s'), ref)),
//                     );
//                 }

//                 logger.info({ tag: 'global' }, run(retval));
//                 logger.info({ tag: ' local' }, run(nonGlobalRef));
//                 logger.info('');
//             }
//         },
//     });
// });
