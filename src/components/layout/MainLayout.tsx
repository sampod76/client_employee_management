import { Button, Layout } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import { logout, selectCurrentUser } from '../../redux/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import UserAvatarUI from '../ui/NavUI/UserAvatarUI';
import Sidebar from './Sidebar';
const { Header, Content } = Layout;

const MainLayout = () => {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();

  // const handleLogout = () => {
  //   dispatch(logout());
  // };

  return (
    <Layout className="mx-auto max-w-[1990px]" style={{ height: '100%' }}>
      <Sidebar />
      <Layout>
        <Header>
          <div className="flex h-full items-center justify-between">
            <div className="flex items-center gap-2">
              <Button type="primary">
                <Link
                  to={`/${user?.role}/dashboard`}
                  className="text-lg text-white"
                >
                  <p>Home</p>
                </Link>
              </Button>
              <Button type="primary">
                <Link to={`/screen-recorder`}>Screen-recorder</Link>
              </Button>
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
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
