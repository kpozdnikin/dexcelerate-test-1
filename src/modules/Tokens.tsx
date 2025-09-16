import React, { useState } from 'react';

import { GetScannerResultParams } from '@/entities';
import { TokenFilters, InfiniteTokenTable } from '@/features';
import { useInfiniteTrendingTokens, useInfiniteNewTokens } from '@/hooks';

const defaultFilters: GetScannerResultParams = {
  chain: undefined,
  isNotHP: true,
  minVolume: undefined,
  maxAge: undefined,
  minMcap: undefined,
  page: 1,
  limit: 100,
}

export const Tokens: React.FC = () => {
  const [filters, setFilters] = useState<GetScannerResultParams>(defaultFilters);

  const {
    tokens: trendingTokens,
    isLoading: isTrendingLoading,
    isFetchingNextPage: isTrendingFetchingNextPage,
    hasNextPage: trendingHasNextPage,
    loadMoreOnScroll: trendingLoadMoreOnScroll,
    isWebSocketConnected: isTrendingConnected,
  } = useInfiniteTrendingTokens(filters);

  const {
    tokens: newTokens,
    isLoading: isNewLoading,
    isFetchingNextPage: isNewFetchingNextPage,
    hasNextPage: newHasNextPage,
    loadMoreOnScroll: newLoadMoreOnScroll,
    isWebSocketConnected: isNewConnected,
  } = useInfiniteNewTokens(filters);

  const handleFiltersChange = (newFilters: GetScannerResultParams) => {
    setFilters(newFilters);
  };

  return (
    <div className="container w-full h-screen flex flex-col">
      <h1 className="mb-6 text-3xl font-bold">Token Scanner</h1>
      
      <div className="mb-4 flex items-center">
        <div className="mr-2 text-sm">WebSocket Status:</div>
        <div
          className={`h-3 w-3 rounded-full ${
            isTrendingConnected && isNewConnected
              ? 'bg-green-500'
              : 'bg-red-500'
          }`}
        ></div>
        <div className="ml-2 text-sm">
          {isTrendingConnected && isNewConnected
            ? 'Connected'
            : 'Disconnected'}
        </div>
      </div>

      <TokenFilters filters={filters} onFiltersChange={handleFiltersChange} />

      <div className="flex flex-row gap-4 flex-1 min-h-0">
        <div className="flex-1 h-full" data-automationId="trending-tokens">
          <InfiniteTokenTable
            data={trendingTokens}
            isLoading={isTrendingLoading}
            isFetchingNextPage={isTrendingFetchingNextPage}
            hasNextPage={trendingHasNextPage}
            loadMoreOnScroll={trendingLoadMoreOnScroll}
            title="Trending Tokens"
            defaultSortField="volume"
            defaultSortDirection="desc"
          />
        </div>

        <div className="flex-1 h-full" data-automationId="new-tokens">
          <InfiniteTokenTable
            data={newTokens}
            isLoading={isNewLoading}
            isFetchingNextPage={isNewFetchingNextPage}
            hasNextPage={newHasNextPage}
            loadMoreOnScroll={newLoadMoreOnScroll}
            title="New Tokens"
            defaultSortField="age"
            defaultSortDirection="asc"
          />
        </div>
      </div>
    </div>
  );
};
