import { render, screen } from '@testing-library/react';
import { FeeSavingsCard } from './FeeSavingsCard';
import React from 'react';

// Mock Recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Bar: () => <div>Bar</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  Tooltip: () => <div>Tooltip</div>,
  Cell: () => <div>Cell</div>,
}));

describe('FeeSavingsCard', () => {
  it('should render savings amount', () => {
    render(<FeeSavingsCard annualSavingsUsd={1200} />);
    expect(screen.getByText('+$1,200.00')).toBeDefined();
    expect(screen.getByText('Annual Savings')).toBeDefined();
  });
});
