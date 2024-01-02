import { useEffect, useState } from "react";
import "./orderZ.css";
import DataTable from "../../../components/dataTable/DataTable";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../components/Loading/Loading";
import { updateOrder } from "../../../slices/orderSlice";
import {
  convertDateFormat,
  formatCurrencyWithoutD,
  formatDate,
  formatDateAndHour,
  formatDateToVietnamese,
  getVietNameseNameOfProcess,
} from "../../../utils/validate";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import {
  getAllOrderz,
  getZOrderDetail,
  updateZOrder,
} from "../../../slices/zhotelSlice";
const columns = [
  { field: "stt", headerName: "STT", width: 40, type: "string" },

  {
    field: "companyId",
    headerName: "Tên công ty",
    width: 200,
    type: "string",
  },

  {
    field: "startDate",
    headerName: "Ngày đi",
    width: 100,
    type: "string",
  },
  {
    field: "endDate",
    headerName: "Ngày về",
    width: 150,
    type: "string",
  },
  {
    field: "finalPrice",
    type: "string",
    headerName: "Giá",
    width: 160,
  },
  {
    field: "status",
    type: "string",
    headerName: "Trạng thái",
    width: 160,
  },
];

const OrderZList = () => {
  const dispatch = useDispatch();
  const { loading, zorders, zorder, totalData } = useSelector(
    (state) => state.hotelz
  );
  const [showModal, setShowModal] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("1");
  const [orderId, setOrderId] = useState("");
  const [keyWord, setKeyWord] = useState("");

  const transformedData =
    zorders && Array.isArray(zorders)
      ? zorders.map((item, index) => ({
          stt: index + 1,
          id: item?.orderId,
          companyId: item?.companyId,
          finalPrice: formatCurrencyWithoutD(item?.totalPrice) + "đ",
          startDate: formatDate(item?.startDate),
          endDate: formatDate(item?.endDate),
          status: getVietNameseNameOfProcess(item?.orderStatus),
        }))
      : [];

  const handleSearch = async () => {
    console.log(keyWord);
    try {
      await dispatch(getAllOrderz(keyWord)).unwrap();
      setShowTable(true);
    } catch (error) {
      notify(2);
    }
  };

  console.log(zorders);
  console.log(totalData);

  const handleUpdateOrderStatus = (orderId) => {
    console.log(orderId);
    setOrderId(orderId);
    dispatch(getZOrderDetail({ eHotelId: keyWord, orderId: orderId })).unwrap();
    openModal();
  };
  const openModal = () => {
    setShowModal(true);
    setSelectedStatus("1");
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

  const handleSaveStatus = async () => {
    console.log(orderId);
    console.log(selectedStatus);
    try {
      await dispatch(
        updateZOrder({
          orderId: orderId,
          orderStatus: selectedStatus,
          eHotelId: keyWord,
        })
      ).unwrap();
      notify(1);
      await dispatch(getAllOrderz(keyWord)).unwrap();
      closeModal();
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

  return (
    <div className="products vh-100">
      <div className="info">
        <h1>Đơn Hàng</h1>
      </div>
      {/* TEST THE API */}
      <ToastContainer />

      <div className="d-flex align-items-center w-50 mb-2">
        <input
          className="form-control w-37"
          placeholder="Nhập Id của khách sạn"
          onChange={(e) => setKeyWord(e.target.value)}
        ></input>
        <div className=" ms-2 w-8 p-0375 btn-block" onClick={handleSearch}>
          <FontAwesomeIcon className=" ms-1" icon={faMagnifyingGlass} />
        </div>
      </div>
      {loading ? (
        <Loading isTable />
      ) : (
        <>
          <div className={showTable && totalData > 0 ? "" : "d-none"}>
            <DataTable
              slug="orders-list"
              columns={columns}
              rows={transformedData}
              handleUpdateOrderStatus={handleUpdateOrderStatus}
              width80={80}
            />
          </div>
          {totalData === 0 && showTable ? (
            <div className="d-flex justify-content-center flex-column align-items-center pt-5">
              <h5 className="sorry-text text-white">
                Khách sạn không có đơn hàng nào được đặt!
              </h5>
            </div>
          ) : null}
          {/* Modal component */}
          {showModal && (
            <div className="modal-overlay2" onClick={handleOverlayClick}>
              <div className="modal2 col-md-4">
                <div className="d-flex wrap-modal-addtour border-bottom-1">
                  <h5 className="card-header border-bottom-none">
                    Thông tin đơn hàng
                  </h5>
                  <button className="close-btn2" onClick={closeModal}>
                    X
                  </button>
                </div>

                <div className="wrap-modal-addtour mt-2">
                  <div className="row gx-3 mb-3">
                    <div className="col-md-12">
                      <div>
                        Công ty:{" "}
                        <span>
                          <span>{zorder.companyId}</span>
                        </span>
                      </div>
                      <div>
                        Số phòng:{" "}
                        <span>
                          <span>{zorder.orderDetail.length}</span>
                        </span>
                      </div>
                      <div>
                        Gồm:{" "}
                        <span>
                          {zorder.orderDetail.map((order, index, array) => (
                            <span key={order.roomId}>
                              {order.name} {index !== array.length - 1 && " - "}
                            </span>
                          ))}
                        </span>
                      </div>

                      <div>
                        Giá:{" "}
                        <span>
                          <span>
                            {formatCurrencyWithoutD(zorder.totalPrice)}đ
                          </span>
                        </span>
                      </div>
                      <div>
                        Trạng thái:{" "}
                        <span>
                          {getVietNameseNameOfProcess(zorder.orderStatus)}
                        </span>
                      </div>
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
                    <option value="1">Đang xử lý</option>
                    <option value="2">Đã xác nhận</option>
                    <option value="3">Hoàn thành</option>
                    <option value="0">Hủy</option>
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

export default OrderZList;
