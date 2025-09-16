import { createBrowserRouter, Outlet, RouterProvider } from 'react-router';

import { ErrorBoundary } from '@/ErrorBoundary.tsx';
import { anyRoute } from '@/routes/any-route';
import { homeRoute } from '@/routes/home';
import { notFound } from '@/routes/not-found';

const router = createBrowserRouter([
  {
    element: (
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    ),
    children: [
      anyRoute,
      notFound,
      homeRoute
    ]
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
