import axios from 'axios';

// Use VITE_API_URL in local development if set, otherwise default to relative /api for deployments
const baseURL = import.meta.env.VITE_API_URL ?? '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
