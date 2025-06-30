import axios from 'axios';

export const axiosInstance = axios.create({
    headers: {'Content-Type': 'application/json'}
});

// Add a request interceptor to dynamically set the token for each request
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
