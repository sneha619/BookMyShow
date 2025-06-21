import { axiosInstance } from './index';

// Get all theaters
export const getAllTheaters = async (filters = {}) => {
    try {
        const response = await axiosInstance.get('/api/theaters/get-all-theaters', {
            params: filters
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

// Get theater by ID
export const getTheaterById = async (theaterId) => {
    try {
        const response = await axiosInstance.get(`/api/theaters/get-theater-by-id/${theaterId}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

// Add new theater
export const addTheater = async (theaterData) => {
    try {
        const response = await axiosInstance.post('/api/theaters/add-theater', theaterData);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

// Update theater
export const updateTheater = async (theaterId, theaterData) => {
    try {
        const response = await axiosInstance.put(`/api/theaters/update-theater/${theaterId}`, theaterData);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

// Delete theater
export const deleteTheater = async (theaterId) => {
    try {
        const response = await axiosInstance.delete(`/api/theaters/delete-theater/${theaterId}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

// Get theaters by owner
export const getTheatersByOwner = async () => {
    try {
        const response = await axiosInstance.get('/api/theaters/get-theaters-by-owner');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

// Get theaters by city
export const getTheatersByCity = async (city) => {
    try {
        const response = await axiosInstance.get(`/api/theaters/get-theaters-by-city/${city}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};