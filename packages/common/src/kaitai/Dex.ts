import { KaitaiStream } from 'kaitai-struct';

class Dex {
    ClassAccessFlags = Object.freeze({
        PUBLIC: 1,
        PRIVATE: 2,
        PROTECTED: 4,
        STATIC: 8,
        FINAL: 16,
        INTERFACE: 512,
        ABSTRACT: 1024,
        SYNTHETIC: 4096,
        ANNOTATION: 8192,
        ENUM: 16384,

        1: 'PUBLIC',
        2: 'PRIVATE',
        4: 'PROTECTED',
        8: 'STATIC',
        16: 'FINAL',
        512: 'INTERFACE',
        1024: 'ABSTRACT',
        4096: 'SYNTHETIC',
        8192: 'ANNOTATION',
        16384: 'ENUM',
    });

    //@ts-ignore
    header: HeaderItem;
    //@ts-ignore
    _m_stringIds: StringIdItem[];
    //@ts-ignore
    _m_methodIds: MethodIdItem[];
    //@ts-ignore
    _m_linkData: any;
    //@ts-ignore
    _m_map: any;
    //@ts-ignore
    _m_classDefs: any;
    //@ts-ignore
    _m_data: any;
    //@ts-ignore
    _m_typeIds: any;
    //@ts-ignore
    _m_protoIds: any;
    //@ts-ignore
    _m_fieldIds: any;

    constructor(public io: KaitaiStream, public parent: any, public root: any) {
        this._read();
    }

    _read() {
        this.header = new HeaderItem(this.io, this, this.root);
    }

    get stringIds() {
        if (this._m_stringIds !== undefined) return this._m_stringIds;
        var _pos = this.io.pos;
        this.io.seek(this.header.stringIdsOff);
        this._m_stringIds = [];
        for (var i = 0; i < this.header.stringIdsSize; i++) {
            this._m_stringIds.push(new StringIdItem(this.io, this, this.root));
        }
        this.io.seek(_pos);
        return this._m_stringIds;
    }

    get methodIds() {
        if (this._m_methodIds !== undefined) return this._m_methodIds;
        var _pos = this.io.pos;
        this.io.seek(this.header.methodIdsOff);
        this._m_methodIds = [];
        for (var i = 0; i < this.header.methodIdsSize; i++) {
            this._m_methodIds.push(new MethodIdItem(this.io, this, this.root));
        }
        this.io.seek(_pos);
        return this._m_methodIds;
    }

    get linkData() {
        if (this._m_linkData !== undefined) return this._m_linkData;
        var _pos = this.io.pos;
        this.io.seek(this.header.linkOff);
        this._m_linkData = this.io.readBytes(this.header.linkSize);
        this.io.seek(_pos);
        return this._m_linkData;
    }

    get map() {
        if (this._m_map !== undefined) return this._m_map;
        var _pos = this.io.pos;
        this.io.seek(this.header.mapOff);
        this._m_map = new MapList(this.io, this, this.root);
        this.io.seek(_pos);
        return this._m_map;
    }

    get classDefs() {
        if (this._m_classDefs !== undefined) return this._m_classDefs;
        var _pos = this.io.pos;
        this.io.seek(this.header.classDefsOff);
        this._m_classDefs = [];
        for (var i = 0; i < this.header.classDefsSize; i++) {
            this._m_classDefs.push(new ClassDefItem(this.io, this, this.root));
        }
        this.io.seek(_pos);
        return this._m_classDefs;
    }

    get data() {
        if (this._m_data !== undefined) return this._m_data;
        var _pos = this.io.pos;
        this.io.seek(this.header.dataOff);
        this._m_data = this.io.readBytes(this.header.dataSize);
        this.io.seek(_pos);
        return this._m_data;
    }

    get typeIds() {
        if (this._m_typeIds !== undefined) return this._m_typeIds;
        var _pos = this.io.pos;
        this.io.seek(this.header.typeIdsOff);
        this._m_typeIds = [];
        for (var i = 0; i < this.header.typeIdsSize; i++) {
            this._m_typeIds.push(new TypeIdItem(this.io, this, this.root));
        }
        this.io.seek(_pos);
        return this._m_typeIds;
    }

