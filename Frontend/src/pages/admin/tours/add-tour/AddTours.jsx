import React, { useRef, useState } from "react";
import "./AddTours.css";
import LocationSelect from "./LocationSelect";
import { useDispatch } from "react-redux";
import { createTour } from "../../../../slices/tourSlice";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { axiosMultipart } from "../../../../apis/axios";

const AddTours = () => {
  const fileInputRef = useRef();
  const fileInputRef2 = useRef();
  const [tourSchedule, setTourSchedule] = useState({
    schedule: [],
  });
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
    startDate: "",
    endDate: "",
    priceOfAdult: 0,
    priceOfChildren: 0,
    suitablePerson: "",
    termAndCondition: "",
    imageList: [],
    image: [],
    video: "",
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
  const handleSelectImage = (e) => {
    const selectedFile = e.target.files[0];
    const formDataClone = { ...formData };
    const imageFormData = new FormData();
    imageFormData.append("file", selectedFile);
    const imageUrl = URL.createObjectURL(selectedFile);
    axiosMultipart
      .post("/images/create", imageFormData)
      .then((response) => {
        formDataClone.thumbnailUrl = response.data.data.url;
        formDataClone.profileThumbnail = imageUrl;
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
  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "startDate" || name === "endDate") {
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
    } else if (name === "startDateDiscount" || name === "endDateDiscount") {
      if (value.length === 10) {
        const [day, month, year] = value.split("-");
        const formattedDate = `${year}-${month}-${day}`;
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
    const scheduleArray = tourSchedule.schedule.map((item) => ({
      imageUrl: item.imageUrl,
      description: item.description,
      title: item.title,
    }));

    // Thêm từng đối tượng trong mảng schedule vào formDataObject
    scheduleArray.forEach((item, index) => {
      formDataObject.append(`schedule[${index}][imageUrl]`, item.imageUrl);
      formDataObject.append(
        `schedule[${index}][description]`,
        item.description
      );
      formDataObject.append(`schedule[${index}][title]`, item.title);
    });

    // Thêm các trường dữ liệu vào formDataObject
    formDataObject.append("tourTitle", formData.tourTitle);
    formDataObject.append("thumbnailUrl", formData.thumbnailUrl);
    formData.imageList.forEach((image, index) => {
      formDataObject.append(`image[${index}]`, image);
    });
    formDataObject.append("numberOfDay", formData.numberOfDay);
    formDataObject.append("numberOfNight", formData.numberOfNight);
    formDataObject.append("tourDescription", formData.tourDescription);
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
      toast.success("Cập nhật thành công! 👌", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
        pauseOnHover: true,
      });
    } else if (prop === 3) {
      toast.error("Số lượng tối đa là 20!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
        pauseOnHover: true,
      });
    } else if (prop === 4) {
      toast.success("Thêm ảnh thành công!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
        pauseOnHover: true,
      });
    } else {
      toast.error("Có lỗi, vui lòng thử lại!", {
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
  function handleUploadButtonClick2() {
    fileInputRef2.current.click(); // Kích hoạt input khi nút "Tải lên ảnh" được nhấn
  }
  //! bên dưới là xử lý phần add lịch trình
  // Xử lý thay đổi mô tả hình ảnh
  const handleImageDescriptionChange = (index, e, number) => {
    const newImages = [...tourSchedule.schedule];
    if (number === 1) {
      newImages[index].title = e.target.value;
    } else {
      newImages[index].description = e.target.value;
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

      const reader = new FileReader();

      reader.onloadend = () => {
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
      };

      reader.readAsDataURL(file);
    }
  };

  //! bên dưới là xử lý phần add list image
  const handleRemoveImageList = (index) => {
    const newImageList = [...formData.imageList];
    newImageList.splice(index, 1);
    setFormData({ ...formData, imageList: newImageList });
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

        // Kiểm tra và giới hạn số lượng file
        const remainingSlots = 20 - formData.imageList.length;
        const filesToAdd = newFiles.slice(0, remainingSlots);
        console.log(filesToAdd.length);
        if (filesToAdd.length === 0) {
          notify(3);
          return;
        }
        // Xử lý cho tất cả các file được chọn
        const newImageUrls = filesToAdd.map((file) =>
          URL.createObjectURL(file)
        );

        // Cập nhật state với danh sách các URL mới và setFormData
        setFormData((prevFormData) => ({
          ...prevFormData,
          imageList: [...prevFormData.imageList, ...newImageUrls],
          image: [...prevFormData.image, ...filesToAdd], // Thêm dòng này để cập nhật danh sách file
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

      // Thêm URL vào mảng imageList trong state
      formDataClone.imageList.push(imageUrl);

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

      //Lấy các URL mới từ server và cập nhật state
      const newImageUrls = response.data.data.map((data) => data);
      formDataClone.imageList = newImageUrls;
      setFormData(formDataClone);
      notify(4);
    } catch (error) {
      notify(2);
      console.error("Lỗi khi gọi API:", error);
    }
  };

  console.log(formData.video);
  return (
    <>
      <div className="info">
        <h1>Thêm Tour</h1>
      </div>
      <div className="row row-1">
        <div className="col-xl-8">
          <div className="card mb-4">
            <div className="d-flex justify-content-between border-bottom-1">
              <div className="card-header border-bottom-none">
                Thông tin tour
              </div>
              <a href="/tours-list">
                <div className="btn btn-danger"> X</div>
              </a>
            </div>
            <div className="card-body">
              <form>
                <div className="row gx-3 mb-3">
                  <div className="col-md-8">
                    <label className="small mb-1">Tên tour</label>
                    <input
                      name="tourTitle"
                      className="form-control"
                      type="text"
                      placeholder="Tên tour..."
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="small mb-1">Số ngày</label>
                    <input
                      name="numberOfDay"
                      className="form-control"
                      type="text"
                      placeholder="Vd:3"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="small mb-1">Số đêm</label>
                    <input
                      name="numberOfNight"
                      className="form-control"
                      type="text"
                      placeholder="Vd:2"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row gx-3 mb-3">
                  <label className="small mb-1">Địa chỉ</label>
                  <LocationSelect
                    onSelectLocation={handleSelectLocation}
                    english
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
                      name="tourDescription"
                      className="form-control"
                      onChange={handleChange}
                      placeholder="Mô tả"
                      rows="4"
                    />
                  </div>
                  <div className="col-md-4 ">
                    <label className="small mb-1">Đối tượng phù hợp</label>
                    <input
                      name="suitablePerson"
                      className="form-control"
                      type="text"
                      placeholder="Vd: Mọi người"
                      onChange={handleChange}
                    />
                    <div className="d-flex gap-1 mt-2">
                      <div className="">
                        <label className="small ">Giá người lớn</label>
                        <input
                          name="priceOfAdult"
                          className="form-control"
                          type="text"
                          placeholder="Nhập giá..."
                          onChange={handleChange}
                        />
                      </div>
                      <div className="">
                        <label className="small ">Giá của trẻ em</label>
                        <input
                          name="priceOfChildren"
                          className="form-control"
                          type="text"
                          placeholder="Nhập giá..."
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row gx-3 mb-3 ">
                  <div className="col-md-6 d-flex  align-items-center">
                    <label className="small mb-1"> Mùa thích hợp từ</label>

                    <input
                      maxLength={5}
                      name="startDate"
                      className="form-control w-50 ms-2"
                      placeholder="Vd: 15-05"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 d-flex  align-items-center ">
                    <label className="small mb-1">đến</label>
                    <input
                      maxLength={5}
                      name="endDate"
                      className="form-control w-50 ms-2"
                      placeholder="Vd: 15-07"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row gx-3 mb-3">
                  <div className="col-md-12 border-top">
                    <label className="pt-1 mb-1">Lịch trình</label>

                    <div className="schedule">
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
                          Thêm ngày
                        </button>
                      </div>

                      {tourSchedule.schedule.map((image, index) => (
                        <div key={index}>
                          <div className="d-flex align-items-center">
                            <img
                              src={image.imageUrl}
                              alt={`Image1 ${index + 1}`}
                              className="img-account-profile mt-2 col-md-3"
                            />
                            <div className="d-flex flex-column col-md-9 ms-2">
                              <div className="">
                                <label>Tên:</label>
                                <input
                                  value={image.title}
                                  className="form-control w99"
                                  onChange={(e) =>
                                    handleImageDescriptionChange(index, e, 1)
                                  }
                                />
                              </div>
                              <div className="">
                                <label>Mô tả:</label>
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
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Discount */}
                <div className="col-md-3 d-flex align-items-center">
                  <label className="small mb-1 me-2">Giảm giá: </label>
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
                      <div className="col-md-4 d-flex align-items-center w29">
                        <label className="small mb-1">Ngày giảm giá:</label>
                        <input
                          maxLength={10}
                          name="startDateDiscount"
                          className="form-control w-50 ms-2"
                          placeholder="Vd: 15-05-2023"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4 d-flex  align-items-center w29">
                        <label className="small mb-1 me-2">đến</label>
                        <input
                          maxLength={10}
                          name="endDateDiscount"
                          className="form-control w-50 ms-2"
                          placeholder="Vd: 15-07-2023"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="row gx-3 mb-3">
                      <div className="col-md-4">
                        <label className="small mb-1">Giá trị giảm</label>
                        <input
                          name="discountValue"
                          className="form-control"
                          type="text"
                          placeholder="Giá trị giảm..."
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="small mb-1">Tự động cập nhật</label>
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
                    <label className="small mb-1">
                      Điều khoản & chính sách
                    </label>
                    <textarea
                      name="termAndCondition"
                      className="form-control"
                      onChange={handleChange}
                      placeholder="Điều khoản & chính sách"
                      rows="3"
                    />
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleSubmit}
                >
                  Tạo Tour
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-xl-4 px-xl-0">
          <div className="card mb-4 mb-xl-0">
            <div className="card-header">Ảnh Bìa</div>
            <div className="card-body text-center">
              <img
                className="img-account-profile  mb-2"
                src={formData.profileThumbnail || "/upload-image.jpg"}
                alt=""
              />{" "}
              <input
                className="chooseFile"
                type="file"
                accept=".jpg,.png"
                onChange={(e) => handleSelectImage(e)}
                style={{ display: "none" }}
                ref={fileInputRef}
              />
              <div className="small font-italic text-muted mb-4">
                JPG hoặc PNG không quá 2 MB
              </div>
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleUploadButtonClick}
              >
                Tải Ảnh
              </button>
            </div>
          </div>
          <div className="card mb-4 mb-xl-0 mt-3">
            <div className="card-header">Danh sách ảnh</div>
            <div className="card-body text-center">
              <button
                className="btn btn-primary"
                type="button"
                onClick={openModal}
              >
                Tải Danh Sách Ảnh
              </button>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay2" onClick={handleOverlayClick}>
          <div className="modal3 col-xl-7">
            <div className="d-flex wrap-modal-addtour">
              <span className="card-header">Danh sách ảnh</span>
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
                multiple
              />
            ))}

            <button
              className="btn btn-primary"
              type="button"
              onClick={handleOpenFileInput}
            >
              Thêm Ảnh
            </button>

            <div className="d-flex flex-wrap ">
              {formData.imageList.map((imageUrl, index) => (
                <div
                  key={index}
                  className="mb-2 d-flex flex-column col-md-3 h200 mt-2"
                >
                  <img
                    className="img-account-profile h-150 img-radius-0375"
                    src={imageUrl ? imageUrl : "/noavatar.png"}
                    alt=""
                  />
                  <button
                    className="btn btn-danger mt-2 w200"
                    type="button"
                    onClick={() => handleRemoveImageList(index)}
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
            <button
              className="btn btn-primary mt-2"
              type="button"
              onClick={handleConfirmUpload}
            >
              Xác Nhận Thêm Ảnh
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default AddTours;
