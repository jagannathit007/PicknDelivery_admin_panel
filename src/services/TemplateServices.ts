import api from "./Api";
import toastHelper from "../utils/toastHelper";
import API_ENDPOINTS from "../constants/api-endpoints";

export interface MessageTemplate {
  _id?: string;
  name: string; 
  message: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

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

interface MessageTemplateResponse {
  status: number;
  message: string;
  data: MessageTemplate | boolean | null;
}

interface MessageTemplateListPayload {
  search?: string;
  page?: number;
  limit?: number;
}

interface MessageTemplatePayload {
  _id?: string;
  name: string; // Changed from title to name
  message: string;
  isActive: boolean;
}

interface MessageTemplateServiceType {
  getMessageTemplates: (payload: MessageTemplateListPayload) => Promise<MessageTemplateListResponse | false>;
  saveMessageTemplate: (payload: MessageTemplatePayload) => Promise<MessageTemplateResponse | false>;
  deleteMessageTemplate: (id: string) => Promise<MessageTemplateResponse | false>;
}

const MessageTemplateService: MessageTemplateServiceType = {
  getMessageTemplates: async (payload: MessageTemplateListPayload): Promise<MessageTemplateListResponse | false> => {
    try {
      const response = await api.post(
        API_ENDPOINTS.MESSAGE_TEMPLATES.GET_ALL_TEMPLATES,
        payload
      );
      const result = response.data;
      if (result.status === 200) {
        return result;
      } else {
        toastHelper.showTost(result.message || 'Failed to fetch message templates', 'warning');
        return false;
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },

  saveMessageTemplate: async (payload: MessageTemplatePayload): Promise<MessageTemplateResponse | false> => {
    try {
      console.log("Saving template with payload:", payload); // Added logging
      const response = await api.post(
        API_ENDPOINTS.MESSAGE_TEMPLATES.SAVE_TEMPLATE,
        payload
      );
      const result = response.data;
      console.log("Backend response:", result); // Added logging
      if (result.status === 200 && result.data) {
        toastHelper.showTost(result.message || 'Message template saved successfully!', 'success');
        return result;
      } else {
        toastHelper.showTost(result.message || 'Failed to save message template', 'warning');
        return false;
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },

  deleteMessageTemplate: async (id: string): Promise<MessageTemplateResponse | false> => {
    try {
      const response = await api.post(
        API_ENDPOINTS.MESSAGE_TEMPLATES.DELETE_TEMPLATE,
        { _id: id }
      );
      const result = response.data;
      if (result.status === 200 && result.data) {
        toastHelper.showTost(result.message || 'Message template deleted successfully!', 'success');
        return result;
      } else {
        toastHelper.showTost(result.message || 'Failed to delete message template', 'warning');
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

export default MessageTemplateService;
export type { MessageTemplateListPayload, MessageTemplatePayload };