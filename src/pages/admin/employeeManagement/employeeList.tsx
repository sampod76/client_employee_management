/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Button, Dropdown, Input, Menu, Space, Tag } from 'antd';

import {
  CloseSquareOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useState } from 'react';

import { Link } from 'react-router-dom';
import ActionBar from '../../../components/ui/ActionBar';
import CustomImageTag from '../../../components/ui/CustomTag/CustomImage';
import UMTable from '../../../components/ui/UMTable';
import {
  useDeleteEmployeeMutation,
  useGetAllEmployeeQuery,
  useUpdateEmployeeMutation,
} from '../../../redux/features/admin/employeeApi';
import { selectCurrentUser } from '../../../redux/features/auth/authSlice';
import { useAppSelector, useDebounced } from '../../../redux/hooks';
import {
  ConfirmModal,
  ErrorModal,
  SuccessModal,
} from '../../../utils/modalHook';
export default function EmployeeList({ status }: { status?: string }) {
  const [deleteLeaves, { isLoading: deleteLoading }] =
    useDeleteEmployeeMutation();
  const [updateEmployee, { isLoading: ApprovedLoading }] =
    useUpdateEmployeeMutation();

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

  if (status) {
    query['verify'] = status;
  }

  const debouncedSearchTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (debouncedSearchTerm) {
    query['searchTerm'] = debouncedSearchTerm;
  }
  const { data, isLoading, isFetching } = useGetAllEmployeeQuery({ ...query });

  //@ts-ignore
  const checkInOutData = data?.data;
  //@ts-ignore
  const meta = data?.meta;

  const handleDelete = async (id: string) => {
    ConfirmModal({ message: `Are you sure you want to delete` }).then(
      async (res) => {
        if (res.isConfirmed) {
          try {
            const res = await deleteLeaves(id).unwrap();
            console.log('🚀 ~ res:', res);
            SuccessModal('Successfully Deleted');
          } catch (error: any) {
            console.log('🚀 ~ error:', error);
            ErrorModal(error);
          }
        }
      }
    );
  };

  const handleApproved = async (id: string) => {
    ConfirmModal({ message: `Are you sure you want to Accept` }).then(
      async (res) => {
        if (res.isConfirmed) {
          try {
            const res = await updateEmployee({
              id,
              data: { verify: 'accept' },
            }).unwrap();
            SuccessModal('Successfully Approved');
            console.log('🚀 ~ res:', res);
          } catch (error: any) {
            console.log('🚀 ~ error:', error);
            ErrorModal(error);
          }
        }
      }
    );
  };

  const handleDeclined = async (id: string) => {
    ConfirmModal({ message: `Are you sure you want to Declined` }).then(
      async (res) => {
        if (res.isConfirmed) {
          try {
            const res = await updateEmployee({
              id,
              data: { verify: 'cancel' },
            }).unwrap();
            SuccessModal('Successfully Declined');
          } catch (error: any) {
            ErrorModal(error);
          }
        }
      }
    );
  };
  const columns = [
    {
      title: '',
      //   dataIndex: ["employee", "details"],
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
      // width: 250,
    },
    {
      title: 'Email',
      dataIndex: ['email'],
      width: 300,
      ellipsis: true,
    },
    {
      title: 'ContactNumber',
      dataIndex: ['contactNumber'],
      width: 200,
      ellipsis: true,
    },
    {
      title: 'nid',
      dataIndex: 'nid',
      key: 'nid',
      ellipsis: true,
      width: 200,
    },
    {
      title: 'gender',
      dataIndex: 'gender',
      key: 'gender',
      width: 200,
    },

    {
      title: 'Status',
      dataIndex: 'verify',
      key: 'verify',
      width: 100,
      render: (status: string) => {
        let color = '';
        let text = '';

        switch (status) {
          case 'pending':
            color = 'orange';
            text = 'Pending';
            break;
          case 'accept':
            color = 'green';
            text = 'Approved';
            break;
          case 'cancel':
            color = 'red';
            text = 'Declined';
            break;
          default:
            color = 'gray';
            text = 'Unknown';
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },

    {
      title: 'Action',
      width: 120,
      render: (record: any) => (
        <>
          <Space size="middle">
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="View">
                    <Button
                      type="link"
                      style={{ color: 'red' }}
                      loading={deleteLoading}
                      //   icon={<DeleteOutlined style={{ color: "red" }} />}
                    >
                      <Link
                        to={`/${user?.role}/employee-profile-and-editor?id=${record._id}`}
                      >
                        View
                      </Link>
                    </Button>
                  </Menu.Item>
                  {user?.role === 'admin' && record.verify === 'pending' && (
                    <Menu.Item key="approved">
                      <Button
                        type="link"
                        style={{ color: 'green' }}
                        loading={ApprovedLoading}
                        // icon={<DeleteOutlined style={{ color: "green" }} />}
                        onClick={() => handleApproved(record._id)}
                      >
                        Approved
                      </Button>
                    </Menu.Item>
                  )}
                  {user?.role === 'admin' && record.verify === 'pending' && (
                    <Menu.Item key="Declined">
                      <Button
                        type="link"
                        style={{ color: 'blue' }}
                        loading={deleteLoading}
                        icon={<CloseSquareOutlined style={{ color: 'blue' }} />}
                        onClick={() => handleDeclined(record._id)}
                      >
                        Declined
                      </Button>
                    </Menu.Item>
                  )}
                  <Menu.Item key="Delete">
                    <Button
                      type="link"
                      style={{ color: 'red' }}
                      loading={deleteLoading}
                      icon={<DeleteOutlined style={{ color: 'red' }} />}
                      onClick={() => handleDelete(record._id)}
                    >
                      Delete
                    </Button>
                  </Menu.Item>
                </Menu>
              }
            >
              <Button type="link" className="text-blue-700">
                Action
              </Button>
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
      <div>
        <h1 className="text-lg font-bold capitalize">{status} Leave list</h1>
        <ActionBar>
          <Input
            size="large"
            placeholder="Search"
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '250px',
            }}
          />
          {(!!sortBy || !!sortOrder || !!searchTerm) && (
            <Button
              style={{ margin: '0px 5px' }}
              type="default"
              onClick={resetFilters}
            >
              <ReloadOutlined />
            </Button>
          )}
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
    </div>
  );
}
