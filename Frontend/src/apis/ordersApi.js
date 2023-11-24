import { axiosInstance as axios } from "./axios";

const ordersApi = {
  orderTour: (tour) => {
    const url = "/orders/create";
    return axios.post(url, tour);
  },
  getAllOrders: () => {
    const url = "/orders/list";
    return axios.get(url);
  },
  updateOrder: (tour) => {
    const url = "/orders/status/update";
    return axios.put(url, tour);
  },
};

export default ordersApi;
