import { 
  IncomingWebSocketMessage, 
  SubscribeMessage,
  TokenData,
  UnsubscribeMessage,
  WebSocketPairStatsEvent,
  WebSocketScannerPairsEvent,
  WebSocketTickEvent,
  WebSocketWpegPricesEvent,
  WebSocketScannerFilterEvent
} from '@/entities';

import { API_PATHS } from './scannerApi';

type MessageHandler = (message: IncomingWebSocketMessage) => void;
type ConnectionStatusHandler = (status: boolean) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private messageHandlers: MessageHandler[] = [];
  private connectionStatusHandlers: ConnectionStatusHandler[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private instanceId = Math.random().toString(36).substr(2, 9);

  private wpegPrices: Record<string, string> = {
    BSC: '0',
    SOL: '0',
    ETH: '0',
    BASE: '0'
  };

  private currentFilter: {
    rankBy?: 'volume' | 'age';
    isNotHP?: boolean;
    chain?: 'ETH' | 'SOL' | 'BASE' | 'BSC';
  } = {};

  /**
   * Maps chainId to chain name used by the API
   * @param chainId Chain ID
   * @returns Chain name
   */
  mapChainIdToChain(chainId: number): 'ETH' | 'SOL' | 'BASE' | 'BSC' {
    switch (chainId) {
      case 1:
        return 'ETH';
      case 900:
        return 'SOL';
      case 8453:
        return 'BASE';
      case 56:
        return 'BSC';
      default:
        return 'SOL'; // Default to SOL if unknown
    }
  }

  /**
   * Connect to the WebSocket server
   */
  connect(): Promise<boolean> {
    if (this.socket?.readyState === WebSocket.OPEN) {
      return Promise.resolve(true);
    }

    if (this.isConnecting) {
      return new Promise((resolve) => {
        const checkConnection = setInterval(() => {
          if (this.socket?.readyState === WebSocket.OPEN) {
            clearInterval(checkConnection);
            resolve(true);
          }
        }, 100);
      });
    }

    this.isConnecting = true;

    return new Promise((resolve) => {
      try {
        this.socket = new WebSocket(API_PATHS.websocket);

        this.socket.onopen = () => {
          this.reconnectAttempts = 0;
          this.isConnecting = false;
          this.notifyConnectionStatus(true);

          resolve(true);
        };

        this.socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data) as IncomingWebSocketMessage;

            switch (message.event) {
              case 'wpeg-prices':
                this.wpegPrices = processWpegPricesEvent(this.wpegPrices, message as WebSocketWpegPricesEvent);
                break;
              case 'scanner-filter':
                this.currentFilter = processScannerFilterEvent(message as WebSocketScannerFilterEvent);
                break;
            }
            
            this.messageHandlers.forEach((handler, index) => {
              handler(message);
            });
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.socket.onclose = (event) => {
          this.notifyConnectionStatus(false);
          this.attemptReconnect();

          this.isConnecting = false;

          resolve(false);
        };

        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error, 'WebSocket URL:', API_PATHS.websocket);

          this.isConnecting = false;
          resolve(false);
        };
      } catch (error) {
        console.error('Error creating WebSocket connection:', error);
        this.isConnecting = false;
        resolve(false);
      }
    });
  }

  /**
   * Attempt to reconnect to the WebSocket server
   */
  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * Disconnect from the WebSocket server
   */
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);

      this.reconnectTimeout = null;
    }
  }

  /**
   * Send a message to the WebSocket server
   * @param message Message to send
   */
  async send(message: SubscribeMessage | UnsubscribeMessage): Promise<boolean> {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      const connected = await this.connect();

      if (!connected) return false;
    }

    try {
      this.socket?.send(JSON.stringify(message));

      return true;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);

      return false;
    }
  }

  /**
   * Subscribe to scanner filter updates
   * @param params Filter parameters
   */
  async subscribeToScannerFilter(params: {
    rankBy?: 'volume' | 'age';
    chain?: 'ETH' | 'SOL' | 'BASE' | 'BSC';
    isNotHP?: boolean;
  }): Promise<boolean> {
    const message: SubscribeMessage = {
      event: 'scanner-filter',
      data: params
    };

    return this.send(message);
  }

  /**
   * Unsubscribe from scanner filter updates
   * @param params Filter parameters
   */
  async unsubscribeFromScannerFilter(params: {
    rankBy?: 'volume' | 'age';
    chain?: 'ETH' | 'SOL' | 'BASE' | 'BSC';
    isNotHP?: boolean;
  }): Promise<boolean> {
    const message: UnsubscribeMessage = {
      event: 'unsubscribe-scanner-filter',
      data: params
    };

    return this.send(message);
  }

  /**
   * Subscribe to pair stats updates
   * @param token Token data
   */
  async subscribeToPairStats(token: Pick<TokenData, 'pairAddress' | 'token1Address' | 'chainId'>): Promise<boolean> {
    const message: SubscribeMessage = {
      event: 'subscribe-pair-stats',
      data: {
        pair: token.pairAddress,
        token: token.token1Address,
        chain: this.mapChainIdToChain(token.chainId)
      }
    };

    return this.send(message);
  }

  /**
   * Unsubscribe from pair stats updates
   * @param token Token data
   */
  async unsubscribeFromPairStats(token: Pick<TokenData, 'pairAddress' | 'token1Address' | 'chainId'>): Promise<boolean> {
    const message: UnsubscribeMessage = {
      event: 'unsubscribe-pair-stats',
      data: {
        pair: token.pairAddress,
        token: token.token1Address,
        chain: this.mapChainIdToChain(token.chainId)
      }
    };

    return this.send(message);
  }

  /**
   * Subscribe to pair updates
   * @param token Token data
   */
  async subscribeToPair(token: Pick<TokenData, 'pairAddress' | 'token1Address' | 'chainId'>): Promise<boolean> {
    const message: SubscribeMessage = {
      event: 'subscribe-pair',
      data: {
        pair: token.pairAddress,
        token: token.token1Address,
        chain: this.mapChainIdToChain(token.chainId)
      }
    };

    return this.send(message);
  }

  /**
   * Unsubscribe from pair updates
   * @param token Token data
   */
  async unsubscribeFromPair(token: Pick<TokenData, 'pairAddress' | 'token1Address' | 'chainId'>): Promise<boolean> {
    const message: UnsubscribeMessage = {
      event: 'unsubscribe-pair',
      data: {
        pair: token.pairAddress,
        token: token.token1Address,
        chain: this.mapChainIdToChain(token.chainId)
      }
    };

    return this.send(message);
  }

  /**
   * Add a message handler
   * @param handler Message handler function
   */
  addMessageHandler(handler: MessageHandler) {
    this.messageHandlers.push(handler);
  }

  /**
   * Remove a message handler
   * @param handler Message handler function to remove
   */
  removeMessageHandler(handler: MessageHandler) {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
  }

  /**
   * Add a connection status handler
   * @param handler Connection status handler function
   */
  addConnectionStatusHandler(handler: ConnectionStatusHandler) {
    this.connectionStatusHandlers.push(handler);
  }

  /**
   * Remove a connection status handler
   * @param handler Connection status handler function to remove
   */
  removeConnectionStatusHandler(handler: ConnectionStatusHandler) {
    this.connectionStatusHandlers = this.connectionStatusHandlers.filter(h => h !== handler);
  }

  /**
   * Notify all connection status handlers
   * @param status Connection status
   */
  private notifyConnectionStatus(status: boolean) {
    this.connectionStatusHandlers.forEach(handler => handler(status));
  }

  /**
   * Get the current wpeg prices
   * @returns Current wpeg prices
   */
  getWpegPrices(): Record<string, string> {
    return { ...this.wpegPrices };
  }

  /**
   * Get the current filter settings
   * @returns Current filter settings
   */
  getCurrentFilter(): {
    rankBy?: 'volume' | 'age';
    isNotHP?: boolean;
    chain?: 'ETH' | 'SOL' | 'BASE' | 'BSC';
  } {
    return { ...this.currentFilter };
  }
}

