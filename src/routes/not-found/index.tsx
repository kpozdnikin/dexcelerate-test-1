import { RouteObject } from 'react-router';

import { Routes } from '@/routes/routes-list.ts';

export const notFound: RouteObject = {
  path: Routes.NOT_FOUND,
  handle: { title: '404', roles: {}, requireAuth: false },
  lazy: async () => {
    const module = await import('./NotFoundPage.tsx');

    return { Component: module.NotFoundPage };
  },
};
