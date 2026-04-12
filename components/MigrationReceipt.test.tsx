import { render, screen, fireEvent } from '@testing-library/react';
import { MigrationReceipt } from './MigrationReceipt';
import { Migration } from '@/lib/types';

const mockMigration: Migration = {
  id: 'mgr-1',
  positionId: '1',
  sourceExchange: 'binance',
  destinationExchange: 'pacifica',
  symbol: 'BTC/USDT:USDT',
  side: 'long',
  size: 0.1,
  leverage: 10,
  sourceClosePrice: 50000,
  destOpenPrice: 50005,
  slippagePct: 0.0001,
  maxSlippagePct: 0.001,
  executionTimeMs: 156,
  status: 'completed',
  errorMessage: null,
  createdAt: new Date().toISOString(),
  completedAt: new Date().toISOString(),
};

describe('MigrationReceipt', () => {
  const mockOnDismiss = jest.fn();

  it('should render migration details', () => {
    render(<MigrationReceipt migration={mockMigration} onDismiss={mockOnDismiss} />);
    
    expect(screen.getByText('Position Successfully Migrated')).toBeDefined();
    expect(screen.getAllByText('BTC/USDT:USDT')).toHaveLength(2);
    expect(screen.getByText('156ms')).toBeDefined();
    expect(screen.getByText('0.0001%')).toBeDefined();
  });

  it('should handle null values for execution time and slippage', () => {
    const incompleteMigration = { ...mockMigration, executionTimeMs: null, slippagePct: null };
    render(<MigrationReceipt migration={incompleteMigration} onDismiss={mockOnDismiss} />);
    
    expect(screen.getByText('0ms')).toBeDefined();
    expect(screen.getByText('0.0000%')).toBeDefined();
  });

  it('should trigger onDismiss when close button clicked', () => {
    render(<MigrationReceipt migration={mockMigration} onDismiss={mockOnDismiss} />);
    
    fireEvent.click(screen.getByText('Close Receipt'));
    expect(mockOnDismiss).toHaveBeenCalled();
  });
});
