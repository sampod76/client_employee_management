import React from "react";
import { Form, Input, Button, DatePicker, Row, Col } from "antd";
import moment from "moment";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const ProjectForm = () => {
  const initialValues = {};
  const [form] = Form.useForm();

  const onFinish = (values) => {
    // Process form data before submitting if needed
    console.log("Form Values:", values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        ...initialValues,
        startDate: initialValues?.startDate
          ? moment(initialValues.startDate)
          : null,
        endDate: initialValues?.endDate ? moment(initialValues.endDate) : null,
      }}
    >
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Form.Item
            label="Project Title"
            name="title"
            rules={[
              { required: true, message: "Please enter the project title!" },
            ]}
          >
            <Input placeholder="Enter project title" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Form.Item label="Logo" name="logo">
            <Input type="file" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Form.Item label="Start Date" name="startDate">
            <DatePicker />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Form.Item label="End Date" name="endDate">
            <DatePicker />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Form.Item label="Extended Dates" name="extended">
            <RangePicker />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Form.Item label="Client Name" name="clientName">
            <Input placeholder="Enter client name" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Form.Item label="Client Email" name="clientEmail">
            <Input placeholder="Enter client email" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Form.Item label="Feature List" name="featureList">
            <Input placeholder="Enter features (comma separated)" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24}>
          <Form.Item label="Description" name="description">
            <TextArea rows={4} placeholder="Enter project description" />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col xs={24}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default ProjectForm;
