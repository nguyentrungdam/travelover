import { useEffect } from "react";
import "./ZHotel.css";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../components/dataTable/DataTable";
import { getAllHotelz } from "../../slices/zhotelSlice";
import Loading from "../../components/Loading/Loading";

const columns = [
  { field: "stt", headerName: "STT", width: 40, type: "string" },
  {
    field: "id",
    type: "string",
    headerName: "E-ID",
    width: 250,
  },
  {
    field: "title",
    type: "string",
    headerName: "Tên khách sạn",
    width: 200,
  },
  {
    field: "stars",
    type: "string",
    headerName: "Số sao",
    width: 120,
  },
  {
    field: "rooms",
    type: "string",
    headerName: "Số phòng",
    width: 120,
  },

  {
    field: "phoneNumber",
    type: "string",
    headerName: "Số điện thoại",
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
          title: item?.eHotelName,
          rooms: item?.room?.length || item?.room2?.length,
          stars: item?.numberOfStarRating || 1,
          phoneNumber: item?.phoneNumber || "0399999999",
        }))
      : [];

  useEffect(() => {
    dispatch(getAllHotelz()).unwrap();
  }, []);
  console.log(zhotels);

  return (
    <div className="products vh-100">
      <div className="info">
        <h1>Khách Sạn</h1>
        <a href="/hotelz/add-new">Thêm khách sạn mới</a>
      </div>
      {loading ? (
        <Loading isTable />
      ) : (
        <DataTable slug="hotelz" columns={columns} rows={transformedData} />
      )}
    </div>
  );
};

export default ZHotel;
