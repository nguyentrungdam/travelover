import "./App.css";
import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ThankYou from "./pages/ThankYou";
import Home from "./pages/client/home/Home";
import Login from "./pages/client/account/Login";
import Register from "./pages/client/account/Register";
import SearchResultList from "././pages/SearchResultList";
import TourDetails from "././pages/TourDetails";
import Tours from "././pages/Tours";
import { useDispatch, useSelector } from "react-redux";
import { getAccountProfile } from "./slices/accountSlice";
import Page404 from "./components/404/404";
import Hotel from "./pages/client/hotel/Hotel";
import List from "./pages/client/searchHotels/List";
function App() {
  const { isAuthenticated } = useSelector((state) => state.account);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = () => {
        dispatch(getAccountProfile(localStorage.getItem("token")));
        // dispatch(getUserAddress());
        // dispatch(getOrdersByUser());
      };
      fetchData();
    }
  }, [isAuthenticated]);
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/tours" element={<Tours />} />
      {/* <Route path="/tours/:id" element={<TourDetails />} /> */}
      {/* <Route path="/tours-detail" element={<TourDetails />} /> */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* <Route path="/thank-you" element={<ThankYou />} /> */}
      <Route path="/tours/search-hotels" element={<List />} />
      <Route path="/tours/search-hotels/:id" element={<Hotel />} />
      <Route path="/*" element={<Page404 />} />
    </Routes>
  );
}

export default App;
