import mongoose from 'mongoose';

export async function connect() {
  if (mongoose.connections[0].readyState) {
    return; // Already connected
  }

  try {
    await mongoose.connect(process.env.MONGO_URI); // No need for deprecated options
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection failed', error);
    throw new Error('Database connection failed');
  }
}