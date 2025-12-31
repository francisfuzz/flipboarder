import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FlipBoard from './FlipBoard';

describe('FlipBoard', () => {
  it('renders sanitized message', () => {
    const { container } = render(<FlipBoard message="Hello" />);
    expect(container.textContent).toContain('Hello');
  });

  it('splits message into individual FlipChar components', () => {
    const { container } = render(<FlipBoard message="Hi" />);
    const chars = container.querySelectorAll('[data-testid="flip-char"]');
    expect(chars).toHaveLength(2);
  });

  it('staggers animation delays', () => {
    const { container } = render(<FlipBoard message="ABC" />);
    const chars = container.querySelectorAll('[data-testid="flip-char"]');

    expect(chars[0]).toHaveStyle({ animationDelay: '0ms' });
    expect(chars[1]).toHaveStyle({ animationDelay: '50ms' });
    expect(chars[2]).toHaveStyle({ animationDelay: '100ms' });
  });

  it('shows placeholder when empty', () => {
    render(<FlipBoard message="" />);
    expect(screen.getByText('Share a message')).toBeInTheDocument();
  });

  it('shows placeholder for whitespace only', () => {
    render(<FlipBoard message="   " />);
    expect(screen.getByText('Share a message')).toBeInTheDocument();
  });

  it('renders numbers', () => {
    const { container } = render(<FlipBoard message="123" />);
    const chars = container.querySelectorAll('[data-testid="flip-char"]');
    expect(chars).toHaveLength(3);
  });

  it('renders punctuation', () => {
    const { container } = render(<FlipBoard message="Hi!" />);
    const chars = container.querySelectorAll('[data-testid="flip-char"]');
    expect(chars).toHaveLength(3);
  });

  it('handles long messages', () => {
    const longMessage = 'a'.repeat(100);
    const { container } = render(<FlipBoard message={longMessage} />);
    const chars = container.querySelectorAll('[data-testid="flip-char"]');
    expect(chars).toHaveLength(100);
  });

  it('has aria-live for accessibility', () => {
    const { container } = render(<FlipBoard message="Hello" />);
    const flipBoard = container.querySelector('[aria-live="polite"]');
    expect(flipBoard).toBeInTheDocument();
  });

  it('has role and aria-label', () => {
    const { container } = render(<FlipBoard message="Hello" />);
    const flipBoard = container.querySelector('[role="text"]');
    expect(flipBoard).toBeInTheDocument();
    expect(flipBoard).toHaveAttribute('aria-label', 'Hello');
  });
});
