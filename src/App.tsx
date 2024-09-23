import { Layout } from "antd";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import {
  logout,
  selectCurrentUser,
  useCurrentToken,
} from "./redux/features/auth/authSlice";
import Sidebar from "./components/layout/Sidebar";
import { Link, Navigate } from "react-router-dom";
import UserAvatarUI from "./components/ui/NavUI/UserAvatarUI";

const App = () => {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();

  const token = useAppSelector(useCurrentToken);
  // console.log("🚀 ~ ProtectedRoute ~ token:", token);
  if (!token) {
    return <Navigate to="/login" replace={true} />;
  }

  if (!user?.role) {
    dispatch(logout());
    return <Navigate to="/login" replace={true} />;
  } else {
    return <Navigate to={`/${user.role}/dashboard`} replace={true} />;
  }
};

export default App;
