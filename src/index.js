import 'dotenv/config';
import connectDB from './config/db.js';
import app from './app.js';

// Define port
const PORT = process.env.PORT || 5000;

// Connect to MongoDB then listen
connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error(`MongoDB connection failed: ${error.message}`);
});

