import ModalComponent from '@components/Modal/ModalComponents';
import CustomImageTag from '@components/ui/CustomTag/CustomImage';
import LoadingSkeleton from '@components/ui/Loading/LoadingSkeleton';
import UMTable from '@components/ui/UMTable';
import { useGetEmployeeDashboardQuery } from '@redux/features/admin/employeeApi';
import { useGetAllCheckInOutQuery } from '@redux/features/employee/checkInOutApi';
import { Dropdown, Menu, Space } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { selectCurrentUser } from '../../redux/features/auth/authSlice';
import { useAppSelector } from '../../redux/hooks';
export default function EmployeeDashboard() {
  const { data, isLoading } = useGetEmployeeDashboardQuery({});
  console.log('🚀 ~ EmployeeDashboard ~ data:', data);
  const user = useAppSelector(selectCurrentUser);

  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<string>('decs');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const query: Record<string, any> = {};
  query['limit'] = size;
  query['page'] = page;
  query['sortBy'] = sortBy;
  query['sortOrder'] = sortOrder;
  if (user?.role !== 'admin') {
    query['employeeUserId'] = user?.userId;
  }

  const { data: checkInOutData, isLoading: cl } =
    useGetAllCheckInOutQuery(query);

  if (isLoading || cl) {
    return <LoadingSkeleton />;
  }
  //
  const dashboard = data?.data as {
    totalCheckInOffice: number;
    totalApprovedLeaves: number;
    totalPendingLeaves: number;
    totalDoneTasks: number;
    totalToDoTasks: number;
    totalInProgressTasks: number;
  };
  //
  const checkInOut = checkInOutData?.data;
  console.log(data);
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
      <div className="flex items-center justify-center">
        <div className="relative rounded-3xl shadow-2xl ring-2 ring-pink-300">
          <div className="absolute -inset-5">
            <div className="mx-auto h-full w-full max-w-sm bg-gradient-to-r from-yellow-400 via-pink-500 to-green-600 opacity-30 blur-lg lg:mx-0"></div>
          </div>
          <Link
            to={`/${user?.role}/check-in-out`}
            title=""
            className="font-pj relative z-10 inline-flex w-full animate-pulse items-center justify-center rounded-3xl border-2 border-transparent bg-gray-900 px-8 py-3 text-lg font-bold text-white transition-all duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 sm:w-auto"
            role="button"
          >
            Please check in/out
          </Link>
        </div>
      </div>
      <br />
      <br />
      <section className="grid grid-cols-1 gap-4 text-[30px] sm:grid-cols-2 md:grid-cols-4 xl:gap-6">
        <div className="flex h-28 w-full items-center justify-between rounded-xl border bg-[#4e36e2] p-4 text-white shadow">
          <p className="rounded-md border-2 border-white p-1">
            {/* <UserGroupIcon className="h-7 w-7" /> */}
          </p>
          <div className="space-y-2">
            <p className="lggg:text-lg text-end text-base font-normal">
              Pending task
            </p>

            <div className="text-end font-sans text-2xl font-bold">
              <span>{dashboard?.totalToDoTasks || 0}</span>
            </div>
          </div>
        </div>
        <div className="flex h-28 w-full items-center justify-between rounded-xl border bg-[#1ad588] p-4 text-white shadow">
          <p className="rounded-md border-2 border-white p-1">
            {/* <BeakerIcon className="h-7 w-7" /> */}
          </p>
          <div className="space-y-2">
            <p className="lggg:text-lg text-end text-base font-normal">
              Pending Leave application
            </p>
            <div className="text-end font-sans text-2xl font-bold">
              <span>{dashboard?.totalPendingLeaves || 0}</span>
            </div>
          </div>
        </div>
        <div className="flex h-28 w-full items-center justify-between rounded-xl border bg-[#1a71d5] p-4 text-white shadow">
          <p className="rounded-md border-2 border-white p-1">
            {/* <BeakerIcon className="h-7 w-7" /> */}
          </p>
          <div className="space-y-2">
            <p className="lggg:text-lg text-end text-base font-normal">
              Total Leave
            </p>
            <div className="text-end font-sans text-2xl font-bold">
              <span>{dashboard?.totalApprovedLeaves || 0}</span>
            </div>
          </div>
        </div>
        <div className="flex h-28 w-full items-center justify-between rounded-xl border bg-[#60803b] p-4 text-white shadow">
          <p className="rounded-md border-2 border-white p-1">
            {/* <CreditCardIcon className="h-7 w-7" /> */}
          </p>
          <div className="space-y-2">
            <p className="lggg:text-lg text-end text-base font-normal">
              Total Working day
            </p>
            <div className="lgg:text-2xl text-end font-sans text-xl font-bold">
              <span>{dashboard?.totalCheckInOffice || 0}</span>
            </div>
          </div>
        </div>

        <div className="flex h-28 w-full items-center justify-between rounded-xl border bg-[#1d7ca5] p-4 text-white shadow">
          <p className="rounded-md border-2 border-white">
            {/* <UserPlusIcon className="h-7 w-7" /> */}
          </p>
          <div className="space-y-2">
            <p className="lggg:text-lg text-end text-base font-normal">
              Total Completed Task
            </p>
            <div className="lgg:text-2xl text-end font-sans text-xl font-bold">
              <span>{dashboard?.totalDoneTasks || 0}</span>
            </div>
          </div>
        </div>
        <div className="flex h-28 w-full items-center justify-between rounded-xl border bg-[#083346] p-4 text-white shadow">
          <p className="rounded-md border-2 border-white p-1">
            {/* <UserIcon className="h-7 w-7" /> */}
          </p>
          <div className="space-y-2">
            <p className="lggg:text-lg text-end text-base font-normal">
              Total On going task
            </p>
            <div className="lgg:text-2xl text-end font-sans text-xl font-bold">
              <span>{dashboard?.totalInProgressTasks || 0}</span>
            </div>
          </div>
        </div>
      </section>
      <h1 className="my-2 rounded-2xl border text-center text-lg font-bold">
        Recent your attendance list
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
}
