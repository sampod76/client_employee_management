import SelectEmployee from '@components/form/SelectEmployee';
import { useAddAdminCheckInOutMutation } from '@redux/features/employee/checkInOutApi';
import { ErrorModal } from '@utils/modalHook';
import { Button, DatePicker, Form, message, TimePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { RuleObject, StoreValue } from 'rc-field-form/lib/interface';
import React from 'react';

interface FormValues {
  employee: string;
  checkin: Dayjs;
  checkout: Dayjs;
}

const AdminToCheckInOut: React.FC = (d) => {
  const [addCheckInOut, { isLoading }] = useAddAdminCheckInOutMutation();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      const checkInTime = dayjs(values.date)
        .hour(values.signinTime.hour())
        .minute(values.signinTime.minute())
        .second(0)
        .toISOString();

      const checkOutTime = dayjs(values.date)
        .hour(values.signoutTime.hour())
        .minute(values.signoutTime.minute())
        .second(0)
        .toISOString();

      const submitValues = {
        employee: values.employee,
        checkInTime, // ISO format
        checkOutTime, // ISO format
      };

      console.log('Form Submitted', submitValues);
      await addCheckInOut(submitValues);
      message.success('Form Submitted Successfully!');
    } catch (error) {
      console.log('🚀 ~ onFinish ~ error:', error);
      ErrorModal(error);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    message.error('Please check the fields!');
  };

  const validateSignoutTime = (
    _: RuleObject,
    value: StoreValue
  ): Promise<void> => {
    const signinTime: Dayjs | undefined = form.getFieldValue('signinTime');
    if (signinTime && value && dayjs(value).isBefore(dayjs(signinTime))) {
      return Promise.reject(
        new Error('Sign Out Time must be after Sign In Time!')
      );
    }
    return Promise.resolve();
  };

  return (
    <div className="mx-auto max-w-96">
      <div className="rounded-2xl p-5 shadow-2xl shadow-purple-500">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="employee"
            rules={[{ required: true, message: 'Please select an employee!' }]}
          >
            <SelectEmployee fieldName="employee" form={form} />
          </Form.Item>

          <Form.Item
            label="Select Date"
            name="date"
            wrapperCol={{ span: 24 }}
            className="!w-full"
            rules={[{ required: true, message: 'Please select a date!' }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            label="Sign In Time"
            name="signinTime"
            wrapperCol={{ span: 24 }}
            rules={[{ required: true, message: 'Please select sign-in time!' }]}
          >
            <TimePicker format="h:mm A" use12Hours style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Sign Out Time"
            name="signoutTime"
            wrapperCol={{ span: 24 }}
            rules={[
              { required: true, message: 'Please select sign-out time!' },
              { validator: validateSignoutTime },
            ]}
          >
            <TimePicker format="h:mm A" use12Hours style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AdminToCheckInOut;
