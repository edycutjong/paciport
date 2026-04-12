import { supabase, getExchangeCredentials } from './supabase';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(),
  })),
}));

describe('lib/supabase', () => {
  it('should export a supabase client', () => {
    expect(supabase).toBeDefined();
  });

  it('should return mock credentials', async () => {
    const credentials = await getExchangeCredentials('user-1', 'binance');
    expect(credentials.apiKey).toBe('mock-api-key-binance');
    expect(credentials.secret).toBe('mock-secret-binance');
  });
});
