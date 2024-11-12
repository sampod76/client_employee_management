import { Navigate } from 'react-router-dom';
import {
  logout,
  selectCurrentUser,
  useCurrentToken,
} from './redux/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from './redux/hooks';

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
