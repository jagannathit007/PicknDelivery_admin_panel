import api from './Api';
import toastHelper from '../utils/toastHelper';
import API_ENDPOINTS from '../constants/api-endpoints';

// Define the structure of the API response
interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

// Define the BalanceRequest interface based on backend response
export interface BalanceRequest {
  _id: string;
  rider: {
    _id: string;
    name: string;
    mobile: string;
    image?: string;
  };
  totalBalance: number;
  balances: {
    _id: string;
    amount: number;
    isSubbmitted: boolean;
    isApproved: boolean;
    extraDetails?: any;
    createdAt: string;
    updatedAt: string;
  }[];
  latestSubmittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Define the SettlementFilters interface
export interface SettlementFilters {
  page?: number;
  limit?: number;
  riderId?: string;
  isSubbmitted?: boolean;
  startDate?: string;
  endDate?: string;
}

// Define the SettlementListResponse interface
interface SettlementListResponse {
  // status: number;
  // message: string;
  // data: {
    docs: BalanceRequest[];
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  // };
}

// Define the SettlementResponse interface
interface SettlementResponse {
  // status: number;
  // message: string;
  // data: {
    transaction: any;
  // };
}

// Define the SettlementServiceType interface
interface SettlementServiceType {
  getPendingBalanceRequests: (payload: SettlementFilters) => Promise<SettlementListResponse | false>;
  approvePendingBalanceRequest: (riderId: string) => Promise<SettlementResponse | false>;
}

// Define the SettlementService
const SettlementService: SettlementServiceType = {
  getPendingBalanceRequests: async (payload: SettlementFilters): Promise<SettlementListResponse | false> => {
    try {
      const response = await api.post<ApiResponse<SettlementListResponse>>(
        API_ENDPOINTS.SETTLEMENT.GET_PENDING_BALANCE_REQUESTS,
        payload
      );
      const result = response.data;
      if (result.status === 200 && result.data) {
        return result.data;
      } else {
        toastHelper.showTost(result.message || 'Failed to fetch pending balance requests', 'warning');
        return false;
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || 'Something went wrong';
      toastHelper.error(errorMessage);
      return false;
    }
  },

  approvePendingBalanceRequest: async (riderId: string): Promise<SettlementResponse | false> => {
    try {
      const response = await api.post<ApiResponse<SettlementResponse>>(
        API_ENDPOINTS.SETTLEMENT.APPROVE_PENDING_BALANCE_REQUEST,
        { riderId }
      );
      const result = response.data;
      if (result.status === 200 && result.data) {
        return result.data;
      } else {
        toastHelper.showTost(result.message || 'Failed to approve balance request', 'warning');
        return false;
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || 'Something went wrong';
      toastHelper.error(errorMessage);
      return false;
    }
  },
};

export default SettlementService;
