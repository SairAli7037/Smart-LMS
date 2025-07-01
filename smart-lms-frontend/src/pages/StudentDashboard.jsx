
import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import { FaPlay, FaBook, FaRobot, FaLock } from "react-icons/fa";

function StudentDashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/courses/student/dashboard/");
        setData(res.data);
      } catch (err) {
        console.error("Failed to load student dashboard", err);
      }
    };
    fetchDashboard();
  }, []);

  const getEmbedUrl = (url) => {
    const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };
 
  if (!data) {
    return(
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600 text-lg">Loading dashboard...</p>
      </div>
    );
  }
 
  return (
    <div className="bg-gray-50 min-h-screen">
      
    
      {/* Hero */}
      <div className="bg-gray-100 text-gray-900  py-16 text-center">
        <h1 className="text-4xl font-bold mb-2">Welcome Back!  {data.user_details[0].student}</h1>
        <p className="text-lg">Here's a quick glance at your learning journey.</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">

        {/* Overview */}
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
           
          </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded shadow flex flex-col items-center text-center">
            <FaBook className="text-3xl text-blue-600 mb-3" />
            <h3 className="font-semibold text-lg">Courses Enrolled</h3>
            <p className="text-2xl font-bold text-blue-700">{data.enrolled_courses.length}</p>
          </div>
          <div className="bg-white p-6 rounded shadow flex flex-col items-center text-center">
            <FaPlay className="text-3xl text-green-600 mb-3" />
            <h3 className="font-semibold text-lg">Upcoming Classes</h3>
            <p className="text-2xl font-bold text-green-700">{data.upcoming_classes.length}</p>
          </div>
          <div className="bg-white p-6 rounded shadow flex flex-col items-center text-center">
            <span className="text-3xl mb-3">📅</span>
            <h3 className="font-semibold text-lg">Last Activity</h3>
            {data.last_activity.activity ? (
              <>
                  <p className="text-sm text-gray-600">{data.last_activity.activity.title}</p>
                  <p className="text-xs text-gray-500">{new Date(data.last_activity.activity.submitted_at).toLocaleString()}</p>  
              </>
            ):(
              <p className="text-sm text-gray-650 text-red-400">No activity yet</p>
            )}
           
          </div>
        </div>

        {/* My Courses */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
            <Link to="/student/my-courses" className="text-blue-600 hover:underline text-sm">View All</Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.enrolled_courses.slice(0, 3).map((course, index) => (
              <div key={index} className="bg-white rounded shadow hover:shadow-lg p-4 transition">
                <h3 className="font-semibold text-lg text-gray-700">{course.title}</h3>
                <p className="text-sm text-gray-600">{course.description}</p>
                {course.video_url && (
                  <div className="aspect-video mt-3 rounded overflow-hidden">
                    <iframe
                      src={getEmbedUrl(course.video_url)}
                      title={course.title}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* All Courses */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl font-bold text-gray-800">All Courses</h2>
            <Link to="/student/all-courses" className="text-blue-600 hover:underline text-sm">View All</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {data.all_courses.slice(0, 6).map((course, index) => (
              <div key={index} className="bg-white rounded shadow hover:shadow-lg p-4 transition relative">
                <h3 className="font-semibold text-lg text-gray-700">{course.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                {course.video_url && (
                  <div className="aspect-video mt-3 rounded overflow-hidden relative">
                    <iframe
                      src={getEmbedUrl(course.video_url)}
                      title={course.title}
                      className="w-full h-full pointer-events-none"
                      allowFullScreen
                    />
                    {!course.is_enrolled && (
                      <div className="relative inset-0  flex items-center justify-center">
                        <FaLock className="text-white text-3xl" />
                        
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Quizzes */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Assigned Quizzes</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {data.assigned_quizzes.map((quiz, index) => (
              <div key={index} className="bg-white rounded shadow p-4">
                <h3 className="font-semibold text-lg">{quiz.title}</h3>
                <p className="text-sm text-gray-600">Assigned: {new Date(quiz.assigned_at).toLocaleDateString()}</p>
                <p className="text-sm">Status: {quiz.is_completed ? "Completed" : "Pending"}</p>
                {/* <button
                  onClick={() => navigate(`/take-quiz/${quiz.quiz_id}`)}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  {quiz.is_completed ? "Retake Quiz" : "Start Quiz"}
                </button> */}
              </div>
            ))}
          </div>
        </div>

        {/* AI Tutor Assistant */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-6 shadow-lg flex justify-between items-center flex-wrap">
          <div>
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><FaRobot /> AI Tutor Assistant</h2>
            <p className="text-sm">Need help? Ask the AI assistant for help with concepts or quizzes.</p>
          </div>
          <Link to="/student/ai-launch">
          <button className="mt-3 md:mt-0 px-5 py-2 bg-white text-green-700 rounded shadow hover:bg-gray-100">
            Launch AI Tutor
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;




