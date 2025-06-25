
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import Navbar from "../../components/Navbar";

const StartCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [assignedQuiz, setAssignedQuiz] = useState(null);

  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/courses/${id}/detail/`);
        setCourse(response.data);
      } catch (error) {
        console.error("Error loading course", error);
      }
    };
    fetchCourse();
  }, [id]);

  // Fetch progress and lessons
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await api.get(`/courses/course/${id}/progress/`);
        const lessonsWithProgress = response.data.progress;
        setLessons(lessonsWithProgress);
        if (lessonsWithProgress.length > 0) {
          setCurrentVideo(lessonsWithProgress[0]);
        }
      } catch (error) {
        console.error("Error fetching progress", error);
      }
    };
    fetchProgress();
  }, [id]);

  // Fetch assigned quiz
  useEffect(() => {
    const fetchAssignedQuiz = async () => {
      try {
        const response = await api.get(`/quizzes/assigned/${id}/`);
        if (response.data.quiz_id) {
          setAssignedQuiz(response.data);
        }
      } catch (error) {
        console.error("Error fetching assigned quiz", error);
      }
    };
    fetchAssignedQuiz();
  }, [id]);

  const markLessonComplete = async (lessonId) => {
    try {
      await api.post(`/courses/lesson/${lessonId}/complete/`);
      setLessons(prev =>
        prev.map(lesson =>
          lesson.lesson_id === lessonId ? { ...lesson, completed: true } : lesson
        )
      );
    } catch (error) {
      console.error("Failed to mark lesson as completed", error);
    }
  };

  const handleLessonClick = (lesson) => {
    setCurrentVideo(lesson);
  };

  const getEmbedUrl = (url) => {
    const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  if (!course) return <div className="min-h-screen bg-gray-100">Loading...</div>;

  const completedCount = lessons.filter(lesson => lesson.completed).length;
  const progressPercentage = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      
      <div className="max-w-6xl mx-auto px-4 pt-24">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{course.title}</h1>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <p className="text-sm text-gray-500 mb-6">Instructor: {course.instructor}</p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-1 text-sm text-gray-700">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Show Take Quiz button */}
        {progressPercentage === 100 && assignedQuiz?.quiz_id && (
          <div className="mb-6 text-right">
            <button
              onClick={() => navigate(`/take-quiz/${assignedQuiz.quiz_id}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Take Quiz
            </button>
          </div>
        )}

        {/* Video Player */}
        {currentVideo?.video_url && (
          <div className="aspect-video mb-8 relative">
            <iframe
              src={getEmbedUrl(currentVideo.video_url)}
              title={currentVideo.title}
              allowFullScreen
              className="w-full h-full rounded border"
            />
            {!currentVideo.completed && (
              <div className="absolute bottom-0 right-0 m-4">
                <button
                  onClick={() => markLessonComplete(currentVideo.lesson_id)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Mark as Completed
                </button>
              </div>
            )}
          </div>
        )}

        {/* Lessons List */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Lessons</h2>
          <ul className="space-y-2">
            {lessons.map((lesson, index) => (
              <li
                key={lesson.lesson_id}
                onClick={() => handleLessonClick(lesson)}
                className={`p-3 rounded cursor-pointer flex justify-between items-center transition ${
                  currentVideo?.lesson_id === lesson.lesson_id
                    ? "bg-blue-100 text-blue-800 font-semibold"
                    : "hover:bg-gray-100"
                }`}
              >
                <span>{index + 1}. {lesson.title}</span>
                {lesson.completed && <span className="text-green-600 text-sm">✓ Completed</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StartCourse;
