import { axiosInstance as axios } from "./axios";

const commissionsApi = {
  createCommission: (commission) => {
    const url = "/commissions/create";
    return axios.post(url, commission);
  },
  updateCommission: (commission) => {
    const url = "/commissions/update";
    return axios.put(url, commission);
  },
  getCommissionDetail: (commissionId) => {
    const url = `/commissions/detail?commissionId=${commissionId}`;
    return axios.get(url);
  },
  getCommissionEnable: (commissionId) => {
    const url = `/commissions/enable?commissionId=${commissionId}`;
    return axios.get(url);
  },
  getAllCommissions: () => {
    const url = "/commissions/list";
    return axios.get(url);
  },
};

export default commissionsApi;
