import { useEffect } from "react";
import "./ZHotel.css";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../components/dataTable/DataTable";
import { getAllHotelz } from "../../slices/zhotelSlice";
import Loading from "../../components/Loading/Loading";

const columns = [
  { field: "stt", headerName: "ID", width: 40, type: "string" },
  {
    field: "id",
    type: "string",
    headerName: "E-ID",
    width: 250,
  },
  {
    field: "title",
    type: "string",
    headerName: "Hotel Title",
    width: 400,
  },
  {
    field: "rooms",
    type: "string",
    headerName: "Rooms",
    width: 120,
  },
];

const ZHotel = () => {
  const dispatch = useDispatch();
  const { loading, zhotels } = useSelector((state) => state.hotelz);
  const transformedData =
    zhotels && Array.isArray(zhotels)
      ? zhotels.map((item, index) => ({
          stt: index + 1,
          id: item?.eHotelId,
          title: item.eHotelName,
          rooms: item.room.length,
        }))
      : [];

  useEffect(() => {
    dispatch(getAllHotelz()).unwrap();
  }, []);
  console.log(zhotels);

  return (
    <div className="products vh-100">
      <div className="info">
        <h1>E-Hotels</h1>
        <a href="/tours-list/add-new">Add New E-Hotel</a>
      </div>
      {loading ? (
        <Loading isTable />
      ) : (
        <DataTable slug="tours-list" columns={columns} rows={transformedData} />
      )}
    </div>
  );
};

export default ZHotel;
