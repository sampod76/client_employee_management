import { Button, Layout } from "antd";
import Sidebar from "./Sidebar";
import { useAppDispatch } from "../../redux/hooks";
import { logout } from "../../redux/features/auth/authSlice";
import { Outlet } from "react-router-dom";
import UserAvatarUI from "../ui/NavUI/UserAvatarUI";
const { Header, Content } = Layout;

const MainLayout = () => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Layout className="" style={{ height: "100%" }}>
      <Sidebar />
      <Layout>
        <Header>
          <div className="flex justify-between  items-center h-full">
            <div></div>
            <div>
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
