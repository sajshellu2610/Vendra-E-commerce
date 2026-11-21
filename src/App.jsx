
import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "sonner";

import {
  restoreSession,
  validateSession,
  logout,
} from "./redux/slices/authSlice";

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
import Shop from "./pages/Shop";

// Admin Layout and Authentication
import AdminLayout from "./admin/layouts/AdminLayout";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminProtectedRoute from "./admin/components/AdminProtectedRoute";

// Admin Pages
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminProducts from "./admin/pages/AdminProducts";
import AdminUsers from "./admin/pages/AdminUsers";
import AdminOrders from "./admin/pages/AdminOrders";

export default function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  // Restore user session
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  // Validate existing customer session every 10 seconds
  useEffect(() => {
    if (!user?.id || user.role === "admin") return;

    const checkUserStatus = async () => {
      try {
        const result = await dispatch(validateSession()).unwrap();

        if (result === true) {
          dispatch(logout());

          toast.error("Your account has been blocked by admin.");

          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("Session validation failed:", error);
      }
    };

    checkUserStatus();

    const interval = setInterval(checkUserStatus, 10000);

    return () => clearInterval(interval);
  }, [user?.id, user?.role, dispatch, navigate]);

  // Fetch cart and wishlist for logged-in user
  useEffect(() => {
    if (user?.id && user.role !== "admin") {
      dispatch(fetchCart(user.id));
      dispatch(fetchWishlist(user.id));
    } else {
      dispatch(resetCart());
      dispatch(resetWishlist());
    }
  }, [user?.id, user?.role, dispatch]);

  return (
    <>
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={3000}
      />

      <Routes>
        {/* CUSTOMER ROUTES */}

        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<ProductDetails />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/shop" element={<Shop />} />

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
          </Route>
        </Route>

        {/* ADMIN LOGIN */}

        <Route path="/admin/login" element={<AdminLogin />} />

        {/* PROTECTED ADMIN ROUTES */}

        <Route element={<AdminProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/products"
              element={<AdminProducts />}
            />

            <Route
              path="/admin/users"
              element={<AdminUsers />}
            />

            <Route
              path="/admin/orders"
              element={<AdminOrders />}
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
