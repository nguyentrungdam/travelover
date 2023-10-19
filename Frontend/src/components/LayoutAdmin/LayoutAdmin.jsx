import React from "react";
import "./LayoutAdmin.css";
import { Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FooterAdmin from "../FooterAdmin/Footer";
import Menu from "../menu/Menu";
import Navbar from "../navbar/Navbar";
const queryClient = new QueryClient();
const LayoutAdmin = () => {
  return (
    <div>
      <div className="main">
        <Navbar />
        <div className="container1">
          <div className="menuContainer">
            <Menu />
          </div>
          <div className="contentContainer">
            <QueryClientProvider client={queryClient}>
              <Outlet />
            </QueryClientProvider>
          </div>
        </div>
        <FooterAdmin />
      </div>
    </div>
  );
};

export default LayoutAdmin;
