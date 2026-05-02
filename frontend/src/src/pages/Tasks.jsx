// frontend/src/pages/Tasks.jsx
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { Link } from 'react-router-dom'

const Tasks = () => {
    const { user } = useContext(AuthContext);

    // State variables
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState(null); // Tracks which task is currently being updated

    // Fetch tasks when the page loads
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await API.get('/tasks');
                setTasks(response.data);
            } catch (err) {
                setError('Failed to load tasks. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    // Handle updating the task status
    const handleStatusChange = async (taskId, newStatus) => {
        setUpdatingId(taskId);
        setError('');

        try {
            // 1. Call the backend API to update the status
            const response = await API.patch(`/tasks/${taskId}`, { status: newStatus });

            // 2. Update the local state so the UI reflects the change immediately
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === taskId ? { ...task, status: response.data.status } : task
                )
            );
        } catch (err) {
            setError('Failed to update task status.');
            console.error(err);
        } finally {
            setUpdatingId(null);
        }
    };

    // Helper function to color-code statuses
    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'text-green-700 bg-green-100 border-green-200';
            case 'In Progress': return 'text-blue-700 bg-blue-100 border-blue-200';
            default: return 'text-yellow-700 bg-yellow-100 border-yellow-200';
        }
    };

    // Show loading screen
    if (loading) {
        return <div className="p-6 text-xl text-center text-gray-600">Loading tasks...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-800">
                    {user?.role === 'Admin' ? 'All Team Tasks' : 'My Assigned Tasks'}
                </h1>
                {user?.role === 'Admin' && (
                    <Link
                        to="/tasks/new"
                        className="px-4 py-2 font-semibold text-white transition bg-blue-600 rounded hover:bg-blue-700"
                    >
                        + New Task
                    </Link>
                )}
            </div>

            {/* Error Message */}
            {error && <div className="p-4 text-red-700 bg-red-100 rounded">{error}</div>}

            {/* Tasks Display */}
            {tasks.length === 0 && !error ? (
                <div className="p-8 text-center text-gray-500 bg-white border border-gray-100 rounded-lg">
                    No tasks found. You're all caught up!
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {tasks.map((task) => (
                        <div key={task._id} className="flex flex-col p-6 transition-shadow bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md">

                            <div className="flex items-start justify-between mb-4">
                                <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
                                {/* Status Dropdown */}
                                <select
                                    value={task.status}
                                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                    disabled={updatingId === task._id}
                                    className={`text-sm font-medium px-2 py-1 rounded border outline-none cursor-pointer ${getStatusColor(task.status)} ${updatingId === task._id ? 'opacity-50' : ''}`}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>

                            <p className="flex-1 text-gray-600">{task.description || 'No description provided.'}</p>

                            <div className="pt-4 mt-4 space-y-2 text-sm text-gray-500 border-t border-gray-100">
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-700">Project:</span>
                                    <span>{task.project?.name || 'Unknown Project'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-700">Deadline:</span>
                                    <span className={new Date(task.deadline) < new Date() && task.status !== 'Completed' ? 'text-red-600 font-semibold' : ''}>
                                        {new Date(task.deadline).toLocaleDateString()}
                                    </span>
                                </div>
                                {/* If Admin, show who is assigned */}
                                {user?.role === 'Admin' && (
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-700">Assigned To:</span>
                                        <span>{task.assignedTo?.name || 'Unassigned'}</span>
                                    </div>
                                )}
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Tasks;