import React, { useRef } from "react";
import "./search-bar.css";
import { Col, Form, FormGroup } from "reactstrap";
import { BASE_URL } from "../utils/config";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faCar,
  faMagnifyingGlass,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

const SearchBar = () => {
  const locationRef = useRef("");
  const distanceRef = useRef(0);
  const maxGroupSizeRef = useRef(0);
  const navigate = useNavigate();

  const searchHandler = async () => {
    const location = locationRef.current.value;
    const distance = distanceRef.current.value;
    const maxGroupSize = maxGroupSizeRef.current.value;

    if (location === "" || distance === "" || maxGroupSize === "") {
      return alert("All fields are required!");
    }

    const res = await fetch(
      `${BASE_URL}/tours/search/getTourBySearch?city=${location}&distance=${distance}&maxGroupSize=${maxGroupSize}`
    );

    if (!res.ok) alert("Something went wrong");

    const result = await res.json();

    navigate(
      `/tours/search?city=${location}&distance=${distance}&maxGroupSize=${maxGroupSize}`,
      { state: result.data }
    );
  };

  return (
    <Col lg="12">
      <div className="search__bar">
        <Form className="d-flex align-items-center gap-4">
          <FormGroup className="d-flex align-items-center gap-3 form__group form__group-fast">
            <FontAwesomeIcon className="icon-search" icon={faLocationDot} />
            <div>
              <h6>Địa điểm</h6>
              <input
                className="input-search"
                type="text"
                placeholder="Nơi bạn muốn đi?"
                ref={locationRef}
              />
            </div>
          </FormGroup>
          <FormGroup className="d-flex align-items-center gap-3 form__group form__group-fast">
            <FontAwesomeIcon className="icon-search" icon={faCar} />
            <div>
              <h6>Khoảng cách</h6>
              <input
                className="input-search"
                type="number"
                placeholder="Khoảng cách k/m"
                ref={distanceRef}
              />
            </div>
          </FormGroup>
          <FormGroup className="d-flex align-items-center gap-3 form__group form__group-last">
            <FontAwesomeIcon className="icon-search" icon={faUsers} />
            <div>
              <h6>Số người</h6>
              <input
                className="input-search"
                type="number"
                placeholder="0"
                ref={maxGroupSizeRef}
              />
            </div>
          </FormGroup>

          <div className="search__icon" type="submit" onClick={searchHandler}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </div>
        </Form>
      </div>
    </Col>
  );
};

export default SearchBar;
