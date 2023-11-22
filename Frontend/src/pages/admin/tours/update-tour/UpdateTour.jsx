import React, { useEffect, useRef, useState } from "react";
import "./UpdateTours.css";
import LocationSelect from "../add-tour/LocationSelect";
import { useDispatch, useSelector } from "react-redux";
import { getTourDetail, updateTour } from "../../../../slices/tourSlice";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { validateOriginalDate } from "../../../../utils/validate";
import { axiosMultipart } from "../../../../apis/axios";
const UpdateTour = () => {
  const fileInputRef = useRef();
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
  function handleUploadButtonClick() {
    fileInputRef.current.click(); // Kích hoạt input khi nút "Tải lên ảnh" được nhấn
  }
  const handleSelectImage = (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile.name);
    const formData = new FormData();
    formData.append("file", selectedFile);
    axiosMultipart
      .post("/images/create", formData)
      .then((response) => {
        const imageUrl = response.data.data.url;
        // Cập nhật state của formData với giá trị thumbnailUrl từ API
        setFormData((prevFormData) => ({
          ...prevFormData,
          thumbnailUrl: imageUrl,
        }));
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          profilePicture: reader.result,
        }));
      } else return;
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
  };
  const [formData, setFormData] = useState({
    tourTitle: "",
    thumbnailUrl: "",
    profilePicture: "",
    numberOfDay: 0,
    moreLocation: "",
    tourDescription: "",
    tourDetail: "",
    startDate: "",
    price: 0,
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
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    const formDataUpdate = new FormData();

    // Thêm các trường dữ liệu vào formDataUpdate
    formDataUpdate.append("tourId", calculateIdFull(id));
    formDataUpdate.append("tourTitle", formData.tourTitle || tour.tourTitle);
    formDataUpdate.append(
      "thumbnailUrl",
      formData.thumbnailUrl || tour.thumbnailUrl
    );
    formDataUpdate.append(
      "numberOfDay",
      formData.numberOfDay || tour.numberOfDay
    );
    formDataUpdate.append(
      "tourDescription",
      formData.tourDescription || tour.tourDescription
    );
    formDataUpdate.append("tourDetail", formData.tourDetail || tour.tourDetail);
    formDataUpdate.append(
      "suitablePerson",
      formData.suitablePerson || tour.suitablePerson
    );
    formDataUpdate.append(
      "termAndCondition",
      formData.termAndCondition || tour.termAndCondition
    );
    formDataUpdate.append("price", formData.price || tour.price);

    // Thêm địa chỉ
    formDataUpdate.append(
      "address[province]",
      selectedLocation.province || tour.address.province
    );
    formDataUpdate.append(
      "address[district]",
      selectedLocation.district || tour.address.district
    );
    formDataUpdate.append(
      "address[commune]",
      selectedLocation.commune || tour.address.commune
    );
    formDataUpdate.append(
      "address[moreLocation]",
      formData.moreLocation || tour.address.moreLocation
    );
    formDataUpdate.append(
      "reasonableTime[startDate]",
      formData.startDate || tour.reasonableTime.startDate
    );
    formDataUpdate.append(
      "reasonableTime[endDate]",
      formData.endDate || tour.reasonableTime.endDate
    );

    for (const [name, value] of formDataUpdate.entries()) {
      console.log(name, ":", value);
    }
    // try {
    //   const res = await dispatch(updateTour(formDataUpdate)).unwrap();
    //   console.log(res);
    //   if (res.data.status === "ok") {
    //     notify(1);
    //     window.location.reload();
    //   }
    // } catch (err) {
    //   // notify(2);
    //   alert(err.message);
    // }
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
        <h1>Update Tour</h1>
        <a href="/tours-list">Back</a>
      </div>
      <div className="row row-1">
        <div className="col-xl-8">
          <div className="card mb-4">
            <div className="card-header">Tour Infomation</div>
            <div className="card-body">
              <form>
                <div className="row gx-3 mb-3">
                  <div className="col-md-8">
                    <label className="small mb-1">Tour title</label>
                    <input
                      name="tourTitle"
                      className="form-control"
                      type="text"
                      defaultValue={tour.tourTitle}
                      // placeholder={tour.tourTitle}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="small mb-1">Days</label>
                    <input
                      defaultValue={tour.numberOfDay}
                      name="numberOfDay"
                      className="form-control"
                      type="text"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row gx-3 mb-3">
                  <label className="small mb-1">Address</label>
                  <LocationSelect
                    onSelectLocation={handleSelectLocation}
                    english
                  />
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
                    <label className="small mb-1">Description</label>
                    <textarea
                      defaultValue={tour.tourDescription}
                      name="tourDescription"
                      className="form-control"
                      onChange={handleChange}
                      rows="4"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="small mb-1">Suitable Person</label>
                    <input
                      defaultValue={tour.suitablePerson}
                      name="suitablePerson"
                      className="form-control"
                      type="text"
                      onChange={handleChange}
                    />
                    <label className="small ">Price</label>
                    <input
                      name="price"
                      className="form-control"
                      type="text"
                      defaultValue={tour.price}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row gx-3 mb-3 ">
                  <div className="col-md-6 d-flex  align-items-center">
                    <label className="small mb-1">
                      {" "}
                      Suitable season from date
                    </label>
                    <input
                      maxLength={5}
                      defaultValue={validateOriginalDate(
                        tour.reasonableTime?.startDate
                      )}
                      name="startDate"
                      className="form-control w-50 ms-2"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 d-flex  align-items-center ">
                    <label className="small mb-1">to</label>
                    <input
                      maxLength={5}
                      name="endDate"
                      defaultValue={validateOriginalDate(
                        tour.reasonableTime?.endDate
                      )}
                      className="form-control w-50 ms-2"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row gx-3 mb-3">
                  <div className="col-md-12 border-top">
                    <label className="pt-1 mb-1">
                      Detailed tour description
                    </label>
                    <textarea
                      defaultValue={tour.tourDetail}
                      name="description"
                      className="form-control"
                      onChange={handleChange}
                      rows="4"
                    />
                  </div>
                </div>
                <div className="row gx-3 mb-3">
                  <div className="col-md-12 border-top">
                    <label className="small mb-1">Policies and terms</label>
                    <textarea
                      defaultValue={tour.termAndCondition}
                      name="termAndCondition"
                      className="form-control"
                      onChange={handleChange}
                      rows="3"
                    />
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleUpdate}
                >
                  Update Tour
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-xl-4 px-xl-0">
          <div className="card mb-4 mb-xl-0 ">
            <div className="card-header">Image</div>
            <div className="card-body text-center">
              <img
                className="img-account-profile  mb-2"
                src={tour.thumbnailUrl}
                alt=""
              />{" "}
              <input
                className="chooseFile"
                type="file"
                accept=".jpg,.png"
                onChange={handleSelectImage}
                style={{ display: "none" }}
                ref={fileInputRef}
              />
              <div className="small font-italic text-muted mb-4">
                JPG or PNG must not exceed 2 MB
              </div>
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleUploadButtonClick}
              >
                Upload Image
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
