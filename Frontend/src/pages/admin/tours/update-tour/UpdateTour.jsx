import React, { useEffect, useState } from "react";
import "./UpdateTours.css";
import LocationSelect from "../add-tour/LocationSelect";
import { useDispatch, useSelector } from "react-redux";
import { getTourDetail, updateTour } from "../../../../slices/tourSlice";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { validateOriginalDate } from "../../../../utils/validate";
const UpdateTour = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const calculateIdFull = (id) => {
    const idFull = `TR${"0".repeat(12 - id.toString().length)}${id}`;
    return idFull;
  };
  const { loading, tour } = useSelector((state) => state.tour);
  useEffect(() => {
    const idFull = calculateIdFull(id);
    dispatch(getTourDetail(idFull)).unwrap();
  }, []);

  const [selectedLocation, setSelectedLocation] = useState({
    province: "",
    district: "",
    commune: "",
  });

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
  };
  const [formData, setFormData] = useState({
    tourTitle: "",
    video: "",
    numberOfDay: 0,
    moreLocation: "",
    tourDescription: "",
    day: 0,
    description: "",
    imageUrl: "",
    price: 0,
    startDate: "",
    endDate: "",
    suitablePerson: "",
    termAndCondition: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData }; // Tạo một bản sao của formData
    if (name === "startDate" || name === "endDate") {
      const inputDate = e.target.value;
      const regex = /^(\d{2})-(\d{2})$/;
      if (regex.test(inputDate)) {
        const [day, month] = inputDate.split("-");
        const currentYear = new Date().getFullYear();
        const formattedDate = `${currentYear}-${month}-${day}`;
        updatedFormData[name] = formattedDate;
      }
    } else {
      updatedFormData[name] = value;
    }
    setFormData(updatedFormData);
    console.log(formData);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formDataUpdate = new FormData();

    // Thêm các trường dữ liệu vào formDataUpdate
    formDataUpdate.append("tourId", calculateIdFull(id));
    formDataUpdate.append("tourTitle", formData.tourTitle);
    formDataUpdate.append("video", formData.video);
    formDataUpdate.append("numberOfDay", formData.numberOfDay);
    formDataUpdate.append("tourDescription", formData.tourDescription);

    // Thêm địa chỉ
    formDataUpdate.append("address[province]", selectedLocation.province);
    formDataUpdate.append("address[district]", selectedLocation.district);
    formDataUpdate.append("address[commune]", selectedLocation.commune);
    formDataUpdate.append("address[moreLocation]", formData.moreLocation);
    formDataUpdate.append("reasonableTime[startDate]", formData.startDate);
    formDataUpdate.append("reasonableTime[endDate]", formData.endDate);

    // Thêm tourDetail (dựa trên tourDetail[0] trong form)
    formDataUpdate.append("tourDetail[0][day]", formData.day);
    formDataUpdate.append("tourDetail[0][description]", formData.description);
    formDataUpdate.append("tourDetail[0][imageUrl]", formData.imageUrl);
    formDataUpdate.append("tourDetail[0][price]", formData.price);

    formDataUpdate.append("suitablePerson", formData.suitablePerson);
    formDataUpdate.append("termAndCondition", formData.termAndCondition);
    for (const [name, value] of formDataUpdate.entries()) {
      console.log(name, ":", value);
    }
    try {
      const res = await dispatch(updateTour(formDataUpdate)).unwrap();
      console.log(res);
      if (res.data.status === "ok") {
        notify(1);
        window.location.reload();
      }
    } catch (err) {
      // notify(2);
      alert(err.message);
    }
  };
  const notify = (prop) => {
    if (prop === 1) {
      toast.success("Cập nhật tour thành công ! 👌", {
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
        <h1>Cập Nhật Tour</h1>
        <a href="/tours-list">Quay lại</a>
      </div>
      <div className="row row-1">
        <div className="col-xl-8">
          <div className="card mb-4">
            <div className="card-header">Thông tin tour</div>
            <div className="card-body">
              <form>
                <div className="row gx-3 mb-3">
                  <div className="col-md-8">
                    <label className="small mb-1">Tên tour</label>
                    <input
                      name="tourTitle"
                      className="form-control"
                      type="text"
                      placeholder={tour.tourTitle}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="small mb-1">Số ngày</label>
                    <input
                      placeholder={tour.numberOfDay}
                      name="numberOfDay"
                      className="form-control"
                      type="text"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row gx-3 mb-3">
                  <label className="small mb-1">Địa chỉ</label>
                  <LocationSelect onSelectLocation={handleSelectLocation} />
                  <div className="mt-2">
                    <input
                      placeholder={tour.address?.moreLocation}
                      name="moreLocation"
                      className="form-control"
                      type="text"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row gx-3 mb-3">
                  <div className="col-md-8">
                    <label className="small mb-1">Mô tả</label>
                    <textarea
                      placeholder={tour.tourDescription}
                      name="tourDescription"
                      className="form-control"
                      onChange={handleChange}
                      rows="4"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="small mb-1">Đối tượng phù hợp</label>
                    <input
                      placeholder={tour.suitablePerson}
                      name="suitablePerson"
                      className="form-control"
                      type="text"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row gx-3 mb-3 ">
                  <div className="col-md-6 d-flex  align-items-center">
                    <label className="small mb-1">Mùa thích hợp từ ngày</label>
                    <input
                      placeholder={validateOriginalDate(
                        tour.reasonableTime?.startDate
                      )}
                      name="startDate"
                      className="form-control w-50 ms-2"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 d-flex  align-items-center ">
                    <label className="small mb-1">đến ngày</label>
                    <input
                      name="endDate"
                      placeholder={validateOriginalDate(
                        tour.reasonableTime?.endDate
                      )}
                      className="form-control w-50 ms-2"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row gx-3 mb-3">
                  <div className="col-md-8 border-top">
                    <label className="pt-1 mb-1">Mô tả chi tiết tour</label>
                    <textarea
                      placeholder={
                        tour.tourDetail && tour.tourDetail[0]?.description
                      }
                      name="description"
                      className="form-control"
                      onChange={handleChange}
                      rows="4"
                    />
                  </div>
                  <div className="col-md-4 border-top">
                    <label className="pt-1 small mb-1">Số ngày</label>
                    <input
                      placeholder={tour.tourDetail && tour.tourDetail[0]?.day}
                      name="day"
                      className="form-control mb-2"
                      type="text"
                      onChange={handleChange}
                    />{" "}
                    <label className="small ">Giá tiền</label>
                    <input
                      placeholder={tour.tourDetail && tour.tourDetail[0]?.price}
                      name="price"
                      className="form-control"
                      type="text"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row gx-3 mb-3">
                  <label className="small mb-1">Chính sách và điều khoản</label>
                  <textarea
                    placeholder={tour.termAndCondition}
                    name="termAndCondition"
                    className="form-control"
                    onChange={handleChange}
                    rows="3"
                  />
                </div>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleUpdate}
                >
                  Cập nhật tour
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-xl-4 px-xl-0">
          <div className="card mb-4 mb-xl-0">
            <div className="card-header">Video</div>
            <div className="card-body text-center">
              <img
                className="img-account-profile rounded-circle mb-2"
                src={"/noavatar.png"}
                alt=""
              />{" "}
              <input
                className="chooseFile"
                type="file"
                accept=".jpg,.png"
                // onChange={handleSelectImage}
                style={{ display: "none" }}
                // ref={fileInputRef}
              />
              <div className="small font-italic text-muted mb-4">
                JPG hoặc PNG không quá 5 MB
              </div>
              <button
                className="btn btn-primary"
                type="button"
                // onClick={handleUploadButtonClick}
              >
                Tải lên video
              </button>
            </div>
          </div>
          <div className="card mb-4 mb-xl-0 mt-xl-2">
            <div className="card-header">Ảnh</div>
            <div className="card-body text-center">
              <img
                className="img-account-profile rounded-circle mb-2"
                src={"/noavatar.png"}
                alt=""
              />{" "}
              <input
                className="chooseFile"
                type="file"
                accept=".jpg,.png"
                // onChange={handleSelectImage}
                style={{ display: "none" }}
                // ref={fileInputRef}
              />
              <div className="small font-italic text-muted mb-4">
                JPG hoặc PNG không quá 5 MB
              </div>
              <button
                className="btn btn-primary"
                type="button"
                // onClick={handleUploadButtonClick}
              >
                Tải lên ảnh
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default UpdateTour;
