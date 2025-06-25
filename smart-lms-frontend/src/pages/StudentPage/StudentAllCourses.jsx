
import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import Navbar from "../../components/Navbar";
import {FaLock} from "react-icons/fa";
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/solid';

const StudentAllCourses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses/all/");
        setCourses(response.data.courses);
      } catch (error) {
        console.error("Failed to fetch courses", error);
      }
    };
    fetchCourses();
  }, []);

  const getEmbedUrl = (url) => {
    const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  const handleEnroll = async (courseId) => {
    try {
      await api.post(`/courses/${courseId}/enroll/`);
      setCourses((prev) =>
        prev.map((course) =>
          course.id === courseId ? { ...course, is_enrolled: true } : course
        )
      );
    } catch (error) {
      console.error("Enrollment failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-12">
          All Available Courses
        </h1>

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
                  <div className="relative aspect-video mb-4 rounded overflow-hidden border border-gray-300 group">
                    <iframe
                      src={getEmbedUrl(course.video_url)}
                      title={course.title}
                      className="w-full h-full pointer-events-none"
                      allowFullScreen
                    />
                    {!course.is_enrolled && (
                      <div className="absolute inset-0 bg-opacity-30 flex justify-center items-center">
                        <div className="relative group">
                          <FaLock className="text-white text-3xl" />
                          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Enroll to unlock
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <p className="text-sm text-gray-500">
                  Instructor: <span className="font-medium">{course.instructor_name}</span>
                </p>
              </div>

              <button
                onClick={() => handleEnroll(course.id)}
                disabled={course.is_enrolled}
                className={`w-full py-2 mt-5 rounded-lg font-semibold transition text-white ${
                  course.is_enrolled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {course.is_enrolled ? "Enrolled" : "Enroll"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentAllCourses;
