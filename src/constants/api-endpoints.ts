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
  VEHICLE:{
    CREATE_VEHICLE: string;
    GET_VEHICLES: string;
    GET_VEHICLE: string;
    UPDATE_VEHICLE: string;
    DELETE_VEHICLE: string;
  };
  VEHICLE_TYPES: {
    GET_ALL_VEHICLE_TYPES: string;
  };
  ORDERS: {
    GET_ORDERS: string;
    ASSIGN_ORDER: string;
    CANCEL_ORDER: string;
  };
  TRANSACTIONS: {
    GET_ALL_TRANSACTIONS: string;
    GET_TRANSACTION: string;
  };
}

const API_ENDPOINTS: APIEndpoints = {
  AUTH: {
    LOGIN: `${ADMIN_API_BASE_URL}/login`,

    GET_ALL_USERS: `${ADMIN_API_BASE_URL}/get-customers`,
    UPDATE_USER: `${ADMIN_API_BASE_URL}/save-customer`,
    DELETE_USER: `${ADMIN_API_BASE_URL}/delete-customer`,
  },
  VEHICLE: {
    CREATE_VEHICLE: `${ADMIN_API_BASE_URL}/create-vehicle-type`,
    GET_VEHICLES: `${ADMIN_API_BASE_URL}/get-vehicle-types`,
    GET_VEHICLE: `${ADMIN_API_BASE_URL}/get-vehicle-type`,
    UPDATE_VEHICLE: `${ADMIN_API_BASE_URL}/update-vehicle-type`,
    DELETE_VEHICLE: `${ADMIN_API_BASE_URL}/delete-vehicle-type`,
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
  ORDERS: {
    GET_ORDERS: `${ADMIN_API_BASE_URL}/get-orders`,
    ASSIGN_ORDER: `${ADMIN_API_BASE_URL}/assign-order`,
    CANCEL_ORDER: `${ADMIN_API_BASE_URL}/cancel-order`,
  },
  TRANSACTIONS: {
    GET_ALL_TRANSACTIONS: `${ADMIN_API_BASE_URL}/get-transactions`,
    GET_TRANSACTION: `${ADMIN_API_BASE_URL}/get-transaction`,
  },
};

export default API_ENDPOINTS;
