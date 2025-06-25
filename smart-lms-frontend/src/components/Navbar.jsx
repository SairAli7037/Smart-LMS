
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { useEffect,useState } from "react";
import SmartLMSLogo from  "../utils/images/SMART-LMS.png"

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <nav className="bg-[linear-gradient(to_right,_#11998E,_#38EF7D)]  text-white px-6 py-5 shadow-md flex justify-between items-center">
    
      <div className="text-xl font-bold">
        
        <Link to="/">
         <img src={SmartLMSLogo} className="h-14 w-auto object-contain transition-transform hover:scale-105"/>
        </Link>
      </div>

      <div className="flex gap-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/about" className="hover:underline">About Us</Link>
        <Link to="/services" className="hover:underline">Services</Link>

        {!user && (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}

        {user && user.role === "student" && (
          <>
            <Link to="/student-dashboard" className="hover:underline">Dashboard</Link>
            <button onClick={handleLogout} className="hover:underline">Logout</button>
          </>
        )}

        {user && user.role === "instructor" && (
          <>
            <Link to="/instructor-dashboard" className="hover:underline">Dashboard</Link>
            <button onClick={handleLogout} className="hover:underline">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
