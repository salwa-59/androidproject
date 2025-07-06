import React, { useState } from "react";
import { createBooking } from "../api";

export default function NewBooking() {
  const [form, setForm] = useState({});

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createBooking(form);
    alert("✅ Booking created!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>New Booking</h2>
      <input name="name" onChange={handleChange} placeholder="Booking Name" />
      <input name="date" onChange={handleChange} placeholder="Date" />
      <button type="submit">Save</button>
    </form>
  );
}
