import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../../styles/thank-you.css";
import { useDispatch, useSelector } from "react-redux";
import { getOrderCheck, getOrderDetail } from "../../../slices/orderSlice";
import { formatCurrencyWithoutD } from "../../../utils/validate";

const ThankYou = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { order, status } = useSelector((state) => state.order);
  const [showModal, setShowModal] = useState(false);
  const [displayStatus, setDisplayStatus] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  let params = new URLSearchParams(window.location.search);
  let orderId = params.get("orderId");
  useEffect(() => {
    dispatch(getOrderCheck(orderId))
      .unwrap()
      .finally(() => {
        setIsDataLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (status && isDataLoaded) {
      setDisplayStatus("thankYou");
    } else if (!status && isDataLoaded) {
      setDisplayStatus("apology");
    }
  }, [status, isDataLoaded]);
  const handleViewDetail = () => {
    dispatch(getOrderDetail(orderId)).unwrap();
    openModal();
  };
  const openModal = () => {
    setShowModal(true);
    document.body.classList.add("modal-open");
  };
  const closeModal = () => {
    setShowModal(false);
    document.body.classList.remove("modal-open");
  };
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay2")) {
      closeModal();
    }
  };
  const navigateToBillingTab = () => {
    navigate("/account", { state: { activeTab: "billingPage" } });
  };
  console.log(order);
  return (
    <section>
      <Container>
        <Row>
          {displayStatus === "thankYou" && (
            // Hiển thị phần cảm ơn
            <Col lg="12" className="pt-5 text-center">
              <div className="thank__you">
                <span>
                  <i className="ri-checkbox-circle-line"></i>
                </span>
                <h1 className="mb-3 fw-semibold">Cảm ơn</h1>
                <img src="/thanks.jpg" alt="thanks" className="thank-img" />
                <h3 className="mb-4">Bạn đã đặt tour thành công!</h3>
                <div className="d-flex align-items-center justify-content-center">
                  Bạn có muốn xem chi tiết?
                  <div className="btn-block1 w200" onClick={handleViewDetail}>
                    Tại đây
                  </div>
                </div>
                <Button className="btn primary__btn w-25 mt-4">
                  <Link to="/">Về trang chủ</Link>
                </Button>
              </div>
            </Col>
          )}
          {displayStatus === "apology" && (
            // Hiển thị phần xin lỗi
            <Col lg="12" className="pt-5 text-center">
              <div className="thank__you">
                <span>
                  <i className="ri-checkbox-circle-line"></i>
                </span>
                <h1 className="mb-3 fw-semibold">Xin lỗi</h1>
                <img src="/sorry.png" alt="sorry" className="sorry-img" />
                <h3 className="mb-4">
                  Bạn đã đặt tour thất bại! Vui lòng thử lại sau.
                </h3>
                <Button className="btn primary__btn w-25 mt-4">
                  <Link to="/">Về trang chủ</Link>
                </Button>
              </div>
            </Col>
          )}

          {showModal && (
            <div className="modal-overlay2" onClick={handleOverlayClick}>
              <div className="modal2 col-md-8">
                <div className="d-flex wrap-modal-addtour">
                  <h5 className="card-header">Thông tin đơn hàng</h5>
                  <button className="close-btn2" onClick={closeModal}>
                    X
                  </button>
                </div>

                <div className="wrap-modal-addtour mt-2">
                  <div className="row gx-3 mb-3">
                    <div className="col-md-4">
                      <div></div>
                      <div>
                        Ngày tạo: <span>{order?.createdAt}</span>
                      </div>
                      <div>Thông tin khách hàng:</div>
                      <ul>
                        <li>
                          Họ tên:{" "}
                          <span>{order?.customerInformation?.fullName}</span>
                        </li>
                        <li>
                          Email:{" "}
                          <span>{order?.customerInformation?.email}</span>
                        </li>
                        <li>
                          Số điện thoại:{" "}
                          <span>{order?.customerInformation?.phoneNumber}</span>
                        </li>
                      </ul>
                      <div>Thông tin giảm giá:</div>
                      <ul>
                        {order?.discount?.discountCode ? (
                          <>
                            <li>
                              Mã giảm giá:
                              <span> {order?.discount?.discountCode}</span>
                            </li>
                            <li>
                              Số tiền được giảm:
                              <span>
                                {" "}
                                {formatCurrencyWithoutD(
                                  order?.discount?.discountCodeValue
                                )}
                                đ
                              </span>
                            </li>
                          </>
                        ) : (
                          <li>
                            <span>Đơn hàng không dùng mã giảm giá.</span>
                          </li>
                        )}
                        {order?.discount?.discountTourValue > 0 ? (
                          <li>
                            Tour có giảm giá:{" "}
                            <span>
                              {" "}
                              {formatCurrencyWithoutD(
                                order?.discount?.discountTourValue
                              )}
                              đ
                            </span>
                          </li>
                        ) : (
                          <li>
                            <span>Tour không có giảm giá.</span>
                          </li>
                        )}
                        <li>
                          Tổng cộng:{" "}
                          <span>
                            {" "}
                            {formatCurrencyWithoutD(order?.finalPrice)}đ
                          </span>
                        </li>
                      </ul>
                      <button
                        className="btn btn-primary wrap-modal-addtour mt-2"
                        onClick={navigateToBillingTab}
                      >
                        Xem lịch sử thanh toán
                      </button>
                    </div>
                    <div className="col-md-8">
                      <div>Chi tiết tour:</div>
                      <ul>
                        <li className="d-flex ">
                          <img
                            className="img-order-detail"
                            src={order?.orderDetail?.tourDetail?.thumbnailUrl}
                            alt={order?.orderDetail?.tourDetail?.tourTitle}
                          />
                          <div className="text-cut">
                            Tên tour:{" "}
                            <span>
                              {order?.orderDetail?.tourDetail?.tourTitle}
                            </span>
                          </div>
                        </li>
                        <li>
                          Số ngày:{" "}
                          <span>
                            {order?.orderDetail?.tourDetail?.numberOfDay} ngày
                            và {order?.orderDetail?.tourDetail?.numberOfNight}{" "}
                            đêm.
                          </span>
                        </li>
                        <li>
                          Số người:
                          <span>
                            {" "}
                            {order?.numberOfAdult} người lớn và{" "}
                            {order?.numberOfChildren} trẻ em.
                          </span>
                        </li>
                        <li>
                          Lưu ý:
                          <span>{order?.note}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Row>
      </Container>
    </section>
  );
};

export default ThankYou;
