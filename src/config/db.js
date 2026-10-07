import mongoose from 'mongoose';
import dns from 'dns';

// Set Google/Cloudflare DNS servers to reliably resolve MongoDB Atlas SRV records
// across all Windows/local/cloud environments where ISP DNS may fail with ECONNREFUSED
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore error if custom DNS cannot be set in restricted environments
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('FATAL ERROR: MONGODB_URI environment variable is missing!');
    console.error('Please configure MONGODB_URI in your environment or .env file.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`MongoDB Connected Successfully: ${conn.connection.host} (Database: ${conn.connection.name})`);
  } catch (error) {
    console.error(`FATAL ERROR: Failed to connect to MongoDB Atlas (${error.message}).`);
    console.error('Server cannot start without a valid persistent MongoDB database connection.');
    process.exit(1);
  }
};

export default connectDB;
