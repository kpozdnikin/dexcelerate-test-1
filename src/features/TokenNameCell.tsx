import * as React from 'react';

import { ChainNames, ChainColors } from '@/const/chains.ts';
import { TokenData } from '@/entities';

export interface TokenNameCellProps {
  token: TokenData;
}

export const TokenNameCell: React.FC<TokenNameCellProps> = ({ token }) => {
  const chainName = ChainNames[token.chainId] || 'SOL';
  const chainColor = ChainColors[token.chainId] || 'bg-purple-600';

  return (
    <div className="flex items-center">
      <div className={`mr-2 rounded px-1.5 py-0.5 text-xs font-medium text-white ${chainColor}`}>
        {chainName}
      </div>
      <div>
        <div className="font-medium text-white">{token.token1Name}</div>
        <div className="text-sm text-gray-400">{token.token1Symbol}</div>
      </div>
    </div>
  )
};