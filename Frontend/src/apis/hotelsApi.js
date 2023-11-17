import { axiosInstance as axios } from "./axios";

const hotelsApi = {
  createHotel: (hotel) => {
    const url = "/hotels/create";
    return axios.post(url, hotel);
  },
  updateHotel: (hotel) => {
    const url = "/hotels/update";
    return axios.put(url, hotel);
  },
  getAllhotel: () => {
    const url = "/hotels/list";
    return axios.get(url);
  },
  getHotelDetail: (hotelID) => {
    const url = `/hotels/detail?hotelId=${hotelID}`;
    return axios.get(url);
  },
};

export default hotelsApi;
