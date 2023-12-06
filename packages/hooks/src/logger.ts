import { logger, Color } from '@clockwork/logging';
import { LoggerOptions } from './types.js';
import { OmitFirstArg } from '@clockwork/common/src/types.js';
import { Text } from '@clockwork/common'
const { black, gray, blue, green, cyan, dim, italic, bold, yellow } = Color.use();

const DEFAULT_LOGGER_OPTIONS: LoggerOptions = {
    spacing: '   ',
    arguments: true,
    return: true,
    multiline: true,
    short: false,
    call: true,
    hook: true,
    enable: true,
};

const HOOK_LOGGER = {
    mapMethod(config: LoggerOptions, name: string): string {
        return green(name);
    },

    mapClass(config: LoggerOptions, className: string): string {
        let type = Text.toPrettyType(className);
        let array = '';
        const index = type.indexOf('[')
        if (index !== -1) {
            array = dim(yellow(type.substring(index)))
            type = type.substring(0, index)
        }
        const splits: string[] = type.split('.');
        if (config.short) return cyan(splits[splits.length - 1]) + array;
        return splits.map(cyan).join('.') + array;
    },

    mapArgs(config: LoggerOptions, args: any[]): string {
        if (args.length === 0) return '';
        if (!config.arguments) return gray('...');
        const joinBy = config.multiline ? ', \n' : ', ';
        const joined = args.map((arg: any) => `${config.multiline ? config.spacing : ''}${arg}`).join(joinBy);

        return config.multiline ? `\n${joined}\n` : joined;
    },

    printHookClass(config: LoggerOptions, className: string) {
        if (!config.hook) return;

        let sb = '';
        sb += bold('Hooking');
        sb += ' ';
        sb += this.mapClass(config, className);

        logger.info(sb);
    },

    printHookMethod(config: LoggerOptions, methodName: string, argTypes: string[], returnType: string) {
        if (!config.hook) return;

        let sb = '';
        sb += black(dim('  >'));
        sb += this.mapMethod(config, methodName);
        sb += blue('(');
        sb += argTypes.map((argType) => this.mapClass(config, argType)).join(', ');
        sb += blue(')');
        sb += ': ';
        sb += this.mapClass(config, returnType);

        logger.info(sb);
    },

    printCall(
        config: LoggerOptions,
        className: string,
        methodName: string,
        argValues: any[],
        returnType: string,
        isReplaced: boolean = false,
    ) {
        if (!config.call) return;

        let sb: string = '';
        sb += dim(isReplaced ? italic('replace') : 'call');
        sb += ' ';
        sb += this.mapClass(config, className);
        sb += '::';
        sb += this.mapMethod(config, methodName);
        sb += blue('(');
        sb += this.mapArgs(config, argValues);
        sb += blue(')');
        sb += ': ';
        sb += this.mapClass(config, returnType);

        logger.info(sb);
    },

    printReturn(config: LoggerOptions, returnValue: any | undefined) {
        if (!config.return) return;
        if (returnValue === undefined) return;

        let sb = '';
        sb += dim('return');
        sb += ' ';
        sb += `${returnValue?.hasOwnProperty('toString') ? returnValue.toString() : returnValue}`;

        logger.info(sb);
    },
};

function getLogger(options?: Partial<LoggerOptions>): { [key in keyof typeof HOOK_LOGGER]: OmitFirstArg<(typeof HOOK_LOGGER)[key]> } {
    const opt = options ? { ...DEFAULT_LOGGER_OPTIONS, ...options } : DEFAULT_LOGGER_OPTIONS;
    return Object.assign(
        {},
        ...Object.entries(HOOK_LOGGER).map(([key, func]: [any, any]) => ({
            [key]: (...args: any[]) => func.call(HOOK_LOGGER, opt, ...args),
        })),
    );
}

export { getLogger };