    get protoIds() {
        if (this._m_protoIds !== undefined) return this._m_protoIds;
        var _pos = this.io.pos;
        this.io.seek(this.header.protoIdsOff);
        this._m_protoIds = [];
        for (var i = 0; i < this.header.protoIdsSize; i++) {
            this._m_protoIds.push(new ProtoIdItem(this.io, this, this.root));
        }
        this.io.seek(_pos);
        return this._m_protoIds;
    }

    get fieldIds() {
        if (this._m_fieldIds !== undefined) return this._m_fieldIds;
        var _pos = this.io.pos;
        this.io.seek(this.header.fieldIdsOff);
        this._m_fieldIds = [];
        for (var i = 0; i < this.header.fieldIdsSize; i++) {
            this._m_fieldIds.push(new FieldIdItem(this.io, this, this.root));
        }
        this.io.seek(_pos);
        return this._m_fieldIds;
    }
}

class HeaderItem {
    EndianConstant = Object.freeze({
        ENDIAN_CONSTANT: 305419896,
        REVERSE_ENDIAN_CONSTANT: 2018915346,
        305419896: 'ENDIAN_CONSTANT',
        2018915346: 'REVERSE_ENDIAN_CONSTANT',
    });

    magic: Uint8Array = new Uint8Array();
    versionStr: string = '';
    checksum: number = -1;
    signature: Uint8Array = new Uint8Array();
    fileSize: number = -1;
    headerSize: number = -1;
    endianTag: number = -1;
    linkSize: number = -1;
    linkOff: number = -1;
    mapOff: number = -1;
    stringIdsSize: number = -1;
    stringIdsOff: number = -1;
    typeIdsSize: number = -1;
    typeIdsOff: number = -1;
    protoIdsSize: number = -1;
    protoIdsOff: number = -1;
    fieldIdsSize: number = -1;
    fieldIdsOff: number = -1;
    methodIdsSize: number = -1;
    methodIdsOff: number = -1;
    classDefsSize: number = -1;
    classDefsOff: number = -1;
    dataSize: number = -1;
    dataOff: number = -1;

    constructor(public io: KaitaiStream, public parent: any, public root: any) {
        this.root = root || this;

        this._read();
    }

    _read() {
        this.magic = this.io.readBytes(4);
        if (!(KaitaiStream.byteArrayCompare(this.magic, [100, 101, 120, 10]) == 0)) {
            throw new KaitaiStream.ValidationNotEqualError(new Uint8Array([100, 101, 120, 10]), this.magic);
        }
        this.versionStr = KaitaiStream.bytesToStr(KaitaiStream.bytesTerminate(this.io.readBytes(4), 0, false), 'utf-8');
        this.checksum = this.io.readU4le();
        this.signature = this.io.readBytes(20);
        this.fileSize = this.io.readU4le();
        this.headerSize = this.io.readU4le();
        this.endianTag = this.io.readU4le();
        this.linkSize = this.io.readU4le();
        this.linkOff = this.io.readU4le();
        this.mapOff = this.io.readU4le();
        this.stringIdsSize = this.io.readU4le();
        this.stringIdsOff = this.io.readU4le();
        this.typeIdsSize = this.io.readU4le();
        this.typeIdsOff = this.io.readU4le();
        this.protoIdsSize = this.io.readU4le();
        this.protoIdsOff = this.io.readU4le();
        this.fieldIdsSize = this.io.readU4le();
        this.fieldIdsOff = this.io.readU4le();
        this.methodIdsSize = this.io.readU4le();
        this.methodIdsOff = this.io.readU4le();
        this.classDefsSize = this.io.readU4le();
        this.classDefsOff = this.io.readU4le();
        this.dataSize = this.io.readU4le();
        this.dataOff = this.io.readU4le();
    }
}

class MapList {
    size: number = -1;
    list: MapItem[] = [];

    constructor(public io: KaitaiStream, public parent: any, public root: any) {
        this.root = root || this;

        this._read();
    }

