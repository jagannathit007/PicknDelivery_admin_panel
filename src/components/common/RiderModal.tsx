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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-5xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 text-dark">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {rider ? "Edit Rider Information" : "Add New Rider"}
              </h2>
              <p className="text-black-100 mt-1">
                {rider ? "Update rider details and documents" : "Fill in the rider information below"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-black/80 hover:text-black hover:bg-black/10 p-2 rounded-lg transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(95vh-120px)]">

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl border border-blue-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg mr-3">
                  <FaIdCard className="text-blue-600 dark:text-blue-400" />
                </div>
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
            <div className="dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl border border-green-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-500/20 rounded-lg mr-3">
                  <FaIdCard className="text-green-600 dark:text-green-400" />
                </div>
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
            <div className="dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl border border-purple-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-lg mr-3">
                  <FaMotorcycle className="text-purple-600 dark:text-purple-400" />
                </div>
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
            <div className="dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl border border-orange-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                <div className="p-2 bg-orange-100 dark:bg-orange-500/20 rounded-lg mr-3">
                  <FaCreditCard className="text-orange-600 dark:text-orange-400" />
                </div>
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
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                <div className="p-2 bg-gray-100 dark:bg-gray-500/20 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                Document Uploads
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Profile Image */}
                <div>
                  <Label>Profile Image</Label>
                  <div className="mt-2">
                    {imagePreviews.image || rider?.image ? (
                      <img
                        src={imagePreviews.image ? imagePreviews.image : `${imageBaseUrl}/${rider.image}`}
                        alt="Profile"
                        className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200 mb-2"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-200 mb-2">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="w-8 h-8 text-gray-500" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                          <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path>
                        </svg>
                      </div>
                    )}
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
                    {imagePreviews.rcBookImage || rider?.rcBookImage ? (
                      <img
                        src={imagePreviews.rcBookImage ? imagePreviews.rcBookImage : `${imageBaseUrl}/${rider.rcBookImage}`}
                        alt="RC Book"
                        className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200 mb-2"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-200 mb-2">
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    )}
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
                    {imagePreviews.licenceImage || rider?.licenceImage ? (
                      <img
                        src={imagePreviews.licenceImage ? imagePreviews.licenceImage : `${imageBaseUrl}/${rider.licenceImage}`}
                        alt="License"
                        className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200 mb-2"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-200 mb-2">
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    )}
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
                    {imagePreviews.aadharCardFrontImage || rider?.aadharCardFrontImage ? (
                      <img
                        src={imagePreviews.aadharCardFrontImage ? imagePreviews.aadharCardFrontImage : `${imageBaseUrl}/${rider.aadharCardFrontImage}`}
                        alt="Aadhar Front"
                        className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200 mb-2"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-200 mb-2">
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    )}
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
                    {imagePreviews.aadharCardBackImage || rider?.aadharCardBackImage ? (
                      <img
                        src={imagePreviews.aadharCardBackImage ? imagePreviews.aadharCardBackImage : `${imageBaseUrl}/${rider.aadharCardBackImage}`}
                        alt="Aadhar Back"
                        className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200 mb-2"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-200 mb-2">
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    )}
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
                    {imagePreviews.vehicleImage || rider?.vehicleImage ? (
                      <img
                        src={imagePreviews.vehicleImage ? imagePreviews.vehicleImage : `${imageBaseUrl}/${rider.vehicleImage}`}
                        alt="Vehicle"
                        className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200 mb-2"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-200 mb-2">
                        <FaMotorcycle className="w-8 h-8 text-gray-500" />
                      </div>
                    )}
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
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl border border-slate-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                <div className="p-2 bg-slate-100 dark:bg-slate-500/20 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Status
              </h3>
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
            <div className="flex space-x-4 pt-6 border-t border-gray-200 dark:border-gray-600">
              <Button
                variant="outline"
                className="flex-1 py-3 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium"
                disabled={isLoading}
                onClick={() => handleSubmit({} as React.FormEvent)}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {rider ? "Updating..." : "Saving..."}
                  </div>
                ) : (
                  rider ? "Update Rider" : "Save Rider"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
