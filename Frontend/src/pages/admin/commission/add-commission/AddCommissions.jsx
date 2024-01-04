import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { createCommission } from "../../../../slices/commissionSlice";

const AddCommissions = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    rate: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Tạo đối tượng FormData
    const formDataObject = new FormData();
    formDataObject.append("name", formData.name);
    formDataObject.append("rate", formData.rate);

    // Gửi formDataObject lên API hoặc xử lý dữ liệu tại đây
    for (const [name, value] of formDataObject.entries()) {
      console.log(name, ":", value);
    }
    try {
      const res = await dispatch(createCommission(formDataObject)).unwrap();
      console.log(res);
      if (res.data.status === "ok") {
        notify(1);
        window.location.reload();
      }
    } catch (err) {
      notify(2);
    }
  };
  const notify = (prop) => {
    if (prop === 1) {
      toast.success("Thêm hoa hồng thành công! 👌", {
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

  return (
    <div className="vh-100">
      <div className="info">
        <h1>Thêm Hoa Hồng Mới</h1>
      </div>
      <div className="row row-1">
        <div className="col-xl-4">
          <div className="card mb-4">
            <div className="d-flex justify-content-between border-bottom-1">
              <div className="card-header border-bottom-none">
                Thông tin hoa hồng
              </div>
              <a href="/commissions">
                <div className="btn btn-danger"> X</div>
              </a>
            </div>
            <div className="card-body ">
              <form>
                <div className="row gx-3 mb-3">
                  <div className="col-md-12">
                    <label className="small mb-1">Tên hoa hồng</label>
                    <input
                      name="name"
                      className="form-control"
                      type="text"
                      placeholder="Tên hoa hồng..."
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row gx-3 mb-3">
                  <div className="col-md-6">
                    <label className="small mb-1">Tỷ lệ hoa hồng</label>
                    <input
                      name="rate"
                      className="form-control"
                      type="text"
                      placeholder="0-100 (đơn vị%)"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <button
                  className="btn btn-primary "
                  type="button"
                  onClick={handleSubmit}
                >
                  Tạo Hoa Hồng
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

export default AddCommissions;
