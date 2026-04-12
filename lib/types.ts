export interface Position {
  id: string;
  symbol: string;           // 'SOL/USDT:USDT'
  displaySymbol: string;    // 'SOL-PERP'
  side: 'long' | 'short';
  size: number;
  entryPrice: number;
  currentPrice: number;
  leverage: number;
  marginUsd: number;
  unrealizedPnlUsd: number;
  notionalUsd: number;
  selectedForMigration: boolean;
}

export type MigrationStatus = 'pending' | 'executing' | 'completed' | 'failed' | 'rolled_back' | 'warning';

export interface Migration {
  id: string;
  positionId: string;
  sourceExchange: string;
  destinationExchange: string;
  symbol: string;
  side: 'long' | 'short';
  size: number;
  leverage: number;
  sourceClosePrice: number | null;
  destOpenPrice: number | null;
  slippagePct: number | null;
  maxSlippagePct: number;
  executionTimeMs: number | null;
  status: MigrationStatus;
  errorMessage: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface FeeComparison {
  sourceFeeRate: number;    // 0.0004
  destFeeRate: number;      // 0.0002
  monthlySavingsUsd: number;
  annualSavingsUsd: number;
}

export interface MigrationRequest {
  positionIds: string[];
  maxSlippage: number;      // 0.001 = 0.1%
  dryRun: boolean;
}

export interface ExchangeConnection {
  id: string;
  exchange: 'binance' | 'bybit' | 'okx';
  status: 'connected' | 'disconnected' | 'error';
  positionsCount: number;
  totalNotionalUsd: number;
}
