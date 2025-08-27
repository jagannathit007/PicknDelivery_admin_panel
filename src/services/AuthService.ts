
import api from "./Api";
import toastHelper from "../utils/toastHelper";
import API_ENDPOINTS from "../constants/api-endpoints";

interface LoginPayload {
  email: string;
  password: string;
}

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

interface AuthServiceType {
  signIn: (payload: LoginPayload) => Promise<LoginResponse | false>;
  logout: () => void;
  isAuthenticated: () => boolean;
  getToken: () => string | null;
  getUser: () => any;
}

const AuthService: AuthServiceType = {
  signIn: async (payload: LoginPayload): Promise<LoginResponse | false> => {
    try {
      const response = await api.post(
        `${API_ENDPOINTS.AUTH.LOGIN}`,
        {
          emailId: payload.email,
          password: payload.password
        }
      );
      const result = response.data;
      console.log(result);
      if (result.status === 200 && result.data) {
        // Store token and user data
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.admin));
        toastHelper.showTost(result.message || 'Login successful!', 'success');
        return result;
      } else {
        toastHelper.showTost(result.message || 'Login failed', 'warning');
        return result.data;
      }
    } catch (error: any) {
      console.log(error);
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
};

export default AuthService;
