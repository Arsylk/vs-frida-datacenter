import { JavaMethod } from "./javaMethod"
import { jclass, jMethodID, jobject } from "./jni"

enum JniInvokeMode {
    Normal = 0 ,
    Nonvirtual = 1,
    Static = 2,
    Constructor = 3,
}

type JniArgs = { env: NativePointer, clazz: jclass, obj?: jobject, methodID: jMethodID, }

interface JniInvokeCallback {
    tag: string
    name: string
    mode: JniInvokeMode
    java: JavaMethod 
    
}