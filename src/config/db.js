import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
      console.error('FATAL ERROR: MONGODB_URI environment variable is missing on Render!');
      console.error('Please configure the MONGODB_URI environment variable in your Render service Environment tab.');
      process.exit(1);
    }
    console.warn('WARNING: MONGODB_URI environment variable is not defined. Falling back to local MongoDB for development.');
  }

  const connectionString = uri || 'mongodb://127.0.0.1:27017/homeease';

  try {
    const conn = await mongoose.connect(connectionString, { serverSelectionTimeoutMS: 5000 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB Atlas (${error.message}). Trying local database fallback...`);
    try {
      const conn = await mongoose.connect('mongodb://127.0.0.1:27017/homeease', { serverSelectionTimeoutMS: 3000 });
      console.log(`Local MongoDB Connected: ${conn.connection.host}`);
    } catch (localErr) {
      console.warn(`Local MongoDB fallback failed: ${localErr.message}. Starting server in standalone mode.`);
    }
  }
};

export default connectDB;
