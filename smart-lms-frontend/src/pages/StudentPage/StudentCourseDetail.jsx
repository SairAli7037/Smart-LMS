// src/pages/CourseDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";

const StudentCourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      const res = await api.get(`/courses/${courseId}/detail/`);
      setCourse(res.data);
    };
    fetchCourse();
  }, [courseId]);

  const getEmbedUrl = (url) => {
    const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  if (!course) return <p>Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">{course.title}</h1>
      <p className="text-gray-600 mb-8">{course.description}</p>

      <div className="space-y-6">
        {course.lessons.map((lesson, index) => (
          <div key={lesson.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">{lesson.title}</h2>
            <div className="aspect-video relative">
              <iframe
                src={getEmbedUrl(lesson.video_url)}
                className="w-full h-full rounded border"
                title={lesson.title}
                allowFullScreen
              />
              {/* Lock overlay comes in Step 3 */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentCourseDetail;
