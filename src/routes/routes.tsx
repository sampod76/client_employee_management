import { createBrowserRouter, Link } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { adminPaths } from "./admin.routes";
import { routeGenerator } from "../utils/routesGenerator";

import { employeePaths } from "./employee.routes";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import ChangePassword from "../pages/ChangePassword";

import RecordRTCApp from "../pages/screen-recorder/Screen-recorder";
import FaceUnlock from "../pages/face-unlock/face-unlock";
import { Button, Result } from "antd";
import ForgotPassword from "../pages/ForgetPassword";
import VerifyOtp from "../pages/VerifyOtp";
import ResetPassword from "../pages/ResetPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute role="admin">
        <App />
      </ProtectedRoute>
    ),
    children: routeGenerator(adminPaths),
  },
  {
    path: "/employee",
    element: (
      <ProtectedRoute role="employee">
        <App />
      </ProtectedRoute>
    ),
    children: routeGenerator(employeePaths),
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/screen-recorder",
    element: <RecordRTCApp />,
  },
  {
    path: "/face-unlock",
    element: <FaceUnlock />,
  },
  {
    path: "/change-password",
    element: <ChangePassword />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forget-password",
    element: <ForgotPassword />,
  },
  {
    path: "/verify-otp",
    element: <VerifyOtp />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "*",
    element: (
      <div className="text-center text-5xl">
        {" "}
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
