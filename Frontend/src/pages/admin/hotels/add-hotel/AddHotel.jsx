import React, { useState } from "react";
import "../../tours/add-tour/AddTours.css";
import { useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import LocationSelect from "../../tours/add-tour/LocationSelect";
import { createHotel } from "../../../../slices/hotelSlice";

const AddHotel = () => {
  const dispatch = useDispatch();
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
  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Tạo đối tượng FormData
    const formDataObject = new FormData();

    // Thêm các trường dữ liệu vào formDataObject
    formDataObject.append("eHotelId", formData.eHotelId);
    formDataObject.append("hotelName", formData.hotelName);
    formDataObject.append("hotelDescription", formData.hotelDescription);
    formDataObject.append("contact[phoneNumber]", formData.phoneNumber);
    formDataObject.append("contact[email]", formData.email);

    // Thêm địa chỉ
    formDataObject.append("address[province]", selectedLocation.province);
    formDataObject.append("address[district]", selectedLocation.district);
    formDataObject.append("address[commune]", selectedLocation.commune);
    formDataObject.append("address[moreLocation]", formData.moreLocation);

    // Gửi formDataObject lên API hoặc xử lý dữ liệu tại đây
    for (const [name, value] of formDataObject.entries()) {
      console.log(name, ":", value);
    }
    try {
      const res = await dispatch(createHotel(formDataObject)).unwrap();
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
      toast.success("Add hotel successful  ! 👌", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
        pauseOnHover: true,
      });
    } else {
      toast.error("Unable to add hotel, please try again!", {
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
                      className="form-control"
                      type="text"
                      placeholder="Name of the hotel..."
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="small mb-1">eID</label>
                    <input
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
                  Create Hotel
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

export default AddHotel;
