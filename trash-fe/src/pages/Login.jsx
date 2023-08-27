import React, { useContext, useState } from "react";
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import loginImg from "../assets/images/login-logo.png";
import userIcon from "../assets/images/user.png";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";
import FormInput from "../components/Form/FormInput";
import heroVideo from "../assets/images/hero-video.mp4";

const Login = () => {
  // const [credentials, setCredentials] = useState({
  //    email: undefined,
  //    password: undefined
  // })
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  // const {dispatch} = useContext(AuthContext)
  // const navigate = useNavigate()

  // const handleChange = e => {
  //    setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }))
  // }

  //   const handleClick = async (e) => {
  //     e.preventDefault();

  //     dispatch({ type: "LOGIN_START" });

  //     try {
  //       const res = await fetch(`${BASE_URL}/auth/login`, {
  //         method: "post",
  //         headers: {
  //           "content-type": "application/json",
  //         },
  //         credentials: "include",
  //         body: JSON.stringify(credentials),
  //       });

  //       const result = await res.json();
  //       if (!res.ok) alert(result.message);
  //       console.log(result.data);

  //       dispatch({ type: "LOGIN_SUCCESS", payload: result.data });
  //       navigate("/");
  //     } catch (err) {
  //       dispatch({ type: "LOGIN_FAILURE", payload: err.message });
  //     }
  //   };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(values);
  };
  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const inputs = [
    {
      id: 1,
      name: "email",
      type: "email",
      placeholder: "Email",
      errorMessage: "Phải là một địa chỉ email hợp lệ!",
      label: "Email",
      required: true,
    },
    {
      id: 2,
      name: "password",
      type: "password",
      placeholder: "Mật Khẩu",
      maxLength: "21",
      errorMessage:
        "Mật khẩu nên có 8-20 ký tự và bao gồm ít nhất 1 chữ cái, 1 số và 1 ký tự đặc biệt (!@#$%^&*)",
      label: "Mật Khẩu",
      pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
      required: true,
    },
  ];
  return (
    <section>
      <Container>
        <Row>
          <Col lg="8" className="m-auto">
            <div className="login__container d-flex justify-content-between">
              <div className="login__img">
                <img src={loginImg} alt="" />
              </div>

              <div className="login__form login--form">
                <div className="user">
                  <img
                    src="https://static.vecteezy.com/system/resources/previews/007/167/661/original/user-blue-icon-isolated-on-white-background-free-vector.jpg"
                    alt=""
                  />
                </div>
                <h2 className="text-dark">Đăng Nhập</h2>

                <Form onSubmit={handleSubmit}>
                  {inputs.map((input) => (
                    <FormInput
                      key={input.id}
                      {...input}
                      value={values[input.name]}
                      onChange={onChange}
                    />
                  ))}
                  <Button
                    className="btn secondary__btn auth__btn mt-4"
                    type="submit"
                  >
                    Đăng Nhập
                  </Button>
                </Form>
                <p className="text-dark">
                  Bạn chưa có tài khoản? <Link to="/register">Tạo ở đây</Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Login;
