import ProjectView from "@pages/admin/project/ViewProject";
import ChangePassword from "@pages/ChangePassword";
import AdminToCheckInOut from "@pages/checkInOut/AdminToCheckInOut";
import CreateTask from "@pages/teskManagement/CreateTask";
import SubmitTask from "@pages/teskManagement/SubmitTask";
import TaskList from "@pages/teskManagement/TaskList";
import ViewTask from "@pages/teskManagement/ViewTask";
import ProfileUpdate from "@pages/UpdataProfile";
import AdminDashboard from "../pages/admin/AdminDashboard";
import EmployeeList from "../pages/admin/employeeManagement/employeeList";
import CreateProject from "../pages/admin/project/CreateProject";
import ProjectList from "../pages/admin/project/ProjectList";
import CheckInOutList from "../pages/checkInOut/checkInOutList";
import LeaveList from "../pages/employee/LeaveManagement/LeaveList";
import LoginHistory from "../pages/LoginHistory";
import Profile from "../pages/Profile";

export const adminPaths = [
  {
    name: "Dashboard",
    path: "dashboard",
    element: <AdminDashboard />,
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
    path: "change-password",
    element: <ChangePassword />,
  },
  {
    path: "profile-update",
    element: <ProfileUpdate />,
  },
  {
    name: "Attendance management",
    children: [
      {
        name: "Attendance list",
        path: "check-in-out-list",
        element: <CheckInOutList />,
      },
      {
        name: "Add attendance",
        path: "add-attendance",
        element: <AdminToCheckInOut />,
      },
    ],
  },
  {
    name: "Employee Management",
    children: [
      {
        name: "Employee request",
        path: "employee-request",
        element: <EmployeeList status="pending" />,
      },
      {
        name: "Employee List",
        path: "employee-list",
        element: <EmployeeList />,
      },
      {
        // name: "Employee list",
        path: "employee-profile-and-editor",
        element: <Profile />,
      },
    ],
  },
  {
    name: "Leave management",
    children: [
      {
        name: "Leave request",
        path: "request-leave-list",
        element: <LeaveList status={"pending"} />,
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
];

// export const adminSidebarItems = adminPaths.reduce(
//   (acc: TSidebarItem[], item) => {
//     if (item.path && item.name) {
//       acc.push({
//         key: item.name,
//         label: <NavLink to={`/admin/${item.path}`}>{item.name}</NavLink>,
//       });
//     }

//     if (item.children) {
//       acc.push({
//         key: item.name,
//         label: item.name,
//         children: item.children.map((child) => ({
//           key: child.name,
//           label: <NavLink to={`/admin/${child.path}`}>{child.name}</NavLink>,
//         })),
//       });
//     }

//     return acc;
//   },
//   []
// );

//* Programatical way

// export const adminRoutes = adminPaths.reduce((acc: TRoute[], item) => {
//   if (item.path && item.element) {
//     acc.push({
//       path: item.path,
//       element: item.element,
//     });
//   }

//   if (item.children) {
//     item.children.forEach((child) => {
//       acc.push({
//         path: child.path,
//         element: child.element,
//       });
//     });
//   }

//   return acc;
// }, []);

//! Hard coded way

// export const adminPaths = [
//   {
//     path: 'dashboard',
//     element: <AdminDashboard />,
//   },
//   {
//     path: 'create-student',
//     element: <CreateStudent />,
//   },
//   {
//     path: 'create-admin',
//     element: <CreateAdmin />,
//   },
//   {
//     path: 'create-faculty',
//     element: <CreateFaculty />,
//   },
// ];
