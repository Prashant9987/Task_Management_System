import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectAPI, taskAPI } from '../api';
import { AuthContext } from '../context/AuthContext';

export const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [projectForm, setProjectForm] = useState({ name: '', description: '' });
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const projectRes = await projectAPI.getAll();
      setProjects(projectRes.data.data);
      
      const statsRes = await taskAPI.getDashboardStats();
      setStats(statsRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await projectAPI.create(projectForm);
      setProjectForm({ name: '', description: '' });
      setShowCreateProject(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Team Task Manager</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">Welcome, {user?.name}</span>
            <span className="text-xs bg-blue-700 px-3 py-1 rounded">{user?.role?.toUpperCase()}</span>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
              <h3 className="text-gray-500 text-sm">Total Tasks</h3>
              <p className="text-3xl font-bold text-blue-900">{stats.totalTasks}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
              <h3 className="text-gray-500 text-sm">To Do</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats.toDoTasks}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
              <h3 className="text-gray-500 text-sm">In Progress</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.inProgressTasks}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
              <h3 className="text-gray-500 text-sm">Completed</h3>
              <p className="text-3xl font-bold text-green-600">{stats.doneTasks}</p>
            </div>
          </div>
        )}

        {/* Projects Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
            {user?.role === 'admin' && (
              <button
                onClick={() => setShowCreateProject(!showCreateProject)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
              >
                + New Project
              </button>
            )}
          </div>

          {/* Create Project Form */}
          {showCreateProject && user?.role === 'admin' && (
            <form onSubmit={handleCreateProject} className="mb-6 p-4 bg-blue-50 rounded">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Project Name"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
              >
                Create Project
              </button>
            </form>
          )}

          {/* Projects List */}
          {projects.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No projects yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map(project => (
                <div
                  key={project._id}
                  onClick={() => navigate(`/project/${project._id}`)}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-500 cursor-pointer transition"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{project.members?.length || 0} members</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">View Details</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
