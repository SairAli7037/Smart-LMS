import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import Navbar from '../../components/Navbar';

const QuizDetails = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const response = await api.get(`/quizzes/${quizId}/details/`);
        setQuiz(response.data);
      } catch (error) {
        console.error('Error fetching quiz details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizDetails();
  }, [quizId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">Loading...</div>;
  }

  if (!quiz) {
    return <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">Quiz not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
    
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-white rounded-xl shadow p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{quiz.title}</h1>
          <p className="text-gray-700 text-base mb-2">{quiz.description}</p>
          {/* <p className="text-sm text-gray-500 mb-6">
            📅 Created At: {new Date(quiz.created_at).toLocaleDateString()}
          </p> */}

          <div className="border-t pt-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">🧠 Questions</h2>
            {quiz.questions.length === 0 ? (
              <p className="text-gray-500 italic">No questions added yet.</p>
            ) : (
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {quiz.questions.map((q, index) => (
                  <li key={index}>{q.question_text}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t pt-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">🎓 Assigned Students</h2>
            {quiz.assigned_students.length === 0 ? (
              <p className="text-gray-500 italic">No students assigned yet.</p>
            ) : (
              <ul className="space-y-3">
                {quiz.assigned_students.map((student) => (
                  <li
                    key={student.id}
                    className="p-3 bg-gray-50 border rounded-md shadow-sm text-sm text-gray-800"
                  >
                    <p><span className="font-medium">Name:</span> {student.name}</p>
                    <p><span className="font-medium">Email:</span> {student.email}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-8">
            <Link
              to="/instructor/my-quizzes"
              className="inline-block text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              ← Back to My Quizzes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizDetails;
