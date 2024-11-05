import { Button, Layout } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import { Link, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import UserAvatarUI from './components/ui/NavUI/UserAvatarUI';
import {
  logout,
  selectCurrentUser,
  useCurrentToken,
} from './redux/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from './redux/hooks';

const Protect = ({ children }: { children: React.ReactNode }) => {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();

  const token = useAppSelector(useCurrentToken);
  // console.log("🚀 ~ ProtectedRoute ~ token:", token);
  if (!token) {
    return <Navigate to="/login" replace={true} />;
  }

  if (!user?.role) {
    dispatch(logout());
    return <Navigate to="/login" replace={true} />;
  }

  return (
    <Layout className="mx-auto max-w-[1990px]" style={{ height: '100%' }}>
      <Sidebar />
      <Layout>
        <Header>
          <div className="flex h-full items-center justify-between">
            <div>
              <Link
                to={`/${user?.role}/dashboard`}
                className="text-lg text-white"
              >
                <p>Home</p>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-4">
              {user?.role !== 'admin' && (
                <Button type="primary">
                  <Link to={`/${user?.role}/check-in-out`}>Check in/out</Link>
                </Button>
              )}
              <UserAvatarUI />
            </div>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Protect;
