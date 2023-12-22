import { axiosInstance as axios } from "./axios";

const userApi = {
  getAllUsers: () => {
    const url = "/accounts/list";
    return axios.get(url);
  },
  updateRole: (user) => {
    const url = "/accounts/set-role";
    return axios.put(url, user);
  },
};

export default userApi;