    _read() {
        this.size = this.io.readU4le();
        this.list = [];
        for (let i = 0; i < this.size; i++) {
            this.list.push(new MapItem(this.io, this, this.root));
        }
    }
}
class EncodedValue {
    public static ValueTypeEnum = Object.freeze({
        BYTE: 0,
        SHORT: 2,
        CHAR: 3,
        INT: 4,
        LONG: 6,
        FLOAT: 16,
        DOUBLE: 17,
        METHOD_TYPE: 21,
        METHOD_HANDLE: 22,
        STRING: 23,
        TYPE: 24,
        FIELD: 25,
        METHOD: 26,
        ENUM: 27,
        ARRAY: 28,
        ANNOTATION: 29,
        NULL: 30,
        BOOLEAN: 31,

        0: 'BYTE',
        2: 'SHORT',
        3: 'CHAR',
        4: 'INT',
        6: 'LONG',
        16: 'FLOAT',
        17: 'DOUBLE',
        21: 'METHOD_TYPE',
        22: 'METHOD_HANDLE',
        23: 'STRING',
        24: 'TYPE',
        25: 'FIELD',
        26: 'METHOD',
        27: 'ENUM',
        28: 'ARRAY',
        29: 'ANNOTATION',
        30: 'NULL',
        31: 'BOOLEAN',
    });
    valueArg: number = -1;
    valueType: number = -1;
    value: any;

    constructor(public io: KaitaiStream, public parent: any, public root: any) {
        this.root = root || this;

        this._read();
    }

    _read() {
        this.valueArg = this.io.readBitsIntBe(3);
        this.valueType = this.io.readBitsIntBe(5);
        this.io.alignToByte();
        switch (this.valueType) {
            case EncodedValue.ValueTypeEnum.INT:
                this.value = this.io.readS4le();
                break;
            case EncodedValue.ValueTypeEnum.ANNOTATION:
                this.value = new EncodedAnnotation(this.io, this, this.root);
                break;
            case EncodedValue.ValueTypeEnum.LONG:
                this.value = this.io.readS8le();
                break;
            case EncodedValue.ValueTypeEnum.METHOD_HANDLE:
                this.value = this.io.readU4le();
                break;
            case EncodedValue.ValueTypeEnum.BYTE:
                this.value = this.io.readS1();
                break;
            case EncodedValue.ValueTypeEnum.ARRAY:
                this.value = new EncodedArray(this.io, this, this.root);
                break;
            case EncodedValue.ValueTypeEnum.METHOD_TYPE:
                this.value = this.io.readU4le();
                break;
            case EncodedValue.ValueTypeEnum.SHORT:
                this.value = this.io.readS2le();
                break;
            case EncodedValue.ValueTypeEnum.METHOD:
                this.value = this.io.readU4le();
                break;
            case EncodedValue.ValueTypeEnum.DOUBLE:
                this.value = this.io.readF8le();
                break;
            case EncodedValue.ValueTypeEnum.FLOAT:
                this.value = this.io.readF4le();
                break;
            case EncodedValue.ValueTypeEnum.TYPE:
                this.value = this.io.readU4le();
                break;
            case EncodedValue.ValueTypeEnum.ENUM:
                this.value = this.io.readU4le();
                break;
            case EncodedValue.ValueTypeEnum.FIELD:
                this.value = this.io.readU4le();
                break;
            case EncodedValue.ValueTypeEnum.STRING:
                this.value = this.io.readU4le();
                break;
            case EncodedValue.ValueTypeEnum.CHAR:
                this.value = this.io.readU2le();
                break;
        }
    }
}

class CallSiteIdItem {
    callSiteOff: number = -1;

    constructor(public io: KaitaiStream, public parent: any, public root: any) {
        this.root = root || this;

        this._read();
    }

    _read() {
        this.callSiteOff = this.io.readU4le();
    }
}

class MethodIdItem {
    classIdx: number = -1;
    protoIdx: number = -1;
    nameIdx: number = -1;
    _m_className: string | undefined;
    _m_protoDesc: string | undefined;
    _m_methodName: string | undefined;

    constructor(public io: KaitaiStream, public parent: any, public root: any) {
        this.root = root || this;

        this._read();
    }

    _read() {
        this.classIdx = this.io.readU2le();
        this.protoIdx = this.io.readU2le();
        this.nameIdx = this.io.readU4le();
    }

    get className(): String {
        if (this._m_className !== undefined) return this._m_className;
        this._m_className = this.root.typeIds[this.classIdx].typeName;
        return `${this._m_className}`;
    }

    get protoDesc(): String {
        if (this._m_protoDesc !== undefined) return this._m_protoDesc;
        this._m_protoDesc = this.root.protoIds[this.protoIdx].shortyDesc;
        return `${this._m_protoDesc}`;
    }

