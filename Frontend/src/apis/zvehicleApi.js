import { axiosInstance as axios } from "./axios";

const zvehicleApi = {
  getAllVehiclez: () => {
    const url = "/evehicles/list";
    return axios.get(url);
  },
  createZVehicle: (vehicle) => {
    const url = "/evehicles/create";
    return axios.post(url, vehicle);
  },
  getZVehicleDetail: (eVehicleId) => {
    const url = `/evehicles/detail?eVehicleId=${eVehicleId}`;
    return axios.get(url);
  },
  updateZVehicle: (vehicle) => {
    const url = "/evehicles/update";
    return axios.put(url, vehicle);
  },
};

export default zvehicleApi;
