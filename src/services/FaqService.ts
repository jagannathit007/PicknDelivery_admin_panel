// services/FaqService.ts
import api from "./Api";
import toastHelper from "../utils/toastHelper";
import API_ENDPOINTS from "../constants/api-endpoints";

// Define the Faq interface
interface Faq {
  _id?: string;
  question: string;
  answer: string;
  createdAt: string;
}

// Define the FaqListResponse interface
interface FaqListResponse {
  docs: Faq[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Define the FaqResponse interface
interface FaqResponse {
  status: number;
  message: string;
  data: Faq | null;
}

// Define the FaqListPayload interface
interface FaqListPayload {
  search?: string;
  page?: number;
  limit?: number;
}

// Define the FaqPayload interface
interface FaqPayload {
  _id?: string;
  question: string;
  answer: string;
}

// Define the FaqServiceType interface
interface FaqServiceType {
  getFaqs: (payload: FaqListPayload) => Promise<FaqListResponse | false>;
  saveFaq: (payload: FaqPayload) => Promise<FaqResponse | false>;
  deleteFaq: (id: string) => Promise<FaqResponse | false>;
}

// Define the API response type for api.post
interface ApiResponse<T> {
  data: T;
}

// FaqService implementation
const FaqService: FaqServiceType = {
  getFaqs: async (payload: FaqListPayload): Promise<FaqListResponse | false> => {
    try {
      // Type the response as ApiResponse<FaqListResponse>
      const response = await api.post<ApiResponse<FaqListResponse>>(
        API_ENDPOINTS.FAQ.GET_ALL_FAQS,
        payload
      );
      const result = response.data;
      if (result.data && 'docs' in result.data) {
        // Ensure result.data is a FaqListResponse
        return result.data;
      } else {
        toastHelper.showTost('Failed to fetch FAQs', 'warning');
        return false;
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },

  saveFaq: async (payload: FaqPayload): Promise<FaqResponse | false> => {
    try {
      // Type the response as FaqResponse (no nested data property)
      const response = await api.post<FaqResponse>(
        payload._id ? API_ENDPOINTS.FAQ.UPDATE_FAQ : API_ENDPOINTS.FAQ.CREATE_FAQ,
        payload
      );
      const result = response.data;
      if (result.status === 200) {
        toastHelper.showTost(result.message || 'FAQ saved successfully!', 'success');
        return result;
      } else {
        toastHelper.showTost(result.message || 'Failed to save FAQ', 'warning');
        return false;
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },

  deleteFaq: async (id: string): Promise<FaqResponse | false> => {
    try {
      // Type the response as FaqResponse (no nested data property)
      const response = await api.post<FaqResponse>(
        API_ENDPOINTS.FAQ.DELETE_FAQ,
        { id }
      );
      const result = response.data;
      if (result.status === 200) {
        toastHelper.showTost(result.message || 'FAQ deleted successfully!', 'success');
        return result;
      } else {
        toastHelper.showTost(result.message || 'Failed to delete FAQ', 'warning');
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

export default FaqService;
export type { Faq, FaqListPayload, FaqPayload, FaqListResponse, FaqResponse };