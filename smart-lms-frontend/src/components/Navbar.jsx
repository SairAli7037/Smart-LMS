
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SmartLMSLogo from  "../utils/images/SMART-LMS.png"

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <nav className="bg-[linear-gradient(to_right,_#11998E,_#38EF7D)] text-white px-4 sm:px-6 py-3 shadow-md">
      <div className="flex justify-between items-center">
        
       <div className="text-xl font-bold">
          <Link to="/">
            <img 
              src={SmartLMSLogo} 
              className="h-10 sm:h-12 w-auto object-contain transition-transform hover:scale-105" 
              alt="Smart LMS Logo"
            />
          </Link>
      </div>

      <div className="hidden md:flex gap-4">
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
      <button 
      className="md:hidden p-2 rounded-md focus:outline-none"
      onClick={() => document.getElementById('mobile-menu').classList.toggle('hidden')}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>

  {/* Mobile Navigation */}
  <div id="mobile-menu" className="hidden md:hidden pt-2 pb-4 space-y-2">
    <Link to="/" className="block px-3 py-2 hover:bg-white/10 rounded">Home</Link>
    <Link to="/about" className="block px-3 py-2 hover:bg-white/10 rounded">About Us</Link>
    <Link to="/services" className="block px-3 py-2 hover:bg-white/10 rounded">Services</Link>

    {!user && (
      <>
        <Link to="/login" className="block px-3 py-2 hover:bg-white/10 rounded">Login</Link>
        <Link to="/register" className="block px-3 py-2 hover:bg-white/10 rounded">Register</Link>
      </>
    )}

    {user && user.role === "student" && (
      <>
        <Link to="/student-dashboard" className="block px-3 py-2 hover:bg-white/10 rounded">Dashboard</Link>
        <button onClick={handleLogout} className="block w-full text-left px-3 py-2 hover:bg-white/10 rounded">Logout</button>
      </>
    )}

    {user && user.role === "instructor" && (
      <>
        <Link to="/instructor-dashboard" className="block px-3 py-2 hover:bg-white/10 rounded">Dashboard</Link>
        <button onClick={handleLogout} className="block w-full text-left px-3 py-2 hover:bg-white/10 rounded">Logout</button>
      </>
    )}
  </div>
    </nav>
  );
};

export default Navbar;
