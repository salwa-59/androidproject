import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <h2>Bungalow</h2>
        <nav>
          <ul>
            <li><Link to="/admin">Dashboard</Link></li>
            <li><Link to="/admin/users">Users</Link></li>
            <li><Link to="/admin/bookings">Bookings</Link></li>
            
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="header">
          <span>Bungalow Booking</span>
          <button onClick={handleLogout} style={{
            background: "transparent",
            color: "#fff",
            border: "1px solid #fff",
            padding: "3px 10px",
            borderRadius: "4px",
            cursor: "pointer"
          }}>
            Logout
          </button>
        </header>
        <section className="content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
