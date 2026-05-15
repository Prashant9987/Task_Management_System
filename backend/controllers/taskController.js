const Task = require('../models/Task');
const Project = require('../models/Project');

// Create Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, priority, dueDate } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ success: false, message: 'Please provide title and projectId' });
    }

    // Verify project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const task = await Task.create({
      title,
      description,
      projectId,
      assignedTo,
      priority,
      dueDate
    });

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Tasks for Project
exports.getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Find the project and check if user has access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check access: admin can see all, members can see only their projects
    if (req.user.role !== 'admin') {
      const isMember = project.members.some(memberId => memberId.toString() === req.user._id.toString());
      if (!isMember) {
        return res.status(403).json({ success: false, message: 'You do not have access to this project' });
      }
    }

    const tasks = await Task.find({ projectId }).populate('assignedTo', 'name email');

    res.status(200).json({
      success: true,
      data: tasks
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get User's Assigned Tasks
exports.getAssignedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id }).populate('projectId', 'name').populate('assignedTo', 'name email');

    res.status(200).json({
      success: true,
      data: tasks
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Task Status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['To Do', 'In Progress', 'Done'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, priority, dueDate, assignedTo, updatedAt: Date.now() },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const toDoTasks = await Task.countDocuments({ status: 'To Do' });
    const inProgressTasks = await Task.countDocuments({ status: 'In Progress' });
    const doneTasks = await Task.countDocuments({ status: 'Done' });

    const overdutasks = await Task.find({
      dueDate: { $lt: new Date() },
      status: { $ne: 'Done' }
    }).countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        toDoTasks,
        inProgressTasks,
        doneTasks,
        overdutasks
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
