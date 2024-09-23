import { Link } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";

export default function EmployeeDashboard() {
  const user = useAppSelector(selectCurrentUser);
  return (
    <div>
      <div className="flex justify-center items-center ">
        <div className="relative shadow-2xl rounded-3xl ring-2 ring-pink-300">
          <div className="absolute -inset-5">
            <div className="w-full h-full max-w-sm mx-auto lg:mx-0 opacity-30 blur-lg bg-gradient-to-r from-yellow-400 via-pink-500 to-green-600"></div>
          </div>
          <Link
            to={`/${user?.role}/check-in-out`}
            title=""
            className="relative  z-10 inline-flex items-center justify-center w-full px-8 py-3 text-lg font-bold text-white transition-all duration-200 bg-gray-900 border-2 border-transparent sm:w-auto rounded-3xl font-pj hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            role="button"
          >
            Please check in/out
          </Link>
        </div>
      </div>
    </div>
  );
}
