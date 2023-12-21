import { useEffect, useState } from "react";
import "./tours.css";
import DataTable from "../../../components/dataTable/DataTable";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllTours,
  getTourDetail,
  searchTourAdmin,
  updateTourStatus,
} from "../../../slices/tourSlice";
import Loading from "../../../components/Loading/Loading";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { formatDateAndHour } from "../../../utils/validate";
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
  {
    field: "lastmodified",
    headerName: "Last Modified",
    width: 210,
    type: "string",
  },
];

const ToursList = () => {
  const dispatch = useDispatch();
  const { loading, tours, tour } = useSelector((state) => state.tour);
  const [showModal, setShowModal] = useState(false);
  const [showMultiSearchModal, setShowMultiSearchModal] = useState(false);
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
          lastmodified: formatDateAndHour(item.lastModifiedAt2),
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
  const openMultiSearchModal = () => {
    setShowMultiSearchModal(true);
    document.body.classList.add("modal-open");
  };

  const closeMultiSearchModal = () => {
    setShowMultiSearchModal(false);
    document.body.classList.remove("modal-open");
    resetValues();
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay2")) {
      closeModal();
    }
  };
  const handleOverlayClick2 = (e) => {
    if (e.target.classList.contains("modal-overlay3")) {
      closeMultiSearchModal();
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
        toast.success("Update successful! 👌", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
          pauseOnHover: true,
          onClose: resolve,
        });
      } else if (prop === 3) {
        toast.success("Search successful! 👌", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
          pauseOnHover: true,
          onClose: resolve,
        });
      } else if (prop === 4) {
        toast.error("Unable to search, please try again!", {
          position: toast.POSITION.TOP_RIGHT,
          pauseOnHover: true,
          autoClose: 1000,
          onClose: resolve,
        });
      } else {
        toast.error("Unable to update, please try again!", {
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
  console.log(tours);

  const [fields, setFields] = useState([{ field: "numberOfDay", value: "" }]);
  const [currentField, setCurrentField] = useState("");
  const [currentInputValue, setCurrentInputValue] = useState("");
  const [keyWord, setKeyWord] = useState("");
  const [isDiscount, setIsDiscount] = useState(false);
  const [sort, setSort] = useState({ sortBy: "numberOfDay", order: "asc" });
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
  const handleMultiSearch = async () => {
    console.log(keyWord);
    console.log(fields);
    console.log(isDiscount);
    console.log(sort);
    try {
      const result = await dispatch(
        searchTourAdmin({
          keyword: keyWord,
          isDiscount: isDiscount,
          numberOfDay:
            fields.find((field) => field.field === "numberOfDay")?.value || "",
          numberOfOrdered:
            fields.find((field) => field.field === "numberOfOrdered")?.value ||
            "",
          discountValue:
            fields.find((field) => field.field === "discountValue")?.value ||
            "",
          sortBy: sort.sortBy,
          order: sort.order,
        })
      ).unwrap();
      console.log(result);
      notify(3);
      closeMultiSearchModal();
    } catch (error) {
      notify(4);
    }
  };
  const resetValues = () => {
    setKeyWord("");
    setFields([{ field: "numberOfDay", value: "" }]);
    setCurrentField("");
    setCurrentInputValue("");
    setIsDiscount(false);
    setSort({ sortBy: "", order: "" });
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
          <div
            className="btn-block1 w-15 mb-2 ms-0"
            onClick={openMultiSearchModal}
          >
            Multi Search
            <FontAwesomeIcon className=" ms-1" icon={faMagnifyingGlass} />
          </div>
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
          {showMultiSearchModal && (
            <div className="modal-overlay3" onClick={handleOverlayClick2}>
              <div className="modal2 col-md-3">
                <div className="d-flex wrap-modal-addtour">
                  <h5 className="card-header">Multi Search</h5>
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
                    placeholder="Enter keywords"
                    value={keyWord}
                    onChange={(e) => setKeyWord(e.target.value)}
                  />
                  <button className="btn btn-primary" onClick={handleAddSelect}>
                    Add select
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
                        <option value="numberOfDay">Number of day</option>
                        <option value="numberOfOrdered">
                          Number of ordered
                        </option>
                        <option value="discountValue">Discount percent</option>
                      </select>
                      <input
                        className="form-control w-50"
                        type="text"
                        placeholder={`Enter value for ${field.field}`}
                        value={field.value}
                        onChange={(e) =>
                          handleInputChange(index, e.target.value)
                        }
                      />
                    </div>
                  ))}
                  <div className="d-flex">
                    <label className="small mb-1 me-2">Discount: </label>
                    <input
                      name="discount"
                      className="checkbox-tour"
                      type="checkbox"
                      checked={isDiscount}
                      onChange={() => setIsDiscount(!isDiscount)}
                    />
                  </div>
                  <label className="small mb-1 me-2">Sort: </label>
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
                      <option value="numberOfDay">Number of day</option>
                      <option value="numberOfOrdered">Number of ordered</option>
                      <option value="discountValue">Discount percent</option>
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
                      <option value="asc">Increase</option>
                      <option value="desc">Decrease</option>
                    </select>
                  </div>
                  <button
                    className="btn btn-primary mt-2"
                    onClick={handleMultiSearch}
                  >
                    Search
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
