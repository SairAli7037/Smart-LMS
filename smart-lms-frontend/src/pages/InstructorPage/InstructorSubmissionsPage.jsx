import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const InstructorSubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await api.get('/courses/instructor/submissions/');
        setSubmissions(response.data.submissions);
      } catch (error) {
        console.error('Failed to fetch submissions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
     
      <div className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">📑 All Submissions</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading submissions...</p>
        ) : submissions.length === 0 ? (
          <p className="text-center text-gray-500">No submissions yet.</p>
        ) : (
          <ul className="space-y-4">
            {submissions.map((sub) => (
              <li
                key={sub.id}
                className="p-6 bg-white rounded-xl shadow hover:shadow-md transition duration-200"
              >
                <Link to={`/instructor/submissions/${sub.id}`} className="block">
                  <p className="text-lg font-semibold text-blue-600 hover:underline">{sub.quiz}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    👤 <span className="font-medium">{sub.student_name}</span> &nbsp;|&nbsp; 🎓{' '}
                    <span className="font-medium">{sub.course_title}</span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default InstructorSubmissionsPage;

