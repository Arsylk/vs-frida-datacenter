function propMapper(key: string): string | undefined {
    if (key.includes('qemu')) return '';

    switch (key) {
        case 'ro.secure':
            return '1';
        case 'ro.debuggable':
            return '0';
        case 'ro.build.display.id':
            return 'SQ1D.220205.003';
        case 'ro.build.tags':
            return 'release-keys';
        case 'ro.build.flavor':
            return 'raven-release';
        case 'ro.product.model':
            return 'Raven';
        case 'ro.product.manufacturer':
        case 'ro.product.brand':
            return 'Xiaomi';
        case 'ro.hardware':
        case 'ro.product.board':
        case 'ro.board.platform':
            return 'sdm720';
        case 'gsm.version.baseband':
            return '4.0.2.c8-00047-0722+1520_40cbe21,4.0.2.c8-00047-0722_1520_40cbe21';
        // case 'ro.boot.qemu.gltransport.name':
        //     return 'n';
        case 'persist.sys.timezone':
            return '';
    }
}

function buildMapper(key: string): string | undefined {
    switch (key) {
        case 'MODEL':
            return 'Go 6 Pro';
        case 'BRAND':
        case 'MANUFACTURER':
        case 'SOC_MANUFACTURER':
            return 'Xiaomi';
        case 'DEVICE':
        case 'PRODUCT':
            return 'raven';
        case 'HARDWARE':
            return 'qcom'
        case 'BOARD':
            return 'sdm720';
        case 'FINGERPRINT':
            return 'Xiaomi/raven/raven:12/SQ1D.220205.003/8069835:user/release-keys';
        case 'DISPLAY':
            return 'SQ1D.220205.003';
        case 'BOOTLOADER':
            return 'locked';
        case 'HOST':
            return 'HOST Co';
        case 'TAGS':
            return 'release-keys';
        case 'SERIAL':
            return 'deadbeef';
        case 'TYPE':
            return 'Production build';
        case 'USER':
            return 'LINUX General';
        case 'UNKNOWN':
            return 'KGTT General';
        case 'ANDROID_ID':
            return 'b6932a00c88d8b50';
        case 'IS_EMULATOR':
        case 'IS_USERDEBUG':
        case 'IS_DEBUGGABLE':
            return 'false';
    }
}

function systemMapper(key: string): string | undefined {
    switch (key) {
        case 'http.agent': 
            return `Mozilla/5.0 (Linux; Android 12; Go 6 Pro Build/SQ1D.220205.003) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.66.Mobile Safari/537.36`
    }
}


export { buildMapper, propMapper, systemMapper }