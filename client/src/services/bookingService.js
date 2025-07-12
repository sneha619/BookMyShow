/**
 * Service for booking-related API calls
 */
import axiosInstance from '../apicalls';

/**
 * Make a booking
 * @param {Object} bookingData - Booking data including show, seats, etc.
 * @returns {Promise<Object>} Response with success status and data
 */
export const makeBooking = async (bookingData) => {
  try {
    const response = await axiosInstance.post('/api/booking/make-booking', bookingData);
    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
      error,
    };
  }
};

/**
 * Get all bookings for the current user
 * @returns {Promise<Object>} Response with success status and data
 */
export const getUserBookings = async () => {
  try {
    const response = await axiosInstance.get('/api/booking/get-bookings-by-user');
    return {
      success: response.data.success,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
      error,
    };
  }
};

/**
 * Get booking by ID
 * @param {string} id - Booking ID
 * @returns {Promise<Object>} Response with success status and data
 */
export const getBookingById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/booking/get-booking-by-id/${id}`);
    return {
      success: response.data.success,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
      error,
    };
  }
};

/**
 * Cancel a booking
 * @param {string} id - Booking ID
 * @returns {Promise<Object>} Response with success status and message
 */
export const cancelBooking = async (id) => {
  try {
    const response = await axiosInstance.post(`/api/booking/cancel-booking/${id}`);
    return {
      success: response.data.success,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
      error,
    };
  }
};

/**
 * Get available seats for a show
 * @param {string} showId - Show ID
 * @returns {Promise<Object>} Response with success status and data
 */
export const getAvailableSeats = async (showId) => {
  try {
    const response = await axiosInstance.get(`/api/booking/get-available-seats/${showId}`);
    return {
      success: response.data.success,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
      error,
    };
  }
};