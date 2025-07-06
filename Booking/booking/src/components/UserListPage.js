import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserListPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '', address: '', password: '' });
  const navigate = useNavigate();

  const API_URL = 'http://localhost:8080/api/users';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      const data = response.data;
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setError('Unexpected response format from server.');
        setUsers([]);
      }
    } catch (error) {
      setError('Failed to load users. Please try again later.');
      setUsers([]);
      console.error("Fetch users error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchUsers();
      } catch (err) {
        alert('Failed to delete user.');
        console.error("Delete user error:", err);
      }
    }
  };

  const handleUpdateClick = (user) => {
    navigate(`/updateuser/${user.userId}`);
  };

  const handleView = (id) => {
    navigate(`/users/${id}`);
  };

  const handleNewUserChange = (e) => {
    setNewUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNewUserSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, newUser);
      setNewUser({ name: '', email: '', address: '', password: '' });
      fetchUsers();
      alert('User created successfully.');
    } catch (err) {
      alert('Failed to create user.');
      console.error("Create user error:", err);
    }
  };

  return (
    <div style={containerStyle}>
      <h2>All Registered Users</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleNewUserSubmit} style={{ marginBottom: 20 }}>
        <h3>Add New User</h3>
        <input name="name" value={newUser.name} onChange={handleNewUserChange} placeholder="Name" required style={inputStyle} />
        <input name="email" value={newUser.email} onChange={handleNewUserChange} placeholder="Email" type="email" required style={inputStyle} />
        <input name="address" value={newUser.address} onChange={handleNewUserChange} placeholder="Address" required style={inputStyle} />
        <input name="password" value={newUser.password} onChange={handleNewUserChange} placeholder="Password" type="password" required style={inputStyle} />
        <button type="submit" style={addBtnStyle}>Add User</button>
      </form>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Username</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Phone</th>
            <th style={thStyle}>Role</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.userId}>
                <td style={tdStyle}>{user.userId}</td>
                <td style={tdStyle}>{user.username}</td>
                <td style={tdStyle}>{user.email}</td>
                <td style={tdStyle}>{user.phone || '-'}</td>
                <td style={tdStyle}>{user.role}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleView(user.userId)} style={actionBtnStyle}>View</button>
                  <button onClick={() => handleUpdateClick(user)} style={{ ...actionBtnStyle, backgroundColor: '#ffc107' }}>Update</button>
                  <button onClick={() => handleDelete(user.userId)} style={{ ...actionBtnStyle, backgroundColor: 'red', color: 'white' }}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="6" style={{ textAlign: 'center' }}>No users found.</td></tr>
          )}
        </tbody>
      </table>

      <button onClick={() => navigate('/')} style={backBtnStyle}>Back to Home</button>
    </div>
  );
}

const containerStyle = {
  maxWidth: '900px',
  margin: '50px auto',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '10px',
  backgroundColor: '#f9f9f9',
  fontFamily: 'Arial, sans-serif',
  textAlign: 'center',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px'
};

const thStyle = {
  border: '1px solid #ccc',
  padding: '10px',
  textAlign: 'left'
};

const tdStyle = {
  border: '1px solid #ccc',
  padding: '10px'
};

const actionBtnStyle = {
  padding: '5px 10px',
  marginRight: '5px',
  backgroundColor: '#17a2b8',
  color: 'white',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer'
};

const addBtnStyle = {
  marginTop: 10,
  padding: '8px 20px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

const inputStyle = {
  width: '20%',
  padding: 5,
  margin: '5px',
  border: '1px solid #ccc',
  borderRadius: 3
};

const backBtnStyle = {
  marginTop: '30px',
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

export default UserListPage;
