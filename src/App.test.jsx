import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

vi.mock('react-globe.gl', () => {
  return {
    default: () => <div data-testid="mock-globe">Mock Globe</div>
  };
});

describe('App Component', () => {
  beforeEach(() => {
    // Mock window.matchMedia if needed by Recharts or Three.js
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('renders the country selection screen initially', async () => {
    // Clear localStorage to ensure initial state
    localStorage.clear();
    render(<App />);
    const { waitFor } = require('@testing-library/react');
    await waitFor(() => {
      expect(screen.getByText(/Select Your Region/i)).toBeInTheDocument();
    });
  });
});
