import { useEffect, useState } from "react";
import DataTable from "../../../components/dataTable/DataTable";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../components/Loading/Loading";
import {
  getAllDiscounts,
  searchDiscountAdmin,
} from "../../../slices/discountSlice";
import {
  convertDateFormat,
  formatCurrencyWithoutD,
  formatDate,
  formatDateAndHour,
} from "../../../utils/validate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import {
  getAllCommissions,
  getCommissionDetail,
  getCommissionEnable,
} from "../../../slices/commissionSlice";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
const columns = [
  { field: "id", headerName: "STT", width: 40, type: "string" },
  {
    field: "name",
    headerName: "Tên hoa hồng ",
    width: 300,
    type: "string",
  },
  {
    field: "createdAt2",
    type: "string",
    headerName: "Ngày tạo",
    width: 180,
  },
  {
    field: "rate",
    type: "string",
    headerName: "Tỷ lệ",
    width: 80,
  },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 140,
    renderCell: (params) => {
      return params.value ? (
        <span>&#10004;</span> // Hiển thị biểu tượng tick khi là true
      ) : (
        <span>&#10006;</span> // Hiển thị biểu tượng X khi là false
      );
    },
  },
  {
    field: "lastModifiedAt2",
    type: "string",
    headerName: "Ngày sửa đổi",
    width: 200,
  },
];

const CommissionList = () => {
  const dispatch = useDispatch();
  const { loading, commissions, commission } = useSelector(
    (state) => state.commission
  );
  const [showModal, setShowModal] = useState(false);
  const [commissionId, setCommissionId] = useState("");

  const transformedData =
    commissions && Array.isArray(commissions)
      ? commissions.map((item, index) => ({
          id: index + 1,
          tourId: item?.commissionId,
          name: item?.name,
          rate: item?.rate,
          createdAt2: formatDateAndHour(
            item?.createdAt2 ? item.createdAt2 : new Date()
          ),
          lastModifiedAt2: formatDateAndHour(
            item?.lastModifiedAt2 ? item.lastModifiedAt2 : new Date()
          ),
          status: item.status,
        }))
      : [];

  useEffect(() => {
    dispatch(getAllCommissions()).unwrap();
  }, []);

  const handleSwitchChange = (commissionId) => {
    setCommissionId(commissionId);
    dispatch(getCommissionDetail(commissionId)).unwrap();
    openModal();
  };
  console.log(commission);
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
  console.log(commissions);

  const handleSaveStatus = async () => {
    try {
      await dispatch(getCommissionEnable(commissionId)).unwrap();
      notify(1);
      closeModal();
      setTimeout(() => {
        dispatch(getAllCommissions()).unwrap();
      }, 1000);
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
        toast.error("Có lỗi xảy ra, vui lòng thử lại!", {
          position: toast.POSITION.TOP_RIGHT,
          pauseOnHover: true,
          autoClose: 1000,
          onClose: resolve,
        });
      }
    });
  };
  return (
    <div className="products1 mb-5">
      <div className="info">
        <h1>Hoa Hồng</h1>
        <a href="/commissions/add-new">Thêm hoa hồng</a>
      </div>
      {/* TEST THE API */}

      {loading ? (
        <Loading isTable />
      ) : (
        <>
          <ToastContainer />
          <DataTable
            tourSwitch
            slug="commissions"
            columns={columns}
            rows={transformedData}
            onSwitchChange={handleSwitchChange}
            // width80={80}
          />
          {showModal && (
            <div className="modal-overlay2" onClick={handleOverlayClick}>
              <div className="modal2 col-md-3">
                <div className="d-flex wrap-modal-addtour">
                  <h5 className="card-header">Trạng thái hoa hồng</h5>
                  <button className="close-btn2" onClick={closeModal}>
                    X
                  </button>
                </div>

                <div className="wrap-modal-addtour mt-2">
                  {commission.status === false ? (
                    <>
                      <div className="row  mb-3">
                        <div>
                          <span>Bạn muốn dùng hoa hồng này?</span>{" "}
                        </div>
                      </div>

                      <div className="d-flex justify-content-between">
                        <button
                          className="btn btn-primary w-25"
                          onClick={handleSaveStatus}
                        >
                          Có
                        </button>
                        <button
                          className="btn-block1  w-25"
                          onClick={closeModal}
                        >
                          Không
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="row  mb-3 mt-2">
                        <div>
                          <span className=" text-center">
                            Hoa hồng đang được dùng không thể hủy!
                          </span>{" "}
                        </div>
                      </div>

                      <div className="d-flex justify-content-between">
                        <button
                          className="btn-block1  w-25"
                          onClick={closeModal}
                        >
                          Thoát
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommissionList;
