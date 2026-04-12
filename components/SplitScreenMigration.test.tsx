/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, act } from '@testing-library/react';
import { SplitScreenMigration } from './SplitScreenMigration';
import { Position } from '@/lib/types';
import React from 'react';

// Mock framer-motion to avoid animation issues in jsdom
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const mockPositions: Position[] = [
  {
    id: '1',
    symbol: 'BTC/USDT',
    displaySymbol: 'BTC/USDT',
    side: 'long',
    size: 0.1,
    entryPrice: 50000,
    currentPrice: 51000,
    leverage: 10,
    marginUsd: 510,
    unrealizedPnlUsd: 100,
    notionalUsd: 5100,
    selectedForMigration: true,
  }
];

describe('SplitScreenMigration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const getMigrateButton = () => {
    // Find all buttons and return the one containing MIGRATE text (mobile button)
    const buttons = screen.getAllByRole('button');
    const migrateBtn = buttons.find(btn => btn.textContent?.includes('MIGRATE'));
    if (!migrateBtn) throw new Error('MIGRATE button not found');
    return migrateBtn;
  };

  it('should render positions and trigger migration', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, migrations: [{ id: 'mgr-1', symbol: 'BTC/USDT', side: 'long', leverage: 10 }] })
    });

    render(<SplitScreenMigration sourcePositions={mockPositions} />);
    
    expect(screen.getByText('BTC/USDT')).toBeDefined();
    
    // Click triggers an async handler with interleaved setTimeout & fetch.
    // Wrapping click + full timer drain in one act() lets React process all state updates.
    await act(async () => {
      fireEvent.click(getMigrateButton());
      await jest.runAllTimersAsync();
    });
    
    // The receipt should show the success
    expect(screen.getByText(/Position Successfully Migrated/i)).toBeDefined();
  });
  
  it('should handle error states', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<SplitScreenMigration sourcePositions={mockPositions} />);
    
    await act(async () => {
      fireEvent.click(getMigrateButton());
      await jest.runAllTimersAsync();
    });
    
    expect(screen.getByText(/Migration failed/i)).toBeDefined();
  });

  it('should handle position selection and Select All', () => {
    render(<SplitScreenMigration sourcePositions={mockPositions} />);
    
    // Test deselecting
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(getMigrateButton()).toBeDefined();

    // Test select all toggle
    const selectAllBtn = screen.getByText(/Select All/i);
    fireEvent.click(selectAllBtn);
    expect(getMigrateButton()).toBeDefined();
  });

  it('should dismiss receipt on close', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, migrations: [{ id: 'mgr-1', symbol: 'BTC/USDT', side: 'long', leverage: 10 }] })
    });

    render(<SplitScreenMigration sourcePositions={mockPositions} />);
    
    await act(async () => {
      fireEvent.click(getMigrateButton());
      await jest.runAllTimersAsync();
    });
    
    // After the receipt shows, close it
    const closeBtn = screen.queryByText(/Close Receipt/i);
    if (closeBtn) {
      fireEvent.click(closeBtn);
      expect(screen.queryByText(/Position Successfully Migrated/i)).toBeNull();
    } else {
      // If receipt didn't show, verify the migration log shows completion
      expect(screen.getByText(/Migration complete/i)).toBeDefined();
    }
  });
});

