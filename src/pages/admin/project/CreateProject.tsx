/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  FileOutlined,
  MailOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, Row } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import LoadingSkeleton from "../../../components/ui/Loading/LoadingSkeleton";
import UploadImage from "../../../components/ui/UploadImage";
import {
  useAddProjectsMutation,
  useGetSingleProjectsQuery,
  useUpdateProjectsMutation,
} from "../../../redux/features/admin/projectApi";
import { ErrorModal, SuccessModal } from "../../../utils/modalHook";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const CreateProject = () => {
  //
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const id = query.get("id");
  //
  const { data: getDate, isLoading: getLoading } = useGetSingleProjectsQuery(
    id as string,
    {
      skip: !id,
    }
  );
  console.log(getDate);
  const [addProject, { isLoading }] = useAddProjectsMutation();
  const [updateProject, { isLoading: updateLoading }] =
    useUpdateProjectsMutation();
  const [image, setImageState] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);

  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
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
      if (id) {
        const res = await updateProject({ id, data: values }).unwrap();
        SuccessModal("Project Update Successfully");
      } else {
        const res = await addProject(values).unwrap();
        SuccessModal("Project Created Successfully");
      }
    } catch (error) {
      ErrorModal(error);
    }
  };
  if (getLoading) {
    return <LoadingSkeleton />;
  }
  const initial = getDate?.data
    ? {
        ...getDate?.data,

        dateRange: [
          dayjs(getDate?.data?.startDate, "YYYY-MM-DD"),
          dayjs(getDate?.data?.endDate, "YYYY-MM-DD"),
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
              label="Project Title"
              name="title"
              rules={[
                { required: true, message: "Please enter the project title!" },
              ]}
            >
              <Input
                prefix={<FileOutlined />}
                placeholder="Enter project title"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12} lg={6}>
            <div className="flex justify-center  my-1">
              <UploadImage
                setImageState={setImageState}
                setImageLoading={setImageLoading}
                name="image"
              />
            </div>
          </Col>

          <Col xs={24} sm={24} md={12} lg={6}>
            <Form.Item
              name="dateRange"
              label="Date Range"
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
            <Form.Item label="Client name" name="clientName">
              <Input
                // prefix={<MailOutlined />}
                placeholder="Enter client name"
                type="text"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6}>
            <Form.Item label="Client Email" name="clientEmail">
              <Input
                prefix={<MailOutlined />}
                placeholder="Enter client email"
                type="email"
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item label="Feature List" name="featureList">
              <Form.List name="featureList">
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
                                message: "Please enter a feature",
                              },
                            ]}
                          >
                            <Input placeholder="Enter feature" />
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
                        Add Feature
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
              <Button
                loading={isLoading || imageLoading || updateLoading}
                type="primary"
                htmlType="submit"
              >
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CreateProject;
