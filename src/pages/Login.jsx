import React from "react";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slices/authSlice";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, error } = useSelector((state) => state.auth);

  if (user) return <Navigate to="/" replace />;
  const submit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(form));
    if (login.fulfilled.match(result))
      navigate(location.state?.from?.pathname || "/", { replace: true });
  };

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <span className="eyebrow">WELCOME BACK</span>
        <h1>
          Sign in<span className="brand-dot">.</span>
        </h1>
        <p>Log in to continue to your Vendra account.</p>
        <label>
          Email address
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Enter your password"
          />
        </label>
        {error && <div className="form-error">{error}</div>}
        <button className="button auth-submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <div className="auth-switch">
          New to Vendra? <Link to="/register">Create an account</Link>
        </div>
      </form>
    </section>
  );
}
