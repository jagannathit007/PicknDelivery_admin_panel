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

interface VehicleListResponse {
  status: number;
  message: string;
  data: {
    docs: Vehicle[];
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface VehicleResponse {
  status: number;
  message: string;
  data: Vehicle | boolean;
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
  getVehicles: (payload: VehicleListPayload) => Promise<VehicleListResponse | boolean>;
  getVehicle: (id: string) => Promise<VehicleResponse | boolean>;
  createVehicle: (payload: VehiclePayload) => Promise<VehicleResponse | boolean>;
  updateVehicle: (payload: VehiclePayload) => Promise<VehicleResponse | boolean>;
  deleteVehicle: (id: string) => Promise<VehicleResponse | boolean>;
}

const VehicleService: VehicleServiceType = {
  getVehicles: async (payload: VehicleListPayload): Promise<VehicleListResponse | boolean> => {
    try {
      const response = await api.post(API_ENDPOINTS.VEHICLE.GET_VEHICLES, payload, {
      });
      const result = response.data;
      if (result.status === 200) {
        return result;
      } else {
        toastHelper.showTost(result.message || "Failed to fetch vehicles", "warning");
        return false;
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },

  getVehicle: async (id: string): Promise<VehicleResponse | boolean> => {
    try {
      const response = await api.post(
        API_ENDPOINTS.VEHICLE.GET_VEHICLE,
        { _id: id },
        { }
      );
      const result = response.data;
      if (result.status === 200) {
        return result;
      } else {
        toastHelper.showTost(result.message || "Failed to fetch vehicle", "warning");
        return false;
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },

  createVehicle: async (payload: VehiclePayload): Promise<VehicleResponse | boolean> => {
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

    const result = response.data;

    if (result.status === 200) {
      toastHelper.showTost(result.message || "Vehicle created successfully!", "success");
      return result;
    } else {
      toastHelper.showTost(result.message || "Failed to create vehicle", "warning");
      return false;
    }
  } catch (error: any) {
    console.log(error);
    const errorMessage = error.response?.data?.message || "Something went wrong";
    toastHelper.error(errorMessage);
    return false;
  }
},


 updateVehicle: async (payload: VehiclePayload): Promise<VehicleResponse | boolean> => {
  try {
    const response = await api.post(
      API_ENDPOINTS.VEHICLE.UPDATE_VEHICLE,
      {
        id: payload._id, // id required hoga backend me
        name: payload.name,
        maximumWeightCapacity: payload.maximumWeightCapacity,
        description: payload.description,
        extraDetails: payload.extraDetails,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const result = response.data;

    if (result.status === 200) {
      toastHelper.showTost(result.message || "Vehicle updated successfully!", "success");
      return result;
    } else {
      toastHelper.showTost(result.message || "Failed to update vehicle", "warning");
      return false;
    }
  } catch (error: any) {
    console.log(error);
    const errorMessage = error.response?.data?.message || "Something went wrong";
    toastHelper.error(errorMessage);
    return false;
  }
},


  deleteVehicle: async (id: string): Promise<VehicleResponse | boolean> => {
    try {
      const response = await api.post(
        API_ENDPOINTS.VEHICLE.DELETE_VEHICLE,
        { id: id },
      );
      const result = response.data;
      if (result.status === 200) {
        toastHelper.showTost(result.message || "Vehicle deleted successfully!", "success");
        return result;
      } else {
        toastHelper.showTost(result.message || "Failed to delete vehicle", "warning");
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

export default VehicleService;
export type { Vehicle, VehicleListPayload, VehiclePayload };