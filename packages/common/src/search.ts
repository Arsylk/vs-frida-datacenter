import { logger } from '@clockwork/logging';

type BaseJavaWrapper<T extends Java.Members<T>> = Java.Wrapper<T>;
type BaseJavaMembers<T> = Java.Members<T>;
type Wrapper<T extends BaseJavaMembers<T> = {}> = BaseJavaWrapper<T> & {
    // raw name
    $n: string;
    // list members
    $m: string[];
    // native class model
    $l: { find(memeber: string): any; list(): string[] };
    // list all mebmers //? including parent classes
    $list(): string[];
    // get member //? including parent classes
    $find(): any | undefined;
    // has member //? including parent classes
    $has(): boolean;
    // super wrapper
    $s: Wrapper | undefined;
};
interface EnumerateMembersCallbacks {
    onMatchMethod?: (clazz: Wrapper, member: string, depth: number) => void;
    onMatchField?: (clazz: Wrapper, member: string, depth: number) => void;
    onComplete?: () => void;
}

function enumerateMembers(clazz: Java.Wrapper, callback: EnumerateMembersCallbacks) {
    let current: Wrapper | undefined = clazz as Wrapper;
    let depth = 0;
    while (current && current.$n !== 'java.lang.Object') {
        const model = current.$l;
        const members = model.list();

        for (const member of members) {
            const handle = model.find(member);
            switch (`${handle}`.charAt(0)) {
                case 'm': {
                    callback.onMatchMethod?.(current, member, depth);
                    break;
                }
                case 'f': {
                    callback.onMatchField?.(current, member, depth);
                    break;
                }
            }
        }

        current = current.$s;
        depth += 1;
    }

    callback.onComplete?.();
}

function findClass(className: string, ...loaders: Java.Wrapper[]): Java.Wrapper | null {
    try {
        const mLoaders = [...loaders, ...Java.enumerateClassLoadersSync()];
        for (const loader of mLoaders) {
            try {
                if (loader.loadClass(className)) {
                    const factory = Java.ClassFactory.get(loader);
                    const cls = factory.use(className);
                    return cls;
                }
            } catch (notFound) {}
        }
    } catch (err) {
        logger.error({ tag: 'findClass' }, JSON.stringify(err));
    }
    return null;
}

function getClass(className: string, ...loaders: Java.Wrapper[]): Java.Wrapper {
    const result = findClass(className, ...loaders);
    if (result) return result;
    throw Error(`class not found: ${className}`)
}

export { getClass, findClass, enumerateMembers };