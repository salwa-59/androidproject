
import React, { useEffect, useState } from "react";
import { getAllUsers, createUser, updateUser, deleteUser } from "../api";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    userId: null,
    username: "",
    password: "",
    email: "",
    phone: "",
    role: "USER",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setFormData({
      userId: null,
      username: "",
      password: "",
      email: "",
      phone: "",
      role: "USER",
    });
    setIsEditing(false);
    setShowModal(true);
    setError("");
  };

  const openEditModal = (user) => {
    setFormData({
      userId: user.userId,
      username: user.username,
      password: "", 
      email: user.email,
      phone: user.phone || "",
      role: user.role || "USER",
    });
    setIsEditing(true);
    setShowModal(true);
    setError("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = { ...formData };

      if (!isEditing) {
        
        if (!payload.password) {
          setError("Password is required for new users.");
          return;
        }
        await createUser(payload);
      } else {
        
        if (!payload.password || payload.password.trim() === "") {
          delete payload.password;
        }
        await updateUser(formData.userId, payload);
      }

      await fetchUsers();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setError("Failed to save user. Please check the data and try again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        await fetchUsers();
      } catch (err) {
        console.error(err);
        alert("Failed to delete user.");
      }
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>User List</h2>

      <button
        onClick={openAddModal}
        style={{
          marginBottom: 15,
          padding: "8px 16px",
          backgroundColor: "#4caf50",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        + Add User
      </button>

      {loading && <p>Loading users...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && users.length === 0 && <p>No users found.</p>}

      {!loading && users.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: 10,
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#4caf50", color: "white" }}>
              <th style={{ padding: 10, textAlign: "left" }}>ID</th>
              <th style={{ padding: 10, textAlign: "left" }}>Username</th>
              <th style={{ padding: 10, textAlign: "left" }}>Email</th>
              <th style={{ padding: 10, textAlign: "left" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: 10 }}>{user.userId}</td>
                <td style={{ padding: 10 }}>{user.username}</td>
                <td style={{ padding: 10 }}>{user.email}</td>
                <td style={{ padding: 10 }}>
                  <button
                    onClick={() => openEditModal(user)}
                    style={{
                      marginRight: 6,
                      backgroundColor: "#2196f3",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.userId)}
                    style={{
                      backgroundColor: "#f44336",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 8,
              width: 400,
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ marginTop: 0, textAlign: "center" }}>
              {isEditing ? "Edit User" : "Add User"}
            </h3>

            {error && (
              <p style={{ color: "red", textAlign: "center", marginBottom: 10 }}>
                {error}
              </p>
            )}

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={isEditing}
                style={{
                  padding: 8,
                  fontSize: 16,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                }}
              />
              {!isEditing && (
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{
                    padding: 8,
                    fontSize: 16,
                    borderRadius: 4,
                    border: "1px solid #ccc",
                  }}
                />
              )}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  padding: 8,
                  fontSize: 16,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                }}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone (optional)"
                value={formData.phone}
                onChange={handleChange}
                style={{
                  padding: 8,
                  fontSize: 16,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                }}
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                style={{
                  padding: 8,
                  fontSize: 16,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                }}
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>

              <div
                style={{
                  marginTop: 15,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <button
                  type="submit"
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#4caf50",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  {isEditing ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#ccc",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
