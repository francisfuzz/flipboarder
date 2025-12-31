import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock next/router or similar - for this app we'll handle URL params directly
Object.defineProperty(window, 'location', {
  value: new URL('http://localhost'),
  writable: true,
});

describe('App', () => {
  it('shows encoder when no message param', () => {
    window.location.search = '';
    Object.defineProperty(window.navigator, 'onLine', {
      writable: true,
      value: true,
    });
    render(<App />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows flipboard when message param exists', () => {
    // Set up URL with encoded message "Hello"
    const encoded = Buffer.from('Hello').toString('base64');
    window.location.search = `?m=${encoded}`;
    render(<App />);
    // The flipboard should be displayed with the decoded message
    expect(screen.getByRole('text')).toBeInTheDocument();
  });

  it('sanitizes decoded message before display', () => {
    // Create a malicious message
    const malicious = 'Hello<script>alert("xss")</script>';
    const encoded = Buffer.from(malicious).toString('base64');
    window.location.search = `?m=${encoded}`;
    render(<App />);

    const flipboard = screen.getByRole('text');
    expect(flipboard.textContent).not.toContain('script');
    expect(flipboard.textContent).not.toContain('alert');
    expect(flipboard.textContent).toContain('Hello');
  });

  it('handles invalid base64 gracefully', () => {
    window.location.search = '?m=!!!invalid!!!';
    render(<App />);
    // Should show encoder when decoding fails
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('handles empty message param', () => {
    window.location.search = '?m=';
    render(<App />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('ignores unknown query params', () => {
    window.location.search = '?unknown=value';
    render(<App />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows offline indicator when offline', () => {
    window.location.search = '';
    Object.defineProperty(window.navigator, 'onLine', {
      writable: true,
      value: false,
    });
    render(<App />);
    expect(screen.getByText(/You're offline/)).toBeInTheDocument();
  });

  it('does not show offline indicator when online', () => {
    window.location.search = '';
    Object.defineProperty(window.navigator, 'onLine', {
      writable: true,
      value: true,
    });
    render(<App />);
    expect(screen.queryByText(/You're offline/)).not.toBeInTheDocument();
  });
});
