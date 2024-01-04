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
  getOrderCheck: (orderId) => {
    const url = `/orders/payment/check?orderId=${orderId}`;
    return axios.get(url);
  },
  getOrderDetail: (orderId) => {
    const url = `/orders/detail?orderId=${orderId}`;
    return axios.get(url);
  },
  searchOrderAdmin: (order) => {
    const url = `/orders/list/search?keyword=${order.keyword}&fullName=${order.fullName}&finalPrice=${order.finalPrice}&createdAt2=${order.createdAt2}&orderStatus=${order.orderStatus}&sortBy=${order.sortBy}&order=${order.order}`;
    return axios.get(url);
  },
  getTurnover: (year) => {
    const url = `/statistics/turnover?year=${year}`;
    return axios.get(url);
  },
  getProfit: (year) => {
    const url = `/statistics/profit?year=${year}`;
    return axios.get(url);
  },
};

export default ordersApi;
