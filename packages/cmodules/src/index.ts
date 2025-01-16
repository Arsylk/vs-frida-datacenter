import _procmaps from './procmaps.c';

namespace CM {
    const procmaps = new CModule(_procmaps, {});
}

export { CM };
