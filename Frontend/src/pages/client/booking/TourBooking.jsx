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
import { addDays } from "date-fns";
import {
  formatCurrencyWithoutD,
  formatDateToVietnamese,
  getFromLocalStorage,
  saveToLocalStorage,
  validateEmail,
  validateVietnameseName,
  validateVietnamesePhoneNumber,
} from "../../../utils/validate";

const TourBooking = () => {
  const { loading, tours } = useSelector((state) => state.tour);
  const { account } = useSelector((state) => state.account);
  const location = useLocation();
  const dispatch = useDispatch();
  const { tourId } = useParams();
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const { state } = location;
  const province = state
    ? state.province
    : getFromLocalStorage("province") || "";
  const startDateFromLocalStorage = getFromLocalStorage("startDate");
  const startDate = state
    ? state.startDate
    : new Date(startDateFromLocalStorage) || "";
  const numberOfDay = state
    ? state.numberOfDay
    : getFromLocalStorage("numberOfDay") || "";
  const numberOfPeople = state
    ? state.numberOfPeople
    : getFromLocalStorage("numberOfPeople") || 1;

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
  console.log(tours);
  // validate date
  const startDateString = new Date(startDate);
  // const endDate = addDays(startDateString, tours[0]?.tour?.numberOfDay);
  // const endDateString = new Date(endDate);
  // const formattedStartDate = formatDateToVietnamese(startDateString);
  // const formattedEndDate = formatDateToVietnamese(endDateString);
  const [customerInformation, setCustomerInformation] = useState({
    fullName: getFromLocalStorage("fullName") || "",
    email: getFromLocalStorage("email") || "",
    phoneNumber: getFromLocalStorage("phoneNumber") || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      const isValidEmail = validateEmail(value);
      setEmailError(isValidEmail ? "" : "Phải là một địa chỉ email hợp lệ!");
    } else if (name === "fullName") {
      const isValidName = validateVietnameseName(value);
      setNameError(isValidName ? "" : "Tên không có kí tự đặc biệt!");
    } else if (name === "phoneNumber") {
      const isValidPhoneNumber = validateVietnamesePhoneNumber(value);
      setPhoneError(
        isValidPhoneNumber
          ? ""
          : "Số điện thoại chỉ bao gồm số và tối đa là 10!"
      );
    }

    // Cập nhật giá trị của state chung
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
                      src={tours[0]?.tour?.thumbnailUrl}
                      className="img-fluid"
                      alt={tours[0]?.tour?.tourTitle}
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
                    {tours[0]?.tour?.tourTitle}
                  </p>
                  <div className="entry">
                    <div className="entry-inner">
                      <span>
                        Thời gian <b> {tours[0]?.tour?.numberOfDay} ngày</b>
                      </span>
                      <span>
                        Điểm đến <b>{tours[0]?.tour?.address?.province}</b>
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
                  <div className="name position-relative">
                    <label>
                      Họ và Tên <b>*</b>
                    </label>
                    <input
                      className="form-control"
                      defaultValue={account.data?.firstName.concat(
                        " ",
                        account.data?.lastName
                      )}
                      placeholder="Vd: Nguyễn Văn A"
                      id="contact_name"
                      name="fullName"
                      type="text"
                      onChange={handleChange}
                    />{" "}
                    {nameError && (
                      <span className="error-container1">{nameError}</span>
                    )}
                  </div>
                  <div className="mail position-relative">
                    <label>
                      Email <b>*</b>
                    </label>
                    <input
                      defaultValue={account.data?.email}
                      placeholder="Vd: nguyenvana@gmail.com"
                      className="form-control"
                      id="email"
                      name="email"
                      type="text"
                      onChange={handleChange}
                    />{" "}
                    {emailError && (
                      <span className="error-container1">{emailError}</span>
                    )}
                  </div>
                  <div className="phone position-relative mt-2">
                    <label>
                      Số điện thoại <b>*</b>
                    </label>
                    <input
                      defaultValue={account.data?.phoneNumber}
                      placeholder="Vd: 0398765432"
                      className="form-control"
                      id="mobilephone"
                      name="phoneNumber"
                      type="text"
                      onChange={handleChange}
                    />
                    {phoneError && (
                      <span className="error-container1">{phoneError}</span>
                    )}
                  </div>
                </form>
              </div>

              <div className="customer-save">
                <h3>Quý khách có ghi chú lưu ý gì, hãy nói với chúng tôi !</h3>
                <div className="customer-save-inner">
                  <p>Ghi chú thêm </p>
                  <textarea
                    className="form-control"
                    cols="20"
                    id="note"
                    onChange={handleChange}
                    name="note"
                    placeholder="Vui lòng nhập nội dung lời nhắn"
                    rows="5"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-12 right">
              <div className="group-checkout">
                <h3>Tóm tắt chuyến đi</h3>

                <p className="package-title">
                  Tour trọn gói <span> ({numberOfPeople} khách)</span>
                </p>
                <div className="product">
                  <div className="product-image">
                    <img
                      src={tours[0]?.tour?.thumbnailUrl}
                      className="img-fluid"
                      alt={tours[0]?.tour?.tourTitle}
                    />
                  </div>
                  <div className="product-content">
                    <p className="title">{tours[0]?.tour?.tourTitle}</p>
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
                      {/* <p className="time">{formattedStartDate}</p> */}
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
                      {/* <p className="time">{formattedEndDate}</p> */}
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
                          <span className="icon-checkout-users ms-1">
                            {numberOfPeople}
                          </span>
                        </th>
                      </tr>
                      <tr>
                        <td>Giá tour</td>
                        <td className="t-price text-right" id="AdultPrice">
                          {formatCurrencyWithoutD(tours[0]?.tour?.price)}₫
                        </td>
                      </tr>
                      <tr>
                        <td>Khách sạn:</td>
                      </tr>
                      {tours[0]?.hotel?.room.map((room, i) => (
                        <tr key={room.roomId}>
                          <td className="ps-4 p-0">Phòng {i + 1}</td>
                          <td className="t-price p-0 text-right">
                            {formatCurrencyWithoutD(room.price)}₫
                          </td>
                        </tr>
                      ))}

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
                          {formatCurrencyWithoutD(tours[0].totalPrice)}₫
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
