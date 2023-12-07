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
import { formatCurrencyWithoutD } from "../../../utils/validate";
import { useNavigate } from "react-router-dom";

const columns = [
  { field: "stt", headerName: "ID", width: 40, type: "string" },
  {
    field: "img",
    headerName: "Image",
    width: 70,
    renderCell: (params) => {
      return <img src={params.row.img || "/noavatar.png"} alt="" />;
    },
  },
  {
    field: "title",
    headerName: "Tour Title",
    width: 200,
    type: "string",
  },
  {
    field: "finalPrice",
    headerName: "Price",
    width: 150,
    type: "string",
  },
  {
    field: "discount",
    type: "boolean",
    headerName: "On Sale",
    width: 100,
    renderCell: (params) => {
      return params.value ? (
        <span>&#10004;</span> // Hiển thị biểu tượng tick khi là true
      ) : (
        <span>&#10006;</span> // Hiển thị biểu tượng X khi là false
      );
    },
  },
  {
    field: "name",
    type: "string",
    headerName: "Customer Name",
    width: 180,
  },
  {
    field: "status",
    type: "string",
    headerName: "Tour Booking Process",
    width: 200,
  },
  {
    field: "lastModifiedAt",
    type: "string",
    headerName: "Create At",
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
  const checkDiscount = (discount) => {
    if (discount > 0) return true;
    return false;
  };

  const transformedData =
    orders && Array.isArray(orders)
      ? orders.map((item, index) => ({
          stt: index + 1,
          id: item?.orderId,
          img: item?.orderDetail.tourDetail.thumbnailUrl,
          title: item?.orderDetail.tourDetail.tourTitle,
          finalPrice: formatCurrencyWithoutD(item?.finalPrice) + "đ",
          discount: checkDiscount(item?.discount.discountTourValue),
          name: item?.customerInformation.fullName,
          status: item?.orderStatus,
          lastModifiedAt: item.lastModifiedAt,
        }))
      : [];
  console.log(orders);
  useEffect(() => {
    dispatch(getAllOrders()).unwrap();
  }, []);

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
  const handleSaveStatus = () => {
    console.log(selectedStatus);
    dispatch(updateOrder({ orderId, status: selectedStatus })).unwrap();
    window.location.reload();
  };
  console.log(order);
  return (
    <div className="products vh-100">
      <div className="info">
        <h1>Orders</h1>
      </div>
      {/* TEST THE API */}

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
                <div className="d-flex wrap-modal-addtour">
                  <h5 className="card-header">Order Infomation</h5>
                  <button className="close-btn2" onClick={closeModal}>
                    X
                  </button>
                </div>

                <div className="wrap-modal-addtour mt-2">
                  <div className="row gx-3 mb-3">
                    <div className="col-md-4">
                      <div>
                        Order Status: <span>{order.orderStatus}</span>
                      </div>
                      <div>
                        Last Modified At: <span>{order.lastModifiedAt}</span>
                      </div>
                      <div>Customer Information:</div>
                      <ul>
                        <li>
                          Full Name:
                          <span>{order.customerInformation.fullName}</span>
                        </li>
                        <li>
                          Email: <span>{order.customerInformation.email}</span>
                        </li>
                        <li>
                          Phone Number:{" "}
                          <span>{order.customerInformation.phoneNumber}</span>
                        </li>
                      </ul>
                      <div>Discount Detail:</div>
                      <ul>
                        {order.discount.discountCode ? (
                          <>
                            <li>
                              Discount Code:
                              <span> {order.discount.discountCode}</span>
                            </li>
                            <li>
                              Discount Price:
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
                            <span>Tour didn't use the discount code.</span>
                          </li>
                        )}
                        {order.discount.discountTourValue > 0 ? (
                          <li>
                            Tour has been reduced by:{" "}
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
                            <span>Tour isn't discounted.</span>
                          </li>
                        )}
                        <li>
                          The final price of tour:{" "}
                          <span>
                            {" "}
                            {formatCurrencyWithoutD(order.finalPrice)}đ
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="col-md-8">
                      <div>Tour Detail:</div>
                      <ul>
                        <li className="d-flex ">
                          <img
                            className="img-order-detail"
                            src={order.orderDetail.tourDetail.thumbnailUrl}
                            alt={order.orderDetail.tourDetail.tourTitle}
                          />
                          <div className="text-cut">
                            Tour Title:{" "}
                            <span>
                              {order.orderDetail.tourDetail.tourTitle}
                            </span>
                            <div
                              className="btn-block1"
                              onClick={() =>
                                handleViewDetail(order.orderDetail.tourId)
                              }
                            >
                              View Detail
                            </div>
                          </div>
                        </li>
                        <li>
                          Number of days:{" "}
                          <span>
                            {order.orderDetail.tourDetail.numberOfDay} days and{" "}
                            {order.orderDetail.tourDetail.numberOfNight} nights.
                          </span>
                        </li>
                        <li>
                          Number of people:
                          <span>
                            {" "}
                            {order.numberOfAdult} adults and{" "}
                            {order.numberOfChildren} childrens.
                          </span>
                        </li>
                        <li>
                          Note:
                          <span>{order?.note}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="d-flex  wrap-modal-addtour ">
                  {/* Thêm select vào đây */}
                  <label htmlFor="orderStatus" className="me-3 ">
                    Update Tour Booking Process:
                  </label>
                  <select
                    id="orderStatus"
                    name="orderStatus"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="0">Canceled</option>
                    <option value="1">Pending</option>
                    <option value="2">Confirmed</option>
                    <option value="3">Underway</option>
                    <option value="4">Finished</option>
                  </select>
                </div>
                <button
                  className="btn btn-primary wrap-modal-addtour mt-2"
                  onClick={handleSaveStatus}
                >
                  Save Status
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
