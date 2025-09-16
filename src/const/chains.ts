export enum ChainIds {
  ETH = 1,
  BSC = 56,
  BASE = 8453,
  POLYGON = 137,
  AVALANCHE = 43114,
  FANTOM = 250,
  ARBITRUM = 42161,
  CELO = 42220,
  MOONBEAM = 1285,
  MOONRIVER = 1287,
  HARMONY = 1666600000,
  AURORA = 1313161554,
}

export const ChainNames: Record<number, string> = {
  [ChainIds.ETH]: 'ETH',
  [ChainIds.BSC]: 'BSC',
  [ChainIds.BASE]: 'BASE',
  [ChainIds.POLYGON]: 'POLYGON',
  [ChainIds.AVALANCHE]: 'AVALANCHE',
  [ChainIds.FANTOM]: 'FANTOM',
  [ChainIds.ARBITRUM]: 'ARBITRUM',
  [ChainIds.CELO]: 'CELO',
  [ChainIds.MOONBEAM]: 'MOONBEAM',
  [ChainIds.MOONRIVER]: 'MOONRIVER',
  [ChainIds.HARMONY]: 'HARMONY',
  [ChainIds.AURORA]: 'AURORA',
};

export const ChainColors: Record<number, string> = {
  [ChainIds.ETH]: 'bg-blue-600',
  [ChainIds.BSC]: 'bg-yellow-600',
  [ChainIds.BASE]: 'bg-blue-500',
  [ChainIds.POLYGON]: 'bg-purple-600',
  [ChainIds.AVALANCHE]: 'bg-red-600',
  [ChainIds.FANTOM]: 'bg-green-600',
  [ChainIds.ARBITRUM]: 'bg-orange-600',
  [ChainIds.CELO]: 'bg-pink-600',
  [ChainIds.MOONBEAM]: 'bg-teal-600',
  [ChainIds.MOONRIVER]: 'bg-indigo-600',
  [ChainIds.HARMONY]: 'bg-brown-600',
  [ChainIds.AURORA]: 'bg-gray-600',
};