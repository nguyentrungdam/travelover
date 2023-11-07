import React, { useState } from "react";
import "./AddTours.css";
import LocationSelect from "./LocationSelect";
import { useDispatch } from "react-redux";
import { createTour } from "../../../../slices/tourSlice";
const AddTours = () => {
  const dispatch = useDispatch();
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
    // Kiểm tra tên trường của giá trị đang được thay đổi
    if (name === "startDate" || name === "endDate") {
      // Tách ngày và tháng từ giá trị nhập liệu
      const [day, month] = value.split("-");
      // Lấy ngày hiện tại
      const today = new Date();
      // Tạo ngày mới với năm hiện tại, tháng (lấy tháng - 1 vì tháng bắt đầu từ 0), và ngày từ giá trị nhập liệu
      const newDate = new Date(today.getFullYear(), month - 1, day);
      // Định dạng ngày thành "YYYY-MM-DD"
      const formattedDate = newDate.toISOString().split("T")[0];
      // Cập nhật giá trị trong formData tương ứng
      setFormData({
        ...formData,
        [name]: formattedDate,
      });
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
    formDataObject.append("video", formData.video);
    formDataObject.append("numberOfDay", formData.numberOfDay);
    formDataObject.append("tourDescription", formData.tourDescription);

    // Thêm địa chỉ
    formDataObject.append("address[province]", selectedLocation.province);
    formDataObject.append("address[district]", selectedLocation.district);
    formDataObject.append("address[commune]", selectedLocation.commune);
    formDataObject.append("address[moreLocation]", formData.moreLocation);
    formDataObject.append("reasonableTime[startDate]", formData.startDate);
    formDataObject.append("reasonableTime[endDate]", formData.endDate);

    // Thêm tourDetail (dựa trên tourDetail[0] trong form)
    formDataObject.append("tourDetail[0][day]", formData.day);
    formDataObject.append("tourDetail[0][description]", formData.description);
    formDataObject.append("tourDetail[0][imageUrl]", formData.imageUrl);
    formDataObject.append("tourDetail[0][price]", formData.price);

    formDataObject.append("suitablePerson", formData.suitablePerson);
    formDataObject.append("termAndCondition", formData.termAndCondition);

    // Gửi formDataObject lên API hoặc xử lý dữ liệu tại đây
    for (const [name, value] of formDataObject.entries()) {
      console.log(name, ":", value);
    }
    try {
      const res = await dispatch(createTour(formDataObject)).unwrap();
      console.log(res);
      if (res.data.status === "ok") {
        alert("OK");
      }
    } catch (err) {
      alert(err.message);
      // alert("Vui lòng kiểm tra lại các thông tin cho chính xác!");
    }
  };

  //========= sample data =================================
  /* 
Phương tiện di chuyển: Xe du lịch
Ưu đãi: Đã bao gồm ưu đãi trong giá tour
Khách sạn: Khách sạn 3 sao

Ngày 1 - TP. HỒ CHÍ MINH – ĐÀ LẠT Số bữa ăn: 3 bữa (Ăn sáng, trưa, chiều)
Ngày 2 - ĐÀ LẠT - THÀNH PHỐ NGÀN HOA Số bữa ăn: 3 bữa (Ăn sáng, trưa, chiều)
Ngày 3 - ĐÀ LẠT - NHA TRANG Số bữa ăn: 3 bữa (Ăn sáng, trưa, chiều)
Ngày 4 - NHA TRANG - HÒN LAO - VINWONDERS NHA TRANG Số bữa ăn: 2 bữa (Ăn sáng, trưa, tự túc ăn chiều)
Ngày 5 - NHA TRANG – TP.HCM Số bữa ăn: 2 bữa (Ăn sáng, trưa)

- Khi đăng ký đặt cọc 50% số tiền tour
- Thanh toán hết trước ngày khởi hành 5 ngày (tour ngày thường), trước ngày khởi hành 10 ngày (tour lễ tết)
*/
  return (
    <>
      <div className="info">
        <h1>Thêm Tour Mới</h1>
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
                      placeholder="Điền tên tour"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="small mb-1">Số ngày</label>
                    <input
                      name="numberOfDay"
                      className="form-control"
                      type="text"
                      placeholder="Điền số ngày"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row gx-3 mb-3">
                  <label className="small mb-1">Địa chỉ</label>
                  <LocationSelect onSelectLocation={handleSelectLocation} />

                  <div className="mt-2">
                    <input
                      name="moreLocation"
                      className="form-control"
                      type="text"
                      placeholder="Nhập địa chỉ (số nhà, tên đường)"
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
                      placeholder="Nhập mô tả"
                      rows="4"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="small mb-1">Đối tượng phù hợp</label>
                    <input
                      name="suitablePerson"
                      className="form-control"
                      type="text"
                      placeholder="Mọi người"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row gx-3 mb-3 ">
                  <div className="col-md-6 d-flex  align-items-center">
                    <label className="small mb-1">Mùa thích hợp từ ngày</label>
                    <input
                      name="startDate"
                      className="form-control w-50 ms-2"
                      placeholder="Vd: 15-05"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 d-flex  align-items-center ">
                    <label className="small mb-1">đến ngày</label>
                    <input
                      name="endDate"
                      className="form-control w-50 ms-2"
                      placeholder="Vd: 15-07"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row gx-3 mb-3">
                  <div className="col-md-8 border-top">
                    <label className="pt-1 mb-1">Mô tả chi tiết tour</label>
                    <textarea
                      name="description"
                      className="form-control"
                      onChange={handleChange}
                      placeholder="Nhập mô tả"
                      rows="4"
                    />
                  </div>
                  <div className="col-md-4 border-top">
                    <label className="pt-1 small mb-1">Số ngày</label>
                    <input
                      name="day"
                      className="form-control mb-2"
                      type="text"
                      placeholder="Điền số ngày"
                      onChange={handleChange}
                    />{" "}
                    <label className="small ">Giá tiền</label>
                    <input
                      name="price"
                      className="form-control"
                      type="text"
                      placeholder="Điền giá tiền"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row gx-3 mb-3">
                  <label className="small mb-1">Chính sách và điều khoản</label>
                  <textarea
                    name="termAndCondition"
                    className="form-control"
                    onChange={handleChange}
                    placeholder="Nhập chính sách và điều khoản"
                    rows="3"
                  />
                </div>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleSubmit}
                >
                  Tạo tour
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
    </>
  );
};

export default AddTours;
