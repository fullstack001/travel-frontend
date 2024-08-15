import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const LogoutPage = lazy(() => import('src/pages/logout'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

function isAuthenticated() {
  return !!Cookies.get('token');
}

function PrivateRoute({ element }) {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
}

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <PrivateRoute element={<IndexPage />} />, index: true },
        { path: 'user', element: <PrivateRoute element={<UserPage />} /> },
        { path: 'products', element: <PrivateRoute element={<ProductsPage />} /> },
        { path: 'blog', element: <PrivateRoute element={<BlogPage />} /> },
        { path: 'logout', element: <PrivateRoute element={<LogoutPage />} /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
