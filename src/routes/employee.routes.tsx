import CreateProject from "../pages/admin/project/CreateProject";
import ProjectList from "../pages/admin/project/ProjectList";
import CheckInOut from "../pages/checkInOut/checkInOut";
import CheckInOutList from "../pages/checkInOut/checkInOutList";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import LeaveApplication from "../pages/employee/LeaveManagement/LeaveApplication";
import LeaveList from "../pages/employee/LeaveManagement/LeaveList";

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
  {
    name: "Leave management",
    children: [
      {
        name: "Leave Application",
        path: "leave-application",
        element: <LeaveApplication />,
      },
      {
        name: "Leave list",
        path: "leave-list",
        element: <LeaveList />,
      },
    ],
  },
  {
    name: "Project management",
    children: [
      {
        name: "Create Project",
        path: "create-edit-project",
        element: <CreateProject />,
      },
      {
        name: "Project list",
        path: "project-list",
        element: <ProjectList />,
      },
    ],
  },
  // {
  //   name: "My Schedule",
  //   path: "schedule",
  //   element: <MySchedule />,
  // },
];
