import React, { createRef, useEffect, useRef, useState } from "react";
import "./AddTours.css";
import LocationSelect from "./LocationSelect";
import { useDispatch } from "react-redux";
import { createTour } from "../../../../slices/tourSlice";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { axiosMultipart } from "../../../../apis/axios";

const AddTours = () => {
  const fileInputRef = useRef();
  const fileInputRefs = useRef([0, 1, 2, 3, 4, 5].map(() => createRef()));
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    tourTitle: "",
    thumbnailUrl: "",
    profilePicture: "",
    profileThumbnail: "",
    numberOfDay: 0,
    numberOfNight: 0,
    moreLocation: "",
    tourDescription: "",
    tourDetail: "",
    startDate: "",
    endDate: "",
    priceOfAdult: 0,
    priceOfChildren: 0,
    suitablePerson: "",
    termAndCondition: "",
    image: ["", "", "", "", "", ""],
    //discount
    startDateDiscount: "",
    endDateDiscount: "",
    discountValue: 0,
    auto: true,
    isDiscount: true,
  });
  const [selectedLocation, setSelectedLocation] = useState({
    province: "",
    district: "",
    commune: "",
  });
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

  function handleUploadButtonClick() {
    fileInputRef.current.click(); // Kích hoạt input khi nút "Tải lên ảnh" được nhấn
  }
  const handleUploadButtonClick6 = (index) => () => {
    if (fileInputRefs.current[index] && fileInputRefs.current[index].current) {
      fileInputRefs.current[index].current.click();
    }
  };

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      name === "startDate" ||
      name === "endDate" ||
      name === "startDateDiscount" ||
      name === "endDateDiscount"
    ) {
      if (value.length === 5) {
        const [day, month] = value.split("-");
        const today = new Date();
        const newDate = new Date(today.getFullYear(), month - 1, +day);
        const offset = today.getTimezoneOffset();
        newDate.setMinutes(newDate.getMinutes() - offset);
        const formattedDate = newDate.toISOString().split("T")[0];
        setFormData({
          ...formData,
          [name]: formattedDate,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Tạo đối tượng FormData
    const formDataObject = new FormData();

    // Thêm các trường dữ liệu vào formDataObject
    formDataObject.append("tourTitle", formData.tourTitle);
    formDataObject.append("thumbnailUrl", formData.thumbnailUrl);
    formData.image.forEach((image, index) => {
      formDataObject.append(`image[${index}]`, image);
    });
    formDataObject.append("numberOfDay", formData.numberOfDay);
    formDataObject.append("numberOfNight", formData.numberOfNight);
    formDataObject.append("tourDescription", formData.tourDescription);
    formDataObject.append("tourDetail", formData.tourDetail);
    formDataObject.append("suitablePerson", formData.suitablePerson);
    formDataObject.append("termAndCondition", formData.termAndCondition);
    formDataObject.append("priceOfAdult", formData.priceOfAdult);
    formDataObject.append("priceOfChildren", formData.priceOfChildren);

    //Thêm địa chỉ
    formDataObject.append("address[province]", selectedLocation.province);
    formDataObject.append("address[district]", selectedLocation.district);
    formDataObject.append("address[commune]", selectedLocation.commune);
    formDataObject.append("address[moreLocation]", formData.moreLocation);
    formDataObject.append("reasonableTime[startDate]", formData.startDate);
    formDataObject.append("reasonableTime[endDate]", formData.endDate);

    //discount
    formDataObject.append("discount[startDate]", formData.startDateDiscount);
    formDataObject.append("discount[endDate]", formData.endDateDiscount);
    formDataObject.append("discount[discountValue]", formData.discountValue);
    formDataObject.append("discount[auto]", formData.auto);
    formDataObject.append("discount[isDiscount]", formData.isDiscount);
    // Gửi formDataObject lên API hoặc xử lý dữ liệu tại đây
    for (const [name, value] of formDataObject.entries()) {
      console.log(name, ":", value);
    }
    try {
      const res = await dispatch(createTour(formDataObject)).unwrap();
      console.log(res);
      if (res.data.status === "ok") {
        notify(1);
        window.location.reload();
      }
    } catch (err) {
      notify(2);
      // alert("Vui lòng kiểm tra lại các thông tin cho chính xác!");
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
  const handleCheckboxChange = (e) => {
    if (e.target.name === "discount") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        auto: false,
        isDiscount: !prevFormData.isDiscount,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        auto: !prevFormData.auto,
      }));
    }
  };
  console.log(formData);
  return (
    <>
      <div className="info">
        <h1>Add New Tour</h1>
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
                      placeholder="Name of the tour..."
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="small mb-1">Days</label>
                    <input
                      name="numberOfDay"
                      className="form-control"
                      type="text"
                      placeholder="Ex:3"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="small mb-1">Nights</label>
                    <input
                      name="numberOfNight"
                      className="form-control"
                      type="text"
                      placeholder="Ex:2"
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
                      name="tourDescription"
                      className="form-control"
                      onChange={handleChange}
                      placeholder="Enter description"
                      rows="4"
                    />
                  </div>
                  <div className="col-md-4 ">
                    <label className="small mb-1">Suitable Person</label>
                    <input
                      name="suitablePerson"
                      className="form-control"
                      type="text"
                      placeholder="Enter a suitable person..."
                      onChange={handleChange}
                    />
                    <div className="d-flex gap-1 mt-2">
                      <div className="">
                        <label className="small ">Price of adult</label>
                        <input
                          name="priceOfAdult"
                          className="form-control"
                          type="text"
                          placeholder="Enter price..."
                          onChange={handleChange}
                        />
                      </div>
                      <div className="">
                        <label className="small ">Price of children</label>
                        <input
                          name="priceOfChildren"
                          className="form-control"
                          type="text"
                          placeholder="Enter price..."
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row gx-3 mb-3 ">
                  <div className="col-md-6 d-flex  align-items-center">
                    <label className="small mb-1">
                      Suitable season from date
                    </label>
                    <input
                      maxLength={5}
                      name="startDate"
                      className="form-control w-50 ms-2"
                      placeholder="Ex: 15-05"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 d-flex  align-items-center ">
                    <label className="small mb-1">to</label>
                    <input
                      maxLength={5}
                      name="endDate"
                      className="form-control w-50 ms-2"
                      placeholder="Ex: 15-07"
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
                      name="tourDetail"
                      className="form-control"
                      onChange={handleChange}
                      placeholder="Enter tour description by day..."
                      rows="4"
                    />
                  </div>
                </div>
                {/* Discount */}
                <div className="col-md-3 d-flex align-items-center">
                  <label className="small mb-1 me-2">Discount: </label>
                  <input
                    name="discount"
                    className="checkbox-tour"
                    type="checkbox"
                    checked={formData.isDiscount}
                    onChange={handleCheckboxChange}
                  />
                </div>
                {formData.isDiscount ? (
                  <>
                    <div className="row gx-3 mb-3 ">
                      <div className="col-md-4 d-flex align-items-center w-27">
                        <label className="small mb-1">Discount date:</label>
                        <input
                          maxLength={5}
                          name="startDateDiscount"
                          className="form-control w-50 ms-2"
                          placeholder="Ex: 15-05"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4 d-flex  align-items-center w-27">
                        <label className="small mb-1 me-2">to</label>
                        <input
                          maxLength={5}
                          name="endDateDiscount"
                          className="form-control w-50 ms-2"
                          placeholder="Ex: 15-07"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="row gx-3 mb-3">
                      <div className="col-md-4">
                        <label className="small mb-1">Discount value</label>
                        <input
                          name="discountValue"
                          className="form-control"
                          type="text"
                          placeholder="Enter a discount value..."
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="small mb-1">Auto update</label>
                        <input
                          name="auto"
                          className="checkbox-tour"
                          type="checkbox"
                          checked={formData.auto}
                          onChange={handleCheckboxChange}
                        />
                      </div>
                    </div>
                  </>
                ) : null}
                <div className="row gx-3 mb-3">
                  <div className="col-md-12 ">
                    <label className="small mb-1">Policies and terms</label>
                    <textarea
                      name="termAndCondition"
                      className="form-control"
                      onChange={handleChange}
                      placeholder="Enter term and policies"
                      rows="3"
                    />
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleSubmit}
                >
                  Create Tour
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-xl-4 px-xl-0">
          <div className="card mb-4 mb-xl-0">
            <div className="card-header">Thumbnail</div>
            <div className="card-body text-center">
              <img
                className="img-account-profile  mb-2"
                src={formData.profileThumbnail || "/noavatar.png"}
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
                Upload Thumbnail
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
                        : "/noavatar.png"
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

export default AddTours;
