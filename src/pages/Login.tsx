import { Button, Checkbox, Flex, Form, Input, Row, Typography } from 'antd';
import { FieldValues } from 'react-hook-form';

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../redux/features/auth/authApi';
import { TUser, setUser } from '../redux/features/auth/authSlice';
import { useAppDispatch } from '../redux/hooks';
import { setToLocalStorage } from '../utils/local-storage';
import { ErrorModal } from '../utils/modalHook';
import { verifyToken } from '../utils/verifyToken';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [error, setError] = useState('');
  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (data: FieldValues) => {
    console.log(data);

    try {
      const res = await login({ ...data }).unwrap();
      console.log('🚀 ~ onSubmit ~ res:', res);

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
      console.log('🚀 ~ onSubmit ~ err:', err);
      setError(err?.message);
      ErrorModal(err);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center container mx-auto">
      <Row
        style={{
          borderRadius: '30px',
          background: '#e0e0e0',
          boxShadow: '20px 20px 60px #bebebe, -20px -20px 60px #ffffff',
        }}
        justify="center"
        align="middle"
        // style={{ height: "100vh" }}
        className="w-fit h-fit p-16"
      >
        <div className="py-5 px-8  ">
          <div className="mb-6">
            <h1 className="font-sans">{'Welcome'}</h1>
            <p className="font-sans">
              {'Please sign in for better experience'}
            </p>
          </div>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onSubmit}
          >
            <Typography.Title level={5}>
              <span className="font-sans">{'Email'}</span>{' '}
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
            <Typography.Title level={5}>{'Password'}</Typography.Title>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your Password!' },
              ]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder={'Enter your password'}
              />
            </Form.Item>
            <Form.Item>
              <Flex justify="space-between">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>
                    <span className="font-sans">{'Remember me'}</span>
                  </Checkbox>
                </Form.Item>

                <Link className="login-form-forgot" to={`/forgot-password`}>
                  <span className="font-sans">{'Forgot password'}</span>
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
                {'Login'}
              </Button>
              <div className="flex justify-end mt-2 text-lg">
                <Link className="login-form-forgot" to={`/register`}>
                  <span className="font-sans text-end">
                    {'New Account Register'}
                  </span>
                </Link>
              </div>
              <p className="text-red-500 text-center">{error}</p>
            </Form.Item>
          </Form>
          <div className="border-2 p-2 border-blue-200 rounded-lg ">
            <h1>
              {' '}
              Admin email : <span>admin@gmail.com</span> <br />
              Password: 112233
            </h1>
            <br />
            <h1>
              {' '}
              Employee email : <span>lenis95247@exweme.com</span> <br />
              Password: 112233
            </h1>
          </div>
        </div>
      </Row>
    </div>
  );
};

export default Login;
