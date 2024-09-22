import { Layout, Menu } from "antd";
import { sidebarItemsGenerator } from "../../utils/sidebarItemsGenerator";
import { adminPaths } from "../../routes/admin.routes";

import { employeePaths } from "../../routes/employee.routes";
import { useAppSelector } from "../../redux/hooks";
import {
  TUser,
  selectCurrentUser,
  useCurrentToken,
} from "../../redux/features/auth/authSlice";
import { verifyToken } from "../../utils/verifyToken";

const { Sider } = Layout;

const userRole = {
  ADMIN: "admin",
  EMPLOYEE: "employee",
};

const Sidebar = () => {
  const token = useAppSelector(useCurrentToken);
  console.log("🚀 ~ Sidebar ~ token:", token);
  const currentUser = useAppSelector(selectCurrentUser);

  let user;

  if (token) {
    user = verifyToken(token);
  }

  let sidebarItems;

  switch ((user as TUser)!.role) {
    case userRole.ADMIN:
      sidebarItems = sidebarItemsGenerator(adminPaths, userRole.ADMIN);
      break;
    case userRole.EMPLOYEE:
      sidebarItems = sidebarItemsGenerator(employeePaths, userRole.EMPLOYEE);
      break;

    default:
      break;
  }

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      style={{ height: "100vh", position: "sticky", top: "0", left: "0" }}
    >
      <div
        style={{
          color: "white",
          height: "4rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 className="text-lg font-bold text-center p-5">
          EMS <br /> ({currentUser?.role!})
        </h1>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["4"]}
        //@ts-ignore
        items={sidebarItems}
      />
    </Sider>
  );
};

export default Sidebar;
