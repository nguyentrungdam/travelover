import React, { useEffect, useState } from "react";
import {
  getAllOrders,
  getOrderDetail,
  updateOrder,
} from "../../../slices/orderSlice";
import {
  formatCurrencyWithoutD,
  formatDateAndHour,
  formatDateToVietnamese,
  getVietNameseNameOfProcess,
} from "../../../utils/validate";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../../components/dataTable/DataTable";
import Loading from "../../../components/Loading/Loading";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
const columns = [
  { field: "stt", headerName: "STT", width: 40, type: "string" },
  {
    field: "img",
    headerName: "Ảnh",
    width: 70,
    renderCell: (params) => {
      return <img src={params.row.img || "/noavatar.png"} alt="" />;
    },
  },
  {
    field: "title",
    headerName: "Tên tour",
    width: 300,
    type: "string",
  },
  {
    field: "finalPrice",
    headerName: "Giá",
    width: 300,
    type: "string",
    renderCell: (params) => {
      const { finalPrice, totalPrice } = params.row;
      const isDiscounted = finalPrice < totalPrice;

      return (
        <div className="normal-price">
          {isDiscounted ? (
            <>
              <span className="original-price">
                {formatCurrencyWithoutD(totalPrice)}đ
              </span>
              <span className="discounted">
                {formatCurrencyWithoutD(finalPrice)}đ
              </span>
            </>
          ) : (
            formatCurrencyWithoutD(finalPrice) + "đ"
          )}
        </div>
      );
    },
  },
  {
    field: "status",
    type: "string",
    headerName: "Trạng thái",
    width: 210,
    renderCell: (params) => (
      <div className={`status ${getStatusClass(params.row.status)}`}>
        {params.row.status}
      </div>
    ),
  },
  {
    field: "lastModifiedAt",
    type: "string",
    headerName: "Ngày thanh toán",
    width: 220,
  },
];
const getStatusClass = (status) => {
  switch (status) {
    case "Đã hủy":
      return "status-1";
    case "Đang xử lý":
      return "status-2";
    case "Đã xác nhận":
      return "status-2";
    case "Trong chuyến đi":
      return "status-3";
    case "Hoàn thành":
      return "status-4";
    default:
      return ""; // Trường hợp mặc định, không có class nào
  }
};
const Bill = () => {
  const dispatch = useDispatch();
  const { loading, orders, order } = useSelector((state) => state.order);
  const [showModal, setShowModal] = useState(false);
  const [cancellationMessage, setCancellationMessage] = useState("");
  const [showModalCancel, setShowModalCancel] = useState(false);

  const transformedData =
    orders && Array.isArray(orders)
      ? orders.map((item, index) => ({
          stt: index + 1,
          id: item?.orderId,
          img: item?.orderDetail.tourDetail.thumbnailUrl,
          title: item?.orderDetail.tourDetail.tourTitle,
          finalPrice: item?.finalPrice,
          totalPrice: item?.totalPrice,
          status: getVietNameseNameOfProcess(item?.orderStatus),
          lastModifiedAt: formatDateAndHour(item.lastModifiedAt2),
        }))
      : [];
  useEffect(() => {
    dispatch(getAllOrders()).unwrap();
  }, []);

  console.log(orders);
  const handleUpdateOrderStatus = (orderId) => {
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
  useEffect(() => {
    const rowsPerPageLabel = document.getElementById("rht");
    console.log(rowsPerPageLabel);
    if (rowsPerPageLabel) {
      rowsPerPageLabel.textContent = "Số hàng mỗi trang:";
    }
  }, []);
  console.log(order);
  const handleSaveStatus = async () => {
    console.log(order.orderId);
    console.log(cancellationMessage);
    try {
      const res = await dispatch(
        updateOrder({
          orderId: order.orderId,
          status: 0,
          message: cancellationMessage,
        })
      ).unwrap();
      console.log(res.status);
      setShowModalCancel(!showModalCancel);
      notify(1);
    } catch (error) {
      notify(2);
    }
  };
  const notify = (prop) => {
    return new Promise((resolve) => {
      if (prop === 1) {
        toast.success("Hủy đơn thành công! 👌", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
          pauseOnHover: true,
          onClose: resolve,
        });
      } else {
        toast.error("Hủy đơn thất bại, vui lòng thử lại", {
          position: toast.POSITION.TOP_RIGHT,
          pauseOnHover: true,
          autoClose: 1000,
          onClose: resolve,
        });
      }
    });
  };
  return (
    <div>
      {/* Billing history card*/}
      <div className="card mb-4">
        <div className="card-header">Lịch sử thanh toán</div>
        <div className="card-body p-0">
          {/* Billing history table*/}
          {loading ? (
            <Loading isTable />
          ) : (
            <>
              <ToastContainer />

              <DataTable
                customerRole
                VietNamese
                slug="orders-list"
                columns={columns}
                rows={transformedData}
                handleUpdateOrderStatus={handleUpdateOrderStatus}
                width80={80}
              />

              {/* Modal component */}
              {showModal && (
                <div className="modal-overlay2" onClick={handleOverlayClick}>
                  <div className="modal2 col-md-8">
                    <div className="d-flex wrap-modal-addtour border-bottom-1">
                      <h5 className="card-header border-bottom-none">
                        Thông tin đặt hàng
                      </h5>
                      <button className="close-btn2" onClick={closeModal}>
                        X
                      </button>
                    </div>

                    <div className="wrap-modal-addtour mt-2">
                      <div className="row gx-3 mb-3">
                        <div className="col-md-4">
                          <div>
                            Trạng thái:{" "}
                            <span>
                              {getVietNameseNameOfProcess(order.orderStatus)}
                            </span>
                          </div>
                          <div>
                            Ngày đặt:{" "}
                            <span>{formatDateAndHour(order?.createdAt2)}</span>
                          </div>
                          <div>Thông tin khách hàng:</div>
                          <ul>
                            <li>
                              Họ Tên:
                              <span>{order.customerInformation.fullName}</span>
                            </li>
                            <li>
                              Email:{" "}
                              <span>{order.customerInformation.email}</span>
                            </li>
                            <li>
                              Số điện thoại:{" "}
                              <span>
                                {order.customerInformation.phoneNumber}
                              </span>
                            </li>
                          </ul>
                          <div>Chi tiết giảm giá:</div>
                          <ul>
                            {order.discount.discountCode ? (
                              <>
                                <li>
                                  Mã giảm giá:
                                  <span> {order.discount.discountCode}</span>
                                </li>
                                <li>
                                  Giá được giảm từ mã:
                                  <span>
                                    {" "}
                                    {formatCurrencyWithoutD(
                                      order.discount.discountCodeValue
                                    )}
                                    đ
                                  </span>
                                </li>
                              </>
                            ) : (
                              <li>
                                <span>Tour không sử dụng mã giảm giá.</span>
                              </li>
                            )}
                            {order.discount.discountTourValue > 0 ? (
                              <li>
                                Giá tour được giảm:{" "}
                                <span>
                                  {" "}
                                  {formatCurrencyWithoutD(
                                    order.discount.discountTourValue
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
                                {formatCurrencyWithoutD(order.finalPrice)}đ
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div className="col-md-8">
                          <div>Chi tiết tour:</div>
                          <ul>
                            <li className="d-flex ">
                              <img
                                className="img-order-detail"
                                src={order.orderDetail.tourDetail.thumbnailUrl}
                                alt={order.orderDetail.tourDetail.tourTitle}
                              />
                              <div className="text-cut">
                                Tên tour:{" "}
                                <span>
                                  {order.orderDetail.tourDetail.tourTitle}
                                </span>
                                <div className="">
                                  Mã tour:{" "}
                                  <span>{order.orderDetail.tourId}</span>
                                </div>
                              </div>
                            </li>
                            <li>
                              Ngày đi:{" "}
                              <span>
                                {formatDateToVietnamese(order.startDate)}
                              </span>
                            </li>
                            <li>
                              Ngày về:{" "}
                              <span>
                                {formatDateToVietnamese(order.endDate)}
                              </span>
                            </li>
                            <li>
                              Số ngày:{" "}
                              <span>
                                {order.orderDetail.tourDetail.numberOfDay} ngày
                                và {order.orderDetail.tourDetail.numberOfNight}{" "}
                                đêm.
                              </span>
                            </li>
                            <li>
                              Số người:
                              <span>
                                {" "}
                                {order.numberOfAdult} người lớn và{" "}
                                {order.numberOfChildren} trẻ em.
                              </span>
                            </li>
                            <li>
                              Ghi chú:
                              <span>{order?.note}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="wrap-modal-addtour">
                      <div
                        className="btn btn-danger"
                        onClick={() => setShowModalCancel(!showModalCancel)}
                      >
                        Hủy Đơn
                      </div>
                    </div>
                    <div className="d-flex  wrap-modal-addtour mt-2 ms-0">
                      {/* Thêm select vào đây */}
                      {showModalCancel && (
                        <div className="col-md-6  wrap-modal-addtour">
                          <label htmlFor="cancellationMessage">
                            Lý do hủy đơn <b className="b-red">*</b>
                          </label>
                          <input
                            type="text"
                            id="cancellationMessage"
                            className="form-control"
                            value={cancellationMessage}
                            onChange={(e) =>
                              setCancellationMessage(e.target.value)
                            }
                          />
                          <button
                            className="btn btn-primary wrap-modal-addtour mt-2 ms-0"
                            onClick={handleSaveStatus}
                          >
                            Lưu
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bill;
