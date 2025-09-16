export interface TokenData {
  token0Symbol: string;
  token1Symbol: string;
  token1Name: string;
  token1Address: string;
  chainId: number;
  routerAddress: string;
  age: Date;
  pairAddress: string;
  price: number;
  volume: number | null;
  priceChangePcs: {
    '5m': number;
    '1h': number;
    '6h': number;
    '24h': number;
  };
  liquidity: number;
  fdv: number;
  transactions: {
    makers: number | null;
    txns: number | null;
    buys: number | null;
    sells: number | null;
  };
  fees: {
    buy: number;
    sell: number;
  };
  mcap: {
    current: number;
    initial: number;
    percentChange: number | null;
  };
  audit: {
    contractRenounced: boolean;
    contractVerified: boolean;
    liquidityLocked: boolean;
    liquidityLockedRatio: number;
    isMintAuthDisabled: boolean;
    isFreezeAuthDisabled: boolean;
    honeyPot: boolean;
  };
  socialLinks: {
    twitter: string | null;
    telegram: string | null;
    discord: string | null;
    website: string | null;
  };
  tokenInfo: {
    totalSupply: string;
    decimals: number;
    imageUri: string | null;
  };
  reserves: {
    reserves0: string;
    reserves1: string;
    reserves0Usd: number;
    reserves1Usd: number;
    token0Decimals: number;
  };
  migration: {
    migratedFromPairAddress: string | null;
    migratedFromPairCreatedAt: string | null;
    migratedFromRouterAddress: string | null;
    migratedFromVirtualRouter: string | null;
    virtualRouterType: string | null;
    migrationProgress: number | null;
  };
  holders: {
    devHoldings: string;
    devWalletRatio: number | null;
    insiders: number;
    insiderHoldings: string;
    insiderWalletRatio: number | null;
    bundlers: number;
    bundlerHoldings: string;
    bundlerWalletRatio: number | null;
    snipers: number;
    sniperHoldings: string;
    sniperWalletRatio: number | null;
    traders: number;
    traderHoldings: string;
    traderWalletRatio: number | null;
    top10Holdings: string;
    top10Ratio: number;
  };
  dexPaid: boolean;
  callCount: number;
}

export interface GetScannerResultParams {
  chain?: 'ETH' | 'SOL' | 'BASE' | 'BSC';
  rankBy?: 'volume' | 'age';
  isNotHP?: boolean;
  minVolume?: number;
  maxAge?: number;
  minMcap?: number;
  page?: number;
  limit?: number;
}

