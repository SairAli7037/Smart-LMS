import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import Navbar from '../../components/Navbar';

const SubmissionDetailPage = () => {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/courses/instructor/submissions/${id}/`);
        setSubmission(response.data);
      } catch (error) {
        console.error('Error fetching submission detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        Loading...
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        Submission not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">📄 Submission Details</h1>
          <div className="space-y-4 text-gray-700">
            <p><span className="font-semibold">📘 Quiz:</span> {submission.quiz_title}</p>
            <p><span className="font-semibold">👤 Student:</span> {submission.student_name}</p>
            <p><span className="font-semibold">🎓 Course:</span> {submission.course_title}</p>
            <p><span className="font-semibold">🧮 Score:</span> {submission.score}</p>
            <p><span className="font-semibold">📅 Submitted At:</span> {new Date(submission.submitted_at).toLocaleString()}</p>
          </div>

          <div className="mt-8">
            <Link
              to="/instructor/submissions"
              className="inline-block text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              ← Back to Submissions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetailPage;
