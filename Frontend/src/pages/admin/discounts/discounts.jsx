import { useEffect } from "react";
import "./discounts.css";
import DataTable from "../../../components/dataTable/DataTable";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../components/Loading/Loading";
import { getAllDiscounts } from "../../../slices/discountSlice";
import { formatCurrencyWithoutD, formatDate } from "../../../utils/validate";

const columns = [
  { field: "stt", headerName: "STT", width: 40, type: "string" },
  {
    field: "title",
    headerName: "Tên mã ",
    width: 180,
    type: "string",
  },
  {
    field: "description",
    type: "string",
    headerName: "Mô tả",
    width: 400,
  },
  {
    field: "discountCode",
    type: "string",
    headerName: "Mã giảm giá",
    width: 180,
  },

  {
    field: "quantity",
    type: "string",
    headerName: "Số lượng",
    width: 140,
  },
  {
    field: "numberOfCodeUsed",
    type: "string",
    headerName: "Đã dùng",
    width: 110,
  },
  {
    field: "endDate",
    type: "string",
    headerName: "Ngày hết hạn",
    width: 150,
  },
];

const DiscountList = () => {
  const dispatch = useDispatch();
  const { loading, discounts } = useSelector((state) => state.discount);

  const transformedData =
    discounts && Array.isArray(discounts)
      ? discounts.map((item, index) => ({
          stt: index + 1,
          id: item?.discountId,
          title: item?.discountTitle,
          discountCode: item?.discountCode,
          description:
            "Giảm " +
            item?.discountValue +
            "% cho đơn từ " +
            formatCurrencyWithoutD(item?.minOrder) +
            "đ, tối đa " +
            formatCurrencyWithoutD(item?.maxDiscount) +
            "đ",
          quantity: item?.numberOfCode,
          numberOfCodeUsed: item?.numberOfCodeUsed,
          endDate: formatDate(item?.endDate),
        }))
      : [];

  useEffect(() => {
    dispatch(getAllDiscounts()).unwrap();
  }, []);
  console.log(discounts);
  return (
    <div className="products1 ">
      <div className="info">
        <h1>Giảm Giá</h1>
        <a href="/discounts/add-new">Thêm mã mới</a>
      </div>
      {/* TEST THE API */}

      {loading ? (
        <Loading isTable />
      ) : (
        <>
          <DataTable
            slug="discounts"
            columns={columns}
            rows={transformedData}
            width80={80}
          />
        </>
      )}
    </div>
  );
};

export default DiscountList;
