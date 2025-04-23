const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get user profile
router.get('/profile', authMiddleware, userController.getProfile);

// Update profile details
router.put('/profile', authMiddleware, userController.updateProfile);

// Update notification preferences
router.put('/notifications', authMiddleware, userController.updateNotificationPreferences);

// Update data privacy settings
router.put('/privacy', authMiddleware, userController.updateDataPrivacy);

module.exports = router; 