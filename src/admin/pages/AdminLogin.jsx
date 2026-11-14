
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ShieldCheck, Mail, Lock, Cpu } from "lucide-react";

import api from "../../services/api";
import { adminLogin } from "../../redux/slices/adminAuthSlice";
import "../styles/admin.css";

export default function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await api.get("/admins", {
        params: {
          email: email.trim(),
          password,
        },
      });

      const admin = response.data[0];

      if (!admin || admin.role !== "admin") {
        toast.error("Invalid admin email or password");
        return;
      }

      dispatch(
        adminLogin({
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        })
      );

      toast.success("Welcome to Vendra Admin Panel!");
      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Please check your server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">

        {/* Brand */}
        <div className="admin-login-brand">
          <div className="admin-login-logo">
            <Cpu size={25} />
          </div>

          <span>
            VENDRA<span>.</span>
          </span>
        </div>

        {/* Login Icon */}
        <div className="admin-login-shield">
          <ShieldCheck size={30} />
        </div>

        {/* Heading */}
        <div className="admin-login-heading">
          <h1>Admin Login</h1>
          <p>Sign in to manage your Vendra store</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="admin-login-form">

          <div className="admin-login-field">
            <label htmlFor="admin-email">Admin Email</label>

            <div className="admin-login-input-wrapper">
              <Mail size={18} />

              <input
                id="admin-email"
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="admin-login-field">
            <label htmlFor="admin-password">Password</label>

            <div className="admin-login-input-wrapper">
              <Lock size={18} />

              <input
                id="admin-password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

        {/* Footer */}
        <div className="admin-login-footer">
          <ShieldCheck size={14} />
          <span>Vendra Admin Dashboard</span>
        </div>

      </div>
    </div>
  );
}
