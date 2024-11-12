import * as Anticloak from '@clockwork/anticloak';
import { emitter } from '@clockwork/common';
import { initSoDump, scheduleDexDump } from '@clockwork/dump';
import * as JniTrace from '@clockwork/jnitrace';
import { Color, logger } from '@clockwork/logging';
import * as Native from '@clockwork/native';
import * as Network from '@clockwork/network';
const { white, gray } = Color.use();

Network.injectSsl();
Anticloak.InstallReferrer.replace({ install_referrer: 'utm_source=facebook_ads&utm_medium=Non-rganic&media_source=true_network&http_referrer=BingSearch' });
Java.performNow(() => {
})

const predicate = (r: NativePointer) => {
    function isWithinOwnRange(ptr: NativePointer) {
        const path = Native.Inject.modules.findPath(ptr);
        return path?.includes('/data') === true && !path.includes('/com.google.android.trichromelibrary');
    }
    return isWithinOwnRange(r);
}

let en = true;
setTimeout(() => (en = true), 5000);
JniTrace.attach((thisRef) => en && predicate(thisRef.returnAddress))

Native.Files.hookAccess(predicate);
Native.Files.hookOpen(predicate, function (path) {
    if (path?.includes('.dex') || this !== null) {
    };
});
Native.Files.hookFopen(predicate, true, (path) => {
    // if (path === '/proc/self/maps' || path === `/proc/${Process.id}/maps`) {
    //     return `/data/data/${getSelfProcessName()}/files/fake_maps`;
    // }
    if (path?.endsWith('/su')) {
        return path.replace(/\/su$/, '/nya')
    }
});
Native.Files.hookOpendir(predicate);
Native.Files.hookStat(predicate);
Native.Files.hookRemove(predicate);
// Native.Strings.hookStrlen(predicate);
// Native.Strings.hookStrcpy(predicate);
// Native.Strings.hookStrcmp(predicate);
// Native.Strings.hookStrstr(predicate);
// Native.Strings.hookStrtoLong(predicate);

Native.TheEnd.hook(predicate);

Native.System.hookSystem();
Native.System.hookGetauxval();

// Native.Time.hookDifftime(predicate);
// Native.Time.hookTime(predicate);
// Native.Time.hookLocaltime(predicate);
// Native.Time.hookGettimeofday(predicate);
Native.Pthread.hookPthread_create();
// Native.Logcat.hookLogcat();

Anticloak.Debug.hookPtrace();


Interceptor.attach(Libc.sprintf, {
    onEnter(args) {
        this.dst = args[0];
    },
    onLeave(retval) {
        const text = this.dst.readCString();
        logger.info({ tag: 'sprintf' }, `${text}`);
    },
});

Interceptor.attach(Libc.posix_spawn, {
    onEnter({ 0: pid, 1: path, 2: action }) {
        const pathStr = path.readCString();
        logger.info({ tag: 'posix_spawn' }, `${pathStr} ${action}`);
    },
    onLeave(retval) {
        logger.info({ tag: 'posix_spawn' }, `${retval}`);
    },
});

emitter.on('so', initSoDump)
emitter.on('dex', scheduleDexDump.bind(0));

