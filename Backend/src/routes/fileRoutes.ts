import express from 'express';
import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';

const router = express.Router();
const conn = mongoose.connection;
let gfs: GridFSBucket;

conn.once('open', () => {
  gfs = new GridFSBucket(conn.db, {
    bucketName: 'interactions'
  });
});

router.get('/:fileId', async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);
    const file = await gfs.find({ _id: fileId }).toArray();
    
    if (!file || file.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Set the appropriate content type
    res.set('Content-Type', file[0].contentType || 'application/octet-stream');
    
    // Stream the file
    const downloadStream = gfs.openDownloadStream(fileId);
    downloadStream.pipe(res);
    
    downloadStream.on('error', (error) => {
      console.error('Error streaming file:', error);
      res.status(500).json({ error: 'Error streaming file' });
    });
  } catch (error) {
    console.error('Error handling file request:', error);
    res.status(400).json({ error: 'Invalid file ID' });
  }
});

export default router; 