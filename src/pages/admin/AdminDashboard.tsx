import ModalComponent from '@components/Modal/ModalComponents';
import CustomImageTag from '@components/ui/CustomTag/CustomImage';
import LoadingSkeleton from '@components/ui/Loading/LoadingSkeleton';
import UMTable from '@components/ui/UMTable';
import { useGetDashboardQuery } from '@redux/features/admin/adminApi';
import { useGetAllCheckInOutQuery } from '@redux/features/employee/checkInOutApi';
import { Dropdown, Menu, Space } from 'antd';
import dayjs from 'dayjs';
const AdminDashboard = () => {
  const { data, isLoading } = useGetDashboardQuery({});
  // const [page, setPage] = useState<number>(1);
  // const [size, setSize] = useState<number>(10);
  // const [sortBy, setSortBy] = useState<string>("createdAt");
  // const [sortOrder, setSortOrder] = useState<string>("decs");
  // const [searchTerm, setSearchTerm] = useState<string>("");
  const query: Record<string, any> = {};
  query['limit'] = 10;
  query['page'] = 1;
  query['sortBy'] = 'createdAt';
  query['sortOrder'] = 'decs';

  const { data: checkInOutData, isLoading: cl } =
    useGetAllCheckInOutQuery(query);
  console.log('🚀 ~ AdminDashboard ~ data:', data);
  if (isLoading || cl) {
    return <LoadingSkeleton />;
  }
  const checkInOut = checkInOutData?.data;
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
  const LateStatus = (date: string) => {
    // Ensure getData and getData[0] exist to prevent errors

    const checkInTime = new Date(date).getTime();

    const today = new Date(date);
    const today9AM = new Date(today.setHours(9, 0, 0, 0)).getTime();
    const isOnTime = checkInTime <= today9AM;

    return (
      <p className="text-white">
        {isOnTime ? (
          <span className="rounded-xl bg-green-500 px-5 py-1">On time</span>
        ) : (
          <span className="rounded-xl bg-red-500 px-5 py-1">Late</span>
        )}
      </p>
    );
  };
  const columns = [
    {
      title: 'Date',
      // dataIndex: "createdAt",
      ellipsis: true,
      render: (record: any) => {
        return (
          <div className="flex items-start justify-between gap-2">
            <p>{new Date(record.createdAt).toDateString()}</p>
            {LateStatus(record?.checkInTime)}
          </div>
        );
      },
      width: 250,
    },
    // {
    //   title: "",
    //   dataIndex: ["employee", "details", "profileImage"],
    //   ellipsis: true,
    //   render: (record: any) => (
    //     <CustomImageTag
    //       src={record}
    //       width={550}
    //       height={550}
    //       preview={true}
    //       className="w-8 h-8 md:h-12 md:w-12  rounded-full"
    //       alt=""
    //     />
    //   ),
    //   width: 100,
    // },
    {
      title: 'Employee',
      dataIndex: ['employee', 'details'],
      ellipsis: true,
      render: (record: any) => (
        <div className="flex items-center justify-start gap-1">
          <CustomImageTag
            src={record.profileImage}
            width={550}
            height={550}
            preview={true}
            className="h-8 w-8 rounded-full md:h-12 md:w-12"
            alt=""
          />
          <p className="truncate">
            {record.name.firstName + ' ' + record.name.lastName}
          </p>
        </div>
      ),
      width: 250,
    },
    {
      title: 'Email',
      dataIndex: ['employee', 'details', 'email'],
      width: 250,
    },
    {
      title: 'Check in',
      dataIndex: 'checkInTime',
      render: function (data: any) {
        return data && dayjs(data).format('MMM D, YYYY hh:mm A');
      },
      sorter: true,
      width: 220,
    },
    {
      title: 'Check out',
      dataIndex: 'checkOutTime',
      render: function (data: any) {
        return data && dayjs(data).format('MMM D, YYYY hh:mm A');
      },
      sorter: true,
      width: 220,
    },
    {
      title: 'Provide',
      dataIndex: 'provide',
      render: function (data: any) {
        return (
          <div className="flex justify-center">
            <ModalComponent buttonText="View">
              <div>
                {data.map((image: any, i: number) => (
                  <div key={i} className="text-lg">
                    <CustomImageTag
                      src={image}
                      width={550}
                      height={550}
                      preview={true}
                      className="my-2 w-full rounded-md border"
                      alt=""
                    />
                  </div>
                ))}
              </div>
            </ModalComponent>
          </div>
        );
      },
      sorter: true,
      width: 220,
    },

    {
      title: 'Action',
      // fixed: "right",
      width: 120,
      render: (record: any) => (
        <>
          <Space size="middle">
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="view">
                    {/* <Link to={`/${user?.role}/category/details/${record._id}`}>
                      View
                    </Link> */}
                    View
                  </Menu.Item>
                </Menu>
              }
            >
              <button className="text-blue-700">Action</button>
            </Dropdown>
          </Space>
        </>
      ),
    },
  ];

  return (
    <div>
      {/* <h1 className="text-center"> Admin Dashboard </h1> */}
      <section className="grid grid-cols-1 gap-4 text-[30px] sm:grid-cols-2 md:grid-cols-4 xl:gap-6">
        <div className="flex h-28 w-full items-center justify-between rounded-xl border bg-[#4e36e2] p-4 text-white shadow">
          <p className="rounded-md border-2 border-white p-1">
            {/* <UserGroupIcon className="h-7 w-7" /> */}
          </p>
          <div className="space-y-2">
            <p className="lggg:text-lg text-end text-base font-normal">
              Employees
            </p>

            <div className="text-end font-sans text-2xl font-bold">
              <span>{dashboard?.totalAcceptedEmployees || 0}</span>
            </div>
          </div>
        </div>
        <div className="flex h-28 w-full items-center justify-between rounded-xl border bg-[#1ad588] p-4 text-white shadow">
          <p className="rounded-md border-2 border-white p-1">
            {/* <BeakerIcon className="h-7 w-7" /> */}
          </p>
          <div className="space-y-2">
            <p className="lggg:text-lg text-end text-base font-normal">
              Pending Employees
            </p>
            <div className="text-end font-sans text-2xl font-bold">
              <span>{dashboard?.totalPendingEmployees || 0}</span>
            </div>
          </div>
        </div>
        <div className="flex h-28 w-full items-center justify-between rounded-xl border bg-[#60803b] p-4 text-white shadow">
          <p className="rounded-md border-2 border-white p-1">
            {/* <CreditCardIcon className="h-7 w-7" /> */}
          </p>
          <div className="space-y-2">
            <p className="lggg:text-lg text-end text-base font-normal">
              To day CheckIn
            </p>
            <div className="lgg:text-2xl text-end font-sans text-xl font-bold">
              <span>{dashboard?.totalCheckInOffice || 0}</span>
            </div>
          </div>
        </div>
        <div className="flex h-28 w-full items-center justify-between rounded-xl border bg-[#107e59] p-4 text-white shadow">
          <p className="rounded-md border-2 border-white p-1">
            {/* <BriefcaseIcon className="h-7 w-7" /> */}
          </p>
          <div className="space-y-2">
            <p className="lggg:text-lg text-end text-base font-normal">
              To day CheckOut
            </p>
            <div className="lgg:text-2xl text-end font-sans text-xl font-bold">
              <span>{dashboard?.totalCheckOutOffice || 0}</span>
            </div>
          </div>
        </div>
        <div className="flex h-28 w-full items-center justify-between rounded-xl border bg-[#1d7ca5] p-4 text-white shadow">
          <p className="rounded-md border-2 border-white">
            {/* <UserPlusIcon className="h-7 w-7" /> */}
          </p>
          <div className="space-y-2">
            <p className="lggg:text-lg text-end text-base font-normal">
              Total Projects
            </p>
            <div className="lgg:text-2xl text-end font-sans text-xl font-bold">
              <span>{dashboard?.totalProjects || 0}</span>
            </div>
          </div>
        </div>
        <div className="flex h-28 w-full items-center justify-between rounded-xl border bg-[#083346] p-4 text-white shadow">
          <p className="rounded-md border-2 border-white p-1">
            {/* <UserIcon className="h-7 w-7" /> */}
          </p>
          <div className="space-y-2">
            <p className="lggg:text-lg text-end text-base font-normal">
              Total Pending Leaves
            </p>
            <div className="lgg:text-2xl text-end font-sans text-xl font-bold">
              <span>{dashboard?.totalPendingLeaves || 0}</span>
            </div>
          </div>
        </div>
        <div className="flex h-28 w-full items-center justify-between rounded-xl border bg-[#1d7ca5] p-4 text-white shadow">
          <p className="rounded-md border-2 border-white p-1">
            {/* <UserIcon className="h-7 w-7" /> */}
          </p>
          <div className="space-y-2">
            <p className="lggg:text-lg text-end text-base font-normal">
              Total Approved Leaves
            </p>
            <div className="lgg:text-2xl text-end font-sans text-xl font-bold">
              <span>{dashboard?.totalApprovedLeaves || 0}</span>
            </div>
          </div>
        </div>
        <div className="flex h-28 w-full items-center justify-between rounded-xl border bg-[#245469] p-4 text-white shadow">
          <p className="rounded-md border-2 border-white p-1">
            {/* <UserIcon className="h-7 w-7" /> */}
          </p>
          <div className="space-y-2">
            <p className="lggg:text-lg text-end text-base font-normal">
              Total Tasks
            </p>
            <div className="lgg:text-2xl text-end font-sans text-xl font-bold">
              <span>{dashboard?.totalTasks || 0}</span>
            </div>
          </div>
        </div>
      </section>
      <br />
      <br />
      <h1 className="my-2 rounded-2xl border text-center text-lg font-bold">
        Recent attendance list
      </h1>
      <UMTable
        loading={isLoading}
        columns={columns}
        dataSource={checkInOut}
        showSizeChanger={false}
        showPagination={false}
      />
    </div>
  );
};

export default AdminDashboard;