    get methodName(): String {
        if (this._m_methodName !== undefined) return this._m_methodName;
        this._m_methodName = this.root.stringIds[this.nameIdx].value.data;
        return `${this._m_methodName}`;
    }
}

class TypeItem {
    typeIdx: number = -1;
    _m_value: string | undefined;

    constructor(public io: KaitaiStream, public parent: any, public root: any) {
        this.root = root || this;

        this._read();
    }

    _read() {
        this.typeIdx = this.io.readU2le();
    }

    get value(): String {
        if (this._m_value !== undefined) return this._m_value;
        this._m_value = this.root.typeIds[this.typeIdx].typeName;
        return `${this._m_value}`;
    }
}

class TypeItemId {
    descriptorIdx: number = -1;
    _m_typeName: string | undefined;

    constructor(public io: KaitaiStream, public parent: any, public root: any) {
        this.root = root || this;

        this._read();
    }

    _read() {
        this.descriptorIdx = this.io.readU4le();
    }

    get typeName(): String {
        if (this._m_typeName !== undefined) return this._m_typeName;
        this._m_typeName = this.root.typeIds[this.descriptorIdx].typeName;
        return `${this._m_typeName}`;
    }
}

class EncodedField {
    //@ts-ignore
    fieldIdxDiff: VlqBase128Le;
    //@ts-ignore
    accessFlags: VlqBase128Le;

    constructor(public io: KaitaiStream, public parent: any, public root: any) {
        this.root = root || this;

        this._read();
    }

    _read() {
        this.fieldIdxDiff = new VlqBase128Le(this.io, this, null);
        this.accessFlags = new VlqBase128Le(this.io, this, null);
    }
}
class TypeIdItem {
    descriptorIdx: number = -1;
    _m_typeName: string | undefined;

    constructor(public io: KaitaiStream, public parent: any, public root: any) {
        this.root = root || this;

        this._read();
    }
    _read() {
        this.descriptorIdx = this.io.readU4le();
    }

    get typeName(): String {
        if (this._m_typeName !== undefined) return this._m_typeName;
        this._m_typeName = this.root.stringIds[this.descriptorIdx].value.data;
        return `${this._m_typeName}`;
    }
}

class EncodedArrayItem {
    descriptorIdx: number = -1;
    //@ts-ignore
    value: EncodedArray;

    constructor(public io: KaitaiStream, public parent: any, public root: any) {
        this.root = root || this;

        this._read();
    }
    _read() {
        this.value = new EncodedArray(this.io, this, this.root);
    }
}

class ClassDataItem {
    //@ts-ignore
    staticFieldsSize: VlqBase128Le;
    //@ts-ignore
    instanceFieldsSize: VlqBase128Le;
    //@ts-ignore
    directMethodsSize: VlqBase128Le;
    //@ts-ignore
    virtualMethodsSize: VlqBase128Le;
    staticFields: EncodedField[] = [];
    instanceFields: EncodedField[] = [];
    directMethods: any[] = [];
    virtualMethods: any[] = [];

    constructor(public io: KaitaiStream, public parent: any, public root: any) {
        this.root = root || this;

        this._read();
    }
    _read() {
        this.staticFieldsSize = new VlqBase128Le(this.io, this, null);
        this.instanceFieldsSize = new VlqBase128Le(this.io, this, null);
        this.directMethodsSize = new VlqBase128Le(this.io, this, null);
        this.virtualMethodsSize = new VlqBase128Le(this.io, this, null);
        this.staticFields = [];
        for (var i = 0; i < this.staticFieldsSize.value; i++) {
            this.staticFields.push(new EncodedField(this.io, this, this.root));
        }
        this.instanceFields = [];
        for (var i = 0; i < this.instanceFieldsSize.value; i++) {
            this.instanceFields.push(new EncodedField(this.io, this, this.root));
        }
        this.directMethods = [];
        for (var i = 0; i < this.directMethodsSize.value; i++) {
            this.directMethods.push(new EncodedMethod(this.io, this, this.root));
        }
        this.virtualMethods = [];
        for (var i = 0; i < this.virtualMethodsSize.value; i++) {
            this.virtualMethods.push(new EncodedMethod(this.io, this, this.root));
        }
    }
}

class FieldIdItem {
    classIdx: number = -1;
    typeIdx: number = -1;
    nameIdx: number = -1;
    _m_className: string | undefined;
    _m_typeName: string | undefined;
    _m_fieldName: string | undefined;

