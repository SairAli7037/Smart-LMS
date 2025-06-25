import { useEffect, useState } from "react";
import api from "../../utils/api";

function AssignQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch instructor's quizzes
    api.get("/quizzes/my-quizzes/")
      .then(res => setQuizzes(res.data))
      .catch(console.error);

    // Fetch instructor's courses
    api.get("/courses/instructor/my-courses/")
      .then(res => setCourses(res.data))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedQuiz || !selectedCourse) {
      setMessage("Please select both a quiz and a course.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/quizzes/assign-to-course/", {
        quiz_id: selectedQuiz,
        course_id: selectedCourse
      });

      setMessage("Quiz successfully assigned to all enrolled students in the course.");
      setSelectedQuiz("");
      setSelectedCourse("");
    } catch (err) {
      console.error("Failed to assign quiz", err);
      setMessage("Error assigning quiz.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-xl max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-purple-700 mb-4">Assign Quiz to Course</h2>

      {message && <div className="text-center text-red-500 mb-4">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <label className="block font-medium mb-1">Select Quiz</label>
          <select
            value={selectedQuiz}
            onChange={(e) => setSelectedQuiz(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Select Quiz --</option>
            {quizzes.map((quiz) => (
              <option key={quiz.id} value={quiz.id}>{quiz.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Select Course</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Select Course --</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          disabled={loading}
        >
          {loading ? "Assigning..." : "Assign Quiz"}
        </button>
      </form>
    </div>
  );
}

export default AssignQuiz;

