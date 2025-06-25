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
  baseURL: "http://localhost:8000/api",
  withCredentials: true, // Allow sending cookies with requests

});

api.interceptors.request.use(config => {
    const token=getCSRFToken();
    if(token){
        config.headers["X-CSRFToken"] = token;
    }
    return config;
  });
export default api;

