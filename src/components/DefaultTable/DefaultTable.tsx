import {
  FilterFn,
  flexRender,
  Row,
  RowData,
  Table as ReactTable,
} from '@tanstack/react-table';
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import * as React from 'react';

import { DebouncedInput, TruncateText ,
  Pagination,
  SortButton,
} from '@/components';
import { cn } from '@/lib';

import GridNoItemsMessage from '../GridNoItemsMessage';
import { Label } from '../ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

import './DefaultTable.css';

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }

  interface ColumnMeta<TData extends RowData, TValue> {
    filterOptions?: { label: string; value: string }[];
  }
}

interface DefaultTableProps<TData extends RowData> {
  table: ReactTable<TData>;
  noDataMessage?: string;
  noDataActionsComponent?: React.ReactNode;
  additionalControlsComponent?: React.ReactNode;
  toolbarStart?: React.ReactNode;
  toolbarEnd?: React.ReactNode;
  isGlobalFilterHidden?: boolean;
  isLoading?: boolean;
  isEmbedded?: boolean;
  isFetchFailed?: boolean;
  hideHeader?: boolean;
  hideToolbar?: boolean;
  searchLabel?: string;
  filterContainerClassName?: string;
  headerClassName?: string;
  bodyRowClassName?: string;
  bodyCellClassName?: string;
  rowActiveClass?: string;
  className?: string;
  onRowClick?(row: Row<TData>): void;
  onRowDoubleClick?(row: Row<TData>): void;
  selectedRowId?: string;
  noItemsMessageClassname?: string;
  pagination?: boolean;
  enableTableOverflow?: boolean;
  withoutTruncation?: boolean;
  virtualRowHeight?: number;
  useVirtual?: boolean;
  overscan?: number;
}

