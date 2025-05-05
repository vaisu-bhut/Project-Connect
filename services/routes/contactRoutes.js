const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// Contact routes
router.get('/', contactController.getAllContacts);
router.get('/:id', contactController.getContact);
router.post('/', contactController.createContact);
router.put('/:id', contactController.updateContact);
router.delete('/:id', contactController.deleteContact);

module.exports = router; 