export interface ScannerApiResponse {
  success?: boolean;
  pairs: ScannerResult[];
  totalRows: number;
  stats: any;
  data?: ScannerResult[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface ScannerResult {
  token0Symbol: string;
  token1Symbol: string;
  token1Name: string;
  token1Address: string;
  chainId: number;
  routerAddress: string;
  age: string;
  pairAddress: string;
  price: string;
  volume: string | null;
  first5M: string;
  first1H: string;
  first6H: string;
  first24H: string;
  diff5M: string;
  diff1H: string;
  diff6H: string;
  diff24H: string;
  liquidity: string;
  fdv: string;
  makers: number | null;
  txns: number | null;
  buys: number | null;
  sells: number | null;
  buyFee: number;
  sellFee: number;
  currentMcap: string;
  initialMcap: string;
  percentChangeInMcap: string | null;
  contractRenounced: boolean;
  contractVerified: boolean;
  liquidityLocked: boolean;
  liquidityLockedRatio: string;
  liquidityLockedAmount: string | null;
  isMintAuthDisabled: boolean;
  isFreezeAuthDisabled: boolean;
  honeyPot: boolean;
  percentChangeInLiquidity: string;
  pairMcapUsd: string;
  pairMcapUsdInitial: string;
  twitterLink: string | null;
  telegramLink: string | null;
  discordLink: string | null;
  webLink: string | null;
  token1TotalSupplyFormatted: string;
  token1Decimals: number;
  token1ImageUri: string | null;
  reserves0: string;
  reserves1: string;
  reserves0Usd: string;
  reserves1Usd: string;
  token0Decimals: number;
  migratedFromPairAddress: string | null;
  migratedFromPairCreatedAt: string | null;
  migratedFromRouterAddress: string | null;
  callCount: number;
  migrationProgress: string | null;
  dexPaid: boolean;
  devHoldings: string;
  token1DevWalletToTotalSupplyRatio: string | null;
  insiders: number;
  insiderHoldings: string;
  token1InsiderWalletToTotalSupplyRatio: string | null;
  bundlers: number;
  bundlerHoldings: string;
  token1BundlerWalletToTotalSupplyRatio: string | null;
  snipers: number;
  sniperHoldings: string;
  token1SniperWalletToTotalSupplyRatio: string | null;
  traders: number;
  traderHoldings: string;
  token1TraderWalletToTotalSupplyRatio: string | null;
  top10Holdings: string;
  token1Top10ToTotalSupplyRatio: string;
  migratedFromVirtualRouter: string | null;
  virtualRouterType: string | null;
}

export interface WebSocketTickEvent {
  event: 'tick';
  data: {
    pair: {
      pair: string;
      token: string;
      chain: string;
    };
    swaps: {
      isOutlier: boolean;
      priceToken1Usd: string;
      volumeUsd?: string;
      side?: 'buy' | 'sell';
    }[];
  };
}

export interface WebSocketPairStatsEvent {
  event: 'pair-stats';
  data: {
    pair: {
      pairCreatedAt: string;
      chain: string;
      pairAddress: string;
      pairMarketcapUsd: string;
      pairMarketcapUsdInitial: string;
      pairPrice0Usd: string;
      pairPrice1Usd: string;
      pairTotalSupply: string;
      pairReserves0: string;
      pairReserves1: string;
      pairReserves0Usd: string;
      pairReserves1Usd: string;
      routerAddress: string;
      routerType: string;
      token0Decimals: number;
      token0Address: string;
      token0Symbol: string;
      token1Decimals: number;
      token1TotalSupply: string;
      token1TotalSupplyFormatted: string;
      token1Address: string;
      token1Symbol: string;
      token1Name: string;
      token1SellFee: number;
      token1BuyFee: number;
      token1TransferFee: number;
      token1ImageUri: string;
      fdv: string;
      linkDiscord?: string;
      linkTelegram?: string;
      linkTwitter?: string;
      linkWebsite?: string;
      token1IsProxy: boolean;
      isVerified: boolean;
      renounced: boolean;
      totalLockedRatio: string;
      token1IsHoneypot: boolean;
      mintAuthorityRenounced: boolean;
      freezeAuthorityRenounced: boolean;
      burnedSupply: string;
      devHoldings: string;
      token1DevWalletToTotalSupplyRatio: string;
      insiders: number;
      insiderHoldings: string;
      token1InsiderWalletToTotalSupplyRatio: string;
      bundlers: number;
      bundlerHoldings: string;
      token1BundlerWalletToTotalSupplyRatio: string;
      snipers: number;
      sniperHoldings: string;
      token1SniperWalletToTotalSupplyRatio: string;
      traders: number;
      traderHoldings: string;
      token1TraderWalletToTotalSupplyRatio: string;
      top10Holdings: string;
      token1Top10ToTotalSupplyRatio: string;
      dexPaid: boolean;
      migrationTarget: string;
      virtualQuoteReserves: string;
      virtualBaseReserves: string;
    };
    pairStats: {
      fiveMin: {
        first: string;
        last: string;
        change: string;
        diff: string;
        txns: number;
        buys: number;
        sells: number;
        volume: string;
        makers: number;
        buyers: number;
        sellers: number;
        buyVolume: string;
        sellVolume: string;
      };
      oneHour: {
        first: string;
        last: string;
        change: string;
        diff: string;
        txns: number;
        buys: number;
        sells: number;
        volume: string;
        makers: number;
        buyers: number;
        sellers: number;
        buyVolume: string;
        sellVolume: string;
      };
      sixHour: {
        first: string;
        last: string;
        change: string;
        diff: string;
        txns: number;
        buys: number;
        sells: number;
        volume: string;
        makers: number;
        buyers: number;
        sellers: number;
        buyVolume: string;
        sellVolume: string;
      };
      twentyFourHour: {
        first: string;
        last: string;
        change: string;
        diff: string;
        txns: number;
        buys: number;
        sells: number;
        volume: string;
        makers: number;
        buyers: number;
        sellers: number;
        buyVolume: string;
        sellVolume: string;
      };
    };
    callCount: number;
    migrationProgress: string | null;
  };
}

export interface WebSocketScannerPairsEvent {
  event: 'scanner-pairs';
  data: ScannerResult[];
}

export interface WebSocketWpegPricesEvent {
  event: 'wpeg-prices';
  data: {
    prices: {
      BSC: string;
      SOL: string;
      ETH: string;
      BASE: string;
    };
  };
}

export interface WebSocketScannerFilterEvent {
  event: 'scanner-filter';
  data: {
    rankBy?: 'volume' | 'age';
    isNotHP?: boolean;
    chain?: 'ETH' | 'SOL' | 'BASE' | 'BSC';
  };
}

export type IncomingWebSocketMessage = 
  | WebSocketTickEvent 
  | WebSocketPairStatsEvent 
  | WebSocketScannerPairsEvent
  | WebSocketWpegPricesEvent
  | WebSocketScannerFilterEvent;

export interface SubscribeMessage {
  event: 'scanner-filter' | 'subscribe-pair-stats' | 'subscribe-pair';
  data: {
    rankBy?: 'volume' | 'age';
    chain?: 'ETH' | 'SOL' | 'BASE' | 'BSC';
    isNotHP?: boolean;
    pair?: string;
    token?: string;
  };
}

export interface UnsubscribeMessage {
  event: 'unsubscribe-scanner-filter' | 'unsubscribe-pair-stats' | 'unsubscribe-pair';
  data: {
    rankBy?: 'volume' | 'age';
    chain?: 'ETH' | 'SOL' | 'BASE' | 'BSC';
    isNotHP?: boolean;
    pair?: string;
    token?: string;
  };
}
