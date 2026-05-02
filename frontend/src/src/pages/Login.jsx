// frontend/src/pages/Login.jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const Login = () => {
  // Toggle between Login and Signup modes
  const [isLoginMode, setIsLoginMode] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  // Hooks for context and navigation
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      let response;
      if (isLoginMode) {
        // Call Login API
        response = await API.post('/auth/login', {
          email: formData.email,
          password: formData.password,
        });
      } else {
        // Call Signup API
        response = await API.post('/auth/signup', formData);
      }

      // Save user to context and local storage
      login(response.data);
      
      // Redirect to the dashboard
      navigate('/dashboard');
    } catch (err) {
      // Set error message from backend or generic message
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">
          {isLoginMode ? 'Welcome Back' : 'Create an Account'}
        </h2>

        {/* Display Error Message */}
        {error && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Only show Name field if in Signup mode */}
          {!isLoginMode && (
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLoginMode}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 font-semibold text-white transition duration-200 bg-blue-600 rounded hover:bg-blue-700"
          >
            {isLoginMode ? 'Login' : 'Sign Up'}
          </button>
        </form>

        {/* Toggle Mode Button */}
        <p className="mt-4 text-sm text-center text-gray-600">
          {isLoginMode ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError(''); // Clear errors when switching modes
            }}
            className="font-medium text-blue-600 hover:underline focus:outline-none"
          >
            {isLoginMode ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;