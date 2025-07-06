import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';  // Base URL ya backend yako

// --------- User APIs ---------
export const getAllUsers = async () => {
    return await axios.get(`${BASE_URL}/users`);
};

export const createUser = async (userData) => {
    return await axios.post(`${BASE_URL}/users`, userData);
};

export const deleteUser = async (userId) => {
    return await axios.delete(`${BASE_URL}/users/${userId}`);
};

export const updateUser = async (userId, userData) => {
    return await axios.put(`${BASE_URL}/users/${userId}`, userData);
};

// --------- Booking APIs ---------
export const getAllBookings = async () => {
    return await axios.get(`${BASE_URL}/bookings`);
};

export const createBooking = async (bookingData) => {
    return await axios.post(`${BASE_URL}/bookings`, bookingData);
};

export const deleteBooking = async (bookingId) => {
    return await axios.delete(`${BASE_URL}/bookings/${bookingId}`);
};

export const updateBooking = async (bookingId, bookingData) => {
    return await axios.put(`${BASE_URL}/bookings/${bookingId}`, bookingData);
};
