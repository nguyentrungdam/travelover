import "./tour.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { photos, servicesData, tripDays } from "../../../assets/data/dataAdmin";
import ScrollToTop from "../../../shared/ScrollToTop";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchTour } from "../../../slices/tourSlice";
import {
  FormatLine,
  formatCurrencyWithoutD,
  saveToLocalStorage,
  validateOriginalDate,
} from "../../../utils/validate";

const TourDetail = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, tours } = useSelector((state) => state.tour);
  const { tourId } = useParams();
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const { state } = location;
  const province = state ? state.province : "";
  const startDate = state ? state.startDate : "";
  const numberOfDay = state ? state.numberOfDay : "";
  const numberOfAdult = state ? state.numberOfAdult : 1;
  const numberOfChildren = state ? state.numberOfChildren : 1;
  const numberOfRoom = state ? state.numberOfRoom : 1;

  const [activeDay, setActiveDay] = useState(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    const res = dispatch(
      searchTour({
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
      newSlideNumber = slideNumber === 0 ? 5 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === 5 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber);
  };

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
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="hotelTitle col-md-6">{tours[0]?.tour?.tourTitle}</h1>
            <div className="col-md-6 d-flex gap-2  align-items-center justify-content-end">
              <p className="mb-0">
                <span className="price-total ">
                  {formatCurrencyWithoutD(tours[0]?.totalPrice)}₫{" "}
                </span>
                /khách
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
          <div className="hotelImages">
            {tours[0]?.tour?.image.map((photo, i) => (
              <div className="hotelImgWrapper" key={i}>
                <img
                  onClick={() => handleOpenOverlay(i)}
                  src={photo}
                  alt=""
                  className="hotelImg"
                />
              </div>
            ))}
          </div>
          <div className="hotelDetails">
            <div className="hotelDetailsTexts col-md-7">
              <p className="hotelDesc">{tours[0]?.tour?.tourDescription}</p>
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
                  <p>{tours[0]?.hotel?.hotelName} </p>
                </div>
              </div>
              <h5>Chính sách và điều khoản</h5>
              <FormatLine text={tours[0]?.tour?.termAndCondition} />
            </div>
            <div className="hotelDetailsPrice col-md-5">
              <h2>Chi tiết giá tour</h2>
              <div className="table-price">
                <table>
                  <tbody>
                    <tr>
                      <th className="l1">Dịch vụ</th>
                      <th className="l2">Giá </th>
                    </tr>
                    <tr>
                      <td>Người lớn</td>
                      <td className="t-price">
                        {numberOfAdult}*
                        {formatCurrencyWithoutD(tours[0]?.tour?.priceOfAdult)}₫
                        ={" "}
                        {formatCurrencyWithoutD(
                          tours[0]?.tour?.priceOfAdult * numberOfAdult
                        )}
                        ₫
                      </td>
                    </tr>
                    {numberOfChildren > 0 ? (
                      <tr>
                        <td>Trẻ em</td>
                        <td className="t-price">
                          {numberOfChildren}*
                          {formatCurrencyWithoutD(
                            tours[0]?.tour?.priceOfChildren
                          )}
                          ₫ ={" "}
                          {formatCurrencyWithoutD(
                            tours[0]?.tour?.priceOfAdult * numberOfChildren
                          )}
                          ₫
                        </td>
                      </tr>
                    ) : null}

                    {/* <tr>
                      <td>Khách sạn:</td>
                    </tr>
                    {tours[0]?.hotel?.room.map((room, i) => (
                      <tr key={room.roomId}>
                        <td className="ps-4 p-0">Phòng {i + 1}</td>
                        <td className="t-price p-0">
                          {formatCurrencyWithoutD(room.price)}₫
                        </td>
                      </tr>
                    ))} */}

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
                  {tours[0]?.tour?.tourDetailList.map((day, index) => (
                    <div key={index}>
                      <h3 id={`day-0${index + 1}`}>{day.title}</h3>
                      <div className="excerpt">
                        <span className="line"></span>
                        <div style={{ textAlign: "justify" }}>
                          {day.description}
                        </div>
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
