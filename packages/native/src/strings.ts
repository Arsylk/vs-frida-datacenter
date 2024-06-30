import { Libc } from '@clockwork/common';
import { Color, logger } from '@clockwork/logging';
import { throws } from 'node:assert';
const { dim, green, red, italic, gray } = Color.use();

function strOneLine(ptr: NativePointer): string {
    return `${ptr.readCString()}`.replace(/\n/g, '\\n')
}

function hookStrstr(predicate: (ptr: NativePointer) => boolean) {
    const array: ('strstr' | 'strcasestr')[] = ['strstr', 'strcasestr'];
    for(const key of array) {
        const func = Libc[key]
        Interceptor.replace(
            func,
            new NativeCallback(
                function (haystack, needle) {
                    const ret = func(haystack, needle);

                    if (predicate(this.returnAddress)) {
                        const isFound = ret && !ret.isNull();
                        const strhay = gray(`"${strOneLine(haystack)}"`.slice(0, 100));
                        const strned = isFound ? `"${strOneLine(needle)}"` : gray(`"${strOneLine(needle)}"`.slice(0, 100));
                        logger.info({ tag: key }, `${strhay} ? ${strned} ${Process.getCurrentThreadId()}`);
                    }

                    return ret;
                },
                'pointer',
                ['pointer', 'pointer'],
            ),
        );
    };
}

function hookStrlen(predicate: (ptr: NativePointer) => boolean) {
    Interceptor.replace(
        Libc.strlen,
        new NativeCallback(function(s) {
            const ret = Libc.strlen(s)

            if (predicate(this.returnAddress)) {
                const strs = gray(`"${strOneLine(s)}"`)
                logger.info({tag: 'strlen'}, `${strs} # ${Color.number(ret)} ${DebugSymbol.fromAddress(this.returnAddress)}`)
            }

            return ret;
        }, 'int', ['pointer'])
    )
}

function hookStrcpy(predicate: (ptr: NativePointer) => boolean) {
    const array: ('stpcpy' | 'strcpy' )[] = ['stpcpy', 'strcpy'];
    for(const key of array) {
        const func = Libc[key]
        Interceptor.replace(
            func,
            new NativeCallback(
                function (dst, src) {
                    if (predicate(this.returnAddress)) {
                        const strdst = dim(`"${strOneLine(dst)}"`);
                        const strsrc = dim(`"${strOneLine(src)}"`);
                        logger.info({ tag: key }, `${strdst} | ${strsrc}`);
                    }

                    const ret = func(dst, src);
                    return ret;
                },
                'pointer',
                ['pointer', 'pointer'],
            ),
        );
    };
}

// hooking strcmp appears to kill the app regardless of what app it is ?
function hookStrcmp(predicate: (ptr: NativePointer) => boolean) {
    const array: ('strcmp' | 'strncmp')[] = ['strcmp', 'strncmp'];
    for(const key of array) {
        const func = Libc[key]
        Interceptor.replace(
            func,
            new NativeCallback(
                function (s1, s2) {
                    const ret = func(s1, s2);

                    if (predicate(this.returnAddress)) {
                        const strs1 = ret === 0 ? `"${strOneLine(s1)}"` : gray(`"${strOneLine(s1)}"`);
                        const strs2 = ret >= 0 ? `"${strOneLine(s2)}"` :  gray(`"${strOneLine(s2)}"`);
                        logger.info({ tag: key }, `${strs1} = ${strs2}`);
                    }

                    return ret;
                },
                'int',
                ['pointer', 'pointer'],
            ),
        );
    };
}

export { hookStrstr, hookStrlen, hookStrcmp, hookStrcpy }