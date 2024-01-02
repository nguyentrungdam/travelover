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
  getAllOrderz: (eHotelId) => {
    const url = `/ehotels/order/list?eHotelId=${eHotelId}`;
    return axios.get(url);
  },
  getZOrderDetail: (orderInfo) => {
    const url = `/ehotels/order/detail?eHotelId=${orderInfo.eHotelId}&orderId=${orderInfo.orderId}`;
    return axios.get(url);
  },
  updateZOrder: (hotel) => {
    const url = "/ehotels/order/status/update";
    return axios.put(url, hotel);
  },
};

export default zhotelApi;
