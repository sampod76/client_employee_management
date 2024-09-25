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
    name: "Employee Check In/Out",
    path: "check-in-out-list",
    element: <CheckInOutList />,
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
