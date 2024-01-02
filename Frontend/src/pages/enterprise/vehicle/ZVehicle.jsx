import { useEffect } from "react";
import "./ZVehicle.css";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../components/Loading/Loading";
import DataTable from "../../../components/dataTable/DataTable";
import { getAllVehiclez } from "../../../slices/zvehicleSlice";

const columns = [
  { field: "stt", headerName: "STT", width: 40, type: "string" },

  {
    field: "title",
    type: "string",
    headerName: "Tên nhà xe",
    width: 200,
  },
  {
    field: "id",
    type: "string",
    headerName: "E-ID",
    width: 250,
  },
  {
    field: "stars",
    type: "string",
    headerName: "Số sao",
    width: 120,
  },
  {
    field: "cars",
    type: "string",
    headerName: "Số xe",
    width: 120,
  },

  {
    field: "phoneNumber",
    type: "string",
    headerName: "Số điện thoại",
    width: 180,
  },
  {
    field: "province",
    type: "string",
    headerName: "Địa chỉ",
    width: 200,
  },
];

const ZVehicle = () => {
  const dispatch = useDispatch();
  const { loading, zvehicles } = useSelector((state) => state.vehiclez);
  const transformedData =
    zvehicles && Array.isArray(zvehicles)
      ? zvehicles.map((item, index) => ({
          stt: index + 1,
          id: item?.eVehicleId,
          title: item?.eVehicleName,
          cars: item?.coachList?.length,
          stars: item?.numberOfStarRating,
          phoneNumber: item?.phoneNumber,
          province: item?.address?.province,
        }))
      : [];

  useEffect(() => {
    dispatch(getAllVehiclez()).unwrap();
  }, []);
  console.log(zvehicles);

  return (
    <div className="products vh-100">
      <div className="info">
        <h1>Nhà Xe</h1>
        <a href="/vehiclez/add-new">Thêm nhà xe mới</a>
      </div>
      {loading ? (
        <Loading isTable />
      ) : (
        <DataTable
          slug="vehiclez"
          columns={columns}
          rows={transformedData}
          width80
        />
      )}
    </div>
  );
};

export default ZVehicle;
