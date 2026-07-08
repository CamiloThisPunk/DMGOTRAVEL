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

export default api;
