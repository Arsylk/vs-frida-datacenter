import { Types } from './convertTypes.js';

const SEMI_COLON_OFFSET = 1;

const primitiveTypes = ['B', 'S', 'I', 'J', 'F', 'D', 'C', 'Z', 'V'];

/**
 * Abstracts a Java method referenced in native code.
 */
class JavaMethod {
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
    public get params(): string[] {
        return this.parameters;
    }

    public get javaParams(): string[] {
        return this.parameters.map(Types.prettifySignature);
    }
    /**
     * Get the Java params as Frida native types.
     */
    public get fridaParams(): string[] {
        const fridaParams: string[] = [];
        this.parameters.forEach((p: string): void => {
            const nativeJType = Types.convertJTypeToNativeJType(p);
            const fridaType = Types.convertNativeJTypeToFridaType(nativeJType);

            fridaParams.push(fridaType);
        });
        return fridaParams;
    }

    /**
     * Get the Java return type of the method.
     */
    public get ret(): string {
        return this.returnType;
    }

    public get javaRet(): string {
        return Types.prettifySignature(this.returnType);
    }

    /**
     * Get the Java return type as a Frida native type.
     */
    public get fridaRet(): string {
        const jTypeRet = Types.convertJTypeToNativeJType(this.returnType);
        return Types.convertNativeJTypeToFridaType(jTypeRet);
    }
}

export { JavaMethod };
