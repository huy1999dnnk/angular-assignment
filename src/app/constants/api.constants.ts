export const API_CONSTANTS = {
  BASE_URL: 'https://dummyjson.com',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REFRESH: '/auth/refresh',
      ME: '/auth/me'
    },
    PRODUCTS: '/products'
  }
} as const;
