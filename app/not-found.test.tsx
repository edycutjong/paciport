import { render, screen } from '@testing-library/react';
import NotFound from './not-found';
import React from 'react';

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// Mock ExchangeLogo
jest.mock('@/components/ExchangeLogo', () => ({
  ExchangeLogo: ({ exchange, size }: { exchange: string; size: number }) => (
    <span data-testid={`exchange-logo-${exchange}`} data-size={size} />
  ),
}));

describe('NotFound', () => {
  it('renders the 404 heading', () => {
    render(<NotFound />);
    expect(screen.getByRole('heading', { level: 1 })).toBeDefined();
    expect(screen.getAllByText(/position/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/not found/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders the descriptive message', () => {
    render(<NotFound />);
    expect(screen.getByText(/This route doesn/i)).toBeDefined();
    expect(screen.getByText(/position may have already been migrated/i)).toBeDefined();
  });

  it('renders the Back to Home link pointing to /', () => {
    render(<NotFound />);
    const homeLink = screen.getByRole('link', { name: /back to home/i });
    expect(homeLink.getAttribute('href')).toBe('/');
  });

  it('renders the Open Dashboard link pointing to /dashboard', () => {
    render(<NotFound />);
    const dashboardLink = screen.getByRole('link', { name: /open dashboard/i });
    expect(dashboardLink.getAttribute('href')).toBe('/dashboard');
  });

  it('renders the execution log with ERR_ROUTE_NOT_FOUND', () => {
    render(<NotFound />);
    expect(screen.getByText(/ERR_ROUTE_NOT_FOUND/i)).toBeDefined();
    expect(screen.getByText(/paciport resolve-route/i)).toBeDefined();
    expect(screen.getByText(/No matching handler for this path/i)).toBeDefined();
    expect(screen.getByText('404')).toBeDefined();
  });

  it('renders the ExchangeLogo for pacifica', () => {
    render(<NotFound />);
    expect(screen.getByTestId('exchange-logo-pacifica')).toBeDefined();
  });

  it('renders the 404 digit characters', () => {
    render(<NotFound />);
    // The 4 0 4 are rendered as individual spans
    const all4s = screen.getAllByText('4');
    expect(all4s.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('0')).toBeDefined();
  });
});
