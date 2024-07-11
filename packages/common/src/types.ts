type Returnable = (...args: any) => any;
type ReturnOptional<T extends Returnable> = (
    this: ThisType<T>,
    ...args: Parameters<T>
) => ReturnType<T> | undefined;
type OmitFirstArg<T> = T extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;
type StructTypes = 'short' | 'int' | 'long' | 'string' | 'pointer';
type JavaArgument = any;
type JavaArguments = Variadic;

export type { Returnable, ReturnOptional, OmitFirstArg, StructTypes, JavaArgument, JavaArguments };
