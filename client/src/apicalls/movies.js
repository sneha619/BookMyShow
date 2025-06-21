import { axiosInstance } from './index';

// Get all movies
export const getAllMovies = async (filters = {}) => {
    try {
        const response = await axiosInstance.get('/api/movies/get-all-movies', {
            params: filters
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

// Get movie by ID
export const getMovieById = async (movieId) => {
    try {
        const response = await axiosInstance.get(`/api/movies/get-movie-by-id/${movieId}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

// Add new movie (Admin only)
export const addMovie = async (movieData) => {
    try {
        const response = await axiosInstance.post('/api/movies/add-movie', movieData);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

// Update movie (Admin only)
export const updateMovie = async (movieId, movieData) => {
    try {
        const response = await axiosInstance.put(`/api/movies/update-movie/${movieId}`, movieData);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

// Delete movie (Admin only)
export const deleteMovie = async (movieId) => {
    try {
        const response = await axiosInstance.delete(`/api/movies/delete-movie/${movieId}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

// Get movies by city
export const getMoviesByCity = async (city) => {
    try {
        const response = await axiosInstance.get(`/api/movies/get-movies-by-city/${city}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};