
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Search,
  ShoppingBag,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import {
  fetchAdminOrders,
  updateOrderStatus,
} from "../../redux/slices/adminOrdersSlice";

import "../styles/admin.css";

const PAGE_SIZE = 8;

const ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const formatCurrency = (amount) => {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
};

const getOrderTotal = (order) => {
  return (
    order.total ??
    order.totalPrice ??
    order.amount ??
    order.grandTotal ??
    0
  );
};

const getCustomerName = (order) => {
  return (
    order.customerName ||
    order.userName ||
    order.customer?.name ||
    order.user?.name ||
    order.shippingAddress?.name ||
    "Unknown Customer"
  );
};

const getOrderDate = (order) => {
  const date = order.createdAt || order.orderDate || order.date;

  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "N/A";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const normalizeStatus = (status) => {
  const value = String(status || "Pending").toLowerCase();

  return (
    ORDER_STATUSES.find(
      (item) => item.toLowerCase() === value
    ) || "Pending"
  );
};

export default function AdminOrders() {
  const dispatch = useDispatch();

  const { orders, loading, error } = useSelector(
    (state) => state.adminOrders
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  // Search and filter orders
  const filteredOrders = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return orders.filter((order) => {
      const orderId = String(order.id || "").toLowerCase();
      const customerName = getCustomerName(order).toLowerCase();
      const email = String(
        order.email || order.customer?.email || order.user?.email || ""
      ).toLowerCase();

      const matchesSearch =
        orderId.includes(searchValue) ||
        customerName.includes(searchValue) ||
        email.includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        normalizeStatus(order.status) === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(
    filteredOrders.length / PAGE_SIZE
  );

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // Update order status
  const handleUpdateStatus = async (order, status) => {
    if (normalizeStatus(order.status) === status) return;

    try {
      setUpdatingId(order.id);

      const updatedOrder = await dispatch(
        updateOrderStatus({
          id: order.id,
          status,
        })
      ).unwrap();

      setSelectedOrder(updatedOrder);

      toast.success("Order status updated successfully");
    } catch (error) {
      toast.error(error || "Unable to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusClass = (status) => {
    switch (normalizeStatus(status)) {
      case "Delivered":
        return "delivered";
      case "Cancelled":
        return "cancelled";
      case "Shipped":
        return "shipped";
      case "Processing":
        return "processing";
      default:
        return "pending";
    }
  };

  const getOrderItems = (order) => {
    if (Array.isArray(order.items)) return order.items;
    if (Array.isArray(order.products)) return order.products;
    return [];
  };

  const getItemName = (item) => {
    return item.title || item.name || item.productName || "Product";
  };

  return (
    <div className="admin-page">
      {/* Page heading */}
      <div className="admin-page-heading">
        <div>
          <h2>Orders Management</h2>
          <p>View and manage customer orders.</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="admin-product-summary">
        <div className="admin-product-summary-card">
          <div className="admin-product-summary-icon">
            <ShoppingBag size={22} />
          </div>
          <div>
            <p>Total Orders</p>
            <h3>{orders.length}</h3>
          </div>
        </div>

        <div className="admin-product-summary-card">
          <div className="admin-product-summary-icon">
            <ShoppingBag size={22} />
          </div>
          <div>
            <p>Pending Orders</p>
            <h3>
              {
                orders.filter(
                  (order) =>
                    normalizeStatus(order.status) === "Pending"
                ).length
              }
            </h3>
          </div>
        </div>

        <div className="admin-product-summary-card">
          <div className="admin-product-summary-icon">
            <ShoppingBag size={22} />
          </div>
          <div>
            <p>Delivered Orders</p>
            <h3>
              {
                orders.filter(
                  (order) =>
                    normalizeStatus(order.status) === "Delivered"
                ).length
              }
            </h3>
          </div>
        </div>
      </div>

      {/* Orders panel */}
      <div className="admin-panel">
        <div className="admin-orders-toolbar">
          <div>
            <h3>All Orders</h3>
            <p>{filteredOrders.length} orders found</p>
          </div>

          <div className="admin-orders-filters">
            <div className="admin-products-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search order or customer..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            <select
              className="admin-orders-status-filter"
              value={statusFilter}
              onChange={(e) =>
                handleStatusFilter(e.target.value)
              }
            >
              <option value="All">All Status</option>
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="admin-loading">Loading orders...</div>
        ) : error ? (
          <div className="admin-error">
            {error}
            <button onClick={() => dispatch(fetchAdminOrders())}>
              Retry
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="admin-empty">
            <ShoppingBag size={36} />
            <h3>No orders found</h3>
            <p>Try changing your search or status filter.</p>
          </div>
        ) : (
          <>
            <div className="admin-table-wrapper">
              <table className="admin-products-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="admin-order-id">
                        #{order.id}
                      </td>

                      <td>{getCustomerName(order)}</td>

                      <td>{getOrderDate(order)}</td>

                      <td className="admin-product-price">
                        {formatCurrency(getOrderTotal(order))}
                      </td>

                      <td>
                        <span
                          className={`admin-order-status ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {normalizeStatus(order.status)}
                        </span>
                      </td>

                      <td>
                        <button
                          className="admin-order-view-btn"
                          onClick={() => setSelectedOrder(order)}
                          title="View order details"
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="admin-products-pagination">
                <p>
                  Page {currentPage} of {totalPages}
                </p>

                <div className="admin-products-page-buttons">
                  <button
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((page) => page - 1)
                    }
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((page) => page + 1)
                    }
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Order details modal */}
      {selectedOrder && (
        <div
          className="admin-order-modal-overlay"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="admin-order-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-order-modal-header">
              <div>
                <h3>Order Details</h3>
                <p>Order #{selectedOrder.id}</p>
              </div>

              <button
                className="admin-order-modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-order-modal-body">
              <div className="admin-order-detail-row">
                <span>Customer</span>
                <strong>{getCustomerName(selectedOrder)}</strong>
              </div>

              <div className="admin-order-detail-row">
                <span>Email</span>
                <strong>
                  {selectedOrder.email ||
                    selectedOrder.customer?.email ||
                    selectedOrder.user?.email ||
                    "N/A"}
                </strong>
              </div>

              <div className="admin-order-detail-row">
                <span>Order Date</span>
                <strong>{getOrderDate(selectedOrder)}</strong>
              </div>

              <div className="admin-order-detail-row">
                <span>Total Amount</span>
                <strong>
                  {formatCurrency(getOrderTotal(selectedOrder))}
                </strong>
              </div>

              <div className="admin-order-detail-section">
                <h4>Ordered Products</h4>

                {getOrderItems(selectedOrder).length > 0 ? (
                  getOrderItems(selectedOrder).map(
                    (item, index) => (
                      <div
                        className="admin-order-item"
                        key={item.id || index}
                      >
                        <div>
                          <strong>{getItemName(item)}</strong>
                          <p>
                            Quantity: {item.quantity || item.qty || 1}
                          </p>
                        </div>

                        <strong>
                          {formatCurrency(
                            item.price || item.total || 0
                          )}
                        </strong>
                      </div>
                    )
                  )
                ) : (
                  <p className="admin-order-no-items">
                    Product details are not available.
                  </p>
                )}
              </div>

              <div className="admin-order-detail-section">
                <h4>Update Order Status</h4>

                <select
                  className="admin-order-status-select"
                  value={normalizeStatus(selectedOrder.status)}
                  disabled={updatingId === selectedOrder.id}
                  onChange={(e) =>
                    handleUpdateStatus(
                      selectedOrder,
                      e.target.value
                    )
                  }
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                {updatingId === selectedOrder.id && (
                  <p className="admin-order-updating">
                    Updating order...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
