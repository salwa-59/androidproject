import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/login',
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Full response:', response);
      console.log('Response data:', response.data);

      const data = response.data;

      if (data?.userId) {
        const role = normalizeRole(data.role);

        localStorage.setItem(
          'user',
          JSON.stringify({
            id: data.userId,
            username: data.username,
            email: data.email,
            role,
            password, 
          })
        );

        onLogin(true);

        if (role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/mtumiaji');
        }
      } else {
        setError('Invalid login response');
      }
    } catch (error) {
      console.error('Login error:', error.response || error);

      if (error.response?.status === 401) {
        setError('Incorrect username or password');
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  const normalizeRole = (role) => {
    
    if (!role) return 'USER';
    if (Array.isArray(role)) role = role[0];
    role = role.toUpperCase();
    if (role.startsWith('ROLE_')) return role.replace('ROLE_', '');
    return role;
  };

  const goToSignup = () => {
    navigate('/signup');
  };

  return (
    <div style={{
      maxWidth: 400,
      margin: '50px auto',
      padding: 20,
      border: '1px solid #ccc',
      borderRadius: 8
    }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ padding: 10, fontSize: 16 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: 10, fontSize: 16 }}
        />
        <button
          type="submit"
          style={{
            padding: 10,
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Login
        </button>

        <button
          type="button"
          onClick={goToSignup}
          style={{
            padding: 10,
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Create Account
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default Login;
