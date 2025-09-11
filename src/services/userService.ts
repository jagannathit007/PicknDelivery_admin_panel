import api from "./Api";
import toastHelper from "../utils/toastHelper";
import API_ENDPOINTS from "../constants/api-endpoints";

interface Customer {
  _id: string;
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
}

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

interface Rider {
  _id: string;
  name: string;
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface DashboardData {
  liveRiders: Rider[];
  earnings: number;
  orders: number;
}

interface DashboardResponse {
  status: string; // Changed from number to string to match 'success'
  message: string;
  data: DashboardData;
}

// New interface for the API response wrapper for getCustomers
interface CustomerListApiResponse {
  status: number;
  message: string;
  data: CustomerListResponse;
}

interface DashboardPayload {
  selectedDate?: string;
}

interface UserServiceType {
  getCustomers: (
    payload: CustomerListPayload
  ) => Promise<CustomerListResponse | false>;
  saveCustomer: (payload: CustomerPayload) => Promise<CustomerResponse | false>;
  deleteCustomer: (id: string) => Promise<CustomerResponse | false>;
  getDashboardData: (
    payload: DashboardPayload
  ) => Promise<DashboardResponse | false>;
}

const UserService: UserServiceType = {
  getCustomers: async (
    payload: CustomerListPayload
  ): Promise<CustomerListResponse | false> => {
    try {
      const response = await api.post<CustomerListApiResponse>(
        API_ENDPOINTS.AUTH.GET_ALL_USERS,
        payload
      );
      const result = response.data;
      if (result.status === 200 && result.data) {
        return result.data; // Return the nested CustomerListResponse
      } else {
        toastHelper.showTost(
          result.message || "Failed to fetch customers",
          "warning"
        );
        return false;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },

  saveCustomer: async (
    payload: CustomerPayload
  ): Promise<CustomerResponse | false> => {
    try {
      const formData = new FormData();
      if (payload._id) {
        formData.append("_id", payload._id);
      }
      formData.append("name", payload.name);
      formData.append("mobile", payload.mobile);
      formData.append("isActive", payload.isActive.toString());
      if (payload.image) {
        formData.append("image", payload.image);
      }

      const response = await api.post<CustomerResponse>(
        API_ENDPOINTS.AUTH.UPDATE_USER,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const result = response.data;
      if (result.status === 200) {
        toastHelper.showTost(
          result.message || "Customer saved successfully!",
          "success"
        );
        return result;
      } else {
        toastHelper.showTost(
          result.message || "Failed to save customer",
          "warning"
        );
        return false;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },

  deleteCustomer: async (id: string): Promise<CustomerResponse | false> => {
    try {
      const response = await api.post<CustomerResponse>(
        API_ENDPOINTS.AUTH.DELETE_USER,
        { _id: id }
      );
      const result = response.data;
      if (result.status === 200) {
        toastHelper.showTost(
          result.message || "Customer deleted successfully!",
          "success"
        );
        return result;
      } else {
        toastHelper.showTost(
          result.message || "Failed to delete customer",
          "warning"
        );
        return false;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },

  getDashboardData: async (
    payload: DashboardPayload
  ): Promise<DashboardResponse | false> => {
    try {
      const response = await api.post<DashboardResponse>(
        API_ENDPOINTS.DASHBOARD.GET_DASHBOARD_DATA,
        payload
      );
      const result = response.data;
      console.log("Dashboard Data:", result);
      if (result.status === "success" && result.data) {
        return result;
      } else {
        // toastHelper.showTost(
        //   result.message || "Failed to fetch dashboard data",
        //   "warning"
        // );
        return false;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },
};

export default UserService;
export type {
  Customer,
  CustomerListPayload,
  CustomerPayload,
  Rider,
  DashboardData,
  DashboardPayload,
  DashboardResponse,
  CustomerListResponse,
  CustomerResponse,
};
