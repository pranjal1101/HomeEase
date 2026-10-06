import express from 'express';
import { authenticate, requireProvider } from '../middlewares/auth.middleware.js';
import {
  getDashboard,
  getServices,
  createService,
  updateService,
  deleteService,
  getBookings,
  updateBookingStatus,
  getEarnings,
  updateProfile
} from '../controllers/provider.controller.js';

const router = express.Router();

router.use(authenticate, requireProvider);

router.get('/dashboard', getDashboard);
router.get('/services', getServices);
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);
router.get('/bookings', getBookings);
router.put('/bookings/:id/status', updateBookingStatus);
router.get('/earnings', getEarnings);
router.put('/profile', updateProfile);

export default router;
