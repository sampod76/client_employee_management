import { Button, Dropdown, Input, Menu, Space, message } from "antd";

import { ReloadOutlined } from "@ant-design/icons";
import { useState } from "react";

import dayjs from "dayjs";
import { useAppSelector, useDebounced } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";
import ActionBar from "../../components/ui/ActionBar";
import UMTable from "../../components/ui/UMTable";
import { useGetAllCheckInOutQuery } from "../../redux/features/employee/checkInOutApi";
import CustomImageTag from "../../components/ui/CustomTag/CustomImage";
import ModalComponent from "../../components/Modal/ModalComponents";

const CheckInOutList = () => {
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
    query["employeeUserId"] = user?.userId;
  }

  const debouncedSearchTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!!debouncedSearchTerm) {
    query["searchTerm"] = debouncedSearchTerm;
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
      <p className="text-white ">
        {isOnTime ? (
          <span className="bg-green-500 px-5 py-1 rounded-xl">On time</span>
        ) : (
          <span className="bg-red-500 px-5 py-1 rounded-xl">Late</span>
        )}
      </p>
    );
  };
  const columns = [
    {
      title: "Date",
      // dataIndex: "createdAt",
      ellipsis: true,
      render: (record: any) => {
        return (
          <div className="flex justify-between gap-2 items-start">
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
          <p className="truncate">
            {record.name.firstName + " " + record.name.lastName}
          </p>
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
      title: "Check in",
      dataIndex: "checkInTime",
      render: function (data: any) {
        return data && dayjs(data).format("MMM D, YYYY hh:mm A");
      },
      sorter: true,
      width: 220,
    },
    {
      title: "Check out",
      dataIndex: "checkOutTime",
      render: function (data: any) {
        return data && dayjs(data).format("MMM D, YYYY hh:mm A");
      },
      sorter: true,
      width: 220,
    },
    {
      title: "Provide",
      dataIndex: "provide",
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
                      className="w-full my-2 border rounded-md"
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
      title: "Action",
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
    setSortOrder(order === "ascend" ? "asc" : "desc");
  };

  const resetFilters = () => {
    setSortBy("");
    setSortOrder("");
    setSearchTerm("");
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
            width: "250px",
          }}
        />
        <div className="flex justify-center items-center gap-4">
          {user?.role !== "admin" && (
            <div className="flex justify-center items-center ">
              <div className="relative shadow-2xl rounded-3xl ring-2 ring-pink-300">
                <div className="absolute -inset-5">
                  <div className="w-full h-full max-w-sm mx-auto lg:mx-0 opacity-30 blur-lg bg-gradient-to-r from-yellow-400 via-pink-500 to-green-600"></div>
                </div>
                <Link
                  to={`/${user?.role}/check-in-out`}
                  title=""
                  className="relative  z-10 inline-flex items-center justify-center w-full px-8 py-3 text-lg font-bold text-white transition-all duration-200 bg-gray-900 border-2 border-transparent sm:w-auto rounded-3xl font-pj hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                  role="button"
                >
                  Please check in/out
                </Link>
              </div>
            </div>
          )}
          {(!!sortBy || !!sortOrder || !!searchTerm) && (
            <Button
              style={{ margin: "0px 5px" }}
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
