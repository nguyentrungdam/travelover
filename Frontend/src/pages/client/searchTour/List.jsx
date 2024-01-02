import "./list.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { addDays, format } from "date-fns";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import ScrollToTop from "../../../shared/ScrollToTop";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import {
  formatCurrencyWithoutD,
  formatDate,
  saveToLocalStorage,
  validateOriginalDate,
} from "../../../utils/validate";
import { useDispatch, useSelector } from "react-redux";
import { searchTour, searchTour2 } from "../../../slices/tourSlice";
import { vi } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LocationSelect from "../../admin/tours/add-tour/LocationSelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { destinations } from "../../../assets/data/dataAdmin";
import Loading from "../../../components/Loading/Loading";
import ReactPaginate from "react-paginate";
const List = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, tours, totalData } = useSelector((state) => state.tour);
  const [province, setProvince] = useState(
    location.state.selectedLocation
      ? location.state.selectedLocation.province
      : ""
  );
  const [province2, setProvince2] = useState("");
  const [startDate, setStartDate] = useState(location.state.startDate);
  const [numberOfDay, setNumberOfDay] = useState(location.state.numberOfDay);
  const [numberOfAdult, setNumberOfAdult] = useState(
    location.state.numberOfAdult
  );
  const [numberOfChildren, setNumberOfChildren] = useState(
    location.state.numberOfChildren
  );
  const [numberOfRoom, setNumberOfRoom] = useState(location.state.numberOfRoom);
  const [selectedDate, setSelectedDate] = useState(location.state.selectedDate);
  const [isHeaderVisible, setHeaderVisible] = useState(true);
  const [orderBy, setOrderBy] = useState("price");
  const [orderDirection, setOrderDirection] = useState("asc");

  // Phân trang
  const [nextPage, setNextPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 9; // Số mục trên mỗi trang
  useEffect(() => {
    setPageCount(Math.ceil(totalData / itemsPerPage));
  }, [totalData, itemOffset]);
  // Hàm xử lý khi chuyển trang
  const handlePageClick = async (event) => {
    const newOffset = (event.selected * itemsPerPage) % tours.length;
    setItemOffset(newOffset);
    setNextPage(event.selected + 1);
    await dispatch(
      searchTour2({
        keyword: "",
        province,
        startDate,
        numberOfDay,
        numberOfAdult,
        numberOfChildren,
        numberOfRoom,
        pageSize: 9,
        pageNumber: event.selected + 1,
        minPrice: "",
        maxPrice: "",
        ratingFilter: "",
        sortBy: "price",
        order: "asc",
      })
    ).unwrap();
    window.scrollTo(0, 0);
  };
  console.log(totalData);

  useEffect(() => {
    setProvince(location.state.selectedLocation.province);
    const res = dispatch(
      searchTour2({
        keyword: "",
        province,
        startDate,
        numberOfDay,
        numberOfAdult,
        numberOfChildren,
        numberOfRoom,
        pageSize: 9,
        pageNumber: 1,
        minPrice: "",
        maxPrice: "",
        ratingFilter: "",
        sortBy: "price",
        order: "asc",
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
  console.log(tours);
  const tomorrow = addDays(new Date(), 1);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const handlePriceChange = (value) => {
    setPriceRange(value);
  };
  const [min, max] = priceRange;
  const minPrice = min * 100000;
  const maxPrice = max * 100000;

  const handleSelectLocation = (location) => {
    setProvince(location.province);
  };

  const handleDateChange = (date) => {
    const formattedDisplayDate = format(date, "yyyy-MM-dd");
    setSelectedDate(date);
    setStartDate(formattedDisplayDate);
  };
  const handleOption = (category, operation) => {
    if (operation === "decrease") {
      if (category === "adults" && numberOfAdult > 1) {
        setNumberOfAdult(numberOfAdult - 1);
      } else if (category === "children" && numberOfChildren > 0) {
        setNumberOfChildren(numberOfChildren - 1);
      } else if (category === "rooms" && numberOfRoom > 1) {
        setNumberOfRoom(numberOfRoom - 1);
      }
    } else if (operation === "increase") {
      if (category === "adults") {
        setNumberOfAdult(numberOfAdult + 1);
      } else if (category === "children") {
        setNumberOfChildren(numberOfChildren + 1);
      } else if (category === "rooms" && numberOfRoom < numberOfAdult) {
        setNumberOfRoom(numberOfRoom + 1);
      }
    }
  };

  const handleViewDetailOrPayNow = (tourId, number) => {
    if (number === 1) {
      navigate(`/tours/tour-detail/${tourId}`, {
        state: {
          province: province || location.state.province,
          startDate,
          numberOfDay,
          numberOfAdult,
          numberOfChildren,
          numberOfRoom,
        },
      });
    } else {
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
    }
  };
  const handleClickProvince = (location) => {
    window.scrollTo(0, 0);
    setProvince2(location);
    dispatch(
      searchTour2({
        keyword: "",
        province: location,
        startDate,
        numberOfDay,
        numberOfAdult,
        numberOfChildren,
        numberOfRoom,
        pageSize: 9,
        pageNumber: 1,
        minPrice: "",
        maxPrice: "",
        ratingFilter: "",
        sortBy: "price",
        order: "asc",
      })
    ).unwrap();
  };
  const handleSearch = () => {
    const fetchData = async () => {
      await dispatch(
        searchTour2({
          keyword: "",
          province: province2 ? province2 : province,
          startDate,
          numberOfDay,
          numberOfAdult,
          numberOfChildren,
          numberOfRoom,
          pageSize: 9,
          pageNumber: 1,
          minPrice: `${minPrice}`,
          maxPrice: `${maxPrice}`,
          sortBy: orderBy,
          order: orderDirection,
        })
      ).unwrap();
    };
    fetchData();
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
                    searchProvince={
                      province2
                        ? province2
                        : location.state.selectedLocation.province
                    }
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
                      minDate={tomorrow} // Chỉ cho phép chọn ngày từ mai trở đi
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

                  <div className="tour-search-result__filter__block mb-2 d-flex gap-1">
                    <h5 className="s-title me-2">Người lớn: </h5>
                    <button
                      disabled={numberOfAdult <= 1}
                      className="optionCounterButton"
                      onClick={() => handleOption("adults", "decrease")}
                    >
                      -
                    </button>
                    <span className="optionCounterNumber mx-3 fz17 fw-bold">
                      {numberOfAdult}
                    </span>
                    <button
                      className="optionCounterButton"
                      onClick={() => handleOption("adults", "increase")}
                    >
                      +
                    </button>
                  </div>
                  <div className="tour-search-result__filter__block mb-2 d-flex gap-1">
                    <h5 className="s-title me-2">Trẻ em: </h5>
                    <button
                      disabled={numberOfChildren < 1}
                      className="optionCounterButton"
                      style={{ marginLeft: "24px" }}
                      onClick={() => handleOption("children", "decrease")}
                    >
                      -
                    </button>
                    <span className="optionCounterNumber mx-3 fz17 fw-bold">
                      {numberOfChildren}
                    </span>
                    <button
                      className="optionCounterButton"
                      onClick={() => handleOption("children", "increase")}
                    >
                      +
                    </button>
                  </div>
                  <div className="tour-search-result__filter__block mb-2 d-flex gap-1">
                    <h5 className="s-title me-2">Số phòng: </h5>
                    <button
                      disabled={numberOfRoom <= 1}
                      className="optionCounterButton"
                      onClick={() => handleOption("rooms", "decrease")}
                    >
                      -
                    </button>
                    <span className="optionCounterNumber mx-3 fz17 fw-bold">
                      {numberOfRoom}
                    </span>
                    <button
                      className="optionCounterButton"
                      onClick={() => handleOption("rooms", "increase")}
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
                  <div className="tour-search-result__filter__block mb-3 ">
                    <h5 className="s-title">Sắp xếp theo:</h5>
                    <div className="d-flex order-wrap">
                      <select
                        className="form-control dropdown Filter"
                        id="orderBy"
                        name="orderBy"
                        onChange={(e) => setOrderBy(e.target.value)}
                      >
                        <option value="price">Giá</option>
                        <option value="popular">Độ phổ biến</option>
                      </select>
                      <select
                        className="form-control dropdown Filter ms-2"
                        id="orderDirection"
                        name="orderDirection"
                        onChange={(e) => setOrderDirection(e.target.value)}
                      >
                        <option value="asc">Thấp -&gt; cao</option>
                        <option value="desc">Cao -&gt; thấp</option>
                      </select>
                    </div>
                  </div>
                  <div className="btn-block1 mx-0" onClick={handleSearch}>
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      className="me-1"
                    />
                    Áp dụng
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
                        Chúng tôi tìm thấy{" "}
                        <strong>
                          {totalData > 9
                            ? totalData
                            : tours?.length || totalData}
                        </strong>{" "}
                        tour cho Quý khách.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row row-cols-1 row-cols-md-3 g-4">
                  {tours?.map((item, index) => (
                    <div
                      className="col promotion-search-result__result__item"
                      key={index}
                    >
                      <div className="card tour-item">
                        <div className="position-relative">
                          <div className="tour-item__image">
                            <img
                              src={item?.tour?.thumbnailUrl}
                              id="imgaddtour_0ae974d0-6bf1-489c-9949-1d74ce7d887b"
                              className="card-img-top img-fluid"
                              alt={item?.tour?.tourTitle}
                              width="309"
                              height="220"
                              loading="lazy"
                            />

                            {item.tour?.discount.isDiscount ? (
                              <div className="tour-item__image-inner__top">
                                <span className=" position-relative">
                                  <svg
                                    width="20"
                                    className="sale-svg "
                                    height="36"
                                    viewBox="0 0 10 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M9.23077 0H4.23077L0 7.82222L3.5 9.14286V16L10 5.68889L6.53846 4.62222L9.23077 0Z"
                                      fill="url(#paint0_linear_2216_10611)"
                                    ></path>
                                    <defs>
                                      <linearGradient
                                        id="paint0_linear_2216_10611"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="16"
                                        gradientUnits="userSpaceOnUse"
                                      >
                                        <stop stop-color="#ff0000"></stop>
                                        <stop
                                          offset="1"
                                          stop-color="#dde81f"
                                        ></stop>
                                      </linearGradient>
                                    </defs>
                                  </svg>
                                  <span className="ms-1">
                                    -{item.tour?.discount.discountValue}%
                                  </span>
                                </span>
                              </div>
                            ) : null}

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
                            Thời gian thích hợp:{" "}
                            {validateOriginalDate(
                              item.tour?.reasonableTime.startDate
                            )}{" "}
                            đến{" "}
                            {validateOriginalDate(
                              item.tour?.reasonableTime.endDate
                            )}
                          </p>
                          <h3 className="card-text tour-item__title mb-1">
                            {item.tour?.tourTitle}
                          </h3>
                          <div className="tour-item__code">
                            <div>Đối tượng thích hợp:</div>
                            <span className="font-weight-bold">
                              {" "}
                              {item.tour?.suitablePerson}
                            </span>
                          </div>
                          <p className="tour-item__departure mb-2">
                            Mã tour:{" "}
                            <span className="font-weight-bold">
                              {item.tour?.tourId}
                            </span>
                          </p>
                          <p className="tour-item__departure mb-2">
                            Điểm đến:{" "}
                            <span className="font-weight-bold">
                              {item.tour?.address.province}
                            </span>
                          </p>
                          <p className="tour-item__departure mb-2">
                            Khách sạn:{" "}
                            <span className="font-weight-bold">
                              {item.hotel?.hotelName}
                            </span>
                          </p>
                          <p className="tour-item__departure mb-2">
                            Số phòng:{" "}
                            <span className="font-weight-bold">
                              {item.hotel?.room?.length}
                            </span>
                          </p>{" "}
                          <p className="tour-item__departure mb-2">
                            Ngày đi:{" "}
                            <span className="font-weight-bold">
                              {formatDate(startDate)}
                            </span>{" "}
                            - {item.tour?.numberOfDay} ngày
                          </p>
                          <div className="tour-item__price mb-2 w-100">
                            <div className="tour-item__price__wrapper">
                              <div className=" ">
                                <span className="tour-item__price--current__number pe-2 mb-0">
                                  {formatCurrencyWithoutD(item?.totalPrice)}₫
                                </span>
                                {item.tour?.discount.isDiscount ? (
                                  <span className="tour-item__price--old pe-2 mb-0">
                                    {formatCurrencyWithoutD(
                                      item?.totalPriceNotDiscount
                                    )}
                                    ₫
                                  </span>
                                ) : null}
                              </div>
                              <div className="tour-item__price--current mt-2">
                                <div className="btn-book">
                                  <div
                                    className=" btn-sm btnOptionTour"
                                    onClick={() =>
                                      handleViewDetailOrPayNow(
                                        item.tour?.tourId,
                                        2
                                      )
                                    }
                                  >
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
                                    handleViewDetailOrPayNow(
                                      item.tour?.tourId,
                                      1
                                    )
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

                {totalData < 10 ? (
                  " "
                ) : (
                  <div className="contain-pagination">
                    <ReactPaginate
                      breakLabel="..."
                      nextLabel=">"
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={5}
                      pageCount={pageCount}
                      previousLabel="<"
                      renderOnZeroPageCount={null}
                      className="pagination"
                      pageLinkClassName={pageCount === 1 ? `a active` : "a"}
                      activeLinkClassName="active"
                      pageClassName="li"
                      previousClassName="li"
                      nextClassName=" li"
                      forcePage={nextPage - 1}
                    />
                  </div>
                )}
                {totalData === 0 ? (
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
                      <div
                        className="card destination-item cursor-pointer"
                        onClick={() =>
                          handleClickProvince(destination.province)
                        }
                      >
                        <div className="mb-3 position-relative destination-item__image">
                          <div>
                            <img
                              src={destination.imageUrl}
                              className="card-img-top1 img-fluid"
                              alt={destination.title}
                            />
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="card-title destination-item__title">
                            {destination.title}
                          </div>
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
