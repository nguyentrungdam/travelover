import { axiosInstance as axios, axiosMultipart } from "./axios";

const accountApi = {
  signin: (user) => {
    const url = "/accounts/login";
    return axios.post(url, user);
  },
  signup: (user) => {
    const url = "/accounts/register";
    return axios.post(url, user);
  },
  getAccountProfile: () => {
    const url = "/accounts/profile/detail";
    return axios.get(url);
  },
  updateUserInfo: (user) => {
    const url = "/accounts/profile/update";
    return axiosMultipart.put(url, user);
  },

  sendOtpToEmail: (email) => {
    const url = `/accounts/password/request-reset?email=${email}`;
    return axios.get(url, email);
  },

  updateUserPassword: (user) => {
    const url = "/accounts/password/change";
    return axios.put(url, user);
  },
  updateResetPassword: (user) => {
    const url = "/accounts/password/reset";
    return axios.put(url, user);
  },
};

export default accountApi;
