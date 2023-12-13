import React, { useRef, useState } from "react";
import { axiosMultipart } from "../../../../apis/axios";
const TourScheduleForm = () => {
  const fileInputRef = useRef();
  // State để lưu trữ dữ liệu lịch trình
  const [tourSchedule, setTourSchedule] = useState({
    schedule: [],
  });
  function handleUploadButtonClick() {
    fileInputRef.current.click(); // Kích hoạt input khi nút "Tải lên ảnh" được nhấn
  }
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

  // Xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Đối tượng tourSchedule:", tourSchedule);
    // Gửi tourSchedule lên server hoặc xử lý dữ liệu tại đây
  };
  return (
    <div className="vh-100">
      <form onSubmit={handleSubmit} className="schedule">
        <a href="/tours-list/add-new" className="btn btn-primary">
          Back
        </a>
        <div>
          <label htmlFor="imageUpload">Schedule:</label>
          <input
            className="chooseFile"
            type="file"
            accept=".jpg,.png"
            id="imageUpload"
            onChange={handleImageUpload}
            style={{ display: "none" }}
            ref={fileInputRef}
          />
          <div className="small font-italic  mb-2 text-white">
            JPG or PNG must not exceed 2 MB
          </div>
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleUploadButtonClick}
          >
            Upload Schedule Image
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
                  <label>Title:</label>
                  <input
                    value={image.title}
                    className="form-control"
                    onChange={(e) => handleImageDescriptionChange(index, e, 1)}
                  />
                </div>
                <div className="">
                  <label>Description:</label>
                  <textarea
                    value={image.description}
                    className="form-control"
                    rows={2}
                    onChange={(e) => handleImageDescriptionChange(index, e, 2)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <button type="submit" className="btn btn-primary mt-2">
          Submit
        </button>
      </form>
    </div>
  );
};

export default TourScheduleForm;
