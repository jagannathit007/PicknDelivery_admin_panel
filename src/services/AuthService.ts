import api from "./Api";
import toastHelper from "../utils/toastHelper";
import API_ENDPOINTS from "../constants/api-endpoints";

// Define the LoginPayload interface
interface LoginPayload {
  email: string;
  password: string;
}

// Define the ChangePasswordPayload interface
interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

// Define the LoginResponse interface
interface LoginResponse {
  status: number;
  message: string;
  data: {
    token: string;
    admin: {
      id: string;
      name: string;
      emailId: string;
    };
  } | null;
}

// Define the ProfileResponse interface
interface ProfileResponse {
  status: number;
  message: string;
  data: {
    id: string;
    name: string;
    emailId: string;
  } | null;
}

// Define the ChangePasswordResponse interface
interface ChangePasswordResponse {
  status: number;
  message: string;
  data: boolean;
}

// Define the AuthServiceType interface
interface AuthServiceType {
  signIn: (payload: LoginPayload) => Promise<LoginResponse | false>;
  logout: () => void;
  isAuthenticated: () => boolean;
  getToken: () => string | null;
  getUser: () => any;
  getProfile: () => Promise<ProfileResponse | false>;
  changePassword: (payload: ChangePasswordPayload) => Promise<boolean>;
}

// AuthService implementation
const AuthService: AuthServiceType = {
  signIn: async (payload: LoginPayload): Promise<LoginResponse | false> => {
    try {
      // Type the response as LoginResponse
      const response = await api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
        emailId: payload.email,
        password: payload.password,
      });
      const result = response.data;
      if (result.status === 200 && result.data) {
        // Store token and user data
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.admin));
        console.log('Login successful, token and user data stored.');
        toastHelper.showTost(result.message || 'Login successful!', 'success');
        return result; // Return the full LoginResponse
      } else {
        toastHelper.showTost(result.message || 'Login failed', 'warning');
        return false;
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toastHelper.error(errorMessage);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/signin';
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getProfile: async (): Promise<ProfileResponse | false> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toastHelper.error('No authentication token found');
        return false;
      }
      // Type the response as ProfileResponse
      const response = await api.post<ProfileResponse>(API_ENDPOINTS.AUTH.PROFILE, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = response.data;
      if (result.status === 200 && result.data) {
        return result;
      } else {
        toastHelper.showTost(result.message || 'Failed to fetch profile', 'warning');
        return false;
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Error fetching profile";
      toastHelper.error(errorMessage);
      return false;
    }
  },

  changePassword: async (payload: ChangePasswordPayload): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toastHelper.error('No authentication token found');
        return false;
      }
      // Type the response as ChangePasswordResponse
      const response = await api.post<ChangePasswordResponse>(
        API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
        {
          oldPassword: payload.oldPassword,
          newPassword: payload.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = response.data;
      if (result.status === 200 && result.data) {
        toastHelper.showTost(result.message || 'Password changed successfully!', 'success');
        return true;
      } else {
        toastHelper.showTost(result.message || 'Failed to change password', 'warning');
        return false;
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Error changing password";
      toastHelper.error(errorMessage);
      return false;
    }
  },
};

export default AuthService;
export type { LoginPayload, ChangePasswordPayload, LoginResponse, ProfileResponse };