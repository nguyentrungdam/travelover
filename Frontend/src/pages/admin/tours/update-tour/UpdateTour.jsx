import React, { createRef, useEffect, useRef, useState } from "react";
import "./UpdateTours.css";
import LocationSelect from "../add-tour/LocationSelect";
import { useDispatch, useSelector } from "react-redux";
import { getTourDetail, updateTour } from "../../../../slices/tourSlice";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { formatDate, validateOriginalDate } from "../../../../utils/validate";
import { axiosMultipart } from "../../../../apis/axios";
const UpdateTour = () => {
  const { loading, tour } = useSelector((state) => state.tour);
  const fileInputRef = useRef();
  const [showImages, setShowImages] = useState(true);
  const fileInputRef2 = useRef();
  const [tourSchedule, setTourSchedule] = useState({
    schedule: [],
  });
  useEffect(() => {
    setTourSchedule({
      schedule: tour.schedule || [],
    });
  }, [tour.schedule]);
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const { id } = useParams();
  const [formData, setFormData] = useState({
    tourTitle: "",
    thumbnailUrl: "",
    profilePicture: "",
    numberOfDay: 0,
    numberOfNight: 0,
    moreLocation: "",
    tourDescription: "",
    tourDetail: "",
    startDate: "",
    priceOfAdult: 0,
    priceOfChildren: 0,
    endDate: "",
    suitablePerson: "",
    termAndCondition: "",
    image: [],
    imageList: tour?.image,
    imageTotal: tour?.image,
    //discount
    startDateDiscount: "",
    endDateDiscount: "",
    discountValue: 0,
    auto: tour?.discount?.auto,
    isDiscount: tour?.discount?.isDiscount,
  });
  useEffect(() => {
    dispatch(getTourDetail(id)).unwrap();
  }, []);
  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      imageList: tour?.image || [],
      imageTotal: tour?.image || [],
    }));
  }, [tour]);

  console.log(formData.imageTotal);
  //!xử lý check box
  useEffect(() => {
    setTourSchedule({
      schedule: tour.schedule || [],
    });

    setFormData((prevFormData) => ({
      ...prevFormData,
      isDiscount: tour?.discount?.isDiscount,
      auto: tour?.discount?.auto,
    }));
  }, [tour.schedule, tour?.discount?.isDiscount, tour?.discount?.auto]);
  const [isTourLoaded, setIsTourLoaded] = useState(false);

  useEffect(() => {
    if (!isTourLoaded && tour) {
      setTourSchedule({
        schedule: tour.schedule || [],
      });
      setFormData((prevFormData) => ({
        ...prevFormData,
        isDiscount: tour?.discount?.isDiscount,
        auto: tour?.discount?.auto,
      }));
      setIsTourLoaded(true);
    }
  }, [isTourLoaded, tour]);
  //kết thúc xử lý checkbox
  const [selectedLocation, setSelectedLocation] = useState({
    province: "",
    district: "",
    commune: "",
  });
  function handleUploadButtonClick() {
    fileInputRef.current.click(); // Kích hoạt input khi nút "Tải lên ảnh" được nhấn
  }

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData };
    if (name === "startDate" || name === "endDate") {
      const inputDate = e.target.value;
      const regex = /^(\d{2})-(\d{2})$/;
      if (regex.test(inputDate)) {
        const [day, month] = inputDate.split("-");
        const currentYear = new Date().getFullYear();
        const formattedDate = `${currentYear}-${month}-${day}`;
        updatedFormData[name] = formattedDate;
      }
    } else if (name === "startDateDiscount" || name === "endDateDiscount") {
      const inputDate = e.target.value;
      const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
      if (regex.test(inputDate)) {
        const [day, month, year] = inputDate.split("-");
        const formattedDate = `${year}-${month}-${day}`;
        updatedFormData[name] = formattedDate;
      }
    } else {
      updatedFormData[name] = value;
    }
    setFormData(updatedFormData);
  };
  // console.log(tour);
  const handleUpdate = async (e) => {
    e.preventDefault();
    const formDataUpdate = new FormData();
    const scheduleArray = (tourSchedule?.schedule || []).map((item, index) => ({
      imageUrl: (tour?.schedule?.[index] || {}).imageUrl || item?.imageUrl,
      description: item?.description,
      title: item?.title,
    }));

    scheduleArray.forEach((item, index) => {
      formDataUpdate.append(`schedule[${index}][imageUrl]`, item.imageUrl);
      formDataUpdate.append(
        `schedule[${index}][description]`,
        item.description
      );
      formDataUpdate.append(`schedule[${index}][title]`, item.title);
    });

    formDataUpdate.append("tourId", id);
    formDataUpdate.append("tourTitle", formData.tourTitle || tour.tourTitle);
    formDataUpdate.append(
      "thumbnailUrl",
      formData.thumbnailUrl || tour.thumbnailUrl
    );
    formData.imageTotal.forEach((image, index) => {
      formDataUpdate.append(`image[${index}]`, image || tour.image?.[index]);
    });
    formDataUpdate.append(
      "numberOfDay",
      formData.numberOfDay || tour.numberOfDay
    );
    formDataUpdate.append(
      "numberOfNight",
      formData.numberOfNight || tour.numberOfNight
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
    formDataUpdate.append(
      "priceOfAdult",
      formData.priceOfAdult || tour.priceOfAdult
    );
    formDataUpdate.append(
      "priceOfChildren",
      formData.priceOfChildren || tour.priceOfChildren
    );

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
    //discount
    formDataUpdate.append(
      "discount[startDate]",
      formData?.startDateDiscount || tour?.discount?.startDate
    );
    formDataUpdate.append(
      "discount[endDate]",
      formData?.endDateDiscount || tour?.discount?.endDate
    );
    formDataUpdate.append(
      "discount[discountValue]",
      formData?.discountValue || tour?.discount?.discountValue
    );
    formDataUpdate.append("discount[auto]", formData?.auto);
    formDataUpdate.append("discount[isDiscount]", formData?.isDiscount);
    // formDataUpdate.append("discount[updateIsDiscount]", "2023-12-04");
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
      toast.success("Update successful! 👌", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
        pauseOnHover: true,
      });
    } else {
      toast.error("Unable to update, please try again!", {
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
        isDiscount: !prevFormData.isDiscount,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        auto: !prevFormData.auto,
      }));
    }
  };

  //! bên dưới là xử lý phần add lịch trình
  // Xử lý thay đổi mô tả hình ảnh
  const handleImageDescriptionChange = (index, e, number) => {
    const newImages = [...tourSchedule.schedule];
    if (number === 1) {
      newImages[index] = { ...newImages[index], title: e.target.value };
    } else {
      newImages[index] = { ...newImages[index], description: e.target.value };
    }

    setTourSchedule({
      ...tourSchedule,
      schedule: newImages,
    });
  };

  // Xử lý xóa hình ảnh
  const handleRemoveImage = (index) => {
    const newImages = [...tourSchedule.schedule];
    newImages.splice(index, 1);

    setTourSchedule({
      ...tourSchedule,
      schedule: newImages,
    });
  };
  // Xử lý tải lên hình ảnh
  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageFormData = new FormData();
      imageFormData.append("file", file);
      // const reader = new FileReader();
      // reader.onloadend = () => {
      axiosMultipart
        .post("/images/create", imageFormData)
        .then((response) => {
          const newImage = {
            imageUrl: response.data.data.url,
            description: "",
            title: "",
          };
          setTourSchedule((prevSchedule) => ({
            ...prevSchedule,
            schedule: [...prevSchedule.schedule, newImage],
          }));
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API:", error);
        });
      // };

      // reader.readAsDataURL(file);
    }
  };
  function handleUploadButtonClick2() {
    fileInputRef2.current.click(); // Kích hoạt input khi nút "Tải lên ảnh" được nhấn
  }
  //! bên dưới là xử lý phần add list image
  const handleRemoveImageList = (index) => {
    const newImageList = [...formData.imageTotal];
    newImageList.splice(index, 1);
    setFormData({ ...formData, imageTotal: newImageList });
  };

  const fileInputListRef = useRef(
    Array.from({ length: 20 }, () => React.createRef())
  );

  const handleOpenFileInput = () => {
    const firstInput = fileInputListRef.current[0];
    if (firstInput && firstInput.current) {
      firstInput.current.click();
    }
  };

  const handleFileChange = (index) => {
    return () => {
      const currentInput = fileInputListRef.current[index];
      if (currentInput && currentInput.current) {
        const newFiles = Array.from(currentInput.current.files).filter(
          (file) => !!file
        );
        // Xử lý cho tất cả các file được chọn
        const newImageUrls = newFiles.map((file) => URL.createObjectURL(file));
        // Cập nhật state với danh sách các URL mới và setFormData
        setFormData((prevFormData) => ({
          ...prevFormData,
          imageTotal: [...prevFormData.imageTotal, ...newImageUrls],
          image: [...prevFormData.image, ...newFiles], // Thêm dòng này để cập nhật danh sách file
        }));
        // Xóa giá trị của input để người dùng có thể chọn lại
        currentInput.current.value = "";
      }
    };
  };

  const handleConfirmUpload = async () => {
    const allFiles = formData.image.filter((file) => !!file);
    console.log(allFiles);
    const formDataClone = { ...formData };
    const imageFormData = new FormData();
    // Kiểm tra xem có files được chọn không
    if (allFiles.length === 0) {
      return;
    }
    // Lặp qua từng file được chọn và thêm vào FormData
    for (let i = 0; i < allFiles.length; i++) {
      const selectedFile = allFiles[i];
      const imageUrl = URL.createObjectURL(selectedFile);
      // Thêm URL vào mảng imageList trong trạng thái
      formDataClone.imageTotal.push(imageUrl);
      // Sử dụng append để thêm nhiều files cùng một key
      imageFormData.append("fileList", selectedFile);
    }
    // Gọi API để tải lên nhiều hình ảnh
    try {
      const response = await axiosMultipart.post(
        "/images/multiple-create",
        imageFormData
      );
      console.log("API Response:", response);

      // Lấy các URL mới từ server và cập nhật trạng thái
      const newImageUrls = response.data.data.map((data) => data);
      console.log(newImageUrls);

      //Set lại giá trị cho imageTotal để hiển thị
      setFormData((prevFormData) => ({
        ...prevFormData,
        imageTotal: [...prevFormData.imageList, ...newImageUrls],
      }));
    } catch (error) {
      notify(2);
      console.error("Lỗi khi gọi API1:", error);
    }
  };
  console.log(formData.imageTotal);

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
                  <div className="col-md-2">
                    <label className="small mb-1">Days</label>
                    <input
                      defaultValue={tour.numberOfDay}
                      name="numberOfDay"
                      className="form-control"
                      type="text"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="small mb-1">Nights</label>
                    <input
                      defaultValue={tour.numberOfNight}
                      name="numberOfNight"
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
                    <div className="d-flex gap-1 mt-2">
                      <div className="">
                        <label className="small ">Price of adult</label>
                        <input
                          name="priceOfAdult"
                          defaultValue={tour.priceOfAdult}
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
                          defaultValue={tour.priceOfChildren}
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
                    <form className="schedule">
                      <div>
                        <input
                          className="chooseFile"
                          type="file"
                          accept=".jpg,.png"
                          id="imageUpload"
                          onChange={handleImageUpload}
                          style={{ display: "none" }}
                          ref={fileInputRef2}
                        />

                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={handleUploadButtonClick2}
                        >
                          Upload Schedule Image
                        </button>
                        <button
                          className="btn-block1 w17"
                          type="button"
                          onClick={() => setShowImages(!showImages)}
                        >
                          {showImages ? "Hide Schedule" : "Show Schedule"}
                        </button>
                      </div>

                      {showImages &&
                        tourSchedule.schedule.map((image, index) => (
                          <div key={index}>
                            <div className="d-flex align-items-center">
                              <img
                                src={image?.imageUrl}
                                alt={`Image1 ${index + 1}`}
                                className="img-account-profile mt-2 col-md-3"
                              />
                              <div className="d-flex flex-column col-md-9 ms-2">
                                <div className="">
                                  <label>Title:</label>
                                  <input
                                    value={image.title}
                                    className="form-control w99"
                                    onChange={(e) =>
                                      handleImageDescriptionChange(index, e, 1)
                                    }
                                  />
                                </div>
                                <div className="">
                                  <label>Description:</label>
                                  <textarea
                                    value={image.description}
                                    className="form-control w99"
                                    rows={2}
                                    onChange={(e) =>
                                      handleImageDescriptionChange(index, e, 2)
                                    }
                                  />
                                </div>
                                <button
                                  type="button"
                                  className="btn btn-danger w-15"
                                  onClick={() => handleRemoveImage(index)}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </form>
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
                {formData?.isDiscount ? (
                  <>
                    <div className="row gx-3 mb-3 ">
                      <div className="col-md-4 d-flex align-items-center w29">
                        <label className="small mb-1">Discount date:</label>
                        <input
                          defaultValue={formatDate(tour.discount?.startDate)}
                          maxLength={10}
                          name="startDateDiscount"
                          className="form-control w-50 ms-2"
                          placeholder="Ex: 15-05"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4 d-flex  align-items-center w29">
                        <label className="small mb-1 me-2">to</label>
                        <input
                          maxLength={10}
                          defaultValue={formatDate(tour.discount?.endDate)}
                          name="endDateDiscount"
                          className="form-control w-50 ms-2"
                          placeholder="Ex: 15-07"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="row gx-3 mb-3">
                      <div className="col-md-4 position-relative">
                        <label className="small mb-1">Discount value</label>
                        <input
                          defaultValue={tour.discount?.discountValue}
                          name="discountValue"
                          className="form-control "
                          type="text"
                          onChange={handleChange}
                        />
                        <span className="discountValue">%</span>
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
          <div className="modal2 col-xl-7">
            <div className="d-flex wrap-modal-addtour">
              <span className="card-header">Image List</span>
              <button className="close-btn2" onClick={closeModal}>
                X
              </button>
            </div>
            {fileInputListRef.current.map((ref, index) => (
              <input
                key={`fileInput_${index}`}
                type="file"
                onChange={handleFileChange(index)}
                style={{ display: "none" }}
                ref={ref}
              />
            ))}

            <button
              className="btn btn-primary"
              type="button"
              onClick={handleOpenFileInput}
            >
              Add Image
            </button>

            <div className="d-flex flex-wrap ">
              {formData?.imageTotal.map((imageUrl, index) => (
                <div
                  key={index}
                  className="mb-2 d-flex flex-column col-md-3 h200 mt-2"
                >
                  <img
                    className="img-account-profile h-150"
                    src={
                      imageUrl
                        ? imageUrl
                        : tour.imageTotal?.[index] ?? "/noavatar.png"
                    }
                    alt=""
                  />
                  <button
                    className="btn btn-danger mt-2 w200"
                    type="button"
                    onClick={() => handleRemoveImageList(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              className="btn btn-primary mt-2"
              type="button"
              onClick={handleConfirmUpload}
            >
              Confirm Upload Image List
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default UpdateTour;
