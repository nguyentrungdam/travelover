import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import LocationSelect from "../../../admin/tours/add-tour/LocationSelect";
import { createZVehicle } from "../../../../slices/zvehicleSlice";

const AddVehicleZ = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    eVehicleName: "",
    description: "",
    phoneNumber: "",
    numberOfStarRating: "",
    routes: [],
    moreLocation: "",
  });
  const [selectedLocation, setSelectedLocation] = useState({
    province: "",
    district: "",
    commune: "",
  });
  const [selectedProvince, setSelectedProvince] = useState("");
  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
  };
  const handleSelectLocation2 = (location) => {
    setSelectedProvince(location);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSaveProvince = () => {
    if (selectedProvince) {
      setFormData({
        ...formData,
        routes: [...formData.routes, selectedProvince],
      });
    }
    setSelectedProvince("");
  };
  console.log(formData.routes);
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tạo đối tượng FormData
    const formDataObject = new FormData();
    // Thêm các trường dữ liệu vào formDataObject
    formDataObject.append("eVehicleName", formData.eVehicleName);
    formDataObject.append("description", formData.description);
    formDataObject.append("phoneNumber", formData.phoneNumber);
    formDataObject.append("numberOfStarRating", formData.numberOfStarRating);

    formData.routes.forEach((route, index) => {
      formDataObject.append(`route[${index}]`, route);
    });

    // Thêm địa chỉ
    formDataObject.append("address[province]", selectedLocation.province);
    formDataObject.append("address[district]", selectedLocation.district);
    formDataObject.append("address[commune]", selectedLocation.commune);
    formDataObject.append("address[moreLocation]", formData.moreLocation);

    // Gửi formDataObject lên API hoặc xử lý dữ liệu tại đây
    for (const [name, value] of formDataObject.entries()) {
      console.log(name, ":", value);
    }

    setFormData({
      eVehicleName: "",
      description: "",
      phoneNumber: "",
      numberOfStarRating: "",
      moreLocation: "",
      routes: [],
    });

    try {
      const res = await dispatch(createZVehicle(formDataObject)).unwrap();
      console.log(res);
      if (res.data.status === "ok") {
        notify(1);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (err) {
      notify(2);
    }
  };

  const notify = (prop) => {
    if (prop === 1) {
      toast.success("Thêm nhà xe thành công! 👌", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
        pauseOnHover: true,
      });
    } else {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!", {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: true,
        autoClose: 1000,
      });
    }
  };

  return (
    <div className="vh-100">
      <div className="info ">
        <h1>Tạo Tuyến Xe</h1>
      </div>
      <div className="row row-1">
        <div className="col-xl-8">
          <div className="card mb-4">
            <div className="d-flex justify-content-between border-bottom-1">
              <div className="card-header border-bottom-none">
                Thông tin nhà xe
              </div>
              <a href="/vehiclez">
                <div className="btn btn-danger"> X</div>
              </a>
            </div>
            <div className="card-body">
              <form>
                <div className="row gx-3 mb-3">
                  <div className="col-md-12">
                    <label className="small mb-1">Tên nhà xe</label>
                    <input
                      name="eVehicleName"
                      className="form-control"
                      type="text"
                      placeholder="Tên tuyến xe..."
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row gx-3 mb-3">
                  <label className="small mb-1">Địa chỉ</label>
                  <LocationSelect
                    english
                    onSelectLocation={handleSelectLocation}
                  />
                  <div className="mt-2">
                    <input
                      name="moreLocation"
                      className="form-control"
                      type="text"
                      placeholder="Số nhà, tên đường,..."
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row gx-3 mb-3">
                  <div className="col-md-8">
                    <label className="small mb-1">Mô tả</label>
                    <textarea
                      name="description"
                      className="form-control"
                      onChange={handleChange}
                      placeholder="Mô tả..."
                      rows="4"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="small mb-1">Số sao</label>
                    <input
                      name="numberOfStarRating"
                      className="form-control"
                      onChange={handleChange}
                      placeholder="Vd: 5"
                    />
                    <label className="small mb-1 mt-2">Số điện thoại</label>
                    <input
                      name="phoneNumber"
                      className="form-control"
                      onChange={handleChange}
                      placeholder="Vd: 0999999999"
                    />
                  </div>
                </div>
                <div className="row gx-3 mb-3  ">
                  <div className="col-md-12">
                    <label className="small mb-1">Tuyến đường</label>
                    <div className="d-flex align-items-center col-md-12">
                      <LocationSelect
                        onSelectLocation2={handleSelectLocation2}
                        pickProvince
                        searchProvince2
                      />
                      <div
                        className="btn btn-primary ms-2"
                        onClick={handleSaveProvince}
                      >
                        Xác nhận
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row gx-3 mb-5">
                  <div className="col-md-12">
                    <label className="small mb-1">Danh sách tỉnh</label>
                    <div className="form-control h-100">
                      {formData.routes.join(", ")}
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleSubmit}
                >
                  Tạo Nhà Xe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddVehicleZ;
