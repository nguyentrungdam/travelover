import React from "react";
import "./footer.css";
import { Container, Row, Col, ListGroup, ListGroupItem } from "reactstrap";
import { Link } from "react-router-dom";
import logo from "../../assets/images/travel-love.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faGithub,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
const quick__links = [
  {
    path: "/",
    display: "Trang Chủ",
  },
  {
    path: "/introduce",
    display: "Giới Thiệu",
  },
  {
    path: "/tour-guide",
    display: "Cẩm Nang Du Lịch",
  },
];

const quick__links2 = [
  {
    path: "/login",
    display: "Đăng Nhập",
  },
  {
    path: "/register",
    display: "Đăng Ký",
  },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg="3">
            <div className="logo">
              <img src={logo} alt="" />
              <div className="social__link d-flex align-items-center gap-4">
                <FontAwesomeIcon icon={faYoutube} className="footer-icon" />
                <FontAwesomeIcon icon={faGithub} className="footer-icon" />
                <FontAwesomeIcon icon={faFacebook} className="footer-icon" />
                <FontAwesomeIcon icon={faInstagram} className="footer-icon" />
              </div>
            </div>
          </Col>

          <Col lg="3">
            <h5 className="footer__link-title">Khám phá</h5>

            <ListGroup className="footer__quick-links">
              {quick__links.map((item, index) => (
                <ListGroupItem key={index} className="ps-0 border-0">
                  <Link to={item.path}>{item.display}</Link>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
          <Col lg="3">
            <h5 className="footer__link-title">Truy cập nhanh</h5>

            <ListGroup className="footer__quick-links">
              {quick__links2.map((item, index) => (
                <ListGroupItem key={index} className="ps-0 border-0">
                  <Link to={item.path}>{item.display}</Link>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
          <Col lg="3">
            <h5 className="footer__link-title">Liên Hệ</h5>

            <ListGroup className="footer__quick-links">
              <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-3">
                <h6 className="mb-0 d-flex align-items-center gap-2">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="footer-icon-2"
                  />
                  Địa chỉ:
                </h6>
                <p className="mb-0">Số 1, Võ Văn Ngân</p>
              </ListGroupItem>

              <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-3">
                <h6 className="mb-0 d-flex align-items-center gap-2">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="footer-icon-2"
                  />
                  Email:
                </h6>

                <p className="mb-0">travelover@gmail.com</p>
              </ListGroupItem>

              <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-3">
                <h6 className="mb-0 d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faPhone} className="footer-icon-2" />
                  SĐT:
                </h6>

                <p className="mb-0">(+84) 394959699</p>
              </ListGroupItem>
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
