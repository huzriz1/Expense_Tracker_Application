import axios from 'axios';

// Ek central instance jo aapke port 3000 ke backend se baat karega
const api = axios.create({
  baseURL: '/api',

  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
