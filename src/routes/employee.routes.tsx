import ProjectView from "@pages/admin/project/ViewProject";
import CreateTask from "@pages/teskManagement/CreateTask";
import SubmitTask from "@pages/teskManagement/SubmitTask";
import TaskList from "@pages/teskManagement/TaskList";
import ViewTask from "@pages/teskManagement/ViewTask";
import CreateProject from "../pages/admin/project/CreateProject";
import ProjectList from "../pages/admin/project/ProjectList";
import CheckInOut from "../pages/checkInOut/checkInOut";
import CheckInOutList from "../pages/checkInOut/checkInOutList";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import LeaveApplication from "../pages/employee/LeaveManagement/LeaveApplication";
import LeaveList from "../pages/employee/LeaveManagement/LeaveList";
import LoginHistory from "../pages/LoginHistory";
import Profile from "../pages/Profile";

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
    path: "profile",
    element: <Profile />,
  },
  {
    name: "Login history",
    path: "login-history",
    element: <LoginHistory />,
  },
  {
    name: "Check In/Out List",
    path: "check-in-out-list",
    element: <CheckInOutList />,
  },
  {
    name: "Leave management",
    children: [
      {
        name: "Leave Application",
        path: "leave-application-and-editor",
        element: <LeaveApplication />,
      },
      {
        name: "Leave List",
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
        name: "Project List",
        path: "project-list",
        element: <ProjectList />,
      },
      {
        path: "project-view/:id",
        element: <ProjectView />,
      },
    ],
  },
  {
    name: "Task management",
    children: [
      {
        name: "Create Task",
        path: "create-edit-task",
        element: <CreateTask />,
      },
      {
        name: "Task List",
        path: "task-list",
        element: <TaskList />,
      },
      {
        // name: "Task List",
        path: "task-view/:id",
        element: <ViewTask />,
      },
      {
        // name: "Task List",
        path: "task-submit/:id",
        element: <SubmitTask />,
      },
    ],
  },
  // {
  //   name: "My Schedule",
  //   path: "schedule",
  //   element: <MySchedule />,
  // },
];
