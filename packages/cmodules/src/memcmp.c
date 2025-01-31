#include "glib.h"
#include <gum/guminterceptor.h>

static void mklog(const char *format, ...);
extern void frida_log(const gchar *messag, ...);

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
  mklog("%p <> %p ? %d", is->arg0, is->arg1, is->size);
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
