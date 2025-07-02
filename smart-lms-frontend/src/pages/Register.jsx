import { useState ,useEffect} from "react";
import api from "../utils/api";  
import { ensureCSRF } from "../utils/api";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(null);
  const [csrfReady, setCsrfReady] = useState(false);



  useEffect(() => {
    ensureCSRF();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setSuccess(null);

    try {

      const response = await api.post("/register/", formData);
      
      if (response.status === 201) {
        console.log("Registration successful:", response.data);
        setMessage(response.data.message || "Registration successful!");
        setSuccess(true);
        setFormData({ 
          username: '', 
          email: '', 
          password: '', 
          role: 'student' 
        });
        
        
        setTimeout(() => navigate("/login"), 2000);
      } else {
        throw new Error(response.data.error || 'Registration failed');
      }
    } catch (error) {
      console.error("Registration error:", error);
      
      if (error.response?.status === 403) {
        setCsrfReady(false);
        setMessage("Session expired. Please try again.");
      } else {
        setMessage(
          error.response?.data?.error || 
          error.message || 
          "Registration failed. Please try again."
        );
      }
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Register</h2>
        {message && <div className="text-green-500 text-center mb-4">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            required
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          >
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
          <Button text={loading ? "Registering..." : "Register"} type="submit" className="mt-4" />
        </form>
        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
