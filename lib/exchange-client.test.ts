import { getExchangeClient } from './exchange-client';
import ccxt from 'ccxt';

jest.mock('ccxt', () => {
  const mockExchange = {
    setSandboxMode: jest.fn(),
  };
  return {
    exchanges: ['binance', 'bybit', 'okx'],
    binance: jest.fn().mockImplementation(() => mockExchange),
    bybit: jest.fn().mockImplementation(() => mockExchange),
    okx: jest.fn().mockImplementation(() => mockExchange),
  };
});

describe('getExchangeClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new binance client', () => {
    const credentials = { apiKey: 'real-key', secret: 'secret' };
    const client = getExchangeClient('binance', credentials);
    expect(client).toBeDefined();
    expect(ccxt.binance).toHaveBeenCalled();
  });

  it('should return cached client', () => {
    const credentials = { apiKey: 'cache-key', secret: 'secret' };
    const client1 = getExchangeClient('binance', credentials);
    const client2 = getExchangeClient('binance', credentials);
    expect(client1).toBe(client2);
    expect(ccxt.binance).toHaveBeenCalledTimes(1);
  });

  it('should throw error for unsupported exchange', () => {
    const credentials = { apiKey: 'key', secret: 'secret' };
    expect(() => getExchangeClient('unsupported', credentials)).toThrow('Unsupported exchange: unsupported');
  });

  it('should handle pacifica as binance with sandbox', () => {
    const credentials = { apiKey: 'pacifica-key', secret: 'secret' };
    const client = getExchangeClient('pacifica', credentials);
    expect(client.setSandboxMode).toHaveBeenCalledWith(true);
  });

  it('should set sandbox for binance with mock key', () => {
    const credentials = { apiKey: 'mock-key', secret: 'secret' };
    const client = getExchangeClient('binance', credentials);
    expect(client.setSandboxMode).toHaveBeenCalledWith(true);
  });
});
