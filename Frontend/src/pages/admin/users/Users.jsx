import "./users.css";
import { useEffect, useState } from "react";
import DataTable from "../../../components/dataTable/DataTable";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, updateRole } from "../../../slices/userSlice";
import Loading from "../../../components/Loading/Loading";
import { formatDateAndHour } from "../../../utils/validate";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
const columns = [
  { field: "id", headerName: "ID", width: 50 },
  {
    field: "img",
    headerName: "Image",
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
    headerName: "First Name",
    width: 150,
  },
  {
    field: "lastName",
    type: "string",
    headerName: "Last Name",
    width: 150,
  },

  {
    field: "role",
    type: "string",
    headerName: "Role",
    width: 150,
  },
  {
    field: "createdAt",
    type: "string",
    headerName: "Created At",
    width: 200,
  },
];
const Users = () => {
  const dispatch = useDispatch();
  const { loading, users } = useSelector((state) => state.user);
  const [accountId, setAccountId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const transformedData =
    users && Array.isArray(users)
      ? users.map((item, index) => ({
          id: index + 1,
          accountId: item.accountId,
          img: item.avatar,
          lastName: item.lastName,
          firstName: item.firstName,
          email: item.email,
          role: item.role,
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
        toast.success("Update successful! 👌", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
          pauseOnHover: true,
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
  return (
    <div className="users vh-100">
      <div className="info">
        <h1>Users</h1>
      </div>
      <ToastContainer />

      {loading ? (
        <Loading isTable />
      ) : (
        <div>
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
                  <h5 className="card-header">User Role</h5>
                  <button className="close-btn2" onClick={closeModal}>
                    X
                  </button>
                </div>

                <div className="d-flex wrap-modal-addtour">
                  {/* Thêm select vào đây */}
                  <label htmlFor="orderStatus" className="me-3">
                    Update User Role:
                  </label>
                  <select
                    id="orderStatus"
                    name="orderStatus"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="1">Admin</option>
                    <option value="2">Staff</option>
                    <option value="3">Customer</option>
                  </select>
                </div>
                <button
                  className="btn btn-primary wrap-modal-addtour mt-2"
                  onClick={handleSaveRole}
                >
                  Save Status
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Users;
