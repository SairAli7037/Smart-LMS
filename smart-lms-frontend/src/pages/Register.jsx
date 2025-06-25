import { useState ,useEffect} from "react";
import api from "../utils/api";  
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

  useEffect(() => {
    api.get("/get-csrf-token/").then(() => {
      console.log("CSRF token set");
    });
  }, []);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess(null);
    
    try {

      const response = await api.post("/register/", formData); // API call using the base URL
      if(response.status==201){
        console.log("Registration successful:", response.data.message);
        setMessage(response.data.message);
        console.log(message)
        setSuccess(true);
        setFormData({ username: '', email: '', password: '', role: '' });
        // navigate("/login"); // Redirect to login after successful registration
      }
      else{
        setMessage(response.data.error || 'Registration failed');
        console.log(message)
        setSuccess(false);
      }
    
    } catch (error) {
      console.error("Error during registration:", error);
      setSuccess(false) ;
      setMessage("Registration failed! Please Try Again")
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
