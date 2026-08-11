/**
 * Util: extractErrorMessage
 * --------------------------------------------------------------
 * Convierte el `error` que devuelve HttpClient (estructura de NestJS)
 * en un mensaje legible para mostrar al usuario.
 *
 * Nest normalmente responde `{ message: string | string[] }` para
 * errores de validación, o `{ message: 'Not found' }` para errores
 * simples. Esta helper unifica los dos casos.
 */

export function extractErrorMessage(err: any, fallback: string): string {
  const m = err?.error?.message;
  if (Array.isArray(m)) return m.join(', ');
  return m ?? fallback;
}
