/**
 * Service for movie-related API calls
 */
import axiosInstance from '../apicalls';

/**
 * Get all movies
 * @returns {Promise<Object>} Response with success status and data
 */
export const getAllMovies = async () => {
  try {
    const response = await axiosInstance.get('/api/movie/get-all-movies');
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
 * Get movie by ID
 * @param {string} id - Movie ID
 * @returns {Promise<Object>} Response with success status and data
 */
export const getMovieById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/movie/get-movie-by-id/${id}`);
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
 * Add a new movie (admin only)
 * @param {Object} movieData - Movie data
 * @returns {Promise<Object>} Response with success status and data
 */
export const addMovie = async (movieData) => {
  try {
    const response = await axiosInstance.post('/api/movie/add-movie', movieData);
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
 * Update a movie (admin only)
 * @param {string} id - Movie ID
 * @param {Object} movieData - Updated movie data
 * @returns {Promise<Object>} Response with success status and data
 */
export const updateMovie = async (id, movieData) => {
  try {
    const response = await axiosInstance.put(`/api/movie/update-movie/${id}`, movieData);
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
 * Delete a movie (admin only)
 * @param {string} id - Movie ID
 * @returns {Promise<Object>} Response with success status and message
 */
export const deleteMovie = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/movie/delete-movie/${id}`);
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