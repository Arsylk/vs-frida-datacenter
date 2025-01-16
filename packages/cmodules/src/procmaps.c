#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define BUFFER_SIZE 4096
#define INITIAL_LIST_SIZE 64

typedef struct {
  uintptr_t start;
  uintptr_t end;
  char permissions[5];
  char pathname[256];
} MemoryMapEntry;

typedef struct {
  MemoryMapEntry *entries;
  size_t size;
  size_t capacity;
} MemoryMapList;

// Initialize the memory map list
static void init_memory_map_list(MemoryMapList *list) {
  list->entries = malloc(INITIAL_LIST_SIZE * sizeof(MemoryMapEntry));
  if (!list->entries) {
    perror("Failed to allocate memory for MemoryMapList");
    exit(EXIT_FAILURE);
  }
  list->size = 0;
  list->capacity = INITIAL_LIST_SIZE;
}

// Free the memory map list
static void free_memory_map_list(MemoryMapList *list) {
  free(list->entries);
  list->entries = NULL;
  list->size = 0;
  list->capacity = 0;
}

// Add an entry to the memory map list, resizing if necessary
static void add_to_memory_map_list(MemoryMapList *list,
                                   const MemoryMapEntry *entry) {
  if (list->size >= list->capacity) {
    list->capacity *= 2;
    list->entries =
        realloc(list->entries, list->capacity * sizeof(MemoryMapEntry));
    if (!list->entries) {
      perror("Failed to reallocate memory for MemoryMapList");
      exit(EXIT_FAILURE);
    }
  }
  list->entries[list->size++] = *entry;
}

static bool parse_maps_line(const char *line, MemoryMapEntry *entry) {
  memset(entry, 0, sizeof(MemoryMapEntry));
  const char *dash = strchr(line, '-');
  if (!dash)
    return false;

  entry->start = strtoul(line, NULL, 16);
  entry->end = strtoul(dash + 1, NULL, 16);

  const char *space = strchr(dash + 1, ' ');
  if (!space)
    return false;

  strncpy(entry->permissions, space + 1, 4);
  entry->permissions[4] = '\0';

  const char *path = strstr(space, "/");
  if (path) {
    strncpy(entry->pathname, path, sizeof(entry->pathname) - 1);
    entry->pathname[sizeof(entry->pathname) - 1] = '\0';
  }

  return true;
}

static MemoryMapList *read_proc_self_maps() {
  FILE *file = fopen("/proc/self/maps", "r");
  if (!file) {
    perror("Failed to open /proc/self/maps");
    return (MemoryMapList *)NULL;
  }
  MemoryMapList *map_list;
  init_memory_map_list(map_list);

  char buffer[BUFFER_SIZE];
  MemoryMapEntry *entry = (MemoryMapEntry *)malloc(sizeof(MemoryMapEntry));

  while (fgets(buffer, sizeof(buffer), file)) {
    if (parse_maps_line(buffer, entry)) {
      printf("Start: 0x%lx, End: 0x%lx, Perms: %s, Path: %s\n", entry->start,
             entry->end, entry->permissions,
             entry->pathname[0] ? entry->pathname : "unknown");
      add_to_memory_map_list(map_list, entry);
      entry = (MemoryMapEntry *)malloc(sizeof(MemoryMapEntry));
    }
  }

  fclose(file);

  return map_list;
}
