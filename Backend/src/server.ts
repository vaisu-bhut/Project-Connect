import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import contactRoutes from './routes/contactRoutes';
import interactionRoutes from './routes/interactionRoutes';
import fileRoutes from './routes/fileRoutes';
import authRoutes from './routes/auth';
import settingsRoutes from './routes/settings';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'https://connect.vasubhut.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Cookie parser
app.use(cookieParser());

// For JSON data
app.use(express.json({ limit: '10mb' })); // Increase limit from default 100kb

// For URL-encoded data (e.g., forms)
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api', fileRoutes);

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/network-nexus';
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 