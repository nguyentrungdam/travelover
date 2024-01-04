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
  formatDateAndHour,
  saveToLocalStorage,
  validateOriginalDate,
} from "../../../utils/validate";
import { addDays, format } from "date-fns";
import { vi } from "date-fns/locale";
import DatePicker from "react-datepicker";
import { hotels } from "../../../assets/data/tours";
import Loading from "../../../components/Loading/Loading";
import LocationSelect from "../../admin/tours/add-tour/LocationSelect";

const TourDetail = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, tours, totalData } = useSelector((state) => state.tour);
  const { tourId } = useParams();
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const { state } = location;
  const [showFullDescription, setShowFullDescription] = useState(false);
  const province = state ? state.province : "";
  const startLocation = state ? state.startLocation : "";
  const startDate = state ? state.startDate : "";
  const numberOfDay = state ? state.numberOfDay : "";
  const numberOfAdult = state ? state.numberOfAdult : 1;
  const numberOfChildren = state ? state.numberOfChildren : 1;
  const numberOfRoom = state ? state.numberOfRoom : 1;
  const priceRoom2 = state ? state.priceRoom : 0;
  const priceCar2 = state ? state.priceCar : 0;
  const [activeDay, setActiveDay] = useState(null);
  const tomorrow = addDays(new Date(), 2);
  const fetchData = async () => {
    try {
      const res = await dispatch(
        searchTour2({
          keyword: tourId,
          startLocation,
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
      // Tiếp tục xử lý dữ liệu
      if (res.data.status === 200) {
        const newPriceRoom =
          res.data?.data?.tours[0]?.hotelList[0]?.optionList[0]?.totalPrice ||
          0;
        const newPriceCar =
          res.data?.data?.tours[0]?.vehicleList[0]?.optionList[0]?.totalPrice ||
          0;

        setPriceRoom(newPriceRoom);
        setPriceCar(newPriceCar);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    window.scroll(0, 0);
    fetchData();
  }, []);
  console.log(tours);

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
  const [openOptions, setOpenOptions] = useState(false);
  const [startLocation2, setStartLocation2] = useState("");
  const optionsRef = useRef(null);
  const [selectedDate2, setSelectedDate2] = useState(
    location.state.selectedDate ? location.state.selectedDate : tomorrow
  );
  const [startDate2, setStartDate2] = useState(
    format(selectedDate2 ? selectedDate2 : tomorrow, "yyyy-MM-dd")
  );
  const [numberOfAdult2, setNumberOfAdult2] = useState(
    state ? state.numberOfAdult : 1
  );
  const [numberOfChildren2, setNumberOfChildren2] = useState(
    state ? state.numberOfChildren : 0
  );
  const [numberOfRoom2, setNumberOfRoom2] = useState(
    state ? state.numberOfRoom : 1
  );
  const [showHotel, setShowHotel] = useState(true);
  const [showRoom, setShowRoom] = useState(false);
  const [showVehicle, setShowVehicle] = useState(true);
  const [showCar, setShowCar] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [priceRoom, setPriceRoom] = useState(priceRoom2);
  const [priceCar, setPriceCar] = useState(priceCar2);
  console.log(selectedCar);

  const handleSearch = () => {
    console.log(startLocation2.province);
    console.log(startDate2);
    console.log(numberOfAdult2);
    console.log(numberOfChildren2);
    console.log(numberOfRoom2);
    setShowHotel(true);
    setShowRoom(false);
    try {
      const res = dispatch(
        searchTour2({
          keyword: tourId,
          startLocation: startLocation2.province
            ? startLocation2.province
            : startLocation,
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
    } catch (error) {
      navigate("/");
    }
  };
  const handleDateChange = (date) => {
    const formattedDisplayDate = format(date, "yyyy-MM-dd");
    setSelectedDate2(date);
    setStartDate2(formattedDisplayDate);
  };
  const handleSelectLocation3 = (location) => {
    setStartLocation2(location.province);
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

  const handleBookHotel = (ehotelId) => {
    // Lấy thông tin của khách sạn được chọn
    const selectedHotelInfo = tours[0]?.hotelList.find(
      (hotel) => hotel.ehotelId === ehotelId
    );
    // Set selectedHotel
    setSelectedHotel(selectedHotelInfo);
    console.log(selectedHotelInfo);
    setShowRoom(true);
    setShowHotel(false);
  };
  const handleBookCar = (evehicleId) => {
    // Lấy thông tin của khách sạn được chọn
    const selectedCarInfo = tours[0]?.vehicleList.find(
      (hotel) => hotel.evehicleId === evehicleId
    );
    // Set selectedHotel
    setSelectedCar(selectedCarInfo);
    console.log(selectedCarInfo);
    setShowCar(true);
    setShowVehicle(false);
  };
  const handleBookRoom = (totalPrice) => {
    setPriceRoom(totalPrice);
    setShowRoom(false);
    setShowHotel(true);
  };
  const handleBookCarDetail = (totalPrice) => {
    setPriceCar(totalPrice);
    setShowCar(false);
    setShowVehicle(true);
  };
  const handleOrder = (tourId) => {
    const roomIdList = selectedHotel
      ? selectedHotel.optionList[0]?.roomList.map((room) => room.roomId) || []
      : tours[0]?.hotelList[0]?.optionList[0]?.roomList.map(
          (room) => room.roomId
        ) || [];

    navigate(`/tours/tour-booking/${tourId}`, {
      state: {
        province,
        startLocation: startLocation2 ? startLocation2 : startLocation,
        startDate,
        numberOfDay,
        numberOfAdult: numberOfAdult2 ? numberOfAdult2 : numberOfAdult,
        numberOfChildren: numberOfChildren2
          ? numberOfChildren2
          : numberOfChildren,
        numberOfRoom: numberOfRoom2 ? numberOfRoom2 : numberOfRoom,
        priceRoom,
        priceCar,
        vehicleId: selectedCar
          ? selectedCar.evehicleId
          : tours[0]?.vehicleList[0].evehicleId,
        hotelId: selectedHotel
          ? selectedHotel.ehotelId
          : tours[0]?.hotelList[0].ehotelId,
        roomIdList,
      },
    });
  };
  return (
    <div>
      <ScrollToTop />
      <Header noneSticky />{" "}
      {loading ? (
        <Loading />
      ) : totalData !== 0 ? (
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
              <h1 className="hotelTitle col-md-6">
                {tours[0]?.tour?.tourTitle}
              </h1>

              <div className="col-md-6 d-flex gap-2  align-items-center justify-content-end">
                <p className="mb-0">
                  <span className="price-total ">
                    {formatCurrencyWithoutD(
                      tours[0]?.tourPrice + priceRoom + priceCar
                    )}
                    ₫{" "}
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
            <div className="d-flex align-items-center">
              {tours[0]?.tour?.numberOfReviewer > 0 && (
                <div className="short-rating">
                  <div className="s-rate">
                    <span>{tours[0]?.tour?.rate}</span>
                    <div className="s-comment">
                      Tuyệt vời
                      <p>{tours[0]?.tour?.numberOfReviewer} đánh giá</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="">
                <div className="hotelAddress">
                  <FontAwesomeIcon icon={faLocationDot} />
                  <span className="fz-14">
                    {tours[0]?.tour?.address.province}
                  </span>
                </div>
                <div className="hotelAddress">
                  <FontAwesomeIcon icon={faTicket} />
                  <span className="fz-14">{tours[0]?.tour?.tourId}</span>
                </div>
              </div>
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
                    {/* <p>
                      {tours[0]?.hotelList[0].ehotelName
                        ? tours[0]?.hotelList[0].ehotelName
                        : selectedHotel?.ehotelName}{" "}
                    </p> */}
                  </div>
                  <div className="item">
                    <img
                      src="https://cdn3.iconfinder.com/data/icons/car-icons-front-views/451/Compact_Car_Front_View-512.png"
                      className="icon-img"
                      alt=""
                    />
                    <label>Nhà xe</label>
                    {/* <p>
                      {tours[0]?.vehicleList[0].evehicleName
                        ? tours[0]?.vehicleList[0].evehicleName
                        : selectedCar?.evehicleName}{" "}
                    </p> */}
                  </div>
                </div>
                <div className="search__bar mb-4 position-relative">
                  <div className="headerSearch w-100">
                    <div className="headerSearchItem form__group-fast ratatata">
                      <FontAwesomeIcon
                        className="icon-search"
                        icon={faLocationDot}
                      />
                      <div className="headerSearch-location">
                        <h5>Điểm đi</h5>
                        <LocationSelect
                          onSelectLocation3={handleSelectLocation3}
                          pickProvince
                          searchProvince3
                        />
                      </div>
                    </div>
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
                          {numberOfAdult2} người lớn, {numberOfChildren2} trẻ
                          em, {numberOfRoom2} phòng
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
                    {tours[0]?.hotelList?.map((hotel, index) => (
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
                                  onClick={() =>
                                    handleBookHotel(hotel.ehotelId)
                                  }
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
                {showRoom && (
                  <div className="list-hotels py-2 col-md-11">
                    {selectedHotel?.optionList?.map((room, index) => (
                      <div
                        key={index + 1}
                        className="item-hotel row mx-0 mb-4 wrapper-borderless animate__fadeInUp animate__animated"
                      >
                        <div className="col-md-9 p-0">
                          {room.roomList.map((roomDetail) => (
                            <div className=" mb-2" key={roomDetail.roomId}>
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="col-md-12">
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
                                  {formatCurrencyWithoutD(room.totalPrice)}
                                  &nbsp;₫
                                </div>
                              </div>
                            </div>
                            <div className="address d-sm-flex align-items-center justify-content-between mt-2">
                              <div className="group-btn flex-shrink-0 d-flex mt-sm-0 ">
                                <button
                                  id={room.roomId}
                                  className="btn-add-to-cart "
                                  onClick={() =>
                                    handleBookRoom(room.totalPrice)
                                  }
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
                        <td>Giá tour:</td>
                        <td className="t-price">
                          {formatCurrencyWithoutD(tours[0]?.tourPrice)}₫
                        </td>
                      </tr>
                      <tr>
                        <td>Giá khách sạn:</td>
                        <td className="t-price">
                          {formatCurrencyWithoutD(priceRoom)}₫
                        </td>
                      </tr>
                      <tr>
                        <td>Giá phương tiện:</td>
                        <td className="t-price">
                          {formatCurrencyWithoutD(priceCar)}₫
                        </td>
                      </tr>

                      <tr className="total1">
                        <td>Tổng cộng</td>
                        <td className="t-price">
                          {formatCurrencyWithoutD(
                            tours[0]?.tourPrice + priceRoom + priceCar
                          )}
                          ₫
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h2 className="tt ">Thông tin nhà xe</h2>
                {showVehicle &&
                  tours[0]?.vehicleList?.map((vehicle, index) => (
                    <div
                      key={vehicle.evehicleId}
                      className=" item-hotel row mx-0 mb-4 wrapper-borderless animate__fadeInUp animate__animated"
                      id={vehicle.evehicleId}
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <div className=" ">
                          <div>
                            Nhà xe:{" "}
                            <span className="hotel-name mb-2 cursor-pointer">
                              {vehicle.evehicleName}
                            </span>
                          </div>
                          <div>
                            Số sao:{" "}
                            <span className="hotel-name mb-2 cursor-pointer">
                              {vehicle.numberOfStarRating}
                            </span>
                          </div>
                          <div>
                            Số điện thoại:{" "}
                            <span className="hotel-name mb-2 cursor-pointer">
                              {vehicle.phoneNumber}
                            </span>
                          </div>
                        </div>
                        <div className="mt-sm-0 mt-2">
                          <div className="title-unit-money mb-1">
                            Giá chỉ từ
                          </div>
                          <div className="unit-money-vnd unit-money-new">
                            {formatCurrencyWithoutD(
                              vehicle.optionList[0].totalPrice
                            )}
                            &nbsp;₫
                          </div>
                          <div className="group-btn flex-shrink-0 d-flex mt-2 ms-3">
                            <button
                              id={vehicle.evehicleId}
                              className="btn-add-to-cart "
                              onClick={() => handleBookCar(vehicle.evehicleId)}
                            >
                              <img
                                src="/car.svg"
                                className=" w-20px"
                                alt={vehicle.evehicleId}
                              />
                              <span className="px-1">Chọn Xe</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                {showCar && (
                  <div className="list-hotels py-2 col-md-11">
                    {selectedCar?.optionList?.map((car, index) => (
                      <div
                        key={index + 1}
                        className="item-hotel row mx-0 mb-4 wrapper-borderless animate__fadeInUp animate__animated"
                      >
                        <div className="col-md-9 p-0">
                          {car.coachList.map((coachDetail) => (
                            <div className=" mb-2" key={coachDetail.coachId}>
                              <div className="d-flex align-items-center justify-content-between">
                                <div className="col-md-10">
                                  <div>
                                    Loại xe:{" "}
                                    <span className="hotel-name">
                                      {coachDetail.name}
                                    </span>
                                  </div>
                                  <div>
                                    Nhà sản xuất:{" "}
                                    <span className="hotel-name">
                                      {coachDetail.manufacturerAndModel}
                                    </span>
                                  </div>
                                  <div>
                                    Tiện nghi:{" "}
                                    <span className="hotel-name">
                                      {coachDetail.additionalServices}
                                    </span>
                                  </div>
                                </div>
                                <div className=" col-md-2 ">
                                  <div className="d-sm-flex align-items-center justify-content-between">
                                    <div className="mt-sm-0 mt-1">
                                      <div className="title-unit-money mb-1">
                                        Giá
                                      </div>
                                      <div className="unit-money-vnd unit-money-new">
                                        {formatCurrencyWithoutD(car.totalPrice)}
                                        &nbsp;₫
                                      </div>
                                    </div>
                                  </div>
                                  <div className="address d-sm-flex align-items-center justify-content-between mt-4">
                                    <div className="group-btn flex-shrink-0 d-flex mt-2 ms-3">
                                      <button
                                        id={coachDetail.coachId}
                                        className="btn-add-to-cart "
                                        onClick={() =>
                                          handleBookCarDetail(car.totalPrice)
                                        }
                                      >
                                        <img
                                          src="/car.svg"
                                          className=" w-20px"
                                          alt={car.evehicleId}
                                        />
                                        <span className="px-1">Chọn Xe</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
            {tours[0]?.tour?.reviewer?.length > 0 && (
              <div className="col-md-6">
                <h4>Danh sách đánh giá</h4>
                {tours[0]?.tour?.reviewer.map((review, index) => (
                  <div key={index} className="review2 mb-2">
                    <div className="avatar2">
                      <img src={review.avatar} alt="Avatar" />
                    </div>
                    <div className="info2">
                      <div className="name2">
                        {review.firstName} {review.lastName}
                      </div>
                      <div className="rating2">
                        {/* Hiển thị số sao */}
                        {Array.from({ length: review.rate }, (_, i) => (
                          <img key={i} src="/star2.svg" alt="Star" />
                        ))}
                      </div>
                      <div className="comment2">{review.comment}</div>
                      <div className="timestamp2">
                        {formatDateAndHour(review.createAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-center flex-column align-items-center pt-5">
          <img src="/sorry.png" alt="sorry" className="sorry-img" />
          <h5 className="sorry-text">
            Xin lỗi vì không tìm thấy tour phù hợp!
          </h5>
          <div className="btn primary__btn w-25 mt-4">
            <a href="/">Về trang chủ</a>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default TourDetail;
