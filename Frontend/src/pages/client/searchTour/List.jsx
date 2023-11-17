import "./list.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import ScrollToTop from "../../../shared/ScrollToTop";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { formatCurrencyWithoutD } from "../../../utils/validate";
import { useDispatch, useSelector } from "react-redux";
import { searchTour } from "../../../slices/tourSlice";
import { vi } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LocationSelect from "../../admin/tours/add-tour/LocationSelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { destinations } from "../../../assets/data/dataAdmin";
import Loading from "../../../components/Loading/Loading";
import ReactPaginate from "react-paginate";
const List = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, tours } = useSelector((state) => state.tour);

  const [province, setProvince] = useState(
    location.state.selectedLocation
      ? location.state.selectedLocation.province
      : ""
  );
  const [startDate, setStartDate] = useState(location.state.startDate);
  const [numberOfDay, setNumberOfDay] = useState(location.state.numberOfDay);
  const [numberOfPeople, setNumberOfPeople] = useState(
    location.state.numberOfPeople
  );
  const [selectedDate, setSelectedDate] = useState(location.state.selectedDate);
  const [isHeaderVisible, setHeaderVisible] = useState(true);
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  // Phân trang
  // const [currentPage, setCurrentPage] = useState(0);
  // const itemsPerPage = 12; // Số mục trên mỗi trang
  // const pageCount = Math.ceil(tours.length / itemsPerPage);
  // // Lấy mục của trang hiện tại
  // const currentItems = tours.slice(
  //   currentPage * itemsPerPage,
  //   (currentPage + 1) * itemsPerPage
  // );
  //  // Hàm xử lý khi chuyển trang
  //  const handlePageClick = (data) => {
  //   const selectedPage = data.selected;
  //   setCurrentPage(selectedPage);
  // };
  console.log(tours);

  useEffect(() => {
    setProvince(location.state.selectedLocation.province);
    dispatch(
      searchTour({
        province,
        startDate,
        numberOfDay,
        numberOfPeople,
      })
    ).unwrap();
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    window.scrollTo(0, 0);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const res = await dispatch(
        searchTour({
          province,
          startDate,
          numberOfDay,
          numberOfPeople,
        })
      ).unwrap();
      console.log(res);
    };
    fetchData();
  }, [dispatch, province, startDate, numberOfDay, numberOfPeople]);
  console.log(province, startDate, numberOfDay, numberOfPeople);
  const handleSelectLocation = (location) => {
    setProvince(location.province);
  };
  const [priceRange, setPriceRange] = useState([0, 100]);
  const handlePriceChange = (value) => {
    setPriceRange(value);
  };
  const handleDateChange = (date) => {
    const formattedDisplayDate = format(date, "yyyy-MM-dd");
    setSelectedDate(date);
    setStartDate(formattedDisplayDate);
  };
  const handleOption = (operation) => {
    if (operation === "decrease" && numberOfPeople > 1) {
      setNumberOfPeople(numberOfPeople - 1);
    } else if (operation === "increase") {
      setNumberOfPeople(numberOfPeople + 1);
    }
  };
  const handleCheckboxChange = (checkboxNumber) => {
    if (checkboxNumber === 1) {
      setIsChecked1(!isChecked1);
    } else if (checkboxNumber === 2) {
      setIsChecked2(!isChecked2);
    }
  };
  const handleViewDetail = (tourId) => {
    navigate(`/tours/tour-detail/${tourId}`, {
      state: {
        province: province || location.state.province,
        startDate,
        numberOfDay,
        numberOfPeople,
      },
    });
  };
  return (
    <>
      {isHeaderVisible ? <Header /> : " "}

      <div className="container">
        <div className="row">
          <div className="col-md-3 col-12 sidebar sidebar-filter">
            <div className="tour-search-result__filter__brand bg-light p-3 d-flex justify-content-between align-items-center">
              <span>Lọc kết quả</span>
            </div>
            <div className="sidebar-inner">
              <h2 className="page-title d-none">Bộ lọc tìm kiếm</h2>
              <div>
                <div className="tour-search-result__filter__heading  px-1 py-2 d-flex justify-content-between align-items-center">
                  <h5 className="s-title me-1 mt-1 ">Điểm đến: </h5>
                  <LocationSelect
                    searchProvince={location.state.selectedLocation.province}
                    onSelectLocation={handleSelectLocation}
                    pickProvince
                  />
                </div>
                <div className="px-3 py-2">
                  <div className="tour-search-result__filter__block mb-2 d-flex">
                    <h5 className="date-go-to-back-title s-title me-2">
                      Ngày đi:{" "}
                    </h5>
                    <DatePicker
                      id="datepicker"
                      className="datepicker m-t2 fz17"
                      selected={selectedDate}
                      onChange={handleDateChange}
                      value={selectedDate}
                      locale={vi} // Thiết lập ngôn ngữ Tiếng Việt
                      dateFormat="dd-MM-yyyy" // Định dạng ngày tháng
                      minDate={new Date()} // Chỉ cho phép chọn ngày từ hôm nay trở đi
                    />
                  </div>
                  <div className="tour-search-result__filter__block mb-2 d-flex align-items-center">
                    <h5 className="s-title me-2">Số ngày: </h5>
                    <select
                      value={numberOfDay}
                      className="select-search m-b2 fz17"
                      onChange={(event) => {
                        setNumberOfDay(event.target.value);
                      }}
                    >
                      <option value="1-3">1-3 ngày</option>
                      <option value="4-7">4-7 ngày</option>
                      <option value="8-14">8-14 ngày</option>
                      <option value="15-30">15 ngày trở lên</option>
                    </select>
                  </div>

                  <div className="tour-search-result__filter__block mb-2 d-flex">
                    <h5 className="s-title me-2">Số người: </h5>
                    <button
                      disabled={numberOfPeople <= 1}
                      className="optionCounterButton"
                      onClick={() => handleOption("decrease")}
                    >
                      -
                    </button>
                    <span className="optionCounterNumber mx-2 fz17 fw-bold">
                      {numberOfPeople}
                    </span>
                    <button
                      className="optionCounterButton"
                      onClick={() => handleOption("increase")}
                    >
                      +
                    </button>
                  </div>

                  <h5 className="s-title">Ngân sách của Quý khách</h5>
                  <div className="ranger-price">
                    <div className="range-text">
                      <div className="range-text-value">
                        <div dir="auto" className="price-range">
                          {formatCurrencyWithoutD(priceRange[0] * 100000)} VND
                        </div>
                      </div>
                      <div className="range-text-value">
                        <div dir="auto" className="price-range">
                          {formatCurrencyWithoutD(priceRange[1] * 100000)} VND
                        </div>
                      </div>
                      <div className="line-range"></div>
                    </div>
                    <Slider
                      min={0}
                      max={100}
                      range
                      value={priceRange}
                      onChange={handlePriceChange}
                      className="range-slider"
                    />
                  </div>
                  <h5 className="s-title">Hiển thị những chuyến đi có</h5>
                  <div className="filter-sale">
                    <div className="switch-container">
                      <label className="switch-label">Khuyễn mãi:</label>
                      <input
                        type="checkbox"
                        className="switch-input"
                        id="switch1"
                        checked={isChecked1}
                        onChange={() => handleCheckboxChange(1)}
                      />
                      <div className="switch-slider"></div>
                    </div>

                    <div className="switch-container">
                      <label className="switch-label">Còn chỗ:</label>
                      <input
                        type="checkbox"
                        className="switch-input left-203"
                        id="switch2"
                        checked={isChecked2}
                        onChange={() => handleCheckboxChange(2)}
                      />
                      <div className="switch-slider"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <div className="col-md-9 col-12 main-content">
              <section className="promotion-search-result__result">
                <div>
                  <div className="d-none d-lg-block">
                    <div className="order-by">
                      <div className="order-by-title">
                        Chúng tôi tìm thấy <strong>{tours.length}</strong> tours
                        cho Quý khách.
                      </div>
                      <div className="order-by-left">
                        <div className="order-wrap">
                          <span>Sắp xếp theo</span>
                          <select
                            className="form-control dropdown Filter"
                            id="sllOrder"
                            name="sllOrder"
                          >
                            <option value="-1">--- Chọn ---</option>
                            <option value="0">Theo giá thấp -&gt; cao</option>
                            <option value="1">Theo giá cao -&gt; thấp</option>
                            <option value="2">Giảm giá nhiều nhất</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row row-cols-1 row-cols-md-3 g-4">
                  {tours.map((item, index) => (
                    <div
                      className="col promotion-search-result__result__item"
                      key={index}
                    >
                      <div className="card tour-item">
                        <div className="position-relative">
                          <div className="tour-item__image">
                            <a
                              href="/tourNDSGN869-021-191123XE-V-F/sieu-sale-🔥-|-vung-tau-sac-mau-bien-xanh-|-kich-cau-du-lich-.aspx?LM=0"
                              title="Siêu Sale 🔥 | Vũng Tàu - Sắc Màu Biển Xanh | Kích cầu du lịch "
                            >
                              <img
                                src="https://media.travel.com.vn/destination/tf_230614013334_101846_BAI BIEN THUY VAN (minh hoa).jpg"
                                id="imgaddtour_0ae974d0-6bf1-489c-9949-1d74ce7d887b"
                                className="card-img-top img-fluid"
                                alt="Siêu Sale 🔥 | Vũng Tàu - Sắc Màu Biển Xanh | Kích cầu du lịch "
                                width="309"
                                height="220"
                                loading="lazy"
                              />
                            </a>

                            <div className="tour-item__image-inner__bottom">
                              <span className="tour-item__image-inner__bottom__category">
                                <img
                                  className="img-giatot"
                                  src="https://cdn-icons-png.flaticon.com/512/4966/4966633.png"
                                  alt="money"
                                />{" "}
                                Giá Tốt
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="card-body p-3">
                          <p className="tour-item__date mb-1">
                            19/11/2023 - Trong ngày - Giờ đi: 05:30
                          </p>
                          <h3 className="card-text tour-item__title mb-1">
                            <a
                              href="/tourNDSGN869-021-191123XE-V-F/sieu-sale-🔥-|-vung-tau-sac-mau-bien-xanh-|-kich-cau-du-lich-.aspx?LM=0"
                              title="Siêu Sale 🔥 | Vũng Tàu - Sắc Màu Biển Xanh | Kích cầu du lịch "
                            >
                              {item.tour.tourTitle}
                            </a>
                          </h3>
                          <div className="tour-item__code">
                            <div>Đối tượng thích hợp:</div>
                            <span className="font-weight-bold">
                              {" "}
                              {item.tour.suitablePerson}
                            </span>
                          </div>
                          <p className="tour-item__departure mb-3">
                            Điểm đến:{" "}
                            <span className="font-weight-bold">
                              {item.tour.address.province}
                            </span>
                          </p>
                          <div className="tour-item__price mb-2 w-100">
                            <div className="tour-item__price__wrapper">
                              <div className="tour-item__price--old"></div>
                              <div className="tour-item__price--current fix-leftalign">
                                <span className="tour-item__price--current__number pe-2 mb-0">
                                  299,000₫
                                </span>
                              </div>
                              <div className="tour-item__price--current">
                                <div className="btn-book">
                                  <div className=" btn-sm btnOptionTour">
                                    <FontAwesomeIcon
                                      className="me-1"
                                      icon={faCartShopping}
                                    />
                                    Đặt ngay
                                  </div>
                                </div>
                                <div
                                  className="btn-block"
                                  onClick={() =>
                                    handleViewDetail(item.tour.tourId)
                                  }
                                >
                                  Xem chi tiết
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {tours.length === 0 ? (
                  <div className="d-flex justify-content-center flex-column align-items-center pt-5">
                    <img src="/sorry.png" alt="sorry" className="sorry-img" />
                    <h5 className="sorry-text">
                      Xin lỗi vì không tìm thấy tour phù hợp!
                    </h5>
                  </div>
                ) : null}
              </section>

              <section className="hot-destination">
                <h3 className="promotion-search-result__main__title fw-bold mb-3">
                  Các điểm đến ưa chuộng
                </h3>
                <div className="row row-cols-1 row-cols-md-4 g-4">
                  {destinations.map((destination, index) => (
                    <div className="col" key={index}>
                      <div className="card destination-item">
                        <div className="mb-3 position-relative destination-item__image">
                          <a href={destination.link}>
                            <img
                              src={destination.imageUrl}
                              className="card-img-top1 img-fluid"
                              alt={destination.title}
                            />
                          </a>
                        </div>
                        <div className="card-body">
                          <a
                            href={destination.link}
                            className="card-title destination-item__title"
                          >
                            {destination.title}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
      <ScrollToTop />
      <Footer />
    </>
  );
};

export default List;
