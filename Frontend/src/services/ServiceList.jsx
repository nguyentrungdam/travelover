import React from "react";
import ServiceCard from "./ServiceCard";
import { Col } from "reactstrap";

const servicesData = [
  {
    imgUrl: "https://cdn-icons-png.flaticon.com/512/3277/3277639.png",
    title: `Đặt Tour`,
    desc: `Tiện lợi và nhanh chóng.`,
  },
  {
    imgUrl:
      "https://images.squarespace-cdn.com/content/v1/58f645cae58c62dbeca6bc2c/1614923420749-8DL6X9NGAKQ34PWYSZPM/live-chat.png",
    title: `Hỗ Trợ`,
    desc: `Chatbot và nhân viên tư vấn 24/7.`,
  },
  {
    imgUrl: "https://cdn-icons-png.flaticon.com/512/4966/4966633.png",
    title: "Giá Cả",
    desc: `Giá cả ưu đãi hàng đầu thị trường.`,
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
