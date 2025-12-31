/**
 * Sanitize user input for safe display
 * - Truncates to 140 characters
 * - Removes script tags and HTML
 * - Removes HTML entities
 * - Allows only alphanumeric, spaces, and basic punctuation: , . ! ? - ( ) [ ]
 * - Removes newlines and tabs
 */
export function sanitize(input: unknown): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove script tags and their content
  let cleaned = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove all HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, '');

  // Decode HTML entities (basic set)
  cleaned = cleaned
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');

  // Remove remaining HTML entity patterns
  cleaned = cleaned.replace(/&[a-zA-Z0-9]+;/g, '');

  // Remove newlines and tabs
  cleaned = cleaned.replace(/[\n\t\r]/g, ' ');

  // Keep only: alphanumeric, spaces, and basic punctuation: , . ! ? - ( ) [ ]
  cleaned = cleaned.replace(/[^a-zA-Z0-9\s,.\!?\-\(\)\[\]]/g, '');

  // Truncate to 140 characters
  return cleaned.slice(0, 140);
}
