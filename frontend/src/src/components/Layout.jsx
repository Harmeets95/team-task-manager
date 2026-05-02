// frontend/src/components/Layout.jsx
import { useContext } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="flex flex-col w-64 text-white bg-gray-800">
        <div className="p-4 text-2xl font-bold border-b border-gray-700">
          Task Manager
        </div>
        <nav className="flex-1 p-4 space-y-2 text-sm font-medium">
          <Link to="/dashboard" className="block p-2 rounded hover:bg-gray-700">
            Dashboard
          </Link>
          <Link to="/projects" className="block p-2 rounded hover:bg-gray-700">
            Projects
          </Link>
          <Link to="/tasks" className="block p-2 rounded hover:bg-gray-700">
            Tasks
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navbar */}
        <header className="flex items-center justify-between p-4 bg-white shadow">
          <div className="text-lg font-semibold text-gray-700">
            Welcome, <span className="text-blue-600">{user?.name}</span> 
            <span className="ml-2 text-sm px-2 py-1 bg-gray-200 rounded-full text-gray-600">
              {user?.role}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white transition bg-red-500 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </header>

        {/* Page Content goes here */}
        <main className="flex-1 p-6 overflow-x-hidden overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;