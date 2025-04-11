import { Request, Response } from 'express';
import Interaction, { IInteraction } from '../models/Interaction';
import { createError } from '../utils/errorHandler';
import mongoose from 'mongoose';

interface Attachment {
  name: string;
  path: string;
  type: string;
}

export const interactionController = {
  // Get all interactions
  async getAll(req: Request, res: Response) {
    try {
      const interactions = await Interaction.find().sort({ date: -1 });
      res.json(interactions);
    } catch (error) {
      res.status(400).json(createError('Failed to fetch interactions', error));
    }
  },

  // Create a new interaction
  async create(req: Request, res: Response) {
    try {
      const { userId, contactIds, type, title, date, time, notes, location, reminders } = req.body;
      
      // Validate required fields
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json(createError('Invalid user ID'));
      }

      if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
        return res.status(400).json(createError('At least one contact ID is required'));
      }

      // Validate each contact ID
      for (const contactId of contactIds) {
        if (!mongoose.Types.ObjectId.isValid(contactId)) {
          return res.status(400).json(createError('Invalid contact ID in the list'));
        }
      }

      // Handle file uploads if any
      let attachments: Attachment[] = [];
      if (req.files && Array.isArray(req.files)) {
        const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
          bucketName: 'interactions'
        });

        attachments = await Promise.all(req.files.map(async (file) => {
          const fileId = new mongoose.Types.ObjectId();
          const uploadStream = gfs.openUploadStreamWithId(
            fileId,
            file.originalname,
            {
              contentType: file.mimetype,
              metadata: {
                originalName: file.originalname
              }
            }
          );

          return new Promise<Attachment>((resolve, reject) => {
            uploadStream.on('error', reject);
            uploadStream.on('finish', () => {
              resolve({
                name: file.originalname,
                path: `/files/${fileId.toString()}`,
                type: file.mimetype
              });
            });
            uploadStream.end(file.buffer);
          });
        }));
      }

      const interaction = new Interaction({
        userId,
        contactIds,
        type,
        title,
        date,
        time,
        notes,
        location,
        reminders,
        attachments
      });

      await interaction.save();
      res.status(201).json(interaction);
    } catch (error) {
      console.error('Error creating interaction:', error);
      res.status(400).json(createError('Failed to create interaction', error));
    }
  },

  // Get all interactions for a contact
  async getByContact(req: Request, res: Response) {
    try {
      const { contactId } = req.params;
      const interactions = await Interaction.find({ contactId })
        .sort({ date: -1 });
      res.json(interactions);
    } catch (error) {
      res.status(400).json(createError('Failed to fetch interactions', error));
    }
  },

  // Get a single interaction
  async getOne(req: Request, res: Response) {
    try {
      const interaction = await Interaction.findById(req.params.id);
      if (!interaction) {
        return res.status(404).json(createError('Interaction not found'));
      }
      res.json(interaction);
    } catch (error) {
      res.status(400).json(createError('Failed to fetch interaction', error));
    }
  },

  // Update an interaction
  async update(req: Request, res: Response) {
    try {
      const { contactId, type, title, date, time, notes, reminders } = req.body;
      
      // Handle new file uploads if any
      let attachments = undefined;
      if (req.files && Array.isArray(req.files)) {
        const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
          bucketName: 'interactions'
        });

        attachments = await Promise.all(req.files.map(async (file) => {
          const fileId = new mongoose.Types.ObjectId();
          const uploadStream = gfs.openUploadStreamWithId(
            fileId,
            file.originalname,
            {
              contentType: file.mimetype,
              metadata: {
                originalName: file.originalname
              }
            }
          );

          return new Promise<Attachment>((resolve, reject) => {
            uploadStream.on('error', reject);
            uploadStream.on('finish', () => {
              resolve({
                name: file.originalname,
                path: `/files/${fileId.toString()}`,
                type: file.mimetype
              });
            });
            uploadStream.end(file.buffer);
          });
        }));
      }

      const interaction = await Interaction.findByIdAndUpdate(
        req.params.id,
        {
          contactId,
          type,
          title,
          date,
          time,
          notes,
          reminders: JSON.parse(reminders),
          ...(attachments && { attachments })
        },
        { new: true }
      );

      if (!interaction) {
        return res.status(404).json(createError('Interaction not found'));
      }

      res.json(interaction);
    } catch (error) {
      console.error('Error updating interaction:', error);
      res.status(400).json(createError('Failed to update interaction', error));
    }
  },

  // Delete an interaction
  async delete(req: Request, res: Response) {
    try {
      const interaction = await Interaction.findById(req.params.id);
      if (!interaction) {
        return res.status(404).json(createError('Interaction not found'));
      }

      // Delete associated files from GridFS
      if (interaction.attachments && interaction.attachments.length > 0) {
        const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
          bucketName: 'interactions'
        });

        for (const attachment of interaction.attachments) {
          const fileId = new mongoose.Types.ObjectId(attachment.path.split('/').pop());
          await gfs.delete(fileId);
        }
      }

      await interaction.deleteOne();
      res.json({ message: 'Interaction deleted successfully' });
    } catch (error) {
      res.status(400).json(createError('Failed to delete interaction', error));
    }
  },

  // Get all interactions for a user
  async getByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const interactions = await Interaction.find({ userId })
        .sort({ date: -1 });
      res.json(interactions);
    } catch (error) {
      res.status(400).json(createError('Failed to fetch interactions', error));
    }
  }
}; 