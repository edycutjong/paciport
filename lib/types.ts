export interface Position {
  id: string;
  symbol: string;
  side: "long" | "short";
  size: number;
  entryPrice: number;
  currentPrice: number;
  leverage: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  notional: number;
  marginType: "cross" | "isolated";
  exchange: string;
}

export interface MigrationRequest {
  positionIds: string[];
  sourceExchange: string;
  destinationExchange: string;
  maxSlippage: number;
  dryRun: boolean;
}

export interface MigrationLeg {
  exchange: string;
  action: "close" | "open";
  symbol: string;
  side: "buy" | "sell";
  size: number;
  orderType: "limit" | "market";
  price: number;
  fillPrice: number | null;
  slippage: number | null;
  status: "pending" | "submitted" | "filled" | "failed" | "rolled_back";
  timestamp: number | null;
  orderId: string | null;
}

export interface MigrationResult {
  id: string;
  status: "pending" | "executing" | "success" | "partial" | "failed" | "rolled_back";
  position: Position;
  sourceLeg: MigrationLeg;
  destinationLeg: MigrationLeg;
  executionTimeMs: number | null;
  netSlippage: number | null;
  startedAt: number;
  completedAt: number | null;
  error: string | null;
}

export interface ExchangeConnection {
  exchange: string;
  status: "disconnected" | "connecting" | "connected" | "error";
  apiKeyPreview: string | null;
  positionCount: number;
  totalNotional: number;
}

export interface FeeSavings {
  sourceExchange: string;
  destinationExchange: string;
  sourceMakerFee: number;
  sourceTakerFee: number;
  destinationMakerFee: number;
  destinationTakerFee: number;
  estimatedMonthlyVolume: number;
  annualSavings: number;
}

export type MigrationStep =
  | { type: "connecting"; exchange: string }
  | { type: "submitting"; exchange: string; action: "close" | "open" }
  | { type: "waiting_fill"; exchange: string }
  | { type: "filled"; exchange: string; price: number; slippage: number }
  | { type: "complete"; timeMs: number; netSlippage: number }
  | { type: "error"; message: string }
  | { type: "rollback"; exchange: string };
