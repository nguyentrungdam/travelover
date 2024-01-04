import React, { useEffect, useState } from "react";
import "./TourBooking.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarMinus, faUsers } from "@fortawesome/free-solid-svg-icons";
import { searchTour, searchTour2 } from "../../../slices/tourSlice";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { orderTour } from "../../../slices/orderSlice";
import { axiosInstance } from "../../../apis/axios";
import { addDays } from "date-fns";
import {
  formatCurrencyWithoutD,
  formatDateToVietnamese,
  getFromLocalStorage,
  validateEmail,
  validateVietnameseName,
  validateVietnamesePhoneNumber,
} from "../../../utils/validate";
import { getCheckDiscount } from "../../../slices/discountSlice";

const TourBooking = () => {
  const { loading, tours } = useSelector((state) => state.tour);
  const { account } = useSelector((state) => state.account);
  const location = useLocation();
  const dispatch = useDispatch();
  const { tourId } = useParams();
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [totalSaleOff, setTotalSaleOff] = useState(0);

  const { state } = location;
  const province = state.province;
  const startLocation = state.startLocation || "";
  const startDate = state.startDate;
  const numberOfDay = state.numberOfDay;
  const numberOfAdult = state.numberOfAdult;
  const numberOfChildren = state.numberOfChildren;
  const numberOfRoom = state.numberOfRoom;
  const priceRoom = state.priceRoom;
  const priceCar = state.priceCar;
  const vehicleId = state.vehicleId;
  const hotelId = state.hotelId;
  const roomIdList = state.roomIdList;
  console.log(vehicleId);
  console.log(hotelId);
  console.log(roomIdList);
  const [adultArray, setAdultArray] = useState(
    Array.from({ length: numberOfAdult - 1 }, (_, index) => ({
      fullName: "",
      age: 0,
      gender: "Nam",
    }))
  );
  const [childrenArray, setChildrenArray] = useState(
    Array.from({ length: numberOfChildren }, (_, index) => ({
      fullName: "",
      age: 0,
      gender: "Nam",
    }))
  );
  const [externalMember, setExternalMember] = useState([]);
  const [note, setNote] = useState("");
  useEffect(() => {
    window.scrollTo(0, 0);
    const res = dispatch(
      searchTour2({
        keyword: tourId,
        province,
        startLocation,
        startDate,
        numberOfDay,
        numberOfAdult,
        numberOfChildren,
        numberOfRoom,
        pageSize: 1,
        pageNumber: 1,
      })
    ).unwrap();
  }, []);

  console.log(tours);
  useEffect(() => {
    // Combine both adultArray and childrenArray into one member array
    const combinedArray = [...adultArray, ...childrenArray];
    setExternalMember(combinedArray);
  }, [adultArray, childrenArray]);

  useEffect(() => {
    // Update customerInformation when externalMember changes
    setCustomerInformation((prevCustomerInformation) => ({
      ...prevCustomerInformation,
      member: externalMember,
    }));
  }, [externalMember]);

  console.log(tours);
  // validate date
  const startDateString = new Date(startDate);
  const endDate = addDays(startDateString, tours[0]?.tour?.numberOfDay);
  const endDateString = new Date(endDate);
  const formattedStartDate = formatDateToVietnamese(startDateString);
  const formattedEndDate = formatDateToVietnamese(endDateString);
  const [customerInformation, setCustomerInformation] = useState({
    fullName: getFromLocalStorage("fullName") || "",
    email: getFromLocalStorage("email") || "",
    phoneNumber: getFromLocalStorage("phoneNumber") || "",
    gender: "Nam",
    age: 0,
    member: [],
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
    if (
      name === "fullName" ||
      name === "email" ||
      name === "phoneNumber" ||
      name === "age" ||
      name === "gender"
    ) {
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
  const handleChangeCustomer = (array, index, key, value) => {
    const newArray = array.map((item, i) =>
      i === index ? { ...item, [key]: value } : item
    );
    if (array === adultArray) {
      setAdultArray(newArray);
    } else if (array === childrenArray) {
      setChildrenArray(newArray);
    }
    // Combine both adultArray and childrenArray into one member array
    const combinedArray = [...adultArray, ...childrenArray];
    setExternalMember(combinedArray);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(
        orderTour({
          startDate: startDate,
          tourId,
          hotelId,
          roomIdList,
          vehivleId: vehicleId,
          coachIdList: ["1"],
          guiderId: "",
          personIdList: [],
          customerInformation,
          numberOfChildren,
          discountCode,
          numberOfAdult,
        })
      ).unwrap();
      console.log(res);
      // if (res.data.status === "ok") {
      //   let orderVNPayData = {
      //     amount: res.data.data.finalPrice,
      //     orderType: "tour",
      //     orderInfo: res.data.data.orderId,
      //     returnUrl: "http://localhost:3000/thank-you",
      //   };
      //   console.log(orderVNPayData);
      //   axiosInstance
      //     .post("/payments/vnpay/create", orderVNPayData)
      //     .then((response) => {
      //       window.location.href = response.data.data;
      //     })
      //     .catch((error) => {
      //       console.error("Lỗi khi gọi API:", error);
      //     });
      // }
    } catch (err) {
      alert(err);
    }
  };
  const handleApplyCoupon = async () => {
    setErrorMessage("");
    try {
      const actionResult = await dispatch(
        getCheckDiscount({ discountCode, totalPrice: tours[0]?.totalPrice })
      );

      setTotalSaleOff(actionResult.payload.data.data);
    } catch (error) {
      console.error(error); // In ra lỗi để kiểm tra
      setErrorMessage("Mã giảm giá không áp dụng được, vui lòng thử mã khác!");
    }
  };

  const handleRemoveCoupon = () => {
    setDiscountCode(""); // Đặt giá trị của mã giảm giá về rỗng
    setErrorMessage(""); // Đặt giá trị của errorMessage về rỗng
    setTotalSaleOff(0);
  };
  console.log(customerInformation);
  console.log(tours);
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
                  <p className="title" id="title">
                    {tours[0]?.tour?.tourTitle}
                  </p>
                  <div className="entry">
                    <div className="entry-inner">
                      <span>
                        Thời gian: <b> {tours[0]?.tour?.numberOfDay} ngày</b>
                      </span>
                      <span>
                        Điểm đến: <b>{tours[0]?.tour?.address?.province}</b>
                      </span>
                      <span>
                        Khách sạn:{" "}
                        <b>
                          {tours[0]?.hotelList
                            ? tours[0]?.hotelList[0]?.ehotelName
                            : ""}
                        </b>
                      </span>
                      <span>
                        Số phòng: <b>{roomIdList?.length}</b>
                      </span>
                      <span>
                        Nhà xe:{" "}
                        <b>
                          {tours[0]?.vehicleList
                            ? tours[0]?.vehicleList[0]?.evehicleName
                            : ""}
                        </b>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-7 col-12 left">
              <h3 style={{ color: "#2d4271" }}>Thông tin liên lạc</h3>
              <div className="customer-contact ">
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
                  <div className="w-22 position-relative mt-2">
                    <label>
                      Tuổi <b>*</b>
                    </label>
                    <input
                      placeholder="Vd: 22"
                      className="form-control"
                      id="age"
                      name="age"
                      type="text"
                      onChange={handleChange}
                    />
                  </div>{" "}
                  <div className="w-22 position-relative mt-2">
                    <label>
                      Giới tính <b>*</b>
                    </label>
                    <select
                      className="form-control dropdown Filter cursor-pointer"
                      id="gender"
                      name="gender"
                      onChange={handleChange}
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </form>
              </div>
              <h3 style={{ color: "#2d4271" }}>Danh sách hành khách</h3>
              {adultArray.length > 0 ? (
                <div className="title-persona">
                  <img alt="Người lớn" src="/adult.svg" />
                  Người lớn
                </div>
              ) : null}
              {adultArray.map((item, index) => (
                <div
                  key={`adult_${index + 0.1}`}
                  className="customer-list py-0"
                >
                  <div className="name position-relative info-customer-list">
                    <label>
                      Họ và Tên <b>*</b>
                    </label>
                    <input
                      className="form-control"
                      placeholder="Vd: Nguyễn Văn A"
                      name="fullName"
                      type="text"
                      value={item.fullName}
                      onChange={(e) =>
                        handleChangeCustomer(
                          adultArray,
                          index,
                          "fullName",
                          e.target.value
                        )
                      }
                    />
                    {nameError && (
                      <span className="error-container1">{nameError}</span>
                    )}
                  </div>
                  <div className="info-customer-list w-22 position-relative">
                    <label>
                      Tuổi<b>*</b>
                    </label>
                    <input
                      placeholder="Vd: 22"
                      className="form-control"
                      name="age"
                      value={item.age}
                      type="text"
                      onChange={(e) =>
                        handleChangeCustomer(
                          adultArray,
                          index,
                          "age",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="info-customer-list w-22 position-relative">
                    <label>
                      Giới tính<b>*</b>
                    </label>
                    <select
                      className="form-control dropdown Filter cursor-pointer"
                      value={item.gender}
                      name="gender"
                      onChange={(e) =>
                        handleChangeCustomer(
                          adultArray,
                          index,
                          "gender",
                          e.target.value
                        )
                      }
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </div>
              ))}
              {childrenArray.length > 0 ? (
                <div className="title-persona">
                  <img alt="Trẻ em" src="/children.svg" />
                  Trẻ em
                </div>
              ) : null}
              {childrenArray.map((item, index) => (
                <div
                  key={`children_${index + 0.2}`}
                  className="customer-list py-0"
                >
                  <div className="name position-relative info-customer-list">
                    <label>
                      Họ và Tên <b>*</b>
                    </label>
                    <input
                      className="form-control"
                      placeholder="Vd: Nguyễn Văn A"
                      value={item.fullName}
                      name="fullName"
                      type="text"
                      onChange={(e) =>
                        handleChangeCustomer(
                          childrenArray,
                          index,
                          "fullName",
                          e.target.value
                        )
                      }
                    />
                    {nameError && (
                      <span className="error-container1">{nameError}</span>
                    )}
                  </div>
                  <div className="info-customer-list w-22 position-relative">
                    <label>
                      Tuổi<b>*</b>
                    </label>
                    <input
                      placeholder="Vd: 7"
                      className="form-control"
                      name="age"
                      value={item.age}
                      type="text"
                      onChange={(e) =>
                        handleChangeCustomer(
                          childrenArray,
                          index,
                          "age",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="info-customer-list w-22 position-relative">
                    <label>
                      Giới tính<b>*</b>
                    </label>
                    <select
                      className="form-control dropdown Filter cursor-pointer"
                      name="gender"
                      value={item.gender}
                      onChange={(e) =>
                        handleChangeCustomer(
                          childrenArray,
                          index,
                          "gender",
                          e.target.value
                        )
                      }
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </div>
              ))}
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
            <div className="col-md-5 col-12 right">
              <div className="group-checkout">
                <h3>Tóm tắt chuyến đi</h3>

                <p className="package-title">
                  Tour trọn gói{" "}
                  <span> ({numberOfAdult + numberOfChildren} khách)</span>
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
                      <p className="time">{formattedStartDate}</p>
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
                      <p className="time">{formattedEndDate}</p>
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
                            {numberOfAdult + numberOfChildren}
                          </span>
                        </th>
                      </tr>

                      <tr>
                        <td>Giá tour: </td>
                        <td className="t-price text-right">
                          {formatCurrencyWithoutD(tours[0]?.tourPrice)}₫
                        </td>
                      </tr>

                      <tr>
                        <td>Giá khách sạn: </td>
                        <td className="text-right">
                          {formatCurrencyWithoutD(priceRoom)}₫
                        </td>
                      </tr>
                      <tr>
                        <td>Giá phương tiện: </td>
                        <td className="text-right">
                          {formatCurrencyWithoutD(priceCar)}₫
                        </td>
                      </tr>
                      <tr>
                        <td>Tổng</td>
                        <td className="text-right">
                          {formatCurrencyWithoutD(
                            tours[0]?.tourPrice + priceRoom + priceCar
                          )}
                          ₫
                        </td>
                      </tr>

                      <tr className="cuppon position-relative ">
                        <td>Mã giảm giá </td>
                        <td className="cp-form text-right ">
                          <form action="#">
                            <input
                              className="form-control"
                              id="DiscountCode"
                              name="DiscountCode"
                              placeholder="Thêm mã"
                              required="required"
                              value={discountCode}
                              onChange={(e) => setDiscountCode(e.target.value)}
                              type="text"
                            />
                            <input
                              type="button"
                              className="btn btn-success"
                              id="btnDiscountCode"
                              value="Áp dụng"
                              onClick={handleApplyCoupon}
                            />
                          </form>
                        </td>
                        {errorMessage && (
                          <span className="error-container2">
                            {errorMessage}
                          </span>
                        )}
                      </tr>
                      {totalSaleOff && !errorMessage ? (
                        <tr>
                          <td>Giá voucher giảm</td>
                          <td className="t-price text-right" id="AdultPrice">
                            -{formatCurrencyWithoutD(totalSaleOff)}₫{" "}
                            <button
                              className="btn btn-danger ms-1"
                              onClick={handleRemoveCoupon}
                            >
                              Bỏ
                            </button>
                          </td>
                        </tr>
                      ) : null}
                      <tr>
                        <td></td>
                      </tr>
                      <tr className="total">
                        <td>Tổng cộng</td>
                        <td className="t-price text-right" id="TotalPrice">
                          {totalSaleOff && !errorMessage ? (
                            <span className="tour-item__price--old pe-2 mb-0">
                              {formatCurrencyWithoutD(
                                tours[0]?.tourPrice + priceRoom + priceCar
                              )}
                              ₫
                            </span>
                          ) : null}
                          {totalSaleOff && !errorMessage
                            ? formatCurrencyWithoutD(
                                tours[0]?.tourPrice +
                                  priceRoom +
                                  priceCar -
                                  totalSaleOff
                              ) + "₫"
                            : formatCurrencyWithoutD(
                                tours[0]?.tourPrice + priceRoom + priceCar
                              ) + "₫"}
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
