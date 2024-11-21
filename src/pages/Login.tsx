import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Flex,
  Form,
  Input,
  Row,
  Tooltip,
  Typography,
} from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../redux/features/auth/authApi';
import { TUser, setUser } from '../redux/features/auth/authSlice';
import { useAppDispatch } from '../redux/hooks';
import { setToLocalStorage } from '../utils/local-storage';
import { ErrorModal } from '../utils/modalHook';
import { verifyToken } from '../utils/verifyToken';

const Login = () => {
  const [loginDetails, setLoginDetails] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [error, setError] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const [form] = Form.useForm(); // Create a form instance

  const onSubmit = async (data: any) => {
    try {
      const res = await login({ ...data }).unwrap();
      const user = verifyToken(res.accessToken) as TUser;
      dispatch(
        setUser({
          user: user,
          userData: res.userData,
          token: res.accessToken,
        })
      );
      setToLocalStorage('token', res.accessToken);
      navigate(`/${user.role}/dashboard`);
      setError('');
    } catch (err: any) {
      setError(err?.message);
      ErrorModal(err);
    }
  };

  const handleQuickLogin = (email: string, password: string) => {
    setLoginDetails({ email, password }); // Update state
    form.setFieldsValue({ email, password }); // Update form fields
  };

  return (
    <div className="container mx-auto flex h-screen items-center justify-center">
      <Row
        style={{
          borderRadius: '30px',
          background: '#e0e0e0',
          boxShadow: '20px 20px 60px #bebebe, -20px -20px 60px #ffffff',
        }}
        justify="center"
        align="middle"
        className="h-fit w-fit p-16"
      >
        <div className="px-8 py-5">
          <div className="mb-6">
            <h1 className="font-sans">Welcome</h1>
            <p className="font-sans">Please sign in for better experience</p>
          </div>
          <Form
            form={form} // Bind the form instance
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true, ...loginDetails }}
            onFinish={onSubmit}
          >
            <Typography.Title level={5}>
              <span className="font-sans">Email</span>{' '}
            </Typography.Title>
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your Email!' }]}
            >
              <Input
                size="large"
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Enter your email"
              />
            </Form.Item>
            <Typography.Title level={5}>Password</Typography.Title>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your Password!' },
              ]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Enter your password"
              />
            </Form.Item>
            <Form.Item>
              <Flex justify="space-between">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>
                    <span className="font-sans">Remember me</span>
                  </Checkbox>
                </Form.Item>

                <Link className="login-form-forgot" to={`/forgot-password`}>
                  <span className="font-sans">Forgot password</span>
                </Link>
              </Flex>
            </Form.Item>

            <Form.Item>
              <Button
                loading={isLoading}
                type="default"
                htmlType="submit"
                className="login-form-button w-full"
              >
                Login
              </Button>
              <div className="mt-2 flex justify-end text-lg">
                <Link className="login-form-forgot" to={`/register`}>
                  <span className="text-end font-sans">
                    New Account Register
                  </span>
                </Link>
              </div>
              <p className="text-center text-red-500">{error}</p>
            </Form.Item>
          </Form>
          <div className="2 flex items-center justify-center gap-2 rounded-lg p-2">
            <button
              onClick={() => handleQuickLogin('admin@gmail.com', '112233')}
              className="rounded-2xl border bg-white px-3 py-2"
            >
              <Tooltip title="Click then automatically login admin">
                <span>Admin login</span>
              </Tooltip>
            </button>
            <button
              onClick={() =>
                handleQuickLogin('lenis95247@exweme.com', '112233')
              }
              className="rounded-2xl border bg-white px-3 py-2"
            >
              <Tooltip title="Click then automatically login employee">
                <span>Employee login</span>
              </Tooltip>
            </button>
          </div>
        </div>
      </Row>
    </div>
  );
};

export default Login;
