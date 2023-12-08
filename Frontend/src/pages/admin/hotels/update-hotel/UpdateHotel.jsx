import React, { useEffect, useState } from "react";
import "../../tours/add-tour/AddTours.css";
import { useDispatch, useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import LocationSelect from "../../tours/add-tour/LocationSelect";
import { getHotelDetail, updateHotel } from "../../../../slices/hotelSlice";
import { useParams } from "react-router-dom";

const UpdateHotel = () => {
  const { loading, hotel } = useSelector((state) => state.hotel);
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getHotelDetail(id)).unwrap();
  }, []);
  console.log(hotel);
  const [formData, setFormData] = useState({
    hotelName: "",
    hotelDescription: "",
    phoneNumber: "",
    email: "",
    moreLocation: "",
    eHotelId: "",
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
    formDataObject.append("eHotelId", hotel?.eHotelId);
    formDataObject.append("hotelId", id);
    formDataObject.append("hotelName", formData.hotelName || hotel?.hotelName);
    formDataObject.append(
      "hotelDescription",
      formData.hotelDescription || hotel?.hotelDescription
    );
    formDataObject.append(
      "contact[phoneNumber]",
      formData.phoneNumber || hotel?.contact?.phoneNumber
    );
    formDataObject.append(
      "contact[email]",
      formData.email || hotel?.contact?.email
    );

    // Thêm địa chỉ
    formDataObject.append(
      "address[province]",
      selectedLocation.province || hotel?.address?.province
    );
    formDataObject.append(
      "address[district]",
      selectedLocation.district || hotel?.address?.district
    );
    formDataObject.append(
      "address[commune]",
      selectedLocation.commune || hotel?.address?.commune
    );
    formDataObject.append(
      "address[moreLocation]",
      formData.moreLocation || hotel?.address?.moreLocation
    );

    // Gửi formDataObject lên API hoặc xử lý dữ liệu tại đây
    for (const [name, value] of formDataObject.entries()) {
      console.log(name, ":", value);
    }
    try {
      const res = await dispatch(updateHotel(formDataObject)).unwrap();
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
      toast.success("Thêm tour thành công ! 👌", {
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
    <>
      <div className="info">
        <h1>Create New Hotel</h1>
        <a href="/hotels">Back</a>
      </div>
      <div className="row row-1">
        <div className="col-xl-8">
          <div className="card mb-4">
            <div className="card-header">Hotel Infomation</div>
            <div className="card-body">
              <form>
                <div className="row gx-3 mb-3">
                  <div className="col-md-8">
                    <label className="small mb-1">Hotel name</label>
                    <input
                      name="hotelName"
                      defaultValue={hotel?.hotelName}
                      className="form-control"
                      type="text"
                      placeholder="Name of the hotel?..."
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="small mb-1">eID</label>
                    <input
                      defaultValue={hotel?.eHotelId}
                      name="eHotelId"
                      className="form-control"
                      type="text"
                      placeholder="Ex:2131424..."
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
                      defaultValue={hotel?.address?.moreLocation}
                      name="moreLocation"
                      className="form-control"
                      type="text"
                      placeholder="Enter house number, street name,..."
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row gx-3 mb-3">
                  <div className="col-md-8">
                    <label className="small mb-1">Description</label>
                    <textarea
                      defaultValue={hotel?.hotelDescription}
                      name="hotelDescription"
                      className="form-control"
                      onChange={handleChange}
                      placeholder="Enter description"
                      rows="3"
                    />
                  </div>
                </div>
                <div className="row gx-3 mb-3">
                  <div className="col-md-4">
                    <label className="small mb-1">Email</label>
                    <input
                      defaultValue={hotel?.contact?.email}
                      name="email"
                      className="form-control"
                      type="text"
                      placeholder="Enter email"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="small mb-1">Phone number</label>
                    <input
                      defaultValue={hotel?.contact?.phoneNumber}
                      name="phoneNumber"
                      className="form-control"
                      type="text"
                      placeholder="Enter phone number"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleSubmit}
                >
                  Update Hotel
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default UpdateHotel;
