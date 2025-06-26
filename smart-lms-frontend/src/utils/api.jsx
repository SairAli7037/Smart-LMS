import axios from "axios";

// 1. Configure Axios Instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://smart-lms.onrender.com/api",
  withCredentials: true, // Critical for cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// 2. Enhanced CSRF Token Getter
function getCSRFToken() {
  const cookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='));
  return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
}

// 3. CSRF Management System
let csrfInitialized = false;

export const ensureCSRF = async () => {
  if (csrfInitialized) return true;
  
  try {
    const response = await api.get('/get-csrf-token/');
    csrfInitialized = true;
    console.debug('CSRF initialized', response);
    return true;
  } catch (err) {
    console.error('CSRF initialization failed:', err);
    throw new Error('Security system failed to initialize');
  }
};

// 4. Request Interceptor (Optimized)
api.interceptors.request.use(async (config) => {
  // Skip for non-modifying requests
  if (!['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
    return config;
  }

  // Ensure CSRF is ready
  if (!csrfInitialized) {
    await ensureCSRF();
  }

  // Attach token
  const token = getCSRFToken();
  if (!token) {
    console.error('CSRF token missing! Cookies:', document.cookie);
    throw new Error('Security token missing');
  }

  config.headers['X-CSRFToken'] = token;
  console.debug(`Attached CSRF to ${config.method} ${config.url}`);
  return config;
});

// 5. Response Interceptor (Error Handling)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 403 && error.config.url !== '/get-csrf-token/') {
      console.warn('CSRF failed, resetting token...');
      csrfInitialized = false; // Force re-init on next request
    }
    return Promise.reject(error);
  }
);

export default api;

