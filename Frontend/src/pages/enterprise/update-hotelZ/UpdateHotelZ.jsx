import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import LocationSelect from "../../admin/tours/add-tour/LocationSelect";
import { getZHotelDetail, updateZHotel } from "../../../slices/zhotelSlice";
import { useParams } from "react-router-dom";

const UpdateHotelZ = () => {
  const dispatch = useDispatch();
  const { zhotel } = useSelector((state) => state.hotelz);
  const { id } = useParams();
  useEffect(() => {
    dispatch(getZHotelDetail(id)).unwrap();
  }, []);
  console.log(zhotel);
  const [formData, setFormData] = useState({
    eHotelName: "",
    description: "",
    phoneNumber: "",
    numberOfStarRating: "",
    moreLocation: "",
  });
  const [selectedLocation, setSelectedLocation] = useState({
    province: "",
    district: "",
    commune: "",
  });

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Tạo đối tượng FormData
    const formDataObject = new FormData();
    // Thêm các trường dữ liệu vào formDataObject
    formDataObject.append("eHotelId", zhotel?.eHotelId);
    formDataObject.append(
      "eHotelName",
      formData.eHotelName || zhotel?.eHotelName
    );
    formDataObject.append(
      "description",
      formData.description || zhotel?.description
    );
    formDataObject.append(
      "phoneNumber",
      formData.phoneNumber || zhotel?.phoneNumber
    );
    formDataObject.append(
      "numberOfStarRating",
      formData.numberOfStarRating || zhotel?.numberOfStarRating
    );
    // Thêm địa chỉ
    formDataObject.append(
      "address[province]",
      selectedLocation.province || zhotel?.address?.province
    );
    formDataObject.append(
      "address[district]",
      selectedLocation.district || zhotel?.address?.district
    );
    formDataObject.append(
      "address[commune]",
      selectedLocation.commune || zhotel?.address?.commune
    );
    formDataObject.append(
      "address[moreLocation]",
      formData.moreLocation || zhotel?.address?.moreLocation
    );
    // Gửi formDataObject lên API hoặc xử lý dữ liệu tại đây
    for (const [name, value] of formDataObject.entries()) {
      console.log(name, ":", value);
    }
    try {
      const res = await dispatch(updateZHotel(formDataObject)).unwrap();
      console.log(res);
      if (res.data.status === "ok") {
        notify(1);
        window.location.reload();
      }
    } catch (err) {
      notify(2);
    }
  };
  const notify = (prop) => {
    if (prop === 1) {
      toast.success("Thêm khách sạn thành công! 👌", {
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
        <h1>Cập Nhật Khách Sạn</h1>
      </div>
      <div className="row row-1">
        <div className="col-xl-8">
          <div className="card mb-4">
            <div className="d-flex justify-content-between border-bottom-1">
              <div className="card-header border-bottom-none">
                Thông tin khách sạn
              </div>
              <a href="/hotelz">
                <div className="btn btn-danger"> X</div>
              </a>
            </div>
            <div className="card-body">
              <form>
                <div className="row gx-3 mb-3">
                  <div className="col-md-12">
                    <label className="small mb-1">Tên khách sạn</label>
                    <input
                      name="eHotelName"
                      defaultValue={zhotel.eHotelName}
                      className="form-control"
                      type="text"
                      placeholder="Tên khách sạn..."
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row gx-3 mb-3">
                  <label className="small mb-1">Address</label>
                  <LocationSelect
                    english
                    onSelectLocation={handleSelectLocation}
                  />

                  <div className="mt-2">
                    <input
                      defaultValue={zhotel.address?.moreLocation}
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
                      defaultValue={zhotel.description}
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
                      defaultValue={zhotel.numberOfStarRating}
                      name="numberOfStarRating"
                      className="form-control"
                      onChange={handleChange}
                      placeholder="Vd: 5"
                    />
                    <label className="small mb-1 mt-2">Số điện thoại</label>
                    <input
                      defaultValue={zhotel.phoneNumber}
                      name="phoneNumber"
                      className="form-control"
                      onChange={handleChange}
                      placeholder="Vd: 0999999999"
                    />
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleSubmit}
                >
                  Cập Nhật
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

export default UpdateHotelZ;
