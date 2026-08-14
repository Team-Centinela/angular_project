import { safeReturnUrl } from './safe-return-url.util';

describe('safeReturnUrl (regression for #86)', () => {
  it.each([
    ['/products', true],
    ['/login', true],
    ['/register', true],
    ['/', true],
    ['/categories/abc-uuid', true],
  ])('accepts internal path %p', (input, _expected) => {
    expect(safeReturnUrl(input)).toBe(input);
  });

  it.each([
    ['//evil.com'],
    ['/\\evil.com'],
    ['/\\\\evil.com'],
    ['https://evil.com'],
    ['http://evil.com'],
    ['javascript:alert(1)'],
    [''],
    ['   '],
    ['random-string'],
  ])('rejects unsafe path %p and falls back to /', (input) => {
    expect(safeReturnUrl(input)).toBe('/');
  });

  it('respects a custom fallback', () => {
    expect(safeReturnUrl(null, '/login')).toBe('/login');
    expect(safeReturnUrl('//evil.com', '/dashboard')).toBe('/dashboard');
  });

  it('treats null and undefined as missing', () => {
    expect(safeReturnUrl(null)).toBe('/');
    expect(safeReturnUrl(undefined)).toBe('/');
  });
});
