type JniMethodArgTypeString =
    | 'double'
    | 'float'
    | 'int16'
    | 'int32'
    | 'int64'
    | 'int8'
    | 'pointer'
    | 'uint16'
    | 'uint8';
type JniMethodRetTypeString =
    | 'double'
    | 'float'
    | 'int16'
    | 'int32'
    | 'int64'
    | 'int8'
    | 'pointer'
    | 'uint16'
    | 'uint8'
    | 'void';
type JniMethodTypeMapper<T extends JniMethodRetTypeString> = T extends 'void'
    ? // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
      void
    : T extends 'uint8'
      ? boolean
      : T extends 'int8'
        ? number // byte
        : T extends 'uint16'
          ? number // char
          : T extends 'int16'
            ? number // short
            : T extends 'int32'
              ? number
              : T extends 'int64'
                ? Int64 // long ?
                : T extends 'float'
                  ? number
                  : T extends 'double'
                    ? NativePointer
                    : T extends 'pointer'
                      ? NativePointer
                      : never;

type JniMethodDefinition = {
    retType: JniMethodRetTypeString;
    argTypes: JniMethodArgTypeString[];
    name: string;
    offset: number;
};

type jMethodID = NativePointer;
type jFieldID = NativePointer;
type jclass = NativePointer;
type jobject = NativePointer;

const T = {
    double() {
        return 'double';
    },
    float() {
        return 'float';
    },
    int16() {
        return 'int16';
    },
    int32() {
        return 'int32';
    },
    int64() {
        return 'int64';
    },
    int8() {
        return 'int8';
    },
    pointer() {
        return 'pointer';
    },
    uint16() {
        return 'uint16';
    },
    uint8() {
        return 'uint8';
    },
    void() {
        return 'void';
    },
};

