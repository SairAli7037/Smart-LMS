import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Link } from 'react-router-dom';

const MyQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.get('/quizzes/my-quizzes/');
        setQuizzes(response.data);
      } catch (error) {
        console.error('Failed to fetch quizzes', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const handleDelete = async (quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    try {
      await api.delete(`/quizzes/${quizId}/delete/`);
      setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId));
    } catch (error) {
      console.error('Failed to delete quiz', error);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800">My Quizzes</h1>
          <Link
            to="/instructor/assign-quiz"
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-lg shadow transition"
          >
            Assign Quiz
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center">Loading quizzes...</p>
        ) : quizzes.length === 0 ? (
          <p className="text-center text-gray-500 text-lg mt-10">No quizzes created yet.</p>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition duration-300 border"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{quiz.title}</h3>
                <p className="text-sm text-gray-600 mb-1">{quiz.description}</p>
                <p className="text-sm text-gray-500">📝 Questions: {quiz.question_count}</p>
                <p className="text-sm text-gray-500 mb-3">🎓 Assigned to: {quiz.assigned_count} student(s)</p>

                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Link
                    to={`/quiz/${quiz.id}/details`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                  >
                    View Details
                  </Link>
              
                  <button
                    onClick={() => handleDelete(quiz.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyQuizzes;

