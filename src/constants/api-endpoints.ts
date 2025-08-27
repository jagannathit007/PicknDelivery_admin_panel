const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
const USER_ROUTE = import.meta.env.VITE_USER_ROUTE || 'user';
const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE || 'admin';

// const API_BASE_URL = `${BASE_URL}/api/${USER_ROUTE}`;
const ADMIN_API_BASE_URL = `${BASE_URL}/api/${ADMIN_ROUTE}`;

interface APIEndpoints {
  AUTH: {
    LOGIN: string;
  };
  VEHICLE:{
    CREATE_VEHICLE: string;
    GET_VEHICLES: string;
    GET_VEHICLE: string;
    UPDATE_VEHICLE: string;
    DELETE_VEHICLE: string;
  }
}

const API_ENDPOINTS: APIEndpoints = {
  AUTH: {
    LOGIN: `${ADMIN_API_BASE_URL}/login`,
  },
  VEHICLE: {
    CREATE_VEHICLE: `${ADMIN_API_BASE_URL}/create-vehicle-type`,
    GET_VEHICLES: `${ADMIN_API_BASE_URL}/get-vehicle-types`,
    GET_VEHICLE: `${ADMIN_API_BASE_URL}/get-vehicle-type`,
    UPDATE_VEHICLE: `${ADMIN_API_BASE_URL}/update-vehicle-type`,
    DELETE_VEHICLE: `${ADMIN_API_BASE_URL}/delete-vehicle-type`,
  },
};

export default API_ENDPOINTS;
