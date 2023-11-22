import { axiosInstance as axios } from "./axios";

const toursApi = {
  createTour: (tour) => {
    const url = "/tours/create";
    return axios.post(url, tour);
  },
  updateTour: (tour) => {
    const url = "/tours/update";
    return axios.put(url, tour);
  },
  getAllTours: () => {
    const url = "/tours/list";
    return axios.get(url);
  },
  getTourDetail: (tourID) => {
    const url = `/tours/detail?tourId=${tourID}`;
    return axios.get(url);
  },
  searchTour: (tour) => {
    const url = `/tours/search?keyword=${tour.keyword}&province=${tour.province}&startDate=${tour.startDate}&numberOfDay=${tour.numberOfDay}&numberOfPeople=${tour.numberOfPeople}&pageSize=${tour.pageSize}&pageNumber=${tour.pageNumber}`;
    return axios.get(url);
  },
};

export default toursApi;
