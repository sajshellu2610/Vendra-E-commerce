
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { Pencil, User, Mail } from "lucide-react";

import { updateProfile } from "../redux/slices/authSlice";

export default function Profile() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  const [name, setName] = useState(user?.name || "");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setName(user?.name || "");
  }, [user?.name]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleSave = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      await dispatch(
        updateProfile({
          id: user.id,
          userData: {
            name: name.trim(),
          },
        })
      ).unwrap();

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error(error || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setName(user.name || "");
    setIsEditing(false);
  };

  return (
    <main className="profile-page">
      <div className="profile-card">
        <div className="profile-heading">
          <div className="profile-avatar">
            <User size={35} />
          </div>

          <h1>My Profile</h1>
          <p>Manage your personal information</p>
        </div>

        <form onSubmit={handleSave}>
          <div className="profile-field">
            <label>Name</label>

            <div className="profile-input-wrap">
              <User size={18} />

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                placeholder="Enter your name"
              />
            </div>
          </div>

          <div className="profile-field">
            <label>Email Address</label>

            <div className="profile-input-wrap">
              <Mail size={18} />

              <input
                type="email"
                value={user.email || ""}
                disabled
              />
            </div>
          </div>

          {isEditing ? (
            <div className="profile-actions">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>

              <button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="profile-edit-btn"
              onClick={() => setIsEditing(true)}
            >
              <Pencil size={16} />
              Edit Profile
            </button>
          )}
        </form>
      </div>
    </main>
  );
}
