import { useState, useEffect } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
// import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import PageMeta from "../components/common/PageMeta";
import AccountSettingsCard from "../components/UserProfile/AccountSettingsCard";
import AuthService from "../services/AuthService";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
}

// interface ProfileResponse {
//   status: number;
//   message: string;
//   data: UserProfile;
// }

export default function UserProfiles() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "account">("profile");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const profileData = await AuthService.getProfile();
      if (profileData && profileData.data) {
        setUserProfile({
          firstName: profileData.data.name.split(" ")[0] || "",
          lastName: profileData.data.name.split(" ")[1] || "",
          email: profileData.data.emailId,
          phone: "", // Adjust if phone is available in API response
          bio: "", // Adjust if bio is available in API response
          avatar: "/images/user/default-avatar.jpg", // Fallback avatar
        });
      }
      setIsLoading(false);
    };
    fetchProfile();
  }, []);

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (userProfile) {
      setUserProfile((prev) => ({ ...prev!, ...updates }));
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!userProfile) {
    return <div>Error loading profile</div>;
  }

  return (
    <>

      <PageBreadcrumb pageTitle="Profile" />
      <div className="space-y-8">
        {/* <UserMetaCard userProfile={userProfile} /> */}

        <div className="bg-white rounded-lg border border-slate-200">
          <div className="px-6 pt-6 pb-0 border-b border-slate-200">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab("profile")}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === "profile"
                    ? "text-slate-800 border-blue-500"
                    : "text-slate-500 hover:text-slate-700 border-transparent"
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab("account")}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === "account"
                    ? "text-blue-600 border-blue-500"
                    : "text-slate-500 hover:text-slate-700 border-transparent"
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Change Password
                </div>
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === "profile" && (
              <UserInfoCard userProfile={userProfile} updateProfile={updateProfile} />
            )}
            {activeTab === "account" && (
              <AccountSettingsCard />
            )}
          </div>
        </div>
      </div>
    </>
  );
}