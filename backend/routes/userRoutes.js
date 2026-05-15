const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin'), getAllUsers);

module.exports = router;
