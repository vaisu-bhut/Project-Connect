const express = require('express');
const router = express.Router();
const interactionController = require('../controllers/interactionController');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

router.get('/', interactionController.getAllInteractions);
router.get('/:contactId', interactionController.getInteractionsByContact);
router.post('/', interactionController.createInteraction);
router.put('/:id', interactionController.updateInteraction);
router.delete('/:id', interactionController.deleteInteraction);
router.get('/single/:id', interactionController.getInteractionById);

module.exports = router; 