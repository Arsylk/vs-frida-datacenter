import { Classes } from '@clockwork/common';
import { hook } from '@clockwork/hooks';

Java.performNow(() => {
    hook(Classes.DexPathList, '$init');
});
