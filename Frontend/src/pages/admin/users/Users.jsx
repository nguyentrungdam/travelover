import "./users.css";
import { useEffect, useState } from "react";
import DataTable from "../../../components/dataTable/DataTable";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, searchUser, updateRole } from "../../../slices/userSlice";
import Loading from "../../../components/Loading/Loading";
import {
  convertDateFormat,
  formatDateAndHour,
  getVietNameseNameOfRole,
} from "../../../utils/validate";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
const columns = [
  { field: "id", headerName: "STT", width: 50 },
  {
    field: "img",
    headerName: "Ảnh",
    width: 100,
    renderCell: (params) => {
      return <img src={params.row.img || "/noavatar.png"} alt="" />;
    },
  },
  {
    field: "email",
    type: "string",
    headerName: "Email",
    width: 200,
  },
  {
    field: "firstName",
    type: "string",
    headerName: "Họ",
    width: 150,
  },
  {
    field: "lastName",
    type: "string",
    headerName: "Tên",
    width: 150,
  },

  {
    field: "role",
    type: "string",
    headerName: "Vai trò",
    width: 150,
  },
  {
    field: "createdAt",
    type: "string",
    headerName: "Ngày tạo",
    width: 200,
  },
];
const Users = () => {
  const dispatch = useDispatch();
  const { loading, users } = useSelector((state) => state.user);
  const [accountId, setAccountId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showMultiSearchModal, setShowMultiSearchModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [keyWord, setKeyWord] = useState("");
  const [sort, setSort] = useState({ sortBy: "createdAt2", order: "asc" });
  const [fields, setFields] = useState([{ field: "role", value: "" }]);
  const [currentField, setCurrentField] = useState("");
  const [currentInputValue, setCurrentInputValue] = useState("");
  const transformedData =
    users && Array.isArray(users)
      ? users.map((item, index) => ({
          id: index + 1,
          accountId: item.accountId,
          img: item.avatar,
          lastName: item.lastName,
          firstName: item.firstName,
          email: item.email,
          role: getVietNameseNameOfRole(item.role),
          createdAt: formatDateAndHour(item.createdAt2),
        }))
      : [];

  useEffect(() => {
    dispatch(getAllUsers()).unwrap();
  }, []);

  const handleUpdateAccountRole = (accountId) => {
    setAccountId(accountId);
    openModal();
  };
  console.log(users);
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
  const handleSaveRole = async () => {
    console.log(accountId);
    console.log(selectedStatus);
    try {
      await dispatch(
        updateRole({ accountId: accountId, role: selectedStatus })
      ).unwrap();
      notify(1);
      closeModal();
      dispatch(getAllUsers()).unwrap();
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
        toast.error("Có lỗi, vui lòng thử lại!", {
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
    try {
      console.log(1);
      const searchParams = {
        keyword: keyWord,
        role: fields.find((field) => field.field === "role")?.value || "",
        sortBy: sort.sortBy,
        order: sort.order,
      };
      dispatch(searchUser(searchParams)).unwrap();
      console.log(2);
      closeMultiSearchModal();
    } catch (error) {
      // notify(4);
    }
  };
  const resetValues = () => {
    setKeyWord("");
    setFields([{ field: "role", value: "" }]);
    setCurrentField("");
    setCurrentInputValue("");
    setSort({ sortBy: "", order: "" });
  };
  return (
    <div className="users vh-100">
      <div className="info">
        <h1>Người dùng </h1>
      </div>
      <ToastContainer />

      {loading ? (
        <Loading isTable />
      ) : (
        <div>
          <div
            className="btn-block1 w-15 mb-2 ms-0"
            onClick={openMultiSearchModal}
          >
            Tìm Kiếm...
            <FontAwesomeIcon className=" ms-1" icon={faMagnifyingGlass} />
          </div>
          <DataTable
            slug="users"
            columns={columns}
            rows={transformedData}
            handleUpdateAccountRole={handleUpdateAccountRole}
          />
          {showModal && (
            <div className="modal-overlay2" onClick={handleOverlayClick}>
              <div className="modal2 col-md-3">
                <div className="d-flex wrap-modal-addtour">
                  <h5 className="card-header">Vai trò</h5>
                  <button className="close-btn2" onClick={closeModal}>
                    X
                  </button>
                </div>

                <div className="d-flex wrap-modal-addtour">
                  {/* Thêm select vào đây */}
                  <label htmlFor="orderStatus" className="me-3">
                    Cập nhật vai trò:
                  </label>
                  <select
                    id="orderStatus"
                    name="orderStatus"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="1">Quản Trị Viên</option>
                    <option value="2">Nhân Viên</option>
                    <option value="3">Khách Hàng</option>
                  </select>
                </div>
                <button
                  className="btn btn-primary wrap-modal-addtour mt-2"
                  onClick={handleSaveRole}
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
                        <option value="role">Vai trò</option>
                      </select>
                      <input
                        className="form-control w-50"
                        type="text"
                        value={field.value}
                        onChange={(e) =>
                          handleInputChange(index, e.target.value)
                        }
                      />
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
        </div>
      )}
    </div>
  );
};

export default Users;
