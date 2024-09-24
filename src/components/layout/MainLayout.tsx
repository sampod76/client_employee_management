import { Button, Layout } from "antd";
import Sidebar from "./Sidebar";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout, selectCurrentUser } from "../../redux/features/auth/authSlice";
import { Link, Outlet } from "react-router-dom";
import UserAvatarUI from "../ui/NavUI/UserAvatarUI";
const { Header, Content } = Layout;

const MainLayout = () => {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Layout className="max-w-[1990px] mx-auto" style={{ height: "100%" }}>
      <Sidebar />
      <Layout>
        <Header>
          <div className="flex justify-between  items-center h-full">
            <div>
              <Link
                to={`/${user?.role}/dashboard`}
                className="text-lg text-white"
              >
                <p>Home</p>
              </Link>
            </div>
            <div className="flex  justify-center items-center gap-4">
              {user?.role !== "admin" && (
                <Button type="primary">
                  <Link to={`/${user?.role}/check-in-out`}>Check in/out</Link>
                </Button>
              )}
              <UserAvatarUI />
            </div>
          </div>
        </Header>
        <Content style={{ margin: "24px 16px 0" }}>
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
