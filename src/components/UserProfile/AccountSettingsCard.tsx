// import { useState } from "react";
// import Button from "../ui/button/Button";
// import Input from "../form/input/InputField";

// // Define the component props
// interface AccountSettingsCardProps {}

// // Define the FormData interface
// interface FormData {
//   currentPassword: string;
//   newPassword: string;
//   confirmPassword: string;
// }

// // Define the InfoField props
// interface InfoFieldProps {
//   icon: React.ReactNode;
//   label: string;
//   value: string;
//   type: string;
//   field: keyof FormData;
//   placeholder?: string;
//   showPassword: boolean;
//   toggleShowPassword: () => void;
//   onChange: (field: keyof FormData, value: string) => void;
//   error?: string;
// }

// // Enhanced InfoField component with professional styling
// const InfoField = ({ 
//   icon, 
//   label, 
//   value, 
//   type, 
//   field, 
//   placeholder, 
//   showPassword, 
//   toggleShowPassword,
//   onChange,
//   error
// }: InfoFieldProps) => (
//   <div className="group relative">
//     <div className="relative">
//       <label className="block text-sm font-semibold text-slate-700 mb-3">
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
//             {icon}
//           </div>
//           {label}
//         </div>
//       </label>
      
//       <div className="relative">
//         <Input
//           type={showPassword ? "text" : type}
//           value={value}
//           onChange={(e) => onChange(field, e.target.value)}
//           placeholder={placeholder}
//           className={`w-full h-14 px-5 pr-12 text-base border-2 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-blue-100 ${
//             error 
//               ? "border-red-300 focus:border-red-500 bg-red-50/50" 
//               : "border-slate-200 focus:border-blue-500 bg-white hover:border-slate-300"
//           }`}
//         />
//         <button
//           type="button"
//           onClick={toggleShowPassword}
//           className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
//         >
//           {showPassword ? (
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
//             </svg>
//           ) : (
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//             </svg>
//           )}
//         </button>
//       </div>
      
//       {error && (
//         <div className="flex items-center gap-2 mt-2 text-red-600">
//           <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           <p className="text-sm font-medium">{error}</p>
//         </div>
//       )}
//     </div>
//   </div>
// );

// export default function AccountSettingsCard({}: AccountSettingsCardProps) {
//   const [formData, setFormData] = useState<FormData>({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [errors, setErrors] = useState<Partial<FormData>>({});
//   const [isLoading, setIsLoading] = useState(false);

//   const handleFieldChange = (field: keyof FormData, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: "" }));
//     }
//   };

//   const validateForm = (): boolean => {
//     const newErrors: Partial<FormData> = {};

//     if (!formData.currentPassword) {
//       newErrors.currentPassword = "Current password is required";
//     }
//     if (!formData.newPassword) {
//       newErrors.newPassword = "New password is required";
//     } else if (formData.newPassword.length < 8) {
//       newErrors.newPassword = "Password must be at least 8 characters";
//     }
//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = "Please confirm your new password";
//     } else if (formData.newPassword !== formData.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSave = async () => {
//     if (!validateForm()) return;

//     setIsLoading(true);
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       console.log("Password updated successfully");
//       setFormData({
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//       });
//       setErrors({});
//     } catch (error) {
//       console.error("Failed to update password");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     setFormData({
//       currentPassword: "",
//       newPassword: "",
//       confirmPassword: "",
//     });
//     setErrors({});
//   };

//   const passwordStrength = (password: string): { score: number; label: string; color: string } => {
//     let score = 0;
//     if (password.length >= 8) score++;
//     if (/[A-Z]/.test(password)) score++;
//     if (/[a-z]/.test(password)) score++;
//     if (/[0-9]/.test(password)) score++;
//     if (/[^A-Za-z0-9]/.test(password)) score++;

//     const levels = [
//       { label: "Very Weak", color: "bg-red-500" },
//       { label: "Weak", color: "bg-orange-500" },
//       { label: "Fair", color: "bg-yellow-500" },
//       { label: "Good", color: "bg-blue-500" },
//       { label: "Strong", color: "bg-green-500" },
//     ];

