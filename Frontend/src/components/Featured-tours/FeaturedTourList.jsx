import React, { useEffect } from "react";
import Loading from "../Loading/Loading";
import { useDispatch, useSelector } from "react-redux";
import { getToursDiscount } from "../../slices/tourSlice";
import {
  formatCurrencyWithoutD,
  formatDate,
  validateOriginalDate,
} from "../../utils/validate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { addDays, format } from "date-fns";

const FeaturedTourList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, tours } = useSelector((state) => state.tour);
  useEffect(() => {
    const res = dispatch(getToursDiscount()).unwrap();
  }, []);
  console.log(tours);
  const tomorrow = addDays(new Date(), 1);

  const handleViewDetailOrPayNow = (tour, number, priceRoom, priceCar) => {
    console.log(priceRoom);
    console.log(priceCar);
    const roomId = tours[0]?.hotel2?.roomList[0]?.roomId;
    const roomIdList = roomId ? [roomId] : [];
    console.log(roomId);
    console.log(roomIdList);
    if (number === 1) {
      navigate(`/tours/tour-detail/${tour.tourId}`, {
        state: {
          province: tour.address.province,
          startLocation: "",
          startDate: format(tomorrow, "yyyy-MM-dd"),
          numberOfDay: mapDaysToOptionValue(tour.numberOfDay),
          numberOfAdult: 1,
          numberOfChildren: 0,
          numberOfRoom: 1,
          priceRoom: priceRoom,
          priceCar: priceCar,
        },
      });
    } else {
      navigate(`/tours/tour-booking/${tour.tourId}`, {
        state: {
          province: tour.address.province,
          startLocation: "",
          startDate: format(tomorrow, "yyyy-MM-dd"),
          numberOfDay: mapDaysToOptionValue(tour.numberOfDay),
          numberOfAdult: 1,
          numberOfChildren: 0,
          numberOfRoom: 1,
          priceRoom: priceRoom,
          priceCar: priceCar,
          vehicleId: tours[0]?.vehicle.evehicleId,
          hotelId: tours[0]?.hotel2.ehotelId,
          roomIdList,
        },
      });
    }
  };
  function mapDaysToOptionValue(days) {
    if (days >= 1 && days <= 3) {
      return "1-3";
    } else if (days >= 4 && days <= 7) {
      return "4-7";
    } else if (days >= 8 && days <= 14) {
      return "8-14";
    } else return "15-30";
  }

  return (
    <>
      <div className="col-md-12 col-12 main-content">
        <div className="row row-cols-1 row-cols-md-4 g-4">
          {loading && <Loading />}
          {!loading &&
            tours?.map((item, index) => (
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
                                  <stop stopColor="#ff0000"></stop>
                                  <stop offset="1" stopColor="#dde81f"></stop>
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
                      {validateOriginalDate(item.tour?.reasonableTime.endDate)}
                    </p>
                    <h3 className="card-text tour-item__title mb-1">
                      {item.tour?.tourTitle}
                    </h3>
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
                        {item?.hotel2?.ehotelName}
                      </span>
                    </p>
                    <p className="tour-item__departure mb-2">
                      Nhà xe:{" "}
                      <span className="font-weight-bold">
                        {item?.vehicle?.evehicleName}
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
                                  item?.tour,
                                  2,
                                  item?.hotel2?.roomList[0]?.price *
                                    (item?.tour?.numberOfNight + 0.5) *
                                    (1 -
                                      item?.tour?.discount?.discountValue /
                                        100),
                                  item?.vehicle?.coach[0]?.pricePerDay *
                                    item?.tour?.numberOfDay *
                                    (1 -
                                      item?.tour?.discount?.discountValue / 100)
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
                                item?.tour,
                                1,
                                item?.hotel2?.roomList[0]?.price *
                                  (item?.tour?.numberOfNight + 0.5) *
                                  (1 -
                                    item?.tour?.discount?.discountValue / 100),
                                item?.vehicle?.coach[0]?.pricePerDay *
                                  item?.tour?.numberOfDay *
                                  (1 -
                                    item?.tour?.discount?.discountValue / 100)
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
      </div>
    </>
  );
};

export default FeaturedTourList;
