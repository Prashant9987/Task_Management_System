const express = require('express');
const router = express.Router();
const { 
  createTask,
  getProjectTasks,
  getAssignedTasks,
  updateTaskStatus,
  updateTask,
  deleteTask,
  getDashboardStats
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

// Protect all routes with authentication
router.use(protect);

router.get('/user/assigned', getAssignedTasks);
router.get('/dashboard/stats', getDashboardStats);
router.post('/', createTask);
router.get('/project/:projectId', getProjectTasks);
router.patch('/:id/status', updateTaskStatus);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
