import { useQueryClient } from '@tanstack/react-query';
import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';

import { websocketService } from '@/api/websocketService';
import { 
  IncomingWebSocketMessage, 
  WebSocketTickEvent, 
  WebSocketPairStatsEvent, 
  WebSocketScannerPairsEvent,
  WebSocketWpegPricesEvent,
  WebSocketScannerFilterEvent,
  GetScannerResultParams,
  TokenData
} from '@/entities';
import { transformScannerResult } from '@/lib';

interface WebSocketContextType {
  isConnected: boolean;
  subscribeToScannerFilter: (params: GetScannerResultParams) => Promise<void>;
  unsubscribeFromScannerFilter: (params: GetScannerResultParams) => Promise<void>;
  subscribeToTokens: (tokens: TokenData[]) => Promise<void>;
  unsubscribeFromTokens: (tokens: TokenData[]) => Promise<void>;
  wpegPrices: Record<string, string>;
  currentFilter: {
    rankBy?: 'volume' | 'age';
    isNotHP?: boolean;
    chain?: 'ETH' | 'SOL' | 'BASE' | 'BSC';
  };
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [wpegPrices, setWpegPrices] = useState<Record<string, string>>({
    BSC: '0',
    SOL: '0',
    ETH: '0',
    BASE: '0'
  });
  const [currentFilter, setCurrentFilter] = useState<{
    rankBy?: 'volume' | 'age';
    isNotHP?: boolean;
    chain?: 'ETH' | 'SOL' | 'BASE' | 'BSC';
  }>({});

  const queryClient = useQueryClient();
  const connectionInitialized = useRef(false);
  const activeSubscriptions = useRef(new Set<string>());
  const activePairSubscriptions = useRef(new Set<string>());
  const activePairStatsSubscriptions = useRef(new Set<string>());

  const handleWebSocketMessage = (message: IncomingWebSocketMessage) => {
    switch (message.event) {
      case 'tick':
        handleTickEvent(message as WebSocketTickEvent);
        break;
      case 'pair-stats':
        handlePairStatsEvent(message as WebSocketPairStatsEvent);
        break;
      case 'scanner-pairs':
        handleScannerPairsEvent(message as WebSocketScannerPairsEvent);
        break;
      case 'wpeg-prices':
        handleWpegPricesEvent(message as WebSocketWpegPricesEvent);
        break;
      case 'scanner-filter':
        handleScannerFilterEvent(message as WebSocketScannerFilterEvent);
        break;
      default:
        break;
    }
  };

  const handleTickEvent = (tickEvent: WebSocketTickEvent) => {
    queryClient.setQueriesData(
      { queryKey: ['scannerData'], exact: false },
      (oldData: TokenData[] | undefined) => {

        if (!oldData || !Array.isArray(oldData)) return oldData;
        
        let hasUpdates = false;
        
        const updatedTokens = oldData.map((token: TokenData) => {
          if (token.pairAddress === tickEvent.data.pair.pair) {
            const latestSwap = tickEvent.data.swaps
              ?.filter(swap => !swap.isOutlier)
              ?.pop();
            
            if (latestSwap) {
              hasUpdates = true;
              const newPrice = parseFloat(latestSwap.priceToken1Usd);
              const totalSupply = parseFloat(token.tokenInfo.totalSupply || '0');
              const newMarketCap = totalSupply * newPrice;
              
              return {
                ...token,
                price: newPrice,
                mcap: {
                  ...token.mcap,
                  current: newMarketCap
                },
                volume: latestSwap.volumeUsd ? parseFloat(latestSwap.volumeUsd) : token.volume,
                transactions: {
                  ...token.transactions,
                  buys: latestSwap.side === 'buy' ? (token.transactions.buys || 0) + 1 : (token.transactions.buys || 0),
                  sells: latestSwap.side === 'sell' ? (token.transactions.sells || 0) + 1 : (token.transactions.sells || 0),
                  txns: (token.transactions.txns || 0) + 1
                }
              };
            }
          }

          return token;
        });

        return hasUpdates ? updatedTokens : oldData;
      }
    );
  };

