import { axiosInstance as axios } from "./axios";

const userApi = {
  getAllUsers: () => {
    const url = "/accounts/list";
    return axios.get(url);
  },
};

export default userApi;
