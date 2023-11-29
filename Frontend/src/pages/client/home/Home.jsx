import React, { useEffect } from "react";
import "./home.css";
import { Container, Row, Col } from "reactstrap";
import heroImg from "../../../assets/images/hero-img01.jpg";
import heroImg02 from "../../../assets/images/hero-img02.jpg";
import heroVideo from "../../../assets/images/hero-video.mp4";
import worldImg from "../../../assets/images/world.png";
import experienceImg from "../../../assets/images/experience.png";
import Subtitle from "../../../shared/subtitle";
import SearchBar from "../../../shared/SearchBar";
import ServiceList from "../../../services/ServiceList";
import FeaturedTourList from "../../../components/Featured-tours/FeaturedTourList";
import MasonryImagesGallery from "../../../components/Image-gallery/MasonryImagesGallery";
import Testimonials from "../../../components/Testimonial/Testimonials";
import NewsLetter from "../../../shared/Newsletter";
import ScrollToTop from "../../../shared/ScrollToTop";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { saveToLocalStorage } from "../../../utils/validate";
import { useSelector } from "react-redux";

const Home = () => {
  const { account } = useSelector((state) => state.account);

  useEffect(() => {
    saveToLocalStorage(
      "fullName",
      account?.data?.firstName.concat(" ", account?.data?.lastName)
    );
    saveToLocalStorage("email", account?.data?.email);
    saveToLocalStorage("phoneNumber", account?.data?.phoneNumber);
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Header />
      {/* ========== HERO SECTION ========== */}
      <section className="padding-top-0">
        <Container>
          <Row>
            <Col lg="6">
              <div className="hero__content">
                <div className="hero__subtitle subtitle d-flex align-items-center ">
                  <Subtitle subtitle={"Biết Trước Khi Bạn Đến"} />
                  <img src={worldImg} alt="" />
                </div>
                <h1>Du lịch mở ra cơ hội sáng tạo</h1>
                <p>
                  Du lịch là hoạt động của con người đi ra khỏi nơi sống và làm
                  việc thường xuyên của mình, đến những nơi khác với mục đích
                  nhất định như: tham quan, tìm hiểu, nghỉ ngơi, chữa bệnh, vui
                  chơi giải trí, tôn giáo – tâm linh mà không nhằm mục đích kiếm
                  tiền. Thông qua đó chúng ta sẽ có một cách nhìn mới về mọi
                  thứ...
                </p>
              </div>
            </Col>

            <Col lg="2">
              <div className="hero__img-box">
                <img src={heroImg} alt="" />
              </div>
            </Col>
            <Col lg="2">
              <div className="hero__img-box hero__video-box mt-4">
                <video src={heroVideo} alt="" autoPlay muted loop />
              </div>
            </Col>
            <Col lg="2">
              <div className="hero__img-box mt-5">
                <img src={heroImg02} alt="" />
              </div>
            </Col>

            <SearchBar isTours={false} />
          </Row>
        </Container>
      </section>
      {/* ============================================================== */}
      {/* ==================== HERO SECTION START ====================== */}
      <section className="section-nonepadding">
        <Container>
          <Row>
            <Col lg="3">
              <h5 className="services__subtitle">Chúng tôi cung cấp gì ?</h5>
              <h2 className="services__title">
                Chúng tôi cung cấp các dịch vụ tốt nhất
              </h2>
            </Col>
            <ServiceList />
          </Row>
        </Container>
      </section>

      {/* ========== FEATURED TOUR SECTION START ========== */}
      <section>
        <Container>
          <Row>
            <Col lg="12" className="mb-5">
              <Subtitle subtitle={"Tour"} />
              <h2 className="featured__tour-title">Các tour của chúng tôi</h2>
            </Col>
            <FeaturedTourList />
          </Row>
        </Container>
      </section>
      {/* ========== FEATURED TOUR SECTION END =========== */}

      {/* ========== EXPERIENCE SECTION START ============ */}
      <section>
        <Container>
          <Row>
            <Col lg="6">
              <div className="experience__content">
                <Subtitle subtitle={"Trải nghiệm"} />
                <h2>
                  Với tất cả kinh nghiệm của chúng tôi <br /> chúng tôi sẽ phục
                  vụ bạn
                </h2>
                <p>
                  Với nhiều năm kinh nghiệm trong lĩnh vực du lịch
                  <br /> Chúng tôi đảm bảo cung cấp cho bạn những trải nghiệm
                  tốt nhất.{" "}
                </p>
              </div>

              <div className="counter__wrapper d-flex align-items-center gap-5">
                <div className="counter__box">
                  <span>12k+</span>
                  <h6>Chuyến đi</h6>
                </div>
                <div className="counter__box">
                  <span>2k+</span>
                  <h6>Khách hàng</h6>
                </div>
                <div className="counter__box">
                  <span>15</span>
                  <h6>Năm kinh nghiệm</h6>
                </div>
              </div>
            </Col>
            <Col lg="6">
              <div className="experience__img">
                <img src={experienceImg} alt="" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* ========== EXPERIENCE SECTION END ============== */}

      {/* ========== GALLERY SECTION START ============== */}
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <Subtitle subtitle={"Album"} />
              <div id="album">
                <h2 className="gallery__title">
                  Lấy cảm hứng cho chuyến đi tiếp theo của bạn
                </h2>
              </div>
            </Col>
            <Col lg="12">
              <MasonryImagesGallery />
            </Col>
          </Row>
        </Container>
      </section>
      {/* ========== GALLERY SECTION END ================ */}

      {/* ========== TESTIMONIAL SECTION START ================ */}
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <Subtitle subtitle={"Fans Love"} />
              <h2 className="testimonial__title">What our fans say about us</h2>
            </Col>
            <Col lg="12">
              <Testimonials />
            </Col>
          </Row>
        </Container>
      </section>
      {/* ========== TESTIMONIAL SECTION END ================== */}
      <NewsLetter />
      <ScrollToTop />
      <Footer />
    </>
  );
};

export default Home;
