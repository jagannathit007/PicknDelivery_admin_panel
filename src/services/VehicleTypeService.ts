import api from "./Api";
import toastHelper from "../utils/toastHelper";
import API_ENDPOINTS from "../constants/api-endpoints";

export interface VehicleType {
  _id: string;
  name: string;
  maximumWeightCapacity?: number;
  description?: string;
  extraDetails?: any;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface VehicleTypeListResponse {
  status: number;
  message: string;
  data: {
    docs: VehicleType[];
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface VehicleTypeListPayload {
  search?: string;
  page?: number;
  limit?: number;
}

interface VehicleTypeServiceType {
  getVehicleTypes: (payload?: VehicleTypeListPayload) => Promise<VehicleTypeListResponse | false>;
}

const VehicleTypeService: VehicleTypeServiceType = {
  getVehicleTypes: async (payload: VehicleTypeListPayload = {}): Promise<VehicleTypeListResponse | false> => {
    try {
      const response = await api.post(
        API_ENDPOINTS.VEHICLE_TYPES.GET_ALL_VEHICLE_TYPES,
        payload
      );
      const result = response.data;
      if (result.status === 200) {
        return result;
      } else {
        toastHelper.showTost(result.message || 'Failed to fetch vehicle types', 'warning');
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

export default VehicleTypeService;
export type { VehicleTypeListPayload };
