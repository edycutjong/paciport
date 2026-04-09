import ccxt, { Exchange } from "ccxt";

interface ExchangeCredentials {
  apiKey: string;
  secret: string;
}

// CCXT Exchange Cache to avoid reinstantiating
const exchangeCache = new Map<string, Exchange>();

/**
 * Instantiate or get a cached CCXT exchange
 */
export function getExchangeClient(exchangeId: string, credentials: ExchangeCredentials): Exchange {
  const cacheKey = `${exchangeId}-${credentials.apiKey}`;

  if (exchangeCache.has(cacheKey)) {
    return exchangeCache.get(cacheKey)!;
  }

  // Handle mock pacifica exchange by instantiating binance testnet as a proxy
  const ccxtExchangeId = exchangeId === "pacifica" ? "binance" : exchangeId;

  if (!ccxt.exchanges.includes(ccxtExchangeId)) {
    throw new Error(`Unsupported exchange: ${exchangeId}`);
  }

  // @ts-ignore
  const ExchangeClass = ccxt[ccxtExchangeId];
  
  const client: Exchange = new ExchangeClass({
    apiKey: credentials.apiKey,
    secret: credentials.secret,
    enableRateLimit: true,
    options: {
      defaultType: "future",
    },
  });

  // If this is the pacifica mock, we can set it to a sandbox/testnet mode if supported
  if (exchangeId === "pacifica") {
    client.setSandboxMode(true);
  } else if (exchangeId === "binance") {
    // For demo safety, set binance to sandbox mode too unless real api keys are used
    if (credentials.apiKey.startsWith("mock")) {
        client.setSandboxMode(true);
    }
  }

  exchangeCache.set(cacheKey, client);
  return client;
}
