import { useEffect, useState } from "react";
import "./orders.css";
import DataTable from "../../../components/dataTable/DataTable";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../components/Loading/Loading";
import {
  getAllOrders,
  getOrderDetail,
  searchOrderAdmin,
  updateOrder,
} from "../../../slices/orderSlice";
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
  const [selectedStatus, setSelectedStatus] = useState("1");
  const [orderId, setOrderId] = useState("");
  const [keyWord, setKeyWord] = useState("");
  const [sort, setSort] = useState({ sortBy: "createdAt2", order: "asc" });
  const [fields, setFields] = useState([{ field: "minOrder", value: "" }]);
  const [currentField, setCurrentField] = useState("");
  const [currentInputValue, setCurrentInputValue] = useState("");
  const [showMultiSearchModal, setShowMultiSearchModal] = useState(false);
  const [createdAtInput, setCreatedAtInput] = useState("");
  const [cancellationMessage, setCancellationMessage] = useState("");
  const [cancellationDiscountCode, setCancellationDiscountCode] = useState("");
  const [showModalCancel, setShowModalCancel] = useState(false);

  const transformedData =
    orders && Array.isArray(orders)
      ? orders.map((item, index) => ({
          stt: index + 1,
          id: item?.orderId,
          img: item?.orderDetail.tourDetail.thumbnailUrl,
          title: item?.orderDetail.tourDetail.tourTitle,
          finalPrice: formatCurrencyWithoutD(item?.finalPrice) + "đ",

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
  useEffect(() => {
    // Reset the values when selectedStatus changes
    if (selectedStatus === "0") {
      setShowModalCancel(true);
    } else {
      setShowModalCancel(false);
      setCancellationMessage("");
      setCancellationDiscountCode("");
    }
  }, [selectedStatus]);
  console.log(orders);
  const handleUpdateOrderStatus = (orderId) => {
    setOrderId(orderId);
    dispatch(getOrderDetail(orderId)).unwrap();
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

  const handleViewDetail = (tourId) => {
    navigate(`/tours-list/${tourId}`);
    document.body.classList.remove("modal-open");
  };
  const handleSaveStatus = async () => {
    console.log(orderId);
    console.log(selectedStatus);
    console.log(cancellationMessage);
    console.log(cancellationDiscountCode);
    try {
      await dispatch(
        updateOrder({
          orderId: orderId,
          status: selectedStatus,
          message: cancellationMessage,
          discountCode: cancellationDiscountCode,
        })
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

  //!xử lý multi search
  const openMultiSearchModal = () => {
    setShowMultiSearchModal(true);
    document.body.classList.add("modal-open");
  };
  const handleOverlayClick2 = (e) => {
    if (e.target.classList.contains("modal-overlay3")) {
      closeMultiSearchModal();
    }
  };
  const closeMultiSearchModal = () => {
    setShowMultiSearchModal(false);
    document.body.classList.remove("modal-open");
    resetValues();
  };
  const handleAddSelect = () => {
    setFields((prevFields) => [
      ...prevFields,
      { field: currentField, value: currentInputValue },
    ]);
    setCurrentField("");
    setCurrentInputValue("");
  };
  const handleSelectChange = (index, value) => {
    setFields((prevFields) => {
      const updatedFields = [...prevFields];
      updatedFields[index].field = value;
      return updatedFields;
    });
  };
  const handleInputChange = (index, value) => {
    setFields((prevFields) => {
      const updatedFields = [...prevFields];
      updatedFields[index].value = value;
      return updatedFields;
    });
  };

  const handleMultiSearch = () => {
    console.log(keyWord);
    console.log(fields);
    console.log(sort);
    const convertedDate = convertDateFormat(createdAtInput);
    console.log(convertedDate);

    try {
      console.log(1);
      const searchParams = {
        keyword: keyWord,
        fullName:
          fields.find((field) => field.field === "fullName")?.value || "",
        finalPrice:
          fields.find((field) => field.field === "finalPrice")?.value || "",
        orderStatus:
          fields.find((field) => field.field === "orderStatus")?.value || "",
        sortBy: sort.sortBy,
        order: sort.order,
      };

      if (convertedDate !== undefined) {
        searchParams.createdAt2 = convertedDate;
      }

      dispatch(searchOrderAdmin(searchParams)).unwrap();
      console.log(2);
      closeMultiSearchModal();
    } catch (error) {
      // notify(4);
    }
  };

  const resetValues = () => {
    setKeyWord("");
    setFields([{ field: "minOrder", value: "" }]);
    setCurrentField("");
    setCurrentInputValue("");
    setSort({ sortBy: "", order: "" });
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
          <div
            className="btn-block1 w-15 mb-2 ms-0"
            onClick={openMultiSearchModal}
          >
            Tìm Kiếm...
            <FontAwesomeIcon className=" ms-1" icon={faMagnifyingGlass} />
          </div>
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
                        Trạng thái:{" "}
                        <span>
                          {getVietNameseNameOfProcess(order.orderStatus)}
                        </span>
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
                    <option value="1">Đang xử lý</option>
                    <option value="2">Đã xác nhận</option>
                    <option value="3">Trong chuyến đi</option>
                    <option value="4">Hoàn thành</option>
                    <option value="0">Hủy</option>
                  </select>
                </div>
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
                      onChange={(e) => setCancellationMessage(e.target.value)}
                    />
                    <label htmlFor="cancellationDiscountCode">
                      Mã giảm giá <b className="b-red">*</b>
                    </label>
                    <input
                      type="text"
                      className="form-control w-50"
                      id="cancellationDiscountCode"
                      value={cancellationDiscountCode}
                      onChange={(e) =>
                        setCancellationDiscountCode(e.target.value)
                      }
                    />
                  </div>
                )}
                <button
                  className="btn btn-primary wrap-modal-addtour mt-2"
                  onClick={handleSaveStatus}
                >
                  Lưu
                </button>
              </div>
            </div>
          )}
          {showMultiSearchModal && (
            <div className="modal-overlay3" onClick={handleOverlayClick2}>
              <div className="modal2 col-md-3">
                <div className="d-flex wrap-modal-addtour">
                  <h5 className="card-header">Tìm kiếm</h5>
                  <button
                    className="close-btn2"
                    onClick={closeMultiSearchModal}
                  >
                    X
                  </button>
                </div>
                <div className="mt-3 ">
                  <input
                    className="form-control mb-2 "
                    type="text"
                    placeholder="Nhập từ khóa"
                    value={keyWord}
                    onChange={(e) => setKeyWord(e.target.value)}
                  />
                  <button className="btn btn-primary" onClick={handleAddSelect}>
                    Thêm Lựa Chọn
                  </button>
                  {fields.map((field, index) => (
                    <div key={index} className="my-2">
                      <select
                        className="me-2 p-1 mb-2"
                        value={field.field}
                        onChange={(e) =>
                          handleSelectChange(index, e.target.value)
                        }
                      >
                        <option value="createdAt2">Ngày tạo</option>
                        <option value="finalPrice">Giá</option>
                        <option value="fullName">Tên khách hàng</option>
                        <option value="orderStatus">Trạng thái</option>
                      </select>
                      {field.field === "createdAt2" ? (
                        <input
                          className="form-control w-50"
                          type="text"
                          value={createdAtInput}
                          onChange={(e) => {
                            setCreatedAtInput(e.target.value);
                          }}
                        />
                      ) : (
                        <input
                          className="form-control w-50"
                          type="text"
                          value={field.value}
                          onChange={(e) =>
                            handleInputChange(index, e.target.value)
                          }
                        />
                      )}
                    </div>
                  ))}

                  <label className="small mb-1 me-2">Sắp xếp: </label>
                  <div className="d-flex">
                    <select
                      className="me-2 p-1 mb-2"
                      value={sort.sortBy}
                      onChange={(e) =>
                        setSort((prevSort) => ({
                          ...prevSort,
                          sortBy: e.target.value,
                        }))
                      }
                    >
                      <option value="createdAt2">Ngày tạo</option>
                      <option value="finalPrice">Giá</option>
                      <option value="fullName">Tên khách hàng</option>
                      <option value="orderStatus">Trạng thái</option>
                    </select>
                    <select
                      className="me-2 p-1 mb-2"
                      value={sort.order}
                      onChange={(e) =>
                        setSort((prevSort) => ({
                          ...prevSort,
                          order: e.target.value,
                        }))
                      }
                    >
                      <option value="asc">Tăng </option>
                      <option value="desc">Giảm</option>
                    </select>
                  </div>
                  <button
                    className="btn btn-primary mt-2"
                    onClick={handleMultiSearch}
                  >
                    Tìm Kiếm
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderList;
