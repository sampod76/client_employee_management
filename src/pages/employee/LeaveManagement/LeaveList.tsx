import React from "react";
import DivContainer from "../../../components/ui/DivContainer";
import { Button, Dropdown, Input, Menu, Space, Tag, message } from "antd";

import {
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useState } from "react";

import dayjs from "dayjs";
import { useAppSelector, useDebounced } from "../../../redux/hooks";
import { selectCurrentUser } from "../../../redux/features/auth/authSlice";
import {
  useDeleteLeavesMutation,
  useGetAllLeavesQuery,
} from "../../../redux/features/admin/leavesApi";
import CustomImageTag from "../../../components/ui/CustomTag/CustomImage";
import ActionBar from "../../../components/ui/ActionBar";
import UMTable from "../../../components/ui/UMTable";
import { Link } from "react-router-dom";
import {
  ConfirmModal,
  ErrorModal,
  SuccessModal,
} from "../../../utils/modalHook";
import ModalComponent from "../../../components/Modal/ModalComponents";
export default function LeaveList() {
  const [deleteLeaves, { isLoading: deleteLoading }] =
    useDeleteLeavesMutation();
  const user = useAppSelector(selectCurrentUser);
  const query: Record<string, any> = {};

  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [searchTerm, setSearchTerm] = useState<string>("");

  query["limit"] = size;
  query["page"] = page;
  query["sortBy"] = sortBy;
  query["sortOrder"] = sortOrder;
  query["employeeUserId"] = user?.userId;

  const debouncedSearchTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!!debouncedSearchTerm) {
    query["searchTerm"] = debouncedSearchTerm;
  }
  const { data, isLoading } = useGetAllLeavesQuery({ ...query });

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
            SuccessModal("Successfully Deleted");
          } catch (error: any) {
            ErrorModal(error);
          }
        }
      }
    );
  };
  const columns = [
    {
      title: "Employee",
      dataIndex: ["employee", "details"],
      ellipsis: true,
      render: (record: any) => (
        <div className="flex justify-start items-center gap-1">
          <CustomImageTag
            src={record.profileImage}
            width={550}
            height={550}
            preview={true}
            className="w-8 h-8 md:h-12 md:w-12  rounded-full"
            alt=""
          />
          <p>{record.name.firstName + " " + record.name.lastName}</p>
        </div>
      ),
      width: 250,
    },
    {
      title: "Email",
      dataIndex: ["employee", "details", "email"],
      width: 250,
    },
    {
      title: "Leave Type",
      dataIndex: "leaveType",
      key: "leaveType",
    },
    {
      title: "From Date",
      dataIndex: "from",
      key: "from",
      width: 150,
      render: (record: string) => {
        return new Date(record).toLocaleDateString();
      },
    },
    {
      title: "To Date",
      dataIndex: "to",
      key: "to",
      width: 150,
      render: (record: string) => {
        return new Date(record).toLocaleDateString();
      },
    },

    {
      title: "Day Type",
      dataIndex: "dayType",
      key: "dayType",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      width: 150,
      render: (record: string) => {
        return (
          <ModalComponent buttonText="view reason">
            <p>{record}</p>
          </ModalComponent>
        );
      },
    },
    {
      title: "Total",
      dataIndex: "totalLeaveDays",
      key: "totalLeaveDays",
    },
    {
      title: "Status",
      dataIndex: "requestStatus",
      key: "status",
      render: (status: string) => {
        let color = "";
        let text = "";

        switch (status) {
          case "pending":
            color = "orange";
            text = "Pending";
            break;
          case "approved":
            color = "green";
            text = "Approved";
            break;
          case "declined":
            color = "red";
            text = "Declined";
            break;
          default:
            color = "gray";
            text = "Unknown";
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },

    {
      title: "Action",
      width: 120,
      render: (record: any) => (
        <>
          <Space size="middle">
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="edit">
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      //   onClick={() => handleEdit(record._id)}
                    >
                      <Link
                        to={`/${user?.role}/leave-application?id=${record._id}`}
                      >
                        Edit
                      </Link>
                    </Button>
                  </Menu.Item>
                  <Menu.Item key="delete">
                    <Button
                      type="link"
                      style={{ color: "red" }}
                      loading={deleteLoading}
                      icon={<DeleteOutlined style={{ color: "red" }} />}
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
    setSortOrder(order === "ascend" ? "asc" : "desc");
  };

  const resetFilters = () => {
    setSortBy("");
    setSortOrder("");
    setSearchTerm("");
  };

  return (
    <div>
      <div>
        <h1>Leave list</h1>
        <ActionBar>
          <Input
            size="large"
            placeholder="Search"
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "250px",
            }}
          />
          {(!!sortBy || !!sortOrder || !!searchTerm) && (
            <Button
              style={{ margin: "0px 5px" }}
              type="default"
              onClick={resetFilters}
            >
              <ReloadOutlined />
            </Button>
          )}
        </ActionBar>

        <UMTable
          loading={isLoading}
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
