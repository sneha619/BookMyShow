/**
 * Service for theater-related API calls
 */
import axiosInstance from '../apicalls';

/**
 * Get all theaters
 * @returns {Promise<Object>} Response with success status and data
 */
export const getAllTheaters = async () => {
  try {
    const response = await axiosInstance.get('/api/theater/get-all-theaters');
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
 * Get theater by ID
 * @param {string} id - Theater ID
 * @returns {Promise<Object>} Response with success status and data
 */
export const getTheaterById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/theater/get-theater-by-id/${id}`);
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
 * Add a new theater (owner only)
 * @param {Object} theaterData - Theater data
 * @returns {Promise<Object>} Response with success status and data
 */
export const addTheater = async (theaterData) => {
  try {
    const response = await axiosInstance.post('/api/theater/add-theater', theaterData);
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
 * Update a theater (owner only)
 * @param {string} id - Theater ID
 * @param {Object} theaterData - Updated theater data
 * @returns {Promise<Object>} Response with success status and data
 */
export const updateTheater = async (id, theaterData) => {
  try {
    const response = await axiosInstance.put(`/api/theater/update-theater/${id}`, theaterData);
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
 * Delete a theater (owner only)
 * @param {string} id - Theater ID
 * @returns {Promise<Object>} Response with success status and message
 */
export const deleteTheater = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/theater/delete-theater/${id}`);
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
 * Get shows for a specific theater
 * @param {string} theaterId - Theater ID
 * @returns {Promise<Object>} Response with success status and data
 */
export const getShowsByTheater = async (theaterId) => {
  try {
    const response = await axiosInstance.get(`/api/theater/get-shows-by-theater/${theaterId}`);
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