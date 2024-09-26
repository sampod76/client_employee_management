/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { logout, useCurrentToken } from "../../redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { verifyToken } from "../../utils/verifyToken";

type TProtectedRoute = {
  children: ReactNode;
  role: string | undefined;
};

const ProtectedRoute = ({ children, role }: TProtectedRoute) => {
  const token = useAppSelector(useCurrentToken);
  // console.log("🚀 ~ ProtectedRoute ~ token:", token);

  let user: any;

  if (token) {
    user = verifyToken(token);
  }

  const dispatch = useAppDispatch();

  if (!token) {
    dispatch(logout());
    return <Navigate to="/login" replace={true} />;
  }
  if (role !== undefined && role !== user?.role) {
    return (
      <div className="text-5xl text-red-500 text-center">Forbidden access</div>
    );
  }

  return children;
};

export default ProtectedRoute;
