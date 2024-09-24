import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Radio,
  Select,
  Row,
  Col,
  message,
  Skeleton,
} from "antd";
import moment from "moment";
import DivContainer from "../../../components/ui/DivContainer";
import { ErrorModal, SuccessModal } from "../../../utils/modalHook";
import { useAddLeavesMutation } from "../../../redux/features/admin/leavesApi";
import { multipleFilesUploader } from "../../../utils/handelFileUploderS3";

const { RangePicker } = DatePicker;
const { Option } = Select;

const LeaveForm = () => {
  const [applyLeaves, { isLoading }] = useAddLeavesMutation();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<File[]>([]);
  const [imageLoading, setImageLoading] = useState(false);

  const validateMessages = {
    required: "${label} is required!",
  };

  const onFinish = async (values: any) => {
    try {
      values.from = values.dateRange[0];
      values.to = values.dateRange[1];

      const res = await applyLeaves(values).unwrap();
      console.log("🚀 ~ onFinish ~ res:", res);
      SuccessModal("Successfully applied");
      form.resetFields();
    } catch (error) {
      ErrorModal(error);
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <div>
      <DivContainer>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          validateMessages={validateMessages}
          style={{ width: "100%" }}
        >
          <Row gutter={[16, 16]} style={{ width: "100%" }}>
            <Col xs={24} sm={24} md={12} lg={6}>
              <Form.Item
                name="leaveType"
                label="Leave Type"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select Leave Type">
                  <Option value="Casual Leave">Casual Leave</Option>
                  <Option value="Sick Leave">Sick Leave</Option>
                  <Option value="Maternity Leave">Maternity Leave</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={6}>
              <Form.Item
                name="dateRange"
                label="Date Range"
                rules={[
                  { required: true, message: "Please select a date range!" },
                ]}
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
              <Form.Item
                name="dayType"
                label="Day Type"
                rules={[{ required: true, message: "Please select day type!" }]}
              >
                <Radio.Group>
                  <Radio value="full">Full Day</Radio>
                  <Radio value="half">Half Day</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={6}>
              <Form.Item name="location" label="Location">
                <Input placeholder="Enter location" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                name="reason"
                label="Reason"
                rules={[
                  { required: true, message: "Please enter the reason!" },
                ]}
              >
                <Input.TextArea rows={10} placeholder="Enter reason" />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <Form.Item>
                <Button loading={isLoading} type="primary" htmlType="submit">
                  Apply Leave
                </Button>
                <Button
                  type="dashed"
                  htmlType="reset"
                  className="mx-2 !bg-red-500 !text-white"
                >
                  Reset
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </DivContainer>
    </div>
  );
};

export default LeaveForm;
