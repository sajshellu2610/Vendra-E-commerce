
import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function UserLayout() {
  return (
    <>
      {/* Customer Navbar */}
      <Navbar />

      {/* Customer Pages */}
      <main className="user-layout-main">
        <Outlet />
      </main>

      {/* Customer Footer */}
      <Footer />
    </>
  );
}

export default UserLayout;
