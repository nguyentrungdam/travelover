import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "reactstrap";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../../../components/Form/FormInput";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { signup } from "../../../slices/accountSlice";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordMismatchError, setPasswordMismatchError] = useState("");

  const options = [
    { value: "", text: "--Bạn là?--" },
    { value: "CUSTOMER", text: "Khách Hàng" },
    { value: "ENTERPRISE", text: "Doanh Nghiệp" },
  ];
  const [role, setRole] = useState(options[0].value);
  const inputs = [
    {
      id: 1,
      name: "firstname",
      type: "text",
      placeholder: "Vd: Nguyễn",
      label: "Họ",
      maxLength: "10",
      required: true,
    },
    {
      id: 2,
      name: "lastname",
      type: "text",
      placeholder: "Vd: Nam",
      label: "Tên",
      maxLength: "10",
      required: true,
    },
    {
      id: 3,
      name: "email",
      type: "email",
      placeholder: "Vd: example@gmail.com",
      label: "Email",
      required: true,
    },

    {
      id: 4,
      className: "password-input",
      name: "password",
      type: "password",
      label: "Mật Khẩu",
      placeholder: "Vd: Test123@",
      maxLength: "21",
      required: true,
    },
    {
      id: 5,
      name: "confirmPassword",
      type: "password",
      placeholder: "Vd: Test123@",
      // errorMessage: "Mật khẩu không khớp!",
      label: "Xác Nhận Mật Khẩu",
      // pattern: values.password,
      required: true,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await dispatch(
        signup({
          firstName: values.firstname,
          lastName: values.lastname,
          email: values.email,
          password: values.password,
          role: role,
        })
      ).unwrap();
      console.log(res);
      if (res.data.status === "ok" && res.data.data.role === "CUSTOMER") {
        notify1(1);
        navigate("/login");
      } else {
        notify1(2);
        setTimeout(function () {
          navigate("/register");
        }, 1500);
      }
    } catch (error) {
      notify1(2);
      setTimeout(function () {
        navigate("/login");
      }, 1500);
    }
  };

  useEffect(() => {
    if (values.password !== "" && values.confirmPassword === "") {
      setPasswordMismatchError(""); // Reset thông báo lỗi nếu mật khẩu khớp
    } else if (values.password !== values.confirmPassword) {
      setPasswordMismatchError("Mật khẩu và xác nhận mật khẩu không khớp!");
    } else {
      setPasswordMismatchError("");
    }
  }, [values.password, values.confirmPassword]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const notify1 = (prop) => {
    if (prop === 1) {
      toast.success("Đăng ký thành công ! 👌", {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: true,
        autoClose: 1000,
      });
    } else {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!", {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: true,
        autoClose: 1000,
      });
    }
  };

  return (
    <>
      <Header />
      <section>
        <Container>
          <Row>
            <Col lg="8" className="m-auto">
              <div className="login__container d-flex justify-content-between">
                <div className="login__img">
                  <img
                    src="https://m.media-amazon.com/images/I/611rvkYeUhL._AC_UF1000,1000_QL80_.jpg"
                    alt=""
                  />
                </div>

                <div className="login__form">
                  <div className="user">
                    <img
                      src="https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
                      alt=""
                    />
                  </div>
                  <h2 className="text-dark">Đăng Ký</h2>

                  <Form onSubmit={handleSubmit}>
                    {inputs.map((input) => (
                      <FormInput
                        key={input.id}
                        {...input}
                        value={values[input.name]}
                        onChange={handleChange}
                      />
                    ))}
                    {passwordMismatchError && (
                      <span className="error-container">
                        {passwordMismatchError}
                      </span>
                    )}
                    <select
                      className="mt-3 login-select"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      {options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.text}
                        </option>
                      ))}
                    </select>
                    <Button
                      className="btn secondary__btn auth__btn mt-3  "
                      type="submit"
                    >
                      Tạo Tài Khoản
                    </Button>
                  </Form>
                  <p className="text-dark">
                    Bạn đã có tài khoản?{" "}
                    <Link to="/login">Đăng nhập tại đây</Link>
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        <ToastContainer />
      </section>
      <Footer />
    </>
  );
};

export default Register;
