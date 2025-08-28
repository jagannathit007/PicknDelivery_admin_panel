
import api from "./Api";
import toastHelper from "../utils/toastHelper";
import API_ENDPOINTS from "../constants/api-endpoints";

interface Customer {
  _id?: string;
  name: string;
  mobile: string;
  image?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface CustomerListResponse {

    docs: Customer[];
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };


interface CustomerResponse {
  status: number;
  message: string;
  data: Customer | boolean;
}

interface CustomerListPayload {
  search?: string;
  page?: number;
  limit?: number;
}

interface CustomerPayload {
  _id?: string;
  name: string;
  mobile: string;
  isActive: boolean;
  image?: File;
}

interface UserServiceType {
  getCustomers: (payload: CustomerListPayload) => Promise<CustomerListResponse | false>;
  saveCustomer: (payload: CustomerPayload) => Promise<CustomerResponse | false>;
  deleteCustomer: (id: string) => Promise<CustomerResponse | false>;
}

const UserService: UserServiceType = {
  getCustomers: async (payload: CustomerListPayload): Promise<CustomerListResponse | false> => {
    try {
      const response = await api.post(
        API_ENDPOINTS.AUTH.GET_ALL_USERS,
        payload
      );
      const result = response.data;
      if (result.status === 200 && result.data) {
        return result.data;
      } else {
        toastHelper.showTost(result.message || 'Failed to fetch customers', 'warning');
        return false;
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },

  saveCustomer: async (payload: CustomerPayload): Promise<CustomerResponse | false> => {
    try {
      const formData = new FormData();
      
      if (payload._id) {
        formData.append('_id', payload._id);
      }
      formData.append('name', payload.name);
      formData.append('mobile', payload.mobile);
      formData.append('isActive', payload.isActive.toString());
      
      if (payload.image) {
        formData.append('image', payload.image);
      }

      const response = await api.post(
        API_ENDPOINTS.AUTH.UPDATE_USER,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const result = response.data;
      if (result.status === 200) {
        toastHelper.showTost(result.message || 'Customer saved successfully!', 'success');
        return result;
      } else {
        toastHelper.showTost(result.message || 'Failed to save customer', 'warning');
        return false;
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },

  deleteCustomer: async (id: string): Promise<CustomerResponse | false> => {
    try {
      const response = await api.post(
        API_ENDPOINTS.AUTH.DELETE_USER,
        { _id: id }
      );
      const result = response.data;
      if (result.status === 200) {
        toastHelper.showTost(result.message || 'Customer deleted successfully!', 'success');
        return result;
      } else {
        toastHelper.showTost(result.message || 'Failed to delete customer', 'warning');
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

export default UserService;
export type { Customer, CustomerListPayload, CustomerPayload };
