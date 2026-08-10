import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';

// Load environment variables
dotenv.config();

// Define port
const PORT = process.env.PORT || 5000;

// Connect to MongoDB then listen
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error(`MongoDB connection failed: ${error.message}`);
});

// HomeEase server entry point
