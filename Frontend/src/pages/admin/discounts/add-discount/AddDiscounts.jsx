import React, { useState } from "react";
import "./AddDiscounts.css";
import { useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { createDiscount } from "../../../../slices/discountSlice";

const AddDiscount = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
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
      if (value.length === 5) {
        const [day, month] = value.split("-");
        const today = new Date();
        const newDate = new Date(today.getFullYear(), month - 1, +day);
        const offset = today.getTimezoneOffset();
        newDate.setMinutes(newDate.getMinutes() - offset);
        const formattedDate = newDate.toISOString().split("T")[0];
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
      toast.success("Thêm discount thành công ! 👌", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
        pauseOnHover: true,
      });
    } else {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!", {
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
        <h1>Add New Discount</h1>
        <a href="/discounts">Back</a>
      </div>
      <div className="row row-1">
        <div className="col-xl-12">
          <div className="card mb-4">
            <div className="card-header">Discount Infomation</div>
            <div className="card-body">
              <form>
                <div className="row gx-3 mb-3">
                  <div className="col-md-6">
                    <label className="small mb-1">Discount title</label>
                    <input
                      name="discountTitle"
                      className="form-control"
                      type="text"
                      placeholder="Name of the discount..."
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="small mb-1">Description</label>
                    <input
                      name="description"
                      type="text"
                      className="form-control"
                      onChange={handleChange}
                      placeholder="Enter description"
                    />
                  </div>
                </div>
                <div className="row gx-3 mb-3 ">
                  <div className="col-md-6 d-flex align-items-center">
                    <label className="small mb-1 me-3 w200">
                      Discount date
                    </label>
                    <input
                      maxLength={5}
                      name="startDate"
                      className="form-control w-75"
                      placeholder="Ex: 15-05"
                      onChange={handleChange}
                    />
                    <label className="small mb-1 ms-3 me-1">to</label>
                    <input
                      maxLength={5}
                      name="endDate"
                      className="form-control w-75 ms-2"
                      placeholder="Ex: 15-07"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row gx-3 mb-3">
                  <div className="col-md-3">
                    <label className="small mb-1">Discount value</label>
                    <input
                      name="discountValue"
                      className="form-control"
                      type="text"
                      placeholder="Enter a discount value..."
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="small mb-1">Min order</label>
                    <input
                      name="minOrder"
                      className="form-control"
                      type="text"
                      placeholder="Enter a min order..."
                      onChange={handleChange}
                    />
                  </div>{" "}
                  <div className="col-md-3">
                    <label className="small mb-1">Max discount</label>
                    <input
                      name="maxDiscount"
                      className="form-control"
                      type="text"
                      placeholder="Enter a max discount..."
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {/* Discount */}
                <div className="col-md-3 d-flex align-items-center">
                  <label className="small mb-1 me-2">
                    Limited number of vouchers:
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
                        <label className="small mb-1">
                          Quantity of voucher
                        </label>
                        <input
                          name="numberOfCode"
                          className="form-control"
                          type="text"
                          placeholder="Enter quantity..."
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
                  Create Discount
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