  const handlePairStatsEvent = (pairStatsEvent: WebSocketPairStatsEvent) => {
    queryClient.setQueriesData(
      { queryKey: ['scannerData'], exact: false },
      (oldData: TokenData[] | undefined) => {
        if (!oldData || !Array.isArray(oldData)) return oldData;

        const updatedTokens = oldData.map((token: TokenData) => {
          if (token.pairAddress === pairStatsEvent.data.pair.pairAddress) {
            const pairData = pairStatsEvent.data.pair;
            const migrationProgress = pairStatsEvent.data.migrationProgress;

            return {
              ...token,
              audit: {
                ...token.audit,
                isMintAuthDisabled: pairData.mintAuthorityRenounced,
                isFreezeAuthDisabled: pairData.freezeAuthorityRenounced,
                honeyPot: !pairData.token1IsHoneypot,
                contractVerified: pairData.isVerified
              },
              socialLinks: {
                ...token.socialLinks,
                discord: pairData.linkDiscord || null,
                telegram: pairData.linkTelegram || null,
                twitter: pairData.linkTwitter || null,
                website: pairData.linkWebsite || null
              },
              dexPaid: pairData.dexPaid || token.dexPaid,
              migration: {
                ...token.migration,
                migrationProgress: migrationProgress ? Number(migrationProgress) : token.migration.migrationProgress
              }
            };
          }

          return token;
        });

        return updatedTokens;
      }
    );
  };

  const handleScannerPairsEvent = (scannerPairsEvent: WebSocketScannerPairsEvent) => {
    queryClient.setQueriesData(
      { queryKey: ['scannerData'], exact: false },
      (oldData: TokenData[] | undefined) => {
        const newItems = scannerPairsEvent.data;
        
        if (oldData && Array.isArray(oldData)) {
          const transformedNewItems = newItems.map(transformScannerResult);

          const hasChanges = transformedNewItems.length !== oldData.length ||
            transformedNewItems.some(newToken => {
              const existingToken = oldData.find(token => token.pairAddress === newToken.pairAddress);

              return !existingToken || 
                existingToken.price !== newToken.price ||
                existingToken.volume !== newToken.volume ||
                existingToken.liquidity !== newToken.liquidity;
            });
          
          if (!hasChanges) {
            return oldData;
          }
          
          const mergedTokens = transformedNewItems.map(newToken => {
            const existingToken = oldData.find(token => token.pairAddress === newToken.pairAddress);

            if (existingToken) {
              return {
                ...newToken,
                priceChangePcs: existingToken.priceChangePcs,
                transactions: {
                  ...newToken.transactions,
                  buys: existingToken.transactions.buys || newToken.transactions.buys,
                  sells: existingToken.transactions.sells || newToken.transactions.sells,
                  txns: existingToken.transactions.txns || newToken.transactions.txns
                },
                audit: {
                  ...newToken.audit,
                  contractRenounced: existingToken.audit.contractRenounced !== undefined ? existingToken.audit.contractRenounced : newToken.audit.contractRenounced,
                  contractVerified: existingToken.audit.contractVerified !== undefined ? existingToken.audit.contractVerified : newToken.audit.contractVerified,
                  liquidityLocked: existingToken.audit.liquidityLocked !== undefined ? existingToken.audit.liquidityLocked : newToken.audit.liquidityLocked,
                  liquidityLockedRatio: existingToken.audit.liquidityLockedRatio !== undefined ? existingToken.audit.liquidityLockedRatio : newToken.audit.liquidityLockedRatio,
                  isMintAuthDisabled: existingToken.audit.isMintAuthDisabled !== undefined ? existingToken.audit.isMintAuthDisabled : newToken.audit.isMintAuthDisabled,
                  isFreezeAuthDisabled: existingToken.audit.isFreezeAuthDisabled !== undefined ? existingToken.audit.isFreezeAuthDisabled : newToken.audit.isFreezeAuthDisabled,
                  honeyPot: existingToken.audit.honeyPot !== undefined ? existingToken.audit.honeyPot : newToken.audit.honeyPot
                },
                migration: {
                  ...newToken.migration,
                  migrationProgress: existingToken.migration.migrationProgress !== null ? existingToken.migration.migrationProgress : newToken.migration.migrationProgress
                }
              };
            }

            return newToken;
          });

          return mergedTokens;
        }

        return newItems.map(transformScannerResult);
      }
    );
  };

  const handleWpegPricesEvent = (wpegPricesEvent: WebSocketWpegPricesEvent) => {
    setWpegPrices(wpegPricesEvent.data.prices);
  };