const funct = { '0x149930': '__aarch64_sync_cache_range', '0x3fd148': '__android_log_print', '0x14d0d0': '__arm_a_0', '0x110a5c': '__arm_a_1', '0x10f1b8': '__arm_a_2', '0x10e468': '__arm_a_20', '0x10e3ac': '__arm_a_21', '0x10d350': '__arm_c_0', '0x10dcb4': '__arm_c_0', '0x3fd278': '__assert2', '0x14992c': '__clear_cache', '0x3fd288': '__cxa_atexit', '0x149280': '__cxa_call_unexpected', '0x3fd0e8': '__cxa_finalize', '0x14cf1c': '__deregister_frame', '0x14cf18': '__deregister_frame_info', '0x14ce28': '__deregister_frame_info_bases', '0x3fd090': '__errno', '0x14b290': '__frame_state_for', '0x1170c8': '__grow_by_and_replace', '0x148dfc': '__gxx_personality_v0', '0x117bcc': '__init', '0x121794': '__push_back_slow_path<std::string>', '0x1218f8': '__push_back_slow_path<std::string_const&>', '0x14cd40': '__register_frame', '0x14cd34': '__register_frame_info', '0x109c80': '__register_frame_info', '0x14ccb0': '__register_frame_info_bases', '0x14cdf0': '__register_frame_info_table', '0x14cd80': '__register_frame_info_table_bases', '0x14cdfc': '__register_frame_table', '0x3fd198': '__stack_chk_fail', '0x1216f4': '__swap_out_circular_buffer', '0x3fd388': '_exit', '0x109ba0': '_exit', '0x109d74': '_FINI_0', '0x110b84': '_INIT_0', '0x109d80': '_INIT_1', '0x109df0': '_INIT_2', '0x136234': '_U_dyn_info_list_addr', '0x136094': '_Uaarch64_flush_cache', '0x136064': '_Uaarch64_get_accessors', '0x135c10': '_Uaarch64_get_elf_image', '0x139e90': '_Uaarch64_is_fpreg', '0x137f1c': '_ULaarch64_dwarf_find_debug_frame', '0x13872c': '_ULaarch64_dwarf_search_unwind_table', '0x1289c8': '_ULaarch64_get_proc_name', '0x128b50': '_ULaarch64_get_proc_name_by_ip', '0x128504': '_ULaarch64_get_reg', '0x13466c': '_ULaarch64_handle_signal_frame', '0x133cc0': '_ULaarch64_init_local', '0x1349b4': '_ULaarch64_is_signal_frame', '0x133bdc': '_ULaarch64_local_access_addr_space_init', '0x134550': '_ULaarch64_resume', '0x134884': '_ULaarch64_step', '0x14b820': '_Unwind_Backtrace', '0x14b7fc': '_Unwind_DeleteException', '0x14cf40': '_Unwind_Find_FDE', '0x149e4c': '_Unwind_FindEnclosingFunction', '0x14b510': '_Unwind_ForcedUnwind', '0x149db8': '_Unwind_GetCFA', '0x149e74': '_Unwind_GetDataRelBase', '0x149c54': '_Unwind_GetGR', '0x149e18': '_Unwind_GetIP', '0x149e20': '_Unwind_GetIPInfo', '0x149e3c': '_Unwind_GetLanguageSpecificData', '0x149e44': '_Unwind_GetRegionStart', '0x149e7c': '_Unwind_GetTextRelBase', '0x14b388': '_Unwind_RaiseException', '0x14b604': '_Unwind_Resume', '0x14b700': '_Unwind_Resume_or_Rethrow', '0x149dc0': '_Unwind_SetGR', '0x109b80': '_Unwind_SetGR', '0x149e34': '_Unwind_SetIP', '0x3fd190': 'abort', '0x3fd368': 'access', '0x109b40': 'access', '0x127754': 'addr_is_readable', '0x11f72c': 'append', '0x117210': 'assign', '0x3fd380': 'atoi', '0x3fd1b8': 'calloc', '0x3fd1a0': 'chmod', '0x3fd3e0': 'close', '0x3fd3c8': 'closedir', '0x3fd030': 'connect', '0x3fd020': 'deflate', '0x3fd1c8': 'deflateBound', '0x3fd3e8': 'deflateEnd', '0x109ca0': 'deflateEnd', '0x3fd268': 'deflateInit2_', '0x3fd350': 'difftime', '0x109aa0': 'difftime', '0x3fd160': 'dladdr', '0x3fd178': 'dlclose', '0x3fd248': 'dlopen', '0x3fd2d8': 'dlsym', '0x110b4c': 'doSetShellState', '0x109ce0': 'entry', '0x3fd318': 'fclose', '0x3fd100': 'feof', '0x3fd0c0': 'fgets', '0x3fd200': 'fmod', '0x3fd018': 'fmodf', '0x3fd308': 'fnmatch', '0x3fd2f0': 'fopen', '0x1099c0': 'fopen', '0x3fd2b0': 'fork', '0x3fd1d8': 'fprintf', '0x3fd2d0': 'fread', '0x3fd400': 'free', '0x3fd1f8': 'fseek', '0x3fd1d0': 'fstat', '0x1092a0': 'FUN_001092a0', '0x1092b0': 'FUN_001092b0', '0x1092c0': 'FUN_001092c0', '0x1092d0': 'FUN_001092d0', '0x1092f0': 'FUN_001092f0', '0x109300': 'FUN_00109300', '0x109310': 'FUN_00109310', '0x109320': 'FUN_00109320', '0x109330': 'FUN_00109330', '0x109340': 'FUN_00109340', '0x109360': 'FUN_00109360', '0x109370': 'FUN_00109370', '0x109380': 'FUN_00109380', '0x1093a0': 'FUN_001093a0', '0x1093b0': 'FUN_001093b0', '0x1093c0': 'FUN_001093c0', '0x1093d0': 'FUN_001093d0', '0x1093e0': 'FUN_001093e0', '0x1093f0': 'FUN_001093f0', '0x109400': 'FUN_00109400', '0x109410': 'FUN_00109410', '0x109420': 'FUN_00109420', '0x109430': 'FUN_00109430', '0x109450': 'FUN_00109450', '0x109460': 'FUN_00109460', '0x109470': 'FUN_00109470', '0x109480': 'FUN_00109480', '0x109490': 'FUN_00109490', '0x1094a0': 'FUN_001094a0', '0x1094c0': 'FUN_001094c0', '0x1094d0': 'FUN_001094d0', '0x1094e0': 'FUN_001094e0', '0x109500': 'FUN_00109500', '0x109530': 'FUN_00109530', '0x109540': 'FUN_00109540', '0x109550': 'FUN_00109550', '0x109560': 'FUN_00109560', '0x109570': 'FUN_00109570', '0x109590': 'FUN_00109590', '0x1095c0': 'FUN_001095c0', '0x1095d0': 'FUN_001095d0', '0x1095f0': 'FUN_001095f0', '0x109600': 'FUN_00109600', '0x109610': 'FUN_00109610', '0x109620': 'FUN_00109620', '0x109630': 'FUN_00109630', '0x109650': 'FUN_00109650', '0x109660': 'FUN_00109660', '0x109670': 'FUN_00109670', '0x109680': 'FUN_00109680', '0x1096b0': 'FUN_001096b0', '0x1096c0': 'FUN_001096c0', '0x1096d0': 'FUN_001096d0', '0x1096e0': 'FUN_001096e0', '0x1096f0': 'FUN_001096f0', '0x109700': 'FUN_00109700', '0x109710': 'FUN_00109710', '0x109730': 'FUN_00109730', '0x109740': 'FUN_00109740', '0x109750': 'FUN_00109750', '0x109760': 'FUN_00109760', '0x109780': 'FUN_00109780', '0x109790': 'FUN_00109790', '0x1097a0': 'FUN_001097a0', '0x1097c0': 'FUN_001097c0', '0x1097d0': 'FUN_001097d0', '0x1097e0': 'FUN_001097e0', '0x1097f0': 'FUN_001097f0', '0x109820': 'FUN_00109820', '0x109830': 'FUN_00109830', '0x109850': 'FUN_00109850', '0x109860': 'FUN_00109860', '0x109870': 'FUN_00109870', '0x109890': 'FUN_00109890', '0x1098b0': 'FUN_001098b0', '0x1098c0': 'FUN_001098c0', '0x1098d0': 'FUN_001098d0', '0x1098e0': 'FUN_001098e0', '0x1098f0': 'FUN_001098f0', '0x109900': 'FUN_00109900', '0x109910': 'FUN_00109910', '0x109920': 'FUN_00109920', '0x109930': 'FUN_00109930', '0x109950': 'FUN_00109950', '0x109960': 'FUN_00109960', '0x109970': 'FUN_00109970', '0x109980': 'FUN_00109980', '0x109990': 'FUN_00109990', '0x1099a0': 'FUN_001099a0', '0x1099b0': 'FUN_001099b0', '0x1099e0': 'FUN_001099e0', '0x109a10': 'FUN_00109a10', '0x109a20': 'FUN_00109a20', '0x109d4c': 'FUN_00109d4c', '0x109e78': 'FUN_00109e78', '0x10a130': 'FUN_0010a130', '0x10a5c0': 'FUN_0010a5c0', '0x10a5f8': 'FUN_0010a5f8', '0x10a710': 'FUN_0010a710', '0x10a744': 'FUN_0010a744', '0x10a7b4': 'FUN_0010a7b4', '0x10a7e8': 'FUN_0010a7e8', '0x10aa28': 'FUN_0010aa28', '0x10ab68': 'FUN_0010ab68', '0x10b248': 'FUN_0010b248', '0x10bcf8': 'FUN_0010bcf8', '0x10be18': 'FUN_0010be18', '0x10bfc8': 'FUN_0010bfc8', '0x10cea8': 'FUN_0010cea8', '0x10cf00': 'FUN_0010cf00', '0x10d0cc': 'FUN_0010d0cc', '0x10da88': 'FUN_0010da88', '0x10db24': 'FUN_0010db24', '0x10e4b4': 'FUN_0010e4b4', '0x10f15c': 'FUN_0010f15c', '0x110430': 'FUN_00110430', '0x110c24': 'FUN_00110c24', '0x110d60': 'FUN_00110d60', '0x110e34': 'FUN_00110e34', '0x111058': 'FUN_00111058', '0x111100': 'FUN_00111100', '0x111608': 'FUN_00111608', '0x111614': 'FUN_00111614', '0x111758': 'FUN_00111758', '0x111788': 'FUN_00111788', '0x1117b8': 'FUN_001117b8', '0x1118d0': 'FUN_001118d0', '0x111918': 'FUN_00111918', '0x1119dc': 'FUN_001119dc', '0x111c94': 'FUN_00111c94', '0x111de4': 'FUN_00111de4', '0x111ec4': 'FUN_00111ec4', '0x111f6c': 'FUN_00111f6c', '0x112014': 'FUN_00112014', '0x112248': 'FUN_00112248', '0x112398': 'FUN_00112398', '0x1124b0': 'FUN_001124b0', '0x1124f4': 'FUN_001124f4', '0x112570': 'FUN_00112570', '0x1125a0': 'FUN_001125a0', '0x1128e8': 'FUN_001128e8', '0x1134ec': 'FUN_001134ec', '0x113524': 'FUN_00113524', '0x113574': 'FUN_00113574', '0x1135ac': 'FUN_001135ac', '0x113690': 'FUN_00113690', '0x113880': 'FUN_00113880', '0x113f58': 'FUN_00113f58', '0x114e48': 'FUN_00114e48', '0x114e58': 'FUN_00114e58', '0x114ecc': 'FUN_00114ecc', '0x114f04': 'FUN_00114f04', '0x114f48': 'FUN_00114f48', '0x114f6c': 'FUN_00114f6c', '0x1150e0': 'FUN_001150e0', '0x115190': 'FUN_00115190', '0x115218': 'FUN_00115218', '0x115474': 'FUN_00115474', '0x115f2c': 'FUN_00115f2c', '0x1160b4': 'FUN_001160b4', '0x11614c': 'FUN_0011614c', '0x1161a4': 'FUN_001161a4', '0x1162d8': 'FUN_001162d8', '0x1162f0': 'FUN_001162f0', '0x116540': 'FUN_00116540', '0x1165a8': 'FUN_001165a8', '0x1166b4': 'FUN_001166b4', '0x11671c': 'FUN_0011671c', '0x11708c': 'FUN_0011708c', '0x1172dc': 'FUN_001172dc', '0x117c60': 'FUN_00117c60', '0x117e24': 'FUN_00117e24', '0x119100': 'FUN_00119100', '0x119468': 'FUN_00119468', '0x119488': 'FUN_00119488', '0x11958c': 'FUN_0011958c', '0x119728': 'FUN_00119728', '0x1199f8': 'FUN_001199f8', '0x11beac': 'FUN_0011beac', '0x11c07c': 'FUN_0011c07c', '0x11ca40': 'FUN_0011ca40', '0x11cb60': 'FUN_0011cb60', '0x11cc84': 'FUN_0011cc84', '0x11d7c0': 'FUN_0011d7c0', '0x11efd0': 'FUN_0011efd0', '0x121350': 'FUN_00121350', '0x1246a0': 'FUN_001246a0', '0x1249d8': 'FUN_001249d8', '0x124d1c': 'FUN_00124d1c', '0x124d3c': 'FUN_00124d3c', '0x124d80': 'FUN_00124d80', '0x124ee0': 'FUN_00124ee0', '0x124f7c': 'FUN_00124f7c', '0x1251f4': 'FUN_001251f4', '0x125344': 'FUN_00125344', '0x125464': 'FUN_00125464', '0x125548': 'FUN_00125548', '0x125634': 'FUN_00125634', '0x125944': 'FUN_00125944', '0x125aa0': 'FUN_00125aa0', '0x125b7c': 'FUN_00125b7c', '0x125cd8': 'FUN_00125cd8', '0x125ddc': 'FUN_00125ddc', '0x125e84': 'FUN_00125e84', '0x1260c4': 'FUN_001260c4', '0x126384': 'FUN_00126384', '0x12653c': 'FUN_0012653c', '0x12680c': 'FUN_0012680c', '0x1269b4': 'FUN_001269b4', '0x1269f8': 'FUN_001269f8', '0x126a60': 'FUN_00126a60', '0x126ba8': 'FUN_00126ba8', '0x126ef4': 'FUN_00126ef4', '0x127030': 'FUN_00127030', '0x127040': 'FUN_00127040', '0x127294': 'FUN_00127294', '0x127764': 'FUN_00127764', '0x1277c0': 'FUN_001277c0', '0x1285d4': 'FUN_001285d4', '0x12865c': 'FUN_0012865c', '0x1286e4': 'FUN_001286e4', '0x12870c': 'FUN_0012870c', '0x12881c': 'FUN_0012881c', '0x1288e8': 'FUN_001288e8', '0x128964': 'FUN_00128964', '0x128cd0': 'FUN_00128cd0', '0x129610': 'FUN_00129610', '0x1296c4': 'FUN_001296c4', '0x12972c': 'FUN_0012972c', '0x1298b0': 'FUN_001298b0', '0x129b60': 'FUN_00129b60', '0x129be4': 'FUN_00129be4', '0x129c4c': 'FUN_00129c4c', '0x129ce8': 'FUN_00129ce8', '0x129d38': 'FUN_00129d38', '0x129e48': 'FUN_00129e48', '0x129ef0': 'FUN_00129ef0', '0x129f78': 'FUN_00129f78', '0x12a00c': 'FUN_0012a00c', '0x12a108': 'FUN_0012a108', '0x12a288': 'FUN_0012a288', '0x12a3fc': 'FUN_0012a3fc', '0x12a8e0': 'FUN_0012a8e0', '0x12b338': 'FUN_0012b338', '0x12b42c': 'FUN_0012b42c', '0x12b4ac': 'FUN_0012b4ac', '0x12b660': 'FUN_0012b660', '0x12b9b8': 'FUN_0012b9b8', '0x12bdd8': 'FUN_0012bdd8', '0x12bec0': 'FUN_0012bec0', '0x12c470': 'FUN_0012c470', '0x12c52c': 'FUN_0012c52c', '0x130e9c': 'FUN_00130e9c', '0x130ebc': 'FUN_00130ebc', '0x1322a4': 'FUN_001322a4', '0x132b60': 'FUN_00132b60', '0x132e04': 'FUN_00132e04', '0x1330c8': 'FUN_001330c8', '0x133324': 'FUN_00133324', '0x1333fc': 'FUN_001333fc', '0x13352c': 'FUN_0013352c', '0x13381c': 'FUN_0013381c', '0x1339cc': 'FUN_001339cc', '0x133a30': 'FUN_00133a30', '0x133b40': 'FUN_00133b40', '0x133bc0': 'FUN_00133bc0', '0x133c10': 'FUN_00133c10', '0x134244': 'FUN_00134244', '0x134370': 'FUN_00134370', '0x134a50': 'FUN_00134a50', '0x134c28': 'FUN_00134c28', '0x134e94': 'FUN_00134e94', '0x13545c': 'FUN_0013545c', '0x135464': 'FUN_00135464', '0x135584': 'FUN_00135584', '0x135950': 'FUN_00135950', '0x135a14': 'FUN_00135a14', '0x1360fc': 'FUN_001360fc', '0x13621c': 'FUN_0013621c', '0x136240': 'FUN_00136240', '0x136270': 'FUN_00136270', '0x136368': 'FUN_00136368', '0x1365f4': 'FUN_001365f4', '0x136e04': 'FUN_00136e04', '0x13705c': 'FUN_0013705c', '0x137590': 'FUN_00137590', '0x1375ec': 'FUN_001375ec', '0x138940': 'FUN_00138940', '0x138a7c': 'FUN_00138a7c', '0x13923c': 'FUN_0013923c', '0x139d08': 'FUN_00139d08', '0x139ea0': 'FUN_00139ea0', '0x139f24': 'FUN_00139f24', '0x139f2c': 'FUN_00139f2c', '0x139f84': 'FUN_00139f84', '0x139fb4': 'FUN_00139fb4', '0x139fdc': 'FUN_00139fdc', '0x13a00c': 'FUN_0013a00c', '0x13a078': 'FUN_0013a078', '0x13a1b8': 'FUN_0013a1b8', '0x13a24c': 'FUN_0013a24c', '0x13a2ec': 'FUN_0013a2ec', '0x13a440': 'FUN_0013a440', '0x13a63c': 'FUN_0013a63c', '0x143d24': 'FUN_00143d24', '0x1460cc': 'FUN_001460cc', '0x146160': 'FUN_00146160', '0x146250': 'FUN_00146250', '0x14630c': 'FUN_0014630c', '0x14637c': 'FUN_0014637c', '0x146404': 'FUN_00146404', '0x146484': 'FUN_00146484', '0x146b34': 'FUN_00146b34', '0x1470c4': 'FUN_001470c4', '0x147160': 'FUN_00147160', '0x1471ec': 'FUN_001471ec', '0x147a34': 'FUN_00147a34', '0x147af4': 'FUN_00147af4', '0x147b04': 'FUN_00147b04', '0x147b34': 'FUN_00147b34', '0x147b84': 'FUN_00147b84', '0x147bd4': 'FUN_00147bd4', '0x147c38': 'FUN_00147c38', '0x147cf8': 'FUN_00147cf8', '0x147d54': 'FUN_00147d54', '0x147dc8': 'FUN_00147dc8', '0x147dd8': 'FUN_00147dd8', '0x147dec': 'FUN_00147dec', '0x147f50': 'FUN_00147f50', '0x147f54': 'FUN_00147f54', '0x147fa0': 'FUN_00147fa0', '0x147fcc': 'FUN_00147fcc', '0x148028': 'FUN_00148028', '0x148090': 'FUN_00148090', '0x1480cc': 'FUN_001480cc', '0x148124': 'FUN_00148124', '0x1481c8': 'FUN_001481c8', '0x14829c': 'FUN_0014829c', '0x148420': 'FUN_00148420', '0x148578': 'FUN_00148578', '0x14869c': 'FUN_0014869c', '0x148714': 'FUN_00148714', '0x148724': 'FUN_00148724', '0x1487c4': 'FUN_001487c4', '0x148888': 'FUN_00148888', '0x148c5c': 'FUN_00148c5c', '0x148ca4': 'FUN_00148ca4', '0x148cac': 'FUN_00148cac', '0x148cb0': 'FUN_00148cb0', '0x148cb4': 'FUN_00148cb4', '0x148cb8': 'FUN_00148cb8', '0x148cd8': 'FUN_00148cd8', '0x148d98': 'FUN_00148d98', '0x148fc0': 'FUN_00148fc0', '0x148ff0': 'FUN_00148ff0', '0x1490ac': 'FUN_001490ac', '0x1490dc': 'FUN_001490dc', '0x14913c': 'FUN_0014913c', '0x149154': 'FUN_00149154', '0x149184': 'FUN_00149184', '0x1491a0': 'FUN_001491a0', '0x1491d0': 'FUN_001491d0', '0x14920c': 'FUN_0014920c', '0x14923c': 'FUN_0014923c', '0x149248': 'FUN_00149248', '0x149254': 'FUN_00149254', '0x149450': 'FUN_00149450', '0x149480': 'FUN_00149480', '0x1494c8': 'FUN_001494c8', '0x149680': 'FUN_00149680', '0x1496a8': 'FUN_001496a8', '0x1496d8': 'FUN_001496d8', '0x14970c': 'FUN_0014970c', '0x149758': 'FUN_00149758', '0x149768': 'FUN_00149768', '0x149834': 'FUN_00149834', '0x1498f8': 'FUN_001498f8', '0x1499ac': 'FUN_001499ac', '0x1499d4': 'FUN_001499d4', '0x149a14': 'FUN_00149a14', '0x149b04': 'FUN_00149b04', '0x149c18': 'FUN_00149c18', '0x149cac': 'FUN_00149cac', '0x149e84': 'FUN_00149e84', '0x149efc': 'FUN_00149efc', '0x14a3f4': 'FUN_0014a3f4', '0x14a810': 'FUN_0014a810', '0x14ada8': 'FUN_0014ada8', '0x14afcc': 'FUN_0014afcc', '0x14b098': 'FUN_0014b098', '0x14b0e4': 'FUN_0014b0e4', '0x14b1a4': 'FUN_0014b1a4', '0x14b384': 'FUN_0014b384', '0x14b8f0': 'FUN_0014b8f0', '0x14b918': 'FUN_0014b918', '0x14b974': 'FUN_0014b974', '0x14ba34': 'FUN_0014ba34', '0x14bae8': 'FUN_0014bae8', '0x14bb48': 'FUN_0014bb48', '0x14bba8': 'FUN_0014bba8', '0x14bc08': 'FUN_0014bc08', '0x14bcf8': 'FUN_0014bcf8', '0x14bd88': 'FUN_0014bd88', '0x14be84': 'FUN_0014be84', '0x14bfe4': 'FUN_0014bfe4', '0x14bff4': 'FUN_0014bff4', '0x14c408': 'FUN_0014c408', '0x14c4a4': 'FUN_0014c4a4', '0x14c604': 'FUN_0014c604', '0x14c738': 'FUN_0014c738', '0x259bb0': 'FUN_00259bb0', '0x259bf0': 'FUN_00259bf0', '0x259c10': 'FUN_00259c10', '0x259c20': 'FUN_00259c20', '0x259c40': 'FUN_00259c40', '0x259c90': 'FUN_00259c90', '0x259cc0': 'FUN_00259cc0', '0x259cd0': 'FUN_00259cd0', '0x259ce0': 'FUN_00259ce0', '0x259d10': 'FUN_00259d10', '0x259d40': 'FUN_00259d40', '0x259d70': 'FUN_00259d70', '0x259d80': 'FUN_00259d80', '0x259da0': 'FUN_00259da0', '0x259db0': 'FUN_00259db0', '0x259dd0': 'FUN_00259dd0', '0x259df0': 'FUN_00259df0', '0x259e10': 'FUN_00259e10', '0x259e40': 'FUN_00259e40', '0x259e50': 'FUN_00259e50', '0x259e60': 'FUN_00259e60', '0x259e70': 'FUN_00259e70', '0x259ed0': 'FUN_00259ed0', '0x259ee0': 'FUN_00259ee0', '0x259ef0': 'FUN_00259ef0', '0x259f20': 'FUN_00259f20', '0x259f60': 'FUN_00259f60', '0x259f90': 'FUN_00259f90', '0x259fc0': 'FUN_00259fc0', '0x259fd0': 'FUN_00259fd0', '0x25a000': 'FUN_0025a000', '0x25a030': 'FUN_0025a030', '0x25a090': 'FUN_0025a090', '0x25a0a0': 'FUN_0025a0a0', '0x25a0b0': 'FUN_0025a0b0', '0x25a0f0': 'FUN_0025a0f0', '0x25a100': 'FUN_0025a100', '0x25a110': 'FUN_0025a110', '0x25a120': 'FUN_0025a120', '0x25a140': 'FUN_0025a140', '0x25a190': 'FUN_0025a190', '0x25a1e0': 'FUN_0025a1e0', '0x25a1f0': 'FUN_0025a1f0', '0x25a210': 'FUN_0025a210', '0x25a220': 'FUN_0025a220', '0x25a250': 'FUN_0025a250', '0x25a260': 'FUN_0025a260', '0x25a2d0': 'FUN_0025a2d0', '0x25a2f0': 'FUN_0025a2f0', '0x25a310': 'FUN_0025a310', '0x25a450': 'FUN_0025a450', '0x25a460': 'FUN_0025a460', '0x25a480': 'FUN_0025a480', '0x25a490': 'FUN_0025a490', '0x25a4f0': 'FUN_0025a4f0', '0x25a530': 'FUN_0025a530', '0x25a580': 'FUN_0025a580', '0x25a5a0': 'FUN_0025a5a0', '0x25a5b0': 'FUN_0025a5b0', '0x25a5e0': 'FUN_0025a5e0', '0x25a5f0': 'FUN_0025a5f0', '0x25a610': 'FUN_0025a610', '0x25a650': 'FUN_0025a650', '0x25a670': 'FUN_0025a670', '0x25a690': 'FUN_0025a690', '0x25a6c0': 'FUN_0025a6c0', '0x25a6d0': 'FUN_0025a6d0', '0x25a6e0': 'FUN_0025a6e0', '0x25a700': 'FUN_0025a700', '0x25a710': 'FUN_0025a710', '0x25a760': 'FUN_0025a760', '0x25a790': 'FUN_0025a790', '0x25a7a0': 'FUN_0025a7a0', '0x25a820': 'FUN_0025a820', '0x25a860': 'FUN_0025a860', '0x25a870': 'FUN_0025a870', '0x25a890': 'FUN_0025a890', '0x25a8c0': 'FUN_0025a8c0', '0x25a8e0': 'FUN_0025a8e0', '0x25a8f0': 'FUN_0025a8f0', '0x25a900': 'FUN_0025a900', '0x25a930': 'FUN_0025a930', '0x25a940': 'FUN_0025a940', '0x25a980': 'FUN_0025a980', '0x25a9b0': 'FUN_0025a9b0', '0x25a9c0': 'FUN_0025a9c0', '0x25a9d0': 'FUN_0025a9d0', '0x25aa70': 'FUN_0025aa70', '0x25aa80': 'FUN_0025aa80', '0x25aab0': 'FUN_0025aab0', '0x25ab10': 'FUN_0025ab10', '0x25ab70': 'FUN_0025ab70', '0x25ab80': 'FUN_0025ab80', '0x25ab90': 'FUN_0025ab90', '0x25aba0': 'FUN_0025aba0', '0x25abb0': 'FUN_0025abb0', '0x25c908': 'FUN_0025c908', '0x25caf8': 'FUN_0025caf8', '0x25cd34': 'FUN_0025cd34', '0x260794': 'FUN_00260794', '0x261618': 'FUN_00261618', '0x26178c': 'FUN_0026178c', '0x261b00': 'FUN_00261b00', '0x263ca8': 'FUN_00263ca8', '0x263d40': 'FUN_00263d40', '0x263f1c': 'FUN_00263f1c', '0x2640e4': 'FUN_002640e4', '0x264214': 'FUN_00264214', '0x2642e0': 'FUN_002642e0', '0x264e48': 'FUN_00264e48', '0x264ee0': 'FUN_00264ee0', '0x264f3c': 'FUN_00264f3c', '0x264f78': 'FUN_00264f78', '0x264fb4': 'FUN_00264fb4', '0x264ff0': 'FUN_00264ff0', '0x265114': 'FUN_00265114', '0x2668a0': 'FUN_002668a0', '0x266938': 'FUN_00266938', '0x266e0c': 'FUN_00266e0c', '0x266f5c': 'FUN_00266f5c', '0x2677c8': 'FUN_002677c8', '0x2677d0': 'FUN_002677d0', '0x2678f0': 'FUN_002678f0', '0x267988': 'FUN_00267988', '0x267f98': 'FUN_00267f98', '0x26832c': 'FUN_0026832c', '0x26857c': 'FUN_0026857c', '0x2687cc': 'FUN_002687cc', '0x2688f4': 'FUN_002688f4', '0x2691b4': 'FUN_002691b4', '0x2693b4': 'FUN_002693b4', '0x2695a4': 'FUN_002695a4', '0x269900': 'FUN_00269900', '0x269e80': 'FUN_00269e80', '0x26a048': 'FUN_0026a048', '0x26b180': 'FUN_0026b180', '0x26bc44': 'FUN_0026bc44', '0x26bcdc': 'FUN_0026bcdc', '0x26c340': 'FUN_0026c340', '0x26c7f8': 'FUN_0026c7f8', '0x26dbbc': 'FUN_0026dbbc', '0x26dd0c': 'FUN_0026dd0c', '0x26e024': 'FUN_0026e024', '0x26ee50': 'FUN_0026ee50', '0x26f0fc': 'FUN_0026f0fc', '0x26fc60': 'FUN_0026fc60', '0x270308': 'FUN_00270308', '0x270464': 'FUN_00270464', '0x27530c': 'FUN_0027530c', '0x276f9c': 'FUN_00276f9c', '0x277150': 'FUN_00277150', '0x277550': 'FUN_00277550', '0x277618': 'FUN_00277618', '0x277d10': 'FUN_00277d10', '0x2789b4': 'FUN_002789b4', '0x27c5c0': 'FUN_0027c5c0', '0x27c808': 'FUN_0027c808', '0x27d030': 'FUN_0027d030', '0x281a60': 'FUN_00281a60', '0x281bcc': 'FUN_00281bcc', '0x282964': 'FUN_00282964', '0x2829c8': 'FUN_002829c8', '0x282b3c': 'FUN_00282b3c', '0x283258': 'FUN_00283258', '0x283584': 'FUN_00283584', '0x283610': 'FUN_00283610', '0x2837c8': 'FUN_002837c8', '0x2837d4': 'FUN_002837d4', '0x283bec': 'FUN_00283bec', '0x283d30': 'FUN_00283d30', '0x283e60': 'FUN_00283e60', '0x284088': 'FUN_00284088', '0x2880b0': 'FUN_002880b0', '0x288104': 'FUN_00288104', '0x288124': 'FUN_00288124', '0x288280': 'FUN_00288280', '0x288294': 'FUN_00288294', '0x288768': 'FUN_00288768', '0x289b38': 'FUN_00289b38', '0x28a1cc': 'FUN_0028a1cc', '0x28a33c': 'FUN_0028a33c', '0x28a460': 'FUN_0028a460', '0x28a5b8': 'FUN_0028a5b8', '0x2c789c': 'FUN_002c789c', '0x2c8354': 'FUN_002c8354', '0x2c84dc': 'FUN_002c84dc', '0x2c8574': 'FUN_002c8574', '0x2d69f0': 'FUN_002d69f0', '0x2d6fe8': 'FUN_002d6fe8', '0x2da128': 'FUN_002da128', '0x2da6fc': 'FUN_002da6fc', '0x2dab6c': 'FUN_002dab6c', '0x2dd68c': 'FUN_002dd68c', '0x2ddb6c': 'FUN_002ddb6c', '0x2ddce4': 'FUN_002ddce4', '0x2ddd08': 'FUN_002ddd08', '0x2ddd28': 'FUN_002ddd28', '0x2ddea0': 'FUN_002ddea0', '0x2ddedc': 'FUN_002ddedc', '0x2ddf50': 'FUN_002ddf50', '0x2de18c': 'FUN_002de18c', '0x2de4d0': 'FUN_002de4d0', '0x2de4e0': 'FUN_002de4e0', '0x2de52c': 'FUN_002de52c', '0x2de53c': 'FUN_002de53c', '0x2de6b4': 'FUN_002de6b4', '0x2de8e0': 'FUN_002de8e0', '0x2de988': 'FUN_002de988', '0x2df320': 'FUN_002df320', '0x2df348': 'FUN_002df348', '0x2df354': 'FUN_002df354', '0x2df430': 'FUN_002df430', '0x2e07dc': 'FUN_002e07dc', '0x2e1174': 'FUN_002e1174', '0x2e25cc': 'FUN_002e25cc', '0x2e27a8': 'FUN_002e27a8', '0x2e2834': 'FUN_002e2834', '0x2e288c': 'FUN_002e288c', '0x2e2ce4': 'FUN_002e2ce4', '0x2e3968': 'FUN_002e3968', '0x2e3d1c': 'FUN_002e3d1c', '0x2e3d8c': 'FUN_002e3d8c', '0x2e6650': 'FUN_002e6650', '0x2e6834': 'FUN_002e6834', '0x2e7c7c': 'FUN_002e7c7c', '0x2e7ccc': 'FUN_002e7ccc', '0x2e7ea8': 'FUN_002e7ea8', '0x2e8000': 'FUN_002e8000', '0x2e81b8': 'FUN_002e81b8', '0x2e81bc': 'FUN_002e81bc', '0x2e8394': 'FUN_002e8394', '0x2e89b0': 'FUN_002e89b0', '0x2e8b90': 'FUN_002e8b90', '0x2e8c0c': 'FUN_002e8c0c', '0x2e8d20': 'FUN_002e8d20', '0x2e9444': 'FUN_002e9444', '0x2e944c': 'FUN_002e944c', '0x2e9498': 'FUN_002e9498', '0x2e9590': 'FUN_002e9590', '0x2e96ac': 'FUN_002e96ac', '0x2e97e4': 'FUN_002e97e4', '0x2e98fc': 'FUN_002e98fc', '0x2e9a04': 'FUN_002e9a04', '0x2e9a50': 'FUN_002e9a50', '0x2e9b60': 'FUN_002e9b60', '0x2ea32c': 'FUN_002ea32c', '0x2f7e7c': 'FUN_002f7e7c', '0x2f80e0': 'FUN_002f80e0', '0x2f838c': 'FUN_002f838c', '0x2f8e20': 'FUN_002f8e20', '0x2f9da0': 'FUN_002f9da0', '0x2f9e04': 'FUN_002f9e04', '0x2f9ea4': 'FUN_002f9ea4', '0x2fd148': 'FUN_002fd148', '0x2fd1b8': 'FUN_002fd1b8', '0x2fd288': 'FUN_002fd288', '0x2fd2e0': 'FUN_002fd2e0', '0x2fd33c': 'FUN_002fd33c', '0x2fd350': 'FUN_002fd350', '0x2fd360': 'FUN_002fd360', '0x2fd370': 'FUN_002fd370', '0x2fd390': 'FUN_002fd390', '0x2fd398': 'FUN_002fd398', '0x2fd3a8': 'FUN_002fd3a8', '0x2fd3b8': 'FUN_002fd3b8', '0x2fd3d8': 'FUN_002fd3d8', '0x2fd3f8': 'FUN_002fd3f8', '0x2fd408': 'FUN_002fd408', '0x2fd418': 'FUN_002fd418', '0x2fe5e4': 'FUN_002fe5e4', '0x2fe73c': 'FUN_002fe73c', '0x2fe934': 'FUN_002fe934', '0x2fe9c8': 'FUN_002fe9c8', '0x2fead4': 'FUN_002fead4', '0x2fedb8': 'FUN_002fedb8', '0x2fef6c': 'FUN_002fef6c', '0x2ff12c': 'FUN_002ff12c', '0x2ff3e8': 'FUN_002ff3e8', '0x2ff4d8': 'FUN_002ff4d8', '0x2ff6b0': 'FUN_002ff6b0', '0x2ff700': 'FUN_002ff700', '0x2ff728': 'FUN_002ff728', '0x2ff790': 'FUN_002ff790', '0x2ff7a8': 'FUN_002ff7a8', '0x2ff7e0': 'FUN_002ff7e0', '0x2ff8e0': 'FUN_002ff8e0', '0x2ff8e8': 'FUN_002ff8e8', '0x2ff910': 'FUN_002ff910', '0x2ff938': 'FUN_002ff938', '0x304e68': 'FUN_00304e68', '0x304f1c': 'FUN_00304f1c', '0x307dec': 'FUN_00307dec', '0x338a1c': 'FUN_00338a1c', '0x361c58': 'FUN_00361c58', '0x365380': 'FUN_00365380', '0x366234': 'FUN_00366234', '0x3664f0': 'FUN_003664f0', '0x3665c0': 'FUN_003665c0', '0x3666c0': 'FUN_003666c0', '0x3666f8': 'FUN_003666f8', '0x3fd098': 'getenv', '0x3fd340': 'gethostbyname', '0x109a80': 'gethostbyname', '0x3fd0a8': 'getpagesize', '0x3fd0b0': 'getpid', '0x3fd078': 'gettid', '0x3fd0f0': 'getuid', '0x3fd0a0': 'inflate', '0x3fd3b8': 'inflateEnd', '0x3fd3d0': 'inflateInit2_', '0x3fd358': 'inotify_add_watch', '0x3fd158': 'inotify_init', '0x145b80': 'interpreter_wrap_double', '0x145de8': 'interpreter_wrap_double_bridge', '0x145a90': 'interpreter_wrap_float', '0x145d4c': 'interpreter_wrap_float_bridge', '0x145960': 'interpreter_wrap_int64_t', '0x145c70': 'interpreter_wrap_int64_t_bridge', '0x3fd2c0': 'isalpha', '0x3fd150': 'isspace', '0x10fd10': 'JNI_OnLoad', '0x3fd1e0': 'kill', '0x1272c8': 'local_get_elf_image', '0x3fd2f8': 'localtime', '0x3fd168': 'lseek', '0x3fd3a0': 'lseek64', '0x3fd108': 'malloc', '0x1276f0': 'map_local_get_image_name', '0x1272a8': 'map_local_is_readable', '0x1272b8': 'map_local_is_writable', '0x3fd210': 'memchr', '0x3fd2a0': 'memcmp', '0x3fd0d8': 'memcpy', '0x3fd058': 'memmove', '0x3fd300': 'memset', '0x3fd3d8': 'mkdir', '0x3fd170': 'mmap', '0x3fd3c0': 'mprotect', '0x3fd080': 'munmap', '0x3fd3a8': 'open', '0x109be0': 'open', '0x3fd328': 'opendir', '0x14827c': 'operator.delete', '0x148288': 'operator.delete[]', '0x148d08': 'operator.new', '0x148dd4': 'operator.new[]', '0x109ae0': 'operator.new[]', '0x3fd0d0': 'prctl', '0x3fd360': 'pread', '0x3fd038': 'pthread_create', '0x3fd180': 'pthread_detach', '0x3fd048': 'pthread_getspecific', '0x3fd208': 'pthread_key_create', '0x3fd0c8': 'pthread_key_delete', '0x3fd370': 'pthread_mutex_destroy', '0x109b60': 'pthread_mutex_destroy', '0x3fd390': 'pthread_mutex_init', '0x3fd378': 'pthread_mutex_lock', '0x3fd338': 'pthread_mutex_unlock', '0x3fd1f0': 'pthread_once', '0x3fd060': 'pthread_rwlock_init', '0x3fd050': 'pthread_rwlock_rdlock', '0x3fd120': 'pthread_rwlock_unlock', '0x3fd250': 'pthread_rwlock_wrlock', '0x3fd3f0': 'pthread_setspecific', '0x3fd0e0': 'puts', '0x3fd0b8': 'qsort', '0x3fd3f8': 'raise', '0x3fd228': 'rand', '0x3fd238': 'read', '0x3fd140': 'readdir', '0x3fd280': 'realloc', '0x3fd028': 'recv', '0x3fd110': 'remove', '0x12258c': 'reserve', '0x109ac0': 'reserve', '0x3fd138': 'select', '0x3fd188': 'send', '0x3fd260': 'setenv', '0x3fd2c8': 'sigaction', '0x3fd128': 'sigaltstack', '0x3fd040': 'sigemptyset', '0x3fd298': 'sigfillset', '0x3fd230': 'signal', '0x3fd068': 'snprintf', '0x3fd130': 'socket', '0x3fd348': 'sprintf', '0x3fd310': 'srand', '0x3fd2b8': 'sscanf', '0x3fd000': 'stpcpy', '0x3fd270': 'strcasecmp', '0x3fd1e8': 'strcat', '0x3fd3b0': 'strchr', '0x109c00': 'strchr', '0x3fd330': 'strcmp', '0x109a60': 'strcmp', '0x3fd008': 'strcpy', '0x3fd2e0': 'strdup', '0x11f6fc': 'string', '0x109b20': 'string', '0x3fd398': 'strlen', '0x109bc0': 'strlen', '0x3fd240': 'strncmp', '0x109840': 'strncmp', '0x3fd258': 'strncpy', '0x3fd1b0': 'strrchr', '0x3fd220': 'strstr', '0x109800': 'strstr', '0x3fd290': 'strtok', '0x3fd1a8': 'strtol', '0x3fd2e8': 'strtoull', '0x3fd070': 'syscall', '0x109bf0': 'thunk_EXT_FUN_0000e468', '0x109b10': 'thunk_EXT_FUN_000170c8', '0x109b30': 'thunk_EXT_FUN_0001f72c', '0x109b50': 'thunk_EXT_FUN_00027754', '0x109af0': 'thunk_EXT_FUN_00049e3c', '0x109c10': 'thunk_EXT_FUN_00049e74', '0x109ab0': 'thunk_EXT_FUN_00049e7c', '0x109a50': 'thunk_EXT_FUN_0004cd80', '0x109c50': 'thunk_EXT_FUN_0004cdf0', '0x1170c4': 'thunk_FUN_00121350', '0x3665d8': 'thunk_FUN_0025a460', '0x109a30': 'thunk_FUN_0025ab70', '0x2fd278': 'thunk_FUN_0025ab70', '0x2fd338': 'thunk_FUN_0025ab70', '0x109a70': 'thunk_FUN_002fd350', '0x109a90': 'thunk_FUN_002fd360', '0x109ad0': 'thunk_FUN_002fd370', '0x109b70': 'thunk_FUN_002fd390', '0x109b90': 'thunk_FUN_002fd398', '0x109bb0': 'thunk_FUN_002fd3a8', '0x109bd0': 'thunk_FUN_002fd3b8', '0x109c30': 'thunk_FUN_002fd3d8', '0x2fd3f0': 'thunk_FUN_002fd3f8', '0x109c90': 'thunk_FUN_002fd3f8', '0x109c70': 'thunk_FUN_002fd3f8', '0x109cb0': 'thunk_FUN_002fd408', '0x109cd0': 'thunk_FUN_002fd418', '0x3fd320': 'time', '0x3fd0f8': 'tolower', '0x3fd010': 'uncompress', '0x128570': 'unw_map_cursor_clear', '0x128538': 'unw_map_cursor_create', '0x1286dc': 'unw_map_cursor_destroy', '0x12857c': 'unw_map_cursor_get_next', '0x128564': 'unw_map_cursor_reset', '0x128340': 'unw_map_local_create', '0x1282e0': 'unw_map_local_cursor_get', '0x128430': 'unw_map_local_cursor_get_next', '0x128328': 'unw_map_local_cursor_valid', '0x1283d8': 'unw_map_local_destroy', '0x128524': 'unw_map_set', '0x3fd118': 'vsnprintf', '0x3fd218': 'wait', '0x3fd1c0': 'write', '0x116888': '~string' }


