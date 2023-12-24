import React, { useEffect, useState } from "react";
import "./AccountDetail.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import ProfilePage from "./ProfilePage";
import Bill from "./Bill";
import Security from "./Security";
import { useLocation } from "react-router-dom";
const AccountDetail = () => {
  const [activeTab, setActiveTab] = useState("profilePage");
  const location = useLocation();
  // console.log(location.state.activeTab);
  useEffect(() => {
    if (location?.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div>
      <Header />
      <div className="container-xl mt-4 container-custom ">
        <nav className="nav nav-borders">
          <span
            className={`nav-link ${
              activeTab === "profilePage" ? "active" : ""
            }`}
            onClick={() => handleTabClick("profilePage")}
          >
            Hồ sơ
          </span>
          <span
            className={`nav-link ${
              activeTab === "billingPage" ? "active" : ""
            }`}
            onClick={() => handleTabClick("billingPage")}
          >
            Thanh toán
          </span>
          <span
            className={`nav-link ${
              activeTab === "securityPage" ? "active" : ""
            }`}
            onClick={() => handleTabClick("securityPage")}
          >
            Bảo mật
          </span>{" "}
          {/* 
          <span
            className={`nav-link ${
              activeTab === "notificationsPage" ? "active" : ""
            }`}
            onClick={() => handleTabClick("notificationsPage")}
          >
            Thông báo
          </span> */}
        </nav>
        <hr className="mt-0 mb-4" />
        {activeTab === "profilePage" && (
          <div id="profilePage">
            <ProfilePage />
          </div>
        )}
        {activeTab === "billingPage" && (
          <div id="billingPage">
            <Bill />
          </div>
        )}
        {activeTab === "securityPage" && (
          <div id="securityPage">
            <Security />
          </div>
        )}
        {activeTab === "notificationsPage" && (
          <div id="notificationsPage">Notifications Content</div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AccountDetail;
