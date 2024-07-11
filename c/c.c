#include <gum/guminterceptor.h>

static void frida_log (const char * format, ...);
extern void _frida_log (const gchar * message);

void
init (void)
{
  frida_log ("init()");
}

void
finalize (void)
{
  frida_log ("finalize()");
}

void
on_enter (GumInvocationContext * ic)
{
  gpointer arg0;

  arg0 = gum_invocation_context_get_nth_argument (ic, 0);

  frida_log ("on_enter() arg0=%p", arg0);
}

void
on_leave (GumInvocationContext * ic)
{
  gpointer retval;

  retval = gum_invocation_context_get_return_value (ic);

  frida_log ("on_leave() retval=%p", retval);
}

static void
frida_log (const char * format,
           ...)
{
  gchar * message;
  va_list args;

  va_start (args, format);
  message = g_strdup_vprintf (format, args);
  va_end (args);

  _frida_log (message);

  g_free (message);
}
