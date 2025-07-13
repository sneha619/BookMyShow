import axios from 'axios';
import { store } from '../redux/store';
import { setUser } from '../redux/userSlice';

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:10000',
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

// Add a response interceptor to handle authentication errors
axiosInstance.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        // Handle 401 errors (unauthorized/token expired)
        if (error.response?.status === 401) {
            console.log('Token expired or invalid, logging out user');
            localStorage.removeItem('token');
            store.dispatch(setUser(null));
            
            // Only redirect to login if not already on login/register pages
            const currentPath = window.location.pathname;
            if (currentPath !== '/login' && currentPath !== '/register') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);
