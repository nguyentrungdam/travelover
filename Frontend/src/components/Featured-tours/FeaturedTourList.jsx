import React from "react";
import TourCard from "../../shared/TourCard";
import tourData from "../../assets/data/tours";
import { Col } from "reactstrap";
import useFetch from "./../../hooks/useFetch";
import { BASE_URL } from "./../../utils/config";
import Loading from "../Loading/Loading";

const FeaturedTourList = () => {
  const {
    data: featuredTours,
    loading,
    error,
  } = useFetch(`${BASE_URL}/tours/search/getFeaturedTour`);
  // console.log(featuredTours)
  const loading1 = false;
  return (
    <>
      {loading1 && <Loading />}
      {!loading1 &&
        tourData?.map((tour) => (
          <Col lg="3" md="4" sm="6" className="mb-4" key={tour.id}>
            <TourCard tour={tour} />
          </Col>
        ))}
      {/* {loading && <h4>Loading.....</h4>}
      {error && <h4>{error}</h4>}
      {!loading &&
        !error &&
        featuredTours?.map((tour) => (
          <Col lg="3" md="4" sm="6" className="mb-4" key={tour._id}>
            <TourCard tour={tour} />
          </Col>
        ))} */}
    </>
  );
};

export default FeaturedTourList;
