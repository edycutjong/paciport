import { type Migration, type Position } from './types';
import demoPositions from '../data/demo-positions.json';

// In-memory store for demo
let migrationsStore: Migration[] = [];

// Seed history
const seedHistory: Migration[] = [
  {
    id: 'mgr-1',
    positionId: 'pos-1',
    sourceExchange: 'binance',
    destinationExchange: 'pacifica',
    symbol: 'BTC/USDT',
    side: 'long',
    size: 0.1,
    leverage: 10,
    sourceClosePrice: 62000,
    destOpenPrice: 62005,
    slippagePct: 0.008,
    maxSlippagePct: 0.1,
    executionTimeMs: 1250,
    status: 'completed',
    errorMessage: null,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: new Date(Date.now() - 3598750).toISOString(),
  },
  {
    id: 'mgr-2',
    positionId: 'pos-2',
    sourceExchange: 'binance',
    destinationExchange: 'pacifica',
    symbol: 'ETH/USDT',
    side: 'short',
    size: 5,
    leverage: 5,
    sourceClosePrice: 3100,
    destOpenPrice: 3101,
    slippagePct: 0.03,
    maxSlippagePct: 0.1,
    executionTimeMs: 1420,
    status: 'completed',
    errorMessage: null,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    completedAt: new Date(Date.now() - 7198580).toISOString(),
  }
];

migrationsStore.push(...seedHistory);

export function getMockPositions(): Position[] {
  return demoPositions as Position[];
}

export function getMigrations(): Migration[] {
  return [...migrationsStore].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function createMigration(migration: Omit<Migration, 'id'>): Migration {
  const newMigration = { ...migration, id: `mgr-${Date.now()}` };
  migrationsStore.push(newMigration);
  return newMigration;
}

export function updateMigration(id: string, updates: Partial<Migration>): void {
  migrationsStore = migrationsStore.map(m => m.id === id ? { ...m, ...updates } : m);
}
