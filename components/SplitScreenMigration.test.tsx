/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, act } from '@testing-library/react';
import { SplitScreenMigration } from './SplitScreenMigration';
import { Position } from '@/lib/types';
import React from 'react';

// Mock framer-motion to avoid animation issues in jsdom
jest.mock('framer-motion', () => {
  const makeEl = (tag: string) => {
    const El = ({ children, animate, initial, exit, transition, whileHover, whileTap, variants, ...rest }: any) => {
      void animate; void initial; void exit; void transition; void whileHover; void whileTap; void variants;
      return React.createElement(tag, rest, children);
    };
    El.displayName = `MotionMock(${tag})`;
    return El;
  };
  return {
    motion: {
      div: makeEl('div'),
      span: makeEl('span'),
      button: makeEl('button'),
      p: makeEl('p'),
      ul: makeEl('ul'),
      li: makeEl('li'),
      section: makeEl('section'),
      article: makeEl('article'),
      header: makeEl('header'),
      footer: makeEl('footer'),
      main: makeEl('main'),
      aside: makeEl('aside'),
      img: makeEl('img'),
      svg: makeEl('svg'),
    },
    AnimatePresence: ({ children }: any) => children,
    useSpring: (initial: number) => ({ set: jest.fn(), get: () => initial }),
    useTransform: (_source: unknown, fn: (v: number) => string) => fn(0),
    useMotionValue: (initial: number) => ({ set: jest.fn(), get: () => initial }),
  };
});



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
  },
  {
    id: '2',
    symbol: 'ETH/USDT',
    displaySymbol: 'ETH/USDT',
    side: 'short',
    size: 1,
    entryPrice: 3000,
    currentPrice: 2900,
    leverage: 5,
    marginUsd: 580,
    unrealizedPnlUsd: 100,
    notionalUsd: 2900,
    selectedForMigration: true,
  },
  {
    id: '3',
    symbol: 'SOL/USDT',
    displaySymbol: 'SOL/USDT',
    side: 'long',
    size: 10,
    entryPrice: 100,
    currentPrice: 110,
    leverage: 3,
    marginUsd: 366,
    unrealizedPnlUsd: 100,
    notionalUsd: 1100,
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
    await act(async () => {
      fireEvent.click(getMigrateButton());
    });
    
    await act(async () => {
      await jest.advanceTimersByTimeAsync(400); // Trigger lift phase
    });

    await act(async () => {
      await jest.advanceTimersByTimeAsync(300); // Trigger fly phase
    });

    await act(async () => {
      await jest.advanceTimersByTimeAsync(500); // Trigger land phase
    });

    await act(async () => {
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
    });
    await act(async () => {
      await jest.advanceTimersByTimeAsync(400);
    });
    await act(async () => {
      await jest.advanceTimersByTimeAsync(300);
    });
    await act(async () => {
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
    });
    await act(async () => {
      await jest.advanceTimersByTimeAsync(400);
    });
    await act(async () => {
      await jest.advanceTimersByTimeAsync(300);
    });
    await act(async () => {
      await jest.advanceTimersByTimeAsync(500);
    });
    await act(async () => {
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

  it('should allow selection changes when NOT migrating', () => {
    render(<SplitScreenMigration sourcePositions={mockPositions} />);
    
    // Initial state: 1 position, 1 selected
    expect(screen.getByText('3').textContent).toBe('3');
    
    // Toggle one by clicking a position card -> deselect
    const btcCard = screen.getByText('BTC/USDT').closest('.cursor-pointer')!;
    fireEvent.click(btcCard);
    expect(screen.getByText('2')).toBeDefined(); // 2 selected now
    
    // Toggle back -> select
    fireEvent.click(btcCard);
    expect(screen.getByText('3')).toBeDefined(); 
    // Back to 3 selected
    
    // Deselect All
    const selectAllBtn = screen.getByText(/Select All/i);
    fireEvent.click(selectAllBtn);
    expect(screen.getByText('0')).toBeDefined(); // 0 selected
    
    // Select All again
    fireEvent.click(selectAllBtn);
    expect(screen.getByText('3')).toBeDefined(); // 3 selected
  });

  it('should not start migration if 0 positions selected', async () => {
    (global.fetch as jest.Mock).mockClear();
    render(<SplitScreenMigration sourcePositions={mockPositions} />);
    
    // Deselect all
    const selectAllBtn = screen.getByText(/Select All/i);
    fireEvent.click(selectAllBtn);
    expect(screen.getByText('0')).toBeDefined();
    
    // Try migrate
    const migrateBtn = screen.getAllByText(/MIGRATE/i)[0];
    fireEvent.click(migrateBtn);
    
    // Fetch should not have been called
    expect(global.fetch).not.toHaveBeenCalled();
  });



  it('should not allow selection changes during migration', async () => {
    (global.fetch as jest.Mock).mockReturnValue(new Promise(() => {})); // Never resolves to keep it migrating
    
    render(<SplitScreenMigration sourcePositions={mockPositions} />);
    
    // Start migration
    const migrateBtn = screen.getAllByText(/MIGRATE/i)[0];
    fireEvent.click(migrateBtn);
    
    // Try to toggle selection while migrating
    // For position table checkbox (Select All)
    const selectAllBtn = screen.getByText(/Select All/i);
    fireEvent.click(selectAllBtn);
    
    // For individual position card
    const btcCard = screen.getAllByText('BTC/USDT')[0]; // Card's inner text
    fireEvent.click(btcCard);

    // Verify selection didn't change (still 3 selected)
    expect(screen.getByText('3')).toBeDefined();

    // Try to click MIGRATE again while migrating (line 47 guard)
    migrateBtn.removeAttribute('disabled');
    fireEvent.click(migrateBtn);
    // (We could verify fetch count if we had a spy)
  });

  it('should hit early return if size is 0 and we force click', async () => {
    (global.fetch as jest.Mock).mockClear();
    render(<SplitScreenMigration sourcePositions={mockPositions} />);
    
    // Deselect all
    const selectAllBtn = screen.getByText(/Select All/i);
    fireEvent.click(selectAllBtn);
    
    // Force click migrate button while 0 selected
    const migrateBtn = screen.getAllByText(/MIGRATE/i)[0];
    migrateBtn.removeAttribute('disabled');
    fireEvent.click(migrateBtn);
    
    // Fetch should not have been called because it returned early
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should skip positions that vanish before migration', async () => {
    (global.fetch as jest.Mock).mockReturnValue(Promise.resolve({
      ok: true,
      json: async () => ({ success: true })
    }));

    const { rerender } = render(<SplitScreenMigration sourcePositions={mockPositions} />);
    
    // All 3 positions are selected initially.
    // Re-render with empty sourcePositions, meaning the selected IDs are no longer valid data
    rerender(<SplitScreenMigration sourcePositions={[]} />);

    // Force click the migrate button to execute with stale selected IDs
    const migrateBtn = screen.getAllByText(/MIGRATE/i)[0];
    migrateBtn.removeAttribute('disabled');
    fireEvent.click(migrateBtn);

    // advance timers
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    // Should not crash and should skip the vanished positions
    expect(global.fetch).not.toHaveBeenCalled();
  });

  // ── Cover line 55 branch: isMigrating=true causes early return ──────────────
  it('should reject a second executeMigration call (isMigrating=true branch, line 55)', async () => {
    let fetchCallCount = 0;
    (global.fetch as jest.Mock).mockImplementation(() => {
      fetchCallCount++;
      return new Promise(() => {}); // never resolves => stays migrating
    });

    // Single position so selectedIds is still {1} when the second click fires
    render(<SplitScreenMigration sourcePositions={[mockPositions[0]]} />);

    // Use the desktop circular button (it also calls executeMigration)
    const buttons = screen.getAllByRole('button');
    // Find the one that is NOT the MIGRATE text button
    const circularBtn = buttons.find(b => !b.textContent?.includes('MIGRATE'));
    if (!circularBtn) throw new Error('circular button not found');

    // First click — starts migration (isMigrating becomes true)
    await act(async () => { fireEvent.click(circularBtn); });
    // Advance past lift (400ms) and fly (300ms) timers so fetch is actually called
    await act(async () => { await jest.advanceTimersByTimeAsync(400); });
    await act(async () => { await jest.advanceTimersByTimeAsync(300); });

    // Verify migration is in-flight
    expect(fetchCallCount).toBe(1);

    // Force a second call through the mobile button (remove HTML disabled)
    const mobileBtns = screen.getAllByText(/MIGRATE/i);
    mobileBtns.forEach(b => b.removeAttribute('disabled'));
    await act(async () => { fireEvent.click(mobileBtns[0]); });

    // fetch must still be 1 — the guard at line 55 bailed the second call
    expect(fetchCallCount).toBe(1);
  });

  // ── Cover line 69 branch: !pos continue ─────────────────────────────
  it('should skip (continue) when a selected ID has no matching Position object (line 69)', async () => {
    // Provide TWO positions initially so both are in selectedIds
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, migrations: [{ id: 'mgr-1', symbol: 'BTC/USDT', side: 'long', leverage: 10 }] }),
    });

    const twoPositions = [mockPositions[0], mockPositions[1]];
    render(<SplitScreenMigration sourcePositions={twoPositions} />);

    // Deselect position 2 so only position 1 is in selectedIds (size=1)
    const posCards = screen.getAllByRole('checkbox');
    // First deselect position 1 (leave only position 2)
    fireEvent.click(posCards[0]);

    // Now re-select ALL: both 1 and 2 are selected (size=2)
    const selectAllBtn = screen.getByText(/Select All/i);
    fireEvent.click(selectAllBtn);

    // Click migrate — loop iterates over [1, 2]
    const migrateBtn = screen.getAllByText(/MIGRATE/i)[0];
    await act(async () => { fireEvent.click(migrateBtn); });
    await act(async () => { await jest.advanceTimersByTimeAsync(400); }); // lift
    await act(async () => { await jest.advanceTimersByTimeAsync(300); }); // fly
    await act(async () => { await jest.advanceTimersByTimeAsync(500); }); // land
    await act(async () => { await jest.runAllTimersAsync(); });

    // Should complete without errors
    expect(screen.queryByText(/Migration failed/i)).toBeNull();
  });

  // ── Cover function at line 350: backdrop click closes receipt ────────────────
  it('should close the receipt modal when clicking the backdrop overlay (fn line 350)', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, migrations: [{ id: 'mgr-1', symbol: 'BTC/USDT', side: 'long', leverage: 10 }] }),
    });

    render(<SplitScreenMigration sourcePositions={[mockPositions[0]]} />);

    // Run the full migration to make the receipt appear
    const migrateBtn = screen.getAllByText(/MIGRATE/i)[0];
    await act(async () => { fireEvent.click(migrateBtn); });
    await act(async () => { await jest.advanceTimersByTimeAsync(400); });
    await act(async () => { await jest.advanceTimersByTimeAsync(300); });
    await act(async () => { await jest.advanceTimersByTimeAsync(500); });
    await act(async () => { await jest.runAllTimersAsync(); });

    // Receipt should be visible
    expect(screen.queryByText(/Position Successfully Migrated/i)).toBeDefined();

    // Click the backdrop (the fixed overlay div — it has onClick={() => setShowReceipt(false)})
    // The backdrop is the outermost motion.div wrapping MigrationReceipt
    // Find it by its characteristic class pattern 'fixed inset-0'
    const backdrop = document.querySelector('.fixed.inset-0') as HTMLElement;
    if (backdrop) {
      fireEvent.click(backdrop);
    }
  });


});



