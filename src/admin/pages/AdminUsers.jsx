
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Search,
  Users,
  ShieldCheck,
  ShieldBan,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  fetchUsers,
  updateUserStatus,
} from "../../redux/slices/adminUsersSlice";

import "../styles/admin.css";

const PAGE_SIZE = 8;

export default function AdminUsers() {
  const dispatch = useDispatch();

  const { users, loading, error } = useSelector(
    (state) => state.adminUsers
  );

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Search users
  const filteredUsers = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return users.filter((user) => {
      const name = user.name || user.username || "";
      const email = user.email || "";

      return (
        name.toLowerCase().includes(searchValue) ||
        email.toLowerCase().includes(searchValue)
      );
    });
  }, [users, search]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Reset page when searching
  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // Block / unblock user
  const handleToggleStatus = async (user) => {
    const isBlocked = !user.isBlocked;

    const action = isBlocked ? "block" : "unblock";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this user?`
    );

    if (!confirmed) return;

    try {
      setUpdatingId(user.id);

      await dispatch(
        updateUserStatus({
          id: user.id,
          isBlocked,
        })
      ).unwrap();

      toast.success(
        isBlocked
          ? "User blocked successfully"
          : "User unblocked successfully"
      );
    } catch (error) {
      toast.error(error || "Unable to update user status");
    } finally {
      setUpdatingId(null);
    }
  };

  const totalBlocked = users.filter(
    (user) => user.isBlocked
  ).length;

  const totalActive = users.length - totalBlocked;

  return (
    <div className="admin-page">
      {/* Page heading */}
      <div className="admin-page-heading">
        <div>
          <h2>Users Management</h2>
          <p>Manage and monitor registered customers.</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="admin-product-summary">
        <div className="admin-product-summary-card">
          <div className="admin-product-summary-icon">
            <Users size={22} />
          </div>

          <div>
            <p>Total Users</p>
            <h3>{users.length}</h3>
          </div>
        </div>

        <div className="admin-product-summary-card">
          <div className="admin-product-summary-icon">
            <ShieldCheck size={22} />
          </div>

          <div>
            <p>Active Users</p>
            <h3>{totalActive}</h3>
          </div>
        </div>

        <div className="admin-product-summary-card">
          <div className="admin-product-summary-icon">
            <ShieldBan size={22} />
          </div>

          <div>
            <p>Blocked Users</p>
            <h3>{totalBlocked}</h3>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="admin-panel">
        <div className="admin-products-toolbar">
          <div>
            <h3>All Users</h3>
            <p>{filteredUsers.length} users found</p>
          </div>

          <div className="admin-products-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="admin-loading">
            Loading users...
          </div>
        ) : error ? (
          <div className="admin-error">
            {error}
            <button onClick={() => dispatch(fetchUsers())}>
              Retry
            </button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="admin-empty">
            <Users size={36} />
            <h3>No users found</h3>
            <p>Try searching with another name or email.</p>
          </div>
        ) : (
          <>
            <div className="admin-table-wrapper">
              <table className="admin-products-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedUsers.map((user, index) => (
                    <tr key={user.id}>
                      <td>
                        {(currentPage - 1) * PAGE_SIZE +
                          index +
                          1}
                      </td>

                      <td>
                        <div className="admin-user-info">
                          <div className="admin-user-avatar">
                            {(user.name || user.username || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <span>
                            {user.name ||
                              user.username ||
                              "Unknown User"}
                          </span>
                        </div>
                      </td>

                      <td>{user.email || "N/A"}</td>

                      <td>{user.phone || "N/A"}</td>

                      <td>
                        <span
                          className={`admin-user-status ${
                            user.isBlocked
                              ? "blocked"
                              : "active"
                          }`}
                        >
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>

                      <td>
                        <button
                          className={`admin-user-action-btn ${
                            user.isBlocked ? "unblock" : "block"
                          }`}
                          onClick={() =>
                            handleToggleStatus(user)
                          }
                          disabled={updatingId === user.id}
                        >
                          {updatingId === user.id
                            ? "Updating..."
                            : user.isBlocked
                              ? "Unblock"
                              : "Block"}
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
    </div>
  );
}
