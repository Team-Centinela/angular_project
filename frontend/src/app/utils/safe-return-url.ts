const INTERNAL_PATH = /^\/(?![/\\])/;

export function safeReturnUrl(raw: string | null | undefined, fallback = '/'): string {
  return raw && INTERNAL_PATH.test(raw) ? raw : fallback;
}
