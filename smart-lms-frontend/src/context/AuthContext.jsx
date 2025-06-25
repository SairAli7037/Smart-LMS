
import { createContext, useState, useEffect, useContext } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const isPublicRoute = ["/", "/login", "/register", "/about", "/services"].includes(location.pathname);

  useEffect(() => {
    if (isPublicRoute) {
      setLoading(false);
      return;
    }

    api.get("/user/")
      .then(res => {
        setUser(res.data);
      })
      .catch(err => {
        if (err.response?.status === 401) {
          setUser(null);
          navigate("/login");
        }
      })
      .finally(() => setLoading(false));
     }, [location.pathname]);

  const logoutUser = () => {
    api.post("/logout/")  // or your actual logout API
      .then(() => setUser(null))
      .catch(() => setUser(null));
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
