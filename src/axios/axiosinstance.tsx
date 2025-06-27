import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Base URL for the API
const BASE_URL = "http://localhost:8080/api";

// Retrieve data from sessionStorage
const getAuthToken = () => sessionStorage.getItem("token");
const getTenant = () => sessionStorage.getItem("tenant");

// Remove authentication-related data
const removeAuthData = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("tenant");
  sessionStorage.removeItem("userId");
  sessionStorage.removeItem("userName");
  sessionStorage.removeItem("userRole");
};

// Check if the token is expired
const isTokenExpired = (token: string) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return typeof decoded === 'object' && decoded !== null && 'exp' in decoded
      ? (decoded.exp as number) < currentTime
      : true;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    const tenant = getTenant();

    if (token) {
      if (isTokenExpired(token)) {
        removeAuthData();
        window.location.href = "/auth/signin";
        return Promise.reject(new Error("Token expired"));
      }

      config.headers["Authorization"] = `Bearer ${token}`;
    }

    if (tenant) {
      config.headers["tenant"] = tenant;
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//       console.error("Unauthorized or Forbidden: Redirecting to sign-in.");
//       removeAuthData();
//       window.location.href = "/auth/signin";
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
