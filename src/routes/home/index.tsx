import { RouteObject } from 'react-router';

import { Routes } from '@/routes/routes-list.ts';

export const homeRoute: RouteObject = {
  path: Routes.HOME,
  lazy: async () => {
    const module = await import('./HomePage.tsx');

    return { Component: module.HomePage };
  },
};
