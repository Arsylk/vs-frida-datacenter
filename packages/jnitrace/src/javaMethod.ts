import { Text } from '@clockwork/common';

/**
 * Abstracts a Java method referenced in native code.
 */
class JavaMethod {
    #javaParams: string[] | null = null;
    #javaRet: string | null = null;
    public constructor(
        public readonly className: string,
        public readonly name: string,
        public readonly parameters: string[],
        public readonly returnType: string,
        public readonly isStatic: boolean,
    ) {}

    /**
     * Get the Java param types for the method.
     */

    public get javaParams(): string[] {
        return this.#javaParams ??= this.parameters.map(Text.toPrettyType);
    }

    /**
     * Get the Java return type of the method.
     */

    public get javaRet(): string {
        return this.#javaRet ??= Text.toPrettyType(this.returnType);
    }
}

export { JavaMethod };
