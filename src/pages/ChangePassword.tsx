import { Button, Row } from "antd";
import { FieldValues, SubmitHandler } from "react-hook-form";
import PHForm from "../components/form/PHForm";
import PHInput from "../components/form/PHInput";

import { ErrorModal, SuccessModal } from "@utils/modalHook";
import { useNavigate } from "react-router-dom";
import { useChangePasswordMutation } from "../redux/features/auth/authApi";
import { logout } from "../redux/features/auth/authSlice";
import { useAppDispatch } from "../redux/hooks";
import { TResponse } from "../types";

const ChangePassword = () => {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log(data);

    try {
      const res = (await changePassword(data)) as TResponse<any>;
      console.log("🚀 ~ constonSubmit:SubmitHandler<FieldValues>= ~ res:", res);
      SuccessModal("Successfully changed password");
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.log(
        "🚀 ~ constonSubmit:SubmitHandler<FieldValues>= ~ error:",
        error
      );
      ErrorModal(error);
    }
  };

  return (
    <Row justify="center" align="middle" style={{ height: "100vh" }}>
      <div className="shadow-2xl shadow-purple-400 p-5 rounded-2xl">
        <PHForm onSubmit={onSubmit}>
          <PHInput type="password" name="oldPassword" label="Old Password" />
          <PHInput type="password" name="newPassword" label="New Password" />
          {isLoading ? (
            <Button loading type="primary" htmlType="submit">
              Loading
            </Button>
          ) : (
            <Button htmlType="submit">Submit</Button>
          )}
        </PHForm>
      </div>
    </Row>
  );
};

export default ChangePassword;
