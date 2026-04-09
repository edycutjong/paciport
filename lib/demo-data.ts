import { Position, MigrationResult, FeeSavings } from "./types";

export const DEMO_POSITIONS: Position[] = [
  {
    id: "pos-sol-long",
    symbol: "SOL-PERP",
    side: "long",
    size: 100,
    entryPrice: 142.5,
    currentPrice: 148.2,
    leverage: 10,
    unrealizedPnl: 570.0,
    unrealizedPnlPercent: 4.0,
    notional: 14820,
    marginType: "cross",
    exchange: "binance",
  },
  {
    id: "pos-eth-short",
    symbol: "ETH-PERP",
    side: "short",
    size: 2,
    entryPrice: 3420.0,
    currentPrice: 3380.0,
    leverage: 5,
    unrealizedPnl: 80.0,
    unrealizedPnlPercent: 1.17,
    notional: 6760,
    marginType: "cross",
    exchange: "binance",
  },
  {
    id: "pos-btc-long",
    symbol: "BTC-PERP",
    side: "long",
    size: 0.15,
    entryPrice: 68500.0,
    currentPrice: 69200.0,
    leverage: 3,
    unrealizedPnl: 105.0,
    unrealizedPnlPercent: 1.02,
    notional: 10380,
    marginType: "isolated",
    exchange: "binance",
  },
];

export const DEMO_MIGRATION_HISTORY: MigrationResult[] = [
  {
    id: "mig-001",
    status: "success",
    position: DEMO_POSITIONS[0],
    sourceLeg: {
      exchange: "binance",
      action: "close",
      symbol: "SOL-PERP",
      side: "sell",
      size: 100,
      orderType: "limit",
      price: 148.2,
      fillPrice: 148.18,
      slippage: 0.0135,
      status: "filled",
      timestamp: Date.now() - 3600000,
      orderId: "BN-001",
    },
    destinationLeg: {
      exchange: "pacifica",
      action: "open",
      symbol: "SOL-PERP",
      side: "buy",
      size: 100,
      orderType: "limit",
      price: 148.2,
      fillPrice: 148.22,
      slippage: 0.0135,
      status: "filled",
      timestamp: Date.now() - 3600000 + 50,
      orderId: "PC-001",
    },
    executionTimeMs: 1412,
    netSlippage: 0.027,
    startedAt: Date.now() - 3600000,
    completedAt: Date.now() - 3600000 + 1412,
    error: null,
  },
];

export const DEMO_FEE_SAVINGS: FeeSavings = {
  sourceExchange: "Binance",
  destinationExchange: "Pacifica",
  sourceMakerFee: 0.02,
  sourceTakerFee: 0.04,
  destinationMakerFee: 0.01,
  destinationTakerFee: 0.03,
  estimatedMonthlyVolume: 500000,
  annualSavings: 6000,
};

export function simulatePriceUpdate(positions: Position[]): Position[] {
  return positions.map((p) => {
    const drift = (Math.random() - 0.48) * 0.002;
    const newPrice = p.currentPrice * (1 + drift);
    const priceDiff = newPrice - p.entryPrice;
    const pnl = p.side === "long" ? priceDiff * p.size : -priceDiff * p.size;
    const pnlPercent = (pnl / (p.entryPrice * p.size)) * 100 * p.leverage;
    return {
      ...p,
      currentPrice: Number(newPrice.toFixed(2)),
      unrealizedPnl: Number(pnl.toFixed(2)),
      unrealizedPnlPercent: Number(pnlPercent.toFixed(2)),
      notional: Number((newPrice * p.size).toFixed(2)),
    };
  });
}
