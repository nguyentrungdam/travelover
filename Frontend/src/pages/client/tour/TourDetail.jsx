import "./tour.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faCartShopping,
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
  faMagnifyingGlass,
  faPeopleGroup,
  faTicket,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import ScrollToTop from "../../../shared/ScrollToTop";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchTour2 } from "../../../slices/tourSlice";
import {
  FormatLine,
  formatCurrencyWithoutD,
  saveToLocalStorage,
  validateOriginalDate,
} from "../../../utils/validate";
import { addDays, format } from "date-fns";
import { vi } from "date-fns/locale";
import DatePicker from "react-datepicker";
import { hotels } from "../../../assets/data/tours";
import { getZHotelRoomSearch } from "../../../slices/zhotelSlice";
import Loading from "../../../components/Loading/Loading";

const TourDetail = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tours } = useSelector((state) => state.tour);
  const { loading, zrooms } = useSelector((state) => state.hotelz);
  const { tourId } = useParams();
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const { state } = location;
  const [showFullDescription, setShowFullDescription] = useState(false);
  const province = state ? state.province : "";
  const startDate = state ? state.startDate : "";
  const numberOfDay = state ? state.numberOfDay : "";
  const numberOfAdult = state ? state.numberOfAdult : 1;
  const numberOfChildren = state ? state.numberOfChildren : 1;
  const numberOfRoom = state ? state.numberOfRoom : 1;
  const [activeDay, setActiveDay] = useState(null);
  console.log(state);
  useEffect(() => {
    window.scrollTo(0, 0);
    const res = dispatch(
      searchTour2({
        keyword: tourId,
        province,
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
  const handleOrder = (tourId) => {
    navigate(`/tours/tour-booking/${tourId}`, {
      state: {
        province: province || location.state.province,
        startDate,
        numberOfDay,
        numberOfAdult,
        numberOfChildren,
        numberOfRoom,
      },
    });
    saveToLocalStorage("province", province || location.state.province);
    saveToLocalStorage("startDate", startDate);
    saveToLocalStorage("numberOfDay", numberOfDay);
    saveToLocalStorage("numberOfAdult", numberOfAdult);
    saveToLocalStorage("numberOfChildren", numberOfChildren);
    saveToLocalStorage("numberOfRoom", numberOfRoom);
  };

  const handleOpenOverlay = (i) => {
    setSlideNumber(i);
    setOpen(true);
    document.body.classList.add("modal-open1");
  };
  const handleCloseOverlay = () => {
    setOpen(false);
    document.body.classList.remove("modal-open1");
  };
  const handleMove = (direction) => {
    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber =
        slideNumber === 0 ? tours[0]?.tour?.image.length - 1 : slideNumber - 1;
    } else {
      newSlideNumber =
        slideNumber === tours[0]?.tour?.image.length - 1 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber);
  };

  const totalRoom = tours[0]?.hotel?.room?.reduce(
    (accumulator, currentRoom) => {
      return accumulator + currentRoom.price;
    },
    0
  );
  //tách dòng description
  const maxDescriptionLength = 300;
  const tourDescription = tours[0]?.tour?.tourDescription;
  const isLongDescription = tourDescription?.length > maxDescriptionLength;
  const shortDescription = isLongDescription
    ? tourDescription.slice(0, maxDescriptionLength) + "..."
    : tourDescription;
  const splitDescription = (description) => {
    return description.split(". ").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };
  //! xử lý search room
  const tomorrow = addDays(new Date(), 1);
  const tomorrow2 = addDays(new Date(), 2);
  const [openOptions, setOpenOptions] = useState(false);
  const optionsRef = useRef(null);
  const [selectedDate2, setSelectedDate2] = useState(tomorrow);
  const [selectedDate3, setSelectedDate3] = useState(tomorrow2);
  const [startDate2, setStartDate2] = useState(format(tomorrow, "yyyy-MM-dd"));
  const [endDate2, setEndDate2] = useState(format(tomorrow2, "yyyy-MM-dd"));
  const [numberOfAdult2, setNumberOfAdult2] = useState(1);
  const [numberOfChildren2, setNumberOfChildren2] = useState(0);
  const [numberOfRoom2, setNumberOfRoom2] = useState(1);
  const [showHotel, setShowHotel] = useState(true);
  const [showRoom, setShowRoom] = useState(false);

  const handleSearch = () => {
    console.log(startDate2);
    console.log(endDate2);
    console.log(numberOfAdult2);
    console.log(numberOfChildren2);
    console.log(numberOfRoom2);
    setShowHotel(true);
    setShowRoom(false);
    dispatch(
      searchTour2({
        keyword: tourId,
        province,
        startDate: startDate2,
        numberOfDay,
        numberOfAdult: numberOfAdult2,
        numberOfChildren: numberOfChildren2,
        numberOfRoom: numberOfRoom2,
        pageSize: 1,
        pageNumber: 1,
      })
    ).unwrap();
  };
  const handleDateChange = (date) => {
    const formattedDisplayDate = format(date, "yyyy-MM-dd");
    setSelectedDate2(date);
    setStartDate2(formattedDisplayDate);
  };
  const handleDateChange2 = (date) => {
    const formattedDisplayDate = format(date, "yyyy-MM-dd");
    setSelectedDate3(date);
    setEndDate2(formattedDisplayDate);
  };

  const handleOption = (category, operation) => {
    if (operation === "decrease") {
      if (category === "adults" && numberOfAdult2 > 1) {
        setNumberOfAdult2(numberOfAdult2 - 1);
      } else if (category === "children" && numberOfChildren2 > 0) {
        setNumberOfChildren2(numberOfChildren2 - 1);
      } else if (category === "rooms" && numberOfRoom2 > 1) {
        setNumberOfRoom2(numberOfRoom2 - 1);
      }
    } else if (operation === "increase") {
      if (category === "adults") {
        setNumberOfAdult2(numberOfAdult2 + 1);
      } else if (category === "children") {
        setNumberOfChildren2(numberOfChildren2 + 1);
      } else if (category === "rooms" && numberOfRoom2 < numberOfAdult2) {
        setNumberOfRoom2(numberOfRoom2 + 1);
      }
    }
  };

  const handleClickOutside = (event) => {
    if (optionsRef.current && !optionsRef.current.contains(event.target)) {
      setOpenOptions(false);
    }
  };
  const handlePeopleClick = (e) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click từ lan truyền lên
    setOpenOptions(!openOptions);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleBookHotel = (id) => {
    const res = dispatch(
      getZHotelRoomSearch({
        startDate: startDate2,
        endDate: endDate2,
        numberOfAdult: numberOfAdult2,
        numberOfChildren: numberOfChildren2,
        numberOfRoom: numberOfRoom2,
        eHotelId: id,
      })
    ).unwrap();
    console.log(res);
    setShowHotel(false);
    setShowRoom(true);
  };
  const handleBookRoom = (id) => {
    console.log("room id: " + id);
  };
  console.log(zrooms);
  return (
    <div>
      <ScrollToTop />
      <Header noneSticky />
      <div className="hotelContainer">
        {open && (
          <div className="slider">
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="close"
              onClick={handleCloseOverlay}
            />
            <FontAwesomeIcon
              icon={faCircleArrowLeft}
              className="arrow"
              onClick={() => handleMove("l")}
            />
            <div className="sliderWrapper">
              <img
                src={tours[0]?.tour?.image[slideNumber]}
                alt=""
                className="sliderImg"
              />
            </div>
            <FontAwesomeIcon
              icon={faCircleArrowRight}
              className="arrow"
              onClick={() => handleMove("r")}
            />
          </div>
        )}
        <div className="hotelWrapper container">
          <div className="d-flex justify-content-between align-items-center  sticky-detail-tour">
            <h1 className="hotelTitle col-md-6">{tours[0]?.tour?.tourTitle}</h1>
            <div className="col-md-6 d-flex gap-2  align-items-center justify-content-end">
              <p className="mb-0">
                <span className="price-total ">
                  {formatCurrencyWithoutD(tours[0]?.totalPrice)}₫{" "}
                </span>{" "}
                (trọn gói)
              </p>
              <button
                className="bookNow"
                onClick={() => handleOrder(tours[0]?.tour?.tourId)}
              >
                Đặt Ngay
              </button>
            </div>
          </div>
          <div className="hotelAddress">
            <FontAwesomeIcon icon={faLocationDot} />
            <span className="fz-14">{tours[0]?.tour?.address.province}</span>
          </div>
          <div className="hotelAddress">
            <FontAwesomeIcon icon={faTicket} />
            <span className="fz-14">{tours[0]?.tour?.tourId}</span>
          </div>
          <div className="hotelImages">
            {tours[0]?.tour?.image.map((photo, i) => (
              <div className="hotelImgWrapper" key={i}>
                {i < 5 ? (
                  <img
                    onClick={() => handleOpenOverlay(i)}
                    src={photo}
                    alt=""
                    className="hotelImg"
                  />
                ) : i === 5 ? (
                  <div className="position-relative">
                    <img
                      onClick={() => handleOpenOverlay(i)}
                      src={photo}
                      alt=""
                      className="hotelImg last-photo"
                    />
                    <span
                      className="photoRemain"
                      onClick={() => handleOpenOverlay(i)}
                    >
                      + {tours[0]?.tour?.image.length - 6}
                    </span>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ))}
          </div>
          <div className="hotelDetails">
            <div className="hotelDetailsTexts col-md-8">
              <p
                className={`hotelDesc ${
                  showFullDescription ? "full-description" : ""
                }`}
              >
                {showFullDescription
                  ? splitDescription(tours[0]?.tour?.tourDescription)
                  : shortDescription}
              </p>
              {isLongDescription && (
                <button
                  className="read-more-button"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                >
                  {showFullDescription ? "Ẩn bớt" : "Xem thêm"}
                </button>
              )}
              <div className="group-services">
                <div className="item">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/826/826165.png"
                    className="icon-img"
                    alt=""
                  />
                  <label>Thời gian</label>
                  <p>
                    {tours[0]?.tour?.numberOfDay} ngày{" "}
                    {tours[0]?.tour?.numberOfNight} đêm
                  </p>
                </div>
                <div className="item">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/32/32441.png"
                    className="icon-img"
                    alt=""
                  />
                  <label>Đối tượng phù hợp</label>
                  <p>{tours[0]?.tour?.suitablePerson} </p>
                </div>
                <div className="item">
                  <img
                    src="https://cdn4.iconfinder.com/data/icons/time-management-22/64/9-512.png"
                    className="icon-img"
                    alt=""
                  />
                  <label>Mùa thích hợp</label>
                  <p>
                    {validateOriginalDate(
                      tours[0]?.tour?.reasonableTime.startDate
                    )}{" "}
                    đến{" "}
                    {validateOriginalDate(
                      tours[0]?.tour?.reasonableTime.endDate
                    )}
                  </p>
                </div>
                <div className="item">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3009/3009710.png"
                    className="icon-img"
                    alt=""
                  />
                  <label>Khách sạn</label>
                  <p>Vạn Phát Riverside Hotel </p>
                </div>
              </div>
              <div className="search__bar mb-4 position-relative">
                <div className="headerSearch w-100">
                  <div className="headerSearchItem form__group-fast">
                    <FontAwesomeIcon
                      icon={faCalendarDay}
                      className="icon-search"
                    />
                    <div className="headerSearch-date">
                      <h5>Ngày đi </h5>
                      <DatePicker
                        id="datepicker"
                        className="datepicker "
                        selected={selectedDate2}
                        onChange={handleDateChange}
                        locale={vi} // Thiết lập ngôn ngữ Tiếng Việt
                        dateFormat="dd-MM-yyyy" // Định dạng ngày tháng
                        minDate={tomorrow} // Chỉ cho phép chọn ngày từ ngày mai trở đi
                      />
                    </div>
                  </div>
                  <div className="headerSearchItem form__group-fast">
                    <FontAwesomeIcon
                      icon={faCalendarDay}
                      className="icon-search"
                    />
                    <div className="headerSearch-date">
                      <h5>Ngày về </h5>
                      <DatePicker
                        id="datepicker"
                        className="datepicker "
                        selected={selectedDate3}
                        onChange={handleDateChange2}
                        locale={vi}
                        dateFormat="dd-MM-yyyy"
                        minDate={tomorrow2}
                      />
                    </div>
                  </div>
                  <div className="headerSearchItem headerSearchItem1 ">
                    <FontAwesomeIcon
                      icon={faPeopleGroup}
                      className="icon-search"
                    />
                    <div className="headerSearch-location w280">
                      <h5>Số người</h5>
                      <span
                        onClick={handlePeopleClick}
                        className="headerSearchText"
                      >
                        {numberOfAdult2} người lớn, {numberOfChildren2} trẻ em,{" "}
                        {numberOfRoom2} phòng
                      </span>
                      {openOptions && (
                        <div className="options" ref={optionsRef}>
                          <div className="optionItem">
                            <span className="optionText">Người lớn </span>
                            <div className="optionCounter">
                              <button
                                disabled={numberOfAdult2 <= 1}
                                className="optionCounterButton"
                                onClick={() =>
                                  handleOption("adults", "decrease")
                                }
                              >
                                -
                              </button>
                              <span className="optionCounterNumber">
                                {numberOfAdult2}
                              </span>
                              <button
                                className="optionCounterButton"
                                onClick={() =>
                                  handleOption("adults", "increase")
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="optionItem">
                            <span className="optionText">Trẻ em </span>
                            <div className="optionCounter">
                              <button
                                disabled={numberOfChildren2 < 1}
                                className="optionCounterButton"
                                onClick={() =>
                                  handleOption("children", "decrease")
                                }
                              >
                                -
                              </button>
                              <span className="optionCounterNumber">
                                {numberOfChildren2}
                              </span>
                              <button
                                className="optionCounterButton"
                                onClick={() =>
                                  handleOption("children", "increase")
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="optionItem">
                            <span className="optionText">Số phòng </span>
                            <div className="optionCounter">
                              <button
                                disabled={numberOfRoom2 <= 1}
                                className="optionCounterButton"
                                onClick={() =>
                                  handleOption("rooms", "decrease")
                                }
                              >
                                -
                              </button>
                              <span className="optionCounterNumber">
                                {numberOfRoom2}
                              </span>
                              <button
                                className="optionCounterButton"
                                onClick={() =>
                                  handleOption("rooms", "increase")
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className="search__icon me-3"
                    type="submit"
                    onClick={handleSearch}
                  >
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </div>
                </div>
              </div>
              <div className="position-relative">
                {loading && <Loading noContainer />}
              </div>
              {!loading && showHotel && (
                <div className="list-hotels py-2">
                  {tours[0]?.hotelList.map((hotel, index) => (
                    <div
                      key={hotel.ehotelId}
                      className="item-hotel row mx-0 mb-4 wrapper-borderless animate__fadeInUp animate__animated"
                      id={hotel.ehotelId}
                    >
                      <div className="col-md-4 p-0">
                        <img
                          className="avatar-hotel cursor-pointer"
                          alt="avatar-hotel"
                          src={hotels[index]?.image}
                        />
                      </div>
                      <div className="col-md-8 p-0">
                        <div className="p-3">
                          <div className="hotel-name mb-2 cursor-pointer">
                            {hotel.ehotelName}
                          </div>
                          <div className="d-sm-flex align-items-center justify-content-between">
                            <div>
                              {Array.from(
                                { length: hotel.numberOfStarRating },
                                (_, index) => (
                                  <img
                                    key={index}
                                    className="star-for-hotel"
                                    src="/star.svg"
                                    alt=""
                                  />
                                )
                              )}
                              <div className="hotel-type mt-3">
                                <img
                                  src="/hotel-type.svg"
                                  alt="hotel-type"
                                  className="w-15px"
                                />
                                &nbsp; Khách sạn
                                {/* &nbsp; {hotel.type} */}
                              </div>
                            </div>
                            <div className="mt-sm-0 mt-2">
                              <div className="title-unit-money mb-1">
                                Giá mỗi đêm từ
                              </div>
                              <div className="unit-money-vnd unit-money-new">
                                {formatCurrencyWithoutD(
                                  hotel.optionList[0].totalPrice
                                )}
                                &nbsp;₫
                              </div>
                            </div>
                          </div>
                          <div className="address d-sm-flex align-items-center justify-content-between mt-4">
                            <div className="wrap-hotel-address pe-3">
                              <img
                                src="/mapViolet.svg"
                                alt="mapViolet.svg"
                                className="w-20px"
                              />
                              <span>
                                {hotel.address.moreLocation},{" "}
                                {hotel.address.commune},{" "}
                                {hotel.address.district},{" "}
                                {hotel.address.province},
                              </span>
                            </div>
                            <div className="group-btn flex-shrink-0 d-flex mt-sm-0 mt-2">
                              <button
                                id={hotel.ehotelId}
                                className="btn-add-to-cart "
                                onClick={() => handleBookHotel(hotel.ehotelId)}
                              >
                                <FontAwesomeIcon
                                  className="me-1"
                                  icon={faCartShopping}
                                />
                                <span className="px-1">Chọn Phòng</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {!loading && showRoom && (
                <div className="list-hotels py-2 col-md-11">
                  {zrooms?.map((room, index) => (
                    <div
                      key={index + 1}
                      className="item-hotel row mx-0 mb-4 wrapper-borderless animate__fadeInUp animate__animated"
                    >
                      <div className="col-md-9 p-0">
                        {room.room.map((roomDetail) => (
                          <div className=" mb-2" key={roomDetail.roomId}>
                            <div>
                              Phòng số:{" "}
                              <span className="hotel-name">
                                {roomDetail.roomId}
                              </span>
                            </div>
                            <div>
                              Loại phòng:{" "}
                              <span className="hotel-name">
                                {roomDetail.name}
                              </span>
                            </div>

                            <div className=" mb-2">
                              Gồm:{" "}
                              <span className="hotel-name">
                                {roomDetail.bed.join(" - ")}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="col-md-3 p-0">
                        <div className="p-3">
                          <div className="d-sm-flex align-items-center justify-content-between">
                            <div className="mt-sm-0 mt-2">
                              <div className="title-unit-money mb-1">
                                Giá mỗi đêm
                              </div>
                              <div className="unit-money-vnd unit-money-new">
                                {formatCurrencyWithoutD(room.totalPrice)}&nbsp;₫
                              </div>
                            </div>
                          </div>
                          <div className="address d-sm-flex align-items-center justify-content-between mt-4">
                            <div className="group-btn flex-shrink-0 d-flex mt-sm-0 mt-2">
                              <button
                                id={room.roomId}
                                className="btn-add-to-cart "
                                onClick={() => handleBookRoom(room.roomId)}
                              >
                                <FontAwesomeIcon
                                  className="me-1"
                                  icon={faCartShopping}
                                />
                                <span className="px-1">Chọn Phòng</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <h5>Chính sách và điều khoản</h5>
              <FormatLine text={tours[0]?.tour?.termAndCondition} />
            </div>
            <div className="hotelDetailsPrice col-md-4 ">
              <h2>Chi tiết giá tour</h2>
              <div className="table-price">
                <table>
                  <tbody>
                    <tr>
                      <th className="l1">Dịch vụ</th>
                      <th className="l2">Giá </th>
                    </tr>
                    <tr>
                      <td>
                        Người lớn:{" "}
                        <span className="t-price">{numberOfAdult}</span>
                      </td>
                      <td className="t-price">
                        {formatCurrencyWithoutD(
                          tours[0]?.tour?.priceOfAdult * numberOfAdult
                        )}
                        ₫
                      </td>
                    </tr>
                    {numberOfChildren > 0 ? (
                      <tr>
                        <td>
                          Trẻ em:{" "}
                          <span className="t-price">{numberOfChildren}</span>
                        </td>
                        <td className="t-price">
                          {" "}
                          {formatCurrencyWithoutD(
                            tours[0]?.tour?.priceOfChildren * numberOfChildren
                          )}
                          ₫
                        </td>
                      </tr>
                    ) : null}
                    <tr>
                      <td>
                        Giá phòng:{" "}
                        <span className="t-price">
                          {tours[0]?.tour?.numberOfDay} ngày{" "}
                          {tours[0]?.tour?.numberOfNight} đêm
                        </span>
                      </td>
                      <td className="t-price">
                        {formatCurrencyWithoutD(
                          totalRoom * tours[0]?.tour?.numberOfDay
                        )}
                        ₫
                      </td>
                    </tr>
                    <tr>
                      <td>Tổng</td>
                      <td className="t-price">
                        {formatCurrencyWithoutD(
                          tours[0]?.totalPriceNotDiscount
                        )}
                        ₫
                      </td>
                    </tr>
                    {tours[0]?.tour?.discount.isDiscount ? (
                      <tr>
                        <td>
                          Giảm giá:{" "}
                          <span className="t-price">
                            {tours[0]?.tour?.discount.discountValue}%
                          </span>
                        </td>
                        <td className="t-price">
                          -
                          {formatCurrencyWithoutD(
                            (tours[0]?.tour?.discount.discountValue / 100) *
                              tours[0]?.totalPriceNotDiscount
                          )}
                          ₫
                        </td>
                      </tr>
                    ) : null}

                    <tr className="total1">
                      <td>Tổng cộng</td>
                      <td className="t-price">
                        {formatCurrencyWithoutD(tours[0]?.totalPrice)}₫
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="tt ">Thông tin hướng dẫn viên</h2>
              <div className="table-price">
                <div className="more-info more-info-2">
                  <div className="block">
                    <span>HDV dẫn đoàn</span>
                    <div id="divThongTinHDV">
                      <div className="info2">
                        <p>Đang cập nhật</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-center">Lịch Trình</h1>
          <section className="section-07 mb-5">
            <div className="container">
              <div className="row">
                <div className="col-md-4 col-12 left">
                  <div className="go-tour">
                    {tours[0]?.tour?.tourDetailList.map((day, index) => (
                      <div key={index} className={`day day-0${index + 1}`}>
                        <div className="wrapper">
                          <span className="date-left">Ngày</span>
                          <a
                            href={`#day-0${index + 1}`}
                            className={`date-center  ${
                              activeDay === index + 1 ? "active1" : ""
                            }`}
                            onClick={() => setActiveDay(index + 1)}
                          >
                            {index + 1}
                          </a>
                          <span className="date-right">
                            {/* <span className="date-hotel">{day.date}</span> */}
                            <span className="location">{day.title}</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-md-8 col-12 right timeline-section">
                  {tours[0]?.tour?.schedule.map((day, index) => (
                    <div key={index}>
                      <h3 id={`day-0${index + 1}`}>{day.title}</h3>
                      <div className="excerpt">
                        <span className="line"></span>
                        <div style={{ textAlign: "justify" }}>
                          {day.description}
                        </div>
                        <img
                          src={day.imageUrl}
                          alt={day.title}
                          className="w-100"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default TourDetail;
