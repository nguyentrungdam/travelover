import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../../components/Header/Header";
import Footer from "../../../../components/Footer/Footer";
import "./TourGuideDetail.css";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../../components/Loading/Loading";
import {
  formatCurrencyWithoutD,
  formatDate,
  validateOriginalDate,
} from "../../../../utils/validate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from "react-paginate";
import { searchTour } from "../../../../slices/tourSlice";
import { addDays, format } from "date-fns";
const TourGuideDetail = ({ data }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, tours, totalData } = useSelector((state) => state.tour);
  const { id } = useParams();
  // Tìm kiếm bài viết theo ID trong mảng data
  const selectedBlog = data.find((blog) => blog.id.toString() === id);
  // Kiểm tra nếu không tìm thấy bài viết
  const tomorrow = addDays(new Date(), 1);
  useEffect(() => {
    const res = dispatch(
      searchTour({
        keyword: "",
        province: selectedBlog.province,
        startDate: format(tomorrow, "yyyy-MM-dd"),
        numberOfDay: "4-7",
        numberOfAdult: 1,
        numberOfChildren: 0,
        numberOfRoom: 1,
        pageSize: 9,
        pageNumber: 1,
        minPrice: "",
        maxPrice: "",
        ratingFilter: "",
        sortBy: "price",
        order: "asc",
      })
    ).unwrap();
  }, []);
  const handleViewDetailOrPayNow = (tourId, number) => {
    if (number === 1) {
      navigate(`/tours/tour-detail/${tourId}`, {
        state: {
          province: selectedBlog.province,
          startDate: format(tomorrow, "yyyy-MM-dd"),
          numberOfDay: "4-7",
          numberOfAdult: 1,
          numberOfChildren: 0,
          numberOfRoom: 1,
        },
      });
    } else {
      navigate(`/tours/tour-booking/${tourId}`, {
        state: {
          province: selectedBlog.province,
          startDate: format(tomorrow, "yyyy-MM-dd"),
          numberOfDay: "4-7",
          numberOfAdult: 1,
          numberOfChildren: 0,
          numberOfRoom: 1,
        },
      });
    }
  };
  if (!selectedBlog) {
    return <div>Không tìm thấy bài viết</div>;
  }
  return (
    <div>
      <Header />
      <div className="container d-flex justify-content-center my-3">
        <div className="col-lg-12 col-12 ">
          <div className="selectedBlog-blog selectedBlog-list ">
            <h3 className="fw-bold  mb-3">{selectedBlog.title}</h3>
            <img
              className="lazyload loaded w-75 mb-2 img-radius-0375 "
              src={selectedBlog.image}
              data-src={selectedBlog.image}
              alt={selectedBlog.title}
            />
            <div className="block-content">
              <div className="time-post mb-2">
                <span className="mr-2 time">
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fal"
                    data-icon="clock"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="svg-inline--fa fa-clock fa-w-16 me-2"
                  >
                    <path
                      fill="currentColor"
                      d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm216 248c0 118.7-96.1 216-216 216-118.7 0-216-96.1-216-216 0-118.7 96.1-216 216-216 118.7 0 216 96.1 216 216zm-148.9 88.3l-81.2-59c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h14c6.6 0 12 5.4 12 12v146.3l70.5 51.3c5.4 3.9 6.5 11.4 2.6 16.8l-8.2 11.3c-3.9 5.3-11.4 6.5-16.8 2.6z"
                      className=""
                    ></path>
                  </svg>
                  {selectedBlog.date}
                </span>
                <span>
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="user"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    className="svg-inline--fa fa-user fa-w-14 ms-2"
                  >
                    <path
                      fill="currentColor"
                      d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"
                      className=""
                    ></path>
                  </svg>{" "}
                  {selectedBlog.author}
                </span>
              </div>
              <p className="justify summary  d-lg-block">
                {selectedBlog.summary}
              </p>
            </div>
            {loading ? (
              <Loading />
            ) : (
              <div className="col-md-12 col-12 main-content">
                <section className="promotion-search-result__result pt-2">
                  <div className="order-by-title mb-2">
                    {totalData > 0 ? (
                      <strong>
                        {" "}
                        Các tour đi đến {selectedBlog.province} với giá rẻ nhất:
                      </strong>
                    ) : null}
                  </div>
                  <div className="row row-cols-1 row-cols-md-4 g-4">
                    {tours?.slice(0, 4).map((item, index) => (
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
                                {formatDate(tomorrow)}
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
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TourGuideDetail;
