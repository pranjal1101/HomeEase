import * as bookingService from '../services/booking.service.js';

/**
 * Handle request to create a new booking
 */
export const createBooking = async (req, res) => {
  try {
    const booking = await bookingService.createBooking(req.body);
    return res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Handle request to get all bookings (supports filtering by userId, serviceId, and status)
 */
export const getAllBookings = async (req, res) => {
  try {
    const { userId, serviceId, status } = req.query;
    const bookings = await bookingService.getAllBookings({ userId, serviceId, status });
    return res.status(200).json({
      success: true,
      message: 'Bookings fetched successfully',
      data: bookings
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Handle request to retrieve a single booking by ID
 */
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await bookingService.getBookingById(id);
    return res.status(200).json({
      success: true,
      message: 'Booking details fetched successfully',
      data: booking
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Handle booking update request
 */
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBooking = await bookingService.updateBooking(id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: updatedBooking
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Handle booking deletion request
 */
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBooking = await bookingService.deleteBooking(id);
    return res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
      data: deletedBooking
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
