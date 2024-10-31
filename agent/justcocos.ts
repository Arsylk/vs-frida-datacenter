import * as Dump from '@clockwork/dump';
import * as JniTrace from '@clockwork/jnitrace';
import * as Native from '@clockwork/native';


//Anticloak.Jigau.memoryPatch()

Process.setExceptionHandler((exception: ExceptionDetails) => {
    return exception.type === 'abort';
})
JniTrace.attach(({ returnAddress }) => {
    function isWithinOwnRange(ptr: NativePointer) {
        const path = Native.Inject.modules.findPath(ptr);
        return path?.includes('/data') === true && !path.includes('/com.google.android.trichromelibrary');
    }

    if (!returnAddress) return false;
    if (isWithinOwnRange(returnAddress)) return true;
    return !true && Native.Inject.modules.find(returnAddress) === null;
});


// Native.Inject.afterInitArray((name) => {
//     if (!name.endsWith('/base.odex') && name.includes('libjiagu_64.so')) {
//         const module = Process.getModuleByName(name);
//         try {
//             Memory.protect(module.base, module.size, 'rwx')
//             const bytes = module.base.readByteArray(module.size);
//             const outpath = `${Native.getSelfFiles()}/${name}_${module.base}_${module.base.add(module.size)}.so`
//             //@ts-ignore
//             // const file = new File(outpath, 'wb')
//             File.writeAllBytes(outpath, bytes)
//             logger.info({tag: 'so'}, `finished ${name} ${module.base}-${module.base.add(module.size)}`)
//         } catch(e) {
//             logger.error({tag: 'so'}, `${e} ${module.base}-${module.base.add(module.size)}`)
//         }
//     } 
// })

Dump.initSoDump()
// Dump.scheduleDexDump()