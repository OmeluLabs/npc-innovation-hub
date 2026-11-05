import React from "react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { profileService } from "../../../api/profileService";
import type { UpdateProfilePayload } from "../../../api/profileService";
import ChangePasswordForm from "../../../components/admin-components/ChangePasswordForm";
import { getUserInitials } from "../../../types/user.types";
import type { Gender } from "../../../types/user.types";
import { User as UserIcon, Mail, Save, X, Camera } from "lucide-react";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/admin-components/AdminLayout";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
  gender: Gender;
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: string;
}

export default function ProfileSettings() {
  const { user: contextUser, refreshUser } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    gender: "male" as Gender,
  });
  // A real file to upload, not a URL - see profileService's own comment
  // on why the old text field never actually did anything. imagePreview
  // is what's shown: the existing avatar until a new file is picked,
  // then an object URL for the picked file itself.
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (contextUser) {
      setFormData({
        firstName: contextUser.firstName || "",
        lastName: contextUser.lastName || "",
        phone: contextUser.phone || "",
        gender: contextUser.gender || "male",
      });
      setImagePreview(contextUser.image || "");
    }
  }, [contextUser]);

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (formData.phone && !/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (e.g., +1234567890)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSaving(true);

    try {
      const payload: UpdateProfilePayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
        gender: formData.gender,
        image: imageFile,
      };

      await profileService.updateProfile(payload);

      // Refresh user data in context
      await refreshUser();

      setImageFile(null);
      toast.success("Profile updated successfully!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (contextUser) {
      setFormData({
        firstName: contextUser.firstName || "",
        lastName: contextUser.lastName || "",
        phone: contextUser.phone || "",
        gender: contextUser.gender || "male",
      });
      setImageFile(null);
      setImagePreview(contextUser.image || "");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setErrors({});
    }
  };

  // Every other admin page renders Sidebar + Topbar around its content, so
  // an admin never loses navigation chrome moving between pages - this page
  // (and ViewProfile.tsx) used to render bare, with no Sidebar/Topbar at
  // all, dropping the admin into a floating, disconnected screen the moment
  // they opened their own profile settings.
  if (!contextUser) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-ink-muted">Loading...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const initials = getUserInitials(contextUser);

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-page-title font-bold text-primary">
            Profile Settings
          </h1>
          <p className="text-ink-muted mt-1">
            Manage your account information and security
          </p>
        </div>

        {/* Profile Information Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
              <UserIcon className="text-primary" size={28} />
              Personal Information
            </h2>
            <p className="text-ink-muted mt-1">
              Update your personal details and profile picture
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Preview + upload - a real file now, not a URL to
                  paste. Same camera-badge pattern as MemberForm.tsx's own
                  avatar picker, for consistency across the app. */}
            <div className="flex items-center gap-6 pb-6 border-b border-line">
              <div className="relative">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-line"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center ring-4 ring-line">
                    <span className="text-3xl font-bold text-white">
                      {initials}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Change profile photo"
                  className="absolute -bottom-1 -right-1 w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white hover:bg-secondary transition-colors shadow ring-2 ring-white"
                >
                  <Camera size={16} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImagePick}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-primary mb-1">
                  Profile Picture
                </h3>
                <p className="text-sm text-ink-muted">
                  Click the camera icon to upload a photo from your device
                </p>
                <p className="text-xs text-ink-muted mt-0.5">
                  JPG, PNG, GIF or WEBP
                </p>
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-primary mb-2"
                >
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.firstName
                      ? "border-red-300 focus:ring-red-500"
                      : "border-line focus:ring-primary"
                  }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-primary mb-2"
                >
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.lastName
                      ? "border-red-300 focus:ring-red-500"
                      : "border-line focus:ring-primary"
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={contextUser.email}
                    disabled
                    className="w-full px-4 py-3 border border-line rounded-lg bg-surface-muted text-ink-muted cursor-not-allowed"
                  />
                  <Mail
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
                    size={20}
                  />
                </div>
                <p className="mt-1 text-xs text-ink-muted">
                  Email cannot be changed
                </p>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-primary mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.phone
                      ? "border-red-300 focus:ring-red-500"
                      : "border-line focus:ring-primary"
                  }`}
                  placeholder="+1234567890"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-primary mb-2"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="dialog-actions flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-line">
              <button
                type="submit"
                disabled={isSaving}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
                  isSaving
                    ? "bg-primary/50 cursor-not-allowed"
                    : "bg-primary hover:bg-secondary"
                }`}
              >
                <Save size={20} />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 border border-line rounded-lg font-semibold text-primary hover:bg-surface-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={20} />
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Section */}
        <ChangePasswordForm userId={contextUser.id} />
      </div>
    </AdminLayout>
  );
}
