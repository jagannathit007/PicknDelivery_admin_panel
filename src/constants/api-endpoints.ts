const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
// const USER_ROUTE = import.meta.env.VITE_USER_ROUTE || 'user';
const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE || 'admin';

const ADMIN_API_BASE_URL = `${BASE_URL}/api/${ADMIN_ROUTE}`;

interface APIEndpoints {
  AUTH: {
    LOGIN: string;
    PROFILE: string;
    CHANGE_PASSWORD: string;
    GET_ALL_USERS: string;
    UPDATE_USER: string;
    DELETE_USER: string;
  };
  DASHBOARD: {
    GET_DASHBOARD_DATA: string;
  };
  RIDERS: {
    GET_ALL_RIDERS: string;
    CREATE_RIDER: string;
    GET_RIDER: string;
    DELETE_RIDER: string;
  };
  VEHICLE: {
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
  COUPON: {
    GET_ALL_COUPONS: string;
    SAVE_COUPON: string;
    DELETE_COUPON: string;
  };
  MESSAGE_TEMPLATES: {
    GET_ALL_TEMPLATES: string;
    SAVE_TEMPLATE: string;
    DELETE_TEMPLATE: string;
  };
  FARES: {
    CREATE_FARE: string;
    GET_FARES: string;
    GET_FARE: string;
    UPDATE_FARE: string;
    DELETE_FARE: string;
  };
  CATEGORY: {
    CREATE_CATEGORY: string;
    GET_ALL_CATEGORIES: string;
    GET_CATEGORY: string;
    UPDATE_CATEGORY: string;
    DELETE_CATEGORY: string;
  };
}

const API_ENDPOINTS: APIEndpoints = {
  AUTH: {
    LOGIN: `${ADMIN_API_BASE_URL}/login`,
    PROFILE: `${ADMIN_API_BASE_URL}/profile`,
    CHANGE_PASSWORD: `${ADMIN_API_BASE_URL}/change-password`,
    GET_ALL_USERS: `${ADMIN_API_BASE_URL}/get-customers`,
    UPDATE_USER: `${ADMIN_API_BASE_URL}/save-customer`,
    DELETE_USER: `${ADMIN_API_BASE_URL}/delete-customer`,
  },
  DASHBOARD: {
    GET_DASHBOARD_DATA: `${ADMIN_API_BASE_URL}/get-dashboard-data`,
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
  COUPON: {
    GET_ALL_COUPONS: `${ADMIN_API_BASE_URL}/get-coupons`,
    SAVE_COUPON: `${ADMIN_API_BASE_URL}/save-coupon`,
    DELETE_COUPON: `${ADMIN_API_BASE_URL}/delete-coupon`
  },
  MESSAGE_TEMPLATES: {
    GET_ALL_TEMPLATES: `${ADMIN_API_BASE_URL}/get-message-templates`,
    SAVE_TEMPLATE: `${ADMIN_API_BASE_URL}/save-message-template`,
    DELETE_TEMPLATE: `${ADMIN_API_BASE_URL}/delete-message-template`,
  },
  FARES: {
    CREATE_FARE: `${ADMIN_API_BASE_URL}/create-fare`,
    GET_FARES: `${ADMIN_API_BASE_URL}/get-fares`,
    GET_FARE: `${ADMIN_API_BASE_URL}/get-fare`,
    UPDATE_FARE: `${ADMIN_API_BASE_URL}/update-fare`,
    DELETE_FARE: `${ADMIN_API_BASE_URL}/delete-fare`,
  },
  CATEGORY: {
    CREATE_CATEGORY: `${ADMIN_API_BASE_URL}/create-category`,
    GET_ALL_CATEGORIES: `${ADMIN_API_BASE_URL}/get-categories`,
    GET_CATEGORY: `${ADMIN_API_BASE_URL}/get-category`,
    UPDATE_CATEGORY: `${ADMIN_API_BASE_URL}/update-category`,
    DELETE_CATEGORY: `${ADMIN_API_BASE_URL}/delete-category`,
  },
};

export default API_ENDPOINTS;
