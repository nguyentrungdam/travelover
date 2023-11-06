import "./users.css";
import { useEffect, useState } from "react";
import { userRows } from "../../../assets/data/dataAdmin";
import DataTable from "../../../components/dataTable/DataTable";
import Add from "../../../components/add/Add";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../../slices/userSlice";
import Loading from "../../../components/Loading/Loading";

const columns = [
  { field: "id", headerName: "ID", width: 50 },
  {
    field: "img",
    headerName: "Ảnh",
    width: 100,
    renderCell: (params) => {
      return <img src={params.row.img || "/noavatar.png"} alt="" />;
    },
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
    field: "email",
    type: "string",
    headerName: "Email",
    width: 200,
  },
  {
    field: "role",
    type: "string",
    headerName: "Vai trò",
    width: 150,
  },
  {
    field: "createdAt",
    headerName: "Ngày tạo",
    width: 120,
    type: "string",
  },
  {
    field: "verified",
    headerName: "Verified",
    width: 100,
    type: "boolean",
  },
];

const Users = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { loading, users } = useSelector((state) => state.user);
  const transformedData =
    users && Array.isArray(users)
      ? users.map((item, index) => ({
          id: index + 1,
          img: item.avatar,
          lastName: item.lastName,
          firstName: item.firstName,
          email: item.email,
          role: item.role,
          createdAt: item.createdAt,
          verified: item.status,
        }))
      : [];

  useEffect(() => {
    dispatch(getAllUsers()).unwrap();
  }, []);

  return (
    <div className="users">
      <div className="info">
        <h1>Users</h1>
        <button onClick={() => setOpen(true)}>Add New User</button>
      </div>

      {loading ? (
        <Loading isTable />
      ) : (
        <DataTable slug="users" columns={columns} rows={transformedData} />
      )}
      {open && <Add slug="user" columns={columns} setOpen={setOpen} />}
    </div>
  );
};

export default Users;
