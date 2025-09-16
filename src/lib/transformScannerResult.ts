import { ScannerResult, TokenData } from '@/entities';

export const transformScannerResult = (item: ScannerResult): TokenData => {
  const parseNumber = (value: string | null | undefined): number => {
    if (!value || value === 'null') return 0;
    const parsed = parseFloat(value);

    return isNaN(parsed) ? 0 : parsed;
  };

  let mcapCurrent = 0;
  let mcapInitial = 0;

  if (parseNumber(item.currentMcap) > 0) {
    mcapCurrent = parseNumber(item.currentMcap);
  } else if (parseNumber(item.pairMcapUsd) > 0) {
    mcapCurrent = parseNumber(item.pairMcapUsd);
  }

  if (parseNumber(item.initialMcap) > 0) {
    mcapInitial = parseNumber(item.initialMcap);
  } else if (parseNumber(item.pairMcapUsdInitial) > 0) {
    mcapInitial = parseNumber(item.pairMcapUsdInitial);
  }

  const parseDiff = (value: string | null | undefined): number => {
    if (!value || value === 'null') return 0;
    const parsed = parseFloat(value);

    return isNaN(parsed) ? 0 : parsed;
  };

  const parseVolume = (value: string | null | undefined): number => {
    if (!value || value === 'null') return 0;
    const parsed = parseFloat(value);

    return isNaN(parsed) ? 0 : parsed;
  };

  const parsePrice = (value: string | null | undefined): number => {
    if (!value || value === 'null') return 0;
    const parsed = parseFloat(value);

    return isNaN(parsed) ? 0 : parsed;
  };

  const parseLiquidity = (value: string | null | undefined): number => {
    if (!value || value === 'null') return 0;
    const parsed = parseFloat(value);

    return isNaN(parsed) ? 0 : parsed;
  };

  const parseBool = (value: boolean | null | undefined): boolean => {
    return value === true;
  };

  const parseNullableString = (value: string | null | undefined): string | null => {
    return value || null;
  };

  return {
    token0Symbol: item.token0Symbol || '',
    token1Symbol: item.token1Symbol || '',
    token1Name: item.token1Name || '',
    token1Address: item.token1Address || '',
    chainId: item.chainId || 0,
    routerAddress: item.routerAddress || '',
    age: new Date(item.age || new Date()),
    pairAddress: item.pairAddress || '',
    price: parsePrice(item.price),
    volume: parseVolume(item.volume),
    priceChangePcs: {
      '5m': parseDiff(item.diff5M),
      '1h': parseDiff(item.diff1H),
      '6h': parseDiff(item.diff6H),
      '24h': parseDiff(item.diff24H)
    },
    liquidity: parseLiquidity(item.liquidity),
    fdv: parseNumber(item.fdv),
    transactions: {
      makers: item.makers || 0,
      txns: item.txns || 0,
      buys: item.buys || 0,
      sells: item.sells || 0
    },
    fees: {
      buy: item.buyFee || 0,
      sell: item.sellFee || 0
    },
    mcap: {
      current: mcapCurrent,
      initial: mcapInitial,
      percentChange: item.percentChangeInMcap ? parseNumber(item.percentChangeInMcap) : null
    },
    audit: {
      contractRenounced: parseBool(item.contractRenounced),
      contractVerified: parseBool(item.contractVerified),
      liquidityLocked: parseBool(item.liquidityLocked),
      liquidityLockedRatio: parseNumber(item.liquidityLockedRatio),
      isMintAuthDisabled: parseBool(item.isMintAuthDisabled),
      isFreezeAuthDisabled: parseBool(item.isFreezeAuthDisabled),
      honeyPot: parseBool(item.honeyPot)
    },
    socialLinks: {
      twitter: parseNullableString(item.twitterLink),
      telegram: parseNullableString(item.telegramLink),
      discord: parseNullableString(item.discordLink),
      website: parseNullableString(item.webLink)
    },
    tokenInfo: {
      totalSupply: item.token1TotalSupplyFormatted || '0',
      decimals: item.token1Decimals || 0,
      imageUri: item.token1ImageUri || null
    },
    reserves: {
      reserves0: item.reserves0 || '0',
      reserves1: item.reserves1 || '0',
      reserves0Usd: parseNumber(item.reserves0Usd),
      reserves1Usd: parseNumber(item.reserves1Usd),
      token0Decimals: item.token0Decimals || 0
    },
    migration: {
      migratedFromPairAddress: parseNullableString(item.migratedFromPairAddress),
      migratedFromPairCreatedAt: parseNullableString(item.migratedFromPairCreatedAt),
      migratedFromRouterAddress: parseNullableString(item.migratedFromRouterAddress),
      migratedFromVirtualRouter: parseNullableString(item.migratedFromVirtualRouter),
      virtualRouterType: parseNullableString(item.virtualRouterType),
      migrationProgress: item.migrationProgress ? parseNumber(item.migrationProgress) : null
    },
    holders: {
      devHoldings: item.devHoldings || '0',
      devWalletRatio: item.token1DevWalletToTotalSupplyRatio ? parseNumber(item.token1DevWalletToTotalSupplyRatio) : null,
      insiders: item.insiders || 0,
      insiderHoldings: item.insiderHoldings || '0',
      insiderWalletRatio: item.token1InsiderWalletToTotalSupplyRatio ? parseNumber(item.token1InsiderWalletToTotalSupplyRatio) : null,
      bundlers: item.bundlers || 0,
      bundlerHoldings: item.bundlerHoldings || '0',
      bundlerWalletRatio: item.token1BundlerWalletToTotalSupplyRatio ? parseNumber(item.token1BundlerWalletToTotalSupplyRatio) : null,
      snipers: item.snipers || 0,
      sniperHoldings: item.sniperHoldings || '0',
      sniperWalletRatio: item.token1SniperWalletToTotalSupplyRatio ? parseNumber(item.token1SniperWalletToTotalSupplyRatio) : null,
      traders: item.traders || 0,
      traderHoldings: item.traderHoldings || '0',
      traderWalletRatio: item.token1TraderWalletToTotalSupplyRatio ? parseNumber(item.token1TraderWalletToTotalSupplyRatio) : null,
      top10Holdings: item.top10Holdings || '0',
      top10Ratio: parseNumber(item.token1Top10ToTotalSupplyRatio)
    },
    dexPaid: parseBool(item.dexPaid),
    callCount: item.callCount || 0,
  };
};