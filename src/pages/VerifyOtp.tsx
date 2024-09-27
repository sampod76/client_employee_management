import { Button, Flex, Form, InputNumber } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useForgetPasswordMutation,
  useSetOtpMutation,
} from "../redux/features/auth/authApi";
import { ErrorModal, SuccessModal } from "../utils/modalHook";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const email = query.get("email");
  const [forgetPassword, { isLoading: forgetLoading }] =
    useForgetPasswordMutation();
  const [sendOtp, { isLoading }] = useSetOtpMutation();

  const onFinish = async (values: any) => {
    if (!values.otp) {
      ErrorModal("Otp must have at least 6 values");
      return;
    }
    try {
      const res = await sendOtp({
        email,
        otp: String(values.otp),
      }).unwrap();

      if (res?.token) {
        localStorage.setItem("resetToken", res?.token);
        SuccessModal("Successful");
        navigate(`/reset-password?token=${res?.token}`);
      }
      SuccessModal("Successful match otp");
      console.log("🚀 ~ onFinish ~ res:", res);
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
