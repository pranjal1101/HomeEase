import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Booking ID is required']
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer ID is required']
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [0, 'Amount cannot be negative']
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid'],
      default: 'Pending'
    },
    paidAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

const Payment = mongoose.model('Payment', PaymentSchema);

export default Payment;
