import React from "react";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import "./Introduce.css";
const Introduce = () => {
  return (
    <div>
      <Header />
      <section className="page">
        <div className="container">
          <h1>Giới thiệu</h1>
          <div className="mb-3">
            <div className="d-flex">
              <div className="col-md-7">
                <p>
                  <strong>1. Lời ngỏ</strong>
                </p>
                <p className="fw-bold color-454545 ">
                  Lời đầu tiên, Travelover xin gửi lời chào trân trọng và kính
                  chúc Quý khách hàng và Quý đối tác luôn dồi dào sức khỏe,
                  thành công trong cuộc sống.&nbsp;Lữ hành Travelover ngày càng
                  được mở rộng: kinh doanh du lịch trong và ngoài nước, cung cấp
                  vé máy bay, đặt phòng khách sạn, dịch vụ vận chuyển, tổ chức
                  sự kiện (M.I.C.E), Free &amp; easy, Visa... Với phương châm
                  “Chất lượng tiên phong” cùng chính sách đa dạng hóa sản phẩm
                  và bảo đảm thực hiện đúng những cam kết về chất lượng, Lữ hành
                  Travelover đã định vị trong lòng công chúng là thương hiệu lữ
                  hành hàng đầu của Việt Nam nói chung và thị trường TP. HCM nói
                  riêng về chất lượng dịch vụ.
                </p>
                <p>
                  <strong>2. Tầm nhìn và sứ mệnh</strong>
                </p>
                <p className="fw-bold color-454545">
                  Luôn phấn đấu để giữ vững giữ vị trí là một trong những công
                  ty du lịch hàng đầu của Việt Nam và khu vực về qui mô, chất
                  lượng và uy tín.
                  <br />
                  Với nguồn lực dồi dào, kinh nghiệm và uy tín trong lĩnh vực
                  dịch vụ du lịch, mối quan hệ bền vững với các đối tác lớn khắp
                  nơi trên thế giới, đội ngũ nhân viên năng động và chuyên
                  nghiệp, Lữ hành Travelover luôn nỗ lực mang đến cho khách hàng
                  những sản phẩm du lịch giá trị nhất.
                </p>
                <p>
                  <strong>3. Triết lý kinh doanh</strong>
                </p>
                <p className="fw-bold color-454545">
                  Lữ hành Travelover luôn coi trọng ý thức trách nhiệm của doanh
                  nghiệp đối với cộng đồng và môi trường, phát triển các sản
                  phẩm và hoạt động kinh doanh trên tiêu chí hài hòa lợi ích
                  doanh nghiệp với cộng đồng, xã hội.
                </p>
              </div>
              <img
                class="intro-img col-md-5"
                src="//bizweb.dktcdn.net/100/489/447/themes/912592/assets/about.jpg?1700621418465"
                data-src="//bizweb.dktcdn.net/100/489/447/themes/912592/assets/about.jpg?1700621418465"
                alt="Về chúng tôi"
              ></img>
            </div>

            <p>
              <strong>4. Giá trị cốt lõi</strong>
            </p>
            <p className="fw-bold color-454545">
              - Luôn tuân thủ các quy chuẩn và cam kết chất lượng đã công bố với
              khách hàng.
              <br />
              - Xem chất lượng dịch vụ và sự tiện ích của khách hàng là tiêu chí
              hàng đầu trong các định hướng và hoạt động kinh doanh của Lữ hành
              Travelover.
              <br />- Tiên phong trong việc gợi mở những cảm hứng, mong đợi tiềm
              ẩn của khách hàng để mang đến cho khách những sản phẩm du lịch độc
              đáo, mới lạ mà khách chỉ có thể tìm thấy ở Lữ hành Travelover
            </p>
            <p>
              <strong>
                5. Hành trình phát triển cùng phương châm CHẤT LƯỢNG TIÊN PHONG
              </strong>
            </p>
            <p className="fw-bold color-454545">
              - Bảo đảm thực hiện đúng cam kết
              <br />
              - Bảo đảm cung cấp những sản phẩm đã được chọn lọc
              <br />- Bảo đảm giá cả hợp lý
              <br />- Bảo đảm phong cách phục vụ nhiệt tình và chu đáo.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Introduce;
