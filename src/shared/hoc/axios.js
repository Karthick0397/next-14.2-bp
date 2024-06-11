import axios from "axios";
import { BEARER_TOKEN } from "shared/HigherOrderComponent/AuthHoc/authConfig";

const request = axios.create({
  // Your axios configuration
});
request.defaults.timeout = 10000;

// Add a request interceptor
request.interceptors.request.use(
  async (config) => {
    // Add the following lines to set CORS headers
    // config.headers["Access-Control-Allow-Origin"] = "*";
    // config.headers["Access-Control-Allow-Methods"] =
    //   "GET, POST, OPTIONS, PUT, PATCH, DELETE";
    // config.headers["Access-Control-Allow-Headers"] =
    //   "Origin, X-Requested-With, Content-Type, Accept, Authorization";

    // Your other interceptor logic
    // ...
    // If token is present, set it in the request headers
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const resetHeaders = () => {
  request.defaults.withCredentials = false;
  delete request.defaults.headers.common["Authorization"];
};

export const setHeaders = (token) => {
  request.defaults.withCredentials = false;
  request.defaults.headers.common["Authorization"] = BEARER_TOKEN(token);
};

export const registerApi = axios.create({
  // Your registerApi axios configuration
});
registerApi.defaults.withCredentials = false;

export default request;
