import { Button, Row } from "antd";
import { FieldValues } from "react-hook-form";
import { useLoginMutation } from "../redux/features/auth/authApi";
import { useAppDispatch } from "../redux/hooks";
import { TUser, setUser } from "../redux/features/auth/authSlice";
import { verifyToken } from "../utils/verifyToken";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PHForm from "../components/form/PHForm";
import PHInput from "../components/form/PHInput";
import ForgetPassword from "./ForgetPassword";
import { ErrorModal } from "../utils/modalHook";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [login] = useLoginMutation();

  const onSubmit = async (data: FieldValues) => {
    console.log(data);

    try {
      const res = await login(data).unwrap();
      console.log("🚀 ~ onSubmit ~ res:", res);

      const user = verifyToken(res.data.accessToken) as TUser;
      dispatch(
        setUser({
          user: user,
          userData: res.data.userData,
          token: res.data.accessToken,
        })
      );

      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      console.log("🚀 ~ onSubmit ~ err:", err);
      ErrorModal(err);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center container mx-auto">
      <Row
        style={{
          borderRadius: "30px",
          background: "#e0e0e0",
          boxShadow: "20px 20px 60px #bebebe, -20px -20px 60px #ffffff",
        }}
        justify="center"
        align="middle"
        // style={{ height: "100vh" }}
        className="w-fit h-fit p-16"
      >
        <div>
          <PHForm onSubmit={onSubmit}>
            <h1 className="text-center text-lg font-bold py-2">Login</h1>
            <hr />
            <PHInput type="email" name="email" label="Email" />
            <PHInput type="text" name="password" label="Password" />
            <Button className="w-[50%]" htmlType="submit">
              Login
            </Button>
            <Button className="w-[50%]">
              <Link to={"/register"}>register</Link>
            </Button>
            <Link className="text-end mt-5" to={"/forget-password"}>
              Forget password
            </Link>
          </PHForm>
        </div>
      </Row>
    </div>
  );
};

export default Login;
