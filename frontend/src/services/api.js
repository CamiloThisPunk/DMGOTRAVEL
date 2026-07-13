import axios from 'axios';

axios.defaults.withCredentials = true;

let baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
if (baseURL.endsWith('/api')) {
    baseURL = baseURL.slice(0, -4);
}

const api = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

// Automatically handle FormData: remove Content-Type so axios sets multipart boundary
api.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }
    return config;
});

export default api;
