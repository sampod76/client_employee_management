import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { adminPaths } from "./admin.routes";
import { routeGenerator } from "../utils/routesGenerator";

import { employeePaths } from "./employee.routes";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import ChangePassword from "../pages/ChangePassword";
import Dashboard from "../Dashborad";

import RecordRTCApp from "../pages/screen-recorder/Screen-recorder";
import FaceUnlock from "../pages/face-unlock/face-unlock";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute role="admin">
        <Dashboard />
      </ProtectedRoute>
    ),
    children: routeGenerator(adminPaths),
  },
  {
    path: "/employee",
    element: (
      <ProtectedRoute role="employee">
        <Dashboard />
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
    path: "*",
    element: <h1 className="text-center text-5xl"> Not found</h1>,
  },
]);

export default router;
