import React from "react";
import ServiceCard from "./ServiceCard";
import { Col } from "reactstrap";

const servicesData = [
  {
    imgUrl: "https://cdn-icons-png.flaticon.com/512/2933/2933772.png",
    title: `Tùy Chọn Khách Sạn`,
    desc: `Khách hàng dễ dàng tùy chọn khách sạn mình muốn.`,
  },
  {
    imgUrl: "https://cdn-icons-png.flaticon.com/512/2385/2385444.png",
    title: `Tùy Chọn Nhà Hàng`,
    desc: `Khách hàng dễ dàng tùy chọn nhà hàng mình muốn.`,
  },
  {
    imgUrl: "https://cdn-icons-png.flaticon.com/512/4966/4966633.png",
    title: "Giá Cả Tốt Nhất",
    desc: `Giá cả liên tục cập nhật ưu đãi hàng đầu thị trường.`,
  },
];

const ServiceList = () => {
  return (
    <>
      {servicesData.map((item, index) => (
        <Col lg="3" md="6" sm="12" className="mb-4" key={index}>
          <ServiceCard item={item} />
        </Col>
      ))}
    </>
  );
};

export default ServiceList;