    constructor(public io: KaitaiStream, public parent: any, public root: any) {
        this.root = root || this;

        this._read();
    }

    _read() {
        this.classIdx = this.io.readU2le();
        this.typeIdx = this.io.readU2le();
        this.nameIdx = this.io.readU4le();
    }

    get className(): String {
        if (this._m_className !== undefined) return this._m_className;
        this._m_className = this.root.typeIds[this.classIdx].typeName;
        return `${this._m_className}`;
    }

    get typeName(): String {
        if (this._m_typeName !== undefined) return this._m_typeName;
        this._m_typeName = this.root.typeIds[this.typeIdx].typeName;
        return `${this._m_typeName}`;
    }

    get fieldName(): String {
        if (this._m_fieldName !== undefined) return this._m_fieldName;
        this._m_fieldName = this.root.stringIds[this.classIdx].value.data;
        return `${this._m_fieldName}`;
    }
}

class EncodedAnnotation {
    //@ts-ignore
    typeIdx: VlqBase128Le;
    //@ts-ignore
    size: VlqBase128Le;
    elements: AnnotationElement[] = [];

    constructor(public io: KaitaiStream, public parent: any, public root: any) {
        this.root = root || this;
        this._read();
    }

    _read() {
        this.typeIdx = new VlqBase128Le(this.io, this, null);
        this.size = new VlqBase128Le(this.io, this, null);
        this.elements = [];
        for (let i = 0; i < this.size.value; i++) {
            this.elements.push(new AnnotationElement(this.io, this, this.root));
        }
    }
}

class ClassDefItem {
    classIdx: number = -1;
    accessFlags: number = -1;
    superclassIdx: number = -1;
    interfacesOff: number = -1;
    sourceFileIdx: number = -1;
    annotationsOff: number = -1;
    classDataOff: number = -1;
    staticValuesOff: number = -1;
    _m_typeName: string | undefined;
    _m_classData: ClassDataItem | undefined;
    _m_staticValues: EncodedArrayItem | undefined;

    constructor(public io: KaitaiStream, public parent: any, public root: any) {
        this.root = root || this;
        this._read();
    }

    _read() {
        this.classIdx = this.io.readU4le();
        this.accessFlags = this.io.readU4le();
        this.superclassIdx = this.io.readU4le();
        this.interfacesOff = this.io.readU4le();
        this.sourceFileIdx = this.io.readU4le();
        this.annotationsOff = this.io.readU4le();
        this.classDataOff = this.io.readU4le();
        this.staticValuesOff = this.io.readU4le();
    }

    get typeName(): String {
        if (this._m_typeName !== undefined) return this._m_typeName;
        this._m_typeName = this.root.typeIds[this.classIdx].typeName;
        return `${this._m_typeName}`;
    }

    get classData(): ClassDataItem | undefined {
        if (this._m_classData !== undefined) return this._m_classData;

        if (this.classDataOff != 0) {
            var _pos = this.io.pos;
            this.io.seek(this.classDataOff);
            this._m_classData = new ClassDataItem(this.io, this, this.root);
            this.io.seek(_pos);
        }
        return this._m_classData;
    }

    get staticValues(): EncodedArrayItem | undefined {
        if (this._m_staticValues !== undefined) return this._m_staticValues;

        if (this.staticValuesOff != 0) {
            var _pos = this.io.pos;
            this.io.seek(this.staticValuesOff);
            this._m_staticValues = new EncodedArrayItem(this.io, this, this.root);
            this.io.seek(_pos);
        }
        return this._m_staticValues;
    }
}

class TypeList {
    size: number = -1;
    list: TypeItem[] = [];

    constructor(public io: KaitaiStream, public parent: any, public root: any) {
        this.root = root || this;
        this._read();
    }

    _read() {
        this.size = this.io.readU4le();
        this.list = [];
        for (let i = 0; i < this.size; i++) {
            this.list.push(new TypeItem(this.io, this, this.root));
        }
    }
}

class StringIdItem {
    stringDataOff: number = -1;
    _m_value: StringDataItem | undefined;

    constructor(public io: KaitaiStream, public parent: any, public root: any) {
        this.root = root || this;
        this._read();
    }

    _read() {
        this.stringDataOff = this.io.readU4le();
    }

