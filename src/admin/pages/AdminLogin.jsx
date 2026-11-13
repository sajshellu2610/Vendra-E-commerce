import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ShieldCheck, Mail, Lock } from "lucide-react";

import api from "../../services/api";
import { adminLogin } from "../../redux/slices/adminAuthSlice";

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
      toast.error("Login failed. Please check your server.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#10110e] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1b1d18] border border-white/10 rounded-2xl p-8">

        <div className="flex justify-center mb-6">
          <div className="bg-[#d9fa62] p-4 rounded-xl">
            <ShieldCheck size={30} className="text-black" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white text-center">
          VENDRA Admin
        </h1>

        <p className="text-gray-400 text-sm text-center mt-2 mb-8">
          Sign in to manage your store
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Admin Email
            </label>

            <div className="flex items-center gap-3 bg-[#10110e] border border-white/10 rounded-lg px-4">
              <Mail size={18} className="text-gray-400" />

              <input
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent py-3 text-white outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Password
            </label>

            <div className="flex items-center gap-3 bg-[#10110e] border border-white/10 rounded-lg px-4">
              <Lock size={18} className="text-gray-400" />

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent py-3 text-white outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d9fa62] text-black font-semibold py-3 rounded-lg hover:bg-[#c9ed52] transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

        <p className="text-xs text-gray-500 text-center mt-6">
          Vendra Admin Dashboard
        </p>

      </div>
    </div>
  );
}
