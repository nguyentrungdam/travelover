import React from "react";
import "./TourGuide.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { blogDataBig, blogDataSmall } from "../../../assets/data/tours";
const TourGuide = () => {
  return (
    <div>
      <Header />
      <div className="container mt-5">
        <h1 className="title-page">Cẩm Nang Du Lịch</h1>
        <div className="row">
          <div className="col-lg-7 blog-big">
            <div className="item-blog">
              <a
                className=" ratio3by2 d-block position-relative "
                href="/tour-guide/1"
              >
                <img
                  className="img-tour-guide position-absolute "
                  src="https://media.gody.vn//images/thua-thien-hue/cung-dinh-hue/10-2016/20161018050342-cung-dinh-hue-gody%20(3).jpg"
                  data-src="https://media.gody.vn//images/thua-thien-hue/cung-dinh-hue/10-2016/20161018050342-cung-dinh-hue-gody%20(3).jpg"
                  alt=" Du lịch Huế mùa xuân"
                />
              </a>
              <div className="block-content pt-3">
                <h2 className="bold mb-2">
                  <a
                    href="/tour-guide/1"
                    className="text2line"
                    title="Du hành ngược thời gian tại làng dân gian Naganeupseong Hàn Quốc"
                  >
                    Du lịch Huế mùa xuân: tham quan Đại Nội và trải nghiệm đón
                    Tết miền Trung
                  </a>
                </h2>
                <div className="time-post mb-2 d-inline-block">
                  <span className="mr-2">
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fal"
                      data-icon="clock"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="svg-inline--fa fa-clock fa-w-16"
                    >
                      <path
                        fill="currentColor"
                        d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm216 248c0 118.7-96.1 216-216 216-118.7 0-216-96.1-216-216 0-118.7 96.1-216 216-216 118.7 0 216 96.1 216 216zm-148.9 88.3l-81.2-59c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h14c6.6 0 12 5.4 12 12v146.3l70.5 51.3c5.4 3.9 6.5 11.4 2.6 16.8l-8.2 11.3c-3.9 5.3-11.4 6.5-16.8 2.6z"
                        className=""
                      ></path>
                    </svg>{" "}
                    20/12/2023
                  </span>
                  <span>
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="user"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      className="svg-inline--fa fa-user fa-w-14 ms-2"
                    >
                      <path
                        fill="currentColor"
                        d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"
                        className=""
                      ></path>
                    </svg>{" "}
                    Travelover
                  </span>
                </div>
                <p className="justify summary">
                  Không chỉ cuốn hút du khách bởi cảnh quan thiên nhiên hữu
                  tình, ẩm thực đặc sắc, Huế còn mang đậm dấu ấn văn hoá lịch sử
                  của dân tộc qua các công trình, kiến trúc tiêu biểu. Để nói về
                  vẻ đẹp Huế mùa xuân, nơi mà thể hiện được văn hoá lịch sử cùng
                  cảnh quan thiên nhiên Huế mùa xuân đặc sắc nhất có lẽ Đại nội
                  Huế là địa điểm nổi bật nhất.
                </p>
              </div>
            </div>{" "}
          </div>
          <div className="col-lg-5 blog-small">
            {blogDataSmall.map((item) => (
              <div className="item-blog " key={item.id}>
                <a
                  className="thumb ratio d-block position-relative rounded-8"
                  href={`/tour-guide/${item.id}`}
                >
                  <img
                    className="lazyload position-absolute loaded"
                    src={item.image}
                    data-src={item.image}
                    alt="Cắm trại ở Chư Nâm ngắm thiên đường mây ở độ cao"
                  />
                </a>
                <div className="block-content">
                  <h3 className="bold mb-2">
                    <a
                      href={`/tour-guide/${item.id}`}
                      className="text2line"
                      title="Cắm trại ở Chư Nâm ngắm thiên đường mây ở độ cao"
                    >
                      {item.title}
                    </a>
                  </h3>
                  <div className="time-post mb-2">
                    <span className="mr-2 time">
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fal"
                        data-icon="clock"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="svg-inline--fa fa-clock fa-w-16"
                      >
                        <path
                          fill="currentColor"
                          d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm216 248c0 118.7-96.1 216-216 216-118.7 0-216-96.1-216-216 0-118.7 96.1-216 216-216 118.7 0 216 96.1 216 216zm-148.9 88.3l-81.2-59c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h14c6.6 0 12 5.4 12 12v146.3l70.5 51.3c5.4 3.9 6.5 11.4 2.6 16.8l-8.2 11.3c-3.9 5.3-11.4 6.5-16.8 2.6z"
                          className=""
                        ></path>
                      </svg>
                      {item.date}
                    </span>
                    <span>
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="user"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        className="svg-inline--fa fa-user fa-w-14  "
                      >
                        <path
                          fill="currentColor"
                          d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"
                          className=""
                        ></path>
                      </svg>{" "}
                      {item.author}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="list-blog blog-small">
          {blogDataBig.map((item) => (
            <div className="item-blog item-list">
              <a
                className="thumb ratio d-block position-relative rounded-8"
                href={`/tour-guide/${item.id}`}
              >
                <img
                  className="lazyload position-absolute loaded"
                  src={item.image}
                  data-src={item.image}
                  alt={item.title}
                />
              </a>
              <div className="block-content">
                <h3 className="bold mb-2">
                  <a
                    href="/tho-nhi-ky-mot-thoang-sac-thu-quyen-ru"
                    className="text2line"
                    title="Thổ Nhĩ Kỳ - Một thoáng sắc thu quyến rũ"
                  >
                    {item.title}
                  </a>
                </h3>
                <div className="time-post mb-2">
                  <span className="mr-2 time">
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fal"
                      data-icon="clock"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="svg-inline--fa fa-clock fa-w-16"
                    >
                      <path
                        fill="currentColor"
                        d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm216 248c0 118.7-96.1 216-216 216-118.7 0-216-96.1-216-216 0-118.7 96.1-216 216-216 118.7 0 216 96.1 216 216zm-148.9 88.3l-81.2-59c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h14c6.6 0 12 5.4 12 12v146.3l70.5 51.3c5.4 3.9 6.5 11.4 2.6 16.8l-8.2 11.3c-3.9 5.3-11.4 6.5-16.8 2.6z"
                        className=""
                      ></path>
                    </svg>
                    {item.date}
                  </span>
                  <span>
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="user"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      className="svg-inline--fa fa-user fa-w-14 ms-2"
                    >
                      <path
                        fill="currentColor"
                        d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"
                        className=""
                      ></path>
                    </svg>{" "}
                    {item.author}
                  </span>
                </div>
                <p className="justify summary d-none d-lg-block">
                  {item.summary}
                </p>
              </div>
            </div>
          ))}
          {/* <div className="pagenav m-0">
            <nav>
              <ul className="pagination clearfix">
                <li className="page-item disabled">
                  <a className="page-link" href="#">
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="far"
                      data-icon="angle-left"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 192 512"
                      className="svg-inline--fa fa-angle-left fa-w-6"
                    >
                      <path
                        fill="currentColor"
                        d="M4.2 247.5L151 99.5c4.7-4.7 12.3-4.7 17 0l19.8 19.8c4.7 4.7 4.7 12.3 0 17L69.3 256l118.5 119.7c4.7 4.7 4.7 12.3 0 17L168 412.5c-4.7 4.7-12.3 4.7-17 0L4.2 264.5c-4.7-4.7-4.7-12.3 0-17z"
                        className=""
                      ></path>
                    </svg>
                  </a>
                </li>

                <li className="active page-item disabled">
                  <a className="page-link" href="#">
                    1
                  </a>
                </li>

                <li className="page-item">
                  <a className="page-link" href="/tin-tuc?page=2">
                    2
                  </a>
                </li>

                <li className="page-item hidden-xs">
                  <a className="page-link" href="/tin-tuc?page=2">
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="far"
                      data-icon="angle-right"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 192 512"
                      className="svg-inline--fa fa-angle-right fa-w-6"
                    >
                      <path
                        fill="currentColor"
                        d="M187.8 264.5L41 412.5c-4.7 4.7-12.3 4.7-17 0L4.2 392.7c-4.7-4.7-4.7-12.3 0-17L122.7 256 4.2 136.3c-4.7-4.7-4.7-12.3 0-17L24 99.5c4.7-4.7 12.3-4.7 17 0l146.8 148c4.7 4.7 4.7 12.3 0 17z"
                        className=""
                      ></path>
                    </svg>
                  </a>
                </li>
              </ul>
            </nav>{" "}
          </div> */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TourGuide;
