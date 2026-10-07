import * as paymentService from '../services/payment.service.js';

export const processPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const customerId = req.user.userId;

    const result = await paymentService.processSimulatedPayment(bookingId, customerId);

    return res.status(200).json({
      success: true,
      message: 'Payment simulated successfully. Booking marked as completed.',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Payment simulation failed.'
    });
  }
};

export const getPaymentByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.userId;

    const payment = await paymentService.getPaymentByBookingId(bookingId, userId);

    return res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message || 'Payment record not found.'
    });
  }
};
