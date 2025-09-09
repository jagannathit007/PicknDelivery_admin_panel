import { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { Rider, RiderPayload } from "../../services/RiderService";
import VehicleTypeService, { VehicleType } from "../../services/VehicleTypeService";
import { FaMotorcycle, FaIdCard, FaCreditCard } from "react-icons/fa";

const imageBaseUrl = import.meta.env.VITE_BASE_URL;

interface RiderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rider: RiderPayload) => void;
  rider?: Rider | null;
  isLoading?: boolean;
}

export default function RiderModal({
  isOpen,
  onClose,
  onSave,
  rider,
  isLoading = false,
}: RiderModalProps) {
  const [formData, setFormData] = useState<RiderPayload>({
    name: "",
    mobile: "",
    emailId: "",
    dateOfBirth: "",
    address: "",
    aadharCard: "",
    panCard: "",
    licenceNumber: "",
    rcBookNumber: "",
    vehicleName: "",
    vehicleNumber: "",
    vehicleType: "",
    upiId: "",
    bankName: "",
    bankAccountNumber: "",
    ifscCode: "",
    isActive: true,
    isVerified: false,
  });

  const [errors, setErrors] = useState({
    name: "",
    mobile: "",
    emailId: "",
    aadharCard: "",
    panCard: "",
    licenceNumber: "",
    rcBookNumber: "",
  });

  const [imageFiles, setImageFiles] = useState<{
    image?: File;
    rcBookImage?: File;
    aadharCardFrontImage?: File;
    aadharCardBackImage?: File;
    licenceImage?: File;
    panCardImage?: File;
    vehicleImage?: File;
  }>({});

  const [imagePreviews, setImagePreviews] = useState<{
    image?: string;
    rcBookImage?: string;
    aadharCardFrontImage?: string;
    aadharCardBackImage?: string;
    licenceImage?: string;
    panCardImage?: string;
    vehicleImage?: string;
  }>({});

  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [loadingVehicleTypes, setLoadingVehicleTypes] = useState(false);

  useEffect(() => {
    if (rider) {
      setFormData({
        _id: rider._id,
        name: rider.name,
        mobile: rider.mobile,
        emailId: rider.emailId || "",
        dateOfBirth: rider.dateOfBirth || "",
        address: rider.address || "",
        aadharCard: rider.aadharCard || "",
        panCard: rider.panCard || "",
        licenceNumber: rider.licenceNumber || "",
        rcBookNumber: rider.rcBookNumber || "",
        vehicleName: rider.vehicleName || "",
        vehicleNumber: rider.vehicleNumber || "",
        vehicleType: rider.vehicleType?._id || rider.vehicleType || "",
        upiId: rider.upiId || "",
        bankName: rider.bankName || "",
        bankAccountNumber: rider.bankAccountNumber || "",
        ifscCode: rider.ifscCode || "",
        isActive: rider.isActive,
        isVerified: rider.isVerified,
      });

      // Set image previews
      const previews: any = {};
      if (rider.image) previews.image = imageBaseUrl + "/" + rider.image;
      if (rider.rcBookImage) previews.rcBookImage = imageBaseUrl + "/" + rider.rcBookImage;
      if (rider.aadharCardFrontImage) previews.aadharCardFrontImage = imageBaseUrl + "/" + rider.aadharCardFrontImage;
      if (rider.aadharCardBackImage) previews.aadharCardBackImage = imageBaseUrl + "/" + rider.aadharCardBackImage;
      if (rider.licenceImage) previews.licenceImage = imageBaseUrl + "/" + rider.licenceImage;
      if (rider.panCardImage) previews.panCardImage = imageBaseUrl + "/" + rider.panCardImage;
      if (rider.vehicleImage) previews.vehicleImage = imageBaseUrl + "/" + rider.vehicleImage;
      setImagePreviews(previews);
    } else {
      setFormData({
        name: "",
        mobile: "",
        emailId: "",
        dateOfBirth: "",
        address: "",
        aadharCard: "",
        panCard: "",
        licenceNumber: "",
        rcBookNumber: "",
        vehicleName: "",
        vehicleNumber: "",
        vehicleType: "",
        upiId: "",
        bankName: "",
        bankAccountNumber: "",
        ifscCode: "",
        isActive: true,
        isVerified: false,
      });
      setImagePreviews({});
    }
    setImageFiles({});
    setErrors({
      name: "",
      mobile: "",
      emailId: "",
      aadharCard: "",
      panCard: "",
      licenceNumber: "",
      rcBookNumber: "",
    });
  }, [rider, isOpen]);

  useEffect(() => {
    const fetchVehicleTypes = async () => {
      setLoadingVehicleTypes(true);
      try {
        const response = await VehicleTypeService.getVehicleTypes();
        if (response && response.data) {
          setVehicleTypes(response.data.docs);
        }
      } catch (error) {
        console.error("Error fetching vehicle types:", error);
      } finally {
        setLoadingVehicleTypes(false);
      }
    };

    fetchVehicleTypes();
  }, []);

  const validateForm = () => {
    const newErrors = {
      name: "",
      mobile: "",
      emailId: "",
      aadharCard: "",
      panCard: "",
      licenceNumber: "",
      rcBookNumber: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ""))) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }

    if (formData.emailId && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId)) {
      newErrors.emailId = "Please enter a valid email address";
    }

    if (formData.aadharCard && !/^\d{12}$/.test(formData.aadharCard.replace(/\D/g, ""))) {
      newErrors.aadharCard = "Please enter a valid 12-digit Aadhar number";
    }

    if (formData.panCard && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panCard.toUpperCase())) {
      newErrors.panCard = "Please enter a valid PAN number";
    }

    if (formData.licenceNumber && formData.licenceNumber.length < 10) {
      newErrors.licenceNumber = "Please enter a valid license number";
    }

    if (formData.rcBookNumber && formData.rcBookNumber.length < 10) {
      newErrors.rcBookNumber = "Please enter a valid RC book number";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
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

  const handleImageChange = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFiles(prev => ({
        ...prev,
        [field]: file
      }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => ({
          ...prev,
          [field]: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const payload: RiderPayload = {
      ...formData,
      ...imageFiles,
    };

    onSave(payload);
  };

  // const handleKeyPress = (e: React.KeyboardEvent) => {
  //   if (e.key === 'Enter') {
  //     handleSubmit(e);
  //   }
  // };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {rider ? "Edit Rider" : "Add Rider"}
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
            {/* Basic Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaIdCard className="mr-2 text-blue-600" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>
                    Name <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    placeholder="Enter rider name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    error={!!errors.name}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-error-500">{errors.name}</p>
                  )}
                </div>

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

                <div>
                  <Label>Email ID</Label>
                  <Input
                    placeholder="Enter email address"
                    value={formData.emailId}
                    onChange={(e) => handleInputChange("emailId", e.target.value)}
                    error={!!errors.emailId}
                  />
                  {errors.emailId && (
                    <p className="mt-1 text-sm text-error-500">{errors.emailId}</p>
                  )}
                </div>

                <div>
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Address</Label>
                  <textarea
                    placeholder="Enter complete address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Document Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaIdCard className="mr-2 text-green-600" />
                Document Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Aadhar Card Number</Label>
                  <Input
                    placeholder="Enter 12-digit Aadhar number"
                    value={formData.aadharCard}
                    onChange={(e) => handleInputChange("aadharCard", e.target.value)}
                    error={!!errors.aadharCard}
                  />
                  {errors.aadharCard && (
                    <p className="mt-1 text-sm text-error-500">{errors.aadharCard}</p>
                  )}
                </div>

                <div>
                  <Label>PAN Card Number</Label>
                  <Input
                    placeholder="Enter PAN number"
                    value={formData.panCard}
                    onChange={(e) => handleInputChange("panCard", e.target.value.toUpperCase())}
                    error={!!errors.panCard}
                  />
                  {errors.panCard && (
                    <p className="mt-1 text-sm text-error-500">{errors.panCard}</p>
                  )}
                </div>

                <div>
                  <Label>License Number</Label>
                  <Input
                    placeholder="Enter license number"
                    value={formData.licenceNumber}
                    onChange={(e) => handleInputChange("licenceNumber", e.target.value)}
                    error={!!errors.licenceNumber}
                  />
                  {errors.licenceNumber && (
                    <p className="mt-1 text-sm text-error-500">{errors.licenceNumber}</p>
                  )}
                </div>

                <div>
                  <Label>RC Book Number</Label>
                  <Input
                    placeholder="Enter RC book number"
                    value={formData.rcBookNumber}
                    onChange={(e) => handleInputChange("rcBookNumber", e.target.value)}
                    error={!!errors.rcBookNumber}
                  />
                  {errors.rcBookNumber && (
                    <p className="mt-1 text-sm text-error-500">{errors.rcBookNumber}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaMotorcycle className="mr-2 text-purple-600" />
                Vehicle Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Vehicle Name</Label>
                  <Input
                    placeholder="Enter vehicle name"
                    value={formData.vehicleName}
                    onChange={(e) => handleInputChange("vehicleName", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Vehicle Number</Label>
                  <Input
                    placeholder="Enter vehicle number"
                    value={formData.vehicleNumber}
                    onChange={(e) => handleInputChange("vehicleNumber", e.target.value.toUpperCase())}
                  />
                </div>

                <div>
                  <Label>Vehicle Type</Label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) => handleInputChange("vehicleType", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select vehicle type</option>
                                         {loadingVehicleTypes ? (
                       <option value="">Loading...</option>
                     ) : (
                       vehicleTypes.map(type => (
                         <option key={type._id} value={type._id}>
                           {type.name}
                         </option>
                       ))
                     )}
                  </select>
                </div>
              </div>
            </div>

            {/* Bank Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaCreditCard className="mr-2 text-orange-600" />
                Bank Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>UPI ID</Label>
                  <Input
                    placeholder="Enter UPI ID"
                    value={formData.upiId}
                    onChange={(e) => handleInputChange("upiId", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Bank Name</Label>
                  <Input
                    placeholder="Enter bank name"
                    value={formData.bankName}
                    onChange={(e) => handleInputChange("bankName", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Bank Account Number</Label>
                  <Input
                    placeholder="Enter account number"
                    value={formData.bankAccountNumber}
                    onChange={(e) => handleInputChange("bankAccountNumber", e.target.value)}
                  />
                </div>

                <div>
                  <Label>IFSC Code</Label>
                  <Input
                    placeholder="Enter IFSC code"
                    value={formData.ifscCode}
                    onChange={(e) => handleInputChange("ifscCode", e.target.value.toUpperCase())}
                  />
                </div>
              </div>
            </div>

            {/* Document Uploads */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Document Uploads</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Profile Image */}
                <div>
                  <Label>Profile Image</Label>
                  <div className="mt-2">
                    <img
                      src={imagePreviews.image ? imagePreviews.image : (rider?.image ? `${imageBaseUrl}/${rider.image}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu2XUjKXh-LnMkWDgqaXlVXJ6dJTfLBxIbnQ&s")}
                      alt="Profile"
                      className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200 mb-2"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange("image", e)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>

                {/* RC Book Image */}
                <div>
                  <Label>RC Book Image</Label>
                  <div className="mt-2">
                    <img
                      src={imagePreviews.rcBookImage ? imagePreviews.rcBookImage : (rider?.rcBookImage ? `${imageBaseUrl}/${rider.rcBookImage}` : "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-blank-avatar-modern-vector-png-image_40962406.jpg")}
                      alt="RC Book"
                      className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200 mb-2"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange("rcBookImage", e)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>

                {/* License Image */}
                <div>
                  <Label>License Image</Label>
                  <div className="mt-2">
                    <img
                      src={imagePreviews.licenceImage ? imagePreviews.licenceImage : (rider?.licenceImage ? `${imageBaseUrl}/${rider.licenceImage}` : "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-blank-avatar-modern-vector-png-image_40962406.jpg")}
                      alt="License"
                      className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200 mb-2"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange("licenceImage", e)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>

                {/* Aadhar Front */}
                <div>
                  <Label>Aadhar Front</Label>
                  <div className="mt-2">
                    <img
                      src={imagePreviews.aadharCardFrontImage ? imagePreviews.aadharCardFrontImage : (rider?.aadharCardFrontImage ? `${imageBaseUrl}/${rider.aadharCardFrontImage}` : "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-blank-avatar-modern-vector-png-image_40962406.jpg")}
                      alt="Aadhar Front"
                      className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200 mb-2"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange("aadharCardFrontImage", e)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>

                {/* Aadhar Back */}
                <div>
                  <Label>Aadhar Back</Label>
                  <div className="mt-2">
                    <img
                      src={imagePreviews.aadharCardBackImage ? imagePreviews.aadharCardBackImage : (rider?.aadharCardBackImage ? `${imageBaseUrl}/${rider.aadharCardBackImage}` : "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-blank-avatar-modern-vector-png-image_40962406.jpg")}
                      alt="Aadhar Back"
                      className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200 mb-2"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange("aadharCardBackImage", e)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>

                {/* Vehicle Image */}
                <div>
                  <Label>Vehicle Image</Label>
                  <div className="mt-2">
                    <img
                      src={imagePreviews.vehicleImage ? imagePreviews.vehicleImage : (rider?.vehicleImage ? `${imageBaseUrl}/${rider.vehicleImage}` : "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-blank-avatar-modern-vector-png-image_40962406.jpg")}
                      alt="Vehicle"
                      className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200 mb-2"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange("vehicleImage", e)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Status</h3>
              <div className="flex space-x-6">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange("isActive", e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.isVerified}
                    onChange={(e) => handleInputChange("isVerified", e.target.checked)}
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700">Verified</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                disabled={isLoading}
                onClick={() => handleSubmit({} as React.FormEvent)}
              >
                {isLoading ? "Saving..." : rider ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
