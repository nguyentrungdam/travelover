import { useEffect, useState } from "react";
import "./tours.css";
import DataTable from "../../../components/dataTable/DataTable";
import { products } from "../../../assets/data/dataAdmin";
import { useDispatch, useSelector } from "react-redux";
import { getAllTours } from "../../../slices/tourSlice";
import Loading from "../../../components/Loading/Loading";

const columns = [
  { field: "id", headerName: "ID", width: 40, type: "string" },
  {
    field: "img",
    headerName: "Image",
    width: 70,
    renderCell: (params) => {
      return <img src={params.row.img || "/noavatar.png"} alt="" />;
    },
  },
  {
    field: "title",
    type: "string",
    headerName: "Tên tour",
    width: 650,
  },
  {
    field: "days",
    type: "string",
    headerName: "Sồ ngày",
    width: 150,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 100,
    type: "string",
  },
];

const ToursList = () => {
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
        <h1>Tours</h1>
        <a href="/tours-list/add-new">Thêm tour mới</a>
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
