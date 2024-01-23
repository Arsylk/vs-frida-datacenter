import { Classes, enumerateMembers, stacktrace } from '@clockwork/common';
import { hook } from '@clockwork/hooks';
import { logger, Color } from '@clockwork/logging';
import { ifKey } from '@clockwork/hooks/dist/addons';
const { gray } = Color.use();

Java.perform(() => {
    enumerateMembers(Classes.SharedPreferencesImpl, {
        onMatchMethod(clazz, member) {
            if (Classes.SharedPreferences.$ownMembers.includes(member)) {
                hook(clazz, member, {
                    replace: ifKey(function(key) {
                        switch (key) {
                            case 'AttributeNamespace':
                                logger.info(gray(stacktrace()))
                                return true
                        }
                    }),
                    logging: { multiline: false },
                    loggingPredicate(_, ...args) {
                        return `${args[0]}` === 'AttributeNamespace' 
                    },
                });
            }
        },
    });
    hook(Classes.URL, 'openConnection');
    hook(Classes.DexPathList, '$init');
});
