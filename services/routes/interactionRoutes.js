const express = require('express');
const router = express.Router();
const interactionController = require('../controllers/interactionController');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all interactions for the user
router.get('/', authMiddleware, interactionController.getAllInteractions);

// Get interactions for a specific contact
router.get('/:contactId', authMiddleware, interactionController.getInteractionsByContact);

// Create a new interaction
router.post('/', authMiddleware, interactionController.createInteraction);

// Update an interaction
router.put('/:id', authMiddleware, interactionController.updateInteraction);

// Delete an interaction
router.delete('/:id', authMiddleware, interactionController.deleteInteraction);

// Get a single interaction by ID
router.get('/single/:id', authMiddleware, interactionController.getInteractionById);

module.exports = router; 