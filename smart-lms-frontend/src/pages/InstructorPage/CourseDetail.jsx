import React, { useEffect, useState } from "react";
import { useParams ,useNavigate } from "react-router-dom";
import api from "../../utils/api";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const response = await api.get(`/courses/${id}/detail/`);
        setCourse(response.data);
      } catch (error) {
        console.error("Failed to fetch course detail", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetail();
  }, [id]);

  const getEmbedUrl = (url) => {
    const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/courses/${id}/delete/`);
      alert("Course deleted successfully.");
      navigate("/instructor/my-courses");
    } catch (error) {
      console.error("Failed to delete course", error);
      alert("Failed to delete course.");
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-100 p-6">Loading...</div>;
  if (!course) return <div className="min-h-screen bg-gray-100 p-6">Course not found.</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto py-20 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{course.title}</h1>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
          >
            Delete Course
          </button>
        </div>

        <p className="text-gray-700 mb-4">{course.description}</p>
        <p className="text-sm text-gray-500 mb-6">
          👥 Learners Enrolled: {course.learners_count}
        </p>

        {course.video_url && (
          <div className="aspect-video mb-6">
            <iframe
              src={getEmbedUrl(course.video_url)}
              title="Course Video"
              allowFullScreen
              className="w-full h-full rounded-lg border"
            />
          </div>
        )}

        {/* Lessons Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">📘 Lessons</h2>
          {course.lessons?.length > 0 ? (
            <div className="space-y-4">
              {course.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="bg-white p-4 rounded-lg shadow flex justify-between items-center hover:shadow-md transition"
                >
                  <div>
                    <p className="font-medium text-gray-800">{index + 1}. {lesson.title}</p>
                    {lesson.duration && (
                      <p className="text-sm text-gray-500">⏱ Duration: {lesson.duration}</p>
                    )}
                  </div>
                  {lesson.video_url && (
                    <a
                      href={lesson.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      ▶ Watch
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No lessons added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
