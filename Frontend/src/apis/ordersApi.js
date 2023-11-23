import { axiosInstance as axios } from "./axios";

const ordersApi = {
  orderTour: (tour) => {
    const url = "/orders/create";
    return axios.post(url, tour);
  },
};

export default ordersApi;
