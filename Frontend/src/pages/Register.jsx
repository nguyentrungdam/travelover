import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL, REUNICODE } from "../utils/config";
import FormInput from "../components/Form/FormInput";

const Register = () => {
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
    { value: "customer", text: "Khách Hàng" },
    { value: "enterprise", text: "Doanh Nghiệp" },
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ ...values, role });
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

  //   const [credentials, setCredentials] = useState({
  //     userName: undefined,
  //     email: undefined,
  //     password: undefined,
  //   });

  //   const { dispatch } = useContext(AuthContext);
  //   const navigate = useNavigate();

  //   const handleChange = (e) => {
  //     setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  //   };

  //   const handleClick = async (e) => {
  //     e.preventDefault();

  //     try {
  //       const res = await fetch(`${BASE_URL}/auth/register`, {
  //         method: "post",
  //         headers: {
  //           "content-type": "application/json",
  //         },
  //         body: JSON.stringify(credentials),
  //       });
  //       const result = await res.json();

  //       if (!res.ok) alert(result.message);

  //       dispatch({ type: "REGISTER_SUCCESS" });
  //       navigate("/login");
  //     } catch (err) {
  //       alert(err.message);
  //     }
  //   };

  return (
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
                    src="https://static.vecteezy.com/system/resources/previews/007/167/661/original/user-blue-icon-isolated-on-white-background-free-vector.jpg"
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
                    className="mt-3"
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
    </section>
  );
};

export default Register;
