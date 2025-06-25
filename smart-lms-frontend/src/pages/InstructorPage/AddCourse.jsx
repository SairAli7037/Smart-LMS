import React, { useState } from 'react';
import api from '../../utils/api';

const AddCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lessons, setLessons] = useState([{ title: '', video_url: '', order: 1 }]);
  const [message, setMessage] = useState('');

  const handleLessonChange = (index, field, value) => {
    const updatedLessons = [...lessons];
    updatedLessons[index][field] = value;
    setLessons(updatedLessons);
  };

  const addLesson = () => {
    setLessons([...lessons, { title: '', video_url: '', order: lessons.length + 1 }]);
  };

  const removeLesson = (index) => {
    setLessons(lessons.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/courses/add/', {
        title,
        description,
        lessons,
      });
      setMessage('Course added successfully!');
      setTitle('');
      setDescription('');
      setLessons([{ title: '', video_url: '', order: 1 }]);
    } catch (error) {
      console.error(error);
      setMessage('Failed to add course.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
     
      <div className="max-w-3xl mx-auto  bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Add New Course</h2>
        {message && <div className="mb-4 text-blue-600">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">Course Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              rows={4}
              required
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Lessons</h3>
            {lessons.map((lesson, index) => (
              <div key={index} className="mb-4 border p-4 rounded bg-gray-50">
                <div className="mb-2">
                  <label className="block text-sm mb-1">Lesson Title</label>
                  <input
                    type="text"
                    value={lesson.title}
                    onChange={(e) => handleLessonChange(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm mb-1">Video URL</label>
                  <input
                    type="url"
                    value={lesson.video_url}
                    onChange={(e) => handleLessonChange(index, 'video_url', e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm mb-1">Order</label>
                  <input
                    type="number"
                    value={lesson.order}
                    onChange={(e) => handleLessonChange(index, 'order', e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                {lessons.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLesson(index)}
                    className="text-red-600 mt-2 text-sm"
                  >
                    Remove Lesson
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addLesson}
              className="bg-gray-200 text-sm px-4 py-2 rounded hover:bg-gray-300"
            >
              + Add Another Lesson
            </button>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Add Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;

