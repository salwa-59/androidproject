import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  FaClipboardList, FaPlus, FaUsers, FaUserPlus, FaHome, FaSignOutAlt
} from 'react-icons/fa';

function Dashboard() {
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  const pageTitle = () => {
    if (location.pathname === '/') return 'Dashboard';
    if (location.pathname.startsWith('/bookings')) return 'Bookings';
    if (location.pathname.startsWith('/users')) return 'Users';
    return 'Page';
  };

  const handleLogout = () => {
    
    alert('Logged out!');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <h2 style={logoStyle}>
          <FaHome /> Dashboard
        </h2>
        <ul style={navListStyle}>
          <li>
            <Link to="/bookinglist" style={isActive('/bookinglist') ? activeLink : linkStyle}>
              <FaClipboardList /> Bookings List
            </Link>
          </li>
          <li>
            <Link to="/bookings/new" style={isActive('/bookings/new') ? activeLink : linkStyle}>
              <FaPlus /> New Booking
            </Link>
          </li>
          <li>
            <Link to="/userlistpage" style={isActive('/userlistpage') ? activeLink : linkStyle}>
              <FaUsers /> Users List
            </Link>
          </li>
          <li>
            <Link to="/users/new" style={isActive('/users/new') ? activeLink : linkStyle}>
              <FaUserPlus /> New User
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={headerStyle}>
          <h3 style={{ margin: 0 }}>{pageTitle()}</h3>
          <button onClick={handleLogout} style={logoutBtn}>
            <FaSignOutAlt /> Logout
          </button>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '20px', background: '#f4f6f9' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const sidebarStyle = {
  width: '240px',
  background: '#2c3e50',
  padding: '20px',
  color: 'white',
  height: '100vh',
  boxSizing: 'border-box',
};

const logoStyle = {
  color: 'white',
  marginBottom: '20px',
  textAlign: 'center',
};

const navListStyle = {
  listStyleType: 'none',
  padding: 0,
  margin: 0,
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px',
  fontWeight: 'bold',
  borderRadius: '4px',
};

const activeLink = {
  ...linkStyle,
  backgroundColor: '#34495e',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
  background: '#ecf0f1',
  borderBottom: '1px solid #ccc',
};

const logoutBtn = {
  backgroundColor: '#e74c3c',
  color: 'white',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default Dashboard;