    get value(): StringDataItem | undefined {
        if (this._m_value !== undefined) return this._m_value;
        let pos = this.io.pos;
        this.io.seek(this.stringDataOff);
        this._m_value = new StringDataItem(this.io, this, this.root);
        this.io.seek(pos);
        return this._m_value;
    }
}

class StringDataItem {
    //@ts-ignore
    utf16Size: any;
    data: string = '';

    constructor(public io: KaitaiStream, public parent: any, public root: any) {
        this.root = root || this;
        this._read();
    }

    _read() {
        this.utf16Size = new VlqBase128Le(this.io, this, null);
        this.data = KaitaiStream.bytesToStr(this.io.readBytes(this.utf16Size.value), 'utf-8');
    }
}

class ProtoIdItem {
    shortyIdx: number = -1;
    returnTypeIdx: number = -1;
    parametersOff: number = -1;
    _m_paramsTypes: TypeList | undefined;
    _m_returnType: string | undefined;
    _m_shortyDesc: string | undefined;

    constructor(public io: KaitaiStream, public parent: any, public root: any) {
        this.root = root || this;
        this._read();
    }

    _read() {
        this.shortyIdx = this.io.readU4le();
        this.returnTypeIdx = this.io.readU4le();
        this.parametersOff = this.io.readU4le();
    }

    get shortyDesc(): String {
        if (this._m_shortyDesc !== undefined) return this._m_shortyDesc;
        this._m_shortyDesc = this.root.stringIds[this.shortyIdx].value.date;
        return `${this._m_shortyDesc}`;
    }

    get paramsTypes(): TypeList | undefined {
        if (this._m_paramsTypes !== undefined) return this._m_paramsTypes;
        if (this.parametersOff != 0) {
            var io = this.root.io;
            var _pos = io.pos;
            io.seek(this.parametersOff);
            this._m_paramsTypes = new TypeList(io, this, this.root);
            io.seek(_pos);
        }
        return this._m_paramsTypes;
    }

    get returnType(): String {
        if (this._m_returnType !== undefined) return this._m_returnType;
        this._m_returnType = this.root.typeIds[this.returnTypeIdx].typeName;
        return `${this._m_returnType}`;
    }
}

class EncodedMethod {
    //@ts-ignore
    methodIdxDiff: VlqBase128Le;
    //@ts-ignore
    accessFlags: VlqBase128Le;
    //@ts-ignore
    codeOff: VlqBase128Le;

    constructor(public io: KaitaiStream, public parent: any, public root: any) {
        this.root = root || this;
        this._read();
    }
    _read() {
        this.methodIdxDiff = new VlqBase128Le(this.io, this, null);
        this.accessFlags = new VlqBase128Le(this.io, this, null);
        this.codeOff = new VlqBase128Le(this.io, this, null);
    }
}

class MapItem {
    public static MapItemType = Object.freeze({
        HEADER_ITEM: 0,
        STRING_ID_ITEM: 1,
        TYPE_ID_ITEM: 2,
        PROTO_ID_ITEM: 3,
        FIELD_ID_ITEM: 4,
        METHOD_ID_ITEM: 5,
        CLASS_DEF_ITEM: 6,
        CALL_SITE_ID_ITEM: 7,
        METHOD_HANDLE_ITEM: 8,
        MAP_LIST: 4096,
        TYPE_LIST: 4097,
        ANNOTATION_SET_REF_LIST: 4098,
        ANNOTATION_SET_ITEM: 4099,
        CLASS_DATA_ITEM: 8192,
        CODE_ITEM: 8193,
        STRING_DATA_ITEM: 8194,
        DEBUG_INFO_ITEM: 8195,
        ANNOTATION_ITEM: 8196,
        ENCODED_ARRAY_ITEM: 8197,
        ANNOTATIONS_DIRECTORY_ITEM: 8198,

        0: 'HEADER_ITEM',
        1: 'STRING_ID_ITEM',
        2: 'TYPE_ID_ITEM',
        3: 'PROTO_ID_ITEM',
        4: 'FIELD_ID_ITEM',
        5: 'METHOD_ID_ITEM',
        6: 'CLASS_DEF_ITEM',
        7: 'CALL_SITE_ID_ITEM',
        8: 'METHOD_HANDLE_ITEM',
        4096: 'MAP_LIST',
        4097: 'TYPE_LIST',
        4098: 'ANNOTATION_SET_REF_LIST',
        4099: 'ANNOTATION_SET_ITEM',
        8192: 'CLASS_DATA_ITEM',
        8193: 'CODE_ITEM',
        8194: 'STRING_DATA_ITEM',
        8195: 'DEBUG_INFO_ITEM',
        8196: 'ANNOTATION_ITEM',
        8197: 'ENCODED_ARRAY_ITEM',
        8198: 'ANNOTATIONS_DIRECTORY_ITEM',
    });
    type: number = -1;
    unused: number = -1;
    size: number = -1;
    offset: number = -1;

