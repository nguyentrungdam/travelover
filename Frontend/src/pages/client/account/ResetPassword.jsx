import React, { useEffect, useState } from "react";
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import { Col, Container, Row } from "reactstrap";
import "./login.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import {
  validateEmail,
  validateOTP,
  validatePassword,
} from "../../../utils/validate";
import { useDispatch, useSelector } from "react-redux";
import {
  sendOtpToEmail,
  updateResetPassword,
} from "../../../slices/accountSlice";
import Loading from "../../../components/Loading/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.account);
  const [errorEmailMessage, setErrorEmailMessage] = useState("");
  const [email, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    let countdownTimer;
    if (isCountingDown && countdown > 0) {
      countdownTimer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsCountingDown(false);
      setCountdown(60);
    }

    return () => {
      clearInterval(countdownTimer);
    };
  }, [isCountingDown, countdown]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "email") {
      setCurrentPassword(value);
      const isValidEmail = validateEmail(e.target.value);
      if (!isValidEmail) {
        setErrorEmailMessage("Phải là một địa chỉ email hợp lệ!");
      } else {
        setErrorEmailMessage("");
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
    } else {
      setOtp(e.target.value);
      const isValidOtp = validateOTP(e.target.value);
      if (!isValidOtp) {
        setOtpError("Mã OTP có 6 chữ số!");
      } else {
        setOtpError("");
      }
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    console.log(email);
    try {
      await dispatch(sendOtpToEmail(email)).unwrap();
      setIsCountingDown(true);
      notify(1);
    } catch (error) {
      console.log(error);
      notify(2);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    console.log(email);
    console.log(otp);
    console.log(newPassword);
    try {
      const res = await dispatch(
        updateResetPassword({
          email: email,
          code: otp,
          newPassword: newPassword,
        })
      ).unwrap();
      console.log(res);
      notify(1);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.log(error);
      notify(2);
    }
  };
  const notify = (prop) => {
    return new Promise((resolve) => {
      if (prop === 1) {
        toast.success("Gửi OTP thành công! 👌", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
          pauseOnHover: true,
          onClose: resolve,
        });
      } else if (prop === 3) {
        toast.success("Đặt lại mật khẩu thành công! 👌", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
          pauseOnHover: true,
          onClose: resolve,
        });
      } else {
        toast.error("Vui lòng kiểm tra lại email!", {
          position: toast.POSITION.TOP_RIGHT,
          pauseOnHover: true,
          autoClose: 1000,
          onClose: resolve,
        });
      }
    });
  };

  return (
    <div>
      <Header />
      <section>
        <Container className="vh70">
          <Row>
            {loading && <Loading />}
            {!loading && (
              <Col lg="4" className="m-auto mt-5">
                <div className="reset-container  ">
                  <h4>Quên Mật Khẩu</h4>
                  <div className="formInput mb-2 ">
                    <label className="small mb-1" htmlFor="email">
                      Email
                    </label>
                    <div className="mb-1 inputContainer position-relative">
                      <input
                        className="input-form p-2 w-100"
                        id="email"
                        type="email"
                        placeholder="Nhập email để nhận OTP"
                        value={email}
                        onChange={handleChange}
                      />
                      {isCountingDown ? (
                        <div className="wait-otp">{`Đợi ${countdown}s`}</div>
                      ) : (
                        <div className="send-otp" onClick={handleSendOTP}>
                          Gửi OTP
                        </div>
                      )}
                    </div>
                    {errorEmailMessage && (
                      <div className="error-container">{errorEmailMessage}</div>
                    )}
                  </div>
                  <div className="formInput mb-2 ">
                    <label className="small mb-1" htmlFor="email">
                      OTP
                    </label>
                    <div className="mb-1 inputContainer">
                      <input
                        className="input-form p-2 w-100"
                        id="otp"
                        type="text"
                        placeholder="Nhập OTP"
                        value={otp}
                        onChange={handleChange}
                      />
                    </div>
                    {otpError && (
                      <div className="error-container">{otpError}</div>
                    )}
                  </div>
                  <div className="formInput mb-2 ">
                    <label className="small mb-1" htmlFor="email">
                      Mật khẩu mới
                    </label>
                    <div className="mb-1 inputContainer position-relative">
                      <input
                        className="input-form p-2 w-100"
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu mới"
                        value={newPassword}
                        onChange={handleChange}
                      />
                      <div
                        className="passwordIconContainer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <FontAwesomeIcon
                          icon={showPassword ? faEye : faEyeSlash}
                          className="passwordIcon "
                        />
                      </div>
                    </div>
                    {newPasswordError && (
                      <div className="error-container">{newPasswordError}</div>
                    )}
                  </div>
                  <div
                    className="btn primary__btn text-white"
                    onClick={handleSave}
                  >
                    Lưu
                  </div>
                </div>
              </Col>
            )}
          </Row>
        </Container>
        <ToastContainer />
      </section>
      <Footer />
    </div>
  );
};

export default ResetPassword;
