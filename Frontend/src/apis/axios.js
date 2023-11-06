import axios from "axios";

const api = "http://localhost:8080/api/v1";

const axiosInstance = axios.create({
  baseURL: api,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": true,
  },
  credentials: "include",
});
const axiosMultipart = axios.create({
  baseURL: api,
  headers: {
    "Content-Type": "multipart/form-data",
    "Access-Control-Allow-Credentials": true,
  },
  credentials: "include",
});

axiosInstance.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (`token: ${token}`) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  function error() {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    const status = error.response ? error.response.status : 500;
    if (status && status === 500) {
      localStorage.clear();
    }
    return Promise.reject(error);
  }
);
axiosMultipart.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (`token: ${token}`) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  function error() {
    return Promise.reject(error);
  }
);

axiosMultipart.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    const status = error.response ? error.response.status : 500;
    if (status && status === 500) {
      localStorage.clear();
    }
    return Promise.reject(error);
  }
);
export { axiosInstance, axiosMultipart };
