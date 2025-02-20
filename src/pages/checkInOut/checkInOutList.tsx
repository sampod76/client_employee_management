import { Button, Dropdown, Input, Menu, Space } from 'antd';

import { ReloadOutlined } from '@ant-design/icons';
import { useState } from 'react';

import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import ModalComponent from '../../components/Modal/ModalComponents';
import ActionBar from '../../components/ui/ActionBar';
import CustomImageTag from '../../components/ui/CustomTag/CustomImage';
import UMTable from '../../components/ui/UMTable';
import { selectCurrentUser } from '../../redux/features/auth/authSlice';
import { useGetAllCheckInOutQuery } from '../../redux/features/employee/checkInOutApi';
import { useAppSelector, useDebounced } from '../../redux/hooks';

const CheckInOutList = () => {
  const user = useAppSelector(selectCurrentUser);
  const query: Record<string, any> = {};

  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<string>('decs');
  const [searchTerm, setSearchTerm] = useState<string>('');

  query['limit'] = size;
  query['page'] = page;
  query['sortBy'] = sortBy;
  query['sortOrder'] = sortOrder;
  if (user?.role !== 'admin') {
    query['employeeUserId'] = user?.userId;
  }

  const debouncedSearchTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (debouncedSearchTerm) {
    query['searchTerm'] = debouncedSearchTerm;
  }
  const { data, isLoading, isFetching } = useGetAllCheckInOutQuery({
    ...query,
  });

  //@ts-ignore
  const checkInOutData = data?.data;
  //@ts-ignore
  const meta = data?.meta;
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
  const onPaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setSize(pageSize);
  };
  const onTableChange = (pagination: any, filter: any, sorter: any) => {
    const { order, field } = sorter;
    //
    setSortBy(field as string);
    setSortOrder(order === 'ascend' ? 'asc' : 'desc');
  };

  const resetFilters = () => {
    setSortBy('');
    setSortOrder('');
    setSearchTerm('');
  };

  return (
    <div>
      <h1>Check in/out list</h1>
      <ActionBar>
        <Input
          size="large"
          placeholder="Search"
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '250px',
          }}
        />
        <div className="flex items-center justify-center gap-4">
          {user?.role !== 'admin' && (
            <div className="flex items-center justify-center">
              <div className="relative rounded-3xl shadow-2xl ring-2 ring-pink-300">
                <div className="absolute -inset-5">
                  <div className="mx-auto h-full w-full max-w-sm bg-gradient-to-r from-yellow-400 via-pink-500 to-green-600 opacity-30 blur-lg lg:mx-0"></div>
                </div>
                <Link
                  to={`/${user?.role}/check-in-out`}
                  title=""
                  className="font-pj relative z-10 inline-flex w-full items-center justify-center rounded-3xl border-2 border-transparent bg-gray-900 px-8 py-3 text-lg font-bold text-white transition-all duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 sm:w-auto"
                  role="button"
                >
                  Please check in/out
                </Link>
              </div>
            </div>
          )}
          {(!!sortBy || !!sortOrder || !!searchTerm) && (
            <Button
              style={{ margin: '0px 5px' }}
              type="default"
              onClick={resetFilters}
            >
              <ReloadOutlined />
            </Button>
          )}
        </div>
      </ActionBar>

      <UMTable
        loading={isLoading || isFetching}
        columns={columns}
        dataSource={checkInOutData}
        pageSize={size}
        totalPages={meta?.total}
        showSizeChanger={true}
        onPaginationChange={onPaginationChange}
        onTableChange={onTableChange}
        showPagination={true}
      />
    </div>
  );
};

export default CheckInOutList;
