interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
}

interface UserMetaCardProps {
  userProfile: UserProfile;
}

export default function UserMetaCard({ userProfile }: UserMetaCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-white to-blue-50/30 shadow-xl border border-slate-100">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-slate-600 to-gray-600 rounded-full translate-y-32 -translate-x-32"></div>
      </div>

      <div className="relative p-8 lg:p-10">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
          <div className="flex flex-col items-center  xl:flex-row gap-8 xl:gap-10">
            <div className="relative group">
              <div className="w-32 h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden ring-4 ring-white shadow-2xl">
                <img
                  src={userProfile.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="absolute bottom-2 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              </div>
            </div>

            <div className="text-center xl:text-left flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-3 tracking-tight">
                {userProfile.firstName} {userProfile.lastName}
              </h1>
              <p className="text-base text-blue-600 dark:text-blue-400">
                {userProfile.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}