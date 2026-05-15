import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectAPI, taskAPI, userAPI } from '../api';
import { AuthContext } from '../context/AuthContext';

export const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    assignedTo: ''
  });

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  useEffect(() => {
    if (showMemberForm) {
      fetchAvailableUsers();
    }
  }, [showMemberForm]);

  const fetchAvailableUsers = async () => {
    try {
      const res = await userAPI.getAll();
      const users = res.data.data;
      // Filter out users already in the project
      const filtered = users.filter(
        u => !project?.members?.some(m => m._id === u._id)
      );
      setAvailableUsers(filtered);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const fetchProjectDetails = async () => {
    try {
      const projRes = await projectAPI.getById(id);
      setProject(projRes.data.data);

      const tasksRes = await taskAPI.getProjectTasks(id);
      setTasks(tasksRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await taskAPI.create({
        ...taskForm,
        projectId: id
      });
      setTaskForm({ title: '', description: '', priority: 'Medium', assignedTo: '' });
      setShowTaskForm(false);
      fetchProjectDetails();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.updateStatus(taskId, { status: newStatus });
      fetchProjectDetails();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      if (!selectedUserId) {
        alert('Please select a member to add');
        return;
      }

      await projectAPI.addMember({
        projectId: id,
        userId: selectedUserId
      });
      
      setSelectedUserId('');
      setShowMemberForm(false);
      fetchProjectDetails();
      alert('Member added successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to add member');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    
    try {
      await projectAPI.removeMember({
        projectId: id,
        userId: memberId
      });
      fetchProjectDetails();
      alert('Member removed successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to remove member');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  const todoTasks = tasks.filter(t => t.status === 'To Do');
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
  const doneTasks = tasks.filter(t => t.status === 'Done');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-blue-300 hover:text-white mb-2 text-sm"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold">{project?.name}</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Project Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-600 mb-4">{project?.description}</p>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Members: {project?.members?.length || 0}</span>
                {project?.createdBy && (
                  <span className="text-sm text-gray-500">Created by: {project.createdBy.name}</span>
                )}
              </div>
            </div>
            {user?.role === 'admin' && (
              <button
                onClick={() => setShowMemberForm(!showMemberForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition text-sm"
              >
                + Add Member
              </button>
            )}
          </div>

          {/* Members List */}
          {project?.members && project.members.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-gray-800 mb-3">Team Members</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {project.members.map(member => (
                  <div key={member._id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                    <div>
                      <p className="font-medium text-gray-800">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                    {user?.role === 'admin' && member._id !== project.createdBy._id && (
                      <button
                        onClick={() => handleRemoveMember(member._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Member Form */}
          {showMemberForm && user?.role === 'admin' && (
            <form onSubmit={handleAddMember} className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-gray-800 mb-3">Add Team Member</h3>
              <div className="flex gap-2">
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a member to add...</option>
                  {availableUsers.map(availUser => (
                    <option key={availUser._id} value={availUser._id}>
                      {availUser.name} ({availUser.email})
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                >
                  Add
                </button>
              </div>
              {availableUsers.length === 0 && (
                <p className="text-sm text-orange-600 mt-2">No available members to add. All registered users are already in this project.</p>
              )}
            </form>
          )}
        </div>

        {/* Create Task Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowTaskForm(!showTaskForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            + New Task
          </button>
        </div>

        {/* Create Task Form */}
        {showTaskForm && (
          <form onSubmit={handleCreateTask} className="mb-8 p-6 bg-white rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Task Title"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <select
                value={taskForm.priority}
                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Assign To (Optional)</label>
              <select
                value={taskForm.assignedTo}
                onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a team member</option>
                {project?.members?.map(member => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              placeholder="Description"
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
            >
              Create Task
            </button>
          </form>
        )}

        {/* Tasks Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* To Do Column */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-yellow-500">
              To Do ({todoTasks.length})
            </h3>
            <div className="space-y-3">
              {todoTasks.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-500">
              In Progress ({inProgressTasks.length})
            </h3>
            <div className="space-y-3">
              {inProgressTasks.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </div>

          {/* Done Column */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-green-500">
              Done ({doneTasks.length})
            </h3>
            <div className="space-y-3">
              {doneTasks.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskCard = ({ task, onStatusChange }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getNextStatus = (currentStatus) => {
    if (currentStatus === 'To Do') return 'In Progress';
    if (currentStatus === 'In Progress') return 'Done';
    return 'To Do';
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:shadow-md transition">
      <h4 className="font-semibold text-gray-800 mb-2">{task.title}</h4>
      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
      
      {/* Assigned Member */}
      {task.assignedTo && (
        <div className="mb-3 pb-2 border-b border-gray-300">
          <p className="text-xs text-gray-500">
            <span className="font-semibold text-blue-600">Assigned to:</span> {task.assignedTo.name}
          </p>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded font-semibold ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        <button
          onClick={() => onStatusChange(task._id, getNextStatus(task.status))}
          className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded transition"
        >
          Move →
        </button>
      </div>
    </div>
  );
};

export default ProjectDetail;
