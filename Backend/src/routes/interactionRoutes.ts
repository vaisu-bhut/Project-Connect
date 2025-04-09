import express from 'express';
import { interactionController } from '../controllers/interactionController';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Create a new interaction
router.post('/', upload.array('attachments'), interactionController.create);

// Get all interactions for a contact
router.get('/contact/:contactId', interactionController.getByContact);

// Get a single interaction
router.get('/:id', interactionController.getOne);

// Update an interaction
router.put('/:id', upload.array('attachments'), interactionController.update);

// Delete an interaction
router.delete('/:id', interactionController.delete);

export default router; 