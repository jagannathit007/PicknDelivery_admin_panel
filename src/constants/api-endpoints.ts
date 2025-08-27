const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
const USER_ROUTE = import.meta.env.VITE_USER_ROUTE || 'user';
const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE || 'admin';

// const API_BASE_URL = `${BASE_URL}/api/${USER_ROUTE}`;
const ADMIN_API_BASE_URL = `${BASE_URL}/api/${ADMIN_ROUTE}`;

interface APIEndpoints {
  AUTH: {
    LOGIN: string;
    GET_ALL_USERS: string;
    UPDATE_USER: string;
    DELETE_USER: string;
  };
  RIDERS: {
    GET_ALL_RIDERS: string;
    CREATE_RIDER: string;
    GET_RIDER: string;
    DELETE_RIDER: string;
  };
  VEHICLE_TYPES: {
    GET_ALL_VEHICLE_TYPES: string;
  };
}

const API_ENDPOINTS: APIEndpoints = {
  AUTH: {
    LOGIN: `${ADMIN_API_BASE_URL}/login`,

    GET_ALL_USERS: `${ADMIN_API_BASE_URL}/get-customers`,
    UPDATE_USER: `${ADMIN_API_BASE_URL}/save-customer`,
    DELETE_USER: `${ADMIN_API_BASE_URL}/delete-customer`,
  },
  RIDERS: {
    GET_ALL_RIDERS: `${ADMIN_API_BASE_URL}/get-riders`,
    CREATE_RIDER: `${ADMIN_API_BASE_URL}/create-rider`,
    GET_RIDER: `${ADMIN_API_BASE_URL}/get-rider`,
    DELETE_RIDER: `${ADMIN_API_BASE_URL}/delete-rider`,
  },
  VEHICLE_TYPES: {
    GET_ALL_VEHICLE_TYPES: `${ADMIN_API_BASE_URL}/get-vehicle-types`,
  },
};

export default API_ENDPOINTS;
