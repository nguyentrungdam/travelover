import React, { useEffect, useRef, useState } from "react";
import "./search-bar.css";
import { Col } from "reactstrap";
import { BASE_URL } from "../utils/config";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faMagnifyingGlass,
  faCalendarDays,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";

import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const SearchBar = () => {
  // const locationRef = useRef("");
  // const distanceRef = useRef(0);
  // const maxGroupSizeRef = useRef(0);
  // const navigate = useNavigate();

  // const searchHandler = async () => {
  //   const location = locationRef.current.value;
  //   const distance = distanceRef.current.value;
  //   const maxGroupSize = maxGroupSizeRef.current.value;

  //   if (location === "" || distance === "" || maxGroupSize === "") {
  //     return alert("All fields are required!");
  //   }

  //   const res = await fetch(
  //     `${BASE_URL}/tours/search/getTourBySearch?city=${location}&distance=${distance}&maxGroupSize=${maxGroupSize}`
  //   );

  //   if (!res.ok) alert("Something went wrong");

  //   const result = await res.json();

  //   navigate(
  //     `/tours/search?city=${location}&distance=${distance}&maxGroupSize=${maxGroupSize}`,
  //     { state: result.data }
  //   );
  // };
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1,
  });
  const handleOption = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
      };
    });
  };
  const handleSearch = () => {
    navigate("/tours/search-hotels", { state: { destination, date, options } });
  };

  return (
    <Col lg="12">
      <div className="search__bar">
        <div className="headerSearch ">
          <div className="headerSearchItem form__group-fast">
            <FontAwesomeIcon className="icon-search" icon={faLocationDot} />
            <div className="headerSearch-location">
              <h5>Địa điểm</h5>
              <input
                className="headerSearchInput"
                type="text"
                placeholder="Nơi bạn muốn đi?"
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
          </div>
          <div className="headerSearchItem form__group-fast">
            <FontAwesomeIcon icon={faCalendarDays} className="icon-search" />
            <div className="headerSearch-location">
              <h5>Ngày đi</h5>
              <span
                onClick={() => setOpenDate(!openDate)}
                className="headerSearchText"
              >{`${format(date[0].startDate, "dd/MM/yyyy")} - ${format(
                date[0].endDate,
                "dd/MM/yyyy"
              )}`}</span>
              {openDate && (
                <DateRange
                  editableDateInputs={true}
                  onChange={(item) => setDate([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={date}
                  className="date"
                  minDate={new Date()}
                  locale={vi}
                  dateDisplayFormat="dd, MMM, yyyy"
                />
              )}
            </div>
          </div>
          <div className="headerSearchItem  ">
            <FontAwesomeIcon icon={faPerson} className="icon-search" />
            <div className="headerSearch-location">
              <h5>Số người</h5>

              <span
                onClick={() => setOpenOptions(!openOptions)}
                className="headerSearchText"
              >{`${options.adult} người lớn · ${options.children} trẻ em · ${options.room} phòng`}</span>
              {openOptions && (
                <div className="options">
                  <div className="optionItem">
                    <span className="optionText">Người lớn</span>
                    <div className="optionCounter">
                      <button
                        disabled={options.adult <= 1}
                        className="optionCounterButton"
                        onClick={() => handleOption("adult", "d")}
                      >
                        -
                      </button>
                      <span className="optionCounterNumber">
                        {options.adult}
                      </span>
                      <button
                        className="optionCounterButton"
                        onClick={() => handleOption("adult", "i")}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="optionItem">
                    <span className="optionText">Trẻ em</span>
                    <div className="optionCounter">
                      <button
                        disabled={options.children <= 0}
                        className="optionCounterButton"
                        onClick={() => handleOption("children", "d")}
                      >
                        -
                      </button>
                      <span className="optionCounterNumber">
                        {options.children}
                      </span>
                      <button
                        className="optionCounterButton"
                        onClick={() => handleOption("children", "i")}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="optionItem">
                    <span className="optionText">Phòng</span>
                    <div className="optionCounter">
                      <button
                        disabled={options.room <= 1}
                        className="optionCounterButton"
                        onClick={() => handleOption("room", "d")}
                      >
                        -
                      </button>
                      <span className="optionCounterNumber">
                        {options.room}
                      </span>
                      <button
                        className="optionCounterButton"
                        onClick={() => handleOption("room", "i")}
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
