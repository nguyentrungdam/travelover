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

  // isUserLoggedIn: () => {
  //   const url = "/accounts/isUserLoggedIn";
  //   return axios.post(url);
  // },
  // sendOtpToEmail: (user) => {
  //   const url = "/accounts/sendOtpToEmail";
  //   return axios.post(url, user);
  // },
  // verifyOtp: (user) => {
  //   const url = "/accounts/verifyOtp";
  //   return axios.post(url, user);
  // },
  // updateUserInfo: (user) => {
  //   const url = "/user/updateUserInfo";
  //   return axios.post(url, user);
  // },
};

export default accountApi;
