#include "glib.h"
#include <gum/guminterceptor.h>

static void mklog(const char *format, ...);
extern void frida_log(const GString *messag, ...);

typedef struct _IcState IcState;
struct _IcState {
  gpointer arg0;
  gpointer arg1;
  size_t size;
};

void onEnter(GumInvocationContext *ic) {
  IcState *is = GUM_IC_GET_INVOCATION_DATA(ic, IcState);
  is->arg0 = gum_invocation_context_get_nth_argument(ic, 0);
  is->arg1 = gum_invocation_context_get_nth_argument(ic, 1);
  is->size = (size_t)gum_invocation_context_get_nth_argument(ic, 2);
  mklog("", is->arg0, is->arg1);
}

void onLeave(GumInvocationContext *ic) {
  IcState *is = GUM_IC_GET_INVOCATION_DATA(ic, IcState);
  size_t retval = GPOINTER_TO_SIZE(gum_invocation_context_get_return_value(ic));

  mklog("on_leave(%p) retval=%p", is, retval);
}

static void mklog(const char *format, ...) {
  gchar *message;
  va_list args;

  va_start(args, format);
  message = g_strdup_vprintf(format, args);
  va_end(args);
  frida_log(message);

  g_free(message);
}
typedef uint8_t byte_t; //!< 1 byte data type

#define MIN_LINE_WIDTH                                                         \
  4 //!< minimum line width (byte(2) + blank(1) + ascii(1) = 4)
#define BYTE_MASK 0xFF //!< uses as mask for the least significant byte

char *hexdump(const void *data, size_t size, size_t line_width) {
  // Validate input arguments
  if (size == 0)
    return g_strdup("");

  if (line_width < MIN_LINE_WIDTH) {
    fprintf(stderr, "Error: Line width too small (must be at least %d)!\n",
            MIN_LINE_WIDTH);
    return NULL;
  }

  if (data == NULL) {
    fprintf(stderr, "Error: Data pointer must not be NULL!\n");
    return NULL;
  }

  // Calculate bytes printed per line
  size_t bytes_per_line = line_width / 4;

  // Allocate buffer for the ASCII representation
  char *ascii = (char *)g_malloc(bytes_per_line + 1);
  if (!ascii) {
    perror("Failed to allocate memory for ASCII buffer");
    return NULL;
  }
  ascii[bytes_per_line] = '\0'; // Null-terminate the ASCII buffer

  // Estimate the size of the resulting string
  size_t estimated_size =
      (size / bytes_per_line + 1) *
      (line_width + 2); // Include newlines and null terminator
  char *hex_dump = (char *)g_malloc(estimated_size);
  if (!hex_dump) {
    perror("Failed to allocate memory for hex dump");
    g_free(ascii)
  }
  hex_dump[0] = '\0'; // Initialize the result string

  // Cast data to byte pointer
  const byte_t *byte_data = (const byte_t *)data;

  size_t line_bytes = 0; // Number of bytes in the current line
  size_t offset = 0;     // Offset for the hex dump string

  for (size_t i = 0; i < size; i++) {
    // Append hex representation of the byte
    offset += sprintf(hex_dump + offset, "%02X ", byte_data[i] & BYTE_MASK);

    // Write data to ASCII buffer (replace non-printable chars with '.')
    ascii[i % bytes_per_line] =
        isgraph(byte_data[i]) ? (char)byte_data[i] : '.';

    // Check if the line is complete
    if (++line_bytes >= bytes_per_line) {
      // Append ASCII buffer and newline
      offset += sprintf(hex_dump + offset, "%s\n", ascii);
      line_bytes = 0;
    }
  }

  // Handle incomplete last line
  size_t last_line_bytes = size % bytes_per_line;
  if (last_line_bytes > 0) {
    // Add padding for missing bytes
    for (size_t i = last_line_bytes; i < bytes_per_line; i++) {
      offset +=
          sprintf(hex_dump + offset, "   "); // 3 spaces for a missing byte
    }

    // Null-terminate and append the ASCII buffer
    ascii[last_line_bytes] = '\0';
    sprintf(hex_dump + offset, "%s", ascii);
  }

  // Free temporary buffers
  g_free(ascii);

  return hex_dump;
}
