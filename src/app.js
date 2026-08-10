import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import serviceRoutes from './routes/service.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

const app = express();

// Standard Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount Routes
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);

// Welcome Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the HomeEase API - Home Services Booking Platform'
  });
});

// Global Error Handler (must be registered last)
app.use(errorHandler);

export default app;

// HomeEase application configuration
