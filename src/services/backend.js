import axios from "axios";
import { refreshToken as apiRefresh, logout as apiLogout } from "@/api/auth";

export const apiClient = axios.create({
  baseURL: "http://localhost:8080/api", // đổi thành BE URL của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach accessToken vào header trước mỗi request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Refresh token khi accessToken hết hạn (401)
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu token hết hạn và chưa refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Chờ refresh token xong rồi retry
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const data = await apiRefresh();
        const newToken = data.accessToken;

        localStorage.setItem("accessToken", newToken);
        apiClient.defaults.headers.common["Authorization"] = "Bearer " + newToken;

        processQueue(null, newToken);

        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        apiLogout(); // clear storage
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
