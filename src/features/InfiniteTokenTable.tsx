import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { useEffect, useMemo, useRef } from 'react';

import { DefaultTable } from '@/components';
import { TokenData } from '@/entities';
import { TokenNameCell } from '@/features/TokenNameCell';

interface InfiniteTokenTableProps {
  data: TokenData[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  title: string;
  defaultSortField?: string;
  defaultSortDirection?: 'asc' | 'desc';
  loadMoreOnScroll: (containerRef: React.RefObject<HTMLElement>) => (() => void) | void;
}

export const InfiniteTokenTable: React.FC<InfiniteTokenTableProps> = ({
  data,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  title,
  defaultSortField = 'volume',
  defaultSortDirection = 'desc',
  loadMoreOnScroll,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const columns = useMemo<ColumnDef<TokenData>[]>(
    () => [
      {
        accessorKey: 'token1Name',
        header: 'Token Name/Symbol',
        cell: ({ row }) => {
          const token = row.original;

          return <TokenNameCell token={token} />;
        },
        enableSorting: true,
        enableGlobalFilter: true,
      },
      {
        accessorKey: 'routerAddress',
        header: 'Exchange',
        cell: ({ row }) => {
          const token = row.original;

          return (
            <div className="text-gray-300">
              {token.migration.virtualRouterType || token.routerAddress}
            </div>
          );
        },
        enableSorting: true,
        enableGlobalFilter: true,
      },
      {
        accessorKey: 'price',
        header: 'Price (USD)',
        cell: ({ row }) => {
          const price = row.original.price;

          return <div className="text-gray-300">${price.toFixed(price < 0.01 ? 8 : 2)}</div>;
        },
        enableSorting: true,
      },
      {
        accessorKey: 'mcap.current',
        header: 'Market Cap',
        cell: ({ row }) => {
          const mcap = row.original.mcap.current;

          return <div className="text-gray-300">${mcap.toLocaleString()}</div>;
        },
        enableSorting: true,
      },
      {
        accessorKey: 'volume',
        header: 'Volume (24h)',
        cell: ({ row }) => {
          const volume = row.original.volume;

          return <div className="text-gray-300">${volume !== null ? volume.toLocaleString() : '0'}</div>;
        },
        enableSorting: true,
      },
      {
        accessorKey: 'priceChangePcs.5m',
        header: '5m',
        cell: ({ row }) => {
          const change = row.original.priceChangePcs['5m'];

          return (
            <div
              className={`${
                change > 0 ? 'text-green-400' : change < 0 ? 'text-red-400' : 'text-gray-400'
              }`}
            >
              {change !== null ? `${change > 0 ? '+' : ''}${change.toFixed(2)}%` : 'N/A'}
            </div>
          );
        },
        enableSorting: true,
      },
      {
        accessorKey: 'priceChangePcs.1h',
        header: '1h',
        cell: ({ row }) => {
          const change = row.original.priceChangePcs['1h'];

          return (
            <div
              className={`${
                change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {change >= 0 ? '+' : ''}
              {change.toFixed(2)}%
            </div>
          );
        },
        enableSorting: true,
      },
      {
        accessorKey: 'priceChangePcs.6h',
        header: '6h',
        cell: ({ row }) => {
          const change = row.original.priceChangePcs['6h'];

          return (
            <div
              className={`${
                change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {change >= 0 ? '+' : ''}
              {change.toFixed(2)}%
            </div>
          );
        },
        enableSorting: true,
      },
      {
        accessorKey: 'priceChangePcs.24h',
        header: '24h',
        cell: ({ row }) => {
          const change = row.original.priceChangePcs['24h'];

          return (
            <div
              className={`${
                change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {change >= 0 ? '+' : ''}
              {change.toFixed(2)}%
            </div>
          );
        },
        enableSorting: true,
      },
      {
        accessorKey: 'age',
        header: 'Age',
        cell: ({ row }) => {
          const createdDate = row.original.age;
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - createdDate.getTime());
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          
          if (diffDays > 0) {
            return <div className="text-gray-300">{diffDays}d {diffHours}h</div>;
          } else {
            return <div className="text-gray-300">{diffHours}h</div>;
          }
        },
        enableSorting: true,
      },
      {
        accessorKey: 'transactions',
        header: 'Buys/Sells',
        cell: ({ row }) => {
          const { buys, sells } = row.original.transactions;

          return (
            <div>
              <span className="text-green-400">{buys || 0}</span>
              {' / '}
              <span className="text-red-400">{sells || 0}</span>
            </div>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: 'liquidity',
        header: 'Liquidity',
        cell: ({ row }) => {
          const liquidity = row.original.liquidity;
          const percentChange = row.original.mcap.percentChange;

          return (
            <div>
              <div className="text-gray-300">${liquidity ? liquidity.toLocaleString() : '0'}</div>
              {percentChange !== null && (
                <div
                  className={`text-sm ${
                    percentChange >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {percentChange >= 0 ? '+' : ''}
                  {percentChange.toFixed(2)}%
                </div>
              )}
            </div>
          );
        },
        enableSorting: true,
      },
      {
        accessorKey: 'audit',
        header: 'Audit',
        cell: ({ row }) => {
          const { contractVerified, isMintAuthDisabled, isFreezeAuthDisabled, honeyPot } = row.original.audit;

          return (
            <div className="flex space-x-1">
              {contractVerified && (
                <span className="rounded bg-green-900 px-2 py-1 text-xs text-green-300">
                  Verified
                </span>
              )}
              {!isMintAuthDisabled && (
                <span className="rounded bg-yellow-900 px-2 py-1 text-xs text-yellow-300">
                  Mintable
                </span>
              )}
              {!isFreezeAuthDisabled && (
                <span className="rounded bg-yellow-900 px-2 py-1 text-xs text-yellow-300">
                  Freezable
                </span>
              )}
              {honeyPot && (
                <span className="rounded bg-red-900 px-2 py-1 text-xs text-red-300">
                  Honeypot
                </span>
              )}
            </div>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: 'socialLinks',
        header: 'Social',
        cell: ({ row }) => {
          const socialLinks = row.original.socialLinks;
          
          return (
            <div className="flex space-x-2">
              {socialLinks.website && (
                <a
                  href={socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 hover:underline"
                >
                  Web
                </a>
              )}
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 hover:underline"
                >
                  Twitter
                </a>
              )}
              {socialLinks.telegram && (
                <a
                  href={socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 hover:underline"
                >
                  TG
                </a>
              )}
              {socialLinks.discord && (
                <a
                  href={socialLinks.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 hover:underline"
                >
                  Discord
                </a>
              )}
            </div>
          );
        },
        enableSorting: false,
      },
    ],
    []
  );

  const table = useReactTable<TokenData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    filterFns: {
      fuzzy: (row, columnId, value) => {
        const rowValue = String(row.getValue(columnId)).toLowerCase();

        return rowValue.includes(String(value).toLowerCase());
      },
    },
    initialState: {
      sorting: [
        {
          id: defaultSortField,
          desc: defaultSortDirection === 'desc',
        },
      ],
    },
  });

  useEffect(() => {
    return loadMoreOnScroll(containerRef);
  }, [loadMoreOnScroll]);

  return (
    <div className="bg-gray-900 text-white h-full flex flex-col">
      <h2 className="mb-4 text-xl font-bold text-white p-4">{title}</h2>
      <div ref={containerRef} className="relative flex-1 min-h-0">
        <DefaultTable
          table={table}
          isLoading={isLoading}
          noDataMessage="No tokens found"
          useVirtual
          virtualRowHeight={60}
          overscan={10}
          enableTableOverflow
        />
        
        {isFetchingNextPage && (
          <div data-automationId="loading" className="flex justify-center items-center py-4 bg-gray-800">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-300">Loading more tokens...</span>
          </div>
        )}
        
        {!hasNextPage && data.length > 0 && !isLoading && (
          <div className="flex justify-center items-center py-4 bg-gray-800 text-gray-400">
            <span>No more tokens to load</span>
          </div>
        )}
      </div>
    </div>
  );
};
