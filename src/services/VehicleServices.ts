import api from "./Api";
import toastHelper from "../utils/toastHelper";
import API_ENDPOINTS from "../constants/api-endpoints";

interface Vehicle {
  _id?: string;
  name: string;
  maximumWeightCapacity: number;
  description?: string;
  extraDetails?: any;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface VehicleListData {
  docs: Vehicle[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface VehicleListResponse {
  status: number;
  message: string;
  data: VehicleListData;
}

interface VehicleResponse {
  status: number;
  message: string;
  data: Vehicle;
}

interface ApiResponse<T> {
  status: number;
  data: T | null;
  message?: string;
}

interface VehicleListPayload {
  search?: string;
  page?: number;
  limit?: number;
}

interface VehiclePayload {
  _id?: string;
  name: string;
  maximumWeightCapacity: number;
  description?: string;
  extraDetails?: any;
  image?: File;
}

interface VehicleServiceType {
  getVehicles: (payload: VehicleListPayload) => Promise<VehicleListResponse>;
  getVehicle: (id: string) => Promise<VehicleResponse>;
  createVehicle: (payload: VehiclePayload) => Promise<VehicleResponse>;
  updateVehicle: (payload: VehiclePayload) => Promise<VehicleResponse>;
  deleteVehicle: (id: string) => Promise<ApiResponse<null>>;
}

const VehicleService: VehicleServiceType = {
  getVehicles: async (payload: VehicleListPayload): Promise<VehicleListResponse> => {
    try {
      const response = await api.post(API_ENDPOINTS.VEHICLE.GET_VEHICLES, payload, {});
      const result = response.data as VehicleListResponse;
      if (result.status === 200) {
        return result;
      } else {
        throw new Error(result.message || "Failed to fetch vehicles");
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
      toastHelper.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  getVehicle: async (id: string): Promise<VehicleResponse> => {
    try {
      const response = await api.post(API_ENDPOINTS.VEHICLE.GET_VEHICLE, { _id: id }, {});
      const result = response.data as VehicleResponse;
      if (result.status === 200) {
        return result;
      } else {
        throw new Error(result.message || "Failed to fetch vehicle");
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
      toastHelper.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  createVehicle: async (payload: VehiclePayload): Promise<VehicleResponse> => {
    try {
      const response = await api.post(
        API_ENDPOINTS.VEHICLE.CREATE_VEHICLE,
        {
          name: payload.name,
          maximumWeightCapacity: payload.maximumWeightCapacity,
          description: payload.description,
          extraDetails: payload.extraDetails,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = response.data as VehicleResponse;

      if (result.status === 200) {
        toastHelper.showTost(result.message || "Vehicle created successfully!", "success");
        return result;
      } else {
        throw new Error(result.message || "Failed to create vehicle");
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
      toastHelper.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  updateVehicle: async (payload: VehiclePayload): Promise<VehicleResponse> => {
    try {
      const response = await api.post(
        API_ENDPOINTS.VEHICLE.UPDATE_VEHICLE,
        {
          id: payload._id,
          name: payload.name,
          maximumWeightCapacity: payload.maximumWeightCapacity,
          description: payload.description,
          extraDetails: payload.extraDetails,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = response.data as VehicleResponse;

      if (result.status === 200) {
        toastHelper.showTost(result.message || "Vehicle updated successfully!", "success");
        return result;
      } else {
        throw new Error(result.message || "Failed to update vehicle");
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
      toastHelper.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  deleteVehicle: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const response = await api.post(API_ENDPOINTS.VEHICLE.DELETE_VEHICLE, { id });
      const result = response.data as ApiResponse<null>;
      if (result.status === 200) {
        toastHelper.showTost(result.message || "Vehicle deleted successfully!", "success");
        return result;
      } else {
        throw new Error(result.message || "Failed to delete vehicle");
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
      toastHelper.error(errorMessage);
      throw new Error(errorMessage);
    }
  },
};

export default VehicleService;
export type { Vehicle, VehicleListPayload, VehiclePayload, VehicleListResponse, VehicleResponse, ApiResponse };