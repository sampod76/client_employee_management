import {
  FileOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, Row, Select } from "antd";
import moment from "moment";
import { useState } from "react";

import { useLocation } from "react-router-dom";

import dayjs from "dayjs";

import SelectDynamicItem from "@components/form/SelectDynamicItem";
import SelectEmployee from "@components/form/SelectEmployee";
import LoadingSkeleton from "@components/ui/Loading/LoadingSkeleton";
import { useGetAllProjectsQuery } from "@redux/features/admin/projectApi";
import {
  useAddTaskManagementMutation,
  useGetSingleTaskManagementQuery,
  useUpdateTaskManagementMutation,
} from "@redux/features/admin/taskManagementApi";
import { selectCurrentUser } from "@redux/features/auth/authSlice";
import { useAppSelector } from "@redux/hooks";
import { ErrorModal, SuccessModal } from "@utils/modalHook";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const CreateTask = () => {
  const user = useAppSelector(selectCurrentUser);
  //
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const id = query.get("id");
  //
  const { data: allProject, isLoading: projectLoading } =
    useGetAllProjectsQuery({});
  //
  //
  // const { data: allEmployee, isLoading: employeeLoading } =
  //   useGetAllEmployeeQuery({ limit: 900 });
  // //
  const { data: getTaskDate, isLoading: getTaskLoading } =
    useGetSingleTaskManagementQuery(id as string, {
      skip: !Boolean(id),
    });
  console.log(getTaskDate);
  const [addTask, { isLoading }] = useAddTaskManagementMutation();
  const [updateProject, { isLoading: TaskupdateLoading }] =
    useUpdateTaskManagementMutation();
  const [image, setImageState] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [project, setProject] = useState("");

  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    console.log("🚀 ~ onFinish ~ values:", values);
    try {
      if (image) {
        values.logo = {
          url: image,
          mimetype: "image/jpg",
          filename: "logo.jpg",
          path: "upload/images/logo.jpg",
          platform: "imgbb",
        };
      }
      values.startDate = values.dateRange[0];
      values.endDate = values.dateRange[1];
      if (project) {
        values["projectId"] = project;
      }

      if (id) {
        const res = await updateProject({ id, data: values }).unwrap();
        SuccessModal("Project Update Successfully");
      } else {
        const res = await addTask(values).unwrap();
        form.resetFields();
        SuccessModal("Project Created Successfully");
      }
    } catch (error) {
      ErrorModal(error);
    }
  };

  if (getTaskLoading) {
    return <LoadingSkeleton />;
  }
  const initial = getTaskDate?.data
    ? {
        ...getTaskDate?.data,
        employee: getTaskDate?.data?.employee?.roleBaseUserId,
        dateRange: [
          dayjs(getTaskDate?.data?.startDate, "YYYY-MM-DD"),
          dayjs(getTaskDate?.data?.endDate, "YYYY-MM-DD"),
        ],
      }
    : {};
  return (
    <div className="shadow-2xl rounded-2xl p-5 shadow-indigo-400">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={initial}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Form.Item
              label="Task Title"
              name="title"
              rules={[
                { required: true, message: "Please enter the task title!" },
              ]}
            >
              <Input prefix={<FileOutlined />} placeholder="Enter task title" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6}>
            <Form.Item
              name="dateRange"
              label="Date line"
              //   rules={[
              //     { required: true, message: "Please select a date range!" },
              //   ]}
            >
              <RangePicker
                format="DD/MM/YYYY"
                disabledDate={(current) =>
                  current && current < moment().startOf("day")
                }
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6}>
            <SelectDynamicItem
              isLoading={projectLoading}
              dataList={allProject?.data || []}
              label="Project (optional)"
              setValue={setProject}
            />
          </Col>
          {user?.role === "admin" && (
            <Col xs={24} sm={24} md={12} lg={6}>
              <Form.Item
                name="employee" // Make sure the name matches the form field
                // label="Select Employee"
                rules={[
                  { required: true, message: "Please select an employee!" },
                ]}
              >
                <SelectEmployee
                  defaultData={getTaskDate?.data?.employee?.roleBaseUserId}
                  fieldName="employee"
                  form={form}
                />
              </Form.Item>
            </Col>
          )}

          <Col xs={24} sm={24} md={12} lg={6}>
            <Form.Item
              name="taskProgressStatus" // Make sure the name matches the form field
              label="Task Progress Status"
            >
              <Select
                style={{ width: 120 }}
                defaultValue={"toDo"}
                options={[
                  { value: "toDo", label: "To Do" },
                  { value: "inProgress", label: "In Progress" },
                  { value: "done", label: "Done" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item label="Task List" name="taskList">
              <Form.List name="taskList">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                      <Row gutter={[16, 16]} key={key} align="middle">
                        <Col xs={24} sm={12} md={18}>
                          <Form.Item
                            {...restField}
                            name={[name, "title"]}
                            //@ts-ignore
                            fieldKey={[fieldKey, "title"]}
                            rules={[
                              {
                                required: true,
                                message: "Please enter a task",
                              },
                            ]}
                          >
                            <Input placeholder="Enter task" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={2}>
                          <Button
                            type="link"
                            onClick={() => remove(name)}
                            icon={<MinusCircleOutlined />}
                            danger
                            className="!pb-8"
                          >
                            Remove
                          </Button>
                        </Col>
                      </Row>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Task
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item label="Description" name="description">
              <TextArea rows={4} placeholder="Enter project description" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item>
              <div className="flex items-center gap-3">
                <Button
                  loading={isLoading || imageLoading || TaskupdateLoading}
                  type="primary"
                  htmlType="submit"
                >
                  Submit
                </Button>
                <Button
                  type="default"
                  htmlType="reset"
                  className="!bg-red-500 !text-white"
                >
                  Reset
                </Button>
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CreateTask;
