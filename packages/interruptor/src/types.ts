//file:biome-ignore lint/style/useEnumInitializers: It indicats taht valoue is opaque and should not be used:
/**
 * The aim of this interface is to describe CPU-specific data required
 * to retrieve and parse sys call from  CPU context.
 *
 * @interface
 * @export
 */

import { IStringIndex } from './IStringIndex.js';

export interface KernelConstant {
    /**
     * Constant value
     * @field
     */
    0: number;
    /**
     * Constant name
     * @string
     */
    1?: string;
}

export interface KernelEnum {
    [constName: string]: KernelConstant;
}

export interface KernelConstMapping {
    [constName: string]: KernelEnum | KernelConstMapping;
}

export interface KernelAPI {
    CONST: KernelConstMapping;
    SYSC: SyscallMapping;
    ERR: ErrorCodeMapping;
}

export interface SyscallCallingConvention extends IStringIndex {
    /**
     * The mmemonic of the opcode performing the interruption
     * Example : 'swi' for armv7
     * @type string
     * @field
     */
    OP: string;

    /**
     * The name of the register holding the syscall number
     * Example : 'r7' for armv7
     * @type string
     * @field
     */
    NR: string;

    /**
     * The name of the register holding the error code / return value after the syscall
     * Example : 'r7' for armv7
     * @type string
     * @field
     */
    RET: string;

    /**
     * The name of the register holding the 1st arg
     * Example : 'r0' for armv7
     * @type string
     * @field
     */
    ARG0: string;

    /**
     * The name of the register holding the 2nd arg
     * Example : 'r1' for armv7
     * @type string
     * @field
     */
    ARG1: string;

    /**
     * The name of the register holding the 3rd arg
     * Example : 'r2' for armv7
     * @type string
     * @field
     */
    ARG2: string;

    /**
     * The name of the register holding the 4th arg
     * Example : 'r3' for armv7
     * @type string
     * @field
     */
    ARG3: string;

    /**
     * The name of the register holding the 5th arg
     * Example : 'r4' for armv7
     * @type string
     * @field
     */
    ARG4: string;

    /**
     * The name of the register holding the 6th arg
     * Example : 'r5' for armv7
     * @type string
     * @field
     */
    ARG5: string;

    /**
     * The name of the register holding the program counter / current instruction
     * Example : 'pc' for armv7 , 'EIP', ...
     * @type string
     * @field
     */
    PC: string;
}

export type SyscallNumber = number;
export type SyscallName = string;
export type ErrorCodeName = string;
export type ErrorCodeConst = number;

/**
 * To hold extra data for the hook context
 * @interface
 */
interface ExtraContext {
    orig?: any; //NativePointer;
    FD?: any;
    WD?: any;
    SOCKFD?: any;
    DFD?: any;
    [name: string]: any;
}

export type RegisterName = string;

export interface CallConvention {
    OP: RegisterName;
    NR: RegisterName;
    RET: RegisterName;
    ARG0: RegisterName;
    ARG1: RegisterName;
    ARG2: RegisterName;
    ARG3: RegisterName;
    ARG4: RegisterName;
    ARG5: RegisterName;
}
export interface RichCpuContext extends IStringIndex {
    dxc?: ExtraContext;
    log?: string;
    dxcOpts?: any;
    dxcRet?: any;
}

/**
 * Basic interface to define an error code
 * @interface
 */
export interface ErrorCode {
    0: ErrorCodeConst;
    1: string;
    2?: ErrorCodeName;
}

export interface ErrorCodeList extends IStringIndex {
    [name: string]: ErrorCode;
}

export interface ErrorCodeMapping extends IStringIndex {
    [name: string]: number;
}

export interface SyscallInOutInfo extends IStringIndex {
    t: T;
    n?: SyscallName;
    l?: L;
    f?: any;
    r?: string | number | (string | number)[];
    c?: boolean;
    e?: ErrorCode[];
}

export interface SyscallInInfo extends SyscallInOutInfo {
    t: T;
    n: SyscallName;
}

export interface SyscallOutInfo extends SyscallInOutInfo {
    t: T;
    e: ErrorCode[];
}

export interface SyscallOutMap extends IStringIndex {
    [shortcut: string]: SyscallOutInfo;
}

export type SyscallParamSignature = SyscallInInfo | string;

export interface SyscallHook {
    onEnter?: (ctx: RichCpuContext) => void;
    onLeave?: (ctx: RichCpuContext) => void;
}

export interface SyscallHookMap {
    [syscallName: string]: SyscallHook;
}

export enum SyscallInfo {
    NUM = 0,
    NAME = 1,
    HEX = 2,
    ARGS = 3,
    RET = 4,
}

export interface SyscallSignature {
    0: SyscallNumber;
    1: SyscallName;
    2: SyscallNumber;
    3: SyscallParamSignature[];
    4?: SyscallOutInfo;
}

export interface SyscallMapping {
    [name: string]: SyscallSignature;
}

export type InterruptSignature = SyscallSignature;

export interface InterruptSignatureMap {
    syscalls: SyscallSignature[] | null;
    [type: string]: InterruptSignature[] | null;
}

export enum F {
    EXCLUDE_ANY = 0,
    INCLUDE_ANY = 1,
    FILTER = 2,
}

/**
 * The aim of this enumeration is to provide a list of meaning to help
 * to analyse syscall's arguments and provide useful information
 *
 * @enum
 * @export
 */
export enum L {
    PATH = 0,
    SIZE = 1,
    FD = 2, // File Descriptor
    DFD = 3, // Directory File Descriptor
    FLAG = 4,
    ATTRMODE = 5,
    O_FLAGS = 6,
    VADDR = 7,
    MPROT = 8,
    OUTPUT_BUFFER = 9,
    PID = 10,
    ERR = 11,
    SIG = 12,
    XATTR_LIST = 13,
    F_ = 14,
    MFD = 15, // Mapped FD
    UID = 16,
    GID = 17,
    UTSNAME = 18,
    FCNTL_ARGS = 19, // fnctl() args
    FCNTL_RET = 20, // fnctl() ret
    TIME = 21, // Timestamp
    INODE = 22, // Inode
    DEV = 23, // Device
    DSTRUCT = 24,
    EPFD = 25, // EPoll File Descriptor
    WD = 26, // Watch Descriptor,
    PIPEFD = 27, // fd[2] read FD, write FD
    SOCKFD = 28,
    BUFFER = 29,
    PKEY = 30,
    IDSTRUCT = 31,
    FUTEX = 32,
    TIMER = 33,
    MQDES = 34, // struct always parsed,
    PTRACE = 35,
}

/**

 * An enumeration of most basic type, most of them are primitive type.
 *
 * @enum
 * @export
 */
export enum T {
    INT32 = 0,
    UINT32 = 1,
    LONG = 2,
    ULONG = 3,
    SHORT = 4,
    USHORT = 5,
    FLOAT = 6,
    DOUBLE = 7,
    CHAR = 8,
    STRING = 9,
    CHAR_BUFFER = 10,
    POINTER32 = 11,
    POINTER64 = 12,
    STRUCT = 13,
}
