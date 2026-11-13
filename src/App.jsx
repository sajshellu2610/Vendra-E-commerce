import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "sonner";

import { restoreSession } from "./redux/slices/authSlice";

import { fetchCart, resetCart } from "./redux/slices/cartSlice";
import {
  fetchWishlist,
  resetWishlist,
} from "./redux/slices/wishlistSlice";

// User Layout and Routes
import UserLayout from "./layouts/UserLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

// User Pages
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Admin Layout and Authentication
import AdminLayout from "./admin/layouts/AdminLayout";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminProtectedRoute from "./admin/components/AdminProtectedRoute";

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // Fetch cart and wishlist for logged-in user
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCart(user.id));
      dispatch(fetchWishlist(user.id));
    } else {
      dispatch(resetCart());
      dispatch(resetWishlist());
    }
  }, [user?.id, dispatch]);

  // Restore user session
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <>
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={3000}
      />

      <Routes>
        {/* ================= USER ROUTES ================= */}

        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
          </Route>
        </Route>

        {/* Other User Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* ================= ADMIN LOGIN ================= */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* ================= PROTECTED ADMIN ROUTES ================= */}

        <Route element={<AdminProtectedRoute />}>
          <Route element={<AdminLayout />}>

            <Route
              path="/admin/dashboard"
              element={
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Vendra Admin Dashboard
                  </h1>
                  <p className="mt-2 text-gray-500">
                    Welcome to the admin panel!
                  </p>
                </div>
              }
            />

            <Route
              path="/admin/products"
              element={
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Products Management
                  </h1>
                </div>
              }
            />

            <Route
              path="/admin/users"
              element={
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Users Management
                  </h1>
                </div>
              }
            />

            <Route
              path="/admin/orders"
              element={
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Orders Management
                  </h1>
                </div>
              }
            />

          </Route>
        </Route>

        {/* ================= NOT FOUND ================= */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
