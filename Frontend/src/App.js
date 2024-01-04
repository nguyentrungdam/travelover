import "./App.css";
import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAccountProfile } from "./slices/accountSlice";
import Page404 from "./components/404/404";
import Home from "./pages/client/home/Home";
import Login from "./pages/client/account/Login";
import Register from "./pages/client/account/Register";
import TourDetail from "./pages/client/tour/TourDetail";
import TourBooking from "./pages/client/booking/TourBooking";
import List from "./pages/client/searchTour/List";
import AccountDetail from "./pages/client/accountDetail/AccountDetail";
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import Users from "./pages/admin/users/Users";
import LayoutAdmin from "./components/LayoutAdmin/LayoutAdmin";
import ToursList from "./pages/admin/tours/tours";
import AddTours from "./pages/admin/tours/add-tour/AddTours";
import UpdateTour from "./pages/admin/tours/update-tour/UpdateTour";
import Hotels from "./pages/admin/hotels/Hotels";
import ThankYou from "./pages/client/booking/ThankYou";
import OrderList from "./pages/admin/orders/orders";
import Info from "./pages/admin/info/Info";
import DiscountList from "./pages/admin/discounts/discounts";
import AddDiscount from "./pages/admin/discounts/add-discount/AddDiscounts";
import UpdateDiscount from "./pages/admin/discounts/update-discount/UpdateDiscounts";
import ZHotel from "./pages/enterprise/ZHotel";
import AddHotel from "./pages/admin/hotels/add-hotel/AddHotel";
import UpdateHotel from "./pages/admin/hotels/update-hotel/UpdateHotel";
import TourScheduleForm from "./pages/admin/tours/add-tour/TourScheduleForm";
import Introduce from "./pages/client/introduce/Introduce";
import TourGuide from "./pages/client/tourGuide/TourGuide";
import TourGuideDetail from "./pages/client/tourGuide/TourGuideDetail/TourGuideDetail";
import { blogDataDetail } from "./assets/data/tours";
import ResetPassword from "./pages/client/account/ResetPassword";
import AddHotelZ from "./pages/enterprise/add-hotelZ/AddHotelZ";
import UpdateHotelZ from "./pages/enterprise/update-hotelZ/UpdateHotelZ";
import OrderZList from "./pages/enterprise/orderZ/orders";
import ZVehicle from "./pages/enterprise/vehicle/ZVehicle";
import AddVehicleZ from "./pages/enterprise/vehicle/add-vehicle/AddVehicleZ";
import UpdateVehicleZ from "./pages/enterprise/vehicle/update-vehicle/UpdateVehicleZ";
import CommissionList from "./pages/admin/commission/commission";
import AddCommissions from "./pages/admin/commission/add-commission/AddCommissions";
import UpdateCommissions from "./pages/admin/commission/update-commission/UpdateCommissions";

function App() {
  const { isAuthenticated, role } = useSelector((state) => state.account);
  console.log(role);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = () => {
        dispatch(getAccountProfile(localStorage.getItem("token")));
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
      {/* user */}
      <Route path="/" element={<Navigate to="/home" />} key="home" />
      <Route path="/home" element={<Home />} key="home" />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/account" element={<AccountDetail />} />
      <Route path="/tours/search-tour" element={<List />} />
      <Route path="/tours/tour-detail/:tourId" element={<TourDetail />} />
      <Route path="/tours/tour-booking/:tourId" element={<TourBooking />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/introduce" element={<Introduce />} />
      <Route path="/tour-guide" element={<TourGuide />} />
      <Route
        path="/tour-guide/:id"
        element={<TourGuideDetail data={blogDataDetail} />}
      />
      <Route path="/*" element={<Page404 />} />

      {/* admin  */}
      <Route path="/" element={<LayoutAdmin />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="user-profile" element={<Info />} />
        <Route path="tours-list" element={<ToursList />} />
        <Route path="tours-list/:id" element={<UpdateTour />} />
        <Route path="tours-list/add-new" element={<AddTours />} />
        <Route path="tours-list/test-form" element={<TourScheduleForm />} />
        <Route path="hotels" element={<Hotels />} />
        <Route path="hotels/add-new" element={<AddHotel />} />
        <Route path="hotels/:id" element={<UpdateHotel />} />
        <Route path="orders-list" element={<OrderList />} />
        <Route path="discounts" element={<DiscountList />} />
        <Route path="discounts/:id" element={<UpdateDiscount />} />
        <Route path="discounts/add-new" element={<AddDiscount />} />
        <Route path="commissions" element={<CommissionList />} />
        <Route path="commissions/add-new" element={<AddCommissions />} />
        <Route path="commissions/:id" element={<UpdateCommissions />} />
      </Route>

      {/* enterprise  */}
      <Route path="/" element={<LayoutAdmin />}>
        <Route path="hotelz" element={<ZHotel />} />
        <Route path="hotelz/add-new" element={<AddHotelZ />} />
        <Route path="hotelz/:id" element={<UpdateHotelZ />} />
        <Route path="orderz" element={<OrderZList />} />
        <Route path="vehiclez" element={<ZVehicle />} />
        <Route path="vehiclez/add-new" element={<AddVehicleZ />} />
        <Route path="vehiclez/:id" element={<UpdateVehicleZ />} />
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