//     return { score, ...levels[score] };
//   };

//   const strength = passwordStrength(formData.newPassword);

//   return (
//     <div className="max-w-4xl mx-auto">
//       {/* Header Section */}
//       <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl shadow-2xl mb-8 overflow-hidden">
//         <div className="relative px-8 py-12">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
//           <div className="relative flex items-center gap-6">
//             <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
//               <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//               </svg>
//             </div>
//             <div className="text-white">
//               <h2 className="text-3xl font-bold mb-2">Account Security</h2>
//               <p className="text-blue-100 text-lg">Protect your account with a strong password</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
//         <div className="px-8 py-10">
//           {/* Security Tips */}
//           <div className="grid md:grid-cols-3 gap-4 mb-10">
//             <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
//               <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-4">
//                 <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <h3 className="font-bold text-green-800 mb-2">Use Strong Passwords</h3>
//               <p className="text-green-700 text-sm">At least 8 characters with mix of letters, numbers & symbols</p>
//             </div>
            
//             <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
//               <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
//                 <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <h3 className="font-bold text-blue-800 mb-2">Regular Updates</h3>
//               <p className="text-blue-700 text-sm">Change your password every 90 days for optimal security</p>
//             </div>
            
//             <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-2xl border border-purple-100">
//               <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
//                 <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
//                 </svg>
//               </div>
//               <h3 className="font-bold text-purple-800 mb-2">Unique Passwords</h3>
//               <p className="text-purple-700 text-sm">Don't reuse passwords across different accounts</p>
//             </div>
//           </div>

//           {/* Password Form */}
//           <div className="space-y-8">
//             <InfoField
//               icon={
//                 <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
//                 </svg>
//               }
//               label="Current Password"
//               value={formData.currentPassword}
//               type="password"
//               field="currentPassword"
//               placeholder="Enter your current password"
//               showPassword={showCurrentPassword}
//               toggleShowPassword={() => setShowCurrentPassword(!showCurrentPassword)}
//               onChange={handleFieldChange}
//               error={errors.currentPassword}
//             />

//             <InfoField
//               icon={
//                 <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                 </svg>
//               }
//               label="New Password"
//               value={formData.newPassword}
//               type="password"
//               field="newPassword"
//               placeholder="Create a strong new password"
//               showPassword={showNewPassword}
//               toggleShowPassword={() => setShowNewPassword(!showNewPassword)}
//               onChange={handleFieldChange}
//               error={errors.newPassword}
//             />

//             {/* Password Strength Indicator */}
//             {formData.newPassword && (
//               <div className="px-1">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-sm font-medium text-slate-600">Password Strength</span>
//                   <span className={`text-sm font-semibold ${
//                     strength.score >= 4 ? 'text-green-600' : 
//                     strength.score >= 3 ? 'text-blue-600' :
//                     strength.score >= 2 ? 'text-yellow-600' : 'text-red-600'
//                   }`}>
//                     {strength.label}
//                   </span>
//                 </div>
//                 <div className="w-full bg-slate-200 rounded-full h-3">
//                   <div 
//                     className={`h-3 rounded-full transition-all duration-500 ${strength.color}`}
//                     style={{ width: `${(strength.score / 5) * 100}%` }}
//                   ></div>
//                 </div>
//               </div>
//             )}

//             <InfoField
//               icon={
//                 <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                 </svg>
//               }
//               label="Confirm New Password"
//               value={formData.confirmPassword}
//               type="password"
//               field="confirmPassword"
//               placeholder="Confirm your new password"
//               showPassword={showConfirmPassword}
//               toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
//               onChange={handleFieldChange}
//               error={errors.confirmPassword}
//             />
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-12 pt-8 border-t border-slate-200">
//             <Button
//               size="lg"
//               variant="outline"
//               onClick={handleCancel}
//               disabled={isLoading}
//               className="w-full sm:w-auto px-8 py-4 border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
//             >
//               Cancel Changes
//             </Button>
//             <Button
//               size="lg"
//               onClick={handleSave}
//               disabled={isLoading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
//               className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isLoading ? (
//                 <div className="flex items-center gap-2">
//                   <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                   </svg>
//                   Updating...
//                 </div>
//               ) : (
//                 "Update Password"
//               )}
//             </Button>
//           </div>

