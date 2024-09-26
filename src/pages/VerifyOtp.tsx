/* eslint-disable react/no-unescaped-entities */

import {
  LockOutlined,
  UserOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Flex,
  Form,
  Input,
  InputNumber,
  Typography,
} from "antd";
import {
  useForgetPasswordMutation,
  useSetOtpMutation,
} from "../redux/features/auth/authApi";
import { ErrorModal, SuccessModal } from "../utils/modalHook";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const email = query.get("email");
  const [forgetPassword, { isLoading: forgetLoading }] =
    useForgetPasswordMutation();
  const [sendOtp, { isLoading }] = useSetOtpMutation();

  const onFinish = async (values: any) => {
    console.log("🚀 ~ onFinish ~ values:", values);

    console.log("🚀 ~ onFinish ~ values.otp:", values.otp);
    if (!values.otp) {
      ErrorModal("Otp must have at least 6 values");
      return;
    }
    try {
      const res = await sendOtp({
        email,
        otp: String(values.otp),
      }).unwrap();

      if (res?.data?.token) {
        localStorage.setItem("resetToken", res?.data?.token);
        SuccessModal("Successful");
        navigate(`/reset-password`);
      }
    } catch (error) {
      console.log(error);
      ErrorModal(error);
    }
    console.log("Received values of form: ", values.otp);
  };

  return (
    <div className="py-5 px-8 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] max-w-md mx-auto mt-10">
      <div className="mb-6">
        <h1 className="font-sans">{"Verify OTP"}</h1>
        <p className="font-sans">
          {
            "We have sent you an OTP to your email address.Please check it and place the otp for resetting password"
          }
        </p>
      </div>
      <Form
        name="normal_login"
        layout="vertical"
        className="login-form "
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="otp"
          label="please enter you otp"
          rules={[{ required: true, message: "Enter OTP" }]}
        >
          <InputNumber
            min={0}
            size="large"
            // style={{ width: "50px", height: "50px" }}
            className="!w-96"
          />
        </Form.Item>

        <Form.Item>
          <Flex justify="space-between">
            <Button
              loading={forgetLoading}
              onClick={() => forgetPassword({ email })}
              className="login-form-forgot"
              type="text"
            >
              <span className="font-sans">{"Didn't get OTP"}</span>
            </Button>
            <Button
              loading={forgetLoading}
              onClick={() => forgetPassword({ email })}
              className="login-form-forgot"
              type="text"
              size="large"
            >
              <span className="font-sans">{"Resend"}</span>
            </Button>
          </Flex>
        </Form.Item>

        <Form.Item>
          <Button
            loading={isLoading}
            type="primary"
            htmlType="submit"
            className="login-form-button w-full"
          >
            <span className="font-sans">{"Verify"}</span>
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
