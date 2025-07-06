import React, { useState } from "react";
import { createUser } from "../api";

export default function NewUser() {
  const [form, setForm] = useState({ username: "", password: "", email: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createUser(form);
    alert("✅ User created!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>New User</h2>
      <input name="username" onChange={handleChange} placeholder="Username" />
      <input name="email" onChange={handleChange} placeholder="Email" />
      <input name="password" onChange={handleChange} placeholder="Password" />
      <button type="submit">Save</button>
    </form>
  );
}
