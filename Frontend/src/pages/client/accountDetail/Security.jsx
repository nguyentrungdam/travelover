import React, { useState } from "react";
import { validatePassword } from "../../../utils/validate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { updateUserPassword } from "../../../slices/accountSlice";
import Loading from "../../../components/Loading/Loading";
const Security = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.account);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPasswords, setShowPasswords] = useState([false, false, false]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "currentPassword") {
      setCurrentPassword(value);
      const isValidPassword = validatePassword(e.target.value);
      if (!isValidPassword) {
        setPasswordError(
          "Mật khẩu nên có 8-20 ký tự và bao gồm ít nhất 1 chữ cái, 1 số và 1 ký tự đặc biệt (!@#$%^&*)"
        );
      } else {
        setPasswordError("");
      }
    } else if (id === "newPassword") {
      setNewPassword(value);
      const isValidPassword = validatePassword(e.target.value);
      if (!isValidPassword) {
        setNewPasswordError(
          "Mật khẩu nên có 8-20 ký tự và bao gồm ít nhất 1 chữ cái, 1 số và 1 ký tự đặc biệt (!@#$%^&*)"
        );
      } else {
        setNewPasswordError("");
      }
    } else if (id === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const handleTogglePassword = (index) => {
    setShowPasswords((prevShowPasswords) =>
      prevShowPasswords.map((showPassword, i) =>
        i === index ? !showPassword : showPassword
      )
    );
  };

  const handleSave = async () => {
    // Kiểm tra xác nhận mật khẩu
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Mật khẩu xác nhận không khớp!");
      return;
    }
    console.log(currentPassword);
    console.log(newPassword);
    try {
      const res = await dispatch(
        updateUserPassword({ password: currentPassword, newPassword })
      ).unwrap();
      console.log(res);
      if (res.data.status === "ok") {
        notify(1);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      notify(2);
    }
  };

  const notify = (prop) => {
    return new Promise((resolve) => {
      if (prop === 1) {
        toast.success("Đổi mật khẩu thành công! 👌", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
          pauseOnHover: true,
          onClose: resolve,
        });
      } else {
        toast.error("Sai mật khẩu, thử lại!", {
          position: toast.POSITION.TOP_RIGHT,
          pauseOnHover: true,
          autoClose: 1000,
          onClose: resolve,
        });
      }
    });
  };
  return (
    <>
      {loading && <Loading />}
      {!loading && (
        <div className="row vh70">
          <div className="col-lg-7">
            <div className="card mb-4">
              <div className="card-header">Thay đổi mật khẩu</div>
              <div className="card-body">
                <form>
                  <div className="formInput  mb-2">
                    <label className="small mb-1" htmlFor="currentPassword">
                      Mật khẩu hiện tại
                    </label>
                    <div className="mb-1 inputContainer">
                      <input
                        className="input-form p-2 w-100"
                        id="currentPassword"
                        type={showPasswords[0] ? "text" : "password"}
                        placeholder="Nhập mật khẩu hiện tại"
                        value={currentPassword}
                        onChange={handleChange}
                      />
                      <div
                        className="passwordIconContainer"
                        onClick={() => handleTogglePassword(0)}
                      >
                        <FontAwesomeIcon
                          icon={showPasswords[0] ? faEye : faEyeSlash}
                          className="passwordIcon "
                        />
                      </div>
                    </div>
                    {passwordError && (
                      <div className="error-container">{passwordError}</div>
                    )}
                  </div>{" "}
                  <div className="formInput mb-2 ">
                    <label className="small mb-1" htmlFor="newPassword">
                      Mật khẩu mới
                    </label>
                    <div className="mb-1 inputContainer">
                      <input
                        className="input-form p-2 w-100"
                        id="newPassword"
                        type={showPasswords[1] ? "text" : "password"}
                        placeholder="Nhập mật khẩu mới"
                        value={newPassword}
                        onChange={handleChange}
                      />
                      <div
                        className="passwordIconContainer"
                        onClick={() => handleTogglePassword(1)}
                      >
                        <FontAwesomeIcon
                          icon={showPasswords[1] ? faEye : faEyeSlash}
                          className="passwordIcon "
                        />
                      </div>
                    </div>
                    {newPasswordError && (
                      <div className="error-container">{newPasswordError}</div>
                    )}
                  </div>{" "}
                  <div className="formInput mb-2 ">
                    <label className="small mb-1" htmlFor="confirmPassword">
                      Xác nhận mật khẩu
                    </label>
                    <div className="mb-1 inputContainer">
                      <input
                        className="input-form p-2 w-100"
                        id="confirmPassword"
                        type={showPasswords[2] ? "text" : "password"}
                        placeholder="Xác nhận mật khẩu"
                        value={confirmPassword}
                        onChange={handleChange}
                      />
                      <div
                        className="passwordIconContainer"
                        onClick={() => handleTogglePassword(2)}
                      >
                        <FontAwesomeIcon
                          icon={showPasswords[2] ? faEye : faEyeSlash}
                          className="passwordIcon "
                        />
                      </div>
                    </div>
                    {confirmPasswordError && (
                      <div className="error-container">
                        {confirmPasswordError}
                      </div>
                    )}
                  </div>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleSave}
                  >
                    Lưu
                  </button>
                </form>
              </div>
            </div>
          </div>
          <ToastContainer />
        </div>
      )}
    </>
  );
};

export default Security;