  const handleScannerFilterEvent = (scannerFilterEvent: WebSocketScannerFilterEvent) => {
    setCurrentFilter(scannerFilterEvent.data);
  };

  const handleConnectionStatus = (status: boolean) => {
    setIsConnected(status);
  };

  const subscribeToScannerFilter = async (params: GetScannerResultParams) => {
    const subscriptionKey = `scanner-filter-${params.rankBy}-${params.chain}-${params.isNotHP}`;
    
    if (activeSubscriptions.current.has(subscriptionKey)) {
      return;
    }

    if (!isConnected) {
      return;
    }

    try {
      await websocketService.subscribeToScannerFilter({
        rankBy: params.rankBy,
        chain: params.chain,
        isNotHP: params.isNotHP,
      });

      activeSubscriptions.current.add(subscriptionKey);
    } catch (err) {
      console.error('Error subscribing to scanner filter:', err);
    }
  };

  const unsubscribeFromScannerFilter = async (params: GetScannerResultParams) => {
    const subscriptionKey = `scanner-filter-${params.rankBy}-${params.chain}-${params.isNotHP}`;
    
    if (!activeSubscriptions.current.has(subscriptionKey)) {
      return;
    }

    try {
      await websocketService.unsubscribeFromScannerFilter({
        rankBy: params.rankBy,
        chain: params.chain,
        isNotHP: params.isNotHP,
      });

      activeSubscriptions.current.delete(subscriptionKey);
    } catch (err) {
      console.error('Error unsubscribing from scanner filter:', err);
    }
  };

  const subscribeToTokens = async (tokens: TokenData[]) => {
    if (!isConnected) {
      return;
    }

    for (const token of tokens) {
      const pairKey = `pair-${token.pairAddress}`;
      const pairStatsKey = `pair-stats-${token.pairAddress}`;

      if (!activePairSubscriptions.current.has(pairKey)) {
        try {
          await websocketService.subscribeToPair(token);
          activePairSubscriptions.current.add(pairKey);
        } catch (err) {
          console.error('Error subscribing to pair:', err);
        }
      }

      if (!activePairStatsSubscriptions.current.has(pairStatsKey)) {
        try {
          await websocketService.subscribeToPairStats(token);

          activePairStatsSubscriptions.current.add(pairStatsKey);
        } catch (err) {
          console.error('Error subscribing to pair stats:', err);
        }
      }
    }
  };

  const unsubscribeFromTokens = async (tokens: TokenData[]) => {
    for (const token of tokens) {
      const pairKey = `pair-${token.pairAddress}`;
      const pairStatsKey = `pair-stats-${token.pairAddress}`;

      if (activePairSubscriptions.current.has(pairKey)) {
        try {
          await websocketService.unsubscribeFromPair(token);

          activePairSubscriptions.current.delete(pairKey);
        } catch (err) {
          console.error('Error unsubscribing from pair:', err);
        }
      }

      if (activePairStatsSubscriptions.current.has(pairStatsKey)) {
        try {
          await websocketService.unsubscribeFromPairStats(token);

          activePairStatsSubscriptions.current.delete(pairStatsKey);
        } catch (err) {
          console.error('Error unsubscribing from pair stats:', err);
        }
      }
    }
  };

  useEffect(() => {
    if (connectionInitialized.current) return;

    connectionInitialized.current = true;

    const initializeConnection = async () => {
      try {
        const connected = await websocketService.connect();

        websocketService.addMessageHandler(handleWebSocketMessage);
        websocketService.addConnectionStatusHandler(handleConnectionStatus);

        if (connected) {
          setIsConnected(true);
        }
      } catch (err) {
        console.error('Error initializing global WebSocket connection:', err);
      }
    };

    void initializeConnection();

    return () => {
      websocketService.removeMessageHandler(handleWebSocketMessage);
      websocketService.removeConnectionStatusHandler(handleConnectionStatus);
    };
  }, [handleWebSocketMessage, handleConnectionStatus]);

  const contextValue: WebSocketContextType = {
    isConnected,
    subscribeToScannerFilter,
    unsubscribeFromScannerFilter,
    subscribeToTokens,
    unsubscribeFromTokens,
    wpegPrices,
    currentFilter
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);

  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }

  return context;
};
