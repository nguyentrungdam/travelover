import { useEffect, useState } from "react";
import "./discounts.css";
import DataTable from "../../../components/dataTable/DataTable";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../components/Loading/Loading";
import {
  getAllDiscounts,
  searchDiscountAdmin,
} from "../../../slices/discountSlice";
import {
  convertDateFormat,
  formatCurrencyWithoutD,
  formatDate,
} from "../../../utils/validate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

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
    width: 380,
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
  const [keyWord, setKeyWord] = useState("");
  const [sort, setSort] = useState({ sortBy: "createdAt2", order: "asc" });
  const [fields, setFields] = useState([{ field: "minOrder", value: "" }]);
  const [currentField, setCurrentField] = useState("");
  const [currentInputValue, setCurrentInputValue] = useState("");
  const [showMultiSearchModal, setShowMultiSearchModal] = useState(false);
  const [createdAtInput, setCreatedAtInput] = useState("");

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
  //!xử lý multi search
  const openMultiSearchModal = () => {
    setShowMultiSearchModal(true);
    document.body.classList.add("modal-open");
  };
  const handleOverlayClick2 = (e) => {
    if (e.target.classList.contains("modal-overlay3")) {
      closeMultiSearchModal();
    }
  };
  const closeMultiSearchModal = () => {
    setShowMultiSearchModal(false);
    document.body.classList.remove("modal-open");
    resetValues();
  };
  const handleAddSelect = () => {
    setFields((prevFields) => [
      ...prevFields,
      { field: currentField, value: currentInputValue },
    ]);
    setCurrentField("");
    setCurrentInputValue("");
  };
  const handleSelectChange = (index, value) => {
    setFields((prevFields) => {
      const updatedFields = [...prevFields];
      updatedFields[index].field = value;
      return updatedFields;
    });
  };
  const handleInputChange = (index, value) => {
    setFields((prevFields) => {
      const updatedFields = [...prevFields];
      updatedFields[index].value = value;
      return updatedFields;
    });
  };

  const handleMultiSearch = () => {
    console.log(keyWord);
    console.log(fields);
    console.log(sort);
    const convertedDate = convertDateFormat(createdAtInput);
    console.log(convertedDate);

    try {
      console.log(1);
      const searchParams = {
        keyword: keyWord,
        minOrder:
          fields.find((field) => field.field === "minOrder")?.value || "",
        discountValue:
          fields.find((field) => field.field === "discountValue")?.value || "",
        sortBy: sort.sortBy,
        order: sort.order,
      };

      if (convertedDate !== undefined) {
        searchParams.createdAt2 = convertedDate;
      }

      dispatch(searchDiscountAdmin(searchParams)).unwrap();
      console.log(2);
      closeMultiSearchModal();
    } catch (error) {
      // notify(4);
    }
  };

  const resetValues = () => {
    setKeyWord("");
    setFields([{ field: "minOrder", value: "" }]);
    setCurrentField("");
    setCurrentInputValue("");
    setSort({ sortBy: "", order: "" });
  };
  return (
    <div className="products1 mb-5">
      <div className="info">
        <h1>Giảm Giá</h1>
        <a href="/discounts/add-new">Thêm mã mới</a>
      </div>
      {/* TEST THE API */}

      {loading ? (
        <Loading isTable />
      ) : (
        <>
          <div
            className="btn-block1 w-15 mb-2 ms-0"
            onClick={openMultiSearchModal}
          >
            Tìm Kiếm...
            <FontAwesomeIcon className=" ms-1" icon={faMagnifyingGlass} />
          </div>
          <DataTable
            slug="discounts"
            columns={columns}
            rows={transformedData}
            width80={80}
          />
          {showMultiSearchModal && (
            <div className="modal-overlay3" onClick={handleOverlayClick2}>
              <div className="modal2 col-md-3">
                <div className="d-flex wrap-modal-addtour">
                  <h5 className="card-header">Tìm kiếm</h5>
                  <button
                    className="close-btn2"
                    onClick={closeMultiSearchModal}
                  >
                    X
                  </button>
                </div>
                <div className="mt-3 ">
                  <input
                    className="form-control mb-2 "
                    type="text"
                    placeholder="Nhập từ khóa"
                    value={keyWord}
                    onChange={(e) => setKeyWord(e.target.value)}
                  />
                  <button className="btn btn-primary" onClick={handleAddSelect}>
                    Thêm Lựa Chọn
                  </button>
                  {fields.map((field, index) => (
                    <div key={index} className="my-2">
                      <select
                        className="me-2 p-1 mb-2"
                        value={field.field}
                        onChange={(e) =>
                          handleSelectChange(index, e.target.value)
                        }
                      >
                        <option value="minOrder">Đơn tối thiểu</option>
                        <option value="createdAt2">Ngày tạo</option>
                        <option value="discountValue">Giá trị giảm (%)</option>
                      </select>
                      {field.field === "createdAt2" ? (
                        <input
                          className="form-control w-50"
                          type="text"
                          value={createdAtInput}
                          onChange={(e) => {
                            setCreatedAtInput(e.target.value);
                          }}
                        />
                      ) : (
                        <input
                          className="form-control w-50"
                          type="text"
                          value={field.value}
                          onChange={(e) =>
                            handleInputChange(index, e.target.value)
                          }
                        />
                      )}
                    </div>
                  ))}

                  <label className="small mb-1 me-2">Sắp xếp: </label>
                  <div className="d-flex">
                    <select
                      className="me-2 p-1 mb-2"
                      value={sort.sortBy}
                      onChange={(e) =>
                        setSort((prevSort) => ({
                          ...prevSort,
                          sortBy: e.target.value,
                        }))
                      }
                    >
                      <option value="minOrder">Đơn tối thiểu</option>
                      <option value="createdAt2">Ngày tạo</option>
                      <option value="discountValue">Giá trị giảm (%)</option>
                    </select>
                    <select
                      className="me-2 p-1 mb-2"
                      value={sort.order}
                      onChange={(e) =>
                        setSort((prevSort) => ({
                          ...prevSort,
                          order: e.target.value,
                        }))
                      }
                    >
                      <option value="asc">Tăng </option>
                      <option value="desc">Giảm</option>
                    </select>
                  </div>
                  <button
                    className="btn btn-primary mt-2"
                    onClick={handleMultiSearch}
                  >
                    Tìm Kiếm
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DiscountList;
