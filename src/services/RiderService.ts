import api from "./Api";
import toastHelper from "../utils/toastHelper";
import API_ENDPOINTS from "../constants/api-endpoints";

export interface Rider {
  _id?: string;
  name: string;
  mobile: string;
  emailId?: string;
  dateOfBirth?: string;
  address?: string;
  
  // Document Details
  aadharCard?: string;
  panCard?: string;
  licenceNumber?: string;
  rcBookNumber?: string;

  // Profile Images
  image?: string;

  // Documents Images
  rcBookImage?: string;
  aadharCardFrontImage?: string;
  aadharCardBackImage?: string;
  licenceImage?: string;
  panCardImage?: string;
  vehicleImage?: string;
  
  // Vehicle Details
  vehicleName?: string;
  vehicleNumber?: string;
  vehicleType?: any;

  // Bank Details
  upiId?: string;
  bankName?: string;
  bankAccountNumber?: string;
  ifscCode?: string;

  isDuty: boolean;
  isActive: boolean;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface RiderListResponse {
  status: number;
  message: string;
  data: {
    docs: Rider[];
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface RiderResponse {
  status: number;
  message: string;
  data: Rider | boolean;
}

interface RiderListPayload {
  search?: string;
  page?: number;
  limit?: number;
}

interface RiderPayload {
  _id?: string;
  name: string;
  mobile: string;
  emailId?: string;
  dateOfBirth?: string;
  address?: string;
  aadharCard?: string;
  panCard?: string;
  licenceNumber?: string;
  rcBookNumber?: string;
  vehicleName?: string;
  vehicleNumber?: string;
  vehicleType?: string; // This will be the ObjectId of the vehicle type
  upiId?: string;
  bankName?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
  isActive: boolean;
  isVerified: boolean;
  image?: File;
  rcBookImage?: File;
  aadharCardFrontImage?: File;
  aadharCardBackImage?: File;
  licenceImage?: File;
  panCardImage?: File;
  vehicleImage?: File;
}

interface RiderServiceType {
  getRiders: (payload: RiderListPayload) => Promise<RiderListResponse | false>;
  saveRider: (payload: RiderPayload) => Promise<RiderResponse | false>;
  deleteRider: (id: string) => Promise<RiderResponse | false>;
  getRiderById: (id: string) => Promise<RiderResponse | false>;
}

const RiderService: RiderServiceType = {
  getRiders: async (payload: RiderListPayload): Promise<RiderListResponse | false> => {
    try {
      const response = await api.post(
        API_ENDPOINTS.RIDERS.GET_ALL_RIDERS,
        payload
      );
      const result = response.data;
      if (result.status === 200) {
        return result;
      } else {
        toastHelper.showTost(result.message || 'Failed to fetch riders', 'warning');
        return false;
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },

  saveRider: async (payload: RiderPayload): Promise<RiderResponse | false> => {
    try {
      const formData = new FormData();
      
      if (payload._id) {
        formData.append('_id', payload._id);
      }
      formData.append('name', payload.name);
      formData.append('mobile', payload.mobile);
      formData.append('isActive', payload.isActive.toString());
      formData.append('isVerified', payload.isVerified.toString());
      
      // Optional fields
      if (payload.emailId) formData.append('emailId', payload.emailId);
      if (payload.dateOfBirth) formData.append('dateOfBirth', payload.dateOfBirth);
      if (payload.address) formData.append('address', payload.address);
      if (payload.aadharCard) formData.append('aadharCard', payload.aadharCard);
      if (payload.panCard) formData.append('panCard', payload.panCard);
      if (payload.licenceNumber) formData.append('licenceNumber', payload.licenceNumber);
      if (payload.rcBookNumber) formData.append('rcBookNumber', payload.rcBookNumber);
      if (payload.vehicleName) formData.append('vehicleName', payload.vehicleName);
      if (payload.vehicleNumber) formData.append('vehicleNumber', payload.vehicleNumber);
      if (payload.vehicleType) formData.append('vehicleType', payload.vehicleType);
      if (payload.upiId) formData.append('upiId', payload.upiId);
      if (payload.bankName) formData.append('bankName', payload.bankName);
      if (payload.bankAccountNumber) formData.append('bankAccountNumber', payload.bankAccountNumber);
      if (payload.ifscCode) formData.append('ifscCode', payload.ifscCode);
      
      // Files
      if (payload.image) formData.append('image', payload.image);
      if (payload.rcBookImage) formData.append('rcBookImage', payload.rcBookImage);
      if (payload.aadharCardFrontImage) formData.append('aadharCardFrontImage', payload.aadharCardFrontImage);
      if (payload.aadharCardBackImage) formData.append('aadharCardBackImage', payload.aadharCardBackImage);
      if (payload.licenceImage) formData.append('licenceImage', payload.licenceImage);
      if (payload.panCardImage) formData.append('panCardImage', payload.panCardImage);
      if (payload.vehicleImage) formData.append('vehicleImage', payload.vehicleImage);

      const response = await api.post(
        API_ENDPOINTS.RIDERS.CREATE_RIDER,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const result = response.data;
      if (result.status === 200) {
        toastHelper.showTost(result.message || 'Rider saved successfully!', 'success');
        return result;
      } else {
        toastHelper.showTost(result.message || 'Failed to save rider', 'warning');
        return false;
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },

  deleteRider: async (id: string): Promise<RiderResponse | false> => {
    try {
      const response = await api.post(
        API_ENDPOINTS.RIDERS.DELETE_RIDER,
        { _id: id }
      );
      const result = response.data;
      if (result.status === 200) {
        toastHelper.showTost(result.message || 'Rider deleted successfully!', 'success');
        return result;
      } else {
        toastHelper.showTost(result.message || 'Failed to delete rider', 'warning');
        return false;
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },

  getRiderById: async (id: string): Promise<RiderResponse | false> => {
    try {
      const response = await api.post(
        API_ENDPOINTS.RIDERS.GET_RIDER,
        { _id: id }
      );
      const result = response.data;
      if (result.status === 200) {
        return result;
      } else {
        toastHelper.showTost(result.message || 'Failed to fetch rider', 'warning');
        return false;
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },
};

export default RiderService;
export type { RiderListPayload, RiderPayload };
