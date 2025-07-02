import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";


const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading,setLoading]= useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses/instructor/dashboard/");
        setCourses(response.data.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally{
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const getEmbedUrl = (url) => {
    const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
    
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800">My Courses</h1>
        </div>
       
       {loading ? (
        <p className="text-gray-500 text-center">Loading Courses...</p>
       ) : courses.length === 0 ? (
          <p className="text-gray-600 text-center mt-20 text-lg">You haven't added any courses yet.</p>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
              >
                <div className="p-5">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">{course.title}</h2>

                  {course.video_url && (
                    <div className="aspect-video mb-4 overflow-hidden rounded-lg border">
                      <iframe
                        src={getEmbedUrl(course.video_url)}
                        title={course.title}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  )}

                  <p className="text-sm text-gray-500 mb-4">
                    👥 {course.learners_count} Learners
                  </p>

                  <Link
                    to={`/instructor/courses/${course.id}`}
                    className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                  >
                    View Course
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
       
      </div>
    </div>
  );
};

export default MyCourses;


