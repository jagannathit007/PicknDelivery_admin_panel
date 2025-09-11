import api from "./Api";
import toastHelper from "../utils/toastHelper";
import API_ENDPOINTS from "../constants/api-endpoints";

const ADMIN_API_BASE_URL = `${import.meta.env.VITE_BASE_URL || 'http://localhost:3000'}/api/${import.meta.env.VITE_ADMIN_ROUTE || 'admin'}`;

// Interface for Customer
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

// Interface for Customer List Response
interface CustomerListResponse {
  docs: Customer[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Interface for Customer Response
interface CustomerResponse {
  status: number;
  message: string;
  data: Customer | boolean;
}

// Interface for Customer List Payload
interface CustomerListPayload {
  search?: string;
  page?: number;
  limit?: number;
}

// Interface for Customer Payload
interface CustomerPayload {
  _id?: string;
  name: string;
  mobile: string;
  isActive: boolean;
  image?: File;
}

// Interface for Rider
interface Rider {
  _id: string;
  name: string;
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Interface for Dashboard Data
interface DashboardData {
  liveRiders: Rider[];
  earnings: number;
  orders: number;
  unassignedOrders: number;
  topUnassignedOrders: any[];
}

// Interface for Dashboard Response
interface DashboardResponse {
  status: number;
  message: string;
  data: DashboardData;
}

// Interface for Dashboard Payload
interface DashboardPayload {
  selectedDate?: string;
}

// Interface for Customer List API Response
interface CustomerListApiResponse {
  status: number;
  message: string;
  data: CustomerListResponse;
}

// Interface for Notification
interface Notification {
  _id: string;
  title: string;
  description: string;
  notificationType: string;
  createdAt: string;
  updatedAt: string;
}

// Interface for Notification List Response
interface NotificationListResponse {
  notifications: Notification[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalNotifications: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
}

// Interface for Notification List Payload
interface NotificationListPayload {
  page?: number;
  limit?: number;
  notificationType?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Interface for Notification List API Response
interface NotificationListApiResponse {
  status: number;
  message: string;
  data: NotificationListResponse;
}

// UserService Type Definition
interface UserServiceType {
  getCustomers: (
    payload: CustomerListPayload
  ) => Promise<CustomerListResponse | false>;
  saveCustomer: (payload: CustomerPayload) => Promise<CustomerResponse | false>;
  deleteCustomer: (id: string) => Promise<CustomerResponse | false>;
  getDashboardData: (
    payload: DashboardPayload
  ) => Promise<DashboardResponse | false>;
  getNotifications: (
    payload: NotificationListPayload
  ) => Promise<NotificationListResponse | false>;
}

// UserService Implementation
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
        return result.data;
      } else {
        toastHelper.showTost(
          result.message || "Failed to fetch customers",
          "warning"
        );
        return false;
      }
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
      if (result.status === 200 && result.data) {
        return result;
      } else {
        toastHelper.showTost(
          result.message || "Failed to fetch dashboard data",
          "warning"
        );
        return false;
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },

  getNotifications: async (
    payload: NotificationListPayload
  ): Promise<NotificationListResponse | false> => {
    try {
      const response = await api.post<NotificationListApiResponse>(
        API_ENDPOINTS.NOTIFICATIONS.GET_ADMIN_NOTIFICATIONS,
        { params: payload }
      );
      const result = response.data;
      if (result.status === 200 && result.data) {
        return result.data;
      } else {
        toastHelper.showTost(
          result.message || "Failed to fetch notifications",
          "warning"
        );
        return false;
      }
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
  Notification,
  NotificationListResponse,
  NotificationListPayload,
};