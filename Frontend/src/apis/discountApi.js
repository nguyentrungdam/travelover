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

  searchDiscountAdmin: (discount) => {
    const url = `/discounts/list/search?keyword=${discount.keyword}&minOrder=${discount.minOrder}&createdAt2=${discount.createdAt2}&discountValue=${discount.discountValue}&sortBy=${discount.sortBy}&order=${discount.order}`;
    return axios.get(url);
  },
};

export default discountsApi;
