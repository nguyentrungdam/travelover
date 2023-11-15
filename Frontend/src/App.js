import "./App.css";
import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ThankYou from "./pages/ThankYou";
import Home from "./pages/client/home/Home";
import Login from "./pages/client/account/Login";
import Register from "./pages/client/account/Register";
import { useDispatch, useSelector } from "react-redux";
import { getAccountProfile } from "./slices/accountSlice";
import Page404 from "./components/404/404";
import List from "./pages/client/searchHotels/List";
import TourDetail from "./pages/client/tour/TourDetail";

///import admin routes
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import Users from "./pages/admin/users/Users";
import User from "./pages/admin/user/User";
import LayoutAdmin from "./components/LayoutAdmin/LayoutAdmin";
import AccountDetail from "./pages/client/accountDetail/AccountDetail";
import ToursList from "./pages/admin/tours/tours";
import AddTours from "./pages/admin/tours/add-tour/AddTours";
import UpdateTour from "./pages/admin/tours/update-tour/UpdateTour";
import Hotels from "./pages/admin/hotels/Hotels";
import Tours from "./pages/Tours";
import TourBooking from "./pages/client/booking/TourBooking";

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
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/account" element={<AccountDetail />} />
      {/* <Route path="/thank-you" element={<ThankYou />} /> */}
      <Route path="/tours/search-tour" element={<List />} />
      <Route path="/tours/tour-detail/:tourId" element={<TourDetail />} />
      <Route path="/tours/tour-booking" element={<TourBooking />} />

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
        <Route path="hotels" element={<Hotels />} />
        {/* <Route path="hotels/:id" element={<UpdateTour />} />
        <Route path="hotels/add-new" element={<AddTours />} /> */}
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
