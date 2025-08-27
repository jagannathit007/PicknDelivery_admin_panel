import API_ENDPOINTS from "../constants/api-endpoints";
import api from "./Api";
const Swal = require('sweetalert2')

// const getAuthHeader = () => {
//   const token = localStorage.getItem("token");
//   return token ? [{ Authorization: `Bearer ${token}` }] : [];
// };

const AuthService = {
  signIn: async (payload) => {
    try {
      const response = await api.post(
        `${API_ENDPOINTS.AUTH.LOGIN}`,
        { ...payload },
        { withCredentials: true }
      );
      const result = response.data;
      if (result.status == 200 && result.data != null && result.data.isVerified && result.data.isActive) {
        return result;
      } else {
        toastHelper.warning(result.message);
        return result;
      }
    } catch (error) {
      console.log(error);
      toastHelper.error("Something went wrong");
      return false;
    }
  },
};

export default AuthService;
