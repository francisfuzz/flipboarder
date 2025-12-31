import { encode as b64encode, decode as b64decode } from 'js-base64';

/**
 * Encode string to base64 for URL sharing
 */
export function encode(input: string): string {
  if (!input) {
    return '';
  }
  return b64encode(input);
}

/**
 * Decode base64 string back to original text
 * Returns empty string if decoding fails
 */
export function decode(input: unknown): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Validate that input is valid base64 (only contains valid base64 characters)
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(input)) {
    return '';
  }

  try {
    return b64decode(input);
  } catch {
    return '';
  }
}