let dd = false;
function nya(module: Module) {
    if (dd) return
    dd = true

    let ddd = false
    Interceptor.attach(module.base.add(0x0fd10), {
        onEnter(args) {
            if (ddd) return
            ddd = true
            const pid = this.threadId
            console.log("start Stalker!");
            let atom = 1
            const hook = (addr, name) => {
                Interceptor.attach(ptr(addr), {
                    onEnter(args) {
                        if (this.returnAddress > module.base && this.returnAddress < module.base.add(module.size)) {
                            let targs = '';
                            if (name === 'dlsym') {
                                targs = `${args[0]} -> ${args[1].readCString()}`
                            }
                            logger.info({ tag: 'cal' }, `${'--'.repeat(atom)} ${name} ${targs}`)
                            atom += 1
                        }
                    },
                    onLeave(retval) {
                        if (this.returnAddress > module.base && this.returnAddress < module.base.add(module.size)) {
                            atom -= 1
                            logger.info({ tag: 'ret' }, `${'--'.repeat(atom)} ${name} ${retval}`)
                        }
                    },
                })
            }
            // for (const addr of Reflect.ownKeys(funct) as string[]) {
            //     const named = `${funct[addr]}`
            //     if (named.startsWith('str') || named.startsWith('pthread') || named.startsWith('operator.')) continue;
            //     if ('FUN_0010a5f8' === named || 'FUN_001460cc' === named || 'FUN_00146160' === named || 'FUN_00146404' === named || 'FUN_00146484' === named || 'FUN_001470c4' === named || 'FUN_0013a440' === named) continue
            //     try {
            //         hook(`${module.base.add(ptr(addr).sub(0x100000))}`, funct[addr])
            //     } catch (e) {
            //         // try {
            //         //     const expo = Module.findExportByName(null, funct[addr]);
            //         //     logger.info({ tag: 'expo' }, `${funct[addr]} ${expo}`)
            //         //     hook(`${expo}`, funct[addr])
            //         // } catch (ee) {
            //         //     logger.info({ tag: 'err' }, `${funct[addr]} ${Native.traceInModules(ptr(addr))}`)
            //         // }
            //     }
            // }
            // Stalker.exclude(Process.getModuleByName('libc.so'))
            Stalker.follow(pid, {
                events: {
                    call: true,
                    ret: false,
                    exec: false,
                    block: false,
                    compile: false
                },
                onReceive: (events) => {
                    // for (const event of Stalker.parse(events)) {
                    //     const { 0: type, 1: insn } = event as [string, NativePointer]
                    //     const addr = insn.sub(module.base)
                    //     if (funct[`${addr}`]) {
                    //         logger.info({ tag: type }, `${funct[`${addr}`]}: ${Native.traceInModules(insn)}`)
                    //     }
                    // }
                },
                transform: (iterator) => {
                    let insn = iterator.next();
                    do {
                        const addr = `${insn.address.sub(module.base).add(0x100000)}`
                        if (funct[addr]) {
                            logger.info({ tag: 'call' }, `${funct[addr]}: ${Native.traceInModules(insn.address)}`)
                        }
                        iterator.keep();
                    } while ((insn = iterator.next()) !== null);
                },

                onCallSummary: (summary) => {

                }
            });

        },
        // })

        // const sendNotify = Module.getExportByName('libdewaterFerdelanceFacinorous.so', '_Z10sendNotifyP7_JNIEnvP8_jobjectb')
        // Interceptor.attach(sendNotify, {
        //     onEnter({ 0: env, 1: arg, 2: bool },) {
        //         logger.info({ tag: 'sendNotify' }, `env: ${env} arg: ${arg} bool: ${bool}`)
        //     },
        // })
        // const getKey = Module.getExportByName('libdewaterFerdelanceFacinorous.so', '_Z6getKeyP7_JNIEnvPKcS2_S2_')
        // Interceptor.attach(getKey, {
        //     onEnter({ 0: env, 1: char1, 2: char2, 3: char3 },) {
        //         this.env = env
        //         logger.info({ tag: '#getKey' }, `env: ${env} char1: ${char1.readCString()} char2: ${char2.readCString()} char3: ${char3.readCString()}`)
        //     },
        //     onLeave(retval) {
        //         const NewStringUTF = JniTrace.asFunction(this.env, JniTrace.JNI.NewStringUTF)
        //         logger.info({ tag: '#getKey' }, `${Java.cast(retval, Classes.String)}`)
        //     },
        // })
        // const jstringToChar = Module.getExportByName('libdewaterFerdelanceFacinorous.so', '_Z13jstringToCharP7_JNIEnvP8_jstring')
        // Interceptor.attach(jstringToChar, {
        //     onEnter({ 0: env, 1: str },) {
        //         this.env = env
        //         logger.info({ tag: 'jstringToChar' }, `env: ${env} str: ${Java.cast(str, Classes.String)}`)
        //     },
        //     onLeave(retval) {
        //         logger.info({ tag: 'jstringToChar' }, `${retval.readCString()}`)
        //     },
        // })
        // const binaryToString = Module.getExportByName('libdewaterFerdelanceFacinorous.so', '_Z14binaryToStringNSt6__ndk112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEE')
        // Interceptor.attach(binaryToString, {
        //     onEnter({ 0: env, 1: str }) {
        //         this.str = str
        //         logger.info({ tag: 'binaryToString' }, `env: ${env} str: ${str}`)
        //     },
        //     onLeave(retval) {
        //         logger.info({ tag: 'binaryToString' }, `${new Std.String(this.str).disposeToString()}`)
        //     },
        // })

        // const { value: file } = Libc.fopen(Memory.allocUtf8String('/data/data/com.ntysxi.ninetysix/files/HANDLERz'), Memory.allocUtf8String('rb'));
        // const { value: fileno } = Libc.fileno(file);
        // const hm = Module.getExportByName('libdewaterFerdelanceFacinorous.so', '_ZN10MainLooper14handle_messageEiiPv');
        // const fhm = new NativeFunction(hm, 'int', ['int', 'int', 'pointer']);
        // console.log(fileno);
        // console.log(fhm(fileno, 0, ptr(0x0)))
    });
}

Native.Inject.afterInitArrayModule((module) => {
    if (module.name === 'libshell-super.artttistck.popup.aqsduqds.so') {
        logger.info({ tag: 'nya' }, 'nya')
        nya(module)
    }
});