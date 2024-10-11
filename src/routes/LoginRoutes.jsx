import { lazy } from 'react';
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout'; // Assuming you have a minimal layout for login pages

const AuthLogin = Loadable(lazy(() => import('pages/authentication/login'))); // Path to your AuthLogin component

const LoginRoutes = {
  path: '/',
  element: <MinimalLayout />, // Use a minimal layout for login
  children: [
    {
      path: '/',
      element: <AuthLogin />
    }
  ]
};

export default LoginRoutes;