const JNI = {
    NULL0: {
        jni: { ret: 'NULL', args: [] },
        retType: 'void' as const,
        argTypes: [] as [] as [],
        name: 'NULL0',
        offset: 0,
    },
    NULL1: {
        jni: { ret: 'NULL', args: [] },
        retType: 'void' as const,
        argTypes: [] as [] as [],
        name: 'NULL1',
        offset: 1,
    },
    NULL2: {
        jni: { ret: 'NULL', args: [] },
        retType: 'void' as const,
        argTypes: [] as [] as [],
        name: 'NULL2',
        offset: 2,
    },
    NULL3: {
        jni: { ret: 'NULL', args: [] },
        retType: 'void' as const,
        argTypes: [] as [] as [],
        name: 'NULL3',
        offset: 3,
    },
    GetVersion: {
        jni: { ret: 'jint', args: ['JNIEnv*'] },
        retType: 'int32' as const,
        argTypes: ['pointer'] as ['pointer'] as ['pointer'],
        name: 'GetVersion',
        offset: 4,
    },
    DefineClass: {
        jni: {
            ret: 'jclass',
            args: ['JNIEnv*', 'char*', 'jobject', 'jbyte*', 'jsize'],
        },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'int32'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
            'int32',
        ] as ['pointer', 'pointer', 'pointer', 'pointer', 'int32'],
        name: 'DefineClass',
        offset: 5,
    },
    FindClass: {
        jni: { ret: 'jclass', args: ['JNIEnv*', 'char*'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer'] as ['pointer', 'pointer'] as ['pointer', 'pointer'],
        name: 'FindClass',
        offset: 6,
    },
    FromReflectedMethod: {
        jni: { ret: 'jmethodID', args: ['JNIEnv*', 'jobject'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer'] as ['pointer', 'pointer'] as ['pointer', 'pointer'],
        name: 'FromReflectedMethod',
        offset: 7,
    },
    FromReflectedField: {
        jni: { ret: 'jfieldID', args: ['JNIEnv*', 'jobject'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer'] as ['pointer', 'pointer'] as ['pointer', 'pointer'],
        name: 'FromReflectedField',
        offset: 8,
    },
    ToReflectedMethod: {
        jni: {
            ret: 'jobject',
            args: ['JNIEnv*', 'jclass', 'jmethodID', 'jboolean'],
        },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'uint8'] as [
            'pointer',
            'pointer',
            'pointer',
            'uint8',
        ] as ['pointer', 'pointer', 'pointer', 'uint8'],
        name: 'ToReflectedMethod',
        offset: 9,
    },
    GetSuperclass: {
        jni: { ret: 'jclass', args: ['JNIEnv*', 'jclass'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer'] as ['pointer', 'pointer'] as ['pointer', 'pointer'],
        name: 'GetSuperclass',
        offset: 10,
    },
    IsAssignableFrom: {
        jni: { ret: 'jboolean', args: ['JNIEnv*', 'jclass', 'jclass'] },
        retType: 'uint8' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'IsAssignableFrom',
        offset: 11,
    },
    ToReflectedField: {
        jni: {
            ret: 'jobject',
            args: ['JNIEnv*', 'jclass', 'jfieldID', 'jboolean'],
        },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'uint8'] as [
            'pointer',
            'pointer',
            'pointer',
            'uint8',
        ] as ['pointer', 'pointer', 'pointer', 'uint8'],
        name: 'ToReflectedField',
        offset: 12,
    },
    Throw: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jthrowable'] },
        retType: 'int32' as const,
        argTypes: ['pointer', 'pointer'] as ['pointer', 'pointer'] as ['pointer', 'pointer'],
        name: 'Throw',
        offset: 13,
    },
    ThrowNew: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jclass', 'char*'] },
        retType: 'int32' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'ThrowNew',
        offset: 14,
    },
    ExceptionOccurred: {
        jni: { ret: 'jthrowable', args: ['JNIEnv*'] },
        retType: 'pointer' as const,
        argTypes: ['pointer'] as ['pointer'] as ['pointer'],
        name: 'ExceptionOccurred',
        offset: 15,
    },
    ExceptionDescribe: {
        jni: { ret: 'void', args: ['JNIEnv*'] },
        retType: 'void' as const,
        argTypes: ['pointer'] as ['pointer'],
        name: 'ExceptionDescribe',
        offset: 16,
    },
    ExceptionClear: {
        jni: { ret: 'void', args: ['JNIEnv*'] },
        retType: 'void' as const,
        argTypes: ['pointer'] as ['pointer'],
        name: 'ExceptionClear',
        offset: 17,
    },
    FatalError: {
        jni: { ret: 'void', args: ['JNIEnv*', 'char*'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer'] as ['pointer', 'pointer'],
        name: 'FatalError',
        offset: 18,
    },
    PushLocalFrame: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jint'] },
        retType: 'int32' as const,
        argTypes: ['pointer', 'int32'] as ['pointer', 'int32'],
        name: 'PushLocalFrame',
        offset: 19,
    },
    PopLocalFrame: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'jobject'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer'] as ['pointer', 'pointer'],
        name: 'PopLocalFrame',
        offset: 20,
    },
    NewGlobalRef: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'jobject'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer'] as ['pointer', 'pointer'],
        name: 'NewGlobalRef',
        offset: 21,
    },
    DeleteGlobalRef: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobject'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer'] as ['pointer', 'pointer'],
        name: 'DeleteGlobalRef',
        offset: 22,
    },
    DeleteLocalRef: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobject'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer'] as ['pointer', 'pointer'],
        name: 'DeleteLocalRef',
        offset: 23,
    },
    IsSameObject: {
        jni: { ret: 'jboolean', args: ['JNIEnv*', 'jobject', 'jobject'] },
        retType: 'uint8' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'IsSameObject',
        offset: 24,
    },
    NewLocalRef: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'jobject'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer'] as ['pointer', 'pointer'],
        name: 'NewLocalRef',
        offset: 25,
    },
    EnsureLocalCapacity: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jint'] },
        retType: 'int32' as const,
        argTypes: ['pointer', 'int32'] as ['pointer', 'int32'],
        name: 'EnsureLocalCapacity',
        offset: 26,
    },
    AllocObject: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'jclass'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer'] as ['pointer', 'pointer'],
        name: 'AllocObject',
        offset: 27,
    },
    NewObject: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'jclass', 'jmethodID', '...'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'NewObject',
        offset: 28,
    },
    NewObjectV: {
        jni: {
            ret: 'jobject',
            args: ['JNIEnv*', 'jclass', 'jmethodID', 'va_list'],
        },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'NewObjectV',
        offset: 29,
    },
    NewObjectA: {
        jni: {
            ret: 'jobject',
            args: ['JNIEnv*', 'jclass', 'jmethodID', 'jvalue*'],
        },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'NewObjectA',
        offset: 30,
    },
    GetObjectClass: {
        jni: { ret: 'jclass', args: ['JNIEnv*', 'jobject'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer'] as ['pointer', 'pointer'],
        name: 'GetObjectClass',
        offset: 31,
    },
    IsInstanceOf: {
        jni: { ret: 'jboolean', args: ['JNIEnv*', 'jobject', 'jclass'] },
        retType: 'uint8' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'IsInstanceOf',
        offset: 32,
    },
    GetMethodID: {
        jni: { ret: 'jmethodID', args: ['JNIEnv*', 'jclass', 'char*', 'char*'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'GetMethodID',
        offset: 33,
    },
    CallObjectMethod: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'jobject', 'jmethodID', '...'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallObjectMethod',
        offset: 34,
    },
    CallObjectMethodV: {
        jni: {
            ret: 'jobject',
            args: ['JNIEnv*', 'jobject', 'jmethodID', 'va_list'],
        },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallObjectMethodV',
        offset: 35,
    },
    CallObjectMethodA: {
        jni: {
            ret: 'jobject',
            args: ['JNIEnv*', 'jobject', 'jmethodID', 'jvalue*'],
        },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallObjectMethodA',
        offset: 36,
    },
    CallBooleanMethod: {
        jni: { ret: 'jboolean', args: ['JNIEnv*', 'jobject', 'jmethodID', '...'] },
        retType: 'uint8' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallBooleanMethod',
        offset: 37,
    },
    CallBooleanMethodV: {
        jni: {
            ret: 'jboolean',
            args: ['JNIEnv*', 'jobject', 'jmethodID', 'va_list'],
        },
        retType: 'uint8' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallBooleanMethodV',
        offset: 38,
    },
    CallBooleanMethodA: {
        jni: {
            ret: 'jboolean',
            args: ['JNIEnv*', 'jobject', 'jmethodID', 'jvalue*'],
        },
        retType: 'uint8' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallBooleanMethodA',
        offset: 39,
    },
    CallByteMethod: {
        jni: { ret: 'jbyte', args: ['JNIEnv*', 'jobject', 'jmethodID', '...'] },
        retType: 'int8' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallByteMethod',
        offset: 40,
    },
    CallByteMethodV: {
        jni: { ret: 'jbyte', args: ['JNIEnv*', 'jobject', 'jmethodID', 'va_list'] },
        retType: 'int8' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallByteMethodV',
        offset: 41,
    },
    CallByteMethodA: {
        jni: { ret: 'jbyte', args: ['JNIEnv*', 'jobject', 'jmethodID', 'jvalue*'] },
        retType: 'int8' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallByteMethodA',
        offset: 42,
    },
    CallCharMethod: {
        jni: { ret: 'jchar', args: ['JNIEnv*', 'jobject', 'jmethodID', '...'] },
        retType: 'uint16' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallCharMethod',
        offset: 43,
    },
    CallCharMethodV: {
        jni: { ret: 'jchar', args: ['JNIEnv*', 'jobject', 'jmethodID', 'va_list'] },
        retType: 'uint16' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallCharMethodV',
        offset: 44,
    },
    CallCharMethodA: {
        jni: { ret: 'jchar', args: ['JNIEnv*', 'jobject', 'jmethodID', 'jvalue*'] },
        retType: 'uint16' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallCharMethodA',
        offset: 45,
    },
    CallShortMethod: {
        jni: { ret: 'jshort', args: ['JNIEnv*', 'jobject', 'jmethodID', '...'] },
        retType: 'int16' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallShortMethod',
        offset: 46,
    },
    CallShortMethodV: {
        jni: {
            ret: 'jshort',
            args: ['JNIEnv*', 'jobject', 'jmethodID', 'va_list'],
        },
        retType: 'int16' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallShortMethodV',
        offset: 47,
    },
    CallShortMethodA: {
        jni: {
            ret: 'jshort',
            args: ['JNIEnv*', 'jobject', 'jmethodID', 'jvalue*'],
        },
        retType: 'int16' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallShortMethodA',
        offset: 48,
    },
    CallIntMethod: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jobject', 'jmethodID', '...'] },
        retType: 'int32' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallIntMethod',
        offset: 49,
    },
    CallIntMethodV: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jobject', 'jmethodID', 'va_list'] },
        retType: 'int32' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallIntMethodV',
        offset: 50,
    },
    CallIntMethodA: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jobject', 'jmethodID', 'jvalue*'] },
        retType: 'int32' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallIntMethodA',
        offset: 51,
    },
    CallLongMethod: {
        jni: { ret: 'jlong', args: ['JNIEnv*', 'jobject', 'jmethodID', '...'] },
        retType: 'int64' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallLongMethod',
        offset: 52,
    },
    CallLongMethodV: {
        jni: { ret: 'jlong', args: ['JNIEnv*', 'jobject', 'jmethodID', 'va_list'] },
        retType: 'int64' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallLongMethodV',
        offset: 53,
    },
    CallLongMethodA: {
        jni: { ret: 'jlong', args: ['JNIEnv*', 'jobject', 'jmethodID', 'jvalue*'] },
        retType: 'int64' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallLongMethodA',
        offset: 54,
    },
    CallFloatMethod: {
        jni: { ret: 'jfloat', args: ['JNIEnv*', 'jobject', 'jmethodID', '...'] },
        retType: 'float' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallFloatMethod',
        offset: 55,
    },
    CallFloatMethodV: {
        jni: {
            ret: 'jfloat',
            args: ['JNIEnv*', 'jobject', 'jmethodID', 'va_list'],
        },
        retType: 'float' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallFloatMethodV',
        offset: 56,
    },
    CallFloatMethodA: {
        jni: {
            ret: 'jfloat',
            args: ['JNIEnv*', 'jobject', 'jmethodID', 'jvalue*'],
        },
        retType: 'float' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallFloatMethodA',
        offset: 57,
    },
    CallDoubleMethod: {
        jni: { ret: 'jdouble', args: ['JNIEnv*', 'jobject', 'jmethodID', '...'] },
        retType: 'double' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallDoubleMethod',
        offset: 58,
    },
    CallDoubleMethodV: {
        jni: {
            ret: 'jdouble',
            args: ['JNIEnv*', 'jobject', 'jmethodID', 'va_list'],
        },
        retType: 'double' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallDoubleMethodV',
        offset: 59,
    },
    CallDoubleMethodA: {
        jni: {
            ret: 'jdouble',
            args: ['JNIEnv*', 'jobject', 'jmethodID', 'jvalue*'],
        },
        retType: 'double' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallDoubleMethodA',
        offset: 60,
    },
    CallVoidMethod: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobject', 'jmethodID', '...'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallVoidMethod',
        offset: 61,
    },
    CallVoidMethodV: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobject', 'jmethodID', 'va_list'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallVoidMethodV',
        offset: 62,
    },
    CallVoidMethodA: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobject', 'jmethodID', 'jvalue*'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallVoidMethodA',
        offset: 63,
    },
    CallNonvirtualObjectMethod: {
        jni: {
            ret: 'jobject',
            args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', '...'],
        },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallNonvirtualObjectMethod',
        offset: 64,
    },
    CallNonvirtualObjectMethodV: {
        jni: {
            ret: 'jobject',
            args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'va_list'],
        },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallNonvirtualObjectMethodV',
        offset: 65,
    },
    CallNonvirtualObjectMethodA: {
        jni: {
            ret: 'jobject',
            args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'jvalue*'],
        },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallNonvirtualObjectMethodA',
        offset: 66,
    },
    CallNonvirtualBooleanMethod: {
        jni: {
            ret: 'jboolean',
            args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', '...'],
        },
        retType: 'uint8' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallNonvirtualBooleanMethod',
        offset: 67,
    },
    CallNonvirtualBooleanMethodV: {
        jni: {
            ret: 'jboolean',
            args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'va_list'],
        },
        retType: 'uint8' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallNonvirtualBooleanMethodV',
        offset: 68,
    },
    CallNonvirtualBooleanMethodA: {
        jni: {
            ret: 'jboolean',
            args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'jvalue*'],
        },
        retType: 'uint8' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallNonvirtualBooleanMethodA',
        offset: 69,
    },
    CallNonvirtualByteMethod: {
        jni: {
            ret: 'jbyte',
            args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', '...'],
        },
        retType: 'int8' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallNonvirtualByteMethod',
        offset: 70,
    },
    CallNonvirtualByteMethodV: {
        jni: {
            ret: 'jbyte',
            args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'va_list'],
        },
        retType: 'int8' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallNonvirtualByteMethodV',
        offset: 71,
    },
    CallNonvirtualByteMethodA: {
        jni: {
            ret: 'jbyte',
            args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'jvalue*'],
        },
        retType: 'int8' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallNonvirtualByteMethodA',
        offset: 72,
    },
    CallNonvirtualCharMethod: {
        jni: {
            ret: 'jchar',
            args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', '...'],
        },
        retType: 'uint16' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallNonvirtualCharMethod',
        offset: 73,
    },
    CallNonvirtualCharMethodV: {
        jni: {
            ret: 'jchar',
            args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'va_list'],
        },
        retType: 'uint16' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallNonvirtualCharMethodV',
        offset: 74,
    },
    CallNonvirtualCharMethodA: {
        jni: {
            ret: 'jchar',
            args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'jvalue*'],
        },
        retType: 'uint16' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallNonvirtualCharMethodA',
        offset: 75,
    },
    CallNonvirtualShortMethod: {
        jni: {
            ret: 'jshort',
            args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', '...'],
        },
        retType: 'int16' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallNonvirtualShortMethod',
        offset: 76,
    },
    CallNonvirtualShortMethodV: {
        jni: {
            ret: 'jshort',
            args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'va_list'],
        },
        retType: 'int16' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallNonvirtualShortMethodV',
        offset: 77,
    },
    CallNonvirtualShortMethodA: {
        jni: {
            ret: 'jshort',
            args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'jvalue*'],
        },
        retType: 'int16' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallNonvirtualShortMethodA',
        offset: 78,
    },
    CallNonvirtualIntMethod: {
        jni: {
            ret: 'jint',
            args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', '...'],
        },
        retType: 'int32' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallNonvirtualIntMethod',
        offset: 79,
    },
    CallNonvirtualIntMethodV: {
        jni: {
            ret: 'jint',
            args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'va_list'],
        },
        retType: 'int32' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallNonvirtualIntMethodV',
        offset: 80,
    },
    CallNonvirtualIntMethodA: {
        jni: {
            ret: 'jint',
            args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'jvalue*'],
        },
        retType: 'int32' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallNonvirtualIntMethodA',
        offset: 81,
    },
    CallNonvirtualLongMethod: {
        jni: {
            ret: 'jlong',
            args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', '...'],
        },
        retType: 'int64' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallNonvirtualLongMethod',
        offset: 82,
    },
    CallNonvirtualLongMethodV: {
        jni: {
            ret: 'jlong',
            args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'va_list'],
        },
        retType: 'int64' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallNonvirtualLongMethodV',
        offset: 83,
    },
    CallNonvirtualLongMethodA: {
        jni: {
            ret: 'jlong',
            args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'jvalue*'],
        },
        retType: 'int64' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallNonvirtualLongMethodA',
        offset: 84,
    },
    CallNonvirtualFloatMethod: {
        jni: {
            ret: 'jfloat',
            args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', '...'],
        },
        retType: 'float' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallNonvirtualFloatMethod',
        offset: 85,
    },
    CallNonvirtualFloatMethodV: {
        jni: {
            ret: 'jfloat',
            args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'va_list'],
        },
        retType: 'float' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallNonvirtualFloatMethodV',
        offset: 86,
    },
    CallNonvirtualFloatMethodA: {
        jni: {
            ret: 'jfloat',
            args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'jvalue*'],
        },
        retType: 'float' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallNonvirtualFloatMethodA',
        offset: 87,
    },
    CallNonvirtualDoubleMethod: {
        jni: {
            ret: 'jdouble',
            args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', '...'],
        },
        retType: 'double' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallNonvirtualDoubleMethod',
        offset: 88,
    },
    CallNonvirtualDoubleMethodV: {
        jni: {
            ret: 'jdouble',
            args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'va_list'],
        },
        retType: 'double' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallNonvirtualDoubleMethodV',
        offset: 89,
    },
    CallNonvirtualDoubleMethodA: {
        jni: {
            ret: 'jdouble',
            args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'jvalue*'],
        },
        retType: 'double' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallNonvirtualDoubleMethodA',
        offset: 90,
    },
    CallNonvirtualVoidMethod: {
        jni: {
            ret: 'void',
            args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', '...'],
        },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallNonvirtualVoidMethod',
        offset: 91,
    },
    CallNonvirtualVoidMethodV: {
        jni: {
            ret: 'void',
            args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'va_list'],
        },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallNonvirtualVoidMethodV',
        offset: 92,
    },
    CallNonvirtualVoidMethodA: {
        jni: {
            ret: 'void',
            args: ['JNIEnv*', 'jobject', 'jclass', 'jmethodID', 'jvalue*'],
        },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallNonvirtualVoidMethodA',
        offset: 93,
    },
    GetFieldID: {
        jni: { ret: 'jfieldID', args: ['JNIEnv*', 'jclass', 'char*', 'char*'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'GetFieldID',
        offset: 94,
    },
    GetObjectField: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'jobject', 'jfieldID'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'GetObjectField',
        offset: 95,
    },
    GetBooleanField: {
        jni: { ret: 'jboolean', args: ['JNIEnv*', 'jobject', 'jfieldID'] },
        retType: 'uint8' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'GetBooleanField',
        offset: 96,
    },
    GetByteField: {
        jni: { ret: 'jbyte', args: ['JNIEnv*', 'jobject', 'jfieldID'] },
        retType: 'int8' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'GetByteField',
        offset: 97,
    },
    GetCharField: {
        jni: { ret: 'jchar', args: ['JNIEnv*', 'jobject', 'jfieldID'] },
        retType: 'uint16' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'GetCharField',
        offset: 98,
    },
    GetShortField: {
        jni: { ret: 'jshort', args: ['JNIEnv*', 'jobject', 'jfieldID'] },
        retType: 'int16' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'GetShortField',
        offset: 99,
    },
    GetIntField: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jobject', 'jfieldID'] },
        retType: 'int32' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'GetIntField',
        offset: 100,
    },
    GetLongField: {
        jni: { ret: 'jlong', args: ['JNIEnv*', 'jobject', 'jfieldID'] },
        retType: 'int64' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'GetLongField',
        offset: 101,
    },
    GetFloatField: {
        jni: { ret: 'jfloat', args: ['JNIEnv*', 'jobject', 'jfieldID'] },
        retType: 'float' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'GetFloatField',
        offset: 102,
    },
    GetDoubleField: {
        jni: { ret: 'jdouble', args: ['JNIEnv*', 'jobject', 'jfieldID'] },
        retType: 'double' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'GetDoubleField',
        offset: 103,
    },
    SetObjectField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobject', 'jfieldID', 'jobject'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'SetObjectField',
        offset: 104,
    },
    SetBooleanField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobject', 'jfieldID', 'jboolean'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'uint8'] as ['pointer', 'pointer', 'pointer', 'uint8'],
        name: 'SetBooleanField',
        offset: 105,
    },
    SetByteField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobject', 'jfieldID', 'jbyte'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'int8'] as ['pointer', 'pointer', 'pointer', 'int8'],
        name: 'SetByteField',
        offset: 106,
    },
    SetCharField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobject', 'jfieldID', 'jchar'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'uint16'] as ['pointer', 'pointer', 'pointer', 'uint16'],
        name: 'SetCharField',
        offset: 107,
    },
    SetShortField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobject', 'jfieldID', 'jshort'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'int16'] as ['pointer', 'pointer', 'pointer', 'int16'],
        name: 'SetShortField',
        offset: 108,
    },
    SetIntField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobject', 'jfieldID', 'jint'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'int32'] as ['pointer', 'pointer', 'pointer', 'int32'],
        name: 'SetIntField',
        offset: 109,
    },
    SetLongField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobject', 'jfieldID', 'jlong'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'int64'] as ['pointer', 'pointer', 'pointer', 'int64'],
        name: 'SetLongField',
        offset: 110,
    },
    SetFloatField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobject', 'jfieldID', 'jfloat'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'float'] as ['pointer', 'pointer', 'pointer', 'float'],
        name: 'SetFloatField',
        offset: 111,
    },
    SetDoubleField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobject', 'jfieldID', 'jdouble'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'double'] as ['pointer', 'pointer', 'pointer', 'double'],
        name: 'SetDoubleField',
        offset: 112,
    },
    GetStaticMethodID: {
        jni: { ret: 'jmethodID', args: ['JNIEnv*', 'jclass', 'char*', 'char*'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'GetStaticMethodID',
        offset: 113,
    },
    CallStaticObjectMethod: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'jclass', 'jmethodID', '...'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallStaticObjectMethod',
        offset: 114,
    },
    CallStaticObjectMethodV: {
        jni: {
            ret: 'jobject',
            args: ['JNIEnv*', 'jclass', 'jmethodID', 'va_list'],
        },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallStaticObjectMethodV',
        offset: 115,
    },
    CallStaticObjectMethodA: {
        jni: {
            ret: 'jobject',
            args: ['JNIEnv*', 'jclass', 'jmethodID', 'jvalue*'],
        },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallStaticObjectMethodA',
        offset: 116,
    },
    CallStaticBooleanMethod: {
        jni: { ret: 'jboolean', args: ['JNIEnv*', 'jclass', 'jmethodID', '...'] },
        retType: 'uint8' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallStaticBooleanMethod',
        offset: 117,
    },
    CallStaticBooleanMethodV: {
        jni: {
            ret: 'jboolean',
            args: ['JNIEnv*', 'jclass', 'jmethodID', 'va_list'],
        },
        retType: 'uint8' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallStaticBooleanMethodV',
        offset: 118,
    },
    CallStaticBooleanMethodA: {
        jni: {
            ret: 'jboolean',
            args: ['JNIEnv*', 'jclass', 'jmethodID', 'jvalue*'],
        },
        retType: 'uint8' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallStaticBooleanMethodA',
        offset: 119,
    },
    CallStaticByteMethod: {
        jni: { ret: 'jbyte', args: ['JNIEnv*', 'jclass', 'jmethodID', '...'] },
        retType: 'int8' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallStaticByteMethod',
        offset: 120,
    },
    CallStaticByteMethodV: {
        jni: { ret: 'jbyte', args: ['JNIEnv*', 'jclass', 'jmethodID', 'va_list'] },
        retType: 'int8' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallStaticByteMethodV',
        offset: 121,
    },
    CallStaticByteMethodA: {
        jni: { ret: 'jbyte', args: ['JNIEnv*', 'jclass', 'jmethodID', 'jvalue*'] },
        retType: 'int8' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallStaticByteMethodA',
        offset: 122,
    },
    CallStaticCharMethod: {
        jni: { ret: 'jchar', args: ['JNIEnv*', 'jclass', 'jmethodID', '...'] },
        retType: 'uint16' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallStaticCharMethod',
        offset: 123,
    },
    CallStaticCharMethodV: {
        jni: { ret: 'jchar', args: ['JNIEnv*', 'jclass', 'jmethodID', 'va_list'] },
        retType: 'uint16' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallStaticCharMethodV',
        offset: 124,
    },
    CallStaticCharMethodA: {
        jni: { ret: 'jchar', args: ['JNIEnv*', 'jclass', 'jmethodID', 'jvalue*'] },
        retType: 'uint16' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallStaticCharMethodA',
        offset: 125,
    },
    CallStaticShortMethod: {
        jni: { ret: 'jshort', args: ['JNIEnv*', 'jclass', 'jmethodID', '...'] },
        retType: 'int16' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallStaticShortMethod',
        offset: 126,
    },
    CallStaticShortMethodV: {
        jni: { ret: 'jshort', args: ['JNIEnv*', 'jclass', 'jmethodID', 'va_list'] },
        retType: 'int16' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallStaticShortMethodV',
        offset: 127,
    },
    CallStaticShortMethodA: {
        jni: { ret: 'jshort', args: ['JNIEnv*', 'jclass', 'jmethodID', 'jvalue*'] },
        retType: 'int16' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallStaticShortMethodA',
        offset: 128,
    },
    CallStaticIntMethod: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jclass', 'jmethodID', '...'] },
        retType: 'int32' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallStaticIntMethod',
        offset: 129,
    },
    CallStaticIntMethodV: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jclass', 'jmethodID', 'va_list'] },
        retType: 'int32' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallStaticIntMethodV',
        offset: 130,
    },
    CallStaticIntMethodA: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jclass', 'jmethodID', 'jvalue*'] },
        retType: 'int32' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallStaticIntMethodA',
        offset: 131,
    },
    CallStaticLongMethod: {
        jni: { ret: 'jlong', args: ['JNIEnv*', 'jclass', 'jmethodID', '...'] },
        retType: 'int64' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallStaticLongMethod',
        offset: 132,
    },
    CallStaticLongMethodV: {
        jni: { ret: 'jlong', args: ['JNIEnv*', 'jclass', 'jmethodID', 'va_list'] },
        retType: 'int64' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallStaticLongMethodV',
        offset: 133,
    },
    CallStaticLongMethodA: {
        jni: { ret: 'jlong', args: ['JNIEnv*', 'jclass', 'jmethodID', 'jvalue*'] },
        retType: 'int64' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallStaticLongMethodA',
        offset: 134,
    },
    CallStaticFloatMethod: {
        jni: { ret: 'jfloat', args: ['JNIEnv*', 'jclass', 'jmethodID', '...'] },
        retType: 'float' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallStaticFloatMethod',
        offset: 135,
    },
    CallStaticFloatMethodV: {
        jni: { ret: 'jfloat', args: ['JNIEnv*', 'jclass', 'jmethodID', 'va_list'] },
        retType: 'float' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallStaticFloatMethodV',
        offset: 136,
    },
    CallStaticFloatMethodA: {
        jni: { ret: 'jfloat', args: ['JNIEnv*', 'jclass', 'jmethodID', 'jvalue*'] },
        retType: 'float' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallStaticFloatMethodA',
        offset: 137,
    },
    CallStaticDoubleMethod: {
        jni: { ret: 'jdouble', args: ['JNIEnv*', 'jclass', 'jmethodID', '...'] },
        retType: 'double' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallStaticDoubleMethod',
        offset: 138,
    },
    CallStaticDoubleMethodV: {
        jni: {
            ret: 'jdouble',
            args: ['JNIEnv*', 'jclass', 'jmethodID', 'va_list'],
        },
        retType: 'double' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallStaticDoubleMethodV',
        offset: 139,
    },
    CallStaticDoubleMethodA: {
        jni: {
            ret: 'jdouble',
            args: ['JNIEnv*', 'jclass', 'jmethodID', 'jvalue*'],
        },
        retType: 'double' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallStaticDoubleMethodA',
        offset: 140,
    },
    CallStaticVoidMethod: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jclass', 'jmethodID', '...'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallStaticVoidMethod',
        offset: 141,
    },
    CallStaticVoidMethodV: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jclass', 'jmethodID', 'va_list'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallStaticVoidMethodV',
        offset: 142,
    },
    CallStaticVoidMethodA: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jclass', 'jmethodID', 'jvalue*'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'CallStaticVoidMethodA',
        offset: 143,
    },
    GetStaticFieldID: {
        jni: { ret: 'jfieldID', args: ['JNIEnv*', 'jclass', 'char*', 'char*'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'GetStaticFieldID',
        offset: 144,
    },
    GetStaticObjectField: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'jclass', 'jfieldID'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'GetStaticObjectField',
        offset: 145,
    },
    GetStaticBooleanField: {
        jni: { ret: 'jboolean', args: ['JNIEnv*', 'jclass', 'jfieldID'] },
        retType: 'uint8' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'GetStaticBooleanField',
        offset: 146,
    },
    GetStaticByteField: {
        jni: { ret: 'jbyte', args: ['JNIEnv*', 'jclass', 'jfieldID'] },
        retType: 'int8' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'GetStaticByteField',
        offset: 147,
    },
    GetStaticCharField: {
        jni: { ret: 'jchar', args: ['JNIEnv*', 'jclass', 'jfieldID'] },
        retType: 'uint16' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'GetStaticCharField',
        offset: 148,
    },
    GetStaticShortField: {
        jni: { ret: 'jshort', args: ['JNIEnv*', 'jclass', 'jfieldID'] },
        retType: 'int16' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'GetStaticShortField',
        offset: 149,
    },
    GetStaticIntField: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jclass', 'jfieldID'] },
        retType: 'int32' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'GetStaticIntField',
        offset: 150,
    },
    GetStaticLongField: {
        jni: { ret: 'jlong', args: ['JNIEnv*', 'jclass', 'jfieldID'] },
        retType: 'int64' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'GetStaticLongField',
        offset: 151,
    },
    GetStaticFloatField: {
        jni: { ret: 'jfloat', args: ['JNIEnv*', 'jclass', 'jfieldID'] },
        retType: 'float' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'GetStaticFloatField',
        offset: 152,
    },
    GetStaticDoubleField: {
        jni: { ret: 'jdouble', args: ['JNIEnv*', 'jclass', 'jfieldID'] },
        retType: 'double' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'GetStaticDoubleField',
        offset: 153,
    },
    SetStaticObjectField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jclass', 'jfieldID', 'jobject'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'pointer'] as [
            'pointer',
            'pointer',
            'pointer',
            'pointer',
        ],
        name: 'SetStaticObjectField',
        offset: 154,
    },
    SetStaticBooleanField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jclass', 'jfieldID', 'jboolean'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'uint8'] as ['pointer', 'pointer', 'pointer', 'uint8'],
        name: 'SetStaticBooleanField',
        offset: 155,
    },
    SetStaticByteField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jclass', 'jfieldID', 'jbyte'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'int8'] as ['pointer', 'pointer', 'pointer', 'int8'],
        name: 'SetStaticByteField',
        offset: 156,
    },
    SetStaticCharField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jclass', 'jfieldID', 'jchar'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'uint16'] as ['pointer', 'pointer', 'pointer', 'uint16'],
        name: 'SetStaticCharField',
        offset: 157,
    },
    SetStaticShortField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jclass', 'jfieldID', 'jshort'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'int16'] as ['pointer', 'pointer', 'pointer', 'int16'],
        name: 'SetStaticShortField',
        offset: 158,
    },
    SetStaticIntField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jclass', 'jfieldID', 'jint'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'int32'] as ['pointer', 'pointer', 'pointer', 'int32'],
        name: 'SetStaticIntField',
        offset: 159,
    },
    SetStaticLongField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jclass', 'jfieldID', 'jlong'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'int64'] as ['pointer', 'pointer', 'pointer', 'int64'],
        name: 'SetStaticLongField',
        offset: 160,
    },
    SetStaticFloatField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jclass', 'jfieldID', 'jfloat'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'float'] as ['pointer', 'pointer', 'pointer', 'float'],
        name: 'SetStaticFloatField',
        offset: 161,
    },
    SetStaticDoubleField: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jclass', 'jfieldID', 'jdouble'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'double'] as ['pointer', 'pointer', 'pointer', 'double'],
        name: 'SetStaticDoubleField',
        offset: 162,
    },
    NewString: {
        jni: { ret: 'jstring', args: ['JNIEnv*', 'jchar*', 'jsize'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'int32'] as ['pointer', 'pointer', 'int32'],
        name: 'NewString',
        offset: 163,
    },
    GetStringLength: {
        jni: { ret: 'jsize', args: ['JNIEnv*', 'jstring'] },
        retType: 'int32' as const,
        argTypes: ['pointer', 'pointer'] as ['pointer', 'pointer'],
        name: 'GetStringLength',
        offset: 164,
    },
    GetStringChars: {
        jni: { ret: 'jchar*', args: ['JNIEnv*', 'jstring', 'jboolean*'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'GetStringChars',
        offset: 165,
    },
    ReleaseStringChars: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jstring', 'jchar*'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'ReleaseStringChars',
        offset: 166,
    },
    NewStringUTF: {
        jni: { ret: 'jstring', args: ['JNIEnv*', 'char*'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer'] as ['pointer', 'pointer'],
        name: 'NewStringUTF',
        offset: 167,
    },
    GetStringUTFLength: {
        jni: { ret: 'jsize', args: ['JNIEnv*', 'jstring'] },
        retType: 'int32' as const,
        argTypes: ['pointer', 'pointer'] as ['pointer', 'pointer'],
        name: 'GetStringUTFLength',
        offset: 168,
    },
    GetStringUTFChars: {
        jni: { ret: 'char*', args: ['JNIEnv*', 'jstring', 'jboolean*'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'GetStringUTFChars',
        offset: 169,
    },
    ReleaseStringUTFChars: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jstring', 'char*'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'ReleaseStringUTFChars',
        offset: 170,
    },
    GetArrayLength: {
        jni: { ret: 'jsize', args: ['JNIEnv*', 'jarray'] },
        retType: 'int32' as const,
        argTypes: ['pointer', 'pointer'] as ['pointer', 'pointer'],
        name: 'GetArrayLength',
        offset: 171,
    },
    NewObjectArray: {
        jni: {
            ret: 'jobjectArray',
            args: ['JNIEnv*', 'jsize', 'jclass', 'jobject'],
        },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'int32', 'pointer', 'pointer'] as ['pointer', 'int32', 'pointer', 'pointer'],
        name: 'NewObjectArray',
        offset: 172,
    },
    GetObjectArrayElement: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'jobjectArray', 'jsize'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'int32'] as ['pointer', 'pointer', 'int32'],
        name: 'GetObjectArrayElement',
        offset: 173,
    },
    SetObjectArrayElement: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jobjectArray', 'jsize', 'jobject'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'int32', 'pointer'] as ['pointer', 'pointer', 'int32', 'pointer'],
        name: 'SetObjectArrayElement',
        offset: 174,
    },
    NewBooleanArray: {
        jni: { ret: 'jbooleanArray', args: ['JNIEnv*', 'jsize'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'int32'] as ['pointer', 'int32'],
        name: 'NewBooleanArray',
        offset: 175,
    },
    NewByteArray: {
        jni: { ret: 'jbyteArray', args: ['JNIEnv*', 'jsize'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'int32'] as ['pointer', 'int32'],
        name: 'NewByteArray',
        offset: 176,
    },
    NewCharArray: {
        jni: { ret: 'jcharArray', args: ['JNIEnv*', 'jsize'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'int32'] as ['pointer', 'int32'],
        name: 'NewCharArray',
        offset: 177,
    },
    NewShortArray: {
        jni: { ret: 'jshortArray', args: ['JNIEnv*', 'jsize'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'int32'] as ['pointer', 'int32'],
        name: 'NewShortArray',
        offset: 178,
    },
    NewIntArray: {
        jni: { ret: 'jintArray', args: ['JNIEnv*', 'jsize'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'int32'] as ['pointer', 'int32'],
        name: 'NewIntArray',
        offset: 179,
    },
    NewLongArray: {
        jni: { ret: 'jlongArray', args: ['JNIEnv*', 'jsize'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'int32'] as ['pointer', 'int32'],
        name: 'NewLongArray',
        offset: 180,
    },
    NewFloatArray: {
        jni: { ret: 'jfloatArray', args: ['JNIEnv*', 'jsize'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'int32'] as ['pointer', 'int32'],
        name: 'NewFloatArray',
        offset: 181,
    },
    NewDoubleArray: {
        jni: { ret: 'jdoubleArray', args: ['JNIEnv*', 'jsize'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'int32'] as ['pointer', 'int32'],
        name: 'NewDoubleArray',
        offset: 182,
    },
    GetBooleanArrayElements: {
        jni: { ret: 'jboolean*', args: ['JNIEnv*', 'jbooleanArray', 'jboolean*'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'GetBooleanArrayElements',
        offset: 183,
    },
    GetByteArrayElements: {
        jni: { ret: 'jbyte*', args: ['JNIEnv*', 'jbyteArray', 'jboolean*'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'GetByteArrayElements',
        offset: 184,
    },
    GetCharArrayElements: {
        jni: { ret: 'jchar*', args: ['JNIEnv*', 'jcharArray', 'jboolean*'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'GetCharArrayElements',
        offset: 185,
    },
    GetShortArrayElements: {
        jni: { ret: 'jshort*', args: ['JNIEnv*', 'jshortArray', 'jboolean*'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'GetShortArrayElements',
        offset: 186,
    },
    GetIntArrayElements: {
        jni: { ret: 'jint*', args: ['JNIEnv*', 'jintArray', 'jboolean*'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'GetIntArrayElements',
        offset: 187,
    },
    GetLongArrayElements: {
        jni: { ret: 'jlong*', args: ['JNIEnv*', 'jlongArray', 'jboolean*'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'GetLongArrayElements',
        offset: 188,
    },
    GetFloatArrayElements: {
        jni: { ret: 'jfloat*', args: ['JNIEnv*', 'jfloatArray', 'jboolean*'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'GetFloatArrayElements',
        offset: 189,
    },
    GetDoubleArrayElements: {
        jni: { ret: 'jdouble*', args: ['JNIEnv*', 'jdoubleArray', 'jboolean*'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'GetDoubleArrayElements',
        offset: 190,
    },
    ReleaseBooleanArrayElements: {
        jni: {
            ret: 'void',
            args: ['JNIEnv*', 'jbooleanArray', 'jboolean*', 'jint'],
        },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'int32'] as ['pointer', 'pointer', 'pointer', 'int32'],
        name: 'ReleaseBooleanArrayElements',
        offset: 191,
    },
    ReleaseByteArrayElements: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jbyteArray', 'jbyte*', 'jint'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'int32'] as ['pointer', 'pointer', 'pointer', 'int32'],
        name: 'ReleaseByteArrayElements',
        offset: 192,
    },
    ReleaseCharArrayElements: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jcharArray', 'jchar*', 'jint'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'int32'] as ['pointer', 'pointer', 'pointer', 'int32'],
        name: 'ReleaseCharArrayElements',
        offset: 193,
    },
    ReleaseShortArrayElements: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jshortArray', 'jshort*', 'jint'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'int32'] as ['pointer', 'pointer', 'pointer', 'int32'],
        name: 'ReleaseShortArrayElements',
        offset: 194,
    },
    ReleaseIntArrayElements: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jintArray', 'jint*', 'jint'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'int32'] as ['pointer', 'pointer', 'pointer', 'int32'],
        name: 'ReleaseIntArrayElements',
        offset: 195,
    },
    ReleaseLongArrayElements: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jlongArray', 'jlong*', 'jint'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'int32'] as ['pointer', 'pointer', 'pointer', 'int32'],
        name: 'ReleaseLongArrayElements',
        offset: 196,
    },
    ReleaseFloatArrayElements: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jfloatArray', 'jfloat*', 'jint'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'int32'] as ['pointer', 'pointer', 'pointer', 'int32'],
        name: 'ReleaseFloatArrayElements',
        offset: 197,
    },
    ReleaseDoubleArrayElements: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jdoubleArray', 'jdouble*', 'jint'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'int32'] as ['pointer', 'pointer', 'pointer', 'int32'],
        name: 'ReleaseDoubleArrayElements',
        offset: 198,
    },
    GetBooleanArrayRegion: {
        jni: {
            ret: 'void',
            args: ['JNIEnv*', 'jbooleanArray', 'jsize', 'jsize', 'jboolean*'],
        },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'] as [
            'pointer',
            'pointer',
            'int32',
            'int32',
            'pointer',
        ],
        name: 'GetBooleanArrayRegion',
        offset: 199,
    },
    GetByteArrayRegion: {
        jni: {
            ret: 'void',
            args: ['JNIEnv*', 'jbyteArray', 'jsize', 'jsize', 'jbyte*'],
        },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'] as [
            'pointer',
            'pointer',
            'int32',
            'int32',
            'pointer',
        ],
        name: 'GetByteArrayRegion',
        offset: 200,
    },
    GetCharArrayRegion: {
        jni: {
            ret: 'void',
            args: ['JNIEnv*', 'jcharArray', 'jsize', 'jsize', 'jchar*'],
        },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'] as [
            'pointer',
            'pointer',
            'int32',
            'int32',
            'pointer',
        ],
        name: 'GetCharArrayRegion',
        offset: 201,
    },
    GetShortArrayRegion: {
        jni: {
            ret: 'void',
            args: ['JNIEnv*', 'jshortArray', 'jsize', 'jsize', 'jshort*'],
        },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'] as [
            'pointer',
            'pointer',
            'int32',
            'int32',
            'pointer',
        ],
        name: 'GetShortArrayRegion',
        offset: 202,
    },
    GetIntArrayRegion: {
        jni: {
            ret: 'void',
            args: ['JNIEnv*', 'jintArray', 'jsize', 'jsize', 'jint*'],
        },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'] as [
            'pointer',
            'pointer',
            'int32',
            'int32',
            'pointer',
        ],
        name: 'GetIntArrayRegion',
        offset: 203,
    },
    GetLongArrayRegion: {
        jni: {
            ret: 'void',
            args: ['JNIEnv*', 'jlongArray', 'jsize', 'jsize', 'jlong*'],
        },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'] as [
            'pointer',
            'pointer',
            'int32',
            'int32',
            'pointer',
        ],
        name: 'GetLongArrayRegion',
        offset: 204,
    },
    GetFloatArrayRegion: {
        jni: {
            ret: 'void',
            args: ['JNIEnv*', 'jfloatArray', 'jsize', 'jsize', 'jfloat*'],
        },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'] as [
            'pointer',
            'pointer',
            'int32',
            'int32',
            'pointer',
        ],
        name: 'GetFloatArrayRegion',
        offset: 205,
    },
    GetDoubleArrayRegion: {
        jni: {
            ret: 'void',
            args: ['JNIEnv*', 'jdoubleArray', 'jsize', 'jsize', 'jdouble*'],
        },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'] as [
            'pointer',
            'pointer',
            'int32',
            'int32',
            'pointer',
        ],
        name: 'GetDoubleArrayRegion',
        offset: 206,
    },
    SetBooleanArrayRegion: {
        jni: {
            ret: 'void',
            args: ['JNIEnv*', 'jbooleanArray', 'jsize', 'jsize', 'jboolean*'],
        },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'] as [
            'pointer',
            'pointer',
            'int32',
            'int32',
            'pointer',
        ],
        name: 'SetBooleanArrayRegion',
        offset: 207,
    },
    SetByteArrayRegion: {
        jni: {
            ret: 'void',
            args: ['JNIEnv*', 'jbyteArray', 'jsize', 'jsize', 'jbyte*'],
        },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'] as [
            'pointer',
            'pointer',
            'int32',
            'int32',
            'pointer',
        ],
        name: 'SetByteArrayRegion',
        offset: 208,
    },
    SetCharArrayRegion: {
        jni: {
            ret: 'void',
            args: ['JNIEnv*', 'jcharArray', 'jsize', 'jsize', 'jchar*'],
        },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'] as [
            'pointer',
            'pointer',
            'int32',
            'int32',
            'pointer',
        ],
        name: 'SetCharArrayRegion',
        offset: 209,
    },
    SetShortArrayRegion: {
        jni: {
            ret: 'void',
            args: ['JNIEnv*', 'jshortArray', 'jsize', 'jsize', 'jshort*'],
        },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'] as [
            'pointer',
            'pointer',
            'int32',
            'int32',
            'pointer',
        ],
        name: 'SetShortArrayRegion',
        offset: 210,
    },
    SetIntArrayRegion: {
        jni: {
            ret: 'void',
            args: ['JNIEnv*', 'jintArray', 'jsize', 'jsize', 'jint*'],
        },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'] as [
            'pointer',
            'pointer',
            'int32',
            'int32',
            'pointer',
        ],
        name: 'SetIntArrayRegion',
        offset: 211,
    },
    SetLongArrayRegion: {
        jni: {
            ret: 'void',
            args: ['JNIEnv*', 'jlongArray', 'jsize', 'jsize', 'jlong*'],
        },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'] as [
            'pointer',
            'pointer',
            'int32',
            'int32',
            'pointer',
        ],
        name: 'SetLongArrayRegion',
        offset: 212,
    },
    SetFloatArrayRegion: {
        jni: {
            ret: 'void',
            args: ['JNIEnv*', 'jfloatArray', 'jsize', 'jsize', 'jfloat*'],
        },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'] as [
            'pointer',
            'pointer',
            'int32',
            'int32',
            'pointer',
        ],
        name: 'SetFloatArrayRegion',
        offset: 213,
    },
    SetDoubleArrayRegion: {
        jni: {
            ret: 'void',
            args: ['JNIEnv*', 'jdoubleArray', 'jsize', 'jsize', 'jdouble*'],
        },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'] as [
            'pointer',
            'pointer',
            'int32',
            'int32',
            'pointer',
        ],
        name: 'SetDoubleArrayRegion',
        offset: 214,
    },
    RegisterNatives: {
        jni: {
            ret: 'jint',
            args: ['JNIEnv*', 'jclass', 'JNINativeMethod*', 'jint'],
        },
        retType: 'int32' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'int32'] as ['pointer', 'pointer', 'pointer', 'int32'],
        name: 'RegisterNatives',
        offset: 215,
    },
    UnregisterNatives: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jclass'] },
        retType: 'int32' as const,
        argTypes: ['pointer', 'pointer'] as ['pointer', 'pointer'],
        name: 'UnregisterNatives',
        offset: 216,
    },
    MonitorEnter: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jobject'] },
        retType: 'int32' as const,
        argTypes: ['pointer', 'pointer'] as ['pointer', 'pointer'],
        name: 'MonitorEnter',
        offset: 217,
    },
    MonitorExit: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'jobject'] },
        retType: 'int32' as const,
        argTypes: ['pointer', 'pointer'] as ['pointer', 'pointer'],
        name: 'MonitorExit',
        offset: 218,
    },
    GetJavaVM: {
        jni: { ret: 'jint', args: ['JNIEnv*', 'JavaVM**'] },
        retType: 'int32' as const,
        argTypes: ['pointer', 'pointer'] as ['pointer', 'pointer'],
        name: 'GetJavaVM',
        offset: 219,
    },
    GetStringRegion: {
        jni: {
            ret: 'void',
            args: ['JNIEnv*', 'jstring', 'jsize', 'jsize', 'jchar*'],
        },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'] as [
            'pointer',
            'pointer',
            'int32',
            'int32',
            'pointer',
        ],
        name: 'GetStringRegion',
        offset: 220,
    },
    GetStringUTFRegion: {
        jni: {
            ret: 'void',
            args: ['JNIEnv*', 'jstring', 'jsize', 'jsize', 'char*'],
        },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'int32', 'int32', 'pointer'] as [
            'pointer',
            'pointer',
            'int32',
            'int32',
            'pointer',
        ],
        name: 'GetStringUTFRegion',
        offset: 221,
    },
    GetPrimitiveArrayCritical: {
        jni: { ret: 'void*', args: ['JNIEnv*', 'jarray', 'jboolean*'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'GetPrimitiveArrayCritical',
        offset: 222,
    },
    ReleasePrimitiveArrayCritical: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jarray', 'void*', 'jint'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer', 'int32'] as ['pointer', 'pointer', 'pointer', 'int32'],
        name: 'ReleasePrimitiveArrayCritical',
        offset: 223,
    },
    GetStringCritical: {
        jni: { ret: 'jchar*', args: ['JNIEnv*', 'jstring', 'jboolean*'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'GetStringCritical',
        offset: 224,
    },
    ReleaseStringCritical: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jstring', 'jchar*'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer', 'pointer'] as ['pointer', 'pointer', 'pointer'],
        name: 'ReleaseStringCritical',
        offset: 225,
    },
    NewWeakGlobalRef: {
        jni: { ret: 'jweak', args: ['JNIEnv*', 'jobject'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer'] as ['pointer', 'pointer'],
        name: 'NewWeakGlobalRef',
        offset: 226,
    },
    DeleteWeakGlobalRef: {
        jni: { ret: 'void', args: ['JNIEnv*', 'jweak'] },
        retType: 'void' as const,
        argTypes: ['pointer', 'pointer'] as ['pointer', 'pointer'],
        name: 'DeleteWeakGlobalRef',
        offset: 227,
    },
    mmptionCheck: {
        jni: { ret: 'jboolean', args: ['JNIEnv*'] },
        retType: 'uint8' as const,
        argTypes: ['pointer'] as ['pointer'],
        name: 'ExceptionCheck',
        offset: 228,
    },
    NewDirectByteBuffer: {
        jni: { ret: 'jobject', args: ['JNIEnv*', 'void*', 'jlong'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer', 'int64'] as ['pointer', 'pointer', 'int64'],
        name: 'NewDirectByteBuffer',
        offset: 229,
    },
    GetDirectBufferAddress: {
        jni: { ret: 'void*', args: ['JNIEnv*', 'jobject'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer'] as ['pointer', 'pointer'],
        name: 'GetDirectBufferAddress',
        offset: 230,
    },
    GetDirectBufferCapacity: {
        jni: { ret: 'jlong', args: ['JNIEnv*', 'jobject'] },
        retType: 'int64' as const,
        argTypes: ['pointer', 'pointer'] as ['pointer', 'pointer'],
        name: 'GetDirectBufferCapacity',
        offset: 231,
    },
    GetObjectRefType: {
        jni: { ret: 'jobjectRefType', args: ['JNIEnv*', 'jobject'] },
        retType: 'pointer' as const,
        argTypes: ['pointer', 'pointer'] as ['pointer', 'pointer'],
        name: 'GetObjectRefType',
        offset: 232,
    },
};

function convertToFrida(type: string): string {
    if (type.includes('*')) return 'pointer';
    if (type.endsWith('Array')) return 'pointer';
    switch (type) {
        case 'void':
            return 'void';
        case 'jboolean':
            return 'uint8';
        case 'jbyte':
            return 'int8';
        case 'jchar':
            return 'uint16';
        case 'jshort':
            return 'int16';
        case 'jint':
        case 'jsize':
            return 'int32';
        case 'jlong':
            return 'int64';
        case 'jfloat':
            return 'float';
        case 'jdouble':
            return 'double';
        case 'jthrowable':
        case 'jclass':
        case 'jstring':
        case 'jarray':
        case 'jweak':
        case 'jobject':
            return 'pointer';
        case 'jfieldID':
        case 'jmethodID':
        case 'jobjectRefType':
        case 'va_list':
        case '...':
            return 'pointer';
    }
    throw new Error(`convert: illegal type ${type}`);
}

function asFunction<T extends NativeFunctionReturnType, R extends [] | NativeFunctionArgumentType[]>(
    env: Java.Env,
    def: { offset: number; retType: T; argTypes: R },
) {
    const vaTable: NativePointer = env.readPointer();
    const ptrPos = vaTable.add(def.offset * Process.pointerSize);
    const ptr = ptrPos.readPointer();
    return new NativeFunction(ptr, def.retType, def.argTypes);
}

function asLocalRef<T>(ptr: NativePointer, fn: (ptr: NativePointer) => T): T | null {
    const env = Java.vm.tryGetEnv()?.handle;

    let ref: NativePointer | null = null;
    try {
        const NewLocalRef = asFunction(env, JNI.NewLocalRef);
        ref = NewLocalRef(env, ptr);
        return fn(ref);
    } catch (error) {
    } finally {
        if (ref) {
            const DeleteLocalRef = asFunction(env, JNI.DeleteLocalRef);
            DeleteLocalRef(env, ref);
            ref = null;
        }
    }
    return null;
}

export {
    JNI,
    asFunction,
    asLocalRef,
    type JniMethodDefinition,
    type jFieldID,
    type jMethodID,
    type jclass,
    type jobject,
};
