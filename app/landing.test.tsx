import { render, screen } from '@testing-library/react';
import LandingPage from './page';
import React from 'react';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode }) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: { children: React.ReactNode }) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: { children: React.ReactNode }) => <p {...props}>{children}</p>,
    span: ({ children, ...props }: { children: React.ReactNode }) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('LandingPage', () => {
  it('should render main headline', () => {
    render(<LandingPage />);
    expect(screen.getByText(/Stop giving your/i)).toBeDefined();
    expect(screen.getAllByText(/fees/i).length).toBeGreaterThan(0);
  });

  it('should show key features', () => {
    render(<LandingPage />);
    expect(screen.getByText(/Sub-Second Execution/i)).toBeDefined();
    expect(screen.getByText(/Zero Price Risk/i)).toBeDefined();
    expect(screen.getByText(/Instantly Save Fees/i)).toBeDefined();
  });
});
