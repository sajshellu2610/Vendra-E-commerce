
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Package,
  Users,
  ShoppingBag,
  IndianRupee,
  RefreshCw,
} from "lucide-react";

import { fetchDashboardData } from "../../redux/slices/adminDashboardSlice";
import "../../admin/styles/admin.css";

export default function AdminDashboard() {
  const dispatch = useDispatch();

  const {
    products,
    users,
    orders,
    loading,
    error,
  } = useSelector((state) => state.adminDashboard);

  // Fetch dashboard data when the page loads
  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  // Refresh dashboard data
  const handleRefresh = () => {
    dispatch(fetchDashboardData())
      .unwrap()
      .then(() => toast.success("Dashboard refreshed"))
      .catch(() => toast.error("Unable to refresh dashboard"));
  };

  // Get order amount safely
  const getOrderAmount = (order) => {
    return Number(
      order.total ??
      order.totalPrice ??
      order.amount ??
      order.grandTotal ??
      0
    );
  };

  // Calculate total revenue
  const totalRevenue = orders.reduce((total, order) => {
    const status = String(order.status || "").toLowerCase();

    // Exclude cancelled orders from revenue
    if (status === "cancelled" || status === "failed") {
      return total;
    }

    return total + getOrderAmount(order);
  }, 0);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get customer name
  const getCustomerName = (order) => {
    return (
      order.customerName ||
      order.userName ||
      order.customer?.name ||
      order.user?.name ||
      order.shippingAddress?.name ||
      "Customer"
    );
  };

  // Get order date
  const getOrderDate = (order) => {
    const date =
      order.createdAt ||
      order.orderDate ||
      order.date;

    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Get status class
  const getStatusClass = (status) => {
    const value = String(status || "pending").toLowerCase();

    if (value === "delivered" || value === "completed") {
      return "success";
    }

    if (value === "cancelled" || value === "failed") {
      return "danger";
    }

    return "warning";
  };

  // Sort orders by date and get the latest five
  const recentOrders = [...orders]
    .sort((a, b) => {
      const dateA = new Date(
        a.createdAt || a.orderDate || a.date || 0
      ).getTime();

      const dateB = new Date(
        b.createdAt || b.orderDate || b.date || 0
      ).getTime();

      return dateB - dateA;
    })
    .slice(0, 5);

  const stats = [
    {
      title: "Total Products",
      value: products.length,
      icon: Package,
      color: "blue",
    },
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      color: "purple",
    },
    {
      title: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      color: "orange",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: IndianRupee,
      color: "green",
    },
  ];

  return (
    <div className="admin-page">

      {/* Page Heading */}
      <div className="admin-page-heading">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your Vendra store</p>
        </div>

        <button
          className="admin-refresh-btn"
          onClick={handleRefresh}
          disabled={loading}
        >
          <RefreshCw size={17} className={loading ? "spin" : ""} />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="admin-stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className="admin-stat-card" key={stat.title}>
              <div className={`admin-stat-icon ${stat.color}`}>
                <Icon size={23} />
              </div>

              <div className="admin-stat-info">
                <p>{stat.title}</p>
                <h2>{loading ? "..." : stat.value}</h2>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h2>Recent Orders</h2>
            <p>Latest orders from your customers</p>
          </div>
        </div>

        {loading && orders.length === 0 ? (
          <div className="admin-loading">
            Loading dashboard...
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="admin-empty">
            <ShoppingBag size={35} />
            <h3>No orders found</h3>
            <p>Customer orders will appear here.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order, index) => (
                  <tr key={order.id ?? index}>
                    <td>
                      #{order.id ?? "N/A"}
                    </td>

                    <td>
                      {getCustomerName(order)}
                    </td>

                    <td>
                      {getOrderDate(order)}
                    </td>

                    <td>
                      {formatCurrency(getOrderAmount(order))}
                    </td>

                    <td>
                      <span
                        className={`admin-badge ${getStatusClass(order.status)}`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
