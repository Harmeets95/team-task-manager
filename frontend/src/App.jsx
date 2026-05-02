// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './src/pages/Login';
import ProtectedRoute from './src/components/ProtectedRoute';
import Layout from './src/components/Layout';
import Dashboard from './src/pages/Dashboard';
import Projects from './src/pages/Projects';
import CreateProject from './src/pages/CreateProject';
import Tasks from './src/pages/Tasks';
import CreateTask from './src/pages/CreateTask';


// Mock components (we will build the real ones next!)
const NotFound = () => <div className="p-10 text-2xl font-bold text-center text-red-500">404 - Page Not Found</div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes wrapped in Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/new" element={<CreateProject />} /> {/* NEW ROUTE */}
            <Route path="/tasks" element={<Tasks />} /> {/* Real Tasks route! */}
            <Route path="/tasks/new" element={<CreateTask />} /> {/* NEW ROUTE */}
          </Route>
        </Route>

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Catch-all for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;