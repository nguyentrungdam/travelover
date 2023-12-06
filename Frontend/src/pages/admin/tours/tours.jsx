import { useEffect } from "react";
import "./tours.css";
import DataTable from "../../../components/dataTable/DataTable";
import { useDispatch, useSelector } from "react-redux";
import { getAllTours } from "../../../slices/tourSlice";
import Loading from "../../../components/Loading/Loading";
import { formatCurrencyWithoutD } from "../../../utils/validate";

const columns = [
  { field: "stt", headerName: "ID", width: 40, type: "string" },
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
    width: 500,
  },
  {
    field: "days",
    type: "string",
    headerName: "Days",
    width: 120,
  },
  {
    field: "price",
    headerName: "Price",
    width: 160,
    type: "string",
  },
];

const ToursList = () => {
  const dispatch = useDispatch();
  const { zhotels } = useSelector((state) => state.hotelz);
  const { loading, tours } = useSelector((state) => state.tour);
  const transformedData =
    tours && Array.isArray(tours)
      ? tours.map((item, index) => ({
          stt: index + 1,
          id: item?.tourId,
          img: item?.thumbnailUrl,
          title: item.tourTitle,
          days: item.numberOfDay,
          price: formatCurrencyWithoutD(item.priceOfAdult),
        }))
      : [];

  useEffect(() => {
    dispatch(getAllTours()).unwrap();
  }, []);

  return (
    <div className="products">
      <div className="info">
        <h1>Tours</h1>

        <a href="/tours-list/add-new">Add New Tour</a>
      </div>
      {/* TEST THE API */}

      {loading ? (
        <Loading isTable />
      ) : (
        <DataTable slug="tours-list" columns={columns} rows={transformedData} />
      )}
    </div>
  );
};

export default ToursList;
