import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: "https://console.braincade.in/backend",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const userToken = Cookies.get("access_token");
    console.log(userToken);
    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
