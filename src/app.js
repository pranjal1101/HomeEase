import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import serviceRoutes from './routes/service.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import aiRoutes from './routes/ai.routes.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

const app = express();

// Standard Middlewares & Configured CORS for production Vercel frontend
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount Routes
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/ai', aiRoutes);

// Welcome Route / Healthcheck
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the HomeEase API - Home Services Booking Platform'
  });
});

// Global Error Handler (must be registered last)
app.use(errorHandler);

export default app;
