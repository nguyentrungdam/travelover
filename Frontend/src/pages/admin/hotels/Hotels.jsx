import { useEffect } from "react";
import "../tours/tours.css";
import DataTable from "../../../components/dataTable/DataTable";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../components/Loading/Loading";
import { getAllHotel } from "../../../slices/hotelSlice";

const columns = [
  { field: "stt", headerName: "ID", width: 40, type: "string" },
  // {
  //   field: "img",
  //   headerName: "Ảnh",
  //   width: 70,
  //   renderCell: (params) => {
  //     return <img src={params.row.img || "/noavatar.png"} alt="" />;
  //   },
  // },
  {
    field: "title",
    type: "string",
    headerName: "Hotel Name",
    width: 350,
  },
  {
    field: "email",
    type: "string",
    headerName: "Email",
    width: 200,
  },
  {
    field: "province",
    type: "string",
    headerName: "Address",
    width: 200,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 150,
    type: "string",
  },
];

const Hotels = () => {
  const dispatch = useDispatch();
  const { loading, hotels } = useSelector((state) => state.hotel);
  const transformedData =
    hotels && Array.isArray(hotels)
      ? hotels.map((item, index) => ({
          stt: index + 1,
          id: item.hotelId,
          title: item.hotelName,
          email: item.contact.email,
          province: item.address.province,
          createdAt: item.createdAt,
        }))
      : [];

  useEffect(() => {
    dispatch(getAllHotel()).unwrap();
  }, []);

  return (
    <div className="products vh-100">
      <div className="info">
        <h1>Hotels</h1>
        <a href="/hotels/add-new">Add New Hotel</a>
      </div>

      {loading ? (
        <Loading isTable />
      ) : (
        <DataTable slug="hotels" columns={columns} rows={transformedData} />
      )}
    </div>
  );
};

export default Hotels;
