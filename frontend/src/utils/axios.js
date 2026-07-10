// utils/axios.js — the ONLY file that knows the backend's URL
// every page in the app imports "api" from here instead of using axios directly
//That's the whole file. From now on, any page just does api.post('/workers/login', data) instead of typing the full URL and manually attaching the token every time.

import axios from 'axios'
const api = axios.create({
  baseURL: 'https://handyhq-ku5q.onrender.com', // must be the real Render URL, not localhost
})

// this runs automatically BEFORE every single request sent through "api"
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') // where we'll store the JWT after login

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api