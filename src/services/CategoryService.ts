import api from "./Api";
import toastHelper from "../utils/toastHelper";
import API_ENDPOINTS from "../constants/api-endpoints";

interface Category {
  _id?: string;
  name: string;
  createdAt: string;
}

interface CategoryListResponse {
  docs: Category[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface CategoryResponse {
  status: number;
  message: string;
  data: Category | null;
}

interface CategoryListPayload {
  search?: string;
  page?: number;
  limit?: number;
}

interface CategoryPayload {
  _id?: string;
  name: string;
}

interface CategoryServiceType {
  getCategories: (payload: CategoryListPayload) => Promise<CategoryListResponse | false>;
  saveCategory: (payload: CategoryPayload) => Promise<CategoryResponse | false>;
  deleteCategory: (id: string) => Promise<CategoryResponse | false>;
}

const CategoryService: CategoryServiceType = {
  getCategories: async (payload: CategoryListPayload): Promise<CategoryListResponse | false> => {
    try {
      const response = await api.post(API_ENDPOINTS.CATEGORY.GET_ALL_CATEGORIES, payload);
      const result = response.data;
      if (result.status === 200 && result.data) {
        return result.data;
      } else {
        toastHelper.showTost(result.message || 'Failed to fetch categories', 'warning');
        return false;
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },

  saveCategory: async (payload: CategoryPayload): Promise<CategoryResponse | false> => {
    try {
      let response;
      if (payload._id) {
        response = await api.post(API_ENDPOINTS.CATEGORY.UPDATE_CATEGORY, payload);
      } else {
        response = await api.post(API_ENDPOINTS.CATEGORY.CREATE_CATEGORY, payload);
      }
      const result = response.data;
      if (result.status === 200) {
        toastHelper.showTost(result.message || 'Category saved successfully!', 'success');
        return result;
      } else {
        toastHelper.showTost(result.message || 'Failed to save category', 'warning');
        return false;
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },

  deleteCategory: async (id: string): Promise<CategoryResponse | false> => {
    try {
      const response = await api.post(API_ENDPOINTS.CATEGORY.DELETE_CATEGORY, { id });
      const result = response.data;
      if (result.status === 200) {
        toastHelper.showTost(result.message || 'Category deleted successfully!', 'success');
        return result;
      } else {
        toastHelper.showTost(result.message || 'Failed to delete category', 'warning');
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

export default CategoryService;
export type { Category, CategoryListPayload, CategoryPayload };