import CheckInOut from "../pages/checkInOut/checkInOut";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";

export const employeePaths = [
  {
    name: "Dashboard",
    path: "dashboard",
    element: <EmployeeDashboard />,
  },
  {
    name: "Check In/Out",
    path: "check-in-out",
    element: <CheckInOut />,
  },
  // {
  //   name: "My Schedule",
  //   path: "schedule",
  //   element: <MySchedule />,
  // },
];
