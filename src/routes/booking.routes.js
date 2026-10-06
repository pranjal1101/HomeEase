import express from 'express';
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking
} from '../controllers/booking.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authenticate, createBooking);
router.get('/', authenticate, getAllBookings);
router.get('/:id', authenticate, getBookingById);
router.put('/:id', authenticate, updateBooking);
router.delete('/:id', authenticate, deleteBooking);

export default router;
