import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Link } from 'react-router-dom';

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get('/my-questions/');
        setQuestions(response.data);
      } catch (error) {
        console.error('Failed to fetch questions', error);
      }
    };
    fetchQuestions();
  }, []);

  const handleCheckboxChange = (questionId) => {
    setSelectedQuestions((prevSelected) =>
      prevSelected.includes(questionId)
        ? prevSelected.filter((id) => id !== questionId)
        : [...prevSelected, questionId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/quizzes/create-quiz/', {
        title,
        description,
        question_ids: selectedQuestions,
      });
      setMessage('Quiz created successfully!');
      setTitle('');
      setDescription('');
      setSelectedQuestions([]);
    } catch (error) {
      console.error(error);
      setMessage('Failed to create quiz.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
     
      <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded shadow">
        <h2 className="text-2xl text-blue-600 font-semibold mb-4">Create New Quiz</h2>
        {message && <div className="mb-4 text-blue-600">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Quiz Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              rows={4}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Select Questions</label>
            <div className="max-h-64 overflow-y-auto border rounded p-4 bg-gray-50">
              {questions.length === 0 ? (
                <p>No questions available.</p>
              ) : (
                questions.map((q) => (
                  <div key={q.id} className="mb-2">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        checked={selectedQuestions.includes(q.id)}
                        onChange={() => handleCheckboxChange(q.id)}
                        className="mt-1 mr-2"
                      />
                      <span>{q.question_text}</span>
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Create Quiz
          </button>
        
        </form>
        <div className='mt-4'>
           <Link
                  to="/instructor/add-question"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 "
                >
                  + Add Question
           </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
