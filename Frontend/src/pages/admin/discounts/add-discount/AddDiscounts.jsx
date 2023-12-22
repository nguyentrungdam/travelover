import React, { useState } from "react";
import "./AddDiscounts.css";
import { useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { createDiscount } from "../../../../slices/discountSlice";

const AddDiscount = () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "startDate" || name === "endDate") {
      if (value.length === 10) {
        const [day, month, year] = value.split("-");
        const formattedDate = `${year}-${month}-${day}`;
        setFormData({
          ...formData,
          [name]: formattedDate,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Tạo đối tượng FormData
    const formDataObject = new FormData();
    formDataObject.append("discountCode", formData.discountCode);
    formDataObject.append("discountTitle", formData.discountTitle);
    formDataObject.append("description", formData.description);
    formDataObject.append("discountValue", formData.discountValue);
    formDataObject.append("startDate", formData.startDate);
    formDataObject.append("endDate", formData.endDate);
    formDataObject.append("minOrder", formData.minOrder);
    formDataObject.append("maxDiscount", formData.maxDiscount);
    formDataObject.append("isQuantityLimit", formData.isQuantityLimit);
    formDataObject.append("numberOfCode", formData.numberOfCode);
    // Gửi formDataObject lên API hoặc xử lý dữ liệu tại đây
    for (const [name, value] of formDataObject.entries()) {
      console.log(name, ":", value);
    }
    try {
      const res = await dispatch(createDiscount(formDataObject)).unwrap();
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
      toast.success("Thêm mã thành công! 👌", {
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
        <h1>Thêm Mã Mới</h1>
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
                      name="startDate"
                      className="form-control w-75"
                      placeholder="VD: 15-05-2023"
                      onChange={handleChange}
                    />
                    <label className="small mb-1 ms-3 me-1">đến</label>
                    <input
                      maxLength={10}
                      name="endDate"
                      className="form-control w-75 ms-2"
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
                  Tạo Mã
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

export default AddDiscount;
