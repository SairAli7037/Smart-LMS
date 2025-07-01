import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading,setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await api.get("/courses/my/");
        setCourses(response.data.courses);
      } catch (error) {
        console.error("Failed to fetch enrolled courses", error);
      } finally{
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, []);

  const getEmbedUrl = (url) => {
    const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-10">My Enrolled Courses</h1>

        {loading ? (
          <p className="text-gray-500 text-center">Loading Courses...</p>
        ) : courses.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">You have not enrolled in any courses yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition duration-300 ease-in-out p-5 flex flex-col justify-between"
              >
                <div>
                  
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">{course.title}</h2>
                  <p className="text-gray-600 mb-3">{course.description}</p>
                  {course.video_url && (
                    <div className="aspect-video mb-4 rounded overflow-hidden border border-gray-300">
                      <iframe
                        src={getEmbedUrl(course.video_url)}
                        title={course.title}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  )}
                  <p className="text-sm text-gray-500">Instructor: <span className="font-medium">{course.instructor_name}</span></p>
                </div>
                <button
                  onClick={() => navigate(`/course/${course.id}/player`)}
                  className="mt-5 bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Start Course
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCourses;
