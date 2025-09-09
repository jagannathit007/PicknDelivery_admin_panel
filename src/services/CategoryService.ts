import api from "./Api";
import toastHelper from "../utils/toastHelper";
import API_ENDPOINTS from "../constants/api-endpoints";

// Define the Category interface
interface Category {
  _id?: string;
  name: string;
  createdAt: string;
}

// Define the CategoryListResponse interface
interface CategoryListResponse {
  docs: Category[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Define the CategoryResponse interface
interface CategoryResponse {
  status: number;
  message: string;
  data: Category | null;
}

// Define the CategoryListPayload interface
interface CategoryListPayload {
  search?: string;
  page?: number;
  limit?: number;
}

// Define the CategoryPayload interface
interface CategoryPayload {
  _id?: string;
  name: string;
}

// Define the CategoryServiceType interface
interface CategoryServiceType {
  getCategories: (payload: CategoryListPayload) => Promise<CategoryListResponse | false>;
  saveCategory: (payload: CategoryPayload) => Promise<CategoryResponse | false>;
  deleteCategory: (id: string) => Promise<CategoryResponse | false>;
}

// Define the API response type for api.post
interface ApiResponse<T> {
  data: T;
}

// CategoryService implementation
const CategoryService: CategoryServiceType = {
  getCategories: async (payload: CategoryListPayload): Promise<CategoryListResponse | false> => {
    try {
      // Type the response as ApiResponse<CategoryListResponse>
      const response = await api.post<ApiResponse<CategoryListResponse>>(
        API_ENDPOINTS.CATEGORY.GET_ALL_CATEGORIES,
        payload
      );
      const result = response.data;
      if (result.data && 'docs' in result.data) {
        // Ensure result.data is a CategoryListResponse
        return result.data;
      } else {
        toastHelper.showTost('Failed to fetch categories', 'warning');
        return false;
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },

  saveCategory: async (payload: CategoryPayload): Promise<CategoryResponse | false> => {
    try {
      // Type the response as CategoryResponse (no nested data property)
      const response = await api.post<CategoryResponse>(
        payload._id ? API_ENDPOINTS.CATEGORY.UPDATE_CATEGORY : API_ENDPOINTS.CATEGORY.CREATE_CATEGORY,
        payload
      );
      const result = response.data;
      if (result.status === 200) {
        toastHelper.showTost(result.message || 'Category saved successfully!', 'success');
        return result;
      } else {
        toastHelper.showTost(result.message || 'Failed to save category', 'warning');
        return false;
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },

  deleteCategory: async (id: string): Promise<CategoryResponse | false> => {
    try {
      // Type the response as CategoryResponse (no nested data property)
      const response = await api.post<CategoryResponse>(
        API_ENDPOINTS.CATEGORY.DELETE_CATEGORY,
        { id }
      );
      const result = response.data;
      if (result.status === 200) {
        toastHelper.showTost(result.message || 'Category deleted successfully!', 'success');
        return result;
      } else {
        toastHelper.showTost(result.message || 'Failed to delete category', 'warning');
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

export default CategoryService;
export type { Category, CategoryListPayload, CategoryPayload, CategoryListResponse, CategoryResponse };