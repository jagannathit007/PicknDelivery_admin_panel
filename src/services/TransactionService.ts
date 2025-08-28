import api from './Api';
import toastHelper from '../utils/toastHelper';
import API_ENDPOINTS from '../constants/api-endpoints';

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

export interface TransactionPayload {
  userId: string;
  userType: 'customer' | 'admin' | 'rider';
  orderId?: string;
  amount: number;
  transactionType: 'credit' | 'debit';
  extraFields?: any;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  rider?: string;
  userType?: string;
  transactionType?: string;
  startDate?: string;
  endDate?: string;
}

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

interface TransactionResponse {
  status: number;
  message: string;
  data: Transaction | boolean;
}

interface TransactionServiceType {
  getTransactions: (payload: TransactionFilters) => Promise<TransactionListResponse | false>;
  getTransactionById: (id: string) => Promise<TransactionResponse | false>;
}

const TransactionService: TransactionServiceType = {
  getTransactions: async (payload: TransactionFilters): Promise<TransactionListResponse | false> => {
    try {
      const response = await api.post(
        API_ENDPOINTS.TRANSACTIONS.GET_ALL_TRANSACTIONS,
        payload
      );
      const result = response.data;
      if (result.status === 200) {
        return result;
      } else {
        toastHelper.showTost(result.message || 'Failed to fetch transactions', 'warning');
        return false;
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },

  getTransactionById: async (id: string): Promise<TransactionResponse | false> => {
    try {
      const response = await api.post(
        API_ENDPOINTS.TRANSACTIONS.GET_TRANSACTION,
        { _id: id }
      );
      const result = response.data;
      if (result.status === 200) {
        return result;
      } else {
        toastHelper.showTost(result.message || 'Failed to fetch transaction', 'warning');
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

export default TransactionService;