//           {/* Footer Info */}
//           <div className="mt-10 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100">
//             <div className="flex items-start gap-4">
//               <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                 <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                 </svg>
//               </div>
//               <div className="flex-1">
//                 <h3 className="font-semibold text-amber-900 mb-2">Important Security Notice</h3>
//                 <p className="text-amber-800 text-sm leading-relaxed">
//                   After updating your password, you'll be automatically logged out from all other devices. 
//                   This helps ensure your account remains secure. You'll need to log in again on those devices using your new password.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




import { useState } from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";

// Define the component props
interface AccountSettingsCardProps {}

// Define the FormData interface
interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Define the InfoField props
interface InfoFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  type: string;
  field: keyof FormData;
  placeholder?: string;
  showPassword: boolean;
  toggleShowPassword: () => void;
  onChange: (field: keyof FormData, value: string) => void;
  error?: string;
}

// InfoField component matching the clean UserInfoCard style
const InfoField = ({ 
  icon, 
  label, 
  value, 
  type, 
  field, 
  placeholder, 
  showPassword, 
  toggleShowPassword,
  onChange,
  error
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
        <div className="relative">
          <Input
            type={showPassword ? "text" : type}
            value={value}
            onChange={(e) => onChange(field, e.target.value)}
            placeholder={placeholder}
            className={`w-full border-2 focus:ring-4 focus:ring-blue-100 transition-all ${
              error 
                ? "border-red-300 focus:border-red-500" 
                : "border-slate-200 focus:border-blue-500"
            }`}
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-blue-600 transition-colors"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        
        {error && (
          <div className="flex items-center gap-2 mt-2 text-red-600">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default function AccountSettingsCard({}: AccountSettingsCardProps) {
  const [formData, setFormData] = useState<FormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleFieldChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    
    console.log("Updating password...", {
      current: formData.currentPassword,
      new: formData.newPassword,
    });
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  const handleCancel = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="relative px-8 pt-8 pb-6">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600"></div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-1">
                Account Security
              </h2>
              <p className="text-slate-500">
                Manage your password and security settings
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8">
        {/* Security Tips - Keep these cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-green-800 mb-2">Use Strong Passwords</h3>
            <p className="text-green-700 text-sm">At least 8 characters with mix of letters, numbers & symbols</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-blue-800 mb-2">Regular Updates</h3>
            <p className="text-blue-700 text-sm">Change your password every 90 days for optimal security</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-2xl border border-purple-100">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-purple-800 mb-2">Unique Passwords</h3>
            <p className="text-purple-700 text-sm">Don't reuse passwords across different accounts</p>
          </div>
        </div>

        <div className="grid gap-6">
          <InfoField
            icon={
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
              </svg>
            }
            label="Current Password"
            value={formData.currentPassword}
            type="password"
            field="currentPassword"
            placeholder="Enter your current password"
            showPassword={showCurrentPassword}
            toggleShowPassword={() => setShowCurrentPassword(!showCurrentPassword)}
            onChange={handleFieldChange}
            error={errors.currentPassword}
          />

          <InfoField
            icon={
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
            label="New Password"
            value={formData.newPassword}
            type="password"
            field="newPassword"
            placeholder="Create a strong new password"
            showPassword={showNewPassword}
            toggleShowPassword={() => setShowNewPassword(!showNewPassword)}
            onChange={handleFieldChange}
            error={errors.newPassword}
          />

          <InfoField
            icon={
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            label="Confirm New Password"
            value={formData.confirmPassword}
            type="password"
            field="confirmPassword"
            placeholder="Confirm your new password"
            showPassword={showConfirmPassword}
            toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
            onChange={handleFieldChange}
            error={errors.confirmPassword}
          />
        </div>

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
            disabled={!formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
            className="px-6 bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Password
          </Button>
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">
                Keep Your Account Secure
              </h3>
              <p className="text-blue-700 text-sm leading-relaxed">
                Use a strong password with at least 8 characters including uppercase, lowercase, numbers, and special characters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}