/* eslint-disable @typescript-eslint/ban-ts-comment */

import { useState } from 'react';

import { Button } from 'antd';

import dayjs from 'dayjs';

import { FaWindows } from 'react-icons/fa6';
import { MdDevicesOther } from 'react-icons/md';
import { selectCurrentUser } from '../redux/features/auth/authSlice';
import { useGetAllLoginHistoryQuery } from '../redux/features/users/loginHistoryApi';
import { useAppSelector, useDebounced } from '../redux/hooks';

import UMTable from '../components/ui/UMTable';
import { ConfirmModal, ErrorModal, SuccessModal } from '../utils/modalHook';

export default function LoginHistory() {
  const userInfo = useAppSelector(selectCurrentUser);
  const query: Record<string, any> = {};
  const [refreshToken, setRefreshToken] = useState<{
    loading: boolean;
    value: string;
  }>({ loading: true, value: '' });
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  query['limit'] = size;
  query['page'] = page;
  query['sortBy'] = sortBy;
  query['sortOrder'] = sortOrder;

  query['userId'] = userInfo?.userId;

  const { data = [], isLoading } = useGetAllLoginHistoryQuery({ ...query });
  // const [logOutHistory, { isLoading: LogoutLoading }] = useUserLogOutMutation();

  //@ts-ignore
  const loginHistoryData = data?.data || [];

  //@ts-ignore
  const meta = data?.meta;

  const debouncedSearchTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (debouncedSearchTerm) {
    query['searchTerm'] = debouncedSearchTerm;
  }

  const columns = [
    {
      title: 'Device Name',
      //   dataIndex: "device_info.os.name",
      render: function (data: any) {
        return (
          <p className="flex items-center justify-start gap-2">
            {data?.device_info?.os?.name === 'Windows' ? (
              <FaWindows className="text-lg" />
            ) : (
              <MdDevicesOther className="text-lg" />
            )}
            {data?.device_info?.os?.name}
          </p>
        );
      },
    },
    {
      title: 'Engine version',
      //   dataIndex: "device_info.os.name",
      render: function (data: any) {
        return (
          <p>
            {data?.device_info?.client?.name}-(
            {data?.device_info?.client?.engine_version})
          </p>
        );
      },
    },
    {
      title: 'Device type',
      //   dataIndex: "device_info.os.name",
      render: function (data: any) {
        return <p>{data?.device_info?.device?.type}</p>;
      },
    },
    {
      title: 'Ip',
      dataIndex: 'ip',
      width: 100,
    },

    {
      title: 'Login time',
      dataIndex: 'createdAt',
      render: function (data: any) {
        return data && dayjs(data).format('MMM D, YYYY hh:mm A');
      },
      sorter: true,
    },
    {
      title: 'Action',
      // fixed: "right",
      width: 110,
      render: (record: any) => (
        // console.log(object);
        <div className={`${refreshToken.value === record?.token && 'hidden'}`}>
          <Button
            // loading={refreshToken.loading}
            // hidden={refreshToken.value === record?.token}
            onClick={() => handleLogout(record?._id)}
            style={{ marginRight: '5px', background: 'red', color: 'white' }}
          >
            Log out
          </Button>
        </div>
      ),
      // width: 100,
    },
  ];
  const onPaginationChange = (page: number, pageSize: number) => {
    //  // console.log("Page:", page, "PageSize:", pageSize);
    setPage(page);
    setSize(pageSize);
  };
  const onTableChange = (pagination: any, filter: any, sorter: any) => {
    const { order, field } = sorter;
    // console.log(order, field);
    setSortBy(field as string);
    setSortOrder(order === 'ascend' ? 'asc' : 'desc');
  };

  const resetFilters = () => {
    setSortBy('');
    setSortOrder('');
    setSearchTerm('');
  };
  const handleLogout = (id: string) => {
    ConfirmModal({ message: 'Are you sure you want to Logout' }).then(
      async (res) => {
        if (res.isConfirmed) {
          try {
            // const res = await logOutHistory({ id, data: {} });

            SuccessModal('Successfully logged out');
          } catch (error: any) {
            ErrorModal(error.message);
          }
        }
      }
    );
  };
  return (
    <div>
      {' '}
      <UMTable
        loading={isLoading}
        columns={columns}
        dataSource={loginHistoryData}
        pageSize={size}
        totalPages={meta?.total}
        showSizeChanger={true}
        onPaginationChange={onPaginationChange}
        onTableChange={onTableChange}
        showPagination={true}
      />
    </div>
  );
}
