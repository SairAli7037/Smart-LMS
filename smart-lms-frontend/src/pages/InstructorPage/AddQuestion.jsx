import { useState } from "react";
import api from "../../utils/api";

import InputField from "../../components/InputField";


function AddQuestion() {
  const [formData, setFormData] = useState({
    question_text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_option: "A", // Default to option A
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/add/", formData);
      console.log(response.data);
      // Clear form on successful submission
      setFormData({
        question_text: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_option: "A",
      });
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        type="text"
        name="question_text"
        value={formData.question_text}
        onChange={handleChange}
        placeholder="Enter your question"
        required
      />
      <InputField
        type="text"
        name="option_a"
        value={formData.option_a}
        onChange={handleChange}
        placeholder="Option A"
        required
      />
      <InputField
        type="text"
        name="option_b"
        value={formData.option_b}
        onChange={handleChange}
        placeholder="Option B"
        required
      />
      <InputField
        type="text"
        name="option_c"
        value={formData.option_c}
        onChange={handleChange}
        placeholder="Option C"
        required
      />
      <InputField
        type="text"
        name="option_d"
        value={formData.option_d}
        onChange={handleChange}
        placeholder="Option D"
        required
      />
      
      <select className="m-4"
        
        name="correct_option"
        value={formData.correct_option}
        onChange={handleChange}
        required
      >
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="D">D</option>
      </select>
      <button type="submit" 
            className="m-2 py-2 px-2 rounded-md text-white  bg-blue-600 hover:bg-blue-700 transition">
            Add Question
        </button>
       
    </form>
  );
}

export default AddQuestion;