    constructor(public io: KaitaiStream, public parent: any, public root: any) {
        this.root = root || this;
        this._read();
    }
    _read() {
        this.type = this.io.readU2le();
        this.unused = this.io.readU2le();
        this.size = this.io.readU4le();
        this.offset = this.io.readU4le();
    }
}

class EncodedArray {
    //@ts-ignore
    size: VlqBase128Le;
    values: EncodedValue[] = [];

    constructor(public io: KaitaiStream, public parent: any, public root: any) {
        this.root = root || this;
        this._read();
    }
    _read() {
        this.size = new VlqBase128Le(this.io, this, null);
        this.values = [];
        for (let i = 0; i < this.size.value; i++) {
            this.values.push(new EncodedValue(this.io, this, this.root));
        }
    }
}

class AnnotationElement {
    //@ts-ignore
    nameIdx: VlqBase128Le;
    //@ts-ignore
    value: EncodedValue;

    constructor(public io: KaitaiStream, public parent: any, public root: any) {
        this.root = root || this;
        this._read();
    }
    _read() {
        this.nameIdx = new VlqBase128Le(this.io, this, null);
        this.value = new EncodedValue(this.io, this, this.root);
    }
}

class VlqBase128Le {
    //@ts-ignore
    nameIdx: VlqBase128Le;
    //@ts-ignore
    groups: Group[];
    _m_len: number | undefined;
    _m_value: number | undefined;
    _m_signBit: number | undefined;
    _m_valueSigned: number | undefined;

    constructor(public io: KaitaiStream, public parent: any, public root: any) {
        this.root = root || this;
        this._read();
    }
    _read() {
        this.groups = [];
        var i = 0;
        do {
            var _ = new Group(this.io, this, this.root);
            this.groups.push(_);
            i++;
        } while (!!_.hasNext);
    }

    get len() {
        if (this._m_len !== undefined) return this._m_len;
        this._m_len = this.groups.length;
        return this._m_len;
    }

    get value() {
        if (this._m_value !== undefined) return this._m_value;
        this._m_value =
            this.groups[0].value +
            (this.len >= 2 ? this.groups[1].value << 7 : 0) +
            (this.len >= 3 ? this.groups[2].value << 14 : 0) +
            (this.len >= 4 ? this.groups[3].value << 21 : 0) +
            (this.len >= 5 ? this.groups[4].value << 28 : 0) +
            (this.len >= 6 ? this.groups[5].value << 35 : 0) +
            (this.len >= 7 ? this.groups[6].value << 42 : 0) +
            (this.len >= 8 ? this.groups[7].value << 49 : 0);
        return this._m_value;
    }

    get signBit() {
        if (this._m_signBit !== undefined) return this._m_signBit;
        this._m_signBit = 1 << (7 * this.len - 1);
        return this._m_signBit;
    }

    get valueSigned() {
        if (this._m_valueSigned !== undefined) return this._m_valueSigned;
        this._m_valueSigned = (this.value ^ this.signBit) - this.signBit;
        return this._m_valueSigned;
    }
}

class Group {
    b: number = -1;
    _m_hasNext: boolean | undefined;
    _m_value: number | undefined;

    constructor(public io: KaitaiStream, public parent: any, public root: any) {
        this.root = root || this;
        this._read();
    }
    _read() {
        this.b = this.io.readU1();
    }

    get hasNext() {
        if (this._m_hasNext !== undefined) return this._m_hasNext;
        this._m_hasNext = (this.b & 128) != 0;
        return this._m_hasNext;
    }

    get value() {
        if (this._m_value !== undefined) return this._m_value;
        this._m_value = this.b & 127;
        return this._m_value;
    }
}

export { Dex };
