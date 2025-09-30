import api from "./Api";
import toastHelper from "../utils/toastHelper";
import API_ENDPOINTS from "../constants/api-endpoints";

interface CountryConfig {
  _id?: string;
  code: string;
  country: string;
  flag: string;
  currencySign: string;
}

type CountryListResponse = CountryConfig[];

interface CountryResponse {
  status?: number;
  message?: string;
  data: boolean | null;
}

interface CountryListPayload {
  search?: string;
}

type CountryPayload = CountryConfig;

interface ApiResponse<T> {
  data: T;
}

interface CountryServiceType {
  getCountries: (payload: CountryListPayload) => Promise<CountryListResponse | false>;
  saveCountry: (payload: CountryPayload) => Promise<CountryPayload | false>;
  deleteCountry: (code: string) => Promise<boolean>;
}

const CountryService: CountryServiceType = {
  getCountries: async (
    payload: CountryListPayload
  ): Promise<CountryListResponse | false> => {
    try {
      const response = await api.post<ApiResponse<CountryListResponse>>(
        API_ENDPOINTS.COUNTRY.GET_ALL_COUNTRIES,
        payload
      );
      const result = response.data;
      if (Array.isArray(result.data)) {
        return result.data;
      }
      toastHelper.showTost("Failed to fetch countries", "warning");
      return false;
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },

  saveCountry: async (payload: CountryPayload): Promise<CountryPayload | false> => {
    try {
      const response = await api.post<ApiResponse<CountryPayload>>(
        API_ENDPOINTS.COUNTRY.SAVE_COUNTRY,
        payload
      );
      const result = response;
      if (result.data.data != null) {
        toastHelper.showTost("Country saved successfully!", "success");
        return result.data.data;
      } else {
        toastHelper.showTost("Failed to save country", "warning");
        return false;
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },

  deleteCountry: async (code: string): Promise<boolean> => {
    try {
      const response = await api.post<ApiResponse<CountryResponse>>(
        API_ENDPOINTS.COUNTRY.DELETE_COUNTRY,
        { code }
      );
      const result = response.data;
      if (result) {
        return true;
      }
      toastHelper.showTost("Failed to delete country", "warning");
      return false;
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },
};

export default CountryService;
export type {
  CountryConfig,
  CountryListPayload,
  CountryPayload,
  CountryListResponse,
  CountryResponse,
};


