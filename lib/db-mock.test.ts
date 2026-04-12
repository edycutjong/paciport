import { getMockPositions, getMigrations, createMigration, updateMigration } from './db-mock';

describe('lib/db-mock', () => {
  it('should return mock positions', () => {
    const positions = getMockPositions();
    expect(positions.length).toBeGreaterThan(0);
    expect(positions[0]).toHaveProperty('symbol');
  });

  it('should manage migrations store', () => {
    const initialCount = getMigrations().length;
    
    const newMigration = createMigration({
      positionId: 'test-pos',
      sourceExchange: 'binance',
      destinationExchange: 'pacifica',
      symbol: 'BTC/USDT',
      side: 'long',
      size: 1,
      leverage: 10,
      sourceClosePrice: null,
      destOpenPrice: null,
      slippagePct: null,
      maxSlippagePct: 0.1,
      executionTimeMs: null,
      status: 'pending',
      errorMessage: null,
      createdAt: new Date().toISOString(),
      completedAt: null,
    });

    expect(getMigrations().length).toBe(initialCount + 1);
    expect(newMigration.id).toContain('mgr-');

    updateMigration(newMigration.id, { status: 'completed' });
    const updated = getMigrations().find(m => m.id === newMigration.id);
    expect(updated?.status).toBe('completed');
  });

  it('should sort migrations by date descending', () => {
    const migrations = getMigrations();
    if (migrations.length >= 2) {
      const firstDate = new Date(migrations[0].createdAt).getTime();
      const secondDate = new Date(migrations[1].createdAt).getTime();
      expect(firstDate).toBeGreaterThanOrEqual(secondDate);
    }
  });
});
