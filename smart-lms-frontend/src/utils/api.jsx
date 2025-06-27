import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://smart-lms.onrender.com/api",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});


let csrfInitialized = false;
const CSRF_COOKIE_NAME = 'csrftoken';

function getCSRFToken() {
  const cookie = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${CSRF_COOKIE_NAME}=`));
  return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
}

export const ensureCSRF = async () => {
  if (csrfInitialized && getCSRFToken()) return true;
  
  try {
    const response = await api.get('/get-csrf-token/');
    if (!getCSRFToken()) {
      throw new Error('CSRF cookie not set after API call');
    }
    csrfInitialized = true;
    console.debug('CSRF initialized', document.cookie);
    return true;
  } catch (err) {
    console.error('CSRF initialization failed:', err);
    csrfInitialized = false;
    throw new Error('Security system initialization failed');
  }
};

api.interceptors.request.use(async (config) => {
  
  if (['get', 'head', 'options'].includes(config.method.toLowerCase())) {
    return config;
  }

  
  let token = getCSRFToken();
  if (!token) {
    console.warn('No CSRF token found, fetching new one...');
    await ensureCSRF();
    token = getCSRFToken();
    
    if (!token) {
      throw new Error('Persistent CSRF token failure');
    }
  }

  config.headers['X-CSRFToken'] = token;
  return config;
}, (error) => {
  return Promise.reject(error);
});


api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    
    
    if (error.response?.status === 403 && !originalRequest._retry) {
      console.warn('CSRF validation failed, retrying...');
      originalRequest._retry = true;
      csrfInitialized = false;
      await ensureCSRF();
      return api(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

export default api;