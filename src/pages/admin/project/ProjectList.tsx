import { Button, Dropdown, Input, Menu, Space } from "antd";

import {
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useState } from "react";

import { Link } from "react-router-dom";
import ActionBar from "../../../components/ui/ActionBar";
import CustomImageTag from "../../../components/ui/CustomTag/CustomImage";
import UMTable from "../../../components/ui/UMTable";
import {
  useDeleteProjectsMutation,
  useGetAllProjectsQuery,
} from "../../../redux/features/admin/projectApi";
import { selectCurrentUser } from "../../../redux/features/auth/authSlice";
import { useAppSelector, useDebounced } from "../../../redux/hooks";
import {
  ConfirmModal,
  ErrorModal,
  SuccessModal,
} from "../../../utils/modalHook";
export default function ProjectList() {
  const [deleteLeaves, { isLoading: deleteLoading }] =
    useDeleteProjectsMutation();
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

  if (debouncedSearchTerm) {
    query["searchTerm"] = debouncedSearchTerm;
  }
  const { data, isLoading, isFetching } = useGetAllProjectsQuery({ ...query });

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
      title: "Logo",
      dataIndex: ["logo"],
      ellipsis: true,
      render: (record: any) => (
        <div className="flex justify-start items-center gap-1">
          <CustomImageTag
            src={record}
            width={550}
            height={550}
            preview={true}
            className="w-8 h-8 md:h-12 md:w-12  rounded-full"
            alt=""
          />
        </div>
      ),
      width: 100,
    },
    {
      title: "Title",
      dataIndex: ["title"],
      width: 250,
    },
    {
      title: "Title",
      dataIndex: ["title"],
      width: 250,
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
                    <Menu.Item key="viw">
                      <Button
                        type="link"
                        // icon={<EditOutlined />}
                        //   onClick={() => handleEdit(record._id)}
                      >
                        <Link to={`/${user?.role}/project-view/${record._id}`}>
                          View
                        </Link>
                      </Button>
                    </Menu.Item>
                    {editAuthor && (
                      <Menu.Item key="edit">
                        <Button
                          type="link"
                          icon={<EditOutlined />}
                          //   onClick={() => handleEdit(record._id)}
                        >
                          <Link
                            to={`/${user?.role}/create-edit-project?id=${record._id}`}
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
