import { hook } from '@clockwork/hooks';
import { logger } from '@clockwork/logging';
import { Text } from '@clockwork/common';
import { getSelfFiles } from '@clockwork/native';

function hookInMemoryDexDump() {
    hook(Classes.InMemoryDexClassLoader, '$init', {
        before(_method, buffer, classLoader) {
            const array = Reflect.has(buffer, 'length') ? buffer : [buffer];
            for (const buf of array) {
                const path = `${getSelfFiles()}/classesx_${buf.$h}.dex`;
                buf.position(0);
                const size = buf.remaining();
                logger.info({ tag: 'inmemory' }, `saving ${path} size: ${Text.toByteSize(size)} ...`);
                const rawarr: number[] = [];
                for (let i = 0; i < size; i += 1) rawarr.push(0);
                const bytes = Java.array('byte', rawarr);
                buf.get(bytes);
                buf.position(0);
                const uint8s = new Uint8Array(size);
                for (let i = 0; i < size; i += 1) uint8s[i] = bytes[i];

                //@ts-ignore
                File.writeAllBytes(path, uint8s);
            }
        },
    });
}

export { hookInMemoryDexDump };
