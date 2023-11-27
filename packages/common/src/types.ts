type Returnable = (...args: any) => any;
type ReturnOptional<T extends Returnable> = (this: ThisType<T>, ...args: Parameters<T>) => ReturnType<T> | undefined;
type OmitFirstArg<T> = T extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;

export { Returnable, ReturnOptional, OmitFirstArg };
