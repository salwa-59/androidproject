import React, { useEffect, useState } from "react";
import { getAllUsers, getAllBookings } from "../api";

export default function AdminDashboard() {
  const [usersCount, setUsersCount] = useState(0);
  const [bookingsCount, setBookingsCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const usersRes = await getAllUsers();
      setUsersCount(usersRes.data.length);

      const bookingsRes = await getAllBookings();
      setBookingsCount(bookingsRes.data.length);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ background: "#4CAF50", color: "white", padding: 20, borderRadius: 8, flex: 1 }}>
          <h3>Total Users</h3>
          <p style={{ fontSize: 24 }}>{usersCount}</p>
        </div>
        <div style={{ background: "#2196F3", color: "white", padding: 20, borderRadius: 8, flex: 1 }}>
          <h3>Total Bookings</h3>
          <p style={{ fontSize: 24 }}>{bookingsCount}</p>
        </div>
      </div>
    </div>
  );
}
