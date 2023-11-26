import React, { createRef, useEffect, useRef, useState } from "react";
import "./UpdateTours.css";
import LocationSelect from "../add-tour/LocationSelect";
import { useDispatch, useSelector } from "react-redux";
import { getTourDetail, updateTour } from "../../../../slices/tourSlice";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useLocation, useParams } from "react-router-dom";
import { validateOriginalDate } from "../../../../utils/validate";
import { axiosMultipart } from "../../../../apis/axios";
const UpdateTour = () => {
  const fileInputRef = useRef();
  const dispatch = useDispatch();
  const fileInputRefs = useRef([0, 1, 2, 3, 4, 5].map(() => createRef()));
  const [showModal, setShowModal] = useState(false);
  const { id } = useParams();
  const { loading, tour } = useSelector((state) => state.tour);
  useEffect(() => {
    dispatch(getTourDetail(id)).unwrap();
  }, []);
  //lấy path
  const location = useLocation();
  const searchParams = new URLSearchParams(location.pathname);
  console.log(location.pathname);

  const [selectedLocation, setSelectedLocation] = useState({
    province: "",
    district: "",
    commune: "",
  });
  function handleUploadButtonClick() {
    fileInputRef.current.click(); // Kích hoạt input khi nút "Tải lên ảnh" được nhấn
  }
  const handleUploadButtonClick6 = (index) => () => {
    if (fileInputRefs.current[index] && fileInputRefs.current[index].current) {
      fileInputRefs.current[index].current.click();
    }
  };
  // console.log(tour);
  const handleSelectImage = (e, index) => {
    console.log(index);
    const selectedFile = e.target.files[0];
    const formDataClone = { ...formData };
    const imageFormData = new FormData();
    imageFormData.append("file", selectedFile);
    const imageUrl = URL.createObjectURL(selectedFile);
    axiosMultipart
      .post("/images/create", imageFormData)
      .then((response) => {
        if (index === -1) {
          formDataClone.thumbnailUrl = response.data.data.url;
          formDataClone.profileThumbnail = imageUrl;
        } else {
          formDataClone.image[index] = response.data.data.url;
          formDataClone.profilePicture = imageUrl;
        }
        setFormData(formDataClone);
      })
      .catch((error) => {
        notify(2);
        console.error("Lỗi khi gọi API:", error);
      });
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
    image: ["", "", "", "", "", ""],
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
    formDataUpdate.append("tourId", id);
    formDataUpdate.append("tourTitle", formData.tourTitle || tour.tourTitle);
    formDataUpdate.append(
      "thumbnailUrl",
      formData.thumbnailUrl || tour.thumbnailUrl
    );
    formData.image.forEach((image, index) => {
      formDataUpdate.append(`image[${index}]`, image || tour.image?.[index]);
    });
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
  const openModal = () => {
    setShowModal(true);
    document.body.classList.add("modal-open");
  };
  const closeModal = () => {
    setShowModal(false);
    document.body.classList.remove("modal-open");
  };
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay2")) {
      closeModal();
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
                      defaultValue={tour.address?.moreLocation}
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
                src={tour?.thumbnailUrl || "/noavatar.png"}
                alt=""
              />{" "}
              <input
                className="chooseFile"
                type="file"
                accept=".jpg,.png"
                onChange={(e) => handleSelectImage(e, -1)}
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
          <div className="card mb-4 mb-xl-0 mt-3">
            <div className="card-header">Image list</div>
            <div className="card-body text-center">
              <button
                className="btn btn-primary"
                type="button"
                onClick={openModal}
              >
                Upload Image List
              </button>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay2" onClick={handleOverlayClick}>
          <div className="modal2 col-xl-6">
            <div className="d-flex wrap-modal-addtour">
              <span className="card-header">Image list</span>
              <button className="close-btn2" onClick={closeModal}>
                X
              </button>
            </div>
            <div className="  d-flex image-list">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="mb-2 d-flex flex-column mx-2">
                  <img
                    className="img-account-profile"
                    src={
                      formData.image[index]
                        ? formData.image[index]
                        : tour.image?.[index] ?? "/noavatar.png"
                    }
                    alt=""
                  />
                  <input
                    className="chooseFile"
                    type="file"
                    accept=".jpg, .png"
                    onChange={(e) => handleSelectImage(e, index)}
                    style={{ display: "none" }}
                    ref={fileInputRefs.current[index]}
                  />
                  <div className="small font-italic text-muted my-2">
                    JPG or PNG must not exceed 2 MB
                  </div>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleUploadButtonClick6(index)}
                  >
                    Upload Image
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default UpdateTour;
