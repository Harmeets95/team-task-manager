// frontend/src/pages/CreateTask.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const CreateTask = () => {
  const navigate = useNavigate();

  // 1. State for our form inputs
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    assignedTo: '',
    deadline: '',
  });

  // 2. State for dropdown data and UI feedback
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 3. Fetch Projects and Users when the component loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both endpoints simultaneously
        const [projectsRes, usersRes] = await Promise.all([
          API.get('/projects'),
          API.get('/users'),
        ]);
        
        setProjects(projectsRes.data);
        setUsers(usersRes.data);
        
        // Set default dropdown values if data exists
        if (projectsRes.data.length > 0) {
          setFormData((prev) => ({ ...prev, project: projectsRes.data[0]._id }));
        }
        if (usersRes.data.length > 0) {
          setFormData((prev) => ({ ...prev, assignedTo: usersRes.data[0]._id }));
        }
      } catch (err) {
        setError('Failed to load required data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 4. Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 5. Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await API.post('/tasks', formData);
      // On success, navigate back to the main tasks list
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-xl text-center text-gray-600">Loading form...</div>;
  }

  return (
    <div className="max-w-2xl p-8 mx-auto bg-white border border-gray-100 rounded-lg shadow-sm">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Create New Task</h1>

      {error && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Task Title */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Task Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Update Landing Page UI"
          />
        </div>

        {/* Task Description */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="3"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Details about the task..."
          />
        </div>

        {/* Project Selection */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Select Project</label>
          <select
            name="project"
            value={formData.project}
            onChange={handleChange}
            required
            className="w-full p-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {projects.map((proj) => (
              <option key={proj._id} value={proj._id}>
                {proj.name}
              </option>
            ))}
          </select>
        </div>

        {/* Assign To Selection */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Assign To</label>
          <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            required
            className="w-full p-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        </div>

        {/* Deadline */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Deadline</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4 space-x-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="px-4 py-2 font-medium text-gray-700 transition bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || projects.length === 0}
            className="px-4 py-2 font-medium text-white transition bg-blue-600 rounded disabled:bg-blue-400 hover:bg-blue-700"
          >
            {submitting ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;