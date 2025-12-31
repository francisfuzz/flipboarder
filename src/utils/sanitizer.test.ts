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

  it('decodes and sanitizes HTML entities', () => {
    const input = 'Hello &lt;div&gt; &amp; &quot;world&quot;';
    const result = sanitize(input);
    // &lt; becomes <, &gt; becomes >, &amp; becomes &, &quot; becomes "
    // Then < and > are removed as disallowed characters
    expect(result).toBe('Hello div & "world"');
  });

  it('allows alphanumeric, spaces, and basic punctuation', () => {
    const input = 'Hello, World! 123 (test) [bracket] -dash. More?';
    const result = sanitize(input);
    expect(result).toBe('Hello, World! 123 (test) [bracket] -dash. More?');
  });

  it('allows straight apostrophes for contractions', () => {
    const input = "Don't, it's, I'm, they've";
    const result = sanitize(input);
    expect(result).toBe("Don't, it's, I'm, they've");
  });

  it('allows curly apostrophes (smart quotes) for contractions', () => {
    const input = "Don't, it's, I'm, they've";
    const result = sanitize(input);
    expect(result).toBe("Don't, it's, I'm, they've");
  });

  it('allows quotation marks', () => {
    const input = 'She said "hello" to me';
    const result = sanitize(input);
    expect(result).toBe('She said "hello" to me');
  });

  it('allows colons', () => {
    const input = 'Time: 2:30 PM or this: cool';
    const result = sanitize(input);
    expect(result).toBe('Time: 2:30 PM or this: cool');
  });

  it('allows ampersands', () => {
    const input = 'Tom & Jerry, Q&A, apples & oranges';
    const result = sanitize(input);
    expect(result).toBe('Tom & Jerry, Q&A, apples & oranges');
  });

  it('allows forward slashes', () => {
    const input = 'Date: 12/25, Fraction: 1/2, path/to/file';
    const result = sanitize(input);
    expect(result).toBe('Date: 12/25, Fraction: 1/2, path/to/file');
  });

  it('allows asterisks', () => {
    const input = '*Important* note here';
    const result = sanitize(input);
    expect(result).toBe('*Important* note here');
  });

  it('allows plus signs', () => {
    const input = 'Math: 2+2, apples + oranges';
    const result = sanitize(input);
    expect(result).toBe('Math: 2+2, apples + oranges');
  });

  it('allows hash symbols', () => {
    const input = '#flipboarder #messaging #fun';
    const result = sanitize(input);
    expect(result).toBe('#flipboarder #messaging #fun');
  });

  it('allows semicolons', () => {
    const input = 'First thing; second thing; final thought';
    const result = sanitize(input);
    expect(result).toBe('First thing; second thing; final thought');
  });

  it('allows mixed expanded punctuation', () => {
    const input = "It's great! Here's why: #awesome & *cool* - really cool (I'm serious) [check it: 5/5]";
    const result = sanitize(input);
    expect(result).toBe("It's great! Here's why: #awesome & *cool* - really cool (I'm serious) [check it: 5/5]");
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
    const input = 'Hello @$%^={}|\\<>`~world';
    const result = sanitize(input);
    expect(result).not.toContain('@');
    expect(result).not.toContain('$');
    expect(result).not.toContain('%');
    expect(result).not.toContain('^');
    expect(result).not.toContain('=');
    expect(result).not.toContain('{');
    expect(result).not.toContain('}');
    expect(result).not.toContain('|');
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
    expect(result).not.toContain('`');
    expect(result).not.toContain('~');
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
