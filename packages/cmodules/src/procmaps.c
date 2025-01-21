#include <gum/guminterceptor.h>
#include <gum/gumprocess.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

extern void frida_log(void *str);
static void mklog(const char *format, ...) {
  gchar *message;
  va_list args;
  va_start(args, format);
  message = g_strdup_vprintf(format, args);
  va_end(args);
  frida_log(message);
  g_free(message);
}

typedef struct {
  const char *phdr;
  size_t phnum;
  uint64_t base;
  size_t size;
  void *dynamic;
  void *next;
} so_info;

typedef struct {
  so_info *info;
  const char *name;
} lib_info;

typedef struct {
  const char *dli_fname;
  void *dli_fbase;
  const char *dli_sname;
  void *dli_saddr;
} dl_info;

typedef struct {
  uint64_t start;
  uint64_t end;
  char mode[5];
  char name[256];
} mem_info;

typedef struct {
  mem_info *data;
  size_t size;
  size_t capacity;
} mem_list;

mem_list new_mem_list() {
  const size_t initial_capacity = 32;
  mem_list list;
  list.data = g_malloc(initial_capacity * sizeof(mem_info *));
  list.size = 0;
  list.capacity = initial_capacity;
  return list;
}

void mem_list_add(mem_list *list, mem_info *element) {
  if (list->size == list->capacity) {
    list->capacity *= 2;
    list->data = g_realloc(list->data, list->capacity * sizeof(mem_info *));
  };
  list->data[list->size += 1] = *element;
};

// Free the variable-sized list
void mem_list_free(mem_list *list) {
  if (list) {
    g_free(list->data);
    g_free(list);
  }
}

typedef struct {
  uintptr_t *frames;
  size_t frame_count;
  size_t max_frames;
} backtrace_state;

#define MAX_FRAMES 32
#define LOG_TAG "FridaBacktracer"

extern char *dl_soinfo_get_soname(so_info *info);
extern so_info *dl_solist_get_head();
extern int fclose(FILE *stream);
extern FILE *fdopen(int fildes, const char *options);
extern char *fgets(char *str, int n, FILE *stream);
extern char *strchr(const char *str, int z);
extern size_t strlen(const char *str);
extern char *strtok_r(char *str, const char *delim, char **saveptr);
extern unsigned long strtoul(const char *__s, char **__end_ptr, int __base);
extern long syscall(long __number, ...);
extern int dladdr(const void *addr, dl_info *info);

// Helper to find soinfo for an address
static so_info *find_soinfo_for_address(void *_addr) {
  if (_addr == NULL)
    return NULL;
  uint64_t addr = (uint64_t)_addr;
  for (so_info *si = dl_solist_get_head(); si != NULL; si = si->next) {
    if (addr >= si->base && addr < (si->base + si->size)) {
      return si;
    }
  }
  return NULL;
}

static lib_info *find_lib_info(void *_addr) {
  so_info *info = find_soinfo_for_address(_addr);
  if (!info)
    return NULL;
  lib_info lib = {info, NULL};
  lib.name = dl_soinfo_get_soname(info);
  return &lib;
}

static mem_list *read_proc_maps() {
  register uint64_t start, end;
  char prot[5];
  char line[512];

  int fd = syscall(56, 0, "/proc/self/maps");
  FILE *fp = fdopen(fd, "r");
  if (!fp)
    return NULL;

  mem_list list = new_mem_list();
  char *token, *saveptr;
  while (fgets(line, 512, fp) != NULL) {
    token = strtok_r(line, "-", &saveptr);
    start = (uint64_t)strtoul(token, NULL, 16);

    token = strtok_r(NULL, " ", &saveptr);
    end = (uint64_t)strtoul(token, NULL, 16);

    token = strtok_r(NULL, " ", &saveptr);
    mklog(token);
  }
  fclose(fp);

  return &list;
}

static mem_info *find_mem_info(mem_list *list, void *_addr) {
  if (_addr == NULL)
    return NULL;
  uint64_t addr = (uint64_t)_addr;
  for (int i = 0; i < list->size; i++) {
    mem_info entry = list->data[i];
    if (addr >= entry.start && addr < entry.end) {
      return &entry;
    }
  }
  return NULL;
}

static dl_info *find_dl_info(void *_addr) {
  if (_addr == NULL)
    return NULL;
  dl_info info;
  int ret = dladdr(_addr, &info);
  return (ret != 0) ? &info : NULL;
}

void backtrace_v0() {
  uintptr_t *retaddr =
      (uintptr_t *)__builtin_extract_return_addr(__builtin_return_address(0));
  uintptr_t *frame_ptr = (uintptr_t *)__builtin_frame_address(0);

  mem_list *mem_list = read_proc_maps();
  int depth = 0;
  while (frame_ptr && depth < 10) {
    void *return_addr = (void *)*(frame_ptr + 1);
    if (!return_addr)
      break;

    lib_info *lib = find_lib_info(return_addr);
    mem_info *mem = find_mem_info(mem_list, return_addr);
    dl_info *dl = find_dl_info(return_addr);

    frame_ptr = (uintptr_t *)*frame_ptr;

    // Basic sanity check for frame pointer
    if ((uintptr_t)frame_ptr & 0x7)
      break;

    depth += 1;
  }
  mem_list_free(mem_list);
}

// init functios
void init(void) {}

void finalize(void) {}

// Export our main functios
char *get_backtrace() {
  backtrace_v0();
  return "";
}
const char *backtrace(void) { return get_backtrace(); }
