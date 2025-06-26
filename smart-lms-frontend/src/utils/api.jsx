import axios from "axios";

// Get CSRF token from cookies
function getCSRFToken() {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, 10) === "csrftoken=") {
        cookieValue = decodeURIComponent(cookie.substring(10));
        break;
      }
    }
  }
  return cookieValue;
}

const api = axios.create({
 baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  withCredentials: true, // Allow sending cookies with requests

});

// api.interceptors.request.use(config => {
//     const token=getCSRFToken();
//     if(token){
//         config.headers["X-CSRFToken"] = token;
//     }
//     return config;
//   });

// In your api.js (modified version)
let csrfReady = false;
let csrfPromise = null;

export const ensureCSRF = async () => {
  if (csrfReady) return true;
  if (csrfPromise) return csrfPromise;

  csrfPromise = api.get("/get-csrf-token/")
    .then(() => {
      csrfReady = true;
      return true;
    })
    .catch(err => {
      csrfPromise = null; // Allow retry
      throw err;
    });

  return csrfPromise;
};

api.interceptors.request.use(async (config) => {
  // Skip for read-only methods
  if (['get', 'head', 'options'].includes(config.method.toLowerCase())) {
    return config;
  }

  await ensureCSRF();
  const token = getCSRFToken();
  if (token) {
    config.headers['X-CSRFToken'] = token;
  }
  return config;
});
export default api;

