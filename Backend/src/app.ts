import express from 'express';
import mongoose from 'mongoose';
import interactionRoutes from './routes/interactionRoutes';
import fileRoutes from './routes/fileRoutes';

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/project-connect');

app.use(express.json());

// Routes
app.use('/api/interactions', interactionRoutes);
app.use('/api/files', fileRoutes);

export default app; 