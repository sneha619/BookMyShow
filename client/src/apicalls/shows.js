import { axiosInstance } from './index';

// Get all shows
export const getAllShows = async (filters = {}) => {
    try {
        const response = await axiosInstance.get('/api/shows/get-all-shows', {
            params: filters
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

// Get shows by movie ID
export const getShowsByMovie = async (movieId, filters = {}) => {
    try {
        const response = await axiosInstance.get(`/api/shows/get-shows-by-movie/${movieId}`, {
            params: filters
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

// Get show by ID
export const getShowById = async (showId) => {
    try {
        const response = await axiosInstance.get(`/api/shows/get-show-by-id/${showId}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

// Add new show
export const addShow = async (showData) => {
    try {
        const response = await axiosInstance.post('/api/shows/add-show', showData);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

// Update show
export const updateShow = async (showId, showData) => {
    try {
        const response = await axiosInstance.put(`/api/shows/update-show/${showId}`, showData);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

// Delete show
export const deleteShow = async (showId) => {
    try {
        const response = await axiosInstance.delete(`/api/shows/delete-show/${showId}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

// Get shows by theater owner
export const getShowsByTheaterOwner = async () => {
    try {
        const response = await axiosInstance.get('/api/shows/get-shows-by-theater-owner');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

// Get shows by theater ID
export const getShowsByTheater = async (theaterId, filters = {}) => {
    try {
        const response = await axiosInstance.get(`/api/shows/get-shows-by-theater/${theaterId}`, {
            params: filters
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};