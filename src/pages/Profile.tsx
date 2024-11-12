import { useLocation } from 'react-router-dom';
import LoadingSkeleton from '../components/ui/Loading/LoadingSkeleton';
import { useGetSingleEmployeeQuery } from '../redux/features/admin/employeeApi';
import { useGetProfileQuery } from '../redux/features/auth/authApi';

const Profile = () => {
  //
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const id = query.get('id');
  //
  const { data, isLoading } = useGetProfileQuery({}, { skip: Boolean(id) });
  console.log('🚀 ~ Profile ~ data:', data);
  const { data: employee, isLoading: emLoading } = useGetSingleEmployeeQuery(
    id as string,
    { skip: !id }
  );
  console.log('🚀 ~ Profile ~ employee:', employee);
  const formatDate = (date: string | number | Date) =>
    new Date(date).toLocaleDateString();
  if (isLoading || emLoading) {
    return <LoadingSkeleton />;
  }
  const user = employee?.data || data?.roleInfo || {};
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-green-500">
      <div className="min-w-[750px] overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Profile Image Section */}
        <div className="relative h-40 bg-gray-100">
          <img
            src={user.profileImage?.url || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="absolute inset-x-0 bottom-0 mx-auto -mb-16 h-32 w-32 rounded-full border-4 border-white"
          />
        </div>

        {/* Profile Details Section */}
        <div className="mt-16 p-6 text-center">
          {/* Name */}
          <h2 className="text-2xl font-semibold text-gray-800">
            {user?.name?.firstName} {user?.name?.lastName}
          </h2>
          {/* Employee ID */}
          <p className="mt-1 text-gray-600">
            Employee ID: {user?.userUniqueId}
          </p>
          {/* Date of Birth */}
          <p className="mt-1 text-gray-600">
            Date of Birth: {formatDate(user?.dateOfBirth)}
          </p>

          {/* Contact Info */}
          <div className="mt-4">
            <p className="font-medium text-gray-800">Contact Information</p>
            <p className="text-gray-600">Email: {user.email || 'N/A'}</p>
            <p className="text-gray-600">
              Phone: {user?.contactNumber || 'N/A'}
            </p>
          </div>

          {/* National ID */}
          <div className="mt-4">
            <p className="font-medium text-gray-800">National ID</p>
            <p className="text-gray-600">{user?.nid || 'N/A'}</p>
          </div>

          {/* Passport */}
          <div className="mt-4">
            <p className="font-medium text-gray-800">Passport</p>
            <p className="text-gray-600">{user?.passport || 'N/A'}</p>
          </div>

          {/* Biography */}
          <div className="mt-4">
            <p className="font-medium text-gray-800">Biography</p>
            <p className="text-sm leading-relaxed text-gray-600">
              {user?.biography || 'N/A'}
            </p>
          </div>

          {/* Verification Status */}
          <div className="mt-6">
            <p className="font-medium text-gray-800">Verification Status</p>
            <p className="font-semibold text-green-600">Verified (Accepted)</p>
          </div>

          {/* Account Status */}
          <div className="mt-4">
            <p className="font-medium text-gray-800">Account Status</p>
            <p className="font-semibold text-green-600">Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
