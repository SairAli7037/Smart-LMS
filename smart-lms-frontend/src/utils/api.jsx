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
    console.log("🔄 New CSRF Token Fetched");
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


