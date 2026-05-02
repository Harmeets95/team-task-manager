// backend/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTaskStatus } = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(authorize('Admin'), createTask); // Only admins can create tasks

router.route('/:id')
  .patch(updateTaskStatus); // Both roles can update status (handled in controller logic)

module.exports = router;