const express = require('express');
const router = express.Router();
const interactionController = require('../controllers/interactionController');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Get interactions for a specific contact
router.get('/contact/:contactId', interactionController.getInteractionsByContact);

// Create a new interaction
router.post('/', interactionController.createInteraction);

// Update an interaction
router.put('/:id', interactionController.updateInteraction);

// Delete an interaction
router.delete('/:id', interactionController.deleteInteraction);

module.exports = router; 