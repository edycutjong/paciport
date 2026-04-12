import { NextResponse } from 'next/server';
import { createMigration, getMockPositions, updateMigration } from '@/lib/db-mock';
import type { MigrationRequest, Position } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const body: MigrationRequest = await req.json();
    const { positionIds, maxSlippage } = body;

    if (!positionIds || positionIds.length === 0) {
      return NextResponse.json({ error: 'No positions selected' }, { status: 400 });
    }

    const positions = getMockPositions().filter((p) => positionIds.includes(p.id));
    if (positions.length === 0) {
      return NextResponse.json({ error: 'Positions not found' }, { status: 404 });
    }

    const migrationStatuses: any[] = [];

    // Process migrations concurrently but track them individually
    for (const position of positions) {
      // 1. Create pending migration
      const migration = createMigration({
        positionId: position.id,
        sourceExchange: 'binance',
        destinationExchange: 'pacifica',
        symbol: position.symbol,
        side: position.side,
        size: position.size,
        leverage: position.leverage,
        sourceClosePrice: null,
        destOpenPrice: null,
        slippagePct: null,
        maxSlippagePct: maxSlippage,
        executionTimeMs: null,
        status: 'pending',
        errorMessage: null,
        createdAt: new Date().toISOString(),
        completedAt: null,
      });

      migrationStatuses.push(migration);

      // We do not await execution here, we just kick it off in the background
      // This is a simplified "mock" engine execution.
      executeDeltaNeutralMigration(migration.id, position, maxSlippage);
    }

    return NextResponse.json({ 
      success: true, 
      migrations: migrationStatuses 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Background simulation of migration executing
async function executeDeltaNeutralMigration(migrationId: string, position: Position, maxSlippage: number) {
  const startTime = Date.now();
  
  // Update status to executing
  updateMigration(migrationId, { status: 'executing' });

  // Simulate concurrent API execution time (~100-300ms)
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));

  const endTime = Date.now();
  const executionTimeMs = endTime - startTime;

  // Mock slippage calculation (very low for demo)
  const slippagePct = (Math.random() * 0.05); // 0% to 0.05%
  
  const destPriceModifier = position.side === 'long' 
    ? (1 + slippagePct / 100) 
    : (1 - slippagePct / 100);
    
  let status: 'completed' | 'failed' | 'warning' = 'completed';
  
  if (slippagePct > maxSlippage) {
    status = 'warning';
  }

  updateMigration(migrationId, {
    status: status,
    sourceClosePrice: position.currentPrice,
    destOpenPrice: position.currentPrice * destPriceModifier,
    slippagePct: slippagePct,
    executionTimeMs,
    completedAt: new Date().toISOString(),
  });
}
