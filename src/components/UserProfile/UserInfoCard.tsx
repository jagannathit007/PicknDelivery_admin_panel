import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import AuthService from "../../services/AuthService";
import toastHelper from "../../utils/toastHelper";
import API_ENDPOINTS from "../../constants/api-endpoints";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
}

interface UserInfoCardProps {
  userProfile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

interface InfoFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  type?: string;
  isTextArea?: boolean;
  field: keyof UserProfile;
  placeholder?: string;
  isEditing: boolean;
  onChange: (field: keyof UserProfile, value: string) => void;
}

const InfoField = ({
  icon,
  label,
  value,
  type = "text",
  isTextArea = false,
  field,
  placeholder,
  isEditing,
  onChange,
}: InfoFieldProps) => (
  <div className="group relative">
    <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300">
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl flex items-center justify-center">
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          {label}
        </label>

        {isEditing && field === "firstName" ? (
          isTextArea ? (
            <textarea
              value={value}
              onChange={(e) => onChange(field, e.target.value)}
              placeholder={placeholder}
              rows={4}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
            />
          ) : (
            <Input
              type={type}
              value={value}
              onChange={(e) => onChange(field, e.target.value)}
              placeholder={placeholder}
              className="border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          )
        ) : (
          <div className="text-slate-800 font-medium text-base leading-relaxed">
            {value || (
              <span className="text-slate-400 italic">Not provided</span>
            )}
          </div>
        )}
      </div>

      {label === "Email Address" && !isEditing && (
        <div className="flex-shrink-0">
          <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <svg
              className="w-3 h-3 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Verified
          </div>
        </div>
      )}

      {label === "First Name" && !isEditing && (
        <div className="flex-shrink-0 flex items-center">
          <button
            onClick={() => onChange(field, value)}
            className="group relative p-2 text-slate-700 rounded-full hover:bg-slate-100 transition-all duration-300"
          >
            <FaRegEdit className="w-5 h-5 transition-colors group-hover:text-blue-600" />
          </button>
        </div>
      )}
    </div>
  </div>
);

export default function UserInfoCard({
  userProfile,
  updateProfile,
}: UserInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: userProfile.firstName,
    email: userProfile.email,
  });

  const handleFieldChange = (field: keyof UserProfile, value: string) => {
    if (field === "firstName") {
      setIsEditing(true);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const token = AuthService.getToken();
      if (!token) {
        AuthService.logout();
        return;
      }
      const response = await fetch(`${API_ENDPOINTS.AUTH.PROFILE}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${formData.firstName}`,
          emailId: formData.email,
        }),
      });
      const result = await response.json();
      if (result.status === 200) {
        updateProfile(formData);
        toastHelper.showTost("Profile updated successfully!", "success");
        setIsEditing(false);
      } else {
        toastHelper.showTost(
          result.message || "Failed to update profile",
          "warning"
        );
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error updating profile";
      toastHelper.showTost(errorMessage, "error");
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: userProfile.firstName,
      email: userProfile.email,
    });
    setIsEditing(false);
  };

  return (
    <div className="overflow-hidden">
      <div className="px-8 pb-8">
        <div className="grid gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InfoField
              icon={
                <svg
                  className="w-6 h-6 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              }
              label="First Name"
              value={formData.firstName}
              field="firstName"
              placeholder="Enter your first name"
              isEditing={isEditing}
              onChange={handleFieldChange}
            />

            <InfoField
              icon={
                <svg
                  className="w-6 h-6 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              }
              label="Email Address"
              value={formData.email}
              field="email"
              type="email"
              placeholder="your.email@company.com"
              isEditing={false}
              onChange={handleFieldChange}
            />
          </div>

          {/* <InfoField
            icon={
              <svg
                className="w-6 h-6 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            }
            label="Last Name"
            value={formData.lastName}
            field="lastName"
            placeholder="Enter your last name"
            isEditing={isEditing}
            onChange={handleFieldChange}
          /> */}

          {/* <InfoField
            icon={
              <svg
                className="w-6 h-6 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            }
            label="Phone Number"
            value={formData.phone}
            field="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            isEditing={isEditing}
            onChange={handleFieldChange}
          /> */}

          {/* <InfoField
            icon={
              <svg
                className="w-6 h-6 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            }
            label="Professional Summary"
            value={formData.bio}
            field="bio"
            isTextArea={true}
            placeholder="Tell us about your professional background, expertise, and goals..."
            isEditing={isEditing}
            onChange={handleFieldChange}
          /> */}
        </div>

        {isEditing && (
          <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-slate-100">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              className="px-6 border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel Changes
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="px-6 bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100"
            >
              Save Information
            </Button>
          </div>
        )}

        {!isEditing && (
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-1">
                  Keep Your Profile Updated
                </h3>
                <p className="text-blue-700 text-sm leading-relaxed">
                  Having accurate and up-to-date information helps your team
                  members connect with you and ensures smooth communication
                  across projects.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
