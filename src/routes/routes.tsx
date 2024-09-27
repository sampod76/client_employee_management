import { createBrowserRouter, Link } from 'react-router-dom';
import App from '../App';
import Login from '../pages/Login';
import Register from '../pages/Register';
import { routeGenerator } from '../utils/routesGenerator';
import { adminPaths } from './admin.routes';

import ProtectedRoute from '../components/layout/ProtectedRoute';
import ChangePassword from '../pages/ChangePassword';
import { employeePaths } from './employee.routes';

import { Button, Result } from 'antd';
import Dashboard from '../Dashboard';
import FaceUnlock from '../pages/face-unlock/face-unlock';
import ForgotPassword from '../pages/ForgetPassword';
import Profile from '../pages/Profile';
import ResetPassword from '../pages/ResetPassword';
import RecordRTCApp from '../pages/screen-recorder/Screen-recorder';
import VerifyOtp from '../pages/VerifyOtp';
import Protect from '../Protect';
import ImageEditor from '@pages/ImageEditor';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/screen-recorder',
    element: (
      <Protect>
        <RecordRTCApp />
      </Protect>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute role="admin">
        <Dashboard />
      </ProtectedRoute>
    ),
    children: routeGenerator(adminPaths),
  },
  {
    path: '/employee',
    element: (
      <ProtectedRoute role="employee">
        <Dashboard />
      </ProtectedRoute>
    ),
    children: routeGenerator(employeePaths),
  },
  {
    path: '/profile',
    element: <Profile />,
    children: routeGenerator(adminPaths),
  },
  {
    path: '/login',
    element: <Login />,
  },

  {
    path: '/screen-recorder',
    element: <RecordRTCApp />,
  },
  {
    path: '/face-unlock',
    element: <FaceUnlock />,
  },
  {
    path: '/change-password',
    element: <ChangePassword />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/verify-otp',
    element: <VerifyOtp />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/edit',
    element: <ImageEditor />,
  },
  {
    path: '*',
    element: (
      <div className="text-center text-5xl">
        {' '}
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={
            <Button type="primary">
              <Link to="/">Back Home</Link>
            </Button>
          }
        />
      </div>
    ),
  },
]);

export default router;
