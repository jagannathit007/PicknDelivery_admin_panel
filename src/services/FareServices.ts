import api from "./Api";
import toastHelper from "../utils/toastHelper";
import API_ENDPOINTS from "../constants/api-endpoints";

interface KmRange {
  minKm: number;
  maxKm: number;
  ratePerKm: number;
}

interface Fare {
  _id?: string;
  vehicleType: string;
  kmRanges: KmRange[];
  vulnerabilityCharge?: number;
  extraDetails?: any;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface FareListResponse {
  status: number;
  message: string;
  data: {
    docs: Fare[];
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface FareResponse {
  status: number;
  message: string;
  data: Fare | boolean;
}

interface FareListPayload {
  search?: string;
  page?: number;
  limit?: number;
}

interface FarePayload {
  _id?: string;
  vehicleType: string;
  kmRanges: KmRange[];
  vulnerabilityCharge?: number;
  extraDetails?: any;
}

interface FareServiceType {
  getFares: (payload: FareListPayload) => Promise<FareListResponse | boolean>;
  getFare: (id: string) => Promise<FareResponse | boolean>;
  createFare: (payload: FarePayload) => Promise<FareResponse | boolean>;
  updateFare: (payload: FarePayload) => Promise<FareResponse | boolean>;
  deleteFare: (id: string) => Promise<FareResponse | boolean>;
}

const FareService: FareServiceType = {
  getFares: async (payload: FareListPayload): Promise<FareListResponse | boolean> => {
    try {
      const response = await api.post(API_ENDPOINTS.FARE.GET_FARES, payload, {});
      const result = response.data;
      if (result.status === 200) {
        return result;
      } else {
        toastHelper.showTost(result.message || "Failed to fetch fares", "warning");
        return false;
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },

  getFare: async (id: string): Promise<FareResponse | boolean> => {
    try {
      const response = await api.post(
        API_ENDPOINTS.FARE.GET_FARE,
        { _id: id },
        {}
      );
      const result = response.data;
      if (result.status === 200) {
        return result;
      } else {
        toastHelper.showTost(result.message || "Failed to fetch fare", "warning");
        return false;
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },

  createFare: async (payload: FarePayload): Promise<FareResponse | boolean> => {
    try {
      const response = await api.post(
        API_ENDPOINTS.FARE.CREATE_FARE,
        {
          vehicleType: payload.vehicleType,
          kmRanges: payload.kmRanges,
          vulnerabilityCharge: payload.vulnerabilityCharge,
          extraDetails: payload.extraDetails,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = response.data;

      if (result.status === 200) {
        toastHelper.showTost(result.message || "Fare created successfully!", "success");
        return result;
      } else {
        toastHelper.showTost(result.message || "Failed to create fare", "warning");
        return false;
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },

  updateFare: async (payload: FarePayload): Promise<FareResponse | boolean> => {
    try {
      const response = await api.post(
        API_ENDPOINTS.FARE.UPDATE_FARE,
        {
          id: payload._id, // id required for backend
          vehicleType: payload.vehicleType,
          kmRanges: payload.kmRanges,
          vulnerabilityCharge: payload.vulnerabilityCharge,
          extraDetails: payload.extraDetails,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = response.data;

      if (result.status === 200) {
        toastHelper.showTost(result.message || "Fare updated successfully!", "success");
        return result;
      } else {
        toastHelper.showTost(result.message || "Failed to update fare", "warning");
        return false;
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },

  deleteFare: async (id: string): Promise<FareResponse | boolean> => {
    try {
      const response = await api.post(
        API_ENDPOINTS.FARE.DELETE_FARE,
        { id: id },
        {}
      );
      const result = response.data;
      if (result.status === 200) {
        toastHelper.showTost(result.message || "Fare deleted successfully!", "success");
        return result;
      } else {
        toastHelper.showTost(result.message || "Failed to delete fare", "warning");
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

export default FareService;
export type { Fare, FareListPayload, FarePayload };