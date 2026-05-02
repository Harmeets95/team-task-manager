// frontend/src/pages/CreateProject.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const CreateProject = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    members: [], // Array to hold selected user IDs
  });
  
  // State for the user list and UI feedback
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch all users when the component loads
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await API.get('/users');
        setUsers(response.data);
      } catch (err) {
        setError('Failed to load users. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle standard text inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle checkbox changes for member selection
  const handleMemberChange = (userId) => {
    setFormData((prev) => {
      const isSelected = prev.members.includes(userId);
      if (isSelected) {
        // Remove user if already selected
        return { ...prev, members: prev.members.filter((id) => id !== userId) };
      } else {
        // Add user to array
        return { ...prev, members: [...prev.members, userId] };
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await API.post('/projects', formData);
      // Redirect back to the projects page on success
      navigate('/projects');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-xl text-center text-gray-600">Loading form...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Project</h1>

      {error && <div className="mb-4 p-3 text-red-700 bg-red-100 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Name */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Project Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Website Redesign"
          />
        </div>

        {/* Project Description */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the goals and details of this project..."
          />
        </div>

        {/* Member Selection (Checkboxes) */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Assign Team Members</label>
          <div className="max-h-48 overflow-y-auto border border-gray-300 rounded p-3 space-y-2">
            {users.length === 0 ? (
              <p className="text-sm text-gray-500">No users found.</p>
            ) : (
              users.map((user) => (
                <label key={user._id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.members.includes(user._id)}
                    onChange={() => handleMemberChange(user._id)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-gray-800 font-medium">{user.name}</span>
                  <span className="text-sm text-gray-500">({user.email})</span>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600 ml-auto">
                    {user.role}
                  </span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition disabled:bg-blue-400"
          >
            {submitting ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;