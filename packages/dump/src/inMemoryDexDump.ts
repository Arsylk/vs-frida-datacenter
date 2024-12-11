import { hook } from '@clockwork/hooks'
import { logger } from '@clockwork/logging';
import { getSelfFiles } from '@clockwork/native';

function hookInMemoryDexDump() {

    hook(Classes.InMemoryDexClassLoader, '$init', {
        predicate: (_, i) => i === 0, 
        before(_method, buffer, classLoader) {
            const path = `${getSelfFiles()}/classes_${this.$h}`
            logger.info({tag: 'inmemory'}, `saving ${path} ...`)
            const remaining = buffer.remaining()
            const uint8s = new Uint8Array(remaining)
            for (let i = 0; i < remaining; i += 1) {
                uint8s[i] = buffer.get()
            }
            //@ts-ignore
            File.writeAllBytes(path, uint8s)
        } 
    })
}

export { hookInMemoryDexDump }
