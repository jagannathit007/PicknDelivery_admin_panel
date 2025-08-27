const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
const USER_ROUTE = import.meta.env.VITE_USER_ROUTE || 'user';
const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE || 'admin';

// const API_BASE_URL = `${BASE_URL}/api/${USER_ROUTE}`;
const ADMIN_API_BASE_URL = `${BASE_URL}/api/${ADMIN_ROUTE}`;

interface APIEndpoints {
  AUTH: {
    LOGIN: string;
  };
}

const API_ENDPOINTS: APIEndpoints = {
  AUTH: {
    LOGIN: `${ADMIN_API_BASE_URL}/login`,
  },
};

export default API_ENDPOINTS;
