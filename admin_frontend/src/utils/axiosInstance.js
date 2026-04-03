import axios from 'axios';
import Cookies from 'js-cookie';

const API = axios.create({
// baseURL:"http://localhost:5000/api"
baseURL :"https://backend.startupyogdan.com/api"
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


API.interceptors.request.use(config => {
  const token = Cookies.get('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;