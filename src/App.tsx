import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import * as React from 'react';
import { HelmetProvider } from 'react-helmet-async';

import { AppRouter } from '@/app-router.tsx';
import { Toaster } from '@/components/ui/sonner';
import { WebSocketProvider } from '@/contexts/WebSocketContext';
import { ErrorBoundary } from '@/ErrorBoundary.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      experimental_prefetchInRender: true,
    },
  },
});

export const App = () => {
  return (
    <ErrorBoundary>
      <React.Suspense fallback={null}>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <WebSocketProvider>
              <AppRouter />
              <ReactQueryDevtools initialIsOpen={false} position="bottom" />
              <Toaster />
            </WebSocketProvider>
          </QueryClientProvider>
        </HelmetProvider>
      </React.Suspense>
    </ErrorBoundary>
  );
};
