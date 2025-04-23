const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Contact routes
router.get('/', contactController.getAllContacts);
router.get('/:id', contactController.getContact);
router.post('/', contactController.createContact);
router.put('/:id', contactController.updateContact);
router.delete('/:id', contactController.deleteContact);

module.exports = router; 