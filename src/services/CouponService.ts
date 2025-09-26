import api from "./Api";
import toastHelper from "../utils/toastHelper";
import API_ENDPOINTS from "../constants/api-endpoints";

// Define the Coupon interface
interface Coupon {
  _id?: string;
  code: string;
  description: string;
  type: "percentage" | "fixed";
  discount: number;
  minOrderAmount: number;
  expiryDate: string;
  isActive: boolean;
}

// Define the CouponListResponse interface
interface CouponListResponse {
  docs: Coupon[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Define the CouponResponse interface
interface CouponResponse {
  status: number;
  message: string;
  data: Coupon | boolean;
}

// Define the CouponListPayload interface
interface CouponListPayload {
  search?: string;
  page?: number;
  limit?: number;
}

// Define the CouponPayload interface
interface CouponPayload {
  _id?: string;
  code: string;
  description: string;
  type: "percentage" | "fixed";
  discount: number;
  minOrderAmount: number;
  expiryDate: string;
  isActive: boolean;
}

// Define the CouponServiceType interface
interface CouponServiceType {
  getCoupons: (payload: CouponListPayload) => Promise<CouponListResponse | false>;
  saveCoupon: (payload: CouponPayload) => Promise<CouponPayload | false>;
  deleteCoupon: (id: string) => Promise<CouponResponse | false>;
}

// Define the API response type for api.post
interface ApiResponse<T> {
  data: T;
}

// CouponService implementation
const CouponService: CouponServiceType = {
  getCoupons: async (payload: CouponListPayload): Promise<CouponListResponse | false> => {
    try {
      // Type the response as ApiResponse<CouponListResponse>
      const response = await api.post<ApiResponse<CouponListResponse>>(
        API_ENDPOINTS.COUPON.GET_ALL_COUPONS,
        payload
      );
      const result = response.data;
      if (result.data && 'docs' in result.data) {
        // Ensure result.data is a CouponListResponse
        return result.data;
      } else {
        toastHelper.showTost('Failed to fetch coupons', 'warning');
        return false;
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },

  saveCoupon: async (payload: CouponPayload): Promise<CouponPayload | false> => {
    try {
      // Type the response as ApiResponse<CouponResponse>
      const response = await api.post<ApiResponse<CouponPayload>>(
        API_ENDPOINTS.COUPON.SAVE_COUPON,
        payload
      );
      const result = response;
      if (result.data.data != null) {
        toastHelper.showTost('Coupon saved successfully!', 'success');
        return result.data.data;
      } else {
        toastHelper.showTost('Failed to save coupon', 'warning');
        return false;
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },

  deleteCoupon: async (id: string): Promise<CouponResponse | false> => {
    try {
      // Type the response as ApiResponse<CouponResponse>
      const response = await api.post<ApiResponse<CouponResponse>>(
        API_ENDPOINTS.COUPON.DELETE_COUPON,
        { _id: id }
      );
      const result = response.data;
      if (result.data.status === 200) {
        toastHelper.showTost(result.data.message || 'Coupon deleted successfully!', 'success');
        return result.data;
      } else {
        toastHelper.showTost(result.data.message || 'Failed to delete coupon', 'warning');
        return false;
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },
};

export default CouponService;
export type { Coupon, CouponListPayload, CouponPayload, CouponListResponse, CouponResponse };