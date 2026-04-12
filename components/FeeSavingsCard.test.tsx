import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { FeeSavingsCard, emptySubscribe, getServerSnapshot, getClientSnapshot } from './FeeSavingsCard';


// Mock Recharts
const mockTooltip = jest.fn();
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Bar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  Tooltip: (props: { formatter?: (value: unknown) => [string, string] | string }) => {
    mockTooltip(props);
    return <div>Tooltip</div>;
  },

  Cell: () => <div>Cell</div>,
}));

// Mock react for useSyncExternalStore
const mockUseSyncExternalStore = jest.fn();
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useSyncExternalStore: (subscribe: unknown, getSnapshot: () => unknown, getServerSnapshot: () => unknown) => 
    mockUseSyncExternalStore(subscribe, getSnapshot, getServerSnapshot),
}));

// Setup default behavior for useSyncExternalStore
beforeEach(() => {
  mockUseSyncExternalStore.mockImplementation((_sub, get) => get());
});





describe('FeeSavingsCard', () => {
  it('should render savings amount', () => {
    render(<FeeSavingsCard annualSavingsUsd={1200} />);
    expect(screen.getByText('+$1,200.00')).toBeDefined();
    expect(screen.getByText('Annual Savings')).toBeDefined();
  });

  it('should format tooltip values correctly', () => {
    render(<FeeSavingsCard annualSavingsUsd={1200} />);
    
    // Find the formatter from the mock call
    const tooltipProps = mockTooltip.mock.calls[0][0];
    const formatter = tooltipProps.formatter;
    
    expect(formatter(100)).toBe('$100.00');
    expect(formatter([200])).toBe('$200.00');
    expect(formatter(undefined)).toBe('$0.00');
  });

  it('should show loading pulse when not mounted', () => {
    // Force mounted to false by returning the server snapshot
    mockUseSyncExternalStore.mockImplementation((sub, get, set) => set());
    
    render(<FeeSavingsCard annualSavingsUsd={1200} />);
    
    expect(screen.getByText('Binance')).toBeDefined();
    expect(screen.getByText('Pacifica')).toBeDefined();
    // Recharts components shouldn't be rendered when mounted is false
    expect(screen.queryByText('Tooltip')).toBeNull();
  });

  it('should call store subscription functions', () => {
    expect(typeof emptySubscribe).toBe('function');
    expect(typeof emptySubscribe(() => {})).toBe('function');
    expect(getServerSnapshot()).toBe(false);
    expect(getClientSnapshot()).toBe(true);
  });


});



