import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";


const getAuthHeader = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return {};
  const user = JSON.parse(userStr);

  if (!user.username || !user.password) return {};

  const token = btoa(`${user.username}:${user.password}`);
  return {
    Authorization: `Basic ${token}`,
    'Content-Type': 'application/json',
  };
};



export const login = async (username, password) => {
  const res = await axios.post(`${API_BASE_URL}/auth/login`, {
    username,
    password,
  });
  
  localStorage.setItem(
    "user",
    JSON.stringify({ ...res.data, username, password })
  );
  return res;
};

export const signup = (user) =>
  axios.post(`${API_BASE_URL}/auth/signup`, user);



export const getAllUsers = () =>
  axios.get(`${API_BASE_URL}/users`, {
    headers: getAuthHeader(),
  });

export const getUserById = (id) =>
  axios.get(`${API_BASE_URL}/users/${id}`, {
    headers: getAuthHeader(),
  });

export const createUser = (data) =>
  axios.post(`${API_BASE_URL}/users`, data, {
    headers: getAuthHeader(),
  });

export const updateUser = (id, data) =>
  axios.put(`${API_BASE_URL}/users/${id}`, data, {
    headers: getAuthHeader(),
  });

export const deleteUser = (id) =>
  axios.delete(`${API_BASE_URL}/users/${id}`, {
    headers: getAuthHeader(),
  });



export const getAllBookings = () =>
  axios.get(`${API_BASE_URL}/bookings`, {
    headers: getAuthHeader(),
  });

export const getBookingById = (id) =>
  axios.get(`${API_BASE_URL}/bookings/${id}`, {
    headers: getAuthHeader(),
  });

export const createBooking = (data) =>
  axios.post(`${API_BASE_URL}/bookings`, data, {
    headers: getAuthHeader(),
  });

export const updateBooking = (id, data) =>
  axios.put(`${API_BASE_URL}/bookings/${id}`, data, {
    headers: getAuthHeader(),
  });

export const deleteBooking = (id) =>
  axios.delete(`${API_BASE_URL}/bookings/${id}`, {
    headers: getAuthHeader(),
  });


export const logout = () => {
  localStorage.removeItem("user");
};
