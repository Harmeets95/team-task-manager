// frontend/src/pages/Dashboard.jsx
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  
  // State to hold our tasks, loading status, and any errors
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch tasks when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await API.get('/tasks');
        setTasks(response.data);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Calculate statistics from the fetched tasks
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === 'Completed').length;
  const pendingTasks = tasks.filter((task) => task.status === 'Pending').length;
  const inProgressTasks = tasks.filter((task) => task.status === 'In Progress').length;
  
  // A task is overdue if the deadline has passed and it is not completed
  const overdueTasks = tasks.filter((task) => {
    const isPastDeadline = new Date(task.deadline) < new Date();
    const isNotCompleted = task.status !== 'Completed';
    return isPastDeadline && isNotCompleted;
  }).length;

  // Show a loading state while fetching data
  if (loading) {
    return <div className="p-6 text-xl text-center text-gray-600">Loading your dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        {user?.role === 'Admin' ? 'Company Overview' : 'My Workspace'}
      </h1>

      {/* Display any error messages */}
      {error && <div className="p-4 text-red-700 bg-red-100 rounded">{error}</div>}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Tasks Card */}
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
          <p className="mt-2 text-3xl font-bold text-gray-800">{totalTasks}</p>
        </div>

        {/* Pending / In Progress Card */}
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-blue-500">Active Tasks</h3>
          <p className="mt-2 text-3xl font-bold text-blue-700">
            {pendingTasks + inProgressTasks}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {pendingTasks} Pending, {inProgressTasks} In Progress
          </p>
        </div>

        {/* Completed Tasks Card */}
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-green-500">Completed</h3>
          <p className="mt-2 text-3xl font-bold text-green-700">{completedTasks}</p>
        </div>

        {/* Overdue Tasks Card */}
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-red-500">Overdue</h3>
          <p className="mt-2 text-3xl font-bold text-red-700">{overdueTasks}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;