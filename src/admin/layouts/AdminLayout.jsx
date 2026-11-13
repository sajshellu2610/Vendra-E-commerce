
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
import { useState } from "react";
import { toast } from "sonner";

import { adminLogout } from "../../redux/slices/adminAuthSlice";

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const admin = useSelector((state) => state.adminAuth.admin);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: Package,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: ShoppingBag,
    },
  ];

  const handleLogout = () => {
    dispatch(adminLogout());
    toast.success("Admin logged out successfully");
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#10110e] text-white flex">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#1b1d18] border-r border-white/10 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-[#d9fa62] p-2 rounded-lg">
              <Cpu className="text-black" size={22} />
            </div>
            <span className="text-xl font-bold tracking-tight">
              VENDRA<span className="text-[#d9fa62]">.</span>
            </span>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider px-3 mb-4">
            Management
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? "bg-[#d9fa62] text-black"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Admin Profile */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-[#d9fa62] text-black flex items-center justify-center font-bold">
              {admin?.name?.charAt(0) || "A"}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">
                {admin?.name || "Admin"}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">

        {/* Header */}
        <header className="h-20 bg-[#1b1d18] border-b border-white/10 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-300"
            >
              <Menu size={24} />
            </button>

            <div>
              <h1 className="text-lg font-semibold">Admin Panel</h1>
              <p className="text-xs text-gray-500">
                Manage your Vendra store
              </p>
            </div>
          </div>

          <div className="text-sm text-gray-400 hidden sm:block">
            Welcome, {admin?.name || "Admin"}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
