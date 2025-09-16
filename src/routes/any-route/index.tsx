import { Navigate, RouteObject } from 'react-router';

import { Routes } from '@/routes/routes-list.ts';

export const anyRoute: RouteObject = {
  path: Routes.ANY,
  element: <Navigate to={Routes.NOT_FOUND} replace={true} />,
};
