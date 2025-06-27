import { Link ,useNavigate} from "react-router-dom";
import BackgroundImage from "../utils/images/bg3.jpeg"
import api from "../utils/api"; 
import useDemoLogin from "./useDemoLogin";
import { useContext , useState} from "react";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  
  const { handleDemoLogin, loadingRole, error, clearError } = useDemoLogin();
  const { user } = useContext(AuthContext);
  const [loaded, setLoaded] = useState(false);
  const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 01-8 8z"
    />
  </svg>
);


  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden p-50">
         {/* Background Image */}
             <img
                 src={BackgroundImage}
                 alt="Hero Background"
                 onLoad={() => setLoaded(true)}
                 className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 z-0 ${
                   loaded ? 'opacity-20' : 'opacity-0'
                 }`}
               />
           
            <div className="absolute inset-0 bg-black opacity-15 z-0"></div> 
            
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to <span className="text-blue-600">Smart LMS</span>
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Learn, Teach, and Assess – All in one platform.
          </p>
       { !user &&
            (<div className="space-x-4">
              <Link to="/register">
              <button className="bg-yellow-300 text-black font-semibold px-6 py-3 rounded-md hover:bg-yellow-400 transition">
                Get Started
              </button>
            </Link>
            <Link to="/login">
              <button className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-md hover:bg-gray-100 transition">
                Login
              </button>
            </Link>
          </div>)}
        </div>
      </section>
      

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Why Choose Smart LMS?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Create & Assign Quizzes", desc: "Build engaging quizzes and assign them to students." },
              { title: "Track Progress", desc: "Monitor student course and quiz progress in real-time." },
              { title: "Integrated Courses", desc: "Host videos, lessons, and documents for easy access." },
              { title: "AI Tutoring", desc: "Offer AI-powered help to boost learning outcomes." },
              { title: "Role-based Dashboards", desc: "Tailored interfaces for students and instructors." },
              { title: "Mobile Friendly", desc: "Fully responsive and works across all devices." },
            ].map((item, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     {/* Demo Section */}
      {/* { !user && 
        (<section className="bg-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-800">Try the Platform Instantly</h2>
          <p className="text-gray-700 mb-8">
            Experience Smart LMS from both perspectives — as a student and as an instructor.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
           <button
              onClick={() => handleDemoLogin("instructor")}
              disabled={loadingRole === "instructor"}
              className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 transition flex items-center justify-center min-w-[160px]"
            >
              {loadingRole === "instructor" ? (
                <span className="flex items-center gap-2">
                  <Spinner /> Logging in...
                </span>
              ) : (
                "Try as Instructor"
              )}
            </button>
            
            <button
              onClick={() => handleDemoLogin("student")}
              disabled={loadingRole === "student"}
              className="bg-gray-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-gray-700 transition flex items-center justify-center min-w-[160px]"
            >
              {loadingRole === "student" ? (
                <span className="flex items-center gap-2">
                  <Spinner /> Logging in...
                </span>
              ) : (
                "Try as Student"
              )}
         </button>

          </div>
        </div>
      </section>) */}

   
{/* Demo Section */}
{!user && (
  <section className="bg-blue-50 py-12 px-4 relative">
    {/* Error Message (shown at top of section) */}
    {error && (
      <div className="max-w-4xl mx-auto mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
        <div className="flex justify-between items-center">
          <p>{error}</p>
          <button 
            onClick={clearError}
            className="text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      </div>
    )}

    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-4 text-blue-800">Try the Platform Instantly</h2>
      <p className="text-gray-700 mb-8">
        Experience Smart LMS from both perspectives — as a student and as an instructor.
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center gap-6">
        <button
          onClick={() => handleDemoLogin("instructor")}
          disabled={loadingRole === "instructor"}
          className={`bg-blue-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 transition flex items-center justify-center min-w-[160px] ${
            loadingRole === "instructor" ? 'opacity-75' : ''
          }`}
        >
          {loadingRole === "instructor" ? (
            <span className="flex items-center gap-2">
              <Spinner /> Logging in...
            </span>
          ) : (
            "Try as Instructor"
          )}
        </button>
        
        <button
          onClick={() => handleDemoLogin("student")}
          disabled={loadingRole === "student"}
          className={`bg-gray-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-gray-700 transition flex items-center justify-center min-w-[160px] ${
            loadingRole === "student" ? 'opacity-75' : ''
          }`}
        >
          {loadingRole === "student" ? (
            <span className="flex items-center gap-2">
              <Spinner /> Logging in...
            </span>
          ) : (
            "Try as Student"
          )}
        </button>
      </div>
    </div>
  </section>
)}
      {/* Testimonials */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">What Our Users Say</h2>
          <div className="space-y-6">
            <blockquote className="italic text-gray-600">
              “Smart LMS transformed the way I teach. Managing courses and quizzes is so easy now.”
              <br />
              <span className="font-semibold text-gray-800">– Aditi, Instructor</span>
            </blockquote>
            <blockquote className="italic text-gray-600">
              “As a student, I love the clean dashboard and fast navigation. Everything I need is in one place.”
              <br />
              <span className="font-semibold text-gray-800">– Rohit, Learner</span>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Smart LMS. All rights reserved.</p>
          <div className="space-x-4 mt-2 md:mt-0">
            <Link to="/about" className="hover:text-yellow-300">About</Link>
            <Link to="/services" className="hover:text-yellow-300">Services</Link>
            <a href="#" className="hover:text-yellow-300">Privacy</a>
            <a href="#" className="hover:text-yellow-300">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
