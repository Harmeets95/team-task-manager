// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Any route below this will require the user to be logged in
router.use(protect);

// Only allow users with the 'Admin' role to access the GET /api/users route
router.route('/').get(authorize('Admin'), getUsers);

module.exports = router;