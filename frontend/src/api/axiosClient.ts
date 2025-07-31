// src/api/axiosClient.ts
import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";
import { authTokenManager } from "@/utils/authTokenManager";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // <-- use VITE_API_URL here
  withCredentials: true, // Send cookies (for refresh token)
});

// Inject access token on every request
axiosClient.interceptors.request.use((config) => {
  const token = authTokenManager.get();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Token refresh logic
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError & { config?: AxiosRequestConfig & { _retry?: boolean } }) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken: string) => {
            if (originalRequest.headers)
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(axiosClient(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const { data } = await axiosClient.post("/auth/refresh");
        const newToken = data.token;

        authTokenManager.set(newToken);
        onRefreshed(newToken);

        if (originalRequest.headers)
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        authTokenManager.clear();
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
