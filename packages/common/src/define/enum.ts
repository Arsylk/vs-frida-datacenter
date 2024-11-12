const JavaPrimitive = {
    boolean: 'Z',
    byte: 'B',
    char: 'C',
    double: 'D',
    float: 'F',
    int: 'I',
    long: 'J',
    short: 'S',
    void: 'V',
} as const;

enum mode {
    F_OK = 0,
    X_OK = 1,
    W_OK = 2,
    R_OK = 4,
}

enum a_type {
    AT_NULL = 0,
    AT_IGNORE = 1,
    AT_EXECFD = 2,
    AT_PHDR = 3,
    AT_PHENT = 4,
    AT_PHNUM = 5,
    AT_PAGESZ = 6,
    AT_BASE = 7,
    AT_FLAGS = 8,
    AT_ENTRY = 9,
    AT_NOTELF = 10,
    AT_UID = 11,
    AT_EUID = 12,
    AT_GID = 13,
    AT_EGID = 14,
    AT_PLATFORM = 15,
    AT_HWCAP = 16,
    AT_CLKTCK = 17,
    AT_SECURE = 23,
    AT_BASE_PLATFORM = 24,
    AT_RANDOM = 25,
    AT_HWCAP2 = 26,
    AT_RSEQ_FEATURE_SIZE = 27,
    AT_RSEQ_ALIGN = 28,
    AT_EXECFN = 31,
    AT_MINSIGSTKSZ = 51,
}

export { JavaPrimitive, a_type, mode };
