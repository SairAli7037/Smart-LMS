// import axios from "axios";


// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || "https://smart-lms.onrender.com/api",
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json'
//   }
// });


// let csrfInitialized = false;
// const CSRF_COOKIE_NAME = 'csrftoken';

// function getCSRFToken() {
//   const cookie = document.cookie
//     .split('; ')
//     .find(row => row.startsWith(`${CSRF_COOKIE_NAME}=`));
//   return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
// }

// export const ensureCSRF = async () => {
//   // 1. First check if we already have a valid token
//   const existingToken = getCSRFToken();
//   if (csrfInitialized && existingToken) {
//     console.debug('Using existing CSRF token');
//     return true;
//   }

//   try {
//     // 2. Explicitly clear any existing failed state
//     csrfInitialized = false;
    
//     // 3. Make the token request with credentials
//     console.log('Attempting CSRF token fetch...');
//     const response = await api.get('/get-csrf-token/', {
//       headers: {
//         'Cache-Control': 'no-cache', // Prevent caching
//         'Pragma': 'no-cache'
//       }
//     });

//     // 4. Verify the cookie was actually set
//     const newToken = getCSRFToken();
//     if (!newToken) {
//       console.error('CSRF Debug:', {
//         responseHeaders: response.headers,
//         cookies: document.cookie,
//         responseData: response.data
//       });
//       throw new Error('CSRF cookie not found in document.cookie after successful response');
//     }

//     // 5. Validate token format
//     if (newToken.length < 10) { // Basic length check
//       console.error('Invalid CSRF token format:', newToken);
//       throw new Error('Invalid CSRF token received');
//     }

//     csrfInitialized = true;
//     console.log('CSRF initialized successfully', {
//       tokenPreview: `${newToken.substring(0, 5)}...${newToken.slice(-5)}`,
//       domain: document.domain
//     });
    
//     return true;
//   } catch (err) {
//     csrfInitialized = false;
    
//     // Enhanced error diagnostics
//     const diagnosticInfo = {
//       error: err.message,
//       cookiePresent: document.cookie.includes('csrftoken'),
//       apiBaseURL: api.defaults.baseURL,
//       currentOrigin: window.location.origin,
//       cookieDomain: document.domain
//     };
    
//     console.error('CSRF initialization failed:', diagnosticInfo);
//     throw new Error(`Security system failed: ${err.message}`);
//   }
// };

// api.interceptors.request.use(async (config) => {
  
//   if (['get', 'head', 'options'].includes(config.method.toLowerCase())) {
//     return config;
//   }

  
//   let token = getCSRFToken();
//   if (!token) {
//     console.warn('No CSRF token found, fetching new one...');
//     await ensureCSRF();
//     token = getCSRFToken();
    
//     if (!token) {
//       throw new Error('Persistent CSRF token failure');
//     }
//   }

//   config.headers['X-CSRFToken'] = token;
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });


// api.interceptors.response.use(
//   response => response,
//   async (error) => {
//     const originalRequest = error.config;
    
    
//     if (error.response?.status === 403 && !originalRequest._retry) {
//       console.warn('CSRF validation failed, retrying...');
//       originalRequest._retry = true;
//       csrfInitialized = false;
//       await ensureCSRF();
//       return api(originalRequest);
//     }
    
//     return Promise.reject(error);
//   }
// );

// export default api;
// export const ensureCSRF = async () => {
//   try {
//     await api.get('/get-csrf-token/', {
//     });
//     console.log('✅ CSRF cookie set');
//     console.log(document.cookie)
//   } catch (err) {
//     console.error('❌ Failed to fetch CSRF cookie:', err);
//     throw err;
//   }
// };

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://smart-lms.onrender.com/api",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

let csrfToken =localStorage.getItem('csrfToken') || null;

export async function ensureCSRF() {
  try {
    const { data } = await api.get("/get-csrf-token/");
    csrfToken = data.csrftoken;
    localStorage.setItem('csrfToken', csrfToken); // Persist new token
    console.log("🔄 New CSRF Token:", csrfToken);
  } catch (error) {
    console.error("❌ Failed to refresh CSRF token:", error);
    throw error;
  }
}

api.interceptors.request.use((config) => {
  if (["post", "put", "patch", "delete"].includes(config.method)) {
    if (!csrfToken) {
      throw new Error("CSRF token missing – call ensureCSRF() first");
    }
    config.headers["X-CSRFToken"] = csrfToken;
  }
  return config;
});

export default api;


