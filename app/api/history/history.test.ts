import { GET } from './route';
import { NextResponse } from 'next/server';
import { getMigrations } from '@/lib/db-mock';

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: async () => data,
      status: init?.status || 200,
    })),
  },
}));

jest.mock('@/lib/db-mock', () => ({
  getMigrations: jest.fn(),
}));

describe('app/api/history', () => {
  it('should return migrations successfully', async () => {
    (getMigrations as jest.Mock).mockReturnValue([{ id: '1' }]);
    
    const response = await GET();
    const data = await response.json();
    
    expect(data.migrations).toEqual([{ id: '1' }]);
    expect(NextResponse.json).toHaveBeenCalled();
  });

  it('should handle errors', async () => {
    (getMigrations as jest.Mock).mockImplementation(() => {
      throw new Error('DB Error');
    });
    
    const response = await GET();
    const data = await response.json();
    
    expect(data.error).toBe('DB Error');
    expect(response.status).toBe(500);
  });
});
