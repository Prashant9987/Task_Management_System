const Project = require('../models/Project');
const User = require('../models/User');

// Create Project (Admin Only)
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Please provide project name' });
    }

    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      members: [req.user._id]
    });

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get All Projects (User can see own/assigned projects)
exports.getAllProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'admin') {
      projects = await Project.find().populate('createdBy members', 'name email role');
    } else {
      projects = await Project.find({ members: req.user._id }).populate('createdBy members', 'name email role');
    }

    res.status(200).json({
      success: true,
      data: projects
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Single Project
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('createdBy members', 'name email role');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && !project.members.includes(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this project' });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Add Member to Project (Admin Only)
exports.addMember = async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    if (!projectId || !userId) {
      return res.status(400).json({ success: false, message: 'Please provide projectId and userId' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (project.members.includes(userId)) {
      return res.status(400).json({ success: false, message: 'User already a member' });
    }

    project.members.push(userId);
    await project.save();

    res.status(200).json({
      success: true,
      data: project,
      message: 'Member added successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Remove Member from Project (Admin Only)
exports.removeMember = async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    if (!projectId || !userId) {
      return res.status(400).json({ success: false, message: 'Please provide projectId and userId' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    project.members = project.members.filter(member => member.toString() !== userId);
    await project.save();

    res.status(200).json({
      success: true,
      data: project,
      message: 'Member removed successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete Project (Admin Only)
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
