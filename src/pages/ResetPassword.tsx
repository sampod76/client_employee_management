"use client";
import { LockOutlined } from "@ant-design/icons";
import { Button, Form, Input, Typography } from "antd";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useLoginMutation,
  useTokenToSetPasswordMutation,
} from "../redux/features/auth/authApi";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
} from "../utils/local-storage";
import { ErrorModal, SuccessModal } from "../utils/modalHook";
import { verifyToken } from "../utils/verifyToken";

export default function ResetPassword() {
  const [setPassword, { isLoading }] = useTokenToSetPasswordMutation();
  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const navigate = useNavigate();

  useEffect(() => {
    const resetToken = getFromLocalStorage("resetToken");

    if (!resetToken) {
      ErrorModal("Unable to reset password");
      navigate(`/login`);
      return;
    }
  }, []);

  const onFinish = async (values: any) => {
    // console.log("Received values of form: ", values);
    const resetToken = getFromLocalStorage("resetToken");
    const value = verifyToken(resetToken as string) as any;
    console.log("🚀 ~ onFinish ~ value:", value);
    try {
      const res = await setPassword({
        resetPasswordToken: resetToken,
        newPassword: values?.password,
      }).unwrap();

      SuccessModal("Successfully change your password");
      removeFromLocalStorage("resetToken");
      // navigate(`/login`);
      await login({ email: value?.email, password: values?.password });
      navigate(`/`);
    } catch (error) {
      console.log(error);
      ErrorModal(error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 py-5 px-8 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] ">
      <div className="mb-6">
        {/* <Link href={`/${lang}/verify-otp`}>
          <ArrowLeftOutlined />
        </Link> */}
        <h1 className="font-sans">{"Set New Password"}</h1>
        <p className="font-sans">
          {
            "A password should be more than 8 characters,including digits,letters,and symbols"
          }
        </p>
      </div>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Typography.Title level={5} className="font-sans">
          Password
        </Typography.Title>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
          hasFeedback={true}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder={"Enter your password"}
          />
        </Form.Item>
        <Typography.Title level={5}>{"Password"}</Typography.Title>
        <Form.Item
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please input your Password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  "Password and confirm password does not match"
                );
              },
            }),
          ]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder={"Re-enter your password"}
          />
        </Form.Item>

        <Form.Item>
          <Button
            loading={isLoading || loginLoading}
            type="primary"
            htmlType="submit"
            className="login-form-button w-full"
          >
            <span className="font-sans">{"Confirm"}</span>
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
