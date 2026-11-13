import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminProtectedRoute() {
  const { isAuthenticated, admin } = useSelector(
    (state) => state.adminAuth
  );

  if (!isAuthenticated || !admin || admin.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
