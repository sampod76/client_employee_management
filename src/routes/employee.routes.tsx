import CheckInOut from "../pages/checkInOut/checkInOut";
import CheckInOutList from "../pages/checkInOut/checkInOutList";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";

export const employeePaths = [
  {
    name: "Dashboard",
    path: "dashboard",
    element: <EmployeeDashboard />,
  },
  {
    path: "check-in-out",
    element: <CheckInOut />,
  },
  {
    name: "Check In/Out list",
    path: "check-in-out-list",
    element: <CheckInOutList />,
  },
  // {
  //   name: "My Schedule",
  //   path: "schedule",
  //   element: <MySchedule />,
  // },
];
