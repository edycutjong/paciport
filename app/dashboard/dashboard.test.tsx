import { render, screen } from '@testing-library/react';
import DashboardPage from './page';

// Mock the background components and data fetching
jest.mock('@/components/SplitScreenMigration', () => ({
  SplitScreenMigration: () => <div data-testid="migration-engine">Migration Engine</div>,
}));

jest.mock('@/components/FeeSavingsCard', () => ({
  FeeSavingsCard: () => <div data-testid="fee-card">Fee Card</div>,
}));

jest.mock('@/lib/db-mock', () => ({
  getMockPositions: jest.fn().mockReturnValue([]),
}));

describe('DashboardPage', () => {
  it('should render the dashboard layout', async () => {
    render(await DashboardPage());
    
    expect(screen.getByText('1-Click Migration Engine')).toBeDefined();
    expect(screen.getByText('Binance API Connected')).toBeDefined();
    expect(screen.getByTestId('migration-engine')).toBeDefined();
    expect(screen.getByTestId('fee-card')).toBeDefined();
  });
});
