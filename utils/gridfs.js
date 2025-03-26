import { connection } from './db';
import { GridFSBucket } from 'mongodb';

let gridfsBucket;

connection.once('open', () => {
  gridfsBucket = new GridFSBucket(connection.db, { bucketName: 'uploads' });
  console.log('GridFSBucket initialized');
});

export function getGridFsBucket() {
  if (!gridfsBucket) {
    throw new Error('GridFSBucket is not initialized. Ensure MongoDB is connected.');
  }
  return gridfsBucket;
}