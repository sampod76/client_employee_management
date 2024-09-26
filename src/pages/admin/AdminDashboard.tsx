import LoadingSkeleton from "@components/ui/Loading/LoadingSkeleton";
import { useGetDashboardQuery } from "@redux/features/admin/adminApi";

const AdminDashboard = () => {
  const { data, isLoading } = useGetDashboardQuery({});
  console.log("🚀 ~ AdminDashboard ~ data:", data);
  if (isLoading) {
    return <LoadingSkeleton />;
  }
  console.log(data);
  const dashboard = data?.data as {
    totalCheckInOffice: number;
    totalCheckOutOffice: number;
    totalEmployees: number;
    totalProjects: number;
    totalTasks: number;
    totalAcceptedEmployees: number;
    totalPendingEmployees: number;
    totalApprovedLeaves: number;
    totalPendingLeaves: number;
  };

  return (
    <div>
      {/* <h1 className="text-center"> Admin Dashboard </h1> */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4   gap-4 xl:gap-6 text-[30px]">
        <div className="border text-white bg-[#4e36e2] w-full p-4 shadow rounded-xl flex justify-between items-center h-28 ">
          <p className="border-2 border-white rounded-md p-1">
            {/* <UserGroupIcon className="h-7 w-7" /> */}
          </p>
          <div className="space-y-2">
            <p className="text-end font-normal text-base lggg:text-lg">
              Employees
            </p>

            <div className="font-bold font-sans text-end text-2xl">
              <span>{dashboard?.totalAcceptedEmployees || 0}</span>
            </div>
          </div>
        </div>
        <div className="border text-white bg-[#1ad588] w-full p-4 shadow rounded-xl flex justify-between items-center h-28">
          <p className="border-2 border-white rounded-md p-1">
            {/* <BeakerIcon className="h-7 w-7" /> */}
          </p>
          <div className="space-y-2">
            <p className="text-end font-normal text-base lggg:text-lg">
              Pending Employees
            </p>
            <div className="font-bold font-sans text-end text-2xl">
              <span>{dashboard?.totalPendingEmployees || 0}</span>
            </div>
          </div>
        </div>
        <div className="border text-white bg-[#60803b] w-full p-4 shadow rounded-xl flex justify-between items-center h-28">
          <p className="border-2 border-white rounded-md p-1">
            {/* <CreditCardIcon className="h-7 w-7" /> */}
          </p>
          <div className="space-y-2">
            <p className="text-end font-normal text-base lggg:text-lg">
              To day CheckIn
            </p>
            <div className="font-bold font-sans text-end text-xl lgg:text-2xl">
              <span>{dashboard?.totalCheckInOffice || 0}</span>
            </div>
          </div>
        </div>
        <div className="border text-white bg-[#107e59] w-full p-4 shadow rounded-xl flex justify-between items-center h-28">
          <p className="border-2 border-white rounded-md p-1">
            {/* <BriefcaseIcon className="h-7 w-7" /> */}
          </p>
          <div className="space-y-2">
            <p className="text-end font-normal text-base lggg:text-lg">
              To day CheckOut
            </p>
            <div className="font-bold font-sans text-end text-xl lgg:text-2xl">
              <span>{dashboard?.totalCheckOutOffice || 0}</span>
            </div>
          </div>
        </div>
        <div className="border text-white bg-[#1d7ca5] w-full p-4 shadow rounded-xl flex justify-between items-center h-28">
          <p className="border-2 border-white rounded-md">
            {/* <UserPlusIcon className="h-7 w-7" /> */}
          </p>
          <div className="space-y-2">
            <p className="text-end font-normal text-base lggg:text-lg">
              Total Projects
            </p>
            <div className="font-bold font-sans text-end text-xl lgg:text-2xl">
              <span>{dashboard?.totalProjects || 0}</span>
            </div>
          </div>
        </div>
        <div className="border text-white bg-[#083346] w-full p-4 shadow rounded-xl flex justify-between items-center h-28">
          <p className="border-2 border-white rounded-md p-1">
            {/* <UserIcon className="h-7 w-7" /> */}
          </p>
          <div className="space-y-2">
            <p className="text-end font-normal text-base lggg:text-lg">
              Total Pending Leaves
            </p>
            <div className="font-bold font-sans text-end text-xl lgg:text-2xl">
              <span>{dashboard?.totalPendingLeaves || 0}</span>
            </div>
          </div>
        </div>
        <div className="border text-white bg-[#1d7ca5] w-full p-4 shadow rounded-xl flex justify-between items-center h-28">
          <p className="border-2 border-white rounded-md p-1">
            {/* <UserIcon className="h-7 w-7" /> */}
          </p>
          <div className="space-y-2">
            <p className="text-end font-normal text-base lggg:text-lg">
              Total Approved Leaves
            </p>
            <div className="font-bold font-sans text-end text-xl lgg:text-2xl">
              <span>{dashboard?.totalApprovedLeaves || 0}</span>
            </div>
          </div>
        </div>
        <div className="border text-white bg-[#245469] w-full p-4 shadow rounded-xl flex justify-between items-center h-28">
          <p className="border-2 border-white rounded-md p-1">
            {/* <UserIcon className="h-7 w-7" /> */}
          </p>
          <div className="space-y-2">
            <p className="text-end font-normal text-base lggg:text-lg">
              Total Tasks
            </p>
            <div className="font-bold font-sans text-end text-xl lgg:text-2xl">
              <span>{dashboard?.totalTasks || 0}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
