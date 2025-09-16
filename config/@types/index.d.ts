import { UseQueryOptions } from '@tanstack/react-query';
/* eslint-disable @typescript-eslint/no-explicit-any */

declare module '*.json' {
  const content: any;
  export default content;
}

declare module '@tanstack/react-query' {
  interface UseQueryOptions extends UseQueryOptions {
    queryKey?: UseQueryOptions['queryKey'];
  }
}