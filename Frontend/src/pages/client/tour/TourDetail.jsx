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
  const numberOfPeople = state ? state.numberOfPeople : "";
  console.log(tourId, province, startDate, numberOfDay, numberOfPeople);
  const [activeDay, setActiveDay] = useState(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    const res = dispatch(
      searchTour({
        keyword: tourId,
        province,
        startDate,
        numberOfDay,
        numberOfPeople,
      })
    ).unwrap();
  }, []);
  console.log(tours);
  const handleOrder = () => {
    navigate(`/tours/tour-booking`);
  };

  const handleOpenOverlay = (i) => {
    setSlideNumber(i);
    setOpen(true);
    document.body.classList.add("no-scroll");
  };
  const handleCloseOverlay = () => {
    setOpen(false);
    document.body.classList.remove("no-scroll");
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
              <img src={photos[slideNumber].src} alt="" className="sliderImg" />
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
            <h1 className="hotelTitle">{tours[0]?.tour?.tourTitle}</h1>
            <div className="d-flex gap-2  align-items-center">
              <p className="mb-0">
                <span className="price-total ">1.000.000đ </span>/khách
              </p>
              <button className="bookNow" onClick={() => handleOrder()}>
                Đặt Ngay
              </button>
            </div>
          </div>
          <div className="hotelAddress">
            <FontAwesomeIcon icon={faLocationDot} />
            <span>Elton St 125 New york</span>
          </div>
          <span className="hotelDistance">
            Excellent location – 500m from center
          </span>
          <span className="hotelPriceHighlight">
            Book a stay over $114 at this property and get a free airport taxi
          </span>
          <div className="hotelImages">
            {photos.map((photo, i) => (
              <div className="hotelImgWrapper" key={i}>
                <img
                  onClick={() => handleOpenOverlay(i)}
                  src={photo.src}
                  alt=""
                  className="hotelImg"
                />
              </div>
            ))}
          </div>
          <div className="hotelDetails">
            <div className="hotelDetailsTexts col-md-7">
              <h1 className="hotelTitle">Stay in the heart of City</h1>
              <p className="hotelDesc">
                Located a 5-minute walk from St. Florian's Gate in Krakow, Tower
                Street Apartments has accommodations with air conditioning and
                free WiFi. The units come with hardwood floors and feature a
                fully equipped kitchenette with a microwave, a flat-screen TV,
                and a private bathroom with shower and a hairdryer. A fridge is
                also offered, as well as an electric tea pot and a coffee
                machine. Popular points of interest near the apartment include
                Cloth Hall, Main Market Square and Town Hall Tower. The nearest
                airport is John Paul II International Kraków–Balice, 16.1 km
                from Tower Street Apartments, and the property offers a paid
                airport shuttle service.
              </p>
              <div className="group-services">
                {servicesData.map((service, index) => (
                  <div className="item" key={index}>
                    <img src="/noavatar.png" className="icon-img" alt="" />
                    <label>{service.label}</label>
                    <p>{service.value}</p>
                  </div>
                ))}
              </div>
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
                      <td>Người lớn (Từ 12 tuổi trở lên)</td>
                      <td className="t-price">4,990,000 đ</td>
                    </tr>
                    <tr>
                      <td>Trẻ em (Từ 5 - 11 tuổi)</td>
                      <td className="t-price">3,742,500 đ</td>
                    </tr>
                    <tr>
                      <td>Trẻ nhỏ (Từ 2 - 4 tuổi)</td>
                      <td className="t-price">2,300,000 đ</td>
                    </tr>
                    <tr>
                      <td>Em bé ( Dưới 2 tuổi )</td>
                      <td className="t-price">230,000 đ</td>
                    </tr>
                    <tr className="total1">
                      <td>Tổng cộng</td>
                      <td className="t-price">320 đ</td>
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
                    {tripDays.map((day, index) => (
                      <div key={index} className={`day day-0${day.day}`}>
                        <div className="wrapper">
                          <span className="date-left">Ngày</span>
                          <a
                            href={`#day-0${day.day}`}
                            className={`date-center  ${
                              activeDay === day.day ? "active1" : ""
                            }`}
                            onClick={() => setActiveDay(day.day)}
                          >
                            {day.day}
                          </a>
                          <span className="date-right">
                            <span className="date-hotel">{day.date}</span>
                            <span className="location">{day.location}</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-md-8 col-12 right timeline-section">
                  {tripDays.map((day, index) => (
                    <div key={index}>
                      <h3 id={`day-0${day.day}`}>
                        Ngày {day.day} - {day.location}
                      </h3>
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
