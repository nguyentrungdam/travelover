import { useEffect } from "react";
import "../tours/tours.css";
import DataTable from "../../../components/dataTable/DataTable";
import { products } from "../../../assets/data/dataAdmin";
import { useDispatch, useSelector } from "react-redux";
import { getAllTours } from "../../../slices/tourSlice";
import Loading from "../../../components/Loading/Loading";

const columns = [
  { field: "id", headerName: "ID", width: 40, type: "string" },
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
    type: "string",
    headerName: "Tên khách sạn",
    width: 350,
  },
  {
    field: "phoneNumber",
    type: "string",
    headerName: "Số điện thoại",
    width: 150,
  },
  {
    field: "province",
    type: "string",
    headerName: "Địa chỉ",
    width: 150,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 100,
    type: "string",
  },
];

const Hotels = () => {
  const dispatch = useDispatch();
  const { loading, tours } = useSelector((state) => state.tour);
  const transformedData =
    tours && Array.isArray(tours)
      ? tours.map((item, index) => ({
          id: item.tourId.slice(-2),
          img: item.avatar,
          title: item.tourTitle,
          days: item.numberOfDay,
          createdAt: item.createdAt,
        }))
      : [];

  useEffect(() => {
    dispatch(getAllTours()).unwrap();
  }, []);

  return (
    <div className="products">
      <div className="info">
        <h1>Khách Sạn</h1>
        <a href="/hotels/add-new">Thêm khách sạn mới</a>
      </div>
      {/* TEST THE API */}

      {loading ? (
        <Loading isTable />
      ) : (
        <DataTable slug="hotels" columns={columns} rows={transformedData} />
      )}
    </div>
  );
};

export default Hotels;
