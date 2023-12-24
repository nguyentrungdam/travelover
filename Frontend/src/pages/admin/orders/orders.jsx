import { useEffect, useState } from "react";
import "./orders.css";
import DataTable from "../../../components/dataTable/DataTable";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../components/Loading/Loading";
import {
  getAllOrders,
  getOrderDetail,
  updateOrder,
} from "../../../slices/orderSlice";
import {
  formatCurrencyWithoutD,
  formatDate,
  formatDateAndHour,
  formatDateToVietnamese,
  getVietNameseNameOfProcess,
} from "../../../utils/validate";
import { useNavigate } from "react-router-dom";
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
    width: 200,
    type: "string",
  },
  {
    field: "finalPrice",
    headerName: "Giá",
    width: 150,
    type: "string",
  },
  // {
  //   field: "discount",
  //   type: "boolean",
  //   headerName: "On Sale",
  //   width: 100,
  //   renderCell: (params) => {
  //     return params.value ? (
  //       <span>&#10004;</span> // Hiển thị biểu tượng tick khi là true
  //     ) : (
  //       <span>&#10006;</span> // Hiển thị biểu tượng X khi là false
  //     );
  //   },
  // },
  {
    field: "name",
    type: "string",
    headerName: "Tên khách hàng",
    width: 220,
  },
  {
    field: "status",
    type: "string",
    headerName: "Trạng thái",
    width: 160,
  },
  {
    field: "createAt",
    type: "string",
    headerName: "Ngày tạo",
    width: 200,
  },
];

const OrderList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, orders, order } = useSelector((state) => state.order);
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [orderId, setOrderId] = useState("");
  // const checkDiscount = (discount) => {
  //   if (discount > 0) return true;
  //   return false;
  // };

  const transformedData =
    orders && Array.isArray(orders)
      ? orders.map((item, index) => ({
          stt: index + 1,
          id: item?.orderId,
          img: item?.orderDetail.tourDetail.thumbnailUrl,
          title: item?.orderDetail.tourDetail.tourTitle,
          finalPrice: formatCurrencyWithoutD(item?.finalPrice) + "đ",
          // discount: checkDiscount(item?.discount.discountTourValue),
          name: item?.customerInformation.fullName,
          status: getVietNameseNameOfProcess(item?.orderStatus),
          createAt: formatDateAndHour(item?.createdAt2),
        }))
      : [];
  console.log(orders);
  useEffect(() => {
    dispatch(getAllOrders()).unwrap();
  }, []);
  useEffect(() => {
    dispatch(getAllOrders()).unwrap();
  }, [order.orderStatus]);
  console.log(orders);
  const handleUpdateOrderStatus = (orderId) => {
    setOrderId(orderId);
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
  const handleViewDetail = (tourId) => {
    navigate(`/tours-list/${tourId}`);
    document.body.classList.remove("modal-open");
  };
  const handleSaveStatus = async () => {
    console.log(orderId);
    console.log(selectedStatus);
    try {
      await dispatch(
        updateOrder({ orderId: orderId, status: selectedStatus })
      ).unwrap();
      notify(1);
    } catch (error) {
      notify(2);
    }
  };
  const notify = (prop) => {
    return new Promise((resolve) => {
      if (prop === 1) {
        toast.success("Cập nhật thành công! 👌", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
          pauseOnHover: true,
          onClose: resolve,
        });
      } else {
        toast.error("Có lỗi, vui lòng thử lại", {
          position: toast.POSITION.TOP_RIGHT,
          pauseOnHover: true,
          autoClose: 1000,
          onClose: resolve,
        });
      }
    });
  };
  console.log(order);
  return (
    <div className="products vh-100">
      <div className="info">
        <h1>Đơn Hàng</h1>
      </div>
      {/* TEST THE API */}
      <ToastContainer />

      {loading ? (
        <Loading isTable />
      ) : (
        <>
          <DataTable
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
                        Trạng thái: <span>{order.orderStatus}</span>
                      </div>
                      <div>
                        Ngày sửa gần nhất:{" "}
                        <span>{formatDateAndHour(order.lastModifiedAt2)}</span>
                      </div>
                      <div>Thông tin khách hàng:</div>
                      <ul>
                        <li>
                          Họ tên:{" "}
                          <span>{order.customerInformation.fullName}</span>
                        </li>
                        <li>
                          Email: <span>{order.customerInformation.email}</span>
                        </li>
                        <li>
                          Số điện thoại:{" "}
                          <span>{order.customerInformation.phoneNumber}</span>
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
                              Mã tour: <span>{order.orderDetail.tourId}</span>
                            </div>
                            <div
                              className="btn-block1"
                              onClick={() =>
                                handleViewDetail(order.orderDetail.tourId)
                              }
                            >
                              Xem Chi Tiết
                            </div>
                          </div>
                        </li>
                        <li>
                          Ngày đi:{" "}
                          <span>{formatDateToVietnamese(order.startDate)}</span>
                        </li>
                        <li>
                          Ngày về:{" "}
                          <span>{formatDateToVietnamese(order.endDate)}</span>
                        </li>
                        <li>
                          Số ngày:{" "}
                          <span>
                            {order.orderDetail.tourDetail.numberOfDay}ngày và{" "}
                            {order.orderDetail.tourDetail.numberOfNight} đêm.
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

                <div className="d-flex  wrap-modal-addtour ">
                  {/* Thêm select vào đây */}
                  <label htmlFor="orderStatus" className="me-3 ">
                    Cập nhật trạng thái tour:
                  </label>
                  <select
                    id="orderStatus"
                    name="orderStatus"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="0">Đã hủy</option>
                    <option value="1">Đang xử lý</option>
                    <option value="2">Đã xác nhận</option>
                    <option value="3">Trong chuyến đi</option>
                    <option value="4">Hoàn thành</option>
                  </select>
                </div>
                <button
                  className="btn btn-primary wrap-modal-addtour mt-2"
                  onClick={handleSaveStatus}
                >
                  Lưu
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderList;
