import api from './Api';
import toastHelper from '../utils/toastHelper';
import API_ENDPOINTS from '../constants/api-endpoints';

// Define the structure of the API response
interface ApiResponse<T> {
  data: T;
}

// Define the Transaction interface
export interface Transaction {
  _id?: string;
  userId: string;
  userType: 'customer' | 'admin' | 'rider';
  orderId?: string;
  amount: number;
  transactionType: 'credit' | 'debit';
  extraFields?: any;
  createdAt: string;
  updatedAt: string;
}

// Define the TransactionPayload interface
export interface TransactionPayload {
  userId: string;
  userType: 'customer' | 'admin' | 'rider';
  orderId?: string;
  amount: number;
  transactionType: 'credit' | 'debit';
  extraFields?: any;
}

// Define the TransactionFilters interface
export interface TransactionFilters {
  page?: number;
  limit?: number;
  rider?: string;
  userType?: string;
  transactionType?: string;
  startDate?: string;
  endDate?: string;
}

// Define the TransactionListResponse interface
interface TransactionListResponse {
  status: number;
  message: string;
  data: {
    docs: Transaction[];
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Define the TransactionResponse interface
interface TransactionResponse {
  status: number;
  message: string;
  data: Transaction | boolean;
}

// Define the TransactionServiceType interface
interface TransactionServiceType {
  getTransactions: (payload: TransactionFilters) => Promise<TransactionListResponse | false>;
  getTransactionById: (id: string) => Promise<TransactionResponse | false>;
}

// Define the TransactionService
const TransactionService: TransactionServiceType = {
  getTransactions: async (payload: TransactionFilters): Promise<TransactionListResponse | false> => {
    try {
      // Specify the expected response type for api.post
      const response = await api.post<ApiResponse<TransactionListResponse>>(
        API_ENDPOINTS.TRANSACTIONS.GET_ALL_TRANSACTIONS,
        payload
      );
      const result = response.data; // Type is now ApiResponse<TransactionListResponse>
      if (result.data.status === 200) {
        return result.data; // Return the TransactionListResponse
      } else {
        toastHelper.showTost(result.data.message || 'Failed to fetch transactions', 'warning');
        return false;
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || 'Something went wrong';
      toastHelper.error(errorMessage);
      return false;
    }
  },

  getTransactionById: async (id: string): Promise<TransactionResponse | false> => {
    try {
      // Specify the expected response type for api.post
      const response = await api.post<ApiResponse<TransactionResponse>>(
        API_ENDPOINTS.TRANSACTIONS.GET_TRANSACTION,
        { _id: id }
      );
      const result = response.data; // Type is now ApiResponse<TransactionResponse>
      if (result.data.status === 200) {
        return result.data; // Return the TransactionResponse
      } else {
        toastHelper.showTost(result.data.message || 'Failed to fetch transaction', 'warning');
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

export default TransactionService;