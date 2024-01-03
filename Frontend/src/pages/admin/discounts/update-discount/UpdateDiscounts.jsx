import React, { useEffect, useState } from "react";
import "../add-discount/AddDiscounts.css";
import { useDispatch, useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import {
  getDiscountDetail,
  updateDiscount,
} from "../../../../slices/discountSlice";
import { useParams } from "react-router-dom";
import { formatDate } from "../../../../utils/validate";

const UpdateDiscount = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    discountCode: "",
    discountTitle: "",
    description: "",
    startDate: "",
    endDate: "",
    discountValue: 0,
    minOrder: 0,
    maxDiscount: 0,
    isQuantityLimit: true,
    numberOfCode: 0,
  });
  const { id } = useParams();
  const { loading, discount } = useSelector((state) => state.discount);
  useEffect(() => {
    dispatch(getDiscountDetail(id)).unwrap();
  }, []);
  console.log(discount);
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData }; // Tạo một bản sao của formData
    if (name === "startDate" || name === "endDate") {
      const inputDate = e.target.value;
      const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
      if (regex.test(inputDate)) {
        const [day, month, year] = inputDate.split("-");
        const formattedDate = `${year}-${month}-${day}`;
        updatedFormData[name] = formattedDate;
      }
    } else {
      updatedFormData[name] = value;
    }
    setFormData(updatedFormData);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Tạo đối tượng FormData
    const formDataObject = new FormData();
    formDataObject.append("discountId", id);
    formDataObject.append(
      "discountCode",
      formData.discountCode || discount.discountCode
    );
    formDataObject.append(
      "discountTitle",
      formData.discountTitle || discount.discountTitle
    );
    formDataObject.append(
      "description",
      formData.description || discount.description
    );
    formDataObject.append(
      "discountValue",
      formData.discountValue || discount.discountValue
    );
    formDataObject.append(
      "startDate",
      formData.startDate || discount.startDate
    );
    formDataObject.append("endDate", formData.endDate || discount.endDate);
    formDataObject.append("minOrder", formData.minOrder || discount.minOrder);
    formDataObject.append(
      "maxDiscount",
      formData.maxDiscount || discount.maxDiscount
    );
    formDataObject.append(
      "isQuantityLimit",
      formData.isQuantityLimit || discount.isQuantityLimit
    );
    formDataObject.append(
      "numberOfCode",
      formData.numberOfCode || discount.numberOfCode
    );
    // Gửi formDataObject lên API hoặc xử lý dữ liệu tại đây
    for (const [name, value] of formDataObject.entries()) {
      console.log(name, ":", value);
    }
    try {
      const res = await dispatch(updateDiscount(formDataObject)).unwrap();
      console.log(res);
      if (res.data.status === "ok") {
        notify(1);
        window.location.reload();
      }
    } catch (err) {
      notify(2);
      // alert("Vui lòng kiểm tra lại các thông tin cho chính xác!");
    }
  };
  const notify = (prop) => {
    if (prop === 1) {
      toast.success("Cập nhật thành công! 👌", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
        pauseOnHover: true,
      });
    } else {
      toast.error("Có lỗi, vui lòng thử lại!", {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: true,
        autoClose: 1000,
      });
    }
  };

  const handleCheckboxChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      isQuantityLimit: !prevFormData.isQuantityLimit,
    }));
  };
  return (
    <div className="vh-100">
      <div className="info">
        <h1>Cập Nhật Giảm Giá</h1>
      </div>
      <div className="row row-1">
        <div className="col-xl-12">
          <div className="card mb-4">
            <div className="d-flex justify-content-between border-bottom-1">
              <div className="card-header border-bottom-none">
                Thông tin giảm giá
              </div>
              <a href="/discounts">
                <div className="btn btn-danger"> X</div>
              </a>
            </div>

            <div className="card-body">
              <form>
                <div className="row gx-3 mb-3">
                  <div className="col-md-4">
                    <label className="small mb-1">Tên mã</label>
                    <input
                      name="discountTitle"
                      defaultValue={discount.discountTitle}
                      className="form-control"
                      type="text"
                      placeholder="Tên của mã..."
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="small mb-1">Mô tả</label>
                    <input
                      name="description"
                      defaultValue={discount.description}
                      type="text"
                      className="form-control"
                      onChange={handleChange}
                      placeholder="Mô tả"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="small mb-1">Mã giảm giá</label>
                    <input
                      name="discountCode"
                      defaultValue={discount.discountCode}
                      className="form-control"
                      type="text"
                      placeholder="Mã giảm giá..."
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row gx-3 mb-3 ">
                  <div className="col-md-6 d-flex align-items-center">
                    <label className="small mb-1 me-3 w222">
                      Ngày giảm giá
                    </label>
                    <input
                      maxLength={10}
                      // defaultValue={discount.startDate}
                      defaultValue={formatDate(discount?.startDate)}
                      name="startDate"
                      className="form-control w-75"
                      placeholder="VD: 15-05-2023"
                      onChange={handleChange}
                    />
                    <label className="small mb-1 ms-3 me-1">đến</label>
                    <input
                      defaultValue={formatDate(discount?.endDate)}
                      // defaultValue={discount.endDate}
                      maxLength={10}
                      name="endDate"
                      className="form-control ms-2  w-75"
                      placeholder="Vd: 15-07-2023"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row gx-3 mb-3">
                  <div className="col-md-3">
                    <label className="small mb-1">Giá trị giảm</label>
                    <input
                      name="discountValue"
                      defaultValue={discount.discountValue}
                      className="form-control"
                      type="text"
                      placeholder="Giá trị giảm..."
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="small mb-1">Giá trị tối thiểu</label>
                    <input
                      name="minOrder"
                      defaultValue={discount.minOrder}
                      className="form-control"
                      type="text"
                      placeholder="Giá trị tối thiểu..."
                      onChange={handleChange}
                    />
                  </div>{" "}
                  <div className="col-md-3">
                    <label className="small mb-1">Giảm tối đa</label>
                    <input
                      name="maxDiscount"
                      defaultValue={discount.maxDiscount}
                      className="form-control"
                      type="text"
                      placeholder="Giảm tối đa..."
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {/* Discount */}
                <div className="col-md-3 d-flex align-items-center">
                  <label className="small mb-1 me-2">
                    Giới hạn số lượng mã:
                  </label>
                  <input
                    defaultValue={discount.isQuantityLimit}
                    name="isQuantityLimit"
                    className="checkbox-tour"
                    type="checkbox"
                    checked={formData.isQuantityLimit}
                    onChange={handleCheckboxChange}
                  />
                </div>
                {formData.isQuantityLimit ? (
                  <>
                    <div className="row gx-3 mb-3">
                      <div className="col-md-3">
                        <label className="small mb-1">Số lượng mã</label>
                        <input
                          defaultValue={discount.numberOfCode}
                          name="numberOfCode"
                          className="form-control"
                          type="text"
                          placeholder="  Số lượng mã..."
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </>
                ) : null}

                <button
                  className="btn btn-primary "
                  type="button"
                  onClick={handleSubmit}
                >
                  Cập Nhật
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default UpdateDiscount;
