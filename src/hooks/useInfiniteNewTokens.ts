import { GetScannerResultParams } from '@/entities';
import { useInfiniteTokens } from '@/hooks/useInfiniteTokens';

export const useInfiniteNewTokens = (params: Omit<GetScannerResultParams, 'rankBy' | 'page'>) => {
  return useInfiniteTokens({ ...params, rankBy: 'age' });
};
