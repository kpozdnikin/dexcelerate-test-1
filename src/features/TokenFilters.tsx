import React from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GetScannerResultParams } from '@/entities';

interface TokenFiltersProps {
  filters: GetScannerResultParams;
  onFiltersChange: (filters: GetScannerResultParams) => void;
}

export const TokenFilters: React.FC<TokenFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const handleChainChange = (chain: GetScannerResultParams['chain']) => {
    onFiltersChange({ ...filters, chain });
  };

  const handleMinVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : undefined;

    onFiltersChange({ ...filters, minVolume: value });
  };

  const handleMaxAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : undefined;

    onFiltersChange({ ...filters, maxAge: value });
  };

  const handleMinMcapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : undefined;

    onFiltersChange({ ...filters, minMcap: value });
  };

  return (
    <div data-automationid="token-filters" className="mb-6 rounded-lg bg-white p-4 shadow">
      <h3 className="mb-4 text-lg font-semibold">Filters</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="mb-1 block text-sm font-medium">Chain</label>
          <div className="flex flex-wrap gap-2">
            {(['ETH', 'SOL', 'BASE', 'BSC'] as const).map((chain) => (
              <button
                key={chain}
                className={`rounded px-3 py-1 text-sm ${
                  filters.chain === chain
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                onClick={() => handleChainChange(chain)}
              >
                {chain}
              </button>
            ))}
            <button
              className={`rounded px-3 py-1 text-sm ${
                !filters.chain
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              onClick={() => handleChainChange(undefined)}
            >
              All
            </button>
          </div>
        </div>

        <div>
          <Label htmlFor="minVolume" className="mb-1 block">
            Min Volume (USD)
          </Label>
          <Input
            id="minVolume"
            type="number"
            className="w-full"
            value={filters.minVolume || ''}
            onChange={handleMinVolumeChange}
            placeholder="Min volume"
          />
        </div>

        <div>
          <Label htmlFor="maxAge" className="mb-1 block">
            Max Age (hours)
          </Label>
          <Input
            id="maxAge"
            type="number"
            className="w-full"
            value={filters.maxAge || ''}
            onChange={handleMaxAgeChange}
            placeholder="Max age"
          />
        </div>

        <div>
          <Label htmlFor="minMcap" className="mb-1 block">
            Min Market Cap (USD)
          </Label>
          <Input
            id="minMcap"
            type="number"
            className="w-full"
            value={filters.minMcap || ''}
            onChange={handleMinMcapChange}
            placeholder="Min market cap"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isNotHP"
            checked={filters.isNotHP || false}
            onCheckedChange={(checked) => 
              onFiltersChange({ ...filters, isNotHP: checked as boolean })
            }
          />
          <Label htmlFor="isNotHP">
            Exclude Honeypots
          </Label>
        </div>
      </div>
    </div>
  );
};
