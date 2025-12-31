import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('renders with initial auto mode', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(screen.getByRole('button')).toHaveTextContent('Auto');
  });

  it('cycles through theme modes', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');

    // Starts at auto
    expect(button).toHaveTextContent('Auto');

    // Cycles to light
    await user.click(button);
    expect(button).toHaveTextContent('Light');

    // Cycles to dark
    await user.click(button);
    expect(button).toHaveTextContent('Dark');

    // Cycles back to auto
    await user.click(button);
    expect(button).toHaveTextContent('Auto');
  });

  it('displays correct icon for each theme', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    // Auto mode
    expect(screen.getByText('🌓')).toBeInTheDocument();

    await user.click(screen.getByRole('button'));
    // Light mode
    expect(screen.getByText('☀️')).toBeInTheDocument();

    await user.click(screen.getByRole('button'));
    // Dark mode
    expect(screen.getByText('🌙')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label');
    expect(button).toHaveAttribute('title');
  });

  it('aria-label updates with theme change', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', expect.stringContaining('Auto'));

    await user.click(button);
    expect(button).toHaveAttribute('aria-label', expect.stringContaining('Light'));

    await user.click(button);
    expect(button).toHaveAttribute('aria-label', expect.stringContaining('Dark'));
  });

  it('is keyboard accessible', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');

    // Tab to focus the button
    await user.tab();
    expect(button).toHaveFocus();

    // Press Enter to activate
    await user.keyboard('{Enter}');
    expect(button).toHaveTextContent('Light');
  });
});
