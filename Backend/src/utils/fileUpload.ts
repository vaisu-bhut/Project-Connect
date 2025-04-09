import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

interface UploadedFile {
  path: string;
}

const conn = mongoose.connection;
let gfs: GridFSBucket;

conn.once('open', () => {
  gfs = new GridFSBucket(conn.db, {
    bucketName: 'interactions'
  });
});

export const uploadFile = async (file: Express.Multer.File): Promise<UploadedFile> => {
  const fileExtension = file.originalname.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;

  return new Promise((resolve, reject) => {
    const uploadStream = gfs.openUploadStream(fileName, {
      metadata: {
        originalName: file.originalname,
        contentType: file.mimetype
      }
    });

    uploadStream.on('error', (error) => {
      reject(error);
    });

    uploadStream.on('finish', () => {
      resolve({
        path: `/api/files/${fileName}`
      });
    });

    uploadStream.end(file.buffer);
  });
}; 