import { useInfiniteQuery } from '@tanstack/react-query';
import * as React from 'react';

import { fetchScannerData } from '@/api/scannerApi';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { 
  GetScannerResultParams, 
  TokenData,
} from '@/entities';
import { transformScannerResult } from '@/lib/transformScannerResult.ts';

export const getInfiniteTokensQueryKey = (params: Omit<GetScannerResultParams, 'page'>) => 
  ['infiniteTokens', JSON.stringify(params)];

interface TokenPageResult {
  data: TokenData[];
  hasNextPage: boolean;
  nextPage?: number;
}

const fetchTokenPage = async (params: GetScannerResultParams): Promise<TokenPageResult> => {
  try {
    const result = await fetchScannerData(params);
    const items = result.pairs || result.data || result;

    if (!Array.isArray(items)) {
      console.error('API response is not an array:', items);

      return { data: [], hasNextPage: false };
    }

    const transformedData = items.map(transformScannerResult);
    
    const hasNextPage = transformedData.length === params.limit;

    return {
      data: transformedData,
      hasNextPage,
      nextPage: hasNextPage ? (params.page || 1) + 1 : undefined,
    };
  } catch (err) {
    console.error('API request failed:', err);
    throw err;
  }
};

interface UseInfiniteTokensParams extends Omit<GetScannerResultParams, 'page'> {
  rankBy: 'volume' | 'age';
}

export const useInfiniteTokens = (params: UseInfiniteTokensParams) => {
  const { 
    isConnected, 
    subscribeToScannerFilter, 
    unsubscribeFromScannerFilter,
    subscribeToTokens,
    unsubscribeFromTokens,
    wpegPrices,
    currentFilter
  } = useWebSocket();

  const allTokensRef = React.useRef<TokenData[]>([]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch
  } = useInfiniteQuery({
    queryKey: getInfiniteTokensQueryKey(params),
    queryFn: async ({ pageParam = 1 }: { pageParam: number }) => fetchTokenPage({ ...params, page: pageParam }),
    getNextPageParam: (lastPage: TokenPageResult) => lastPage.nextPage,
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    staleTime: 30 * 1000,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    structuralSharing: true,
  });

  const tokens = React.useMemo(() => data?.pages.flatMap((page: TokenPageResult) => page.data) || [], [data?.pages]);

  const loadMoreOnScroll = React.useCallback((containerRef: React.RefObject<HTMLElement>) => {
    const handleScroll = (event: Event) => {
      const target = event.target as HTMLElement;

      if (!target || isFetchingNextPage || !hasNextPage) return;

      const { scrollTop, scrollHeight, clientHeight } = target;
      const threshold = 200;

      if (scrollTop + clientHeight >= scrollHeight - threshold) {
        void fetchNextPage();
      }
    };

    const findScrollableElement = (element: HTMLElement): HTMLElement | null => {
      const scrollableElement = element.querySelector('.default-table');

      return scrollableElement as HTMLElement || null;
    };

    const container = containerRef.current;

    if (container) {
      const scrollableElement = findScrollableElement(container);

      if (scrollableElement) {
        scrollableElement.addEventListener('scroll', handleScroll);

        return () => scrollableElement.removeEventListener('scroll', handleScroll);
      } else {
        console.log('No scrollable element found, container:', container);
      }
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  React.useEffect(() => {
    allTokensRef.current = tokens;
  }, [tokens]);

  React.useEffect(() => {
    if (tokens.length > 0 && isConnected) {
      void subscribeToTokens(tokens);
    }
  }, [tokens.length, isConnected, subscribeToTokens, tokens]);

  React.useEffect(() => {
    if (isConnected) {
      void subscribeToScannerFilter(params);

      return () => {
        void unsubscribeFromScannerFilter(params);

        if (allTokensRef.current.length > 0) {
          void unsubscribeFromTokens(allTokensRef.current);
        }
      };
    }
  }, [isConnected, params, subscribeToScannerFilter, unsubscribeFromScannerFilter, unsubscribeFromTokens]);

  React.useEffect(() => {
    return () => {
      if (allTokensRef.current.length > 0) {
        void unsubscribeFromTokens(allTokensRef.current);
      }
    };
  }, [unsubscribeFromTokens]);

  return {
    tokens,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isWebSocketConnected: isConnected,
    wpegPrices,
    currentFilter,
    loadMoreOnScroll,
  };
};
