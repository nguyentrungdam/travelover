import { axiosInstance as axios } from "./axios";

const toursApi = {
  createTour: (tour) => {
    const url = "/tours/create";
    return axios.post(url, tour);
  },
};

export default toursApi;
