import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const useDemoLogin = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [loadingRole, setLoadingRole] = useState(null);
  const [error, setError] = useState(null);

  const handleDemoLogin = async (role) => {
    setLoadingRole(role);
    setError(null);

    try {
      // 1. Ensure CSRF token is available
      
        await api.get("/get-csrf-token/");
        

      // 2. Prepare demo credentials
      const credentials = {
        instructor: { username: "demo_instructor", password: "demo1234" },
        student: { username: "demo_student", password: "demo1234" },
      };

      // 3. Attempt login
      const response = await api.post("/login/", credentials[role]);
      
      if (response.data?.message !== "Login successful") {
        throw new Error(response.data?.error || "Unexpected login response");
      }

      // 4. Fetch user data
      const userInfo = await api.get("/user/");
      setUser(userInfo.data);

      // 5. Redirect based on role
      navigate(userInfo.data.role === "student" 
        ? "/student-dashboard" 
        : "/instructor-dashboard"
      );

    } catch (error) {
      console.error("Demo login error:", error);
      
      // Handle specific error cases
      if (error.response?.status === 403) {
        setError("Session expired. Please try again.");
      } else {
        setError(
          error.response?.data?.detail || 
          error.message || 
          "Demo login failed. Please try again."
        );
      }
      
      // Return the error for component handling
      return { error: error.message };
    } finally {
      setLoadingRole(null);
    }
  };

  return { 
    handleDemoLogin, 
    loadingRole,
    error,
    clearError: () => setError(null) 
  };
};

export default useDemoLogin;