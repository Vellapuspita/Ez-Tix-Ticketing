import axios from 'axios';

// 1. Tentukan Base URL Backend
const BASE_URL = 'http://localhost:4000/api'; 

const authAxios = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Interceptor: Otomatis Tambahkan Token ke Setiap Request
authAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // Menambahkan token ke header 'Authorization'
            config.headers['Authorization'] = `Bearer ${token}`; 
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default authAxios;