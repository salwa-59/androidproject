import React, { useEffect, useState } from "react";
import { getAllBookings, createBooking, updateBooking, deleteBooking } from "../api";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    bookId: null,
    startingDate: "",
    endingDate: "",
    address: "",
    phone: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (!u) {
      navigate("/login");
      return;
    }
    setUser(u);
    fetchData(u.id);
  }, []);

  const fetchData = async (userId) => {
    setLoading(true);
    setError("");
    try {
      const bookingsRes = await getAllBookings();
      const userBookings = bookingsRes.data.filter(
        (b) => b.user?.userId === userId
      );
      setMyBookings(userBookings);
    } catch (err) {
      console.error(err);
      setError(" Failed to load your bookings");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ bookId: null, startingDate: "", endingDate: "", address: "", phone: "" });
    setShowModal(true);
  };

  const openEditModal = (booking) => {
    setIsEditing(true);
    setFormData({
      bookId: booking.bookId,
      startingDate: booking.startingDate,
      endingDate: booking.endingDate,
      address: booking.address,
      phone: booking.phone,
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const payload = {
      startingDate: formData.startingDate,
      endingDate: formData.endingDate,
      address: formData.address,
      phone: formData.phone,
      user: { userId: user.id },
    };

    try {
      if (isEditing) {
        await updateBooking(formData.bookId, payload);
      } else {
        await createBooking(payload);
      }
      setShowModal(false);
      fetchData(user.id);
    } catch (err) {
      console.error(err);
      setError("Failed to save booking");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      await deleteBooking(id);
      fetchData(user.id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete booking");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}>Welcome, {user?.username}</h2>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </header>

      <section style={styles.section}>
        <h3 style={styles.sectionTitle}> My Bookings</h3>

        <button onClick={openAddModal} style={styles.newBtn}>
          + New Booking
        </button>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : myBookings.length === 0 ? (
          <p style={{ color: "#7f8c8d" }}>You don’t have any bookings yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Start</th>
                <th style={styles.th}>End</th>
                <th style={styles.th}>Address</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myBookings.map((b, i) => (
                <tr
                  key={b.bookId}
                  style={{
                    backgroundColor: i % 2 === 0 ? "#ecf0f1" : "#fff",
                  }}
                >
                  <td style={styles.td}>{b.bookId}</td>
                  <td style={styles.td}>{b.startingDate}</td>
                  <td style={styles.td}>{b.endingDate}</td>
                  <td style={styles.td}>{b.address}</td>
                  <td style={styles.td}>{b.phone}</td>
                  <td style={styles.td}>
                    <button onClick={() => openEditModal(b)} style={styles.editBtn}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(b.bookId)} style={styles.deleteBtn}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Modal */}
      {showModal && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalContent}>
            <h3>{isEditing ? "Edit Booking" : " New Booking"}</h3>

            <form onSubmit={handleSubmit} style={styles.form}>
              <input
                type="date"
                name="startingDate"
                value={formData.startingDate}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <input
                type="date"
                name="endingDate"
                value={formData.endingDate}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Address"
                style={styles.input}
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Phone"
                style={styles.input}
              />
              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button type="submit" style={styles.saveBtn}>
                  {isEditing ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={styles.cancelBtn}
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

// Styles
const styles = {
  container: {
    padding: 20,
    maxWidth: 900,
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  title: { color: "#2c3e50", margin: 0 },
  logoutBtn: {
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: 4,
    cursor: "pointer",
  },
  section: { marginBottom: 30 },
  sectionTitle: { color: "#34495e", marginBottom: 10 },
  newBtn: {
    background: "#27ae60",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: 4,
    cursor: "pointer",
    marginBottom: 15,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    boxShadow: "0 0 5px rgba(0,0,0,0.1)",
  },
  th: {
    backgroundColor: "#2980b9",
    color: "#fff",
    padding: 8,
    textAlign: "left",
  },
  td: { padding: 8 },
  editBtn: {
    background: "#f39c12",
    color: "#fff",
    border: "none",
    padding: "4px 8px",
    borderRadius: 4,
    marginRight: 5,
    cursor: "pointer",
  },
  deleteBtn: {
    background: "#c0392b",
    color: "#fff",
    border: "none",
    padding: "4px 8px",
    borderRadius: 4,
    cursor: "pointer",
  },
  modalBackdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    background: "#fff",
    padding: 20,
    borderRadius: 8,
    width: 400,
    boxShadow: "0 0 10px rgba(0,0,0,0.3)",
  },
  form: { display: "flex", flexDirection: "column", gap: 10 },
  input: {
    padding: 8,
    fontSize: 16,
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  saveBtn: {
    background: "#27ae60",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: 4,
    cursor: "pointer",
  },
  cancelBtn: {
    background: "#bdc3c7",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: 4,
    cursor: "pointer",
  },
};
