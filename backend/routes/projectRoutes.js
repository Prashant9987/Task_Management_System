const express = require('express');
const router = express.Router();
const { 
  createProject, 
  getAllProjects, 
  getProject,
  addMember,
  removeMember,
  deleteProject 
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');

// Protect all routes with authentication
router.use(protect);

router.get('/', getAllProjects);
router.post('/', authorize('admin'), createProject);
router.get('/:id', getProject);
router.post('/members/add', authorize('admin'), addMember);
router.post('/members/remove', authorize('admin'), removeMember);
router.delete('/:id', authorize('admin'), deleteProject);

module.exports = router;
