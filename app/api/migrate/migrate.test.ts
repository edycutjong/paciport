import { POST } from './route';
import * as dbMock from '@/lib/db-mock';

jest.mock('@/lib/db-mock', () => ({
  createMigration: jest.fn().mockImplementation((id, data) => ({ id: 'mgr-1', ...data })),
  updateMigration: jest.fn(),
  getMockPositions: jest.fn(),
}));

// Mock global fetch
global.fetch = jest.fn();

describe('Migration API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return 400 if no positions selected', async () => {
    const req = new Request('http://localhost/api/migrate', {
      method: 'POST',
      body: JSON.stringify({ positionIds: [], maxSlippage: 0.1 }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('should handle positions not found', async () => {
    (dbMock.getMockPositions as jest.Mock).mockReturnValue([]);
    const req = new Request('http://localhost/api/migrate', {
      method: 'POST',
      body: JSON.stringify({ positionIds: ['non-existent'], maxSlippage: 0.1 }),
    });

    const res = await POST(req);
    expect(res.status).toBe(404);
  });

  it('should handle JSON parse error', async () => {
    const req = new Request('http://localhost/api/migrate', {
      method: 'POST',
      body: 'invalid-json',
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
  });

  it('should execute migration for long positions', async () => {
    const mockPos = { id: 'pos-1', symbol: 'BTC/USDT', side: 'long', size: 1, leverage: 10, currentPrice: 50000 };
    (dbMock.getMockPositions as jest.Mock).mockReturnValue([mockPos]);
    (dbMock.createMigration as jest.Mock).mockReturnValue({ id: 'mgr-1' });

    const req = new Request('http://localhost/api/migrate', {
      method: 'POST',
      body: JSON.stringify({ positionIds: ['pos-1'], maxSlippage: 0.1 }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    
    // Fast forward background simulation
    jest.runAllTimers();
    await Promise.resolve(); // flush microtasks
    
    expect(dbMock.updateMigration).toHaveBeenCalledWith('mgr-1', expect.objectContaining({ status: 'completed' }));
  });

  it('should execute migration for short positions and handle warnings', async () => {
    const mockPos = { id: 'pos-2', symbol: 'ETH/USDT', side: 'short', size: 10, leverage: 5, currentPrice: 3000 };
    (dbMock.getMockPositions as jest.Mock).mockReturnValue([mockPos]);
    (dbMock.createMigration as jest.Mock).mockReturnValue({ id: 'mgr-2' });

    // Set maxSlippage very low to trigger warning
    const req = new Request('http://localhost/api/migrate', {
      method: 'POST',
      body: JSON.stringify({ positionIds: ['pos-2'], maxSlippage: -1 }), // -1 will always be < Math.random()
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    
    jest.runAllTimers();
    await Promise.resolve();
    
    expect(dbMock.updateMigration).toHaveBeenCalledWith('mgr-2', expect.objectContaining({ status: 'warning' }));
  });
});
