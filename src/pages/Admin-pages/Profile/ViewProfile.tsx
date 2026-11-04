import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { TriangleAlert } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { profileService } from "../../../api/profileService";
import {
  getUserFullName,
  getUserInitials,
  formatUserDate,
  getUserStatusLabel,
  getUserStatusColor,
} from "../../../types/user.types";
import type { User } from "../../../types/user.types";
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Shield,
  Activity,
  Users,
} from "lucide-react";
import AdminLayout from "../../../components/admin-components/AdminLayout";

export default function ViewProfile() {
  const { user: contextUser } = useAuth();
  const [user, setUser] = useState<User | null>(contextUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const profileData = await profileService.getProfile();
      setUser(profileData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Every other admin page renders Sidebar + Topbar around its content, so
  // an admin never loses navigation chrome moving between pages - this page
  // (and ProfileSettings.tsx) used to render bare, with no Sidebar/Topbar at
  // all, dropping the admin into a floating, disconnected screen the moment
  // they opened their own profile. content is computed per state and always
  // rendered inside the same shell, so that's true for loading/error too,
  // not just the success state.
  let content: ReactNode;

  if (isLoading) {
    content = (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#002B56] mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  } else if (error) {
    content = (
      <div className="flex items-center justify-center py-24">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <TriangleAlert
            className="mx-auto mb-4 h-12 w-12 text-red-500"
            aria-hidden="true"
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchProfile}
            className="px-6 py-2 bg-[#002B56] text-white rounded-lg hover:bg-[#003366] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  } else if (!user) {
    content = null;
  } else {
    const fullName = getUserFullName(user);
    const initials = getUserInitials(user);
    const statusLabel = getUserStatusLabel(user);
    const statusColor = getUserStatusColor(user);

    content = (
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">View your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Section with Avatar */}
          <div className="bg-gradient-to-r from-[#002B56] to-[#003366] px-8 py-12 relative">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={fullName}
                    className="w-32 h-32 rounded-full object-cover ring-4 ring-white shadow-xl"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center ring-4 ring-white shadow-xl">
                    <span className="text-4xl font-bold text-[#002B56]">
                      {initials}
                    </span>
                  </div>
                )}
                <div
                  className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white ${
                    user.isActive ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
              </div>

              {/* Name and Role */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {fullName}
                </h2>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
                    <Shield size={16} />
                    {user.role}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${statusColor} text-sm font-medium`}
                  >
                    <Activity size={16} />
                    {statusLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Information Grid */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <Mail size={18} className="text-gray-400" />
                  Email Address
                </label>
                <p className="text-lg text-gray-900 font-medium">
                  {user.email}
                </p>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <Phone size={18} className="text-gray-400" />
                  Phone Number
                </label>
                <p className="text-lg text-gray-900 font-medium">
                  {user.phone || "Not provided"}
                </p>
              </div>

              {/* First Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <UserIcon size={18} className="text-gray-400" />
                  First Name
                </label>
                <p className="text-lg text-gray-900 font-medium">
                  {user.firstName}
                </p>
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <UserIcon size={18} className="text-gray-400" />
                  Last Name
                </label>
                <p className="text-lg text-gray-900 font-medium">
                  {user.lastName}
                </p>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <Users size={18} className="text-gray-400" />
                  Gender
                </label>
                <p className="text-lg text-gray-900 font-medium capitalize">
                  {user.gender}
                </p>
              </div>

              {/* Account Created */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <Calendar size={18} className="text-gray-400" />
                  Account Created
                </label>
                <p className="text-lg text-gray-900 font-medium">
                  {formatUserDate(user.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Footer. flex-col below sm - "Last updated: <date>" plus the
              button had nowhere near enough room at 320-390px, especially
              stacked under this card's own unconditional px-8. */}
          <div className="px-4 sm:px-8 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <p className="text-sm text-gray-500">
              Last updated: {formatUserDate(user.updatedAt)}
            </p>
            <Link
              to="/admin/profile/settings"
              className="px-6 py-2 bg-[#002B56] text-white rounded-lg hover:bg-[#003366] transition-colors font-medium text-center"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <AdminLayout>{content}</AdminLayout>;
}
