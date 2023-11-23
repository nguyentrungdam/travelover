import React, { useEffect, useState } from "react";
import "./TourBooking.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarMinus, faUsers } from "@fortawesome/free-solid-svg-icons";
import { searchTour } from "../../../slices/tourSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { orderTour } from "../../../slices/orderSlice";
import { axiosInstance } from "../../../apis/axios";
const TourBooking = () => {
  const { loading, tours } = useSelector((state) => state.tour);
  const location = useLocation();
  const dispatch = useDispatch();
  const { tourId } = useParams();
  const { state } = location;
  const province = state ? state.province : "";
  const startDate = state ? state.startDate : "";
  const numberOfDay = state ? state.numberOfDay : "";
  const numberOfPeople = state ? state.numberOfPeople : 1;
  const [customerInformation, setCustomerInformation] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });
  const [note, setNote] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    const res = dispatch(
      searchTour({
        keyword: tourId,
        province,
        startDate,
        numberOfDay,
        numberOfPeople,
        pageSize: 1,
        pageNumber: 1,
      })
    ).unwrap();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "fullName" || name === "email" || name === "phoneNumber") {
      setCustomerInformation((prevCustomerInformation) => {
        return {
          ...prevCustomerInformation,
          [name]: value,
        };
      });
    } else if (name === "note") {
      setNote(value);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(
        orderTour({
          startDate: startDate,
          tourId,
          hotelId: tours[0]?.hotel?.hotelId,
          roomIdList: tours[0]?.hotel?.room.map((room) => room.roomId),
          vehivleId: "",
          carIdList: [],
          guiderId: "",
          personIdList: [],
          customerInformation,
          numberOfChildren: 0,
          numberOfAdult: numberOfPeople,
          note,
        })
      ).unwrap();
      console.log(res);
      if (res.data.status === "ok") {
        let orderVNPayData = {
          amount: res.data.data.totalPrice,
          orderType: "tour",
          orderInfo: res.data.data.orderId,
          returnUrl: "http://localhost:3000/thank-you",
        };
        console.log(orderVNPayData);
        axiosInstance
          .post("/payments/vnpay/create", orderVNPayData)
          .then((response) => {
            window.location.href = response.data.data;
          })
          .catch((error) => {
            console.error("Lỗi khi gọi API:", error);
          });
      }
    } catch (err) {
      alert(err);
    }
  };
  return (
    <div>
      <Header />
      <section className="checkout-main order-tour">
        <div className="container">
          <div className="row">
            <div className="col-12 top">
              <h2 className="h2-title">Tổng quan về chuyến đi</h2>
              <div className="product">
                <div className="product-image">
                  <div className="image">
                    <img
                      src="https://media.travel.com.vn/tour/tfd_230614015141_352277_TP VUNG TAU FLYCAM.jpg"
                      className="img-fluid"
                      alt="image"
                    />
                  </div>
                </div>
                <div className="product-content">
                  <div className="s-rate">
                    <span className="s-rate-span">9.98</span>
                    <div className="s-comment">
                      <h4>Rất tốt</h4>
                      <span>649 quan tâm</span>
                    </div>
                  </div>

                  <p className="title" id="title">
                    Siêu Sale 🔥 | Vũng Tàu - Sắc Màu Biển Xanh | Kích cầu du
                    lịch{" "}
                  </p>
                  <div className="entry">
                    <div className="entry-inner">
                      <span>
                        Mã Tour <b>NDSGN869-021-191123XE-V-F</b>
                      </span>
                      <span>
                        Khởi hành <b>19/11/2023</b>
                      </span>
                      <span>
                        Thời gian <b>1 ngày</b>
                      </span>
                      <span>
                        Nơi khởi hành <b>TP. Hồ Chí Minh</b>
                      </span>
                      <span>
                        Số chỗ còn nhận <b>9</b>
                      </span>
                      <span>
                        Dịch vụ tùy chọn <b>Xe suốt tuyến</b>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8 col-12 left">
              <h3 style={{ color: "#2d4271" }}>Thông tin liên lạc</h3>
              <div className="customer-contact mb-3">
                <form
                  className="customer-contact-inner"
                  action="#"
                  method="get"
                  id="form"
                >
                  <div className="name">
                    <label>
                      Họ và Tên <b>*</b>
                    </label>
                    <input
                      className="form-control"
                      id="contact_name"
                      name="fullName"
                      type="text"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mail">
                    <label>
                      Email <b>*</b>
                    </label>
                    <input
                      className="form-control"
                      id="email"
                      name="email"
                      type="text"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="phone">
                    <label>
                      Số điện thoại <b>*</b>
                    </label>
                    <input
                      className="form-control"
                      id="mobilephone"
                      name="phoneNumber"
                      type="text"
                      onChange={handleChange}
                    />
                  </div>
                </form>
              </div>

              <div className="customer-save">
                <h3>Quý khách có ghi chú lưu ý gì, hãy nói với chúng tôi !</h3>
                <div className="customer-save-inner">
                  <p>Ghi chú thêm</p>
                  <textarea
                    className="form-control"
                    cols="20"
                    id="note"
                    onChange={handleChange}
                    name="note"
                    placeholder="Vui lòng nhập nội dung lời nhắn bằng tiếng Anh hoặc tiếng Việt"
                    rows="5"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-12 right">
              <div className="group-checkout">
                <h3>Tóm tắt chuyến đi</h3>
                <span>
                  Dịch vụ tùy chọn <b>Xe suốt tuyến</b>
                </span>
                <p className="package-title">
                  Tour trọn gói <span> (9 khách)</span>
                </p>
                <div className="product">
                  <div className="product-image">
                    <img
                      src="https://media.travel.com.vn/tour/tfd_230614015141_352277_TP VUNG TAU FLYCAM.jpg"
                      className="img-fluid"
                      alt="image"
                    />
                  </div>
                  <div className="product-content">
                    <p className="title">
                      Siêu Sale 🔥 | Vũng Tàu - Sắc Màu Biển Xanh | Kích cầu du
                      lịch{" "}
                    </p>
                  </div>
                </div>
                <div className="go-tour">
                  <div className="start">
                    <FontAwesomeIcon
                      className="icon-checkout-calendar"
                      icon={faCalendarMinus}
                    />

                    <div className="start-content">
                      <h4>Bắt đầu chuyến đi</h4>
                      <p className="time">CN, 19 Tháng 11, 2023</p>
                      <p className="from"></p>
                    </div>
                  </div>
                  <div className="end">
                    <FontAwesomeIcon
                      className="icon-checkout-calendar"
                      icon={faCalendarMinus}
                    />

                    <div className="start-content">
                      <h4>Kết thúc chuyến đi</h4>
                      <p className="time">CN, 19 Tháng 11, 2023</p>
                      <p className="from"></p>
                    </div>
                  </div>
                </div>
                <div className="detail">
                  <table>
                    <tbody>
                      <tr>
                        <th className="l1">Hành khách</th>
                        <th className="l2 text-right">
                          <FontAwesomeIcon
                            className="icon-checkout-users"
                            icon={faUsers}
                          />
                          <span className="icon-checkout-users ms-1">1</span>
                        </th>
                      </tr>
                      <tr>
                        <td>Người lớn</td>
                        <td className="t-price text-right" id="AdultPrice">
                          1 x 299,000₫
                        </td>
                      </tr>

                      <tr className="pt">
                        <td>Phụ thu phòng riêng</td>
                        <td className="t-price text-right" id="txtPhuThu">
                          0₫
                        </td>
                      </tr>

                      <tr className="cuppon">
                        <td>Mã giảm giá </td>
                        <td className="cp-form text-right">
                          <form action="#">
                            <input
                              className="form-control"
                              id="DiscountCode"
                              name="DiscountCode"
                              placeholder="Thêm mã"
                              required="required"
                              type="text"
                              value=""
                            />
                            <input
                              type="button"
                              className="btn btn-success"
                              id="btnDiscountCode"
                              value="Áp dụng"
                            />
                          </form>
                        </td>
                      </tr>

                      <tr className="total">
                        <td>Tổng cộng</td>
                        <td className="t-price text-right" id="TotalPrice">
                          299,000₫
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div>
                    <button
                      className="btn btn-primary btn-order"
                      id="btnConfirm"
                      onClick={handlePayment}
                    >
                      Đặt ngay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default TourBooking;
