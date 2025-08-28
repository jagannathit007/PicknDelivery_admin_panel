import api from "./Api";
import toastHelper from "../utils/toastHelper";
import API_ENDPOINTS from "../constants/api-endpoints";

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

interface CouponListResponse {
  docs: Coupon[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface CouponResponse {
  status: number;
  message: string;
  data: Coupon | boolean;
}

interface CouponListPayload {
  search?: string;
  page?: number;
  limit?: number;
}

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

interface CouponServiceType {
  getCoupons: (payload: CouponListPayload) => Promise<CouponListResponse | false>;
  saveCoupon: (payload: CouponPayload) => Promise<CouponResponse | false>;
  deleteCoupon: (id: string) => Promise<CouponResponse | false>;
}

const CouponService: CouponServiceType = {
  getCoupons: async (payload: CouponListPayload): Promise<CouponListResponse | false> => {
    try {
      const response = await api.post(API_ENDPOINTS.COUPON.GET_ALL_COUPONS, payload);
      const result = response.data;
      if (result.status === 200 && result.data) {
        return result.data;
      } else {
        toastHelper.showTost(result.message || 'Failed to fetch coupons', 'warning');
        return false;
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },

  saveCoupon: async (payload: CouponPayload): Promise<CouponResponse | false> => {
    try {
      const response = await api.post(API_ENDPOINTS.COUPON.SAVE_COUPON, payload);
      const result = response.data;
      if (result.status === 200) {
        toastHelper.showTost(result.message || 'Coupon saved successfully!', 'success');
        return result;
      } else {
        toastHelper.showTost(result.message || 'Failed to save coupon', 'warning');
        return false;
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },

  deleteCoupon: async (id: string): Promise<CouponResponse | false> => {
    try {
      const response = await api.post(API_ENDPOINTS.COUPON.DELETE_COUPON, { _id: id });
      const result = response.data;
      if (result.status === 200) {
        toastHelper.showTost(result.message || 'Coupon deleted successfully!', 'success');
        return result;
      } else {
        toastHelper.showTost(result.message || 'Failed to delete coupon', 'warning');
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

export default CouponService;
export type { Coupon, CouponListPayload, CouponPayload };