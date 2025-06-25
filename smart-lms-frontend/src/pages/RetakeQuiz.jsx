import api from '../utils/api';// assuming Axios instance
import { useNavigate } from 'react-router-dom';

const RetakeQuizButton = ({ quizId }) => {
  const navigate = useNavigate();

  const handleRetake = async () => {
    try {
      const response = await api.post(`/retake-quiz/${quizId}/`);
      if (response.data.success) {
        const assignedQuizId = response.data.assigned_quiz_id;
        navigate(`/quiz/${assignedQuizId}/start`);
      }
    } catch (err) {
      console.error("Retake failed", err);
    }
  };

  return (
    <button
      onClick={handleRetake}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Retake Quiz
    </button>
  );
};

export default RetakeQuizButton;
