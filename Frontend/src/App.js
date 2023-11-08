import "./App.css";
import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ThankYou from "./pages/ThankYou";
import Home from "./pages/client/home/Home";
import Login from "./pages/client/account/Login";
import Register from "./pages/client/account/Register";
import TourDetails from "././pages/TourDetails";
import Tours from "././pages/Tours";
import { useDispatch, useSelector } from "react-redux";
import { getAccountProfile } from "./slices/accountSlice";
import Page404 from "./components/404/404";
import Hotel from "./pages/client/hotel/Hotel";
import List from "./pages/client/searchHotels/List";
///import admin routes
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import Users from "./pages/admin/users/Users";
import User from "./pages/admin/user/User";
import LayoutAdmin from "./components/LayoutAdmin/LayoutAdmin";
import Products from "./pages/admin/products/Products";
import Product from "./pages/admin/product/Product";
import AccountDetail from "./pages/client/accountDetail/AccountDetail";
import ToursList from "./pages/admin/tours/tours";
import AddTours from "./pages/admin/tours/add-tour/AddTours";
import UpdateTour from "./pages/admin/tours/update-tour/UpdateTour";

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

  //! protected route
  // const ProtectedRoute = ({ children }) => {
  //   const { user } = useAuthContext();

  //   if (!user) {
  //     return <Navigate to="/login" />;
  //   }

  //   return children;
  // };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/tours" element={<Tours />} />
      {/* <Route path="/tours/:id" element={<TourDetails />} /> */}
      <Route path="/tours-detail" element={<TourDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/account" element={<AccountDetail />} />
      {/* <Route path="/thank-you" element={<ThankYou />} /> */}
      <Route path="/tours/search-hotels" element={<List />} />
      <Route path="/tours/search-hotels/:id" element={<Hotel />} />
      <Route path="/*" element={<Page404 />} />
      {/* admin route */}
      {/* "email": "admind@gmail.com",
  "password": "123456@Aa" */}
      <Route path="/" element={<LayoutAdmin />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="users/:id" element={<User />} />
        <Route path="tours-list" element={<ToursList />} />
        <Route path="tours-list/:id" element={<UpdateTour />} />
        <Route path="tours-list/add-new" element={<AddTours />} />
        {/* <Route path="products/:id" element={<Product />} /> */}
      </Route>
      {/* <Route path="users">
        <Route
          index
          element={
            <ProtectedRoute>
              <ListAdmin columns={userColumns} />
              //{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path=":id"
          element={
            <ProtectedRoute>
              <Single />
              //{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="new"
          element={
            <ProtectedRoute>
              <NewUser inputs={userInputs} title="Add New User" />
              //{" "}
            </ProtectedRoute>
          }
        />
      </Route> */}
    </Routes>
  );
}

export default App;
