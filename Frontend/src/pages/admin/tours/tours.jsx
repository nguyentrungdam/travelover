import { useEffect, useState } from "react";
import "./tours.css";
import DataTable from "../../../components/dataTable/DataTable";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllTours,
  getTourDetail,
  updateTourStatus,
} from "../../../slices/tourSlice";
import Loading from "../../../components/Loading/Loading";
import { formatCurrencyWithoutD } from "../../../utils/validate";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
const columns = [
  { field: "id", headerName: "ID", width: 40, type: "string" },
  {
    field: "img",
    headerName: "Image",
    width: 70,
    renderCell: (params) => {
      return <img src={params.row.img || "/noavatar.png"} alt="" />;
    },
    sortable: false,
  },
  {
    field: "title",
    type: "string",
    headerName: "Tour Title",
    width: 300,
  },
  {
    field: "ordered",
    type: "string",
    headerName: "Ordered",
    width: 130,
  },
  {
    field: "isDiscount",
    headerName: "On Sale",
    width: 140,
    type: "boolean",
    renderCell: (params) => {
      return params.value ? (
        <span>&#10004;</span> // Hiển thị biểu tượng tick khi là true
      ) : (
        <span>&#10006;</span> // Hiển thị biểu tượng X khi là false
      );
    },
  },
  {
    field: "sale",
    headerName: "Discount Percent",
    width: 200,
    type: "string",
  },

  {
    field: "status",
    headerName: "Status",
    width: 120,
    type: "boolean",
    renderCell: (params) => {
      return params.value ? (
        <span>&#10004;</span> // Hiển thị biểu tượng tick khi là true
      ) : (
        <span>&#10006;</span> // Hiển thị biểu tượng X khi là false
      );
    },
  },
];

const ToursList = () => {
  const dispatch = useDispatch();
  const { loading, tours, tour } = useSelector((state) => state.tour);
  const [showModal, setShowModal] = useState(false);
  const [tourId, setTourId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(true);
  const transformedData =
    tours && Array.isArray(tours)
      ? tours.map((item, index) => ({
          id: index + 1,
          tourId: item.tourId,
          img: item?.thumbnailUrl,
          title: item.tourTitle,
          ordered: item.numberOfOrdered,
          isDiscount: item?.discount?.isDiscount,
          sale: item?.discount?.discountValue + "%",
          status: item.status,
        }))
      : [];

  useEffect(() => {
    dispatch(getAllTours()).unwrap();
  }, []);
  useEffect(() => {
    dispatch(getAllTours()).unwrap();
  }, [tour.status]);

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
  const handleEnableOrDisable = (id) => {
    setTourId(id);
    dispatch(getTourDetail(id)).unwrap();
    openModal();
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
        toast.error("Không thể cập nhật, vui lòng thử lại!", {
          position: toast.POSITION.TOP_RIGHT,
          pauseOnHover: true,
          autoClose: 1000,
          onClose: resolve,
        });
      }
    });
  };
  const handleSaveStatus = async () => {
    console.log(tourId);
    console.log(selectedStatus);
    try {
      await dispatch(
        updateTourStatus({ tourId: tourId, status: selectedStatus })
      ).unwrap();
      notify(1);
    } catch (error) {
      notify(2);
    }
  };
  return (
    <div className="products vh-100">
      <div className="info">
        <h1>Tours</h1>
        <ToastContainer />

        <a href="/tours-list/add-new">Add New Tour</a>
      </div>
      {/* TEST THE API */}

      {loading ? (
        <Loading isTable />
      ) : (
        <>
          <DataTable
            tourSwitch
            slug="tours-list"
            handleEnableOrDisable={handleEnableOrDisable}
            columns={columns}
            rows={transformedData}
          />
          {showModal && (
            <div className="modal-overlay2" onClick={handleOverlayClick}>
              <div className="modal2 col-md-3">
                <div className="d-flex wrap-modal-addtour">
                  <h5 className="card-header">Tour Status</h5>
                  <button className="close-btn2" onClick={closeModal}>
                    X
                  </button>
                </div>

                <div className="wrap-modal-addtour mt-2">
                  <div className="row  mb-3">
                    <div>
                      Tour status: <span>{tour.status ? "true" : "false"}</span>
                    </div>
                  </div>

                  <div className="d-flex  ">
                    {/* Thêm select vào đây */}
                    <label htmlFor="orderStatus" className="me-3 ">
                      Update Tour Status:
                    </label>
                    <select
                      id="orderStatus"
                      name="orderStatus"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </div>
                  <button
                    className="btn btn-primary mt-2"
                    onClick={handleSaveStatus}
                  >
                    Save Status
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

export default ToursList;
