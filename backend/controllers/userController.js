// backend/controllers/userController.js
const User = require('../models/User');

// @desc    Get all users (for assigning tasks and projects)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    // Fetch all users, but exclude the password field for security
    const users = await User.find({}).select('-password');
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
};