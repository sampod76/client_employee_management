import { UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useForgetPasswordMutation } from '../redux/features/auth/authApi';
import { ErrorModal, SuccessModal } from '../utils/modalHook';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();

  const onFinish = async (values: any) => {
    // console.log("Received values of form: ", values);
    try {
      const res = await forgetPassword(values).unwrap();
      console.log('🚀 ~ onFinish ~ res:', res);
      navigate(`/verify-otp?email=${values.email}`);
      SuccessModal('Otp send successful please check your email');
    } catch (error) {
      console.log(error);
      ErrorModal(error);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-md px-8 py-5 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
      <div className="mb-6">
        {/* <Link href={`/${lang}/sign-in`}>
          <ArrowLeftOutlined />
        </Link> */}
        <h1 className="font-sans">{'Email'}</h1>
        <p className="font-sans">
          {
            'Enter your email address to ger a verification code for resetting your password'
          }
          .
        </p>
      </div>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Typography.Title level={5} className="font-sans">
          {'Email'}
        </Typography.Title>
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your Email!' }]}
        >
          <Input
            size="large"
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder={'Enter your email'}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            loading={isLoading}
            htmlType="submit"
            className="login-form-button w-full"
          >
            <span className="font-sans">{'Get OTP'}</span>
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
