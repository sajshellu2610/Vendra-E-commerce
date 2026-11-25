
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

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { fetchDashboardData } from "../../redux/slices/adminDashboardSlice";
import "../../admin/styles/admin.css";

export default function AdminDashboard() {
  const dispatch = useDispatch();

  const {
    products = [],
    users = [],
    orders = [],
    loading,
    error,
  } = useSelector((state) => state.adminDashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  // Refresh dashboard
  const handleRefresh = () => {
    dispatch(fetchDashboardData())
      .unwrap()
      .then(() => toast.success("Dashboard refreshed"))
      .catch(() => toast.error("Unable to refresh dashboard"));
  };

  // Get order amount
  const getOrderAmount = (order) => {
    return Number(
      order.total ??
      order.totalPrice ??
      order.amount ??
      order.grandTotal ??
      0
    );
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Check cancelled orders
  const isCancelled = (order) => {
    const status = String(order.status || "").toLowerCase();
    return status === "cancelled" || status === "failed";
  };

  // Total revenue
  const totalRevenue = orders.reduce((total, order) => {
    if (isCancelled(order)) return total;
    return total + getOrderAmount(order);
  }, 0);

  // Monthly revenue chart
  const currentYear = new Date().getFullYear();

  const monthlyRevenue = Array.from({ length: 12 }, (_, index) => {
    const revenue = orders.reduce((total, order) => {
      const orderDate = new Date(
        order.createdAt || order.orderDate || order.date
      );

      if (
        Number.isNaN(orderDate.getTime()) ||
        orderDate.getFullYear() !== currentYear ||
        orderDate.getMonth() !== index ||
        isCancelled(order)
      ) {
        return total;
      }

      return total + getOrderAmount(order);
    }, 0);

    return {
      month: new Date(currentYear, index).toLocaleString("en-IN", {
        month: "short",
      }),
      revenue,
    };
  });

  // Order status chart
  const getStatusCount = (statuses) => {
    return orders.filter((order) =>
      statuses.includes(
        String(order.status || "pending").toLowerCase()
      )
    ).length;
  };

  const orderStatusData = [
    {
      name: "Delivered",
      value: getStatusCount(["delivered", "completed"]),
    },
    {
      name: "Pending",
      value: getStatusCount(["pending"]),
    },
    {
      name: "Processing",
      value: getStatusCount(["processing"]),
    },
    {
      name: "Cancelled",
      value: getStatusCount(["cancelled", "failed"]),
    },
  ];

  const orderStatusColors = [
    "#d9fa62",
    "#f59e0b",
    "#60a5fa",
    "#ef4444",
  ];

  // Customer name
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

  // Order date
  const getOrderDate = (order) => {
    const date =
      order.createdAt ||
      order.orderDate ||
      order.date;

    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Status badge
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

  // Latest five orders
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

  // Statistics
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
          <RefreshCw
            size={17}
            className={loading ? "spin" : ""}
          />
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

      {/* Dashboard Charts */}
      <div className="admin-charts-grid">

        {/* Revenue Chart */}
        <div className="admin-panel admin-chart-panel">
          <div className="admin-panel-header">
            <div>
              <h2>Revenue Overview</h2>
              <p>Monthly revenue - {currentYear}</p>
            </div>
          </div>

          <div className="admin-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#38383e"
                />

                <XAxis
                  dataKey="month"
                  stroke="#a1a1aa"
                />

                <YAxis
                  stroke="#a1a1aa"
                  tickFormatter={(value) =>
                    value >= 1000
                      ? `₹${value / 1000}k`
                      : `₹${value}`
                  }
                />

                <Tooltip
                  formatter={(value) => [
                    formatCurrency(value),
                    "Revenue",
                  ]}
                  contentStyle={{
                    background: "#18181b",
                    border: "1px solid #38383e",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />

                <Bar
                  dataKey="revenue"
                  name="Revenue"
                  fill="#d9fa62"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Chart */}
        <div className="admin-panel admin-chart-panel">
          <div className="admin-panel-header">
            <div>
              <h2>Order Status</h2>
              <p>Overview of all orders</p>
            </div>
          </div>

          <div className="admin-chart">
            {orders.length === 0 ? (
              <div className="admin-empty">
                <ShoppingBag size={30} />
                <p>No order data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={4}
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={orderStatusColors[index]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      background: "#18181b",
                      border: "1px solid #38383e",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

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
                    <td>#{order.id ?? "N/A"}</td>
                    <td>{getCustomerName(order)}</td>
                    <td>{getOrderDate(order)}</td>
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
