import { axiosInstance } from './index';

// Make a temporary booking (reserve seats)
export const makeBooking = async (bookingData) => {
    try {
        const response = await axiosInstance.post('/api/bookings/make-booking', bookingData);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

// Confirm booking after payment
export const confirmBooking = async (bookingId, paymentData) => {
    try {
        const response = await axiosInstance.put(`/api/bookings/confirm-booking/${bookingId}`, paymentData);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

// Get user bookings
export const getUserBookings = async () => {
    try {
        const response = await axiosInstance.get('/api/bookings/get-user-bookings');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

// Get booking by ID
export const getBookingById = async (bookingId) => {
    try {
        const response = await axiosInstance.get(`/api/bookings/get-booking-by-id/${bookingId}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

// Cancel booking
export const cancelBooking = async (bookingId) => {
    try {
        const response = await axiosInstance.put(`/api/bookings/cancel-booking/${bookingId}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

// Get all bookings (Admin only)
export const getAllBookings = async () => {
    try {
        const response = await axiosInstance.get('/api/bookings/get-all-bookings');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

// Clean up expired bookings
export const cleanupExpiredBookings = async () => {
    try {
        const response = await axiosInstance.delete('/api/bookings/cleanup-expired');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};