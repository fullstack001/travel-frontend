import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const ReservationPage = lazy(() => import('src/pages/reservation'));
export const DailyPlanningPage = lazy(() => import('src/pages/daily-plannig'));
export const DriverPlanningPage = lazy(() => import('src/pages/driver'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const LogoutPage = lazy(() => import('src/pages/logout'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const HotelPage = lazy(() => import('src/pages/hotels'));
export const AgencyPage = lazy(() => import('src/pages/agency'));
export const ServicePage = lazy(() => import('src/pages/service'));
export const VehiclePage = lazy(() => import('src/pages/vehicle'));
export const GuidPage = lazy(() => import('src/pages/guid'));
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
        { path: 'reservation', element: <PrivateRoute element={<ReservationPage />} /> },
        { path: 'daily-planning', element: <PrivateRoute element={<DailyPlanningPage />} /> },
        { path: 'driver-planning', element: <PrivateRoute element={<DriverPlanningPage />} /> },
        { path: 'products', element: <PrivateRoute element={<ProductsPage />} /> },
        { path: 'blog', element: <PrivateRoute element={<BlogPage />} /> },
        { path: 'agencies', element: <PrivateRoute element={<AgencyPage />} /> },
        { path: 'hotels', element: <PrivateRoute element={<HotelPage />} /> },
        { path: 'services', element: <PrivateRoute element={<ServicePage />} /> },
        { path: 'vehicle', element: <PrivateRoute element={<VehiclePage />} /> },
        { path: 'guid', element: <PrivateRoute element={<GuidPage />} /> },
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
