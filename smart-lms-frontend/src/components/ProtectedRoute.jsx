import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../utils/api";

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/user/");
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div className="text-center mt-10">Loading...</div>; // or a spinner
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
