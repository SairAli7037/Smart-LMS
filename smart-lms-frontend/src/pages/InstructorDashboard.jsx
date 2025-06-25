
import React, { useEffect, useState } from 'react';
import api from "../utils/api";
import InstructorAnalytics from "./InstructorPage/InstructorAnalytics";
import { Link } from 'react-router-dom';

const InstructorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/courses/instructor/dashboard/');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Failed to fetch instructor dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.get('/quizzes/my-quizzes/');
        setQuizzes(response.data);
      } catch (error) {
        console.error('Failed to fetch quizzes', error);
      }
    };
    fetchQuizzes();
  }, []);

  const getEmbedUrl = (url) => {
    const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-10">👨‍🏫 Instructor Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-md border">
            <h3 className="text-xl font-semibold mb-4">Overview</h3>
            <p>Total Courses: <span className="font-medium">{dashboardData.total_courses}</span></p>
            <p>Active Learners: <span className="font-medium">{dashboardData.total_students}</span></p>
            <p>Recent Submissions: <span className="font-medium">{dashboardData.recent_submissions.length}</span></p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border">
            <h3 className="text-xl font-semibold mb-4">Notifications</h3>
            
              {dashboardData.notifications.length===0 ? (
                <p className="text-sm text-gray-500">No new notifications</p>
              ): (
                <ul className="text-sm text-gray-700 space-y-2">
                   {dashboardData.notifications.slice(0, 3).map((note, idx) => (
                <li key={idx}>🔔 {note}</li>
              ))}
            </ul>
              )}
             
            {dashboardData.notifications.length > 2 && (
              <p className="text-xs text-gray-500 mt-2">Only showing latest 3</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border col-span-1 md:col-span-2 lg:col-span-3">
            <h3 className="text-xl font-semibold mb-4">📊 Student Analytics</h3>
            <InstructorAnalytics data={dashboardData.student_analytics} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border mb-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">📚 My Courses</h3>
            <div className="flex items-center space-x-3">
              <Link to="/instructor/add-course" className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700">Add Course</Link>
              <Link to="/instructor/my-courses" className="text-blue-600 hover:underline text-sm">View All</Link>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.courses.slice(0, 6).map((course, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded shadow hover:shadow-lg transform hover:-translate-y-1 hover:scale-[1.02] transition">
                <h4 className="font-semibold text-lg mb-1">{course.title}</h4>
                <p className="text-sm text-gray-600 mb-2">👥 {course.learners_count} Learners</p>
                {course.video_url && (
                  <div className="aspect-video">
                    <iframe
                      src={getEmbedUrl(course.video_url)}
                      title="Course Video"
                      allowFullScreen
                      className="w-full h-full rounded border"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-md border">
            <h3 className="text-xl font-semibold mb-4">📥 Recent Submissions</h3>
            <ul className="space-y-3">
              {dashboardData.recent_submissions.slice(0, 2).map((sub, idx) => (
                <li key={idx} className="bg-gray-50 p-3 rounded border">
                  <p className="text-sm font-medium">{sub.quiz}</p>
                  <p className="text-xs text-gray-500">By {sub.student_name} in {sub.course_title}</p>
                </li>
              ))}
            </ul>
            <Link to="/instructor/submissions" className="text-sm text-blue-600 hover:underline mt-2 inline-block">View All</Link>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold">📝 My Quizzes</h3>
              <div className="flex items-center space-x-3">
                <Link to="/instructor/create-quiz" className="text-sm bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700">Create Quiz</Link>
                <Link to="/instructor/my-quizzes" className="text-sm text-blue-600 hover:underline">View All</Link>
              </div>
            </div>
            {quizzes.length === 0 ? (
              <p className="text-gray-500 text-sm">No quizzes created.</p>
            ) : (
              <ul className="space-y-2">
                {quizzes.slice(0, 4).map((quiz) => (
                  <li key={quiz.id} className="text-sm text-gray-700 flex items-center justify-between">
                    <span>📌 {quiz.title}</span>
                  
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;






