import { axiosInstance as axios } from "./axios";

const zhotelApi = {
  getAllHotelz: () => {
    const url = "/ehotels/list";
    return axios.get(url);
  },
};

export default zhotelApi;
