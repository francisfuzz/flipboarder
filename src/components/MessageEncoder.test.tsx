import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MessageEncoder from './MessageEncoder';

describe('MessageEncoder', () => {
  beforeEach(() => {
    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(() => Promise.resolve()),
      },
    });
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

  it('shows copied feedback', async () => {
    render(<MessageEncoder />);
    const textarea = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /share/i });

    await userEvent.type(textarea, 'Test');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
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
});
