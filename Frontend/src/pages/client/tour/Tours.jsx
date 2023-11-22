import React, { useState, useEffect } from "react";
import CommonSection from "../../../shared/CommonSection";
import "./tours.css";
import SearchBar from "../../../shared/SearchBar";
import Newsletter from "../../../shared/Newsletter";
import { Container, Row } from "reactstrap";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { destinations } from "../../../assets/data/dataAdmin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../components/Loading/Loading";
import { searchTour } from "../../../slices/tourSlice";
import {
  formatCurrencyWithoutD,
  validateOriginalDate,
} from "../../../utils/validate";

const Tours = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, tours } = useSelector((state) => state.tour);
  const [parentState, setParentState] = useState({
    selectedLocation: "",
    startDate: "",
    numberOfDay: "",
    numberOfPeople: "",
  });

  const updateParentState = (newState) => {
    setParentState((prevState) => ({ ...prevState, ...newState }));
  };
  console.log(
    parentState.selectedLocation.province,
    parentState.startDate,
    parentState.numberOfDay,
    parentState.numberOfPeople
  );
  const handleViewDetail = (tourId) => {
    navigate(`/tours/tour-detail/${tourId}`, {
      state: {
        keyword: tourId,
        province: parentState.selectedLocation.province,
        startDate: parentState.startDate,
        numberOfDay: parentState.numberOfDay,
        numberOfPeople: parentState.numberOfPeople,
        pageSize: 1,
        pageNumber: 1,
      },
    });
  };
  const handleSearch = (searchParams) => {
    // Gọi API ở đây với searchParams
    const res1 = dispatch(
      searchTour({
        keyword: "",
        province: searchParams.selectedLocation.province,
        startDate: searchParams.startDate,
        numberOfDay: searchParams.numberOfDay,
        numberOfPeople: searchParams.numberOfPeople,
        pageSize: 0,
        pageNumber: 0,
      })
    );
    console.log(res1);
  };
  return (
    <>
      <Header />
      <CommonSection title={"Tất cả tour"} />
      <section>
        <Container>
          <Row>
            <SearchBar
              isTours
              parentState={parentState}
              updateParentState={updateParentState}
              onSearch={handleSearch}
            />
          </Row>
        </Container>
      </section>

      {loading ? (
        <Loading />
      ) : (
        <div className="container">
          <div className="col-md-12 col-12 main-content">
            <div className="promotion-search-result__result">
              <div>
                <div className="d-none d-lg-block">
                  <div className="order-by">
                    <div className="order-by-title">
                      Chúng tôi tìm thấy <strong>{tours?.length || 0}</strong>{" "}
                      tours cho Quý khách.
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

              <div className="row row-cols-1 row-cols-md-4 g-4">
                {tours?.map((item, index) => (
                  <div
                    className="col promotion-search-result__result__item"
                    key={index}
                  >
                    <div className="card tour-item">
                      <div className="position-relative">
                        <div className="tour-item__image">
                          <img
                            src={item?.tour.thumbnailUrl}
                            id="imgaddtour_0ae974d0-6bf1-489c-9949-1d74ce7d887b"
                            className="card-img-top img-fluid"
                            alt={item?.tour.tourTitle}
                            width="309"
                            height="220"
                            loading="lazy"
                          />

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
                            item?.tour.reasonableTime.startDate
                          )}{" "}
                          đến{" "}
                          {validateOriginalDate(
                            item?.tour.reasonableTime.endDate
                          )}
                        </p>
                        <h3 className="card-text tour-item__title mb-1">
                          {item?.tour.tourTitle}
                        </h3>
                        <div className="tour-item__code">
                          <div>Đối tượng thích hợp:</div>
                          <span className="font-weight-bold">
                            {" "}
                            {item?.tour.suitablePerson}
                          </span>
                        </div>
                        <p className="tour-item__departure mb-3">
                          Điểm đến:{" "}
                          <span className="font-weight-bold">
                            {item?.tour.address.province}
                          </span>
                        </p>
                        <div className="tour-item__price mb-2 w-100">
                          <div className="tour-item__price__wrapper">
                            <div className="tour-item__price--old"></div>
                            <div className="tour-item__price--current fix-leftalign">
                              <span className="tour-item__price--current__number pe-2 mb-0">
                                {formatCurrencyWithoutD(item?.tour.price)}₫
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
                                  handleViewDetail(item?.tour.tourId)
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
              {tours?.length === 0 || !tours?.length ? (
                <div className="d-flex justify-content-center flex-column align-items-center pt-5">
                  <img src="/sorry.png" alt="sorry" className="sorry-img" />
                  <h5 className="sorry-text">
                    Xin lỗi vì không tìm thấy tour phù hợp!
                  </h5>
                </div>
              ) : null}
            </div>

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
                            className="card-img-top1 img-fluid card-img-top2"
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
        </div>
      )}
      <Newsletter />
      <Footer />
    </>
  );
};

export default Tours;
