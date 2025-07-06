import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const SignupForm = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
    role: "USER",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/signup",
        form,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess(res.data); 
      setForm({ username: "", password: "", email: "", phone: "", role: "USER" });

      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400) {
        setError(err.response.data || "Username already exists!");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div style={container}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          style={input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={input}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone (optional)"
          value={form.phone}
          onChange={handleChange}
          style={input}
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          required
          style={input}
        >
          <option value="USER">USER</option>
          <option value="ADMIN"></option>
        </select>

        <button type="submit" style={button}>Sign Up</button>
      </form>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}

      <p style={{ marginTop: "15px" }}>
        Tayari una account? <Link to="/">Ingia hapa</Link>
      </p>
    </div>
  );
};

const container = {
  maxWidth: "400px",
  margin: "50px auto",
  textAlign: "center",
  border: "1px solid #ccc",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const input = {
  padding: "10px",
  fontSize: "16px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const button = {
  padding: "10px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

export default SignupForm;
