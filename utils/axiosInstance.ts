import axios from "axios";
import Cookies from "js-cookie";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  // baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor (Attach token + log success/error)
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("authAccess");
      console.log(token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    console.log(
      `[Axios Request] ${config.method?.toUpperCase()} ${config.url}`,
      config
    );
    return config;
  },
  (error) => {
    console.error("[Axios Request Error]", error);
    return Promise.reject(error);
  }
);

// Response Interceptor (Handle errors + log success/error)
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(
      `[Axios Response Success] ${response.config.method?.toUpperCase()} ${response.config.url}`,
      response.data
    );
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401) {
      console.warn("[Axios Response 401] Unauthorized. Removing token...");
      Cookies.remove("authAccess");

      // Handle refresh token logic here if needed
      return Promise.reject(error?.response?.data);
    }

    if (error?.response) {
      console.log(
        `[Axios Response Error] ${originalRequest.method?.toUpperCase()} ${originalRequest.url}`,
        error.response.data
      );
    } else if (error?.request) {
      console.error(
        "[Axios Network Error] No response received",
        error.request
      );
      Cookies.remove("authAccess");
    } else {
      console.error("[Axios General Error]", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
