import Booking from '../models/booking.model.js';
import User from '../models/user.model.js';
import Service from '../models/service.model.js';
import { createNotification } from './notification.service.js';

export const createBooking = async (bookingData) => {
  const userExists = await User.findById(bookingData.userId).lean();
  if (!userExists) {
    throw new Error('User not found. Cannot create booking.');
  }

  const serviceExists = await Service.findById(bookingData.serviceId).lean();
  if (!serviceExists) {
    throw new Error('Service not found. Cannot create booking.');
  }
  if (!serviceExists.availability) {
    throw new Error('Service is currently unavailable.');
  }

  const newBooking = new Booking(bookingData);
  const savedBooking = await newBooking.save();
  
  const populated = await savedBooking.populate([
    { path: 'userId', select: 'name email phone address' },
    { 
      path: 'serviceId', 
      select: 'serviceName category price providerId image',
      populate: { path: 'providerId', select: 'name email phone address avatar' }
    }
  ]);

  if (serviceExists.providerId) {
    await createNotification({
      userId: serviceExists.providerId,
      title: 'New Booking Request',
      message: `New booking request from ${userExists.name || 'Customer'} for ${serviceExists.serviceName}.`,
      type: 'BOOKING',
      bookingId: savedBooking._id
    });
  }

  return populated.toObject();
};

export const getAllBookings = async (filters = {}) => {
  const query = {};
  
  if (filters.userId) query.userId = filters.userId;
  if (filters.serviceId) query.serviceId = filters.serviceId;
  if (filters.status) query.status = filters.status;

  return await Booking.find(query)
    .sort({ createdAt: -1 })
    .populate({ path: 'userId', select: 'name email phone address' })
    .populate({ 
      path: 'serviceId', 
      select: 'serviceName category price providerId image',
      populate: { path: 'providerId', select: 'name email phone address avatar' }
    })
    .lean();
};

export const getBookingById = async (id) => {
  const booking = await Booking.findById(id)
    .populate({ path: 'userId', select: 'name email phone address' })
    .populate({ 
      path: 'serviceId', 
      select: 'serviceName category price providerId image',
      populate: { path: 'providerId', select: 'name email phone address avatar' }
    })
    .lean();
    
  if (!booking) {
    throw new Error('Booking not found');
  }
  return booking;
};

export const updateBooking = async (id, updateData) => {
  const updatedBooking = await Booking.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate({ path: 'userId', select: 'name email phone address' })
    .populate({ 
      path: 'serviceId', 
      select: 'serviceName category price providerId image',
      populate: { path: 'providerId', select: 'name email phone address avatar' }
    })
    .lean();

  if (!updatedBooking) {
    throw new Error('Booking not found');
  }
  return updatedBooking;
};

export const deleteBooking = async (id) => {
  const deletedBooking = await Booking.findByIdAndDelete(id)
    .populate({ path: 'userId', select: 'name email phone address' })
    .populate({ 
      path: 'serviceId', 
      select: 'serviceName category price providerId image',
      populate: { path: 'providerId', select: 'name email phone address avatar' }
    })
    .lean();
    
  if (!deletedBooking) {
    throw new Error('Booking not found');
  }
  return deletedBooking;
};
