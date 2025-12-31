import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FlipChar from './FlipChar';

describe('FlipChar', () => {
  it('renders single character', () => {
    render(<FlipChar char="A" delay={0} />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('applies flip animation class', () => {
    const { container } = render(<FlipChar char="B" delay={0} />);
    const element = container.querySelector('[data-testid="flip-char"]');
    expect(element).toHaveClass('animate-flip');
  });

  it('respects animation delay prop', () => {
    const { container } = render(<FlipChar char="C" delay={100} />);
    const element = container.querySelector('[data-testid="flip-char"]');
    expect(element).toHaveStyle({ animationDelay: '100ms' });
  });

  it('handles space character with non-breaking space', () => {
    const { container } = render(<FlipChar char=" " delay={0} />);
    const element = container.querySelector('[data-testid="flip-char"]');
    expect(element?.textContent).toBe('\u00A0'); // non-breaking space
  });

  it('renders emoji characters', () => {
    render(<FlipChar char="😀" delay={0} />);
    expect(screen.getByText('😀')).toBeInTheDocument();
  });

  it('renders punctuation', () => {
    render(<FlipChar char="!" delay={0} />);
    expect(screen.getByText('!')).toBeInTheDocument();
  });

  it('renders numbers', () => {
    render(<FlipChar char="5" delay={0} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
