import Booking from '../models/booking.model.js';
import User from '../models/user.model.js';
import Service from '../models/service.model.js';

/**
 * Create a new booking
 * @param {Object} bookingData 
 * @returns {Promise<Object>}
 */
export const createBooking = async (bookingData) => {
  // Validate that the user exists
  const userExists = await User.findById(bookingData.userId).lean();
  if (!userExists) {
    throw new Error('User not found. Cannot create booking.');
  }

  // Validate that the service exists and is available
  const serviceExists = await Service.findById(bookingData.serviceId).lean();
  if (!serviceExists) {
    throw new Error('Service not found. Cannot create booking.');
  }
  if (!serviceExists.availability) {
    throw new Error('Service is currently unavailable.');
  }

  const newBooking = new Booking(bookingData);
  const savedBooking = await newBooking.save();
  
  // Return booking populated with user and service details as plain object
  const populated = await savedBooking.populate([
    { path: 'userId', select: 'name email phone' },
    { path: 'serviceId', select: 'serviceName category price' }
  ]);
  return populated.toObject();
};

/**
 * Get all bookings with newest first sorting and optional filtering
 * @param {Object} filters 
 * @returns {Promise<Array>}
 */
export const getAllBookings = async (filters = {}) => {
  const query = {};
  
  if (filters.userId) query.userId = filters.userId;
  if (filters.serviceId) query.serviceId = filters.serviceId;
  if (filters.status) query.status = filters.status;

  return await Booking.find(query)
    .sort({ createdAt: -1 })
    .populate({ path: 'userId', select: 'name email phone' })
    .populate({ path: 'serviceId', select: 'serviceName category price' })
    .lean();
};

/**
 * Get booking details by ID
 * @param {string} id 
 * @returns {Promise<Object>}
 */
export const getBookingById = async (id) => {
  const booking = await Booking.findById(id)
    .populate({ path: 'userId', select: 'name email phone' })
    .populate({ path: 'serviceId', select: 'serviceName category price' })
    .lean();
    
  if (!booking) {
    throw new Error('Booking not found');
  }
  return booking;
};

/**
 * Update booking status or other parameters
 * @param {string} id 
 * @param {Object} updateData 
 * @returns {Promise<Object>}
 */
export const updateBooking = async (id, updateData) => {
  const updatedBooking = await Booking.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate({ path: 'userId', select: 'name email phone' })
    .populate({ path: 'serviceId', select: 'serviceName category price' })
    .lean();

  if (!updatedBooking) {
    throw new Error('Booking not found');
  }
  return updatedBooking;
};

/**
 * Delete a booking
 * @param {string} id 
 * @returns {Promise<Object>}
 */
export const deleteBooking = async (id) => {
  const deletedBooking = await Booking.findByIdAndDelete(id)
    .populate({ path: 'userId', select: 'name email phone' })
    .populate({ path: 'serviceId', select: 'serviceName category price' })
    .lean();
    
  if (!deletedBooking) {
    throw new Error('Booking not found');
  }
  return deletedBooking;
};
