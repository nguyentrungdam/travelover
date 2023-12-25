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
  searchUser: (user) => {
    const url = `/accounts/list/search?keyword=${user.keyword}&role=${user.role}&sortBy=${user.sortBy}&order=${user.order}`;
    return axios.get(url, user);
  },
};

export default userApi;
