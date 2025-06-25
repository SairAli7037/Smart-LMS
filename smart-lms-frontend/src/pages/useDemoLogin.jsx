// useDemoLogin.js
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const useDemoLogin = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [loadingRole, setLoadingRole] = useState(null); // NEW

  const handleDemoLogin = async (role) => {
    setLoadingRole(role); // Start loading

    try {
      
      await api.get("/get-csrf-token/");

      const credentials = {
        instructor: { username: "demo_instructor", password: "demo1234" },
        student: { username: "demo_student", password: "demo1234" },
      };

      const response = await api.post("/login/", credentials[role]);

      if (response.data.message === "Login successful") {
        const userInfo = await api.get("/user/");
        setUser(userInfo.data);

        const dashboard =
          userInfo.data.role === "student"
            ? "/student-dashboard"
            : "/instructor-dashboard";

        navigate(dashboard);
      } else {
        alert("Demo login failed. Unexpected response.");
      }
    } catch (error) {
      console.error("Demo login error:", error);
      alert("Demo login failed. Please try again.");
    } finally {
      setLoadingRole(null); // Stop loading
    }
  };

  return { handleDemoLogin, loadingRole }; // Return loadingRole too
};

export default useDemoLogin;
