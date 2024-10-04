import React, { lazy, Suspense } from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider,Navigate } from 'react-router-dom';
import AppLayout from './AppLayout'; 
import Shimmer from './components/Shimmer/Shimmer';
import './index.css';
import ProtectedRoute from './ProtectedRoute'; 
import { Provider } from 'react-redux'; 
import store from './redux/store'; 

const Dashboard = lazy(() => import('./components/Pages/DashBoard/Dashboard'));
const Manage = lazy(() => import('./components/Pages/Manage/Manage'));
const SignIn = lazy(() => import('./components/Auth/SignIn/SignIn'));
const SignUp = lazy(() => import('./components/Auth/SignUp/SignUp'));
const Profile = lazy(() => import('./components/Pages/Profile/Profile'));

// const Navigate = useNavigate()
const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,  
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={<Shimmer />}>
            <SignIn />
          </Suspense>
        ),
      },
      {
        path: '/signUp',
        element: (
          <Suspense fallback={<Shimmer />}>
            <SignUp />
          </Suspense>
        ),
      },
      {
        path: '/dashboard',
        element: (
          <Suspense fallback={<Shimmer />}>
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: '/manage',
        element: (
          <Suspense fallback={<Shimmer />}>
            <ProtectedRoute>
              <Manage />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: '/profile',
        element: (
          <Suspense fallback={<Shimmer />}>
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: '/shimmer',
        element: (
          <Suspense fallback={<Shimmer />}>
              <Shimmer />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}> 
      <RouterProvider router={appRouter} />
    </Provider>
  </StrictMode>
);