export const websocketService = new WebSocketService();

/**
 * Helper functions to process WebSocket messages
 */

/**
 * Process a tick event to update token price and market cap
 * @param token Token data to update
 * @param event Tick event
 * @returns Updated token data
 */
export const processTickEvent = (token: TokenData, event: WebSocketTickEvent): TokenData => {
  const swaps = event.data.swaps;
  const latestSwap = swaps.filter(swap => !swap.isOutlier).pop();

  if (latestSwap) {
    const newPrice = parseFloat(latestSwap.priceToken1Usd);

    const totalSupply = token.mcap.current / token.price;
    const newMarketCap = totalSupply * newPrice;

    return {
      ...token,
      price: newPrice,
      mcap: {
        ...token.mcap,
        current: newMarketCap
      }
    };
  }

  return token;
};

/**
 * Process a pair stats event to update token audit information
 * @param token Token data to update
 * @param event Pair stats event
 * @returns Updated token data
 */
export const processPairStatsEvent = (token: TokenData, event: WebSocketPairStatsEvent): TokenData => {
  const pairData = event.data.pair;

  return {
    ...token,
    audit: {
      contractRenounced: pairData.mintAuthorityRenounced || false,
      contractVerified: pairData.isVerified || false,
      liquidityLocked: token.audit.liquidityLocked,
      liquidityLockedRatio: token.audit.liquidityLockedRatio,
      isMintAuthDisabled: pairData.mintAuthorityRenounced || false,
      isFreezeAuthDisabled: pairData.freezeAuthorityRenounced || false,
      honeyPot: !pairData.token1IsHoneypot
    },
    socialLinks: {
      discord: pairData.linkDiscord || null,
      telegram: pairData.linkTelegram || null,
      twitter: pairData.linkTwitter || null,
      website: pairData.linkWebsite || null
    },
    dexPaid: pairData.dexPaid || false
  };
};

/**
 * Process a wpeg-prices event to store current prices
 * @param prices Current prices object to update
 * @param event Wpeg prices event
 * @returns Updated prices object
 */
export const processWpegPricesEvent = (prices: Record<string, string>, event: WebSocketWpegPricesEvent): Record<string, string> => {
  return {
    ...prices,
    ...event.data.prices
  };
};

/**
 * Process a scanner-filter event
 * @param event Scanner filter event
 * @returns The filter parameters
 */
export const processScannerFilterEvent = (event: WebSocketScannerFilterEvent): {
  rankBy?: 'volume' | 'age';
  isNotHP?: boolean;
  chain?: 'ETH' | 'SOL' | 'BASE' | 'BSC';
} => {
  return event.data;
};
