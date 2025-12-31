import { describe, it, expect } from 'vitest';
import { sanitize } from './sanitizer';

describe('sanitize', () => {
  it('truncates to 140 chars', () => {
    const longString = 'a'.repeat(150);
    const result = sanitize(longString);
    expect(result).toHaveLength(140);
    expect(result).toBe('a'.repeat(140));
  });

  it('removes script tags', () => {
    const input = 'Hello <script>alert("xss")</script> world';
    const result = sanitize(input);
    expect(result).not.toContain('script');
    expect(result).not.toContain('alert');
  });

  it('removes HTML entities', () => {
    const input = 'Hello &lt;div&gt; &amp; &quot;world&quot;';
    const result = sanitize(input);
    expect(result).not.toContain('&');
  });

  it('allows alphanumeric, spaces, and basic punctuation', () => {
    const input = 'Hello, World! 123 (test) [bracket] -dash. More?';
    const result = sanitize(input);
    expect(result).toBe('Hello, World! 123 (test) [bracket] -dash. More?');
  });

  it('handles empty string', () => {
    const result = sanitize('');
    expect(result).toBe('');
  });

  it('handles null and returns empty string', () => {
    const result = sanitize(null as any);
    expect(result).toBe('');
  });

  it('handles undefined and returns empty string', () => {
    const result = sanitize(undefined as any);
    expect(result).toBe('');
  });

  it('removes disallowed special characters', () => {
    const input = 'Hello @#$%^*=+{}|\\:;"\'<>`~world';
    const result = sanitize(input);
    expect(result).not.toContain('@');
    expect(result).not.toContain('#');
    expect(result).not.toContain('$');
  });

  it('preserves spaces', () => {
    const input = 'Hello   world';
    const result = sanitize(input);
    expect(result).toBe('Hello   world');
  });

  it('removes newlines and tabs', () => {
    const input = 'Hello\nworld\ttab';
    const result = sanitize(input);
    expect(result).not.toContain('\n');
    expect(result).not.toContain('\t');
  });
});
