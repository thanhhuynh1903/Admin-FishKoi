import { lazy } from 'react';
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
import ChatScreen from 'pages/chat-message/ChatScreen';
import BlogDetail from 'pages/BlogDetail/BlogDetail';
import Consultation from 'pages/component-overview/Consultation';
import Package from 'pages/component-overview/Package';
import Advertisement from 'pages/component-overview/Advertisement';
import Product from 'pages/component-overview/Product';
import Report from 'pages/component-overview/Report';
import ProtectedRoute from './ProtectedRoute';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

const MainRoutes = {
  path: '/',
  element: (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
  children: [
    {
      path: '',
      element: <DashboardDefault />
    },
    {
      path: 'blog',
      element: <Color />
    },
    // {
    //   path: 'dashboard',
    //   children: [
    //     {
    //       path: 'default',
    //       element: <DashboardDefault />
    //     }
    //   ]
    // },
    {
      path: 'support-centre',
      element: <ChatScreen />
    },
    // {
    //   path: 'ponds',
    //   element: <Shadow />
    // },
    {
      path: 'users',
      element: <Typography />
    },
    {
      path: 'blogdetail/:id',
      element: <BlogDetail />
    },
    {
      path: 'consultation',
      element: <Consultation />
    },
    {
      path: 'package',
      element: <Package />
    },
    // {
    //   path: 'advertisement',
    //   element: <Advertisement />
    // },
    {
      path: 'products',
      element: <Product />
    },
    {
      path: 'report',
      element: <Report />
    }
  ]
};

export default MainRoutes;
