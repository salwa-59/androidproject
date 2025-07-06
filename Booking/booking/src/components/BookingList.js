import React, { useEffect, useState } from "react";
import {
  getAllBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  getAllUsers,
} from "../api";

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bookId: null,
    startingDate: "",
    endingDate: "",
    address: "",
    phone: "",
    userId: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bRes, uRes] = await Promise.all([
        getAllBookings(),
        getAllUsers(),
      ]);
      setBookings(bRes.data);
      setUsers(uRes.data);
    } catch (err) {
      console.error(err);
      setError(" Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setFormData({
      bookId: null,
      startingDate: "",
      endingDate: "",
      address: "",
      phone: "",
      userId: "",
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditModal = (booking) => {
    setFormData({
      bookId: booking.bookId,
      startingDate: booking.startingDate,
      endingDate: booking.endingDate,
      address: booking.address,
      phone: booking.phone,
      userId: booking.user.userId,
    });
    setIsEditing(true);
    setShowModal(true);
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

    const payload = {
      startingDate: formData.startingDate,
      endingDate: formData.endingDate,
      address: formData.address,
      phone: formData.phone,
      user: { userId: formData.userId },
    };

    try {
      if (isEditing) {
        await updateBooking(formData.bookId, payload);
      } else {
        await createBooking(payload);
      }
      fetchData();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setError("⚠ Failed to save booking");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      await deleteBooking(id);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete booking");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ color: "#2c3e50", marginBottom: 20 }}>Bookings</h2>

      <button
        onClick={openAddModal}
        style={{
          backgroundColor: "#3498db",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          padding: "8px 16px",
          cursor: "pointer",
          marginBottom: 15,
        }}
      >
         Add Booking
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: 10,
            boxShadow: "0 0 5px rgba(0,0,0,0.1)",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#2980b9", color: "#fff" }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Start</th>
              <th style={thStyle}>End</th>
              <th style={thStyle}>Address</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>User</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, i) => (
              <tr
                key={b.bookId}
                style={{
                  backgroundColor: i % 2 === 0 ? "#ecf0f1" : "#fff",
                }}
              >
                <td style={tdStyle}>{b.bookId}</td>
                <td style={tdStyle}>{b.startingDate}</td>
                <td style={tdStyle}>{b.endingDate}</td>
                <td style={tdStyle}>{b.address}</td>
                <td style={tdStyle}>{b.phone}</td>
                <td style={tdStyle}>{b.user.username}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => openEditModal(b)}
                    style={editBtnStyle}
                  >
                     Edit
                  </button>{" "}
                  <button
                    onClick={() => handleDelete(b.bookId)}
                    style={delBtnStyle}
                  >
                     Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* MODAL */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 8,
              width: 400,
              boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>
              {isEditing ? " Edit Booking" : "Add Booking"}
            </h3>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <input
                type="date"
                name="startingDate"
                value={formData.startingDate}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <input
                type="date"
                name="endingDate"
                value={formData.endingDate}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <select
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
                style={inputStyle}
              >
                <option value="">Select User</option>
                {users.map((u) => (
                  <option key={u.userId} value={u.userId}>
                    {u.username}
                  </option>
                ))}
              </select>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 15,
                }}
              >
                <button type="submit" style={saveBtnStyle}>
                  {isEditing ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={cancelBtnStyle}
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

// styles
const thStyle = { padding: 8, textAlign: "left" };
const tdStyle = { padding: 8 };
const inputStyle = {
  padding: 8,
  fontSize: 16,
  borderRadius: 4,
  border: "1px solid #ccc",
};
const saveBtnStyle = {
  padding: "8px 16px",
  backgroundColor: "#27ae60",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};
const cancelBtnStyle = {
  padding: "8px 16px",
  backgroundColor: "#bdc3c7",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};
const editBtnStyle = {
  padding: "4px 8px",
  backgroundColor: "#f39c12",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};
const delBtnStyle = {
  padding: "4px 8px",
  backgroundColor: "#c0392b",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};
