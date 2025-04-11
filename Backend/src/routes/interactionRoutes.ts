import express from 'express';
import { interactionController } from '../controllers/interactionController';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get all interactions
router.get('/', interactionController.getAll);

// Create a new interaction
router.post('/', upload.array('attachments'), interactionController.create);

// Get all interactions for a user's contacts
router.get('/user/:userId', interactionController.getByUser);

// Get all interactions for a specific contact
router.get('/contact/:contactId', interactionController.getByContact);

// Get a single interaction
router.get('/:id', interactionController.getOne);

// Update an interaction
router.put('/:id', upload.array('attachments'), interactionController.update);

// Delete an interaction
router.delete('/:id', interactionController.delete);

export default router; 