import "./App.css";
import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ThankYou from "./pages/ThankYou";
import Home from "././pages/Home";
import Login from "././pages/Login";
import Register from "././pages/Register";
import SearchResultList from "././pages/SearchResultList";
import TourDetails from "././pages/TourDetails";
import Tours from "././pages/Tours";
import { useDispatch, useSelector } from "react-redux";
import { getAccountProfile } from "./slices/accountSlice";
import Page404 from "./components/404/404";
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
      <Route path="/tours/:id" element={<TourDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/tours/search" element={<SearchResultList />} />
      <Route path="/*" element={<Page404 />} />
    </Routes>
  );
}

export default App;
