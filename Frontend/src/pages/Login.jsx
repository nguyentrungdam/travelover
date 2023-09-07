import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Container, Row, Col, Form, Button } from "reactstrap";
import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import loginImg from "../assets/images/login-logo.png";
import FormInput from "../components/Form/FormInput";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { signin } from "../slices/accountSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(
        signin({ email: values.email, password: values.password })
      ).unwrap();
      console.log(res);
      if (res.d && res.data.account.Role === "user") {
        notify(1);
        setTimeout(function () {
          console.log(res.data);
          navigate("/");
        }, 1500);
        // } else if (res.data.success && res.data.account.Role === "admin") {
        //   notify(0);
        //   setTimeout(function () {
        //     console.log(res.data);
        //     navigate("/admin");
        //   }, 1500);
      } else {
        notify(2);
        setTimeout(function () {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      notify(2);
      setTimeout(function () {
        navigate("/login");
      }, 1500);
    }
  };
  const notify = (prop) => {
    if (prop === 1) {
      toast.success("🎂 Người dùng đăng nhập thành công!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    } else if (prop === 0) {
      toast.success("🎂 Admin đăng nhập thành công!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    } else {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    }
  };
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const inputs = [
    {
      id: 1,
      name: "email",
      type: "email",
      placeholder: "Email",
      label: "Email",
      required: true,
    },
    {
      id: 2,
      name: "password",
      type: "password",
      placeholder: "Mật Khẩu",
      maxLength: "21",
      label: "Mật Khẩu",
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
                      onChange={handleChange}
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
      <ToastContainer />
    </section>
  );
};

export default Login;
