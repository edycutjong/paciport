import { GET } from './route';
import * as dbMock from '@/lib/db-mock';

jest.mock('@/lib/db-mock', () => ({
  getMockPositions: jest.fn(),
}));

describe('Positions API', () => {
  it('should return mock positions', async () => {
    (dbMock.getMockPositions as jest.Mock).mockReturnValue([
      { id: '1', symbol: 'BTC/USDT' }
    ]);

    const res = await GET();
    const data = await res.json();
    
    expect(res.status).toBe(200);
    expect(data.positions).toHaveLength(1);
    expect(data.positions[0].symbol).toBe('BTC/USDT');
  });
});
