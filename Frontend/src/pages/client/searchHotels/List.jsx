import "./list.css";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "./SearchItem";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import ScrollToTop from "../../../shared/ScrollToTop";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { formatCurrencyWithoutD } from "../../../utils/validate";
const List = () => {
  const location = useLocation();
  const [destination, setDestination] = useState(location.state.destination);
  const [date, setDate] = useState(location.state.date);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(location.state.options);
  const [isHeaderVisible, setHeaderVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    window.scrollTo(0, 0);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const [priceRange, setPriceRange] = useState([0, 100]);

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };
  return (
    <>
      {isHeaderVisible ? <Header /> : " "}
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Tìm Kiếm Khách Sạn</h1>
            <div className="lsItem">
              <label>Điểm đến</label>
              <input placeholder={destination} type="text" />
            </div>
            <div className="lsItem">
              <label>Ngày đi</label>
              <span onClick={() => setOpenDate(!openDate)}>{`${format(
                date[0].startDate,
                "dd/MM/yyyy"
              )} - ${format(date[0].endDate, "dd/MM/yyyy")}`}</span>
              {openDate && (
                <DateRange
                  onChange={(item) => setDate([item.selection])}
                  minDate={new Date()}
                  ranges={date}
                />
              )}
            </div>
            <div className="lsItem">
              <label>Tùy chọn</label>
              <div className="lsOptions">
                <div className="lsOptionItem1">
                  <span className="lsOptionText">Phạm vi giá</span>
                  <span className="lsOptionText">1 phòng, 1 đêm</span>
                  <div className="range-text">
                    <div className="range-text-value">
                      <div dir="auto" className="price-range">
                        {formatCurrencyWithoutD(priceRange[0] * 100000)} VND
                      </div>
                    </div>
                    <div className="range-text-value">
                      <div dir="auto" className="price-range">
                        {formatCurrencyWithoutD(priceRange[1] * 100000)} VND
                      </div>
                    </div>
                    <div className="line-range"></div>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    range
                    value={priceRange}
                    onChange={handlePriceChange}
                    className="range-slider"
                  />
                </div>

                <div className="lsOptionItem">
                  <span className="lsOptionText">Người lớn</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.adult}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Trẻ em</span>
                  <input
                    type="number"
                    min={0}
                    className="lsOptionInput"
                    placeholder={options.children}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Phòng</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.room}
                  />
                </div>
              </div>
            </div>
            <button>Tìm Kiếm</button>
          </div>
          <div className="listResult">
            <SearchItem />
            <SearchItem />
            <SearchItem />
            <SearchItem />
            <SearchItem />
            <SearchItem />
            <SearchItem />
            <SearchItem />
            <SearchItem />
          </div>
        </div>
      </div>
      <ScrollToTop />

      <Footer />
    </>
  );
};

export default List;
