import { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { Customer, CustomerPayload } from "../../services/UserService";

const imageBaseUrl = import.meta.env.VITE_BASE_URL;

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: CustomerPayload) => void;
  customer?: Customer | null;
  isLoading?: boolean;
}

export default function CustomerModal({
  isOpen,
  onClose,
  onSave,
  customer,
  isLoading = false,
}: CustomerModalProps) {
  const [formData, setFormData] = useState<CustomerPayload>({
    name: "",
    mobile: "",
    isActive: true,
  });
  const [errors, setErrors] = useState({
    name: "",
    mobile: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (customer) {
      setFormData({
        _id: customer._id,
        name: customer.name,
        mobile: customer.mobile,
        isActive: customer.isActive,
      });
      if (customer.image) {
        setImagePreview( imageBaseUrl + '/' + customer.image);
      }
    } else {
      setFormData({
        name: "",
        mobile: "",
        isActive: true,
      });
      setImagePreview("");
    }
    setImageFile(null);
    setErrors({ name: "", mobile: "" });
  }, [customer, isOpen]);

  const validateForm = () => {
    const newErrors = {
      name: "",
      mobile: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ""))) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.mobile;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const payload: CustomerPayload = {
      ...formData,
      image: imageFile || undefined,
    };

    onSave(payload);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {customer ? "Edit Customer" : "Add Customer"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <Label>Profile Image</Label>
              <div className="mt-2 flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={imagePreview ? imagePreview : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu2XUjKXh-LnMkWDgqaXlVXJ6dJTfLBxIbnQ&s"}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  />
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer hover:bg-blue-700 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">
                    Click the + icon to upload a profile image
                  </p>
                </div>
              </div>
            </div>

            {/* Name Field */}
            <div>
              <Label>
                Name <span className="text-error-500">*</span>
              </Label>
              <Input
                placeholder="Enter customer name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                error={!!errors.name}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-error-500">{errors.name}</p>
              )}
            </div>

            {/* Mobile Field */}
            <div>
              <Label>
                Mobile Number <span className="text-error-500">*</span>
              </Label>
              <Input
                placeholder="Enter 10-digit mobile number"
                value={formData.mobile}
                onChange={(e) => handleInputChange("mobile", e.target.value)}
                error={!!errors.mobile}
              />
              {errors.mobile && (
                <p className="mt-1 text-sm text-error-500">{errors.mobile}</p>
              )}
            </div>

            {/* Status Field */}
            <div>
              <Label>Status</Label>
              <div className="mt-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange("isActive", e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : customer ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
