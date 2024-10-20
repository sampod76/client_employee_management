import { ArrowLeftOutlined, LockOutlined } from '@ant-design/icons';
import { useChangePasswordMutation } from '@redux/features/auth/authApi';
import { ErrorModal, SuccessModal } from '@utils/modalHook';
import { Button, Form, Input, Typography } from 'antd';

const ChangePassword = () => {
  const [form] = Form.useForm();
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const handleFinish = async (values: any) => {
    try {
      const res = await changePassword(values).unwrap();
      console.log('🚀 ~ constonSubmit:SubmitHandler<FieldValues>= ~ res:', res);
      SuccessModal('Successfully changed password');
      // dispatch(logout());
      // navigate('/login');
    } catch (error) {
      console.log(
        '🚀 ~ constonSubmit:SubmitHandler<FieldValues>= ~ error:',
        error
      );
      ErrorModal(error);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-md">
      {/* Header Section */}
      <div className="mb-6 flex items-center">
        <ArrowLeftOutlined className="mr-2" />
        <h2 className="text-xl font-semibold">Change Password</h2>
      </div>

      <p className="mb-4 text-gray-500">
        Your password must be 8-10 characters long.
      </p>

      {/* Form Section */}
      <Form
        name="change_password_form"
        className="change-password-form"
        initialValues={{ remember: true }}
        onFinish={handleFinish}
      >
        {/* Old Password Title */}
        <Typography.Title level={5} className="font-sans">
          Old Password
        </Typography.Title>

        {/* Old Password Field */}
        <Form.Item
          name="oldPassword"
          rules={[
            { required: true, message: 'Please input your old password!' },
          ]}
          hasFeedback={true}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Enter your old password"
          />
        </Form.Item>

        {/* New Password Title */}
        <Typography.Title level={5} className="font-sans">
          New Password
        </Typography.Title>

        {/* New Password Field */}
        <Form.Item
          name="newPassword"
          rules={[
            { required: true, message: 'Please input your new password!' },
          ]}
          hasFeedback={true}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Enter your new password"
          />
        </Form.Item>

        {/* Confirm New Password Title */}
        <Typography.Title level={5}>Confirm New Password</Typography.Title>

        {/* Confirm New Password Field */}
        <Form.Item
          name="confirmNewPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Please confirm your new password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('New password and confirm password do not match!')
                );
              },
            }),
          ]}
          hasFeedback={true}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Re-enter your new password"
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            loading={isLoading}
            type="primary"
            htmlType="submit"
            className="w-full !bg-red-800 bg-gradient-to-r from-red-500 to-red-700 !text-white hover:from-red-600 hover:!to-red-800"
          >
            Update password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;
