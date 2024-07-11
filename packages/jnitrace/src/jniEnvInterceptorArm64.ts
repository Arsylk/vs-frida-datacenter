import type { JavaMethod } from './javaMethod.js';
import { JNIEnvInterceptor } from './jniEnvInterceptor.js';

class JNIEnvInterceptorARM64 extends JNIEnvInterceptor {
    private stack: NativePointer = NULL;
    private stackIndex = 0;
    private grTop: NativePointer = NULL;
    private vrTop: NativePointer = NULL;
    private grOffs = 0;
    private grOffsIndex = 0;
    private vrOffs = 0;
    private vrOffsIndex = 0;

    protected setUpVaListArgExtract(vaList: NativePointer): void {
        const vrStart = 2;
        const grOffset = 3;
        const vrOffset = 4;
        this.stack = vaList.readPointer();
        this.stackIndex = 0;
        this.grTop = vaList.add(Process.pointerSize).readPointer();
        this.vrTop = vaList.add(Process.pointerSize * vrStart).readPointer();
        this.grOffs = vaList.add(Process.pointerSize * grOffset).readS32();
        this.grOffsIndex = 0;
        this.vrOffs = vaList.add(Process.pointerSize * grOffset + vrOffset).readS32();
        this.vrOffsIndex = 0;
    }

    protected extractVaListArgValue(method: JavaMethod, paramId: number): NativePointer {
        const MAX_VR_REG_NUM = 8;
        const VR_REG_SIZE = 2;
        const MAX_GR_REG_NUM = 4;
        let currentPtr = NULL;

        if (method.javaParams[paramId] === 'float' || method.javaParams[paramId] === 'double') {
            if (this.vrOffsIndex < MAX_VR_REG_NUM) {
                currentPtr = this.vrTop
                    .add(this.vrOffs)
                    .add(this.vrOffsIndex * Process.pointerSize * VR_REG_SIZE);

                this.vrOffsIndex++;
            } else {
                currentPtr = this.stack.add(this.stackIndex * Process.pointerSize);
                this.stackIndex++;
            }
        } else {
            if (this.grOffsIndex < MAX_GR_REG_NUM) {
                currentPtr = this.grTop.add(this.grOffs).add(this.grOffsIndex * Process.pointerSize);

                this.grOffsIndex++;
            } else {
                currentPtr = this.stack.add(this.stackIndex * Process.pointerSize);
                this.stackIndex++;
            }
        }

        return currentPtr;
    }

    protected resetVaListArgExtract(): void {
        this.stack = NULL;
        this.stackIndex = 0;
        this.grTop = NULL;
        this.vrTop = NULL;
        this.grOffs = 0;
        this.grOffsIndex = 0;
        this.vrOffs = 0;
        this.vrOffsIndex = 0;
    }
}

export { JNIEnvInterceptorARM64 };
