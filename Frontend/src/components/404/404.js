import React from "react";
import "./404.css";

const Page404 = () => {
  return (
    <div>
      <section className="page_404">
        <div className="col-sm-12 ">
          <h1 className="text-center fz-55">404</h1>
          <div className=" col-sm-offset-1  text-center">
            <div className="four_zero_four_bg"></div>
            <div className="contant_box_404">
              <h3 className="h2">Có vẻ như bạn đang bị lạc</h3>
              <p>trang bạn đang tìm kiếm không có sẵn!</p>
              <a href="/" className="link_404">
                Về trang chủ
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page404;
