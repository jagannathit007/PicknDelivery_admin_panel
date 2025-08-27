import { useState } from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";

// Define the user profile type
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
}

// Define the component props
interface UserInfoCardProps {
  userProfile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

// Define the InfoField props
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

// Move InfoField component outside of UserInfoCard
const InfoField = ({ 
  icon, 
  label, 
  value, 
  type = "text", 
  isTextArea = false, 
  field, 
  placeholder,
  isEditing,
  onChange 
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

        {isEditing ? (
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
    </div>
  </div>
);

export default function UserInfoCard({ userProfile, updateProfile }: UserInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: userProfile.firstName,
    lastName: userProfile.lastName,
    email: userProfile.email,
    phone: userProfile.phone,
    bio: userProfile.bio,
  });

  const handleFieldChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateProfile(formData);
    console.log("Saving changes...", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      email: userProfile.email,
      phone: userProfile.phone,
      bio: userProfile.bio,
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="relative px-8 pt-8 pb-6">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600"></div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center">
              <svg
                className="w-8 h-8 text-blue-600"
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
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-1">
                Personal Information
              </h2>
              <p className="text-slate-500">
                Manage your account details and preferences
              </p>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="group relative px-5 py-2.5 bg-slate-50 text-slate-700 rounded-xl border border-slate-200 font-medium transition-all duration-300 hover:bg-white hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50"
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 transition-colors group-hover:text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Information
              </div>
            </button>
          )}
        </div>
      </div>

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
            />
          </div>

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
          />
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