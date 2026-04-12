import { render, screen, fireEvent } from '@testing-library/react';
import { PositionTable } from './PositionTable';
import { Position } from '@/lib/types';

const mockPositions: Position[] = [
  {
    id: '1',
    symbol: 'BTC/USDT:USDT',
    displaySymbol: 'BTC-PERP',
    side: 'long',
    size: 0.1,
    entryPrice: 50000,
    currentPrice: 51000,
    leverage: 10,
    marginUsd: 500,
    unrealizedPnlUsd: 100,
    notionalUsd: 5100,
    selectedForMigration: true,
  },
  {
    id: '2',
    symbol: 'ETH/USDT:USDT',
    displaySymbol: 'ETH-PERP',
    side: 'short',
    size: 1,
    entryPrice: 3000,
    currentPrice: 2900,
    leverage: 5,
    marginUsd: 600,
    unrealizedPnlUsd: 100,
    notionalUsd: 2900,
    selectedForMigration: false,
  }
];

describe('PositionTable', () => {
  const mockOnToggleSelect = jest.fn();
  const mockOnSelectAll = jest.fn();

  it('should render table with positions', () => {
    render(
      <PositionTable
        positions={mockPositions}
        selectedIds={new Set(['1'])}
        onToggleSelect={mockOnToggleSelect}
        onSelectAll={mockOnSelectAll}
      />
    );

    expect(screen.getByText('BTC-PERP')).toBeDefined();
    expect(screen.getByText('ETH-PERP')).toBeDefined();
    expect(screen.getByText('1')).toBeDefined(); // selected count
  });

  it('should render empty state', () => {
    render(
      <PositionTable
        positions={[]}
        selectedIds={new Set()}
        onToggleSelect={mockOnToggleSelect}
        onSelectAll={mockOnSelectAll}
      />
    );

    expect(screen.getByText('No open positions found.')).toBeDefined();
  });

  it('should trigger onSelectAll when header checkbox clicked', () => {
    render(
      <PositionTable
        positions={mockPositions}
        selectedIds={new Set(['1'])}
        onToggleSelect={mockOnToggleSelect}
        onSelectAll={mockOnSelectAll}
      />
    );

    const checkbox = screen.getByLabelText(/Select All/i);
    fireEvent.click(checkbox);
    expect(mockOnSelectAll).toHaveBeenCalled();
  });
});
