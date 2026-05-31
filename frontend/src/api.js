import axios from 'axios';

// Create a custom axios instance
const api = axios.create({
    baseURL: 'https://saas-backend-pmrc.onrender.com/api',
});

// Automatically intercept every request and attach the JWT token if we have one
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;