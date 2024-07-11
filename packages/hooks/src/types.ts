import type { JavaArgument } from '@clockwork/common';
import type { ReturnOptional } from '@clockwork/common/src/types';

type LoggerOptions = {
    spacing: string;
    arguments: boolean;
    return: boolean;
    multiline: boolean;
    short: boolean;
    call: boolean;
    hook: boolean;
    enable: boolean;
};

type HookParameters = {
    predicate?: MethodHookPredicate;
    before?: FridaBeforeMethod;
    replace?: FridaMethodReplacement;
    after?: FridaAfterMethod;
    logging?: Partial<LoggerOptions>;
    loggingPredicate?: LoggingPredicate;
};

type MethodOverload = {
    argumentTypes: { className: string }[];
    returnType: { className: string };
};

type MethodHookPredicate = (overload: MethodOverload, index: number) => boolean;

type LoggingPredicate = (this: Java.Wrapper, method: Java.Method, ...args: JavaArgument[]) => boolean;

type FridaMethodReplacement = (this: Java.Wrapper, method: Java.Method, ...args: any[]) => any;
type FridaMethodReplacementOptional = ReturnOptional<FridaMethodReplacement>;

type FridaBeforeMethod = (this: Java.Wrapper, method: Java.Method, ...args: any[]) => void;

type FridaAfterMethod = (this: Java.Wrapper, method: Java.Method, returnValue?: any, ...args: any[]) => void;

export type {
    LoggerOptions,
    HookParameters,
    MethodOverload,
    FridaMethodReplacement,
    FridaMethodReplacementOptional,
};
