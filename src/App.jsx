
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

import UserLayout from "./layouts/UserLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

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

          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}
