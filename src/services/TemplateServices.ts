import api from './Api';
import toastHelper from '../utils/toastHelper';
import API_ENDPOINTS from '../constants/api-endpoints';

// Define the structure of the API response
interface ApiResponse<T> {
  data: T;
}

// Define the MessageTemplate interface
export interface MessageTemplate {
  _id?: string;
  name: string;
  message: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Define the MessageTemplateListResponse interface
interface MessageTemplateListResponse {
  status: number;
  message: string;
  data: {
    docs: MessageTemplate[];
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Define the MessageTemplateResponse interface
interface MessageTemplateResponse {
  status: number;
  message: string;
  data: MessageTemplate | boolean | null;
}

// Define the MessageTemplateListPayload interface
export interface MessageTemplateListPayload {
  search?: string;
  page?: number;
  limit?: number;
}

// Define the MessageTemplatePayload interface
export interface MessageTemplatePayload {
  _id?: string;
  name: string;
  message: string;
  isActive: boolean;
}

// Define the MessageTemplateServiceType interface
interface MessageTemplateServiceType {
  getMessageTemplates: (payload: MessageTemplateListPayload) => Promise<MessageTemplateListResponse | false>;
  saveMessageTemplate: (payload: MessageTemplatePayload) => Promise<MessageTemplateResponse | false>;
  deleteMessageTemplate: (id: string) => Promise<MessageTemplateResponse | false>;
}

// Define the MessageTemplateService
const MessageTemplateService: MessageTemplateServiceType = {
  getMessageTemplates: async (payload: MessageTemplateListPayload): Promise<MessageTemplateListResponse | false> => {
    try {
      const response = await api.post<ApiResponse<MessageTemplateListResponse>>(
        API_ENDPOINTS.MESSAGE_TEMPLATES.GET_ALL_TEMPLATES,
        payload
      );
      const result = response.data;
      if (result.data.status === 200) {
        return result.data;
      } else {
        toastHelper.showTost(result.data.message || 'Failed to fetch message templates', 'warning');
        return false;
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || 'Something went wrong';
      toastHelper.error(errorMessage);
      return false;
    }
  },

  saveMessageTemplate: async (payload: MessageTemplatePayload): Promise<MessageTemplateResponse | false> => {
    try {
      console.log('Saving template with payload:', payload);
      const response = await api.post<ApiResponse<MessageTemplateResponse>>(
        API_ENDPOINTS.MESSAGE_TEMPLATES.SAVE_TEMPLATE,
        payload
      );
      const result = response.data;
      console.log('Backend response:', result);
      if (result.data.status === 200 && result.data.data) {
        toastHelper.showTost(result.data.message || 'Message template saved successfully!', 'success');
        return result.data;
      } else {
        toastHelper.showTost(result.data.message || 'Failed to save message template', 'warning');
        return false;
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || 'Something went wrong';
      toastHelper.error(errorMessage);
      return false;
    }
  },

  deleteMessageTemplate: async (id: string): Promise<MessageTemplateResponse | false> => {
    try {
      const response = await api.post<ApiResponse<MessageTemplateResponse>>(
        API_ENDPOINTS.MESSAGE_TEMPLATES.DELETE_TEMPLATE,
        { _id: id }
      );
      const result = response.data;
      if (result.data.status === 200 && result.data.data) {
        toastHelper.showTost(result.data.message || 'Message template deleted successfully!', 'success');
        return result.data;
      } else {
        toastHelper.showTost(result.data.message || 'Failed to delete message template', 'warning');
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

export default MessageTemplateService;
// export type { MessageTemplateListPayload, MessageTemplatePayload };