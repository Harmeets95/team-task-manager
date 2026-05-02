// frontend/src/pages/Projects.jsx
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { Link } from 'react-router-dom';

const Projects = () => {
    const { user } = useContext(AuthContext);

    // State variables for managing our projects data
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch projects from the backend when the component loads
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await API.get('/projects');
                setProjects(response.data);
            } catch (err) {
                setError('Failed to load projects. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Display a loading message while data is being fetched
    if (loading) {
        return <div className="p-6 text-xl text-center text-gray-600">Loading projects...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Page Header Area */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-800">Projects</h1>

                {/* Only Admins can see the Create Project button */}
                {user?.role === 'Admin' && (
                    <Link
                        to="/projects/new"
                        className="px-4 py-2 font-semibold text-white transition bg-blue-600 rounded hover:bg-blue-700"
                    >
                        + New Project
                    </Link>
                )}
            </div>

            {/* Error Message Display */}
            {error && <div className="p-4 text-red-700 bg-red-100 rounded">{error}</div>}

            {/* Projects Grid Display */}
            {projects.length === 0 && !error ? (
                <div className="p-8 text-center text-gray-500 bg-white rounded-lg border border-gray-100">
                    No projects found. {user?.role === 'Admin' ? 'Create one to get started!' : 'Wait for an Admin to assign you to a project.'}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <div key={project._id} className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
                            <p className="mt-2 text-gray-600 line-clamp-3">{project.description}</p>

                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                                <span>{project.members?.length || 0} Members</span>
                                <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Projects;