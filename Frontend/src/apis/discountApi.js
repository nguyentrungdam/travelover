import { axiosInstance as axios } from "./axios";

const discountsApi = {
  createDiscount: (discount) => {
    const url = "/discounts/create";
    return axios.post(url, discount);
  },
  updateDiscount: (discount) => {
    const url = "/discounts/update";
    return axios.put(url, discount);
  },
  getDiscountDetail: (discountId) => {
    const url = `/discounts/detail?discountId=${discountId}`;
    return axios.get(url);
  },
  getCheckDiscount: (discountCode, totalPrice) => {
    const url = `/discounts/actual-discount-value?discountCode=${discountCode}&totalPrice=${totalPrice}`;
    return axios.get(url);
  },
  getAllDiscounts: () => {
    const url = "/discounts/list";
    return axios.get(url);
  },
};

export default discountsApi;