export function DefaultTable<TData extends RowData>({
  table,
  toolbarStart,
  toolbarEnd,
  isLoading,
  noDataMessage,
  noDataActionsComponent,
  additionalControlsComponent,
  searchLabel,
  filterContainerClassName,
  headerClassName,
  bodyRowClassName,
  bodyCellClassName,
  onRowClick,
  onRowDoubleClick,
  selectedRowId,
  rowActiveClass,
  isGlobalFilterHidden = false,
  isEmbedded = false,
  isFetchFailed,
  hideHeader = false,
  hideToolbar = false,
  pagination = false,
  noItemsMessageClassname,
  className,
  enableTableOverflow,
  withoutTruncation,
  virtualRowHeight,
  useVirtual,
  overscan,
}: DefaultTableProps<TData>) {
  noDataMessage = noDataMessage ?? 'No data';

  const parentRef = React.useRef<HTMLDivElement>(null);

  const [heightAfterBlock, setHeightAfterBlock] = React.useState(0);
  const setHeight = React.useCallback(
    (height: number) => {
      if (height === heightAfterBlock) {
        return;
      }

      document.documentElement.style.setProperty(
        '--fix-table-height',
        `${height}px`,
      );
      setHeightAfterBlock(height);
    },
    [heightAfterBlock],
  );

  const { rows } = table.getRowModel();

  const rowVirtualize = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => virtualRowHeight ?? 53,
    overscan: overscan ?? 1,
  });

  const virtualItems = rowVirtualize.getVirtualItems();

  const rowsMemo = React.useMemo(() => {
    return useVirtual ? virtualItems : rows;
  }, [virtualItems, rows, useVirtual]);

  return (
    <div
      className={`flex h-full w-full flex-col ${
        isEmbedded ? '' : 'rounded-xl bg-gray-900'
      } ${isGlobalFilterHidden ? 'pt-0' : ''}`}
    >
      {!hideHeader ? (
        <header className="mb-3">{additionalControlsComponent}</header>
      ) : null}
      {!hideToolbar ? (
        <div className="mb-3 flex w-full items-center">
          <div className="flex w-full items-center justify-between gap-10">
            <div
              className={cn(
                'flex flex-1 items-center space-x-1',
                filterContainerClassName,
              )}
            >
              {isGlobalFilterHidden ? null : (
                <div className="flex flex-1 flex-col gap-1">
                  {searchLabel ? (
                    <Label className="leading-5">{searchLabel}</Label>
                  ) : null}
                  <DebouncedInput
                    disabled={isLoading}
                    value={table.getState().globalFilter ?? ''}
                    onChange={(value) => table.setGlobalFilter(String(value))}
                    className="h-10"
                    placeholder="Search"
                    iconPosition="left"
                  />
                </div>
              )}
              {toolbarStart}
            </div>
            {toolbarEnd}
          </div>
        </div>
      ) : null}
      <div
        ref={parentRef}
        className={cn(
          'default-table relative flex h-full w-full flex-[1_1_1px]  flex-col rounded-md bg-gray-800',
          className,
          enableTableOverflow && rows.length ? 'overflow-auto' : '',
        )}
      >
        <div
          className="default-table-wrapper flex flex-col rounded-lg"
          style={{
            height: `${useVirtual && rows.length && !isLoading ? `${rowVirtualize.getTotalSize()}px` : '100%'}`,
          }}
        >
          <Table className="after:block after:h-[var(--fix-table-height)]">
            <TableHeader className="sticky top-0 z-20">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="z-10 bg-gray-700 border-gray-600"
                >
                  {headerGroup.headers.map((header, i, arr) => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{
                          width:
                            header.getSize() !== 150
                              ? header.getSize()
                              : undefined,
                        }}
                        className={cn(
                          headerClassName,
                          `bg-gray-700 ${
                            header.index === 0 ? 'rounded-l-lg' : ''
                          } ${
                            header.index === arr.length - 1
                              ? 'rounded-r-lg'
                              : ''
                          } text-gray-200 h-10`,
                        )}
                      >
                        {header.isPlaceholder ? null : (
                          <div className="flex items-center space-x-1">
                            <span>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                            </span>
                            {header.column.getCanSort() ? (
                              <SortButton column={header.column} />
                            ) : null}
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody
              ref={(ref) => {
                if (!ref || !useVirtual) {
                  setHeight(0);

                  return;
                }

                const height =
                  rowVirtualize.getTotalSize() -
                  ref.getBoundingClientRect().height;
                setHeight(height);
              }}
            >
              {rowsMemo?.length && !isLoading
                ? rowsMemo.map((virtualRow, index) => {
                    let row: Row<TData>;
                    let tableRowStyle: React.CSSProperties = {};

                    if (useVirtual) {
                      row = rows[virtualRow.index];
                      tableRowStyle = {
                        height: `${(virtualRow as VirtualItem).size}px`,
                        transform: `translateY(${
                          (virtualRow as VirtualItem).start -
                          index * (virtualRow as VirtualItem).size
                        }px)`,
                      };
                    } else {
                      row = virtualRow as Row<TData>;
                    }

                    const rowData = row.original as TData & {
                      hide?: boolean;
                    };

                    if (rowData.hide) {
                      return null;
                    }

                    return (
                      <TableRow
                        key={row.id}
                        className={cn(
                          'group/row',
                          selectedRowId === row.id
                            ? rowActiveClass
                            : bodyRowClassName,
                        )}
                        data-rowindex={index}
                        data-state={row.getIsSelected() && 'selected'}
                        onDoubleClick={() => onRowDoubleClick?.(row)}
                        onClick={() => onRowClick?.(row)}
                        style={tableRowStyle}
                      >
                        {row.getVisibleCells().map((cell) => {
                          const content = flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          );

                          return (
                            <TableCell
                              key={cell.id}
                              style={{
                                width:
                                  cell.column.getSize() !== 150
                                    ? cell.column.getSize()
                                    : undefined,
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                maxWidth: cell.column.getSize()
                                  ? cell.column.getSize()
                                  : undefined,
                                minWidth: cell.column.columnDef.minSize
                                  ? cell.column.columnDef.minSize
                                  : undefined,
                              }}
                              className={cn(
                                'text-gray-300 h-14 border-gray-600',
                                bodyCellClassName,
                              )}
                            >
                              {withoutTruncation ? (
                                <div className="truncate">{content}</div>
                              ) : (
                                <TruncateText message={content} />
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })
                : null}
            </TableBody>
          </Table>
          {!rows?.length || isLoading ? (
            <GridNoItemsMessage
              isColumnFiltered={!!table.getState().columnFilters?.length}
              isGlobalFiltered={!!table.getState().globalFilter?.length}
              isFailed={isFetchFailed}
              isLoading={isLoading}
              noDataMessage={noDataMessage}
              actionsComponent={noDataActionsComponent}
              className={noItemsMessageClassname}
            />
          ) : null}
        </div>
      </div>
      {pagination &&
        (table.getPreFilteredRowModel().rows.length > 10 ||
          table.getPageCount() > 1) && <Pagination table={table} />}
    </div>
  );
}
