import React, { useState } from "react";
import "./AddTours.css";
import LocationSelect from "./LocationSelect";
import { useDispatch } from "react-redux";
import { createTour } from "../../../../slices/tourSlice";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
/* Ngày 1 - TP. HỒ CHÍ MINH - THÁC DAMBRI - ĐÀ LẠT Số bữa ăn: 3 bữa (Ăn sáng, trưa, tối)
Quý khách tập trung tại Vietravel (190 Pasteur, phường Võ Thị Sáu, Quận 3, TP.HCM), xe đưa đoàn khởi hành đi Đà Lạt. Trên đường đoàn dừng chân tham quan và ăn trưa tại Bảo Lộc:
Ngày 2 - ĐÀ LẠT – ĐỒI CHÈ CẦU ĐẤT – HẦM VANG ĐÀ LẠT – THĂM VƯỜN DÂU TÂY Số bữa ăn: 3 bữa (Ăn sáng, trưa, tối)
Đà Lạt chào đón quý khách với không khí se lạnh thoang thoảng mùi sương sớm mai, sau khi dùng bữa sáng, xe đưa đoàn tham quan
Ngày 3 - ĐÀ LẠT – MONGO LAND Số bữa ăn: 2 bữa (Ăn sáng, trưa, tự túc ăn tối)
Sau khi dùng bữa sáng tại khách sạn, xe đưa đoàn tham quan: Mongo Land: mang vẻ đẹp hoàn toàn mới lạ - một "tiểu Mông Cổ thu nhỏ" trong lòng Đà Lạt được thiết kế như một nông trại với những chiếc lều đủ màu sắc. Tất cả đều được bài trí độc đáo, bắt mắt theo phong cách Mông Cổ đặc trưng. Đến đây, ngoài việc tận hưởng bầu không khí trong lành và chiêm ngưỡng vẻ đẹp của thiên nhiên hùng vĩ, Quý khách sẽ được trải nghiêm
Ngày 4 - ĐÀ LẠT – SAMTEN HILLS ĐÀ LẠT - TP. HỒ CHÍ MINH Số bữa ăn: 2 bữa (Ăn sáng, trưa)
Quý khách dùng bữa sáng, làm thủ tục trả phòng. Sau đó xe và HDV đưa khách đi tham quan */
const AddTours = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    tourTitle: "",
    video: "",
    numberOfDay: 0,
    moreLocation: "",
    tourDescription: "",
    tourDetail: "",
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
    console.log(formData);
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
    formDataObject.append("tourDetail", formData.tourDetail);
    formDataObject.append("suitablePerson", formData.suitablePerson);
    formDataObject.append("termAndCondition", formData.termAndCondition);

    // Thêm địa chỉ
    formDataObject.append("address[province]", selectedLocation.province);
    formDataObject.append("address[district]", selectedLocation.district);
    formDataObject.append("address[commune]", selectedLocation.commune);
    formDataObject.append("address[moreLocation]", formData.moreLocation);
    formDataObject.append("reasonableTime[startDate]", formData.startDate);
    formDataObject.append("reasonableTime[endDate]", formData.endDate);

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
                  <div className="col-md-12 border-top">
                    <label className="pt-1 mb-1">Mô tả chi tiết tour</label>
                    <textarea
                      name="tourDetail"
                      className="form-control"
                      onChange={handleChange}
                      placeholder="Nhập mô tả"
                      rows="4"
                    />
                  </div>
                  {/* <div className="col-md-4 border-top">
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
                  </div> */}
                </div>
                <div className="row gx-3 mb-3">
                  <div className="col-md-12 ">
                    <label className="small mb-1">
                      Chính sách và điều khoản
                    </label>
                    <textarea
                      name="termAndCondition"
                      className="form-control"
                      onChange={handleChange}
                      placeholder="Nhập chính sách và điều khoản"
                      rows="3"
                    />
                  </div>
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
      <ToastContainer />
    </>
  );
};

export default AddTours;
