import React from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import "../../../styles/thank-you.css";

const ThankYou = () => {
  let params = new URLSearchParams(window.location.search);
  let abc = params.get("paymentStatus");
  console.log(abc);
  return (
    <section>
      <Container>
        <Row>
          <Col lg="12" className="pt-5 text-center">
            <div className="thank__you">
              <span>
                <i className="ri-checkbox-circle-line"></i>
              </span>
              <h1 className="mb-3 fw-semibold">Cảm ơn</h1>
              <h3 className="mb-4">Bạn đã đặt tour thành công!</h3>

              <Button className="btn primary__btn w-25">
                <Link to="/">Về trang chủ</Link>
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ThankYou;
