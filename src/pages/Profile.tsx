import React from "react";
import { useGetProfileQuery } from "../redux/features/auth/authApi";
import LoadingSkeleton from "../components/ui/Loading/LoadingSkeleton";

const Profile = () => {
  const { data, isLoading } = useGetProfileQuery({});
  console.log("🚀 ~ Profile ~ data:", data);

  const formatDate = (date: string | number | Date) =>
    new Date(date).toLocaleDateString();
  if (isLoading) {
    return <LoadingSkeleton />;
  }
  const user = data?.roleInfo || {};
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-green-500">
      <div className="max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Profile Image Section */}
        <div className="relative bg-gray-100 h-40">
          <img
            src={user.profileImage?.url || "https://via.placeholder.com/150"}
            alt="Profile"
            className="absolute inset-x-0 bottom-0 w-32 h-32 rounded-full border-4 border-white mx-auto -mb-16"
          />
        </div>

        {/* Profile Details Section */}
        <div className="mt-16 p-6 text-center">
          {/* Name */}
          <h2 className="text-2xl font-semibold text-gray-800">
            {user?.name?.firstName} {user?.name?.lastName}
          </h2>
          {/* Employee ID */}
          <p className="text-gray-600 mt-1">
            Employee ID: {user?.userUniqueId}
          </p>
          {/* Date of Birth */}
          <p className="text-gray-600 mt-1">
            Date of Birth: {formatDate(user?.dateOfBirth)}
          </p>

          {/* Contact Info */}
          <div className="mt-4">
            <p className="text-gray-800 font-medium">Contact Information</p>
            <p className="text-gray-600">Email: {user.email || "N/A"}</p>
            <p className="text-gray-600">
              Phone: {user?.contactNumber || "N/A"}
            </p>
          </div>

          {/* National ID */}
          <div className="mt-4">
            <p className="text-gray-800 font-medium">National ID</p>
            <p className="text-gray-600">{user?.nid || "N/A"}</p>
          </div>

          {/* Passport */}
          <div className="mt-4">
            <p className="text-gray-800 font-medium">Passport</p>
            <p className="text-gray-600">{user?.passport || "N/A"}</p>
          </div>

          {/* Biography */}
          <div className="mt-4">
            <p className="text-gray-800 font-medium">Biography</p>
            <p className="text-gray-600 text-sm leading-relaxed">
              {user?.biography || "N/A"}
            </p>
          </div>

          {/* Verification Status */}
          <div className="mt-6">
            <p className="text-gray-800 font-medium">Verification Status</p>
            <p className="text-green-600 font-semibold">Verified (Accepted)</p>
          </div>

          {/* Account Status */}
          <div className="mt-4">
            <p className="text-gray-800 font-medium">Account Status</p>
            <p className="text-green-600 font-semibold">Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
