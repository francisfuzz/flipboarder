import { describe, it, expect } from 'vitest';
import { encode, decode } from './encoding';

describe('encoding utilities', () => {
  describe('encode', () => {
    it('encodes string to base64', () => {
      const input = 'Hello, World!';
      const result = encode(input);
      expect(result).toBe(Buffer.from(input).toString('base64'));
    });

    it('encodes empty string', () => {
      const result = encode('');
      expect(result).toBe('');
    });

    it('handles special characters', () => {
      const input = 'Hello, World! 🌍';
      const result = encode(input);
      expect(decode(result)).toBe(input);
    });

    it('handles numbers and symbols', () => {
      const input = '123!@#$%^&*()';
      const result = encode(input);
      expect(decode(result)).toBe(input);
    });

    it('handles long strings', () => {
      const input = 'a'.repeat(500);
      const result = encode(input);
      expect(decode(result)).toBe(input);
    });
  });

  describe('decode', () => {
    it('decodes base64 to string', () => {
      const encoded = Buffer.from('Hello, World!').toString('base64');
      const result = decode(encoded);
      expect(result).toBe('Hello, World!');
    });

    it('returns empty string for invalid base64', () => {
      const result = decode('!!!invalid!!!');
      expect(result).toBe('');
    });

    it('returns empty string for empty input', () => {
      const result = decode('');
      expect(result).toBe('');
    });

    it('handles special characters', () => {
      const input = 'Hello, World! 🌍';
      const encoded = encode(input);
      const result = decode(encoded);
      expect(result).toBe(input);
    });

    it('handles null and undefined', () => {
      expect(decode(null as any)).toBe('');
      expect(decode(undefined as any)).toBe('');
    });
  });

  describe('roundtrip', () => {
    it('encodes and decodes correctly', () => {
      const messages = [
        'Simple message',
        'Message with numbers 123',
        'Special chars !@#$%^&*()',
        'Spaces    and    gaps',
        'Punctuation: . , ! ?',
      ];

      messages.forEach((message) => {
        const encoded = encode(message);
        const decoded = decode(encoded);
        expect(decoded).toBe(message);
      });
    });
  });
});
