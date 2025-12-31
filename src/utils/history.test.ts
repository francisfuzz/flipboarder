import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { clearHistory } from './history';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('History utilities', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  describe('clearHistory', () => {
    it('removes flipboard_history from localStorage', () => {
      // Setup: add some history
      const testHistory = JSON.stringify([
        { id: '1', message: 'test 1', timestamp: Date.now() },
        { id: '2', message: 'test 2', timestamp: Date.now() },
      ]);
      localStorageMock.setItem('flipboard_history', testHistory);

      // Verify it's there
      expect(localStorageMock.getItem('flipboard_history')).toBeTruthy();

      // Clear it
      clearHistory();

      // Verify it's gone
      expect(localStorageMock.getItem('flipboard_history')).toBeNull();
    });

    it('returns true when history was cleared', () => {
      localStorageMock.setItem('flipboard_history', JSON.stringify([{ id: '1', message: 'test' }]));
      const result = clearHistory();
      expect(result).toBe(true);
    });

    it('returns true even when there was no history to clear', () => {
      const result = clearHistory();
      expect(result).toBe(true);
    });

    it('does not affect other localStorage items', () => {
      localStorageMock.setItem('other_key', 'other_value');
      localStorageMock.setItem('flipboard_history', JSON.stringify([{ id: '1', message: 'test' }]));

      clearHistory();

      expect(localStorageMock.getItem('other_key')).toBe('other_value');
      expect(localStorageMock.getItem('flipboard_history')).toBeNull();
    });
  });
});
