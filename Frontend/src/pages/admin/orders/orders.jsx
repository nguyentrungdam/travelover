import { useEffect, useState } from "react";
import "./orders.css";
import DataTable from "../../../components/dataTable/DataTable";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../components/Loading/Loading";
import { getAllOrders } from "../../../slices/orderSlice";

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
    width: 600,
    type: "string",
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
    headerName: "Order Status",
    width: 120,
  },
];

const OrderList = () => {
  const dispatch = useDispatch();
  const { loading, orders } = useSelector((state) => state.order);
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [orderStatus, setOrderStatus] = useState({
    orderId: "",
    status: "",
  });
  const transformedData =
    orders && Array.isArray(orders)
      ? orders.map((item, index) => ({
          stt: index + 1,
          id: item?.orderId,
          img: item?.orderDetail.tourDetail.thumbnailUrl,
          title: item?.orderDetail.tourDetail.tourTitle,
          name: item?.customerInformation.fullName,
          status: item?.orderStatus,
        }))
      : [];

  useEffect(() => {
    dispatch(getAllOrders()).unwrap();
  }, []);
  console.log(orders);
  const handleUpdateOrderStatus = (orderId, status) => {
    setOrderStatus({ orderId: orderId, status: status });
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

  const handleSaveStatus = () => {
    // Gọi hàm lưu trạng thái ở đây, ví dụ:
    console.log("Saving status:", selectedStatus);
    // Đóng modal
    closeModal();
  };

  console.log(orderStatus);
  return (
    <div className="products">
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
          />

          {/* Modal component */}
          {showModal && (
            <div className="modal-overlay2" onClick={handleOverlayClick}>
              <div className="modal2 col-xl-4">
                <div className="d-flex wrap-modal-addtour">
                  <span className="card-header">Order Infomation</span>
                  <button className="close-btn2" onClick={closeModal}>
                    X
                  </button>
                </div>
                <span className="wrap-modal-addtour">
                  Order Status: {orderStatus.status}
                </span>
                <div className="d-flex  wrap-modal-addtour ">
                  {/* Thêm select vào đây */}
                  <label htmlFor="orderStatus" className="me-3 ">
                    Update Order Status:
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
