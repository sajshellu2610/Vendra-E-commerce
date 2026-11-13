
import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  LogOut,
  Cpu,
  Menu,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { adminLogout } from "../../redux/slices/adminAuthSlice";
import "../styles/admin.css";

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const admin = useSelector((state) => state.adminAuth.admin);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
  ];

  const handleLogout = () => {
    dispatch(adminLogout());
    toast.success("Admin logged out successfully");
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="admin-container">
      <div className="admin-layout">

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="admin-sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}
        >
          {/* Logo */}
          <div className="admin-brand">
            <div className="admin-brand-icon">
              <Cpu size={22} />
            </div>

            <span>
              VENDRA<span className="admin-brand-dot">.</span>
            </span>

            <button
              className="admin-close-btn"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={22} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="admin-nav">
            <p className="admin-nav-label">MANAGEMENT</p>

            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    isActive ? "active" : ""
                  }
                >
                  <Icon size={19} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Admin Profile */}
          <div className="admin-sidebar-bottom">
            <div className="admin-profile">
              <div className="admin-avatar">
                {admin?.name?.charAt(0) || "A"}
              </div>

              <div className="admin-profile-info">
                <strong>{admin?.name || "Admin"}</strong>
                <span>Administrator</span>
              </div>
            </div>

            <button
              className="admin-logout"
              onClick={handleLogout}
            >
              <LogOut size={19} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="admin-main">

          {/* Header */}
          <header className="admin-header">
            <div>
              <button
                className="admin-menu-toggle"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <Menu size={23} />
              </button>
            </div>

            <div className="admin-header-title">
              <h2>Admin Panel</h2>
              <p>Manage your Vendra store</p>
            </div>

            <div className="admin-header-right">
              <div className="admin-status">
                <span className="admin-status-dot" />
                Online
              </div>

              <span className="admin-welcome">
                Welcome, {admin?.name || "Admin"}
              </span>
            </div>
          </header>

          {/* Page Content */}
          <section className="admin-content">
            <Outlet />
          </section>

        </main>
      </div>
    </div>
  );
}
