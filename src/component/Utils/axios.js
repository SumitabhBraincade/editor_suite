import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: "https://console.braincade.in/backend", // Your API base URL
});

axiosInstance.interceptors.request.use(
  (config) => {
    const userToken = "669bfaec208d1f9cfe35bb7f";
    if (userToken) {
      config.headers["Authorization"] = `Bearer ${userToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;