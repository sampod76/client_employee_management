import { Button, Dropdown, Input, Menu, Space, TableProps, Tag } from "antd";

import {
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useState } from "react";

import ActionBar from "@components/ui/ActionBar";
import CustomImageTag from "@components/ui/CustomTag/CustomImage";
import UMTable from "@components/ui/UMTable";
import {
  useDeleteTaskManagementMutation,
  useGetAllTaskManagementQuery,
} from "@redux/features/admin/taskManagementApi";
import { selectCurrentUser } from "@redux/features/auth/authSlice";
import { useAppSelector, useDebounced } from "@redux/hooks";
import { ConfirmModal, ErrorModal, SuccessModal } from "@utils/modalHook";
import { Link } from "react-router-dom";

export default function TaskList() {
  const [deleteLeaves, { isLoading: deleteLoading }] =
    useDeleteTaskManagementMutation();
  const user = useAppSelector(selectCurrentUser);
  const query: Record<string, any> = {};

  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<string>("decs");
  const [searchTerm, setSearchTerm] = useState<string>("");

  query["limit"] = size;
  query["page"] = page;
  query["sortBy"] = sortBy;
  query["sortOrder"] = sortOrder;
  if (user?.role !== "admin") {
    query["authorUserId"] = user?.userId;
  }

  const debouncedSearchTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!!debouncedSearchTerm) {
    query["searchTerm"] = debouncedSearchTerm;
  }
  const { data, isLoading, isFetching } = useGetAllTaskManagementQuery({
    ...query,
  });

  //@ts-ignore
  const checkInOutData = data?.data;
  console.log("🚀 ~ TaskList ~ checkInOutData:", checkInOutData);
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
  const columns: TableProps<any>["columns"] = [
    {
      title: "Title",
      dataIndex: ["title"],
      width: 250,
      ellipsis: true,
    },
    {
      title: "Author",
      dataIndex: ["author", "details"],
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
          <p className="truncate">
            {record.name.firstName + " " + record.name.lastName}
          </p>
        </div>
      ),
      width: 200,
    },

    {
      title: "Start Date",
      dataIndex: ["startDate"],
      render: (date: string) => new Date(date).toLocaleDateString(),
      width: 150,
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
      width: 150,
    },

    {
      title: "Task progress status",
      dataIndex: "taskProgressStatus",
      render: (status: string) => {
        let color = "";
        let text = "";

        switch (status) {
          case "toDo":
            color = "orange";
            text = "ToDo";
            break;
          case "inProgress":
            color = "blue";
            text = "In Progress";
            break;
          case "done":
            color = "green";
            text = "Done";
            break;
          default:
            color = "gray";
            text = "Unknown";
        }

        return <Tag color={color}>{text}</Tag>;
      },
      width: 120,
    },
    {
      title: "Action",
      width: 120,
      render: (record: any) => {
        let editAuthor = false;
        if (record.author.userId === user?.userId || user?.role === "admin") {
          editAuthor = true;
        }
        return (
          <>
            <Space size="middle">
              <Dropdown
                overlay={
                  <Menu>
                    {editAuthor && (
                      <Menu.Item key="edit">
                        <Button
                          type="link"
                          icon={<EditOutlined />}
                          //   onClick={() => handleEdit(record._id)}
                        >
                          <Link
                            to={`/${user?.role}/create-edit-task?id=${record._id}`}
                          >
                            Edit
                          </Link>
                        </Button>
                      </Menu.Item>
                    )}
                    {editAuthor && (
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
                    )}
                  </Menu>
                }
              >
                <Button type="link" className="text-blue-700">
                  Action
                </Button>
              </Dropdown>
            </Space>
          </>
        );
      },
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
        <h1>Task list</h1>
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
