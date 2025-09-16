import React from 'react';

interface GridNoItemsMessageProps {
  isColumnFiltered?: boolean;
  isGlobalFiltered?: boolean;
  isFailed?: boolean;
  isLoading?: boolean;
  noDataMessage?: string;
  actionsComponent?: React.ReactNode;
  className?: string;
}

const GridNoItemsMessage: React.FC<GridNoItemsMessageProps> = ({
  isColumnFiltered,
  isGlobalFiltered,
  isFailed,
  isLoading,
  noDataMessage = 'No data',
  actionsComponent,
  className,
}) => {
  let message = noDataMessage;

  if (isLoading) {
    message = 'Loading...';
  } else if (isFailed) {
    message = 'Failed to load data';
  } else if (isColumnFiltered || isGlobalFiltered) {
    message = 'No results found';
  }

  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center p-8 ${className}`}
    >
      <div className="text-center text-gray-500">{message}</div>
      {actionsComponent && <div className="mt-4">{actionsComponent}</div>}
    </div>
  );
};

export default GridNoItemsMessage;
