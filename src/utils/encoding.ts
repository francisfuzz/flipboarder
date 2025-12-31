/**
 * Encode string to base64 for URL sharing
 */
export function encode(input: string): string {
  if (!input) {
    return '';
  }
  return btoa(unescape(encodeURIComponent(input)));
}

/**
 * Decode base64 string back to original text
 * Returns empty string if decoding fails
 */
export function decode(input: unknown): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  try {
    return decodeURIComponent(escape(atob(input)));
  } catch {
    return '';
  }
}
