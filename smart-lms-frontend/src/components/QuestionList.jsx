import { useEffect, useState } from "react";
import api from "../utils/api";

function QuestionList() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get("/list/");
        setQuestions(response.data.questions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  const handleDelete = async (questionId) => {
    try {
      const response = await api.delete(`/delete/${questionId}/`);
      console.log(response.data);
      setQuestions(questions.filter(q => q.id !== questionId));
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  return (
    <div>
      <h3>Your Questions</h3>
      <ul>
        {questions.map((question) => (
          <li key={question.id} >
            <strong>{question.question_text}</strong>
            <ul>
              <li>A. {question.option_a}</li>
              <li>B. {question.option_b}</li>
              <li>C. {question.option_c}</li>
              <li>D. {question.option_d}</li>
            </ul>
            <p>Correct Option: {question.correct_option}</p>
            <button onClick={() => handleDelete(question.id)}
                    className=" py-2 px-2 rounded-md text-white  bg-blue-600 hover:bg-blue-700 transition">
                    Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuestionList;
