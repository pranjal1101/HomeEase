import Booking from '../models/booking.model.js';
import Payment from '../models/payment.model.js';
import Service from '../models/service.model.js';
import { BOOKING_STATUS } from '../constants.js';
import { createNotification } from './notification.service.js';

export const processSimulatedPayment = async (bookingId, customerId) => {
  const booking = await Booking.findById(bookingId)
    .populate('userId')
    .populate('serviceId');

  if (!booking) {
    throw new Error('Booking not found.');
  }

  const bookingCustomerId = booking.userId?._id
    ? booking.userId._id.toString()
    : booking.userId?.toString();

  if (bookingCustomerId !== customerId.toString()) {
    throw new Error('Unauthorized. You can only make payments for your own bookings.');
  }

  if (booking.status !== BOOKING_STATUS.PAYMENT_PENDING && booking.status !== 'Payment Pending') {
    if (booking.status === BOOKING_STATUS.COMPLETED || booking.paymentStatus === 'Paid') {
      throw new Error('This booking has already been paid and completed.');
    }
    throw new Error(`Payment is not allowed for booking in '${booking.status}' status. Service must be marked completed first.`);
  }

  if (booking.paymentStatus === 'Paid') {
    throw new Error('Payment has already been completed for this booking.');
  }

  const amount = booking.serviceId?.price || 0;
  const providerId = booking.serviceId?.providerId || null;
  const paidAt = new Date();

  // Create or update payment record
  let payment = await Payment.findOne({ bookingId: booking._id });
  if (payment) {
    payment.status = 'Paid';
    payment.paidAt = paidAt;
    payment.amount = amount;
    payment.providerId = providerId;
    await payment.save();
  } else {
    payment = new Payment({
      bookingId: booking._id,
      customerId,
      providerId,
      amount,
      status: 'Paid',
      paidAt
    });
    await payment.save();
  }

  // Update booking status
  booking.status = BOOKING_STATUS.COMPLETED;
  booking.paymentStatus = 'Paid';
  booking.paidAt = paidAt;
  await booking.save();

  // Notify Provider
  if (providerId) {
    await createNotification({
      userId: providerId,
      title: 'Payment Received',
      message: `Payment received — ₹${amount} for ${booking.serviceId?.serviceName || 'service'}.`,
      type: 'PAYMENT',
      bookingId: booking._id
    });
  }

  // Notify Customer
  await createNotification({
    userId: customerId,
    title: 'Payment Successful',
    message: `Payment successful — ₹${amount} for ${booking.serviceId?.serviceName || 'service'}. Booking completed.`,
    type: 'PAYMENT',
    bookingId: booking._id
  });

  const updatedBooking = await Booking.findById(booking._id)
    .populate({ path: 'userId', select: 'name email phone' })
    .populate({ path: 'serviceId', select: 'serviceName category price' })
    .lean();

  return {
    payment: payment.toObject ? payment.toObject() : payment,
    booking: updatedBooking
  };
};

export const getPaymentByBookingId = async (bookingId, userId) => {
  const payment = await Payment.findOne({ bookingId }).lean();
  return payment;
};
