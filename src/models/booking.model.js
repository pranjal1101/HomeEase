import mongoose from 'mongoose';
import { BOOKING_STATUS } from '../constants.js';

const BookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Service ID is required']
    },
    bookingDate: {
      type: Date,
      required: [true, 'Booking date is required']
    },
    bookingTime: {
      type: String,
      required: [true, 'Booking time is required'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Service address is required'],
      trim: true
    },
    status: {
      type: String,
      enum: {
        values: Object.values(BOOKING_STATUS),
        message: '{VALUE} is not a valid status'
      },
      default: BOOKING_STATUS.PENDING
    }
  },
  {
    timestamps: true
  }
);

const Booking = mongoose.model('Booking', BookingSchema);

export default Booking;
