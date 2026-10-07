import express from 'express';
import { processPayment, getPaymentByBooking } from '../controllers/payment.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/pay/:bookingId', processPayment);
router.get('/booking/:bookingId', getPaymentByBooking);

export default router;
