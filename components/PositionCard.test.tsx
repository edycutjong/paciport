import { render, screen, fireEvent } from '@testing-library/react';
import { PositionCard } from './PositionCard';
import { Position } from '@/lib/types';

const mockPosition: Position = {
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
  selectedForMigration: false,
};

describe('PositionCard', () => {
  const mockOnToggleSelect = jest.fn();

  it('should render position details', () => {
    render(<PositionCard position={mockPosition} />);
    expect(screen.getByText('BTC-PERP')).toBeDefined();
    expect(screen.getByText('LONG')).toBeDefined();
    expect(screen.getByText('10x')).toBeDefined();
    expect(screen.getByText('+$100.00')).toBeDefined();
  });

  it('should show short side correctly', () => {
    const shortPosition = { ...mockPosition, side: 'short' as const, unrealizedPnlUsd: -50 };
    render(<PositionCard position={shortPosition} />);
    expect(screen.getByText('SHORT')).toBeDefined();
    expect(screen.getByText('-$50.00')).toBeDefined();
  });

  it('should trigger onToggleSelect when clicked', () => {
    render(<PositionCard position={mockPosition} onToggleSelect={mockOnToggleSelect} />);
    fireEvent.click(screen.getByText('BTC-PERP'));
    expect(mockOnToggleSelect).toHaveBeenCalledWith('1');
  });

  it('should show selection indicator', () => {
    render(<PositionCard position={mockPosition} isSelected={true} />);
    // Check for checkmark icon or similar
    expect(document.querySelector('.bg-\\[\\#3b82f6\\]')).toBeDefined();
  });

  it('should show migrated badge', () => {
    render(<PositionCard position={mockPosition} isMigrated={true} />);
    expect(screen.getByText(/MIGRATED/)).toBeDefined();
  });
});
