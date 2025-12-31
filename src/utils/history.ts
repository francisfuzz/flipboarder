/**
 * Clear all message history from localStorage
 * @returns true if history was cleared successfully
 */
export function clearHistory(): boolean {
  try {
    localStorage.removeItem('flipboard_history');
    return true;
  } catch (error) {
    console.error('Failed to clear history:', error);
    return false;
  }
}
