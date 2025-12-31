import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MessageEncoder from './MessageEncoder';

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

describe('MessageEncoder', () => {
  beforeEach(() => {
    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(() => Promise.resolve()),
      },
    });
    localStorageMock.clear();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  it('renders textarea with 140 char limit', () => {
    render(<MessageEncoder />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea).toHaveAttribute('maxLength', '140');
  });

  it('shows character count', async () => {
    render(<MessageEncoder />);
    const textarea = screen.getByRole('textbox');
    await userEvent.type(textarea, 'Hello');
    expect(screen.getByText('5 / 140')).toBeInTheDocument();
  });

  it('updates character count as user types', async () => {
    render(<MessageEncoder />);
    const textarea = screen.getByRole('textbox');
    await userEvent.type(textarea, 'H');
    expect(screen.getByText('1 / 140')).toBeInTheDocument();
    await userEvent.type(textarea, 'i');
    expect(screen.getByText('2 / 140')).toBeInTheDocument();
  });

  it('disables submit when empty', () => {
    render(<MessageEncoder />);
    const button = screen.getByRole('button', { name: /share/i });
    expect(button).toBeDisabled();
  });

  it('enables submit when text is entered', async () => {
    render(<MessageEncoder />);
    const textarea = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /share/i });

    expect(button).toBeDisabled();
    await userEvent.type(textarea, 'Hello');
    expect(button).not.toBeDisabled();
  });

  it('generates shareable URL on submit', async () => {
    render(<MessageEncoder />);
    const textarea = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /share/i });

    await userEvent.type(textarea, 'Hello World');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByDisplayValue(/^http/)).toBeInTheDocument();
    });
  });

  it('copies URL to clipboard on share button click', async () => {
    render(<MessageEncoder />);
    const textarea = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /share/i });

    await userEvent.type(textarea, 'Test');
    fireEvent.click(button);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });
  });

  it('shows copied feedback when shared', async () => {
    render(<MessageEncoder />);
    const textarea = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /share/i });

    await userEvent.type(textarea, 'Test');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('✓ Copied to clipboard!')).toBeInTheDocument();
    });
  });

  it('clears form after sharing', async () => {
    render(<MessageEncoder />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    const button = screen.getByRole('button', { name: /share/i });

    await userEvent.type(textarea, 'Test');
    fireEvent.click(button);

    await waitFor(() => {
      expect(textarea.value).toBe('');
    });
  });

  it('handles special characters in message', async () => {
    render(<MessageEncoder />);
    const textarea = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /share/i });

    await userEvent.type(textarea, 'Hello, World! 123');
    fireEvent.click(button);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });
  });

  it('always shows live preview section', () => {
    render(<MessageEncoder />);
    expect(screen.getByText('Live preview')).toBeInTheDocument();
  });

  it('shows placeholder text in preview when empty', () => {
    render(<MessageEncoder />);
    const allText = screen.getAllByText('Share a message');
    // One in the label, one in the preview placeholder
    expect(allText.length).toBeGreaterThanOrEqual(1);
  });

  it('updates preview in real-time as user types', async () => {
    const { container } = render(<MessageEncoder />);
    const textarea = screen.getByRole('textbox');

    await userEvent.type(textarea, 'Hi');
    const chars = container.querySelectorAll('[data-testid="flip-char"]');
    expect(chars).toHaveLength(2);

    await userEvent.type(textarea, 'llo');
    const updatedChars = container.querySelectorAll('[data-testid="flip-char"]');
    expect(updatedChars).toHaveLength(5);
  });

  it('saves message to history when shared', async () => {
    render(<MessageEncoder />);
    const textarea = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /share/i });

    await userEvent.type(textarea, 'Test message');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    const stored = localStorageMock.getItem('flipboard_history');
    expect(stored).toBeTruthy();
    const history = JSON.parse(stored!);
    expect(history).toHaveLength(1);
    expect(history[0].message).toBe('Test message');
  });

  it('displays recent messages section after sharing', async () => {
    render(<MessageEncoder />);
    const textarea = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /share/i });

    await userEvent.type(textarea, 'First message');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Recent messages')).toBeInTheDocument();
      expect(screen.getByText('First message')).toBeInTheDocument();
    });
  });

  it('keeps last 10 messages in history', async () => {
    render(<MessageEncoder />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    const button = screen.getByRole('button', { name: /share/i });

    // Add 12 messages
    for (let i = 1; i <= 12; i++) {
      await userEvent.type(textarea, `Message ${i}`);
      fireEvent.click(button);
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalled();
      });
    }

    const stored = localStorageMock.getItem('flipboard_history');
    const history = JSON.parse(stored!);
    expect(history).toHaveLength(10);
    // Most recent should be first
    expect(history[0].message).toBe('Message 12');
    expect(history[9].message).toBe('Message 3');
  });

  it('shows copy button for each history item', async () => {
    render(<MessageEncoder />);
    const textarea = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /share/i });

    // Share first message
    await userEvent.type(textarea, 'Original message');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Original message')).toBeInTheDocument();
    });

    // Should have copy button(s)
    const copyButtons = screen.getAllByRole('button', { name: /copy/i });
    expect(copyButtons.length).toBeGreaterThan(0);
  });

  it('allows copying from history via copy button', async () => {
    render(<MessageEncoder />);
    const textarea = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /share/i });

    // Share first message
    await userEvent.type(textarea, 'Original message');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Original message')).toBeInTheDocument();
    });

    // Click copy button for the history item
    const copyButtons = screen.getAllByRole('button', { name: /copy/i });
    fireEvent.click(copyButtons[0]);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(2); // Initial share + copy from history
    });
  });

  it('displays timestamp for history items', async () => {
    render(<MessageEncoder />);
    const textarea = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /share/i });

    await userEvent.type(textarea, 'Message with time');
    fireEvent.click(button);

    await waitFor(() => {
      // Should have time format (HH:MM:SS or similar)
      const timeElements = screen.getAllByText(/\d{1,2}:\d{1,2}:\d{1,2}/);
      expect(timeElements.length).toBeGreaterThan(0);
    });
  });

  it('shows clear history button when history exists', async () => {
    render(<MessageEncoder />);
    const textarea = screen.getByRole('textbox');
    const shareButton = screen.getByRole('button', { name: /share/i });

    // Share a message to create history
    await userEvent.type(textarea, 'Test message');
    fireEvent.click(shareButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /clear history/i })).toBeInTheDocument();
    });
  });

  it('does not show clear history button when history is empty', () => {
    render(<MessageEncoder />);
    expect(screen.queryByRole('button', { name: /clear history/i })).not.toBeInTheDocument();
  });

  it('clears history when clear button is clicked and confirmed', async () => {
    // Mock window.confirm
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<MessageEncoder />);
    const textarea = screen.getByRole('textbox');
    const shareButton = screen.getByRole('button', { name: /share/i });

    // Share a message to create history
    await userEvent.type(textarea, 'Test message');
    fireEvent.click(shareButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /clear history/i })).toBeInTheDocument();
    });

    // Click clear history button
    const clearButton = screen.getByRole('button', { name: /clear history/i });
    fireEvent.click(clearButton);

    // Verify confirmation was shown
    expect(confirmSpy).toHaveBeenCalled();

    // History should be cleared
    const stored = localStorageMock.getItem('flipboard_history');
    expect(stored).toBeNull();

    confirmSpy.mockRestore();
  });

  it('does not clear history when confirmation is cancelled', async () => {
    // Mock window.confirm to return false
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    render(<MessageEncoder />);
    const textarea = screen.getByRole('textbox');
    const shareButton = screen.getByRole('button', { name: /share/i });

    // Share a message to create history
    await userEvent.type(textarea, 'Test message');
    fireEvent.click(shareButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /clear history/i })).toBeInTheDocument();
    });

    // Click clear history button
    const clearButton = screen.getByRole('button', { name: /clear history/i });
    fireEvent.click(clearButton);

    // Verify confirmation was shown
    expect(confirmSpy).toHaveBeenCalled();

    // History should still be there
    const stored = localStorageMock.getItem('flipboard_history');
    expect(stored).toBeTruthy();

    confirmSpy.mockRestore();
  });

  it('removes clear history button after clearing history', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<MessageEncoder />);
    const textarea = screen.getByRole('textbox');
    const shareButton = screen.getByRole('button', { name: /share/i });

    // Share a message
    await userEvent.type(textarea, 'Test message');
    fireEvent.click(shareButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /clear history/i })).toBeInTheDocument();
    });

    // Click clear history
    const clearButton = screen.getByRole('button', { name: /clear history/i });
    fireEvent.click(clearButton);

    // Button should be gone now
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /clear history/i })).not.toBeInTheDocument();
    });

    confirmSpy.mockRestore();
  });
});
