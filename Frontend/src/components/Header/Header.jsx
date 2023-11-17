import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Button } from "reactstrap";
import { NavLink, Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/travel-love.png";
import "./header.css";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "../../slices/accountSlice";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
const nav__links = [
  {
    path: "/home",
    display: "Trang Chủ",
  },
  {
    path: "/dashboard",
    display: "Thông Tin",
  },
  {
    path: "/tours",
    display: "Tour",
  },
];

const Header = ({ noneSticky }) => {
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSticky, setIsSticky] = useState(false);

  const { isAuthenticated, account } = useSelector((state) => state.account);

  const handleLogout = async (e) => {
    e.preventDefault();
    await dispatch(signout());
    notify2(1);
    setTimeout(function () {
      navigate("/login");
    }, 1500);
  };
  const notify2 = (prop) => {
    if (prop === 1) {
      toast.success("Đăng xuất thành công! 👌", {
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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        if (noneSticky) {
          setIsSticky(false);
        } else {
          setIsSticky(true);
        }
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => menuRef.current.classList.toggle("show__menu");

  return (
    <header className={`header ${isSticky ? "sticky__header" : ""}`}>
      <Container>
        <Row>
          <div className="nav__wrapper d-flex align-items-center justify-content-between">
            {/* ========== LOGO ========== */}
            <div className="logo">
              <Link to="/">
                <img src={Logo} alt="" />
              </Link>
            </div>
            {/* ========================== */}

            {/* ========== MENU START ========== */}
            <div className="navigation" ref={menuRef} onClick={toggleMenu}>
              <ul className="menu d-flex align-items-center gap-5">
                {nav__links.map((item, index) => (
                  <li className="nav__item" key={index}>
                    <NavLink
                      to={item.path}
                      className={(navClass) =>
                        navClass.isActive ? "active__link" : ""
                      }
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            {/* ================================ */}

            <div className="nav__right d-flex align-items-center gap-4">
              <div className="nav__btns d-flex align-items-center gap-2">
                {isAuthenticated ? (
                  <>
                    {account?.data && (
                      <div className="userwraper">
                        <h5 className="mb-0">
                          {account.data.firstName} {account.data.lastName}
                        </h5>
                        <img
                          className="user-avatar"
                          src={account.data.avatar || "/noavatar.png"}
                          alt={account.data.lastName}
                        />
                        <div className="DropDownContent">
                          <Link className="link1" to="/account">
                            <span className="SubA">Tài Khoản</span>
                          </Link>
                          <Link className="link1" to="/user/purchase">
                            <span className="SubA">Đơn Mua</span>
                          </Link>
                          <span
                            className="SubA seperate"
                            onClick={handleLogout}
                          >
                            Đăng Xuất
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <Button className="btn secondary__btn">
                      <Link to="/login">Đăng Nhập</Link>
                    </Button>
                    <Button className="btn primary__btn">
                      <Link to="/register">Đăng Ký</Link>
                    </Button>
                  </>
                )}
                {/* <Button className='btn secondary__btn'><Link to='/login'>Login</Link></Button>
                        <Button className='btn primary__btn'><Link to='/register'>Register</Link></Button> */}
              </div>

              <span className="mobile__menu" onClick={toggleMenu}>
                <i className="ri-menu-line"></i>
              </span>
            </div>
          </div>
        </Row>
      </Container>
      <ToastContainer />
    </header>
  );
};

export default Header;
