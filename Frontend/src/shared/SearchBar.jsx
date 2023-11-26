import React, { useEffect, useRef, useState } from "react";
import "./search-bar.css";
import { Col } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faLocationDot,
  faMagnifyingGlass,
  faCalendarDays,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, format } from "date-fns";
import { vi } from "date-fns/locale";
import LocationSelect from "../pages/admin/tours/add-tour/LocationSelect";

const SearchBar = ({ isTours, parentState, updateParentState, onSearch }) => {
  const navigate = useNavigate();
  const tomorrow = addDays(new Date(), 1);
  const [selectedDate, setSelectedDate] = useState(tomorrow);
  const [startDate, setStartDate] = useState(format(tomorrow, "yyyy-MM-dd"));
  const [numberOfDay, setNumberOfDay] = useState("1-3");
  const [openOptions, setOpenOptions] = useState(false);
  const optionsRef = useRef(null);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState("");
  const handleSearch = () => {
    const newState = {
      selectedLocation,
      startDate,
      numberOfDay,
      numberOfPeople,
      selectedDate,
    };
    if (isTours) {
      updateParentState(newState);
      onSearch(newState);
    } else {
      navigate("/tours/search-tour", { state: newState });
    }
  };
  const handleDateChange = (date) => {
    const formattedDisplayDate = format(date, "yyyy-MM-dd");
    setSelectedDate(date);
    setStartDate(formattedDisplayDate);
  };

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
  };
  const handleOption = (operation) => {
    if (operation === "decrease" && numberOfPeople > 1) {
      setNumberOfPeople(numberOfPeople - 1);
    } else if (operation === "increase") {
      setNumberOfPeople(numberOfPeople + 1);
    }
  };
  const handleClickOutside = (event) => {
    if (optionsRef.current && !optionsRef.current.contains(event.target)) {
      setOpenOptions(false);
    }
  };
  const handlePeopleClick = (e) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click từ lan truyền lên
    setOpenOptions(!openOptions);
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <Col lg="12">
      <div className="search__bar">
        <div className="headerSearch ">
          <div className="headerSearchItem form__group-fast">
            <FontAwesomeIcon className="icon-search" icon={faLocationDot} />
            <div className="headerSearch-location">
              <h5>Địa điểm</h5>
              <LocationSelect
                onSelectLocation={handleSelectLocation}
                pickProvince
              />
            </div>
          </div>
          <div className="headerSearchItem form__group-fast">
            <FontAwesomeIcon icon={faCalendarDay} className="icon-search" />
            <div className="headerSearch-date">
              <h5>Ngày đi </h5>
              <DatePicker
                id="datepicker"
                className="datepicker "
                selected={selectedDate}
                onChange={handleDateChange}
                locale={vi} // Thiết lập ngôn ngữ Tiếng Việt
                dateFormat="dd-MM-yyyy" // Định dạng ngày tháng
                minDate={tomorrow} // Chỉ cho phép chọn ngày từ ngày mai trở đi
              />
            </div>
          </div>
          <div className="headerSearchItem form__group-fast">
            <FontAwesomeIcon icon={faCalendarDays} className="icon-search" />
            <div className="headerSearch-date">
              <h5>Số ngày </h5>
              <select
                value={numberOfDay}
                className="select-search "
                onChange={(event) => {
                  setNumberOfDay(event.target.value);
                }}
              >
                <option value="1-3">1-3 ngày</option>
                <option value="4-7">4-7 ngày</option>
                <option value="8-14">8-14 ngày</option>
                <option value="15-30">15 ngày trở lên</option>
              </select>
            </div>
          </div>
          <div className="headerSearchItem headerSearchItem1 ">
            <FontAwesomeIcon icon={faPerson} className="icon-search" />
            <div className="headerSearch-location">
              <h5>Số người</h5>
              <span onClick={handlePeopleClick} className="headerSearchText ">
                {numberOfPeople} người
              </span>
              {openOptions && (
                <div className="options" ref={optionsRef}>
                  <div className="optionItem">
                    <span className="optionText">Số người </span>
                    <div className="optionCounter">
                      <button
                        disabled={numberOfPeople <= 1}
                        className="optionCounterButton"
                        onClick={() => handleOption("decrease")}
                      >
                        -
                      </button>
                      <span className="optionCounterNumber">
                        {numberOfPeople}
                      </span>
                      <button
                        className="optionCounterButton"
                        onClick={() => handleOption("increase")}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="search__icon" type="submit" onClick={handleSearch}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </div>
        </div>
      </div>
    </Col>
  );
};

export default SearchBar;
