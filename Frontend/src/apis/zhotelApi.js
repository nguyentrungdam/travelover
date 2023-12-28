import { axiosInstance as axios } from "./axios";

const zhotelApi = {
  getAllHotelz: () => {
    const url = "/ehotels/list";
    return axios.get(url);
  },
  createZHotel: (hotel) => {
    const url = "/ehotels/create";
    return axios.post(url, hotel);
  },
  getZHotelDetail: (eHotelId) => {
    const url = `/ehotels/detail?eHotelId=${eHotelId}`;
    return axios.get(url);
  },
  updateZHotel: (hotel) => {
    const url = "/ehotels/update";
    return axios.put(url, hotel);
  },
  getZHotelRoomSearch: (hotel) => {
    const url = `/ehotels/room/search2?startDate=${hotel.startDate}&endDate=${hotel.endDate}&numberOfAdult=${hotel.numberOfAdult}&numberOfChildren=${hotel.numberOfChildren}&numberOfRoom=${hotel.numberOfRoom}&eHotelId=${hotel.eHotelId}`;
    return axios.get(url);
  },
};

export default zhotelApi;
