import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./components/AdminDashboard";
import UserList from "./components/UserList";
import BookingList from "./components/BookingList";
import NewUser from "./components/NewUser";
import NewBooking from "./components/NewBooking";
import Mtumiaji from "./components/Mtumiaji";

function PrivateRoute() {
  const user = localStorage.getItem("user");
  const isLoggedIn = !!user;


  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }


  return <Outlet />;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("user");
  });

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<LoginForm onLogin={setIsLoggedIn} />}
        />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/mtumiaji" element={<Mtumiaji />} />
        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserList />} />
            <Route path="bookings" element={<BookingList />} />
            <Route path="register" element={<NewUser />} />
            <Route path="new-booking" element={<NewBooking />} />
            
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
