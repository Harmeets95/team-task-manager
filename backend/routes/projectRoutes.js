// backend/routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const { createProject, getProjects } = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Protect all routes below this line
router.use(protect); 

// Only Admins can POST (create) a project. Both roles can GET projects.
router.route('/')
  .get(getProjects)
  .post(authorize('Admin'), createProject);

module.exports = router;