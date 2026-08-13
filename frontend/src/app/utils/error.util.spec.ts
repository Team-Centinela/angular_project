import { extractErrorMessage } from './error.util';

describe('extractErrorMessage', () => {
  it('returns the fallback when the error has no body', () => {
    expect(extractErrorMessage(null, 'fallback')).toBe('fallback');
    expect(extractErrorMessage(undefined, 'fallback')).toBe('fallback');
    expect(extractErrorMessage({}, 'fallback')).toBe('fallback');
  });

  it('extracts a top-level string message', () => {
    expect(extractErrorMessage({ error: { message: 'Boom' } }, 'fb')).toBe('Boom');
  });

  it('joins class-validator string[] messages with comma+space', () => {
    const err = {
      error: {
        message: [
          'name must be longer than or equal to 2 characters',
          'price must be a positive number',
        ],
      },
    };
    expect(extractErrorMessage(err, 'fb')).toBe(
      'name must be longer than or equal to 2 characters, price must be a positive number',
    );
  });

  it('returns the fallback when message key is missing', () => {
    expect(extractErrorMessage({ error: { statusCode: 500 } }, 'fb')).toBe('fb');
  });
});
