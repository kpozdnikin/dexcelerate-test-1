import { GetScannerResultParams } from '@/entities';
import { useInfiniteTokens } from '@/hooks/useInfiniteTokens';

export const useInfiniteTrendingTokens = (params: Omit<GetScannerResultParams, 'rankBy' | 'page'>) => {
  return useInfiniteTokens({ ...params, rankBy: 'volume' });
};
