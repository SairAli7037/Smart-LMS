import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/api";

function TakeQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes = 600 seconds

  // Fetch quiz questions
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quizzes/${quizId}/questions/`);
        setQuestions(res.data);
      } catch (err) {
        console.error("Failed to fetch quiz questions", err);
      }
    };
    fetchQuiz();
  }, [quizId]);

  // Countdown timer logic
  useEffect(() => {
    if (submitted) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSelect = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    const unanswered = questions.filter((q) => !(q.id in answers));
    if (unanswered.length > 0) {
      alert(`Please answer all questions before submitting. ${unanswered.length} question(s) left.`);
      return;
  }

  try {
    console.log(answers)
    const res = await api.post(`/quizzes/${quizId}/submit/`, { answers });
    const { score, total } = res.data;
    setResult({ score, total });
    setSubmitted(true);
  } catch (err) {
    console.error("Quiz submission failed", err);
    alert("Submission failed.");
  }
};



 if (submitted && result) {
  return (
    <div className="p-6 text-center">
      <h2 className="text-3xl font-bold text-green-600 mb-4">Quiz Submitted!</h2>
      <p className="text-lg mb-2">Your Score: <strong>{result.score} / {result.total}</strong></p>
      <button
        onClick={() => navigate("/student-dashboard")}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Back to Dashboard
      </button>
    </div>
  );
}


  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Take Quiz</h2>
        <div className="text-lg font-mono bg-yellow-100 text-yellow-700 px-3 py-1 rounded">
          Time Left: {formatTime(timeLeft)}
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {questions.length === 0 ? (
          <p>Loading questions...</p>
        ) : (
          <div className="space-y-6">
            {questions.map((q, index) => (
              <div key={q.id} className="bg-white p-4 rounded shadow">
                <p className="font-semibold mb-2">
                  {index + 1}. {q.question_text}
                </p>
                <div className="space-y-2">
                  {["A", "B", "C", "D"].map((key, idx) => (
                    <label key={key} className="block">
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={key}
                        checked={answers[q.id] === key}
                        onChange={() => handleSelect(q.id, key)}
                        className="mr-2"
                      />
                      {q.options[idx]}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <button
          type="submit"
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit Quiz
        </button>
      </form>
    </div>
  );
}

export default TakeQuiz